"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ToastContainer } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/ai/score-gauge";
import { ImpressionBox } from "@/components/ai/impression-box";
import { PDFAnalysisResult } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { getFirebaseAuthModule } from "@/lib/firebase-client";
import { signOut } from "firebase/auth";
import { useCVStore } from "@/store/cv-store";

interface ScanItem {
  id: string;
  fileName: string;
  score: number;
  createdAt: string;
  imageKitUrl?: string;
}

function TokenBadge({ balance, expiresInDays }: { balance: number; expiresInDays: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-lightning-500/10 border border-lightning-500/20">
      <div className="w-8 h-8 rounded-lg bg-lightning-500/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-xs text-dark-400">Token Balance</p>
        <p className="text-sm font-bold text-dark-100">
          {balance}
          <span className="text-xs font-normal text-dark-400 ml-1">({expiresInDays}d remaining)</span>
        </p>
      </div>
    </div>
  );
}

function DropZone({ onFile, disabled }: { onFile: (f: File) => void; disabled: boolean }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled) {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".pdf";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) onFile(file);
          };
          input.click();
        }
      }}
      className={cn(
        "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
        disabled && "opacity-40 pointer-events-none",
        dragging
          ? "border-lightning-500 bg-lightning-500/5"
          : "border-dark-600 hover:border-dark-500 bg-dark-800/30 hover:bg-dark-800/50"
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="text-sm font-medium text-dark-300">
        Drop your CV PDF here or click to browse
      </p>
      <p className="text-xs text-dark-500 mt-2">Supports PDF files up to 10MB</p>
    </div>
  );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, value);
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-dark-400 font-medium uppercase tracking-wider">{label}</span>
        <span className="font-semibold text-dark-100">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
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

export default function DashboardPage() {
  const router = useRouter();
  const storeUser = useCVStore((s) => s.user);
  const storeIsAuthLoading = useCVStore((s) => s.isAuthLoading);
  const storeTokenBalance = useCVStore((s) => s.tokenBalance);
  const storeTokenExpiresInDays = useCVStore((s) => s.tokenExpiresInDays);
  const [analysis, setAnalysis] = useState<PDFAnalysisResult | null>(null);
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);
  const auth = typeof window !== "undefined" ? getFirebaseAuthModule() : null as any;

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    if (!storeIsAuthLoading && !storeUser) {
      router.push("/login");
    }
  }, [storeIsAuthLoading, storeUser, router]);

  const loadScans = async () => {
    try {
      const res = await fetch("/api/cv/scans");
      if (res.ok) {
        const json = await res.json();
        setScans(json.scans);
      }
    } catch {
      // silently fail
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    setUploadError("");
    setAnalysis(null);
    setIsUploading(true);

    const forceStop = setTimeout(() => {
      setIsUploading(false);
      setUploadError("Request timed out. Please try again.");
    }, 60000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cv/upload", { method: "POST", body: formData });
      const json = await res.json();

      clearTimeout(forceStop);

      if (!res.ok) {
        setUploadError(json.error || "Upload failed");
        setIsUploading(false);
        return;
      }

      if (!json.analysis || typeof json.analysis.score !== "number") {
        setUploadError("AI returned an invalid response.");
        setIsUploading(false);
        return;
      }

      setAnalysis(json.analysis);
      useCVStore.getState().refreshTokens();
      setIsUploading(false);
      if (json.scan?.id) {
        setSelectedScan({ id: json.scan.id, fileName: file.name, score: json.analysis.score, createdAt: new Date().toISOString() });
      }
      loadScans();
    } catch {
      clearTimeout(forceStop);
      setUploadError("Network error — check your connection.");
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  };

  if (storeIsAuthLoading) {
    return (
      <div className="min-h-screen bg-dark-950 text-dark-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lightning-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <Header />
      <ToastContainer />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome + Token Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Welcome, <span className="gradient-text">{storeUser?.name || "User"}</span>
              </h1>
              <p className="text-sm text-dark-400 mt-1">
                Upload a CV PDF to get an instant AI analysis and ATS score.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TokenBadge balance={storeTokenBalance} expiresInDays={storeTokenExpiresInDays} />
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-xs font-medium text-dark-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-3d p-6 sm:p-8"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
            AI Resume Checker
          </h2>
          <DropZone onFile={handleFile} disabled={isUploading} />

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 space-y-3"
              >
                <div className="flex items-center gap-3 text-sm text-dark-400">
                  <div className="w-5 h-5 border-2 border-lightning-500 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing your CV... this may take up to 30 seconds</span>
                </div>
                <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-lightning-500 to-red-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 30, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {uploadError && !isUploading && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl p-3"
              >
                {uploadError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && analysis.score != null && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6"
            >
              {/* Score + Breakdown */}
              <div className="card-3d p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <ScoreGauge score={analysis.score} size={190} />
                  <div className="flex-1 w-full space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider">
                      ATS & Quality Breakdown
                    </h3>
                    <BreakdownBar label="ATS Compliance" value={analysis.breakdown?.ats ?? 50} />
                    <BreakdownBar label="Impact & Results" value={analysis.breakdown?.impact ?? 50} />
                    <BreakdownBar label="Formatting & Structure" value={analysis.breakdown?.formatting ?? 50} />
                    <BreakdownBar label="Keyword Density" value={analysis.breakdown?.keywords ?? 50} />
                    <BreakdownBar label="Language & Tone" value={analysis.breakdown?.tone ?? 50} />
                  </div>
                </div>
              </div>

              {/* Detailed Overview
              {analysis.detailedOverview && (
                <div className="card-3d p-6 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
                    Detailed Overview
                  </h3>
                  <div className="text-sm text-dark-300 leading-relaxed whitespace-pre-line">
                    {analysis.detailedOverview}
                  </div>
                </div>
              )}

              {/* Good / Bad Impressions */}
              {(analysis.goodImpressions?.length || analysis.badImpressions?.length) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.goodImpressions?.length > 0 && (
                    <ImpressionBox type="good" title="Strengths" items={analysis.goodImpressions} />
                  )}
                  {analysis.badImpressions?.length > 0 && (
                    <ImpressionBox type="bad" title="Weaknesses" items={analysis.badImpressions} />
                  )}
                </div>
              ) : null}

              {/* Weaknesses + Tips */}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div className="card-3d p-6 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
                    Specific Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                      >
                        <span className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-dark-300">{w}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips to Fix */}
              {analysis.tipsToFix && analysis.tipsToFix.length > 0 && (
                <div className="card-3d p-6 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
                    Tips to Fix
                  </h3>
                  <ul className="space-y-2">
                    {analysis.tipsToFix.map((tip, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20"
                      >
                        <span className="w-6 h-6 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-dark-300">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {analysis.actionItems && analysis.actionItems.length > 0 && (
                <div className="card-3d p-6 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
                    Action Items
                  </h3>
                  <ul className="space-y-3">
                    {analysis.actionItems.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/30 border border-dark-700/50"
                      >
                        <span className="w-6 h-6 rounded-lg bg-lightning-500/10 text-lightning-500 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-dark-300">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) }

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <Button
                  variant="lightning"
                  className="flex-1"
                  onClick={() => {
                    setAnalysis(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Analyze Another CV
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => router.push("/builder")}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Build CV Online
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan History */}
        {scans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-3d p-6 sm:p-8"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-100 mb-4">
              Scan History
            </h2>
            <div className="space-y-3">
              {scans.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30 border border-dark-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-lightning-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-200">{scan.fileName}</p>
                      <p className="text-xs text-dark-500">{new Date(scan.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        scan.score >= 70
                          ? "text-green-500"
                          : scan.score >= 50
                          ? "text-yellow-500"
                          : "text-red-500"
                      )}
                    >
                      {scan.score}/100
                    </span>
                    <button
                      onClick={() => setSelectedScan(scan)}
                      className="ml-2 text-xs text-lightning-500 hover:text-lightning-400 transition-colors font-medium"
                    >
                      View
                    </button>
                    {scan.imageKitUrl && (
                      <a
                        href={scan.imageKitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-500 hover:text-lightning-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scan Detail Modal */}
        <AnimatePresence>
          {selectedScan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedScan(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="card-3d p-6 sm:p-8 max-w-md w-full space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">ATS Score</h3>
                  <button
                    onClick={() => setSelectedScan(null)}
                    className="w-8 h-8 rounded-lg bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-dark-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ScoreGauge score={selectedScan.score} size={140} />
                <div className="text-center">
                  <p className="text-sm text-dark-300">{selectedScan.fileName}</p>
                  <p className="text-xs text-dark-500">{new Date(selectedScan.createdAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
