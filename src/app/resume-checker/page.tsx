"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCVStore } from "@/store/cv-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreGauge } from "@/components/ai/score-gauge";
import { ImpressionBox } from "@/components/ai/impression-box";
import { ToastContainer } from "@/components/ui/toast";
import { AICheckResult } from "@/lib/schemas";
import { cn } from "@/lib/utils";

function BreakdownBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-dark-500 dark:text-dark-400 font-medium uppercase tracking-wider">
          {label}
        </span>
        <span className="font-semibold text-dark-900 dark:text-dark-100">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-dark-200 dark:bg-dark-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function ActionItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-dark-100/50 dark:bg-dark-800/30 border border-dark-200 dark:border-dark-700/50"
    >
      <span className="w-6 h-6 rounded-lg bg-lightning-500/10 text-lightning-500 flex items-center justify-center text-xs font-bold shrink-0">
        {index + 1}
      </span>
      <span className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">{text}</span>
    </motion.li>
  );
}

export default function ResumeChecker() {
  const { data } = useCVStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AICheckResult | null>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const hasCVData =
    data.personalInfo.fullName.trim().length > 0 || data.experience.length > 0;

  const handleCheck = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!hasCVData) {
      setError("Please build a CV first in the builder before checking.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), cvData: data }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Check failed");
      }

      setResult(json.result);
      setRemaining(json.remaining);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <Header />
      <ToastContainer />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-6 sm:p-8 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-lightning-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            AI <span className="gradient-text">Resume Checker</span>
          </h1>
          <p className="text-sm text-dark-400 dark:text-dark-500 mt-2 max-w-lg mx-auto">
            Get a comprehensive AI-powered analysis of your CV across 5 dimensions.
            Receive actionable feedback to make your resume stand out.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-4 sm:p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-lightning-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark-100">
                Premium AI Analysis — Free Forever
              </p>
              <p className="text-xs text-dark-400 mt-1 leading-relaxed">
                Every CV is analyzed by <strong className="text-lightning-500">gemma-4-31b-it</strong> — the same advanced
                model used by leading recruitment platforms. Get ATS scores, keyword analysis, formatting checks,
                and actionable recommendations. <strong className="text-dark-100">10 free checks per day</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Input
                label="Your Email Address"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              variant="lightning"
              onClick={handleCheck}
              isLoading={isLoading}
              disabled={!email.trim() || !hasCVData}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Analyzing..." : "Check My CV"}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </Button>
          </div>
          {remaining !== null && (
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-3">
              {remaining} check{remaining !== 1 ? "s" : ""} remaining today
            </p>
          )}

          {!hasCVData && (
            <div className="mt-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-500">
                No CV data found.{" "}
                <Link href="/builder" className="underline font-medium">
                  Build your CV first
                </Link>{" "}
                then come back to check it.
              </p>
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
            >
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6"
            >
              {/* Score + Breakdown */}
              <div className="card-3d p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <ScoreGauge score={result.score} size={190} />

                  <div className="flex-1 w-full space-y-4">
                    <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100 uppercase tracking-wider">
                      Dimension Breakdown
                    </h3>
                    <BreakdownBar label="ATS Compliance" value={result.breakdown.ats} />
                    <BreakdownBar label="Impact & Results" value={result.breakdown.impact} />
                    <BreakdownBar label="Formatting & Structure" value={result.breakdown.formatting} />
                    <BreakdownBar label="Keyword Density" value={result.breakdown.keywords} />
                    <BreakdownBar label="Language & Tone" value={result.breakdown.tone} />
                  </div>
                </div>
              </div>

              {/* Good / Bad Impressions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImpressionBox
                  type="good"
                  title="Good Impression"
                  items={result.goodImpressions}
                />
                <ImpressionBox
                  type="bad"
                  title="Bad Impression"
                  items={result.badImpressions}
                />
              </div>

              {/* Action Items */}
              <div className="card-3d p-6 sm:p-8">
                <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100 uppercase tracking-wider mb-4">
                  Actionable Next Steps
                </h3>
                <ul className="space-y-3">
                  {result.actionItems.map((item, i) => (
                    <ActionItem key={i} text={item} index={i} />
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <Link href="/builder" className="flex-1">
                  <Button variant="lightning" className="w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit with AI
                  </Button>
                </Link>
                <Link href="/builder" className="flex-1">
                  <Button variant="lightning" className="w-full">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" />
                      <path d="M17.5 15.5L14 19l3.5-4.5L21 21l-3.5-5.5z" />
                    </svg>
                    Enhance with AI
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
