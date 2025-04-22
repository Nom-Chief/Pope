import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  isDarkMode: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Only create a new instance if one doesn't exist
    if (!wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: isDarkMode ? '#FFD83A' : '#BA0000',
        progressColor: isDarkMode ? '#FFCC00' : '#800000',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 3,
        barRadius: 3,
        height: 80,
        url: audioUrl,
        backend: 'MediaElement',
        mediaControls: false,
        normalize: true,
        minPxPerSec: 50,
        fillParent: true,
        interact: true
      });

      wavesurfer.on('ready', () => {
        wavesurferRef.current = wavesurfer;
        setDuration(wavesurfer.getDuration());
        setError(null);
      });

      wavesurfer.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        setError('Failed to load audio. Please try again later.');
      });

      wavesurfer.on('play', () => setIsPlaying(true));
      wavesurfer.on('pause', () => setIsPlaying(false));
      wavesurfer.on('audioprocess', () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });

      return () => {
        wavesurfer.destroy();
        wavesurferRef.current = null;
      };
    }

    // Update waveColor and progressColor when theme changes
    if (wavesurferRef.current) {
      wavesurferRef.current.setOptions({
        waveColor: isDarkMode ? '#FFD83A' : '#BA0000',
        progressColor: isDarkMode ? '#FFCC00' : '#800000',
      });
    }
  }, [audioUrl, isDarkMode]);

  const togglePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(1);
      } else {
        wavesurferRef.current.setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`audio-player bg-gradient-to-r ${
      isDarkMode 
        ? 'from-papal-white-800 to-papal-white-900 border border-papal-white-700' 
        : 'from-vatican-gold-50 to-vatican-gold-100 border border-vatican-gold-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-papal-white-200 dark:hover:bg-papal-white-700 transition-colors duration-200"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
        <div className="text-xs text-papal-white-600 dark:text-papal-white-400">
          Powered by{' '}
          <a 
            href="https://www.audioclips.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-navy-500 dark:text-gray-300 hover:text-burgundy-500 dark:hover:text-burgundy-400 transition-colors duration-200"
          >
            audioclips.ai
          </a>
        </div>
      </div>

      {error ? (
        <div className="text-center py-4 text-vatican-red-600 dark:text-vatican-gold-400">
          {error}
        </div>
      ) : (
        <>
          <div className="wave-container" ref={containerRef}></div>

          <div className="flex items-center justify-between mt-2">
            <button 
              onClick={togglePlayPause}
              className={`p-3 rounded-full ${
                isDarkMode 
                  ? 'bg-vatican-gold-400 text-papal-white-900 hover:bg-vatican-gold-300' 
                  : 'bg-vatican-red-500 text-papal-white-100 hover:bg-vatican-red-600'
              } transition-colors duration-200`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;