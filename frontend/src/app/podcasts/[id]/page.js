'use client'
import {useEffect, useState} from "react";
import axios from "axios";


export default function PodcastId({ params }) {
    const podcastId = params.id;

    const [podcast, setPodcast] = useState([]);

    const getPodcasts = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/podcasts/${podcastId}`);
            setPodcast(response.data);
            console.log(podcast)
        } catch (error) {
            console.error("Error fetching podcasts:", error);
        }
    };

    useEffect(() => {
        getPodcasts();
    }, []);

    return (
        <div className="w-screen h-3/4 bg-white text-black pb-4">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="w-full max-w-md">
                    <img src="/project_images/poster.png" alt="Album Art" width={400} height={400} className="rounded-lg"/>
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{podcast.title}</h1>
                    <p className="text-muted-foreground">{podcast.episode}</p>
                </div>
                {/*<div className="flex items-center justify-center gap-4 w-full">*/}
                    {/*<button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted">*/}
                    {/*    <img src="/project_images/previous.png" className="w-6 h-6"/>*/}
                    {/*</button>*/}
                    {/*<button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted">*/}
                    {/*    <img src="/project_images/play.png" className="w-10 h-10"/>*/}
                    {/*</button>*/}
                    {/*<button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted">*/}
                    {/*    <img src="/project_images/next.png" className="w-6 h-6"/>*/}
                    {/*</button>*/}
                    {/*<button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted">*/}
                    {/*    <Volume2Icon className="w-6 h-6" />*/}
                    {/*</button>*/}
                {/*</div>*/}
                <div className="w-full flex justify-center">
                    {
                        podcast.url && (
                            <audio controls className="w-full max-w-md">
                                <source src={podcast.url} type="audio/mpeg"/>
                            </audio>
                        )
                    }

                </div>
            </div>
        </div>

    )
}
