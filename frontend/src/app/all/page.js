'use client'
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

export default function AllPodcasts() {
    const [podcasts, setPodcasts] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const audioRefs = useRef([]);
  
    const handlePlay = (index) => {
      if (currentAudio !== null && currentAudio !== index) {
        audioRefs.current[currentAudio].pause();
      }
      setCurrentAudio(index);
    };

    const getPodcasts = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/podcasts");
            setPodcasts(response.data);
        } catch (error) {
            console.error("Error fetching podcasts:", error);
        }
    };

    useEffect(() => {
        getPodcasts();
    }, []);

    return (
        <div className="flex flex-col min-h-[100dvh]">
        <div className="bg-[url('/project_images/background.jpg')] bg-cover bg-center bg-no-repeat">
          <header className="flex justify-center">
          <div className="w-4/5 px-4 lg:px-6 h-14 flex items-center py-10">
            <Link href="/" className="flex items-center justify-center" prefetch={false}>
              <span className="text-2xl font-bold">syrlasuAI</span>
              <span className="sr-only">SyrlasuAI: сырласудың шынайы мекені</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <Link href="/chat" className="text-xl font-bold hover:underline underline-offset-4" prefetch={false}>
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Сұрау
                </Button>
              </Link>
            </nav>
            </div>
          </header>

            <div className="w-full max-w-6xl mx-auto">
                <div className="flex flex-col gap-6 mb-6">
                    {podcasts.map((podcast) => (
                    <Card key={podcast.episode} className="bg-[#F9F9F9] rounded-xl shadow-md">
                        <Link href={`/${podcast.category}/${podcast._id}`}>
                        <CardContent className="p-4">
                            <div className="space-y-2">
                            <h3 className="text-lg font-bold">{podcast.title}</h3>
                            {podcast.url && (
                                <audio
                                ref={(el) => (audioRefs.current[podcast.episode] = el)}
                                src={podcast.url}
                                controls
                                onPlay={() => handlePlay(podcast.episode)}
                                className="w-full"
                                />
                            )}
                            </div>
                        </CardContent>
                        </Link>
                    </Card>
                    ))}
                </div>
            </div>
            <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; 2024 SyrlasuAI Podcast. All rights reserved.</p>
            </footer>
            </div>
            </div>

    );
}