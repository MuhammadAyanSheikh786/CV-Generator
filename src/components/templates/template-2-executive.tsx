"use client";

import { forwardRef } from "react";
import { CVData } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

interface Props {
  data: CVData;
}

export const Template2Executive = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    const { personalInfo, education, experience, skills, advanced } = data;

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white text-gray-900 font-sans"
        style={{ minHeight: "297mm" }}
      >
        {/* Dark sidebar header */}
        <div className="bg-gray-900 text-white px-10 py-8">
          <div className="flex items-center gap-6">
            {personalInfo.photo && (
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
                <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <p className="text-sm text-gray-300 mt-1 font-medium">
                {personalInfo.professionalTitle || "Professional Title"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-gray-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        <div className="flex" style={{ minHeight: "calc(297mm - 140px)" }}>
          {/* Left column */}
          <div className="w-1/3 bg-gray-50 px-6 py-6 space-y-6">
            {personalInfo.summary && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Profile
                </h2>
                <p className="text-[11px] leading-relaxed text-gray-600">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {skills.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Core Skills
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-700 font-medium">{skill.name}</span>
                        <span className="text-gray-400">{skill.proficiency}/5</span>
                      </div>
                      <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-700 rounded-full"
                          style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {advanced.certifications.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {advanced.certifications.filter(Boolean).map((c, i) => (
                    <li key={i} className="text-[11px] text-gray-600 flex items-start gap-2">
                      <span className="text-gray-300 mt-0.5">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {advanced.languages.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                  Languages
                </h2>
                <div className="space-y-0.5">
                  {advanced.languages.map((l, i) => (
                    <p key={i} className="text-[11px] text-gray-600">
                      {l.language}
                      <span className="text-gray-400"> — {l.proficiency}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="w-2/3 px-6 py-6 space-y-6">
            {experience.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">{exp.jobTitle}</h3>
                          <p className="text-xs text-gray-500 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-[10px] text-gray-400">
                          <p>
                            {formatDate(exp.startDate)} &ndash;{" "}
                            {exp.endDate ? formatDate(exp.endDate) : "Present"}
                          </p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.filter(Boolean).map((r, i) => (
                          <li key={i} className="text-[11px] text-gray-600 flex items-start gap-2">
                            <span className="text-gray-300 mt-0.5">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{edu.instituteName}</h3>
                        <p className="text-xs text-gray-500">{edu.degree}</p>
                      </div>
                      <div className="text-right text-[10px] text-gray-400">
                        <p>{edu.passingYear}</p>
                        <p>{edu.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {advanced.projects.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Key Projects
                </h2>
                <div className="space-y-3">
                  {advanced.projects.map((p) => (
                    <div key={p.id}>
                      <h3 className="text-sm font-bold text-gray-800">{p.title}</h3>
                      <p className="text-[10px] text-gray-400 font-medium">{p.techStack}</p>
                      {p.description && (
                        <p className="text-[11px] text-gray-600 mt-1">{p.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Template2Executive.displayName = "Template2Executive";
