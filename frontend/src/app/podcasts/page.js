'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {ClockIcon} from "@/components/icons/Icons";


export default function Podcasts() {
    const [podcasts, setPodcasts] = useState([]);

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
                <section className="bg-[#F9F9F9] py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold">Қарым-қатынас категориясындағы шығарылымдар</h2>

                            {/* Main Podcast Block */}
                            <div className="mb-8">

                                {podcasts.length > 0 ? (
                                    <Link href={`/podcasts/${podcasts[0]._id}`}>
                                        <Card className="bg-white rounded-xl shadow-md">
                                            <CardContent className="p-4">
                                                <img src="/project_images/poster.png" width={300} height={200}
                                                     alt="Main Podcast" className="rounded-t-xl"/>
                                                <div className="space-y-2 mt-4">
                                                    <h3 className="text-xl md:text-2xl font-bold">{podcasts[0].title}</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {podcasts[0].episode}
                                                    </p>
                                                    <div
                                                        className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <ClockIcon className="w-4 h-4"/>
                                                        <span>{podcasts[0].createdAt}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ) : (
                                    <p className="text-muted-foreground">Loading...</p>
                                )}
                            </div>


                            <ul className="space-y-4">
                                {podcasts.slice(1).map((podcast) => (
                                    <li key={podcast.episode}>
                                        <Card className="bg-white rounded-xl shadow-md">
                                            <Link href={`/podcasts/${podcast._id}`}>
                                                <CardContent className="p-4">
                                                    <div className="space-y-2 mt-4">
                                                        <h3 className="text-lg font-bold">{podcast.title}</h3>
                                                        <p className="text-muted-foreground text-sm">{podcast.episode}</p>
                                                        <div
                                                            className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <ClockIcon className="w-4 h-4"/>
                                                            <span>{podcast.createdAt}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Link>
                                        </Card>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
