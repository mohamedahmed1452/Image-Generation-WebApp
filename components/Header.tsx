
import React from 'react';
import { AppMode } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 p-3 sm:p-4 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SparklesIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-200">Gemini</h1>
      </div>
      <div className="flex items-center bg-gray-800 rounded-full p-1">
        <button
          onClick={() => setMode(AppMode.CHAT)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            mode === AppMode.CHAT
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setMode(AppMode.IMAGE)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            mode === AppMode.IMAGE
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          Image
        </button>
      </div>
    </header>
  );
};

export default Header;
