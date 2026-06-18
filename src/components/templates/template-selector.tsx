"use client";

import { motion } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { TemplateVariant } from "@/lib/schemas";
import { TEMPLATE_VARIANTS } from "@/lib/template-configs";
import { cn } from "@/lib/utils";

function TemplateCard({ variant, isSelected, onClick }: { variant: TemplateVariant; isSelected: boolean; onClick: () => void }) {
  const c = variant.colors;

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "template-card flex flex-col items-center gap-2.5 p-3 rounded-xl transition-all relative",
        isSelected
          ? "selected"
          : "bg-dark-100/50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700"
      )}
      style={
        isSelected
          ? { border: `1px solid ${c.primary}`, boxShadow: `0 0 20px ${c.primary}33, 0 10px 30px -10px ${c.primary}40` }
          : undefined
      }
    >
      {/* Mini preview block */}
      <div
        className="w-full h-16 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: c.background, border: `1px solid ${c.border}` }}
      >
        <div className="flex flex-col items-center gap-1 w-full px-2">
          <div className="w-full h-2 rounded-sm" style={{ backgroundColor: c.primary, opacity: 0.8 }} />
          <div className="w-3/4 h-1.5 rounded-sm" style={{ backgroundColor: c.surface }} />
          <div className="w-1/2 h-1 rounded-sm" style={{ backgroundColor: c.surface }} />
          <div className="flex gap-1 w-full mt-0.5">
            <div className="w-1/3 h-1 rounded-sm" style={{ backgroundColor: c.accent, opacity: 0.6 }} />
            <div className="w-1/3 h-1 rounded-sm" style={{ backgroundColor: c.accent, opacity: 0.6 }} />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">{variant.name}</p>
        <p className="text-[10px] text-dark-400 dark:text-dark-500 mt-0.5">{variant.description}</p>
      </div>
      {isSelected && (
        <motion.div
          layoutId="template-check"
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c.primary }}
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

export function TemplateSelector() {
  const { selectedTemplate, setTemplate } = useCVStore();

  return (
    <div className="space-y-6">
      <p className="text-sm text-dark-400 dark:text-dark-500 text-center">
        Choose from {TEMPLATE_VARIANTS.length} modern template designs
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {TEMPLATE_VARIANTS.map((variant) => (
          <TemplateCard
            key={variant.id}
            variant={variant}
            isSelected={selectedTemplate === variant.id}
            onClick={() => setTemplate(variant.id)}
          />
        ))}
      </div>
    </div>
  );
}
