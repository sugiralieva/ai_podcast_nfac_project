import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Analytics} from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SyrlasAI",
  description: "SyrlasAI",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={`${inter.className} h-full`}>
          {children}
        <Analytics />
      </body>
      </html>
  );
}