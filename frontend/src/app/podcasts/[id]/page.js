'use client'
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import {BriefcaseIcon, HeartIcon, HomeIcon, LightbulbIcon, ParentsIcon, UsersIcon, PlayIcon, PauseIcon, RewindIcon, VolumeIcon, ForwardIcon} from "@/components/icons/Icons";


function AudioPlayer({ podcast }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            audioRef.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
    };

    return (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => (audioRef.current.currentTime -= 10)}>
                <RewindIcon className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" onClick={togglePlayPause}>
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => (audioRef.current.currentTime += 10)}>
                <ForwardIcon className="h-6 w-6" />
            </Button>
            <div className="flex-1">
                <input
                    type="range"
                    min="0"
                    max={audioRef.current ? audioRef.current.duration : 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full"
                />
            </div>
            <Button variant="outline" size="icon">
                <VolumeIcon className="h-6 w-6" />
            </Button>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-24" />
            {podcast.url && (
                <audio
                    ref={audioRef}
                    src={podcast.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setCurrentTime(0)}
                />
            )}
        </div>
    );
}

export default function PodcastId({ params }) {
    const podcastId = params.id;
    const [podcast, setPodcast] = useState([]);
    const [podcasts, setPodcasts] = useState([]);

    const getPodcast = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/podcasts/${podcastId}`);
            setPodcast(response.data);
        } catch (error) {
            console.error("Error fetching podcasts:", error);
        }
    };

    useEffect(() => {
        getPodcast();
    }, []);

    const getPodcasts = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/podcasts");
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
        <div className="flex flex-col min-h-[100dvh]">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-[url('/player-bg.jpg')] bg-cover bg-center">
                    <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-[1fr_400px]">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img src="/project_images/poster.png" width="100" height="100" alt="Episode 10" className="rounded-lg" />
                                <div>
                                    <h2 className="text-2xl font-bold">{podcast.title}</h2>
                                    <p className="text-muted-foreground">{podcast.episode}</p>
                                </div>
                            </div>
                            <AudioPlayer podcast={podcast} />
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold">Шығарылым сипаттамасы</h3>
                                <p className="text-muted-foreground">
                                    Бұл шығарылымда қозғалатын тақырыптардың қысқаша анықтамасы болады
                                </p>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="#"
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Толық көру
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-bold">Барлық шығарылымдар</h3>
                                    <div className="grid gap-4 mt-4">
                                        {podcasts.map((podcast) => (
                                        <Link
                                            href={`/podcasts/${podcast._id}`}
                                            className="flex items-center gap-4 hover:underline underline-offset-4"
                                            prefetch={false}
                                        >
                                            <div>
                                                <h4 className="text-base font-bold">{podcast.title}</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    {podcast.episode}
                                                </p>
                                            </div>
                                        </Link>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-[200px_1fr]">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter">Категориялар</h2>
                            <nav className="space-y-2">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <BriefcaseIcon className="w-4 h-4" />
                                    Мансап
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <HeartIcon className="w-4 h-4" />
                                    Денсаулық
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <UsersIcon className="w-4 h-4" />
                                    Қарым-қатынас
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <ParentsIcon className="w-4 h-4" />
                                    Ата-анамен қарым-қатнас
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <HomeIcon className="w-4 h-4" />
                                    Өмір салты
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                                    prefetch={false}
                                >
                                    <LightbulbIcon className="w-4 h-4" />
                                    Шабыттану
                                </Link>
                            </nav>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {podcasts.map((podcast) => (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-bold">{podcast.title}</h3>
                                    <p className="text-muted-foreground">{podcast.episode}</p>
                                </CardContent>
                            </Card>
                                ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
