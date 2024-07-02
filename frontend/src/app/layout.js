import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <header className="bg-white container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img
                  src="/project_images/logo.png"
                  width={150}
                  height={50}
                  alt="The Mindful Podcast Logo"
                  className="mr-4"
              />
            </Link>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white text-black py-6 px-4 md:px-6">
          <hr className="pt-10" />
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 syrlasAI.</p>
            <nav className="flex gap-4">
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/apple.png' className="h-6 w-6" />
                Apple Podcast
              </Link>
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/google.png' className="h-6 w-6" />
                Google Podcast
              </Link>
              <Link
                  href="#"
                  className="text-sm hover:underline underline-offset-4 text-muted-foreground flex flex-row"
                  prefetch={false}
              >
                <img src='/project_images/spotify.png' className="h-6 w-6" />
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
