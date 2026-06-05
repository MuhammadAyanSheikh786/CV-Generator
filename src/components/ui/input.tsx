"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "input-field",
            icon && "pl-10",
            error && "error",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, id, ...props }: TextAreaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn("input-field min-h-[100px] resize-y", error && "error", className)}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </motion.div>
  );
}
