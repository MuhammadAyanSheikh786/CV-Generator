"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  className?: string;
}

export function ScoreGauge({ score, size = 180, className }: ScoreGaugeProps) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#eab308";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  const color = getColor(clamped);
  const label =
    clamped >= 90
      ? "Outstanding"
      : clamped >= 80
      ? "Excellent"
      : clamped >= 70
      ? "Great"
      : clamped >= 60
      ? "Good"
      : clamped >= 50
      ? "Fair"
      : clamped >= 40
      ? "Needs Work"
      : "Weak";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-dark-200 dark:text-dark-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="drop-shadow-lg"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={clamped}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
        >
          {clamped}
        </motion.span>
        <span className="text-[10px] font-medium text-dark-400 dark:text-dark-500 uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
