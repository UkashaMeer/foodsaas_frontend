"use client"
import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react'
import { ChevronRight, MapPin, Phone, User, CreditCard, Wallet, Check, Clock, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getAllCartItems } from '@/api/cart/getAllCartItems';
import { usePlaceOrder } from '@/api/checkout/usePlaceOrder';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartState } from '@/store/useCartState';

export default function CheckoutPage() {

    const router = useRouter()

    const { mutate } = getAllCartItems()
    const { setCount } = useCartState()
    const { mutate: placeOrderMutate, isPending } = usePlaceOrder()
    const [step, setStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [cartItems, setCartItems] = useState([])
    const [userId, setUserId] = useState(null)


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

            const payload = {
                userId,
                fullName: formData.name,
                phoneNumber: formData.phone,
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
                onSuccess: (res) => {
                    console.log(res)
                    toast.success("Congratulations order is placed successfully!")
                    router.push("/profile")

                },
                onError: (err) => {
                    console.error(err)
                }
            })

        } catch (err) {
            console.error("handle Place Order Error", err)
        }
    }

    return (
        <div className="min-h-screen py-8 px-4 max-w-[1140px] mx-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
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
                    {/* Main Content */}
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
                                                    onChange={handleInputChange}
                                                    placeholder="03168200581"
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
                                                <label className="block text-sm font-medium mb-2">City</label>
                                                <Input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Karachi"
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

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-slide-in">
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

                                    {/* <button
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

                                    <button
                                        onClick={() => setPaymentMethod('easypaisa')}
                                        className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${paymentMethod === 'easypaisa'
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'easypaisa' ? 'border-primary' : 'border-muted-foreground'
                                            }`}>
                                            {paymentMethod === 'easypaisa' && <div className="w-3 h-3 rounded-full bg-primary" />}
                                        </div>
                                        <Phone className="w-8 h-8 text-primary" />
                                        <div className="flex-1 text-left">
                                            <div className="font-semibold">Easypaisa / JazzCash</div>
                                            <div className="text-sm text-muted-foreground">Pay via mobile wallet</div>
                                        </div>
                                    </button> */}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review Order */}
                        {step === 3 && (
                            <div className="space-y-6 animate-slide-in">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span className="font-medium">{formData.name || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="font-medium">{formData.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Address:</span>
                                            <span className="font-medium text-right max-w-xs">{formData.address || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment:</span>
                                            <span className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="cursor-pointer px-8 py-3 rounded-lg border-2 border-border hover:border-primary transition-all font-semibold"
                                >
                                    Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="cursor-pointer flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button className="cursor-pointer flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2" onClick={handlePlaceOrder}>
                                   {isPending ? "Placing Order..." : "Place Order"} 
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
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