import { Poppins } from "next/font/google";

export const metadata = {
  title: "Food Saas",
  description: "Food Saas par hungur ka mangar karo.",
};

const PoppinFont = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${PoppinFont.variable}`}>{children}</body>
    </html>
  );
}
