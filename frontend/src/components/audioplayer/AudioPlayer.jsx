import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, RewindIcon, VolumeIcon, ForwardIcon } from "@/components/icons/Icons";

function AudioPlayer({ podcast }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolumeControl, setShowVolumeControl] = useState(false);

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
                    className="w-full"
                />
                <div className="hidden sm:block">
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
                            className="w-24 ml-2" 
                        />
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