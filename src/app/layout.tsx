import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Time Table | DBIT",
  description: "Don Bosco Institute of Technology (DBIT) ( A Unit of Don Bosco Group of Educators), Okhla is adjacent on the bank of Sukhdev Vihar Metro Station, Okhla, South Delhi, 110 025. This college offers you opportunities to grow professionally and personally. It is affiliated to Guru Gobind Singh Indraprastha University, Dwarka, New Delhi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col gap-10 h-full  min-h-screen">
          <Navbar />
          {children}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
