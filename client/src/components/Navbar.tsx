import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {import.meta.env.VITE_APP_NAME}
              </h1>
            </div>
            <div className="flex items-center">
              <Switch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className={`${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                >
                  {isDarkMode ? (
                    <MoonIcon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                  )}
                </span>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 
