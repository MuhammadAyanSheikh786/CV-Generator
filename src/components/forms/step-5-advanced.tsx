"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/cv-store";
import { Input, TextArea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Step5Advanced() {
  const {
    data,
    addProject,
    updateProject,
    removeProject,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addAdvancedItem,
    removeAdvancedItem,
    updateAdvancedArray,
  } = useCVStore();

  const { advanced } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Projects */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Projects</h3>
          <p className="text-xs text-dark-400 dark:text-dark-500">Highlight key personal or professional projects</p>
        </div>

        <AnimatePresence mode="popLayout">
          {advanced.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card-3d p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Project #{index + 1}</span>
                <button onClick={() => removeProject(project.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Input label="Project Title" placeholder="E-Commerce Platform" value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} />
                </div>
                <Input label="Tech Stack" placeholder="React, Node.js, PostgreSQL" value={project.techStack} onChange={(e) => updateProject(project.id, "techStack", e.target.value)} />
                <Input label="Links (URL)" placeholder="https://github.com/..." value={project.links} onChange={(e) => updateProject(project.id, "links", e.target.value)} />
                <div className="sm:col-span-2">
                  <TextArea label="Description" placeholder="Brief project description..." value={project.description} onChange={(e) => updateProject(project.id, "description", e.target.value)} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button variant="outline" onClick={addProject} className="w-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Project
        </Button>
      </section>

      {/* Certifications */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Certifications</h3>
          <p className="text-xs text-dark-400 dark:text-dark-500">Professional certifications and licenses</p>
        </div>
        <AnimatePresence>
          {advanced.certifications.map((cert, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <Input placeholder="e.g., AWS Solutions Architect" value={cert} onChange={(e) => updateAdvancedArray("certifications", index, e.target.value)} />
              <button onClick={() => removeAdvancedItem("certifications", index)} className="p-2 text-red-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="ghost" size="sm" onClick={() => addAdvancedItem("certifications")}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Certification
        </Button>
      </section>

      {/* Extra Qualifications */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Extra Qualifications</h3>
          <p className="text-xs text-dark-400 dark:text-dark-500">Workshops, training, or additional credentials</p>
        </div>
        <AnimatePresence>
          {advanced.extraQualifications.map((qual, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <Input placeholder="e.g., Google Data Analytics Certificate" value={qual} onChange={(e) => updateAdvancedArray("extraQualifications", index, e.target.value)} />
              <button onClick={() => removeAdvancedItem("extraQualifications", index)} className="p-2 text-red-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="ghost" size="sm" onClick={() => addAdvancedItem("extraQualifications")}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Qualification
        </Button>
      </section>

      {/* Hobbies/Interests */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Hobbies & Interests</h3>
          <p className="text-xs text-dark-400 dark:text-dark-500">Personal interests that add character</p>
        </div>
        <AnimatePresence>
          {advanced.hobbies.map((hobby, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <Input placeholder="e.g., Photography, Chess, Rock Climbing" value={hobby} onChange={(e) => updateAdvancedArray("hobbies", index, e.target.value)} />
              <button onClick={() => removeAdvancedItem("hobbies", index)} className="p-2 text-red-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="ghost" size="sm" onClick={() => addAdvancedItem("hobbies")}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Hobby
        </Button>
      </section>

      {/* Languages */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Languages</h3>
          <p className="text-xs text-dark-400 dark:text-dark-500">Languages you speak with proficiency</p>
        </div>
        <AnimatePresence>
          {advanced.languages.map((lang, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <Input placeholder="Language" value={lang.language} onChange={(e) => updateLanguage(index, "language", e.target.value)} />
              <Input placeholder="Proficiency (e.g., Native, C1)" value={lang.proficiency} onChange={(e) => updateLanguage(index, "proficiency", e.target.value)} />
              <button onClick={() => removeLanguage(index)} className="p-2 text-red-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="ghost" size="sm" onClick={addLanguage}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Language
        </Button>
      </section>

      <p className="text-xs text-dark-400 dark:text-dark-500 italic">
        All fields in this section are optional but add depth to your CV
      </p>
    </motion.div>
  );
}
