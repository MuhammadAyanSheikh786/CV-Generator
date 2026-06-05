"use client";

import { forwardRef } from "react";
import { CVData } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

interface Props {
  data: CVData;
}

export const Template3TechModern = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    const { personalInfo, education, experience, skills, advanced } = data;

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-gray-950 text-gray-100 font-mono"
        style={{ minHeight: "297mm" }}
      >
        {/* Header with accent */}
        <div className="px-8 pt-8 pb-6 border-b border-emerald-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {personalInfo.photo && (
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/50">
                  <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {personalInfo.fullName || "Your Name"}
                </h1>
                <p className="text-sm text-emerald-400 mt-1 font-medium">
                  {'>'} {personalInfo.professionalTitle || "Professional Title"}
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] text-gray-400 space-y-0.5 font-mono">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.githubUrl && <p className="text-emerald-400">GH: {personalInfo.githubUrl.split("/").pop()}</p>}
              {personalInfo.linkedinUrl && <p className="text-emerald-400">LI: {personalInfo.linkedinUrl.split("/").pop()}</p>}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="border border-gray-800 rounded p-3 bg-gray-900/50">
              <p className="text-xs leading-relaxed text-gray-300 italic">
                &ldquo;{personalInfo.summary}&rdquo;
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                // Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-emerald-500/30 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {exp.jobTitle}
                        </h3>
                        <p className="text-xs text-emerald-300">{exp.company}</p>
                      </div>
                      <div className="text-right text-[10px] text-gray-500">
                        <p>
                          {formatDate(exp.startDate)} &ndash;{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {exp.responsibilities.filter(Boolean).map((r, i) => (
                        <li key={i} className="text-[11px] text-gray-400 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">$</span>
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
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                // Education
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {education.map((edu) => (
                  <div key={edu.id} className="border border-gray-800 rounded p-3">
                    <h3 className="text-xs font-bold text-white">{edu.instituteName}</h3>
                    <p className="text-[11px] text-emerald-300">{edu.degree}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{edu.passingYear} &middot; {edu.grade}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                // Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2.5 py-1 rounded text-[10px] font-medium bg-gray-900 border border-gray-700 text-gray-300"
                  >
                    {skill.name}
                    <span className="text-emerald-500 ml-1">{'<'} {skill.proficiency} {'>'}</span>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {advanced.projects.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                // Projects
              </h2>
              <div className="space-y-3">
                {advanced.projects.map((p) => (
                  <div key={p.id} className="border border-gray-800 rounded p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xs font-bold text-white">{p.title}</h3>
                      {p.links && <span className="text-[10px] text-emerald-400">{p.links}</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{p.techStack}</p>
                    {p.description && <p className="text-[11px] text-gray-400 mt-1">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bottom row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            {advanced.certifications.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  Certs
                </h2>
                <ul className="space-y-0.5">
                  {advanced.certifications.filter(Boolean).map((c, i) => (
                    <li key={i} className="text-[10px] text-gray-400">{c}</li>
                  ))}
                </ul>
              </section>
            )}
            {advanced.languages.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  Langs
                </h2>
                <div className="space-y-0.5">
                  {advanced.languages.map((l, i) => (
                    <p key={i} className="text-[10px] text-gray-400">{l.language} <span className="text-gray-600">[{l.proficiency}]</span></p>
                  ))}
                </div>
              </section>
            )}
            {advanced.hobbies.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-1">
                  {advanced.hobbies.filter(Boolean).map((h, i) => (
                    <span key={i} className="text-[10px] text-gray-400">{h}{i < advanced.hobbies.length - 1 ? ',' : ''}</span>
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

Template3TechModern.displayName = "Template3TechModern";
