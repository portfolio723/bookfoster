import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Book Foster",
  description: "A platform to rent, buy, and donate books.",
};

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-headline",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${openSans.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
