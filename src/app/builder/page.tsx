"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Header } from "@/components/layout/header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { Step1Personal } from "@/components/forms/step-1-personal";
import { Step2Education } from "@/components/forms/step-2-education";
import { Step3Experience } from "@/components/forms/step-3-experience";
import { Step4Skills } from "@/components/forms/step-4-skills";
import { Step5Advanced } from "@/components/forms/step-5-advanced";
import { TemplateSelector } from "@/components/templates/template-selector";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import dynamic from "next/dynamic";

const PdfExport = dynamic(
  () => import("@/components/export/pdf-export").then((m) => m.PdfExport),
  { ssr: false }
);
const PngExport = dynamic(
  () => import("@/components/export/pdf-export").then((m) => m.PngExport),
  { ssr: false }
);
import { ToastContainer } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { canGenerateCV, getRemainingGenerations } from "@/lib/rate-limit";
import { isStepValid } from "@/lib/validation";
import { STEPS } from "@/lib/schemas";
import { TEMPLATE_VARIANTS } from "@/lib/template-configs";
import { cn } from "@/lib/utils";

const stepComponents = {
  1: Step1Personal,
  2: Step2Education,
  3: Step3Experience,
  4: Step4Skills,
  5: Step5Advanced,
};

export default function Builder() {
  const cvRef = useRef<HTMLDivElement>(null);
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    selectedTemplate,
    data,
  } = useCVStore();

  const CurrentStepComponent = stepComponents[currentStep];
  const currentStepConfig = STEPS.find((s) => s.id === currentStep);

  const variant = TEMPLATE_VARIANTS.find((v) => v.id === selectedTemplate) ?? TEMPLATE_VARIANTS[0];

  const handleNext = () => {
    if (isStepValid(currentStep, data)) {
      if (currentStep === 5) {
        setStep(5);
      } else {
        nextStep();
      }
    }
  };

  const remainingGenerations = getRemainingGenerations();

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <Header />
      <ToastContainer />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentStep <= 5 && (
            <motion.div
              key="form-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="card-3d p-6">
                <StepIndicator />
              </div>

              <div className="card-3d p-6 sm:p-8">
                {currentStepConfig && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-dark-100">
                      {currentStepConfig.label}
                    </h2>
                    <p className="text-sm text-dark-400 mt-1">
                      {currentStepConfig.description}
                    </p>
                  </div>
                )}

                <CurrentStepComponent />

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-800">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-dark-500">
                      Step {currentStep} of 5
                    </span>
                    {currentStep === 5 ? (
                      <Button
                        variant="lightning"
                        onClick={() =>
                          document
                            .getElementById("template-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Preview & Download
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    ) : (
                      <Button
                        variant="lightning"
                        onClick={handleNext}
                        disabled={!isStepValid(currentStep, data) && currentStep < 5}
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep === 5 && (
          <motion.div
            id="template-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto mt-12 space-y-8"
          >
            <div className="card-3d p-6 sm:p-8">
              <TemplateSelector />
            </div>

            <div className="card-3d p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-dark-100">
                    Live Preview
                  </h2>
                  <p className="text-sm text-dark-400 mt-1">
                    Your CV will look like this
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    remainingGenerations > 3
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : remainingGenerations > 0
                      ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  )}>
                    {remainingGenerations}/10 remaining
                  </span>
                </div>
              </div>

              <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl mb-6 max-w-[210mm] mx-auto">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center px-4 gap-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] text-gray-400 ml-2 font-mono">
                    CV Preview — {variant.name}
                  </span>
                </div>
                <div className="mt-8" ref={cvRef}>
                  <ModernTemplate data={data} variant={variant} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <PdfExport
                  elementRef={cvRef}
                  isDisabled={!canGenerateCV()}
                />
                <PngExport
                  elementRef={cvRef}
                  isDisabled={!canGenerateCV()}
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    useCVStore.getState().resetData();
                    setStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="sm:ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset & Start Over
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
