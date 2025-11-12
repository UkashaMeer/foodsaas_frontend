import "@/app/globals.css";
import { Providers } from "@/providers/Providers";
import { Toaster } from "sonner";
import Header from "@/components/global/Header";
import CartSidebar from "@/components/cart/CartSidebar";
import Footer from "@/components/global/Footer";

export const metadata = {
  title: "Food Saas",
  description: "Food Saas par hungur ka mangar karo.",
};


export default function UserLayout({ children }) {
  return (
      <div>
        <Toaster />
        <Providers>
          <Header />
          {children}
          <Footer />
          <CartSidebar />
        </Providers>
      </div>
  );
}
