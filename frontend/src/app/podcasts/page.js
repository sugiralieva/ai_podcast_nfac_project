'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Podcasts() {
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
        <div className="flex-grow bg-white text-black">
            <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card rounded-lg p-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src="/project_images/poster.png"
                                    alt="Podcast Cover Art"
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Соңғы шығарылым</h2>
                                {podcasts.length > 0 ? (
                                    <Link href={`/podcasts/${podcasts[0]._id}`}>
                                        <p className="text-muted-foreground">{podcasts[0].title}</p>
                                        <div className="mt-6">
                                            <button
                                                className="inline-flex h-10 items-center justify-center rounded-md bg-[#f3b0ae] px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                тыңдау
                                            </button>
                                        </div>
                                    </Link>
                                ) : (
                                    <p className="text-muted-foreground">Loading...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Барлық шығарылымдар</h2>
                        <ul className="space-y-4">
                            {podcasts.map((podcast) => (
                                <li key={podcast.episode} className="flex items-center justify-between">
                                    <Link href={`/podcasts/${podcast._id}`}>
                                        <div>
                                            <h3 className="text-lg font-medium">{podcast.title}</h3>
                                            <p className="text-muted-foreground pb-4">{podcast.episode} {podcast.createdAt}</p>
                                        </div>
                                        <button
                                            className="inline-flex h-8 items-center justify-center rounded-md bg-[#f3b0ae] px-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            тыңдау
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
