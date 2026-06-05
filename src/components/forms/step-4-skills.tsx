"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SKILL_CATEGORIES, PROFICIENCY_LABELS } from "@/lib/constants";

export function Step4Skills() {
  const { data, addSkill, updateSkill, removeSkill } = useCVStore();

  const groupedSkills = data.skills.reduce<Record<string, typeof data.skills>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {Object.keys(groupedSkills).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="card-3d p-3">
              <h4 className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider mb-2">
                {category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-lightning-500/10 text-lightning-500 border border-lightning-500/20"
                  >
                    {skill.name}
                    <span className="opacity-60">·</span>
                    {skill.proficiency}/5
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {data.skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="card-3d p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                Skill #{index + 1}
              </span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Skill Name"
                placeholder="React, Python, Docker..."
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
              />
              <Select
                label="Category"
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                options={SKILL_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
              <Select
                label="Proficiency"
                value={String(skill.proficiency)}
                onChange={(e) =>
                  updateSkill(skill.id, "proficiency", parseInt(e.target.value))
                }
                options={[1, 2, 3, 4, 5].map((n) => ({
                  value: String(n),
                  label: `${n} - ${PROFICIENCY_LABELS[n]}`,
                }))}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button variant="outline" onClick={addSkill} className="w-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </Button>
      </motion.div>
    </motion.div>
  );
}
