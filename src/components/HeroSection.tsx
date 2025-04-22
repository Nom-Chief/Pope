import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  isDarkMode: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isDarkMode }) => {
  const scrollToLatest = () => {
    const latestSection = document.getElementById('latest');
    if (latestSection) {
      latestSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[50vh] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/208704/pexels-photo-208704.jpeg)',
          opacity: isDarkMode ? 0.7 : 0.8
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-gray-100/40 dark:from-navy-800/50 dark:to-navy-900/60"></div>
      
      <div className="relative z-10 text-center px-4">
        <div className="inline-block bg-white/30 dark:bg-white/10 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-navy-500 dark:text-gray-50 mb-3 drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]">
            Papal Updates
          </h1>
          <p className="text-lg md:text-xl text-navy-400 dark:text-gray-300 max-w-2xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            Stay informed with the latest updates from the Vatican
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce">
        <button
          onClick={scrollToLatest}
          className="p-1.5 rounded-full bg-gray-50/50 dark:bg-navy-800/50 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors duration-200"
          aria-label="Scroll to latest updates"
        >
          <ArrowDown size={20} className="text-navy-500 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;