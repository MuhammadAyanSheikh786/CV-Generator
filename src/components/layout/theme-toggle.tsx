"use client";

import { motion } from "framer-motion";
import { useCVStore } from "@/store/cv-store";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useCVStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e1e1e, #323232)"
          : "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full flex items-center justify-center text-xs"
        animate={{ x: isDarkMode ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #ff0033, #cc0029)"
            : "linear-gradient(135deg, #666, #444)",
        }}
      >
        {isDarkMode ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
}
