"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Input, TextArea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnhanceButton } from "@/components/ai/enhance-button";

export function Step3Experience() {
  const {
    data,
    addExperience,
    updateExperience,
    removeExperience,
    addResponsibility,
    updateResponsibility,
    removeResponsibility,
  } = useCVStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {data.experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="card-3d p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                Position #{index + 1}
              </span>
              <button
                onClick={() => removeExperience(exp.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Job Title"
                  placeholder="Senior Frontend Engineer"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Company"
                  placeholder="Tech Corp Inc."
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                />
              </div>
              <Input
                label="Start Date"
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
              />
              <Input
                label="End Date (or Present)"
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
              />
              <Input
                label="Location"
                placeholder="San Francisco, CA"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Key Responsibilities & Achievements
              </label>
              <AnimatePresence>
                {exp.responsibilities.map((resp, rIndex) => (
                  <motion.div
                    key={rIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-3 text-lightning-500 text-lg leading-none">•</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <EnhanceButton
                          currentText={resp}
                          onEnhance={(val) => updateResponsibility(exp.id, rIndex, val)}
                        />
                      </div>
                      <TextArea
                        placeholder="Describe a key responsibility or achievement..."
                        value={resp}
                        onChange={(e) => updateResponsibility(exp.id, rIndex, e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeResponsibility(exp.id, rIndex)}
                      className="mt-8 p-1 rounded text-red-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addResponsibility(exp.id)}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Responsibility
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button variant="outline" onClick={addExperience} className="w-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Add Experience
        </Button>
      </motion.div>
    </motion.div>
  );
}
