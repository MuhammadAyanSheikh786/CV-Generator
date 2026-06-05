"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImpressionBoxProps {
  type: "good" | "bad";
  title: string;
  items: string[];
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export function ImpressionBox({ type, title, items, className }: ImpressionBoxProps) {
  const isGood = type === "good";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-5 border",
        isGood
          ? "bg-green-500/5 border-green-500/20"
          : "bg-red-500/5 border-red-500/20",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            isGood ? "bg-green-500/15" : "bg-red-500/15"
          )}
        >
          {isGood ? (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">
          {title}
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-dark-400 dark:text-dark-500 italic pl-0">
          No items to display.
        </p>
      ) : (
        <motion.ul
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={itemAnim}
              className="flex items-start gap-2.5 text-sm"
            >
              <span
                className={cn(
                  "mt-1 w-1.5 h-1.5 rounded-full shrink-0",
                  isGood ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span className="text-dark-700 dark:text-dark-300 leading-relaxed">
                {item}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
