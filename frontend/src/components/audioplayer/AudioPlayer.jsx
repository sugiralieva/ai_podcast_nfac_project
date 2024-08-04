import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, RewindIcon, VolumeIcon, ForwardIcon, ShareIcon } from "@/components/icons/Icons";
import { toast } from 'react-hot-toast';
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";

function AudioPlayer({ podcast }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

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

    const toggleVolumeControl = () => {
        setShowVolumeControl(!showVolumeControl);
    };

    const toggleShareMenu = () => {
        setShowShareMenu(!showShareMenu);
    };

    const shareOnFacebook = () => {
        const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(podcast.url)}`;
        window.open(facebookURL, '_blank');
    };

    const shareOnTwitter = () => {
        const text = 'Check out this awesome audio file!';
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(podcast.url)}`;
        window.open(twitterURL, '_blank');
    };

    const shareOnWhatsApp = () => {
        const text = `Check out this awesome audio file: ${podcast.url}`;
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappURL, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(podcast.url).then(() => {
            toast.success('Сілтеме көшірілді!');
        }).catch(err => {
            console.error('Қайта көріңіз: ', err);
            toast.error('Failed to copy the link.');
        });
    };

    return (
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => (audioRef.current.currentTime -= 10)}>
                    <RewindIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                    {isPlaying ? <PauseIcon className="h-4 w-4 sm:h-6 sm:w-6" /> : <PlayIcon className="h-4 w-4 sm:h-6 sm:w-6" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => (audioRef.current.currentTime += 10)}>
                    <ForwardIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
            </div>
            <div className="flex-1 flex items-center gap-2">
                <input
                    type="range"
                    min="0"
                    max={audioRef.current ? audioRef.current.duration : 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-4/5"
                />
                <div className="relative hidden sm:block">
                    <Button variant="outline" size="icon" onClick={toggleVolumeControl}>
                        <VolumeIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                    </Button>
                    {showVolumeControl && (
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume} 
                            onChange={handleVolumeChange} 
                            className="absolute bottom-full mb-2 w-24" 
                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'bottom left' }}
                        />
                    )}
                </div>
                <div className="relative">
                    <Button variant="outline" size="icon" onClick={toggleShareMenu}>
                        <ShareIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                    </Button>
                    {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                            <Button variant="ghost" onClick={shareOnFacebook}><CiFacebook /><p className="ml-2">facebook-те бөлісу</p></Button>
                            <Button variant="ghost" onClick={shareOnTwitter}><FaXTwitter /><p className="ml-2">twitter-де бөлісу</p></Button>
                            <Button variant="ghost" onClick={shareOnWhatsApp}><FaWhatsapp /><p className="ml-2">whatsApp-та бөлісу</p></Button>
                            <Button variant="ghost" onClick={copyLink}><FaRegCopy /><p className="ml-2">Сілтемені көшіру</p></Button>
                        </div>
                    )}
                </div>
            </div>
            {podcast && podcast.url && (
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

export default AudioPlayer;
