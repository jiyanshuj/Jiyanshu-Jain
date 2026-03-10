import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 right-6 z-50 rounded-full border border-white/15 bg-[#0a0a0f]/75 p-3 text-zinc-200 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.95)] backdrop-blur-md transition-colors hover:border-[#00a4ef]/45 hover:bg-[#11131a]/85"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.9 }}
    >
      {darkMode ? (
        <Sun size={20} className="text-amber-300" />
      ) : (
        <Moon size={20} className="text-[#7dd3fc]" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;