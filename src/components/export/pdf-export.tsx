"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCVStore } from "@/store/cv-store";
import {
  canGenerateCV,
  incrementGenerationCount,
  getRemainingGenerations,
} from "@/lib/rate-limit";
import { Modal } from "@/components/ui/modal";

interface ExportProps {
  elementRef: React.RefObject<HTMLDivElement>;
  isDisabled?: boolean;
}

export function PdfExport({ elementRef, isDisabled }: ExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const addToast = useCVStore((s) => s.addToast);
  const personalInfo = useCVStore((s) => s.data.personalInfo);

  const handleExportPdf = useCallback(async () => {
    if (isDisabled || !elementRef.current) return;
    if (!canGenerateCV()) { setShowLimitModal(true); return; }

    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `${personalInfo.fullName || "CV"}_Resume.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: "avoid-all" },
        })
        .from(elementRef.current)
        .save();
      incrementGenerationCount();
      addToast("success", `CV downloaded! (${getRemainingGenerations()} remaining today)`);
    } catch (error) {
      console.error("PDF export error:", error);
      addToast("error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [isDisabled, elementRef, personalInfo.fullName, addToast]);

  return (
    <>
      <Button variant="lightning" onClick={handleExportPdf} isLoading={isExporting} disabled={isDisabled} className="flex-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isExporting ? "Generating PDF..." : "Download PDF"}
      </Button>
      <RateLimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </>
  );
}

export function PngExport({ elementRef, isDisabled }: ExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const addToast = useCVStore((s) => s.addToast);
  const personalInfo = useCVStore((s) => s.data.personalInfo);

  const handleExportPng = useCallback(async () => {
    if (isDisabled || !elementRef.current) return;
    if (!canGenerateCV()) { setShowLimitModal(true); return; }

    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(elementRef.current, {
        scale: 3, useCORS: true, logging: false, backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${personalInfo.fullName || "CV"}_Resume.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      incrementGenerationCount();
      addToast("success", `CV image downloaded! (${getRemainingGenerations()} remaining today)`);
    } catch (error) {
      console.error("PNG export error:", error);
      addToast("error", "Failed to generate image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [isDisabled, elementRef, personalInfo.fullName, addToast]);

  return (
    <>
      <Button variant="ghost" onClick={handleExportPng} isLoading={isExporting} disabled={isDisabled} className="flex-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {isExporting ? "Generating..." : "Download PNG"}
      </Button>
      <RateLimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </>
  );
}

function RateLimitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Limit Exceeded">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-500">Daily Generation Limit Exceeded</p>
            <p className="text-xs text-dark-400 dark:text-dark-400 mt-1">You can generate up to 10 CVs per day. Please try again tomorrow.</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose} className="w-full">I Understand</Button>
      </div>
    </Modal>
  );
}
