"use client";

import { forwardRef } from "react";
import { CVData } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

interface Props {
  data: CVData;
}

export const Template1Minimalist = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    const { personalInfo, education, experience, skills, advanced } = data;

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white text-gray-900 font-sans"
        style={{ minHeight: "297mm" }}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            {personalInfo.photo && (
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-200">
                <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={personalInfo.photo ? "" : ""}>
              <h1 className="text-3xl font-light tracking-tight text-gray-900">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium tracking-wide uppercase">
                {personalInfo.professionalTitle || "Professional Title"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.githubUrl && <span>{personalInfo.githubUrl.replace("https://", "")}</span>}
            {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl.replace("https://", "")}</span>}
          </div>
        </div>

        <div className="px-10 py-6 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <p className="text-xs leading-relaxed text-gray-600">
              {personalInfo.summary}
            </p>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {exp.jobTitle}
                        </h3>
                        <p className="text-xs text-gray-500">{exp.company}</p>
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
                          <span className="text-gray-300 mt-0.5">—</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-semibold text-gray-800">{edu.instituteName}</h3>
                    <p className="text-xs text-gray-500">
                      {edu.degree} &middot; {edu.passingYear} &middot; {edu.grade}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {advanced.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {advanced.projects.map((p) => (
                  <div key={p.id}>
                    <h3 className="text-sm font-semibold text-gray-800">{p.title}</h3>
                    <p className="text-[10px] text-gray-400">{p.techStack}</p>
                    {p.description && (
                      <p className="text-[11px] text-gray-600 mt-1">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Languages row */}
          <div className="grid grid-cols-2 gap-6">
            {advanced.certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {advanced.certifications.filter(Boolean).map((c, i) => (
                    <li key={i} className="text-[11px] text-gray-600">✦ {c}</li>
                  ))}
                </ul>
              </section>
            )}
            {advanced.languages.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Languages
                </h2>
                <div className="space-y-1">
                  {advanced.languages.map((l, i) => (
                    <p key={i} className="text-[11px] text-gray-600">
                      {l.language} &middot; {l.proficiency}
                    </p>
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

Template1Minimalist.displayName = "Template1Minimalist";
