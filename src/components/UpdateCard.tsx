import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import AudioPlayer from './AudioPlayer';
import { Calendar, Clock } from 'lucide-react';

interface UpdateCardProps {
  id: string;
  name: string;
  transcript: string;
  createdAt: string;
  audioUrl: string;
  isLatest?: boolean;
  isDarkMode: boolean;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ 
  id, 
  name, 
  transcript, 
  createdAt, 
  audioUrl, 
  isLatest = false,
  isDarkMode
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');
  const formattedTime = format(new Date(createdAt), 'h:mm a');

  return (
    <div 
      ref={cardRef}
      className={`animate-on-scroll ${
        isLatest 
          ? 'border-l-4 border-vatican-gold-400 dark:border-vatican-red-500'
          : ''
      } p-6 rounded-lg shadow-md mb-8 ${
        isDarkMode 
          ? 'bg-papal-white-800 hover:bg-papal-white-700' 
          : 'bg-papal-white-50 hover:bg-white'
      } transition-all duration-300`}
    >
      {isLatest && (
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-vatican-gold-100 dark:bg-vatican-red-900 text-vatican-gold-800 dark:text-vatican-gold-300 rounded-full">
          Latest Update
        </div>
      )}

      <h2 className={`text-2xl md:text-3xl font-serif font-bold mb-3 ${
        isDarkMode ? 'text-vatican-gold-300' : 'text-vatican-red-600'
      }`}>
        {name}
      </h2>

      <div className="flex flex-wrap items-center text-sm text-papal-white-600 dark:text-papal-white-400 mb-4">
        <div className="flex items-center mr-4 mb-2">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-2">
          <Clock size={14} className="mr-1" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {audioUrl && (
        <div className="mb-6">
          <AudioPlayer audioUrl={audioUrl} title={name} isDarkMode={isDarkMode} />
        </div>
      )}

      <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
        {transcript.split('\n').map((paragraph, index) => (
          <p key={`${id}-p-${index}`} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default UpdateCard;