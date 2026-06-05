"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Step2Education() {
  const { data, addEducation, updateEducation, removeEducation } = useCVStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {data.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="card-3d p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
                Entry #{index + 1}
              </span>
              <button
                onClick={() => removeEducation(edu.id)}
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
                  label="Institute Name"
                  placeholder="Stanford University"
                  value={edu.instituteName}
                  onChange={(e) => updateEducation(edu.id, "instituteName", e.target.value)}
                />
              </div>
              <Input
                label="Degree / Certificate"
                placeholder="B.Sc. Computer Science"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
              />
              <Input
                label="Passing Year"
                placeholder="2024"
                type="text"
                value={edu.passingYear}
                onChange={(e) => updateEducation(edu.id, "passingYear", e.target.value)}
              />
              <Input
                label="Grade / GPA"
                placeholder="3.8 GPA"
                value={edu.grade}
                onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          variant="outline"
          onClick={addEducation}
          className="w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </Button>
      </motion.div>
    </motion.div>
  );
}
