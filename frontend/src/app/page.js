'use client'
import Link from "next/link"
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import {BriefcaseIcon, HeartIcon, ClockIcon, HomeIcon, UsersIcon, ParentsIcon, LightbulbIcon} from "@/components/icons/Icons";

export default function Home() {

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
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                      src="/project_images/poster.png"
                      width={400}
                      height={400}
                      alt="Podcast Cover"
                      className="rounded-xl shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold">SyrlasuAI: сырласудың шынайы мекені</h1>
                  <p className="text-muted-foreground text-lg">
                    Қыздарға арналған кеңестер, құпиялар, қанаттандыратын оқиғалар
                  </p>
                  <div className="flex gap-2">
                    <Link href="/podcasts">
                        <Button>Тыңдау</Button>
                    </Link>
                    <Link href="https://www.instagram.com/syrlasu.ai/?igsh=aW5vc2wxcHl5NHlx&utm_source=qr">
                        <Button variant="outline">Жазылу</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">Соңғы шығарылымдар</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {podcasts.map((podcast) => (
                  <Card key={podcast.episode} className="bg-[#F9F9F9] rounded-xl shadow-md">
                    <Link href={`/podcasts/${podcast._id}`}>
                    <CardContent className="p-4">
                      <div className="space-y-2 mt-4">
                        <h3 className="text-lg font-bold">{podcast.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {podcast.episode}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ClockIcon className="w-4 h-4" />
                          <span>{podcast.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                    </Link>
                  </Card>

                  ))}

                </div>
              </div>
            </div>
          </section>
        </main>
        <section className="bg-[#F9F9F9] py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Категориялар</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    href="/podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <BriefcaseIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Мансап</h3>
                  <p className="text-muted-foreground text-sm">Мансаптық өсу үшін кеңестер</p>
                </Link>
                <Link
                    href="/podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <HeartIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Денсаулық</h3>
                  <p className="text-muted-foreground text-sm">Салауатты ақыл мен денеге арналған кеңестер</p>
                </Link>
                <Link
                    href="/podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <UsersIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Қарым-қатынас</h3>
                  <p className="text-muted-foreground text-sm">Navigating personal and professional connections.</p>
                </Link>
                <Link
                    href="/podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <ParentsIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Ата-анамен қарым-қатынас</h3>
                  <p className="text-muted-foreground text-sm">Ата-анамен қарым-қатынасты реттеу бойынша кеңестер</p>
                </Link>
                <Link
                    href="/podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <HomeIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Өмір салты</h3>
                  <p className="text-muted-foreground text-sm">Күнделікті өмірге арналған практикалық кеңестер</p>
                </Link>
                <Link
                    href="podcasts"
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    prefetch={false}
                >
                  <LightbulbIcon className="w-8 h-8" />
                  <h3 className="text-lg font-bold">Шабыттану</h3>
                  <p className="text-muted-foreground text-sm">Сізді шабыттандыратын оқиғалар</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
