import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Toaster } from "sonner";
import Header from "@/components/global/Header";

const PoppinFont = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Food Saas",
  description: "Food Saas par hungur ka mangar karo.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${PoppinFont.variable}`}>
        <Toaster />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
