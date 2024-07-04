import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SyrlasAI",
  description: "SyrlasAI",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={`${inter.className} h-full`}>
      <div className='bg-white flex flex-col min-h-screen'>
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <PodcastIcon className="w-8 h-8"/>
            <span className="text-xl font-bold">syrlasuAI</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="w-6 h-6"/>
          </Button>
        </header>

        <main className="flex-grow">
          {children}
        </main>


        <footer className="bg-primary text-primary-foreground py-6 px-4 md:px-6">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 syrlasuAI.</p>
            <nav className="flex gap-4">
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/apple.png' className="h-6 w-6"/>
                Apple Podcast
              </Link>
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/google.png' className="h-6 w-6"/>
                Google Podcast
              </Link>
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/spotify.png' className="h-6 w-6"/>
                Spotify
              </Link>
            </nav>
          </div>
        </footer>

      </div>
      </body>
      </html>
  );
}

function MenuIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
  )
}

function PodcastIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M16.85 18.58a9 9 0 1 0-9.7 0"/>
        <path d="M8 14a5 5 0 1 1 8 0"/>
        <circle cx="12" cy="11" r="1"/>
        <path d="M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z"/>
      </svg>
  )
}
