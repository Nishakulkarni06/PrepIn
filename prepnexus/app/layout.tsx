import { Toaster } from "sonner";
import { Mona_Sans } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} bg-[#E9E5DF]`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
