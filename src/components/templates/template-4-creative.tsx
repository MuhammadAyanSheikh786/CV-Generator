"use client";

import { forwardRef } from "react";
import { CVData } from "@/lib/schemas";
import { formatDate, getInitials } from "@/lib/utils";

interface Props {
  data: CVData;
}

export const Template4Creative = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    const { personalInfo, education, experience, skills, advanced } = data;

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white text-gray-900 font-sans"
        style={{ minHeight: "297mm" }}
      >
        {/* Color block header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-8 pt-8 pb-20">
          <div className="flex items-center gap-6">
            {personalInfo.photo ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white/40 shadow-lg">
                <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                {getInitials(personalInfo.fullName || "YN")}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <p className="text-sm text-white/80 mt-0.5">
                {personalInfo.professionalTitle || "Professional Title"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-white/60">
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.githubUrl && <span>💻 {personalInfo.githubUrl}</span>}
            {personalInfo.linkedinUrl && <span>🔗 {personalInfo.linkedinUrl}</span>}
          </div>
        </div>

        <div className="px-8 -mt-12">
          {/* Summary card */}
          {personalInfo.summary && (
            <div className="relative z-10 bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
              <p className="text-sm leading-relaxed text-gray-600">
                {personalInfo.summary}
              </p>
            </div>
          )}

          <div className="space-y-6 pb-8">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-indigo-600" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-indigo-200">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white" />
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">{exp.jobTitle}</h3>
                          <p className="text-xs text-gray-500">{exp.company}</p>
                        </div>
                        <div className="text-right text-[10px] text-gray-400">
                          <p>{formatDate(exp.startDate)} &ndash; {exp.endDate ? formatDate(exp.endDate) : "Present"}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.filter(Boolean).map((r, i) => (
                          <li key={i} className="text-[11px] text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">✦</span>
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
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-indigo-600" />
                  Education
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-gray-800">{edu.instituteName}</h3>
                      <p className="text-xs text-gray-500">{edu.degree}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-400">
                        <span>{edu.passingYear}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{edu.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-indigo-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const colors = [
                      "bg-indigo-100 text-indigo-700",
                      "bg-purple-100 text-purple-700",
                      "bg-pink-100 text-pink-700",
                      "bg-blue-100 text-blue-700",
                      "bg-teal-100 text-teal-700",
                    ];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    return (
                      <span
                        key={skill.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${color}`}
                      >
                        {skill.name}
                        <span className="ml-1.5 opacity-60">{skill.proficiency}/5</span>
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Projects */}
            {advanced.projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-px bg-indigo-600" />
                  Projects
                </h2>
                <div className="space-y-3">
                  {advanced.projects.map((p) => (
                    <div key={p.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-gray-800">{p.title}</h3>
                        {p.links && <span className="text-[10px] text-indigo-500">{p.links}</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{p.techStack}</p>
                      {p.description && <p className="text-[11px] text-gray-600 mt-2">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {advanced.certifications.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Certs</h2>
                  <ul className="space-y-0.5">
                    {advanced.certifications.filter(Boolean).map((c, i) => (
                      <li key={i} className="text-[11px] text-gray-600">✦ {c}</li>
                    ))}
                  </ul>
                </section>
              )}
              {advanced.languages.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Languages</h2>
                  <div className="space-y-0.5">
                    {advanced.languages.map((l, i) => (
                      <p key={i} className="text-[11px] text-gray-600">{l.language} — <span className="text-gray-400">{l.proficiency}</span></p>
                    ))}
                  </div>
                </section>
              )}
              {advanced.hobbies.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Interests</h2>
                  <p className="text-[11px] text-gray-600">{advanced.hobbies.filter(Boolean).join(", ")}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Template4Creative.displayName = "Template4Creative";
