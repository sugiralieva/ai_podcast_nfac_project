'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {ClockIcon} from "@/components/icons/Icons";


export default function Podcasts({params}) {
    const [podcasts, setPodcasts] = useState([]);
    const categoryName = decodeURIComponent(params.category);

    const getPodcasts = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/podcasts");
            const resData = response.data;
            const filteredPodcasts = resData.filter(podcast => 
                podcast.category.toLowerCase() === categoryName.toLowerCase()
            );
    
            setPodcasts(filteredPodcasts);
            console.log("Filtered podcasts:", filteredPodcasts);
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
                            <h2 className="text-2xl md:text-3xl font-bold">{categoryName} категориясы бойынша шығарылымдар</h2>
                        

                            <ul className="space-y-4">
                                {podcasts.map((podcast) => (
                                    <li key={podcast.episode}>
                                        <Card className="bg-white rounded-xl shadow-md">
                                            <Link href={`/${podcast.category}/${podcast._id}`}>
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
