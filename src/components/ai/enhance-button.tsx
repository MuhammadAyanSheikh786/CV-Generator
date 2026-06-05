"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EnhanceButtonProps {
  onEnhance: (text: string) => void;
  currentText: string;
  loading?: boolean;
  className?: string;
}

export function EnhanceButton({
  onEnhance,
  currentText,
  loading,
  className,
}: EnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!currentText.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText }),
      });
      if (!res.ok) throw new Error("Enhancement failed");
      const data = await res.json();
      onEnhance(data.enhanced);
    } catch (err) {
      console.error("Enhance error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleEnhance}
      disabled={isEnhancing || !currentText.trim()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Enhance with AI"
      className={`p-1.5 rounded-lg text-dark-400 dark:text-dark-500 hover:text-lightning-500 hover:bg-lightning-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {isEnhancing ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" />
          <path d="M17.5 15.5L14 19l3.5-4.5L21 21l-3.5-5.5z" />
        </svg>
      )}
    </motion.button>
  );
}
