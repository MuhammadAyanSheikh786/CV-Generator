"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface UploadStep {
  id: string;
  label: string;
  description: string;
}

export const UPLOAD_STEPS: UploadStep[] = [
  {
    id: "uploading",
    label: "Uploading PDF",
    description: "Transferring your file to the server",
  },
  {
    id: "analyzing",
    label: "AI Analysis",
    description: "Scanning with Gemini AI",
  },
  {
    id: "complete",
    label: "Complete",
    description: "Report ready!",
  },
];

interface UploadProgressProps {
  currentStep: string;
  uploadProgress: number;
  fileName: string;
  elapsedMs: number;
  error?: string;
}

function StepIcon({ status }: { status: "pending" | "active" | "completed" | "error" }) {
  if (status === "completed") {
    return (
      <motion.svg
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-5 h-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </motion.svg>
    );
  }

  if (status === "error") {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }

  if (status === "active") {
    return (
      <svg className="w-5 h-5 text-lightning-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  // pending
  return (
    <svg className="w-5 h-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function getStepStatus(
  stepId: string,
  currentStep: string,
  error?: string
): "pending" | "active" | "completed" | "error" {
  const stepOrder = UPLOAD_STEPS.map((s) => s.id);
  const currentIdx = stepOrder.indexOf(currentStep);
  const stepIdx = stepOrder.indexOf(stepId);

  if (error && stepIdx <= currentIdx && currentIdx !== stepOrder.length - 1) {
    // Highlight the step that was active when error occurred
    if (stepIdx === currentIdx) return "error";
  }
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

// Rotating status messages during the "analyzing" phase
const ANALYZING_MESSAGES = [
  "Reading PDF content...",
  "Analyzing structure...",
  "Checking ATS compliance...",
  "Evaluating keyword density...",
  "Scoring impact & tone...",
  "Generating insights...",
];

export function UploadProgress({ currentStep, uploadProgress, fileName, elapsedMs, error }: UploadProgressProps) {
  const showProgressBar = currentStep === "uploading";
  const showElapsed = currentStep === "analyzing" && !error;

  // Cycle through analyzing messages every 5 seconds
  const analyzingMessageIdx = Math.floor((elapsedMs / 5000) % ANALYZING_MESSAGES.length);
  const analyzingMessage = ANALYZING_MESSAGES[analyzingMessageIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d p-6 sm:p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center shrink-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l.75-3.75M2 9l7.5-1.5L12 2l4.5 7.5L22 9l-4.5 4.5L18.5 21l-4.5-3.5M11 16l4-5" />
            </svg>
          </motion.div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-dark-100">Analyzing CV</h3>
          <p className="text-xs text-dark-400 truncate max-w-[260px] sm:max-w-sm">
            {fileName}
          </p>
        </div>
      </div>

      {/* Upload Progress Bar (only during upload step) */}
      <AnimatePresence>
        {showProgressBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-dark-400">Upload progress</span>
              <span className="font-medium text-dark-200">{uploadProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-lightning-500 to-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <div className="space-y-0">
        {UPLOAD_STEPS.map((step, i) => {
          const status = getStepStatus(step.id, currentStep, error);
          const isLast = i === UPLOAD_STEPS.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Connector line + icon column */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500",
                    status === "completed" && "bg-green-500/15 border border-green-500/25",
                    status === "active" && "bg-lightning-500/10 border border-lightning-500/30",
                    status === "error" && "bg-red-500/10 border border-red-500/30",
                    status === "pending" && "bg-dark-800/30 border border-dark-700/50"
                  )}
                >
                  <StepIcon status={status} />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-px h-8 transition-colors duration-500",
                      status === "completed" ? "bg-green-500/40" : "bg-dark-700"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <div
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    status === "completed" && "text-green-500",
                    status === "active" && "text-lightning-500",
                    status === "error" && "text-red-500",
                    status === "pending" && "text-dark-500"
                  )}
                >
                  {step.label}
                </div>
                <div
                  className={cn(
                    "text-xs mt-0.5 transition-colors duration-300",
                    status === "active" || status === "error"
                      ? "text-dark-400"
                      : "text-dark-600"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {status === "active" && !error && (
                      <motion.span
                        key={step.id + "-active"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                      >
                        {step.id === "analyzing" ? (
                          <>
                            {analyzingMessage}
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                              className="ml-0.5"
                            >
                              ...
                            </motion.span>
                            <span className="ml-2 text-dark-500">
                              ({(elapsedMs / 1000).toFixed(0)}s)
                            </span>
                          </>
                        ) : (
                          <>
                            {step.description}
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                              className="ml-0.5"
                            >
                              ...
                            </motion.span>
                          </>
                        )}
                      </motion.span>
                    )}
                    {status === "active" && error && (
                      <motion.span
                        key={step.id + "-error"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="text-red-500"
                      >
                        Failed
                      </motion.span>
                    )}
                    {status !== "active" && (
                      <motion.span key={step.id + "-static"}>
                        {status === "completed" ? "Done" : "Waiting"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress glow during active processing */}
      {currentStep === "analyzing" && !error && (
        <div className="relative mt-2">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lightning-500/30 to-transparent" />
          <motion.div
            className="absolute -top-px left-1/2 w-20 h-px bg-lightning-500/60"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Error detail */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
          >
            <p className="text-xs text-red-500">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
