import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen 
          ? 'bg-gray-50 dark:bg-navy-800 shadow-sm py-2' 
          : 'bg-transparent py-2'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-serif font-bold text-navy-500 dark:text-gray-50">
            Papal Updates
          </h1>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="#latest" className="text-navy-500 dark:text-gray-200 hover:text-burgundy-500 dark:hover:text-burgundy-400 transition-colors duration-200">
                    Latest
                  </a>
                </li>
                <li>
                  <a href="#archive" className="text-navy-500 dark:text-gray-200 hover:text-burgundy-500 dark:hover:text-burgundy-400 transition-colors duration-200">
                    Archive
                  </a>
                </li>
              </ul>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-50 dark:bg-navy-800 shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-3">
              <li>
                <a 
                  href="#latest" 
                  className="block py-2 text-navy-500 dark:text-gray-200 hover:text-burgundy-500 dark:hover:text-burgundy-400 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Latest
                </a>
              </li>
              <li>
                <a 
                  href="#archive" 
                  className="block py-2 text-navy-500 dark:text-gray-200 hover:text-burgundy-500 dark:hover:text-burgundy-400 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Archive
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;