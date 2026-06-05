"use client";

import { motion } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { STEPS } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  basic: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  intermediate: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  advanced: "from-lightning-500/20 to-lightning-600/10 border-lightning-500/30",
};

const categoryLabels: Record<string, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function StepIndicator() {
  const { currentStep, setStep, data } = useCVStore();

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return "done";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-1 sm:gap-2">
        {STEPS.map((step, index) => {
          const state = getStepState(step.id);
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step.id)}
                  className={cn(
                    "relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 shrink-0",
                    state === "active" && "step-indicator-active",
                    state === "done" && "step-indicator-done",
                    state === "pending" && "step-indicator-pending"
                  )}
                >
                  {state === "done" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </motion.button>
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 rounded-full",
                      step.id < currentStep
                        ? "bg-lightning-500/50"
                        : "bg-dark-200 dark:bg-dark-700"
                    )}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <span
                  className={cn(
                    "hidden sm:block text-xs font-semibold transition-colors duration-300",
                    state === "active"
                      ? "text-lightning-500"
                      : state === "done"
                      ? "text-lightning-500/70"
                      : "text-dark-400 dark:text-dark-500"
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "sm:hidden text-[10px] transition-colors duration-300",
                    state === "active"
                      ? "text-lightning-500 font-semibold"
                      : "text-dark-400 dark:text-dark-500"
                  )}
                >
                  {step.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center">
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
            categoryColors[STEPS.find((s) => s.id === currentStep)?.category || "basic"]
          )}
          style={{
            color: currentStep >= 3 ? "#ff0033" : "#6366f1",
          }}
        >
          {categoryLabels[STEPS.find((s) => s.id === currentStep)?.category || "basic"]} Insights
        </span>
      </div>
    </div>
  );
}
