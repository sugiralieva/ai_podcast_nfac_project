import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Analytics} from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SyrlasuAI",
  description: "SyrlasuAI",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={`${inter.className} h-full`}>
          {children}
        <Analytics />
        <Toaster />
      </body>
      </html>
  );
}