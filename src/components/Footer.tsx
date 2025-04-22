import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-papal-white-200 dark:bg-papal-white-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-papal-white-600 dark:text-papal-white-400">
          <p>&copy; {currentYear} Vatican Updates. All rights reserved.</p>
          <p className="mt-2">This site is for informational purposes only and is not affiliated with the Vatican.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;