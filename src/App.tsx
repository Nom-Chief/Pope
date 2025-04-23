import React, { useState, useEffect } from 'react';
import { fetchLatestUpdate, fetchPreviousUpdates, type PopeUpdate } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import UpdateCard from './components/UpdateCard';
import HeroSection from './components/HeroSection';
import { RefreshCw, ChevronDown } from 'lucide-react';

function App() {
  const [latestUpdate, setLatestUpdate] = useState<PopeUpdate | null>(null);
  const [previousUpdates, setPreviousUpdates] = useState<PopeUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage : 'en';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    loadData();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latest = await fetchLatestUpdate(language);
      setLatestUpdate(latest);
      
      const previous = await fetchPreviousUpdates(5, 0, language);
      setPreviousUpdates(previous);
      setHasMore(previous.length === 5);
      setPage(0);
    } catch (err) {
      setError('Failed to load updates. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreUpdates = async () => {
    try {
      const nextPage = page + 1;
      const more = await fetchPreviousUpdates(5, nextPage, language);
      
      if (more.length > 0) {
        setPreviousUpdates(prev => [...prev, ...more]);
        setPage(nextPage);
        setHasMore(more.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more updates:', err);
    }
  };

  useEffect(() => {
    loadData();
    
    const refreshInterval = setInterval(() => {
      loadData();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="flex-grow">
        <HeroSection isDarkMode={isDarkMode} language={language} />

        <section id="latest" className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-500 dark:text-gray-50">
                {language === 'en' ? 'Latest Update' : 'Última Actualización'}
              </h2>
              <button 
                onClick={loadData}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors duration-200 flex items-center"
                aria-label={language === 'en' ? "Refresh updates" : "Actualizar"}
              >
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden sm:inline">{language === 'en' ? 'Refresh' : 'Actualizar'}</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-burgundy-100 dark:bg-burgundy-900 text-burgundy-700 dark:text-burgundy-300 rounded-md mb-4">
                {error}
              </div>
            )}

            {isLoading && !latestUpdate ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-navy-500 dark:border-gray-200"></div>
              </div>
            ) : latestUpdate ? (
              <UpdateCard
                id={latestUpdate.id}
                name={latestUpdate.name}
                transcript={latestUpdate.transcript}
                createdAt={latestUpdate.created_at}
                audioUrl={latestUpdate.audio_url}
                isLatest={true}
                isDarkMode={isDarkMode}
                language={language}
              />
            ) : (
              <div className="text-center py-8 text-navy-500 dark:text-gray-200">
                {language === 'en' ? 'No updates available at this time.' : 'No hay actualizaciones disponibles en este momento.'}
              </div>
            )}
          </div>
        </section>

        <section id="archive" className="py-12 bg-gray-50 dark:bg-navy-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vatican-red-600 dark:text-vatican-gold-300 mb-10">
              {language === 'en' ? 'Previous Updates' : 'Actualizaciones Anteriores'}
            </h2>

            {previousUpdates.length > 0 ? (
              <div>
                {previousUpdates.map(update => (
                  <UpdateCard
                    key={update.id}
                    id={update.id}
                    name={update.name}
                    transcript={update.transcript}
                    createdAt={update.created_at}
                    audioUrl={update.audio_url}
                    isDarkMode={isDarkMode}
                    language={language}
                  />
                ))}

                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreUpdates}
                      className={`px-6 py-2 rounded-md font-medium flex items-center mx-auto ${
                        isDarkMode 
                          ? 'bg-vatican-gold-500 hover:bg-vatican-gold-600 text-papal-white-900' 
                          : 'bg-vatican-red-600 hover:bg-vatican-red-700 text-papal-white-100'
                      } transition-colors duration-200`}
                    >
                      <span>{language === 'en' ? 'Load More' : 'Cargar Más'}</span>
                      <ChevronDown size={18} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-papal-white-600 dark:text-papal-white-400">
                {language === 'en' ? 'No previous updates available.' : 'No hay actualizaciones anteriores disponibles.'}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;