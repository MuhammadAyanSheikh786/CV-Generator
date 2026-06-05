"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TemplateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (template: any) => void;
  email: string;
}

export function TemplateGenerator({
  isOpen,
  onClose,
  onGenerated,
  email,
}: TemplateGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          prompt: prompt.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      onGenerated(data.template);
      onClose();
      setPrompt("");
      setName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal  isOpen={isOpen} onClose={onClose} title="Generate AI Template">
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-lightning-500/5 border border-lightning-500/10">
          <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed">
            Describe the CV template you want. Example:{" "}
            <span className="text-lightning-500">
              &ldquo;Create a minimalist, single-page template for a creative UI/UX
              designer with bold typography&rdquo;
            </span>
          </p>
        </div>

        <Input
          label="Template Name (optional)"
          placeholder="My Custom Template"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
            Describe your template *
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the style, layout, colors, and vibe you want..."
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="lightning"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!prompt.trim()}
            className="flex-1"
          >
            {isGenerating ? "Generating..." : "Generate"}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" />
              <path d="M17.5 15.5L14 19l3.5-4.5L21 21l-3.5-5.5z" />
            </svg>
          </Button>
        </div>

        <p className="text-[10px] text-dark-400 dark:text-dark-500 text-center">
          Your generated template will be shared with the community.
        </p>
      </div>
    </Modal>
  );
}
