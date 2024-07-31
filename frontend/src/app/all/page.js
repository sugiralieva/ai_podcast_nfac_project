'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import AudioPlayer from "@/components/audioplayer/AudioPlayer";

export default function PodcastId() {
    const [podcasts, setPodcasts] = useState([]);
    const [currentPodcast, setCurrentPodcast] = useState(null);
    const [showFull, setShowFull] = useState(false);
    const [isFetched, setIsFetched] = useState(false);

    const getPodcasts = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/podcasts");
            setPodcasts(response.data);
            if (response.data.length > 0) {
                setCurrentPodcast(response.data[0]);
            }
            setIsFetched(true);
        } catch (error) {
            console.error("Error fetching podcasts:", error);
            setIsFetched(true);
        }
    };

    useEffect(() => {
        getPodcasts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[url('/project_images/background.png')] bg-cover bg-center bg-no-repeat">
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

            <main className="flex-1 flex flex-col items-center">
                <div className="w-4/5 flex flex-col space-y-8 py-12">
                    {isFetched ? (
                        <>
                            {currentPodcast && (
                                <div className="bg-white rounded-lg shadow-md p-6 bg-opacity-80">
                                    <h2 className="text-lg font-bold mb-4">Соңғы шығарылым</h2>
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <img src="/project_images/poster.png" width="100" height="100" alt="Episode" className="rounded-lg" />
                                        <div>
                                            <h2 className="text-2xl font-bold">{currentPodcast.title}</h2>
                                            <p className="text-muted-foreground">{currentPodcast.episode}</p>
                                        </div>
                                    </div>
                                    <AudioPlayer podcast={currentPodcast} className="mt-4" />
                                    <div className="mt-4 space-y-2">
                                        <h3 className="text-lg font-bold">Шығарылым сипаттамасы</h3>
                                        <p className="text-muted-foreground">
                                            {showFull ? currentPodcast.description :
                                                (currentPodcast.description?.slice(0, 200) +
                                                    (currentPodcast.description?.length > 200 ? '...' : ''))}
                                        </p>
                                        <Button
                                            onClick={() => setShowFull(!showFull)}
                                            className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            {showFull ? 'Жасыру' : 'Толық оқу'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-md p-6 bg-opacity-80">
                                <h2 className="text-lg font-bold mb-4">Барлық шығарылымдар</h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {podcasts.filter(podcast => podcast._id !== currentPodcast?._id).map((podcast) => (
                                        <div
                                            key={podcast._id}
                                            onClick={() => setCurrentPodcast(podcast)}
                                            className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded cursor-pointer"
                                        >
                                            <img src="/project_images/poster.png" width="50" height="50" alt="Episode" className="rounded-lg" />
                                            <div>
                                                <h4 className="text-base font-bold">{podcast.title}</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    {podcast.episode}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6 bg-opacity-80">
                            <h2 className="text-lg font-bold mb-4">Loading...</h2>
                        </div>
                    )}
                </div>
            </main>

            <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; 2024 SyrlasuAI Podcast. All rights reserved.</p>
            </footer>
        </div>
    );
}
