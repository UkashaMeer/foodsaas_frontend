"use client"
import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react'
import { ChevronRight, MapPin, Phone, User, CreditCard, Wallet, Check, Clock, Package, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getAllCartItems } from '@/api/user/cart/getAllCartItems';
import { usePlaceOrder } from '@/api/user/checkout/usePlaceOrder';
import { useConfirmPayment } from '@/api/user/checkout/useConfirmPayment';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartState } from '@/store/useCartState';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRequireAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Stripe Card Form Component
function StripeCardForm({ paymentMethod, onCardReady }) {
    const elements = useElements();
    const [cardComplete, setCardComplete] = useState(false);

    const handleCardChange = (event) => {
        const isComplete = event.complete;
        setCardComplete(isComplete);
        if (onCardReady) {
            onCardReady(isComplete);
        }
    };

    // Only show card form if payment method is 'card'
    if (paymentMethod !== 'card') {
        return null;
    }

    return (
        <div className="space-y-4 mt-6 p-4 border border-border rounded-lg bg-muted/20">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Card Details
            </h3>
            <div className="p-3 border border-border rounded-md bg-background">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: 'hsl(var(--foreground))',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': {
                                    color: 'hsl(var(--muted-foreground))',
                                },
                                padding: '10px',
                            },
                            invalid: {
                                color: 'hsl(var(--destructive))',
                            },
                        },
                    }}
                    onChange={handleCardChange}
                />
            </div>
            {cardComplete && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Card details complete</span>
                </div>
            )}
            <p className="text-xs text-muted-foreground">
                Your card will be charged securely via Stripe
            </p>
        </div>
    );
}

function CheckoutPageContent() {
    const router = useRouter()
    const stripe = useStripe();
    const elements = useElements();
    const { mutate } = getAllCartItems()
    const { setCount } = useCartState()
    const { mutate: placeOrderMutate, isPending } = usePlaceOrder()
    const { mutate: confirmPayment } = useConfirmPayment();

    const [step, setStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [cartItems, setCartItems] = useState([])
    const [userId, setUserId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isCardReady, setIsCardReady] = useState(false)
    const [createdOrder, setCreatedOrder] = useState(null)

    useEffect(() => {
        let guestId = null
        const token = typeof window !== "undefined" && localStorage.getItem("token")

        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUserId(decoded?._id)
                localStorage.removeItem("guestId")
            } catch (err) {
                console.error("JWT Decode Error: ", err)
            }
        } else {
            guestId = localStorage.getItem("guestId")
            if (!guestId) {
                guestId = uuidv4()
                localStorage.setItem("guestId", guestId)
            }
        }

        const payload = {
            userId: userId,
            guestId: guestId
        }

        mutate(payload, {
            onSuccess: (res) => {
                setCartItems(res?.cartItems)
                setCount(0)
            },
            onError: () => {
                console.error("Something went wrong")
            }
        })
    }, [])

    const subtotal = cartItems.reduce((sum, cart) => {
        const item = cart?.itemId;
        const selectedAddons = cart?.selectedAddons?.flatMap(a => a?.options || []) || [];
        const addonsTotal = selectedAddons.reduce((a, o) => a + (o?.price || 0), 0);
        const itemPrice = item?.isOnDiscount ? item?.discountPrice : item?.price;
        return sum + (itemPrice + addonsTotal) * cart?.quantity;
    }, 0);

    const deliveryFee = 200;
    const total = subtotal + deliveryFee;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        instructions: ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e?.target?.name]: e?.target?.value
        })
    }

    const steps = [
        { id: 1, name: 'Delivery', icon: MapPin },
        { id: 2, name: 'Payment', icon: Wallet },
        { id: 3, name: 'Review', icon: Package }
    ]

    const handlePlaceOrder = async () => {
        try {
            setIsProcessing(true);

            // Clean phone number - remove all non-numeric characters
            const cleanPhoneNumber = formData.phone.replace(/\D/g, '');

            const payload = {
                userId,
                fullName: formData.name,
                phoneNumber: cleanPhoneNumber,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                instructions: formData.instructions,
                paymentMethod,
                deliveryFee,
                items: cartItems.map(cart => ({
                    itemId: cart.itemId._id,
                    quantity: cart.quantity,
                    selectedAddons: cart.selectedAddons
                }))
            }

            placeOrderMutate(payload, {
                onSuccess: async (res) => {
                    console.log("Order creation response:", res);
                    setCreatedOrder(res?.order);

                    if (paymentMethod === 'card') {
                        // Process card payment immediately after order creation
                        if (!stripe || !elements) {
                            toast.error("Payment system not ready. Please try again.");
                            setIsProcessing(false);
                            return;
                        }

                        const cardElement = elements.getElement(CardElement);

                        if (!cardElement) {
                            toast.error("Card details not found. Please check your card information.");
                            setIsProcessing(false);
                            return;
                        }

                        if (!res?.clientSecret) {
                            toast.error("Payment session expired. Please try again.");
                            setIsProcessing(false);
                            return;
                        }

                        console.log("Processing payment with clientSecret:", res.clientSecret);

                        try {
                            const { error, paymentIntent } = await stripe.confirmCardPayment(res.clientSecret, {
                                payment_method: {
                                    card: cardElement,
                                }
                            });

                            if (error) {
                                console.error("Stripe confirmation error:", error);

                                if (error.type === 'card_error' || error.type === 'validation_error') {
                                    toast.error(error.message);
                                } else {
                                    toast.error("Payment failed. Please try again.");
                                }

                                setIsProcessing(false);
                            } else if (paymentIntent) {
                                console.log("Payment Intent Status:", paymentIntent.status);

                                if (paymentIntent.status === 'succeeded') {
                                    console.log("Payment succeeded! Confirming with backend...");

                                    // Confirm payment with backend
                                    confirmPayment(
                                        {
                                            orderId: res?.order?._id,
                                            paymentIntentId: paymentIntent.id
                                        },
                                        {
                                            onSuccess: (confirmRes) => {
                                                console.log("Payment confirmation success:", confirmRes);
                                                toast.success("Payment successful! Order placed.");
                                                setIsProcessing(false);
                                                setStep(3); // Move to success step
                                            },
                                            onError: (err) => {
                                                console.error("Payment confirmation error:", err);
                                                // Even if confirmation fails, the payment was successful
                                                toast.success("Payment completed! Order placed successfully.");
                                                setIsProcessing(false);
                                                setStep(3); // Move to success step
                                            }
                                        }
                                    );
                                } else {
                                    console.log("Payment intent in unexpected state:", paymentIntent.status);
                                    toast.error(`Payment is ${paymentIntent.status}. Please check your order status.`);
                                    setIsProcessing(false);
                                }
                            }
                        } catch (err) {
                            console.error("Payment processing error:", err);
                            toast.error("Payment processing failed. Please try again.");
                            setIsProcessing(false);
                        }
                    } else {
                        // For COD, order is complete
                        setIsProcessing(false);
                        toast.success("Congratulations! Order placed successfully!");
                        setStep(3); // Move to success step
                    }
                },
                onError: (err) => {
                    console.error("Order creation error:", err);
                    toast.error("Failed to place order. Please try again.");
                    setIsProcessing(false);
                }
            })
        } catch (err) {
            console.error("Handle place order error:", err);
            toast.error("Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    }

    const canProceedFromStep2 = () => {
        if (paymentMethod === 'card') {
            return isCardReady; // Only proceed if card details are complete
        }
        return true; // For COD, always can proceed
    }

    const getStep2ButtonText = () => {
        if (paymentMethod === 'card') {
            return isProcessing ? "Processing Payment..." : "Place Order & Pay";
        } else {
            return isProcessing ? "Placing Order..." : "Place Order";
        }
    }

    return (
        <div className="min-h-screen py-8 px-4 max-w-[1140px] mx-auto">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold mb-3 from-primary to-primary/60 bg-clip-text">
                        Checkout
                    </h1>
                    <p className="text-muted-foreground">Complete your order in just a few steps</p>
                </div>

                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {steps.map((s, index) => {
                            const Icon = s.icon
                            const isComplete = step > s.id
                            const isCurrent = step === s.id

                            return (
                                <div key={s.id} className="flex flex-col items-center gap-2 bg-background">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isComplete
                                            ? 'bg-primary text-primary-foreground scale-110'
                                            : isCurrent
                                                ? 'bg-primary text-primary-foreground animate-pulse'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    <span className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {s.name}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {step === 1 && (
                            <div className="space-y-6 animate-slide-in">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Contact Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        // Only allow numbers
                                                        const numericValue = e.target.value.replace(/\D/g, '');
                                                        setFormData({
                                                            ...formData,
                                                            phone: numericValue
                                                        });
                                                    }}
                                                    placeholder="03168200581"
                                                    pattern="[0-9]*"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Complete Address</label>
                                                <Textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    placeholder="House/Flat no, Street, Area"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Delivery Instructions (Optional)</label>
                                                <Input
                                                    type="text"
                                                    name="instructions"
                                                    value={formData.instructions}
                                                    onChange={handleInputChange}
                                                    placeholder="Ring the doorbell, Leave at door, etc."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-slide-in">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-primary" />
                                        Payment Method
                                    </h2>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${paymentMethod === 'cod'
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'
                                                }`}>
                                                {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-primary" />}
                                            </div>
                                            <Wallet className="w-8 h-8 text-primary" />
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold">Cash on Delivery</div>
                                                <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${paymentMethod === 'card'
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'
                                                }`}>
                                                {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-primary" />}
                                            </div>
                                            <CreditCard className="w-8 h-8 text-primary" />
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold">Credit/Debit Card</div>
                                                <div className="text-sm text-muted-foreground">Pay securely with your card</div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Stripe Card Form - shows immediately when card is selected */}
                                    <StripeCardForm
                                        paymentMethod={paymentMethod}
                                        onCardReady={setIsCardReady}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-slide-in">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                                        {paymentMethod === 'card' ? 'Payment Successful!' : 'Order Placed Successfully!'}
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Check className="w-5 h-5 text-green-600" />
                                            <span>Your order has been confirmed</span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Order Number:</span>
                                                <span className="font-medium">{createdOrder?.orderNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Name:</span>
                                                <span className="font-medium">{formData.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Payment Method:</span>
                                                <span className="font-medium capitalize">
                                                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Amount:</span>
                                                <span className="font-bold text-primary">Rs. {total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 3 && (
                            <div className="flex gap-4">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="cursor-pointer px-8 py-3 rounded-lg border-2 border-border hover:border-primary transition-all font-semibold"
                                        disabled={isProcessing}
                                    >
                                        Back
                                    </button>
                                )}

                                {step === 1 ? (
                                    <button
                                        onClick={() => setStep(2)}
                                        className="cursor-pointer flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={!canProceedFromStep2() || isProcessing}
                                        className="cursor-pointer flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {getStep2ButtonText()}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Success Step Navigation */}
                        {step === 3 && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push("/profile")}
                                    className="cursor-pointer flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition-all shadow-lg"
                                >
                                    View Your Orders
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="cursor-pointer px-8 py-3 rounded-lg border-2 border-border hover:border-primary transition-all font-semibold"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar - Same as before */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-8 animate-fade-in">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                            <div className="space-y-4">
                                {cartItems?.map((cart) => {
                                    const item = cart?.itemId;
                                    const selectedAddons = cart?.selectedAddons?.flatMap(a => a?.options || []) || [];
                                    const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a?.price || 0), 0);
                                    const itemPrice = item?.isOnDiscount ? item?.discountPrice : item?.price;
                                    const totalItemPrice = (itemPrice + addonsTotal) * cart?.quantity;
                                    return (
                                        <div key={cart?._id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                                            <img
                                                src={item?.images?.[0]}
                                                alt={item?.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />

                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item?.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {cart?.quantity}
                                                </p>

                                                {selectedAddons.length > 0 && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        + {selectedAddons.map(a => a.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold">Rs. {totalItemPrice}</p>
                                                {item?.isOnDiscount && (
                                                    <p className="text-sm text-muted-foreground line-through">
                                                        Rs. {item?.price * cart?.quantity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span className="font-medium">Rs. {deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-border"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">
                                        Estimated: 30-45 mins
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">{cartItems.length} item(s)</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-semibold text-primary mb-1">Safe & Secure</p>
                                        <p className="text-muted-foreground">Your order is protected with our quality guarantee</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    const { isAuthenticated } = useRequireAuth('/')

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
                <Spinner className="size-8 text-primary" />
                <span className="text-primary text-lg font-semibold">Loading...</span>
            </div>
        )
    }
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPageContent />
        </Elements>
    )
}