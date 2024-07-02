'use client'
import Link from "next/link"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [podcasts, setPodcasts] = useState([]);

  const getPodcasts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/podcasts/");
      setPodcasts(response.data);
      console.log(podcasts)
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  useEffect(() => {
    getPodcasts();
  }, []);

  return (
      <div className="bg-white text-black">

        <main>
          <section className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">SyrlasAI Podcast</h1>
                <p className="text-muted-foreground mb-6">
                  Сырласудың шынайы мекені
                </p>
                <Link
                    href="/podcasts"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#f3b0ae] px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                >
                  Тыңдау
                </Link>

              </div>
              <div className="hidden md:block">
                <img src="/project_images/poster.png" width={600} height={400} alt="Podcast Cover Art" className="rounded-xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-8 mt-12">Соңғы шығарылымдар</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast) => (
                  <div key={podcast.episode} className="bg-card rounded-xl overflow-hidden">
                    <div className="p-4">
                      <Link href={`/podcasts/${podcast._id}`}>
                      <h3 className="text-xl font-bold mb-2">{podcast.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {podcast.episode}
                        {podcast.createdAt}
                      </p>
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          </section>
        </main>

      </div>
  )
}
