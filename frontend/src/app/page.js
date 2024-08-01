'use client'
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { FaApple, FaSpotify } from 'react-icons/fa';
import { GoArrowUpRight } from "react-icons/go";


const MusicServiceButton = ({ service, icon: Icon, link }) => (
  <div className="flex items-center justify-center p-4">
    <Link href={`${link}`} rel="noopener noreferrer" target="_blank">
      <div className="bg-transparent text-white flex items-center justify-center px-4 py-2 rounded-md border border-grey-500 shadow-lg">
        <Icon className="mr-2 text-2xl h-12" />
        <div className="flex flex-col text-left">
          <span className="font-medium">Listen on</span>
          <span className="font-bold">{service}</span>
        </div>
      </div>
    </Link>
  </div>
);

export default function Component() {

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
    <div className="bg-[url('/project_images/background.png')] bg-cover bg-center bg-no-repeat">
      <header className="flex justify-center">
      <div className="w-full px-4 lg:px-6 h-14 flex items-center py-10">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <span className="text-2xl font-bold">syrlasuAI</span>
          <span className="sr-only">SyrlasuAI: сырласудың шынайы мекені</span>
        </Link>
        </div>
      </header>
      {/* <hr /> */}
      <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen flex flex-col justify-end">
        <div className="container px-4 md:px-6 py-20 flex flex-col items-center text-center mt-12">
          <div className="space-y-10">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              SyrlasuAI: сырласудың шынайы мекені
            </h1>
            <p className="mx-auto max-w-[700px] font-medium md:text-2xl text-[#e7e5e7]">
              Қарым-қатынас мәселелерін талқылайтын жасанды интеллект негізіндегі подкаст
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link
                href="/all"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-16 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Тыңдау
              </Link>
              <Link
                href="https://www.instagram.com/syrlasu.ai?igsh=M3JwcW50YTc2dnYx"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-16 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
                target="_blank"
              >
                Жазылу
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col justify-end">
          <div className="mt-auto mb-12 md:mb-12 flex flex-wrap justify-center lg:gap-4 sm:gap-2">
            <MusicServiceButton service="Apple Music" icon={FaApple} color="bg-black" link="https://podcasts.apple.com/kz/podcast/syrlasuai/id1760475762"/>
            <MusicServiceButton service="Spotify" icon={FaSpotify} color="bg-green-600" link="#" />
          </div>
        </div>
      </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl mb-6">
                  SyrlasuAI - сіздің бақытты қарым-қатынас құру бойынша жолсілтеушіңіз!
                </h2>
{/*                 <p className="max-w-[1200px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Қарым-қатынасқа байланысты қиындықтарға тап болдың ба? Абьюзивті қарым-қатынасты қалай анықтау керектігін білмейсің бе? Әлде сау қарым-қатынас құру бойынша кеңестер керек пе? Ендеше, біздің подкастымыз дәл сен үшін!
                </p> */}
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <ContentAccessibilityIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Қолжетімділік және ыңғайлылық</h3>
                <p className="text-muted-foreground">
                  Подкастты кез келген уақытта және кез келген жерде тыңдаңыз
                </p>
              </div>
              <div className="grid gap-1">
                <HeartIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Сау қарым-қатынас жолында кеңестер</h3>
                <p className="text-muted-foreground">
                  Абьюзивті қарым-қатынастан шығып, сау және бақытты қарым-қатынас құрыңыз
                </p>
              </div>
              <div className="grid gap-1">
                <AnonymityIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Анонимдік және құпиялылық</h3>
                <p className="text-muted-foreground">
                  Тіркелусіз және тегін түрде тыңдаңыз
                </p>
              </div>
            </div>
          </div>
        </section>


        <section id="episodes" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl mb-6">
                  Соңғы шығарылымдар
                </h2>
                <p className="max-w-[800px] font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-[#e7e5e7]">
                  Подкастты тыңдау арқылы өзіңіздің қарым-қатынас дағдыларыңызды жетілдіріп, эмоцияларыңызды түсініп, өзара түсіністік пен келісімге жетіңіз.
                </p>
              </div>
              
              <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {podcasts.slice(0, 3).map((podcast) => (
                    <Card key={podcast.episode} className="bg-[#fff] rounded-xl shadow-md">
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
                    </Card>
                  ))}
                </div>
              </div>
              <Link href="/all" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                <p className="max-w-[800px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed underline underline-offset-4">
                  Басқа шығарылымдар
                </p>
                <GoArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>


        <section id="chat" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl mb-6">
                  Сұрақтарыңыз қалды ма?
                </h2>
                <p className="max-w-[700px] text-muted-foreground font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Кез келген сұрақтарыңыз бен ұсыныстарыңызды біздің поштамызға жазыңыз
                </p>
              </div>
              <Card>
                <Link
                    href="mailto:zhansaya.sugiralieva@gmail.com?subject=Подкаст бойынша сұрақ&body=Сәлеметсіз бе, менің подкаст бойынша сұрағым бар..." 
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-16 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Бізге жазу
                  </Link>
                </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 SyrlasuAI Podcast. All rights reserved.</p>
      </footer>
    </div>
    </div>
  )
}


function ContentAccessibilityIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
        <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
      </svg>
    )
  }



function HeartIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
  )
}

function AnonymityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C8 2 4.2 3 3 5.2c-1.2 2.2-.6 5.5 2 9.8s4.5 7 7 7 4.8-2.8 7-7c2.6-4.3 3.2-7.6 2-9.8C19.8 3 16 2 12 2z" />
      <path d="M9 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM15 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
    </svg>
  )
}
