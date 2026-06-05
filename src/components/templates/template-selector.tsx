"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useCVStore } from "@/store/cv-store";
import { CVTemplateId, CommunityTemplate } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { TemplateGenerator } from "@/components/ai/template-generator";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "minimalist" as CVTemplateId,
    name: "Minimalist",
    description: "Clean, airy, and typography-focused",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
    preview: "bg-white border border-gray-200",
  },
  {
    id: "executive" as CVTemplateId,
    name: "Executive",
    description: "Two-column corporate with sidebar",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="3" y="3" width="6" height="18" />
        <line x1="12" y1="7" x2="18" y2="7" />
        <line x1="12" y1="11" x2="18" y2="11" />
        <line x1="12" y1="15" x2="18" y2="15" />
      </svg>
    ),
    preview: "bg-gray-50 border border-gray-300",
  },
  {
    id: "techmodern" as CVTemplateId,
    name: "Tech/Modern",
    description: "Dark mode terminal-inspired",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 9l3 3-3 3" />
        <line x1="13" y1="15" x2="16" y2="15" />
      </svg>
    ),
    preview: "bg-gray-950 border border-gray-800",
  },
  {
    id: "creative" as CVTemplateId,
    name: "Creative",
    description: "Colorful gradient accents",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="10" r="2" />
        <path d="M8 18c0-2.21 1.79-4 4-4s4 1.79 4 4" />
      </svg>
    ),
    preview: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200",
  },
];

export function TemplateSelector() {
  const { selectedTemplate, setTemplate, data } = useCVStore();
  const [communityTemplates, setCommunityTemplates] = useState<CommunityTemplate[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const userEmail = data.personalInfo.email || "user@example.com";

  const fetchCommunity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/templates/community");
      if (res.ok) {
        const data = await res.json();
        setCommunityTemplates(data.templates ?? []);
      }
    } catch {
      // silently fail — community templates are optional
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  const handleGenerated = (tpl: CommunityTemplate) => {
    setCommunityTemplates((prev) => [tpl, ...prev]);
    setTemplate(selectedTemplate);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-dark-400 dark:text-dark-500 text-center">
        Choose a template style for your CV
      </p>

      {/* Official Templates */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {templates.map((tpl) => (
          <motion.button
            key={tpl.id}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTemplate(tpl.id)}
            className={cn(
              "template-card flex flex-col items-center gap-3 p-4 rounded-xl transition-all",
              selectedTemplate === tpl.id
                ? "template-card selected bg-lightning-500/5"
                : "bg-dark-100/50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700"
            )}
          >
            <div
              className={cn(
                "w-full h-20 rounded-lg flex items-center justify-center",
                tpl.preview
              )}
            >
              <div className={cn(selectedTemplate === tpl.id ? "text-lightning-500" : "text-dark-400 dark:text-dark-500")}>
                {tpl.icon}
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">
                {tpl.name}
              </p>
              <p className="text-[10px] text-dark-400 dark:text-dark-500 mt-0.5">
                {tpl.description}
              </p>
            </div>
            {selectedTemplate === tpl.id && (
              <motion.div
                layoutId="template-check"
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-lightning-500 flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* AI Generator CTA */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGenerator(true)}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" />
            <path d="M17.5 15.5L14 19l3.5-4.5L21 21l-3.5-5.5z" />
          </svg>
          Generate with AI
        </Button>
      </div>

      {/* Community Templates */}
      {communityTemplates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
              Community Templates ({communityTemplates.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {communityTemplates.slice(0, 8).map((ctpl) => (
              <motion.button
                key={ctpl.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTemplate(ctpl.style)}
                className={cn(
                  "template-card flex flex-col items-center gap-3 p-4 rounded-xl transition-all",
                  "bg-dark-100/50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700",
                  selectedTemplate === ctpl.style && "ring-1 ring-lightning-500/30"
                )}
              >
                <div
                  className="w-full h-20 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: ctpl.colors.background, border: `1px solid ${ctpl.colors.secondary}40` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: ctpl.colors.primary }} />
                    <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: ctpl.colors.accent }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-dark-800 dark:text-dark-200 truncate max-w-full">
                    {ctpl.name}
                  </p>
                  <p className="text-[10px] text-dark-400 dark:text-dark-500 mt-0.5 truncate">
                    {ctpl.category} &middot; {ctpl.downloads} downloads
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <TemplateGenerator
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        onGenerated={handleGenerated}
        email={userEmail}
      />
    </div>
  );
}
