"use client";

import { motion } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Input, TextArea } from "@/components/ui/input";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { EnhanceButton } from "@/components/ai/enhance-button";
import { validatePersonalInfo } from "@/lib/validation";
import { useState } from "react";

export function Step1Personal() {
  const { data, updatePersonalField } = useCVStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBlur = () => {
    setErrors(validatePersonalInfo(data.personalInfo));
  };

  const fields = [
    { key: "fullName", label: "Full Name", placeholder: "John Doe", type: "text", colSpan: "full" },
    { key: "professionalTitle", label: "Professional Title", placeholder: "Senior Software Engineer", type: "text", colSpan: "full" },
    { key: "email", label: "Email", placeholder: "john@example.com", type: "email", colSpan: "half" },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel", colSpan: "half" },
    { key: "location", label: "Location", placeholder: "San Francisco, CA", type: "text", colSpan: "half" },
    { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/johndoe", type: "url", colSpan: "half" },
    { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/johndoe", type: "url", colSpan: "full" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PhotoUpload
        value={data.personalInfo.photo}
        onChange={(val) => updatePersonalField("photo", val)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.colSpan === "full" ? "md:col-span-2" : ""}
          >
            <Input
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              value={(data.personalInfo as any)[field.key]}
              onChange={(e) => updatePersonalField(field.key, e.target.value)}
              onBlur={handleBlur}
              error={errors[field.key]}
            />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
            Professional Summary
          </label>
          <EnhanceButton
            currentText={data.personalInfo.summary}
            onEnhance={(val) => updatePersonalField("summary", val)}
          />
        </div>
        <TextArea
          placeholder="Brief overview of your career highlights, expertise, and professional goals..."
          value={data.personalInfo.summary}
          onChange={(e) => updatePersonalField("summary", e.target.value)}
          onBlur={handleBlur}
          error={errors.summary}
        />
      </div>

      <p className="text-xs text-dark-400 dark:text-dark-500 italic">
        Fields marked with * are required for CV generation
      </p>
    </motion.div>
  );
}
