import React from 'react';
import { Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2.5 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
            <Bell className="w-5 h-5" />
            <span className="sr-only">View notifications</span>
          </button>
          
          <div className="flex items-center">
            <div className="relative inline-block">
              <img
                className="w-8 h-8 rounded-full"
                src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=0D8ABC&color=fff`}
                alt="User avatar"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;