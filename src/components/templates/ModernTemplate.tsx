"use client";

import { forwardRef } from "react";
import { CVData, TemplateVariant } from "@/lib/schemas";
import { formatDate, getInitials } from "@/lib/utils";

interface Props {
  data: CVData;
  variant: TemplateVariant;
}

export const ModernTemplate = forwardRef<HTMLDivElement, Props>(
  ({ data, variant }, ref) => {
    const { personalInfo, education, experience, skills, advanced } = data;
    const c = variant.colors;
    const f = variant.fonts;

    const isTwoColumn = variant.layout === "two-column";

    const sectionTitle = (label: string) => {
      const base = "text-[10px] font-bold uppercase tracking-[0.15em]";
      switch (variant.sectionStyle) {
        case "card":
          return (
            <h2 className={`${base} mb-3`} style={{ color: c.primary }}>
              <span className="inline-block px-3 py-1 rounded-lg" style={{ backgroundColor: c.surface, color: c.primary }}>
                {label}
              </span>
            </h2>
          );
        case "timeline":
          return (
            <h2 className={`${base} mb-3 flex items-center gap-2`} style={{ color: c.primary }}>
              <span style={{ backgroundColor: c.primary }} className="w-4 h-0.5 rounded-full" />
              {label}
            </h2>
          );
        case "bordered":
          return (
            <h2 className={`${base} mb-3 pb-2`} style={{ color: c.heading, borderBottom: `2px solid ${c.primary}` }}>
              {label}
            </h2>
          );
        case "ghost":
          return (
            <h2 className={`${base} mb-3`} style={{ color: c.muted }}>
              {label}
            </h2>
          );
        default:
          return (
            <h2 className={`${base} mb-3`} style={{ color: c.heading }}>
              {label}
            </h2>
          );
      }
    };

    const renderHeader = () => {
      const contact = (
        <div
          className="flex flex-wrap gap-x-4 gap-y-1"
          style={{ color: variant.headerStyle === "dark" || variant.headerStyle === "gradient" ? "rgba(255,255,255,0.65)" : c.muted, fontSize: "10px" }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.githubUrl && <span>{personalInfo.githubUrl.replace("https://", "")}</span>}
          {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl.replace("https://", "")}</span>}
        </div>
      );

      const nameTitle = (
        <div>
          <h1 style={{ fontFamily: f.heading, color: variant.headerStyle === "dark" || variant.headerStyle === "gradient" ? "#ffffff" : c.heading, fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p style={{ color: variant.headerStyle === "dark" || variant.headerStyle === "gradient" ? "rgba(255,255,255,0.75)" : c.primary, fontSize: "13px", fontWeight: 500, marginTop: "2px" }}>
            {personalInfo.professionalTitle || "Professional Title"}
          </p>
        </div>
      );

      switch (variant.headerStyle) {
        case "dark":
          return (
            <div style={{ backgroundColor: c.secondary, padding: "32px 40px" }}>
              <div className="flex items-center gap-5">
                {personalInfo.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{ border: "2px solid rgba(255,255,255,0.3)" }}>
                    <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {nameTitle}
              </div>
              <div className="mt-3">{contact}</div>
            </div>
          );
        case "gradient":
          return (
            <div style={{ background: `linear-gradient(135deg, ${c.secondary}, ${c.primary})`, padding: "32px 40px 48px" }}>
              <div className="flex items-center gap-5">
                {personalInfo.photo ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0" style={{ border: "2px solid rgba(255,255,255,0.4)" }}>
                    <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                    {getInitials(personalInfo.fullName || "YN")}
                  </div>
                )}
                {nameTitle}
              </div>
              <div className="mt-3">{contact}</div>
            </div>
          );
        case "sidebar":
          return (
            <div className="flex" style={{ minHeight: "120px" }}>
              <div style={{ width: "35%", backgroundColor: c.primary, padding: "28px 24px", color: "#ffffff" }}>
                <div className="flex flex-col items-center text-center">
                  {personalInfo.photo ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3" style={{ border: "2px solid rgba(255,255,255,0.4)" }}>
                      <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      {getInitials(personalInfo.fullName || "YN")}
                    </div>
                  )}
                  <h1 style={{ fontFamily: f.heading, fontSize: "20px", fontWeight: 700, lineHeight: 1.2 }}>
                    {personalInfo.fullName || "Your Name"}
                  </h1>
                  <p style={{ fontSize: "11px", marginTop: "2px", opacity: 0.8 }}>
                    {personalInfo.professionalTitle || "Professional Title"}
                  </p>
                  <div className="mt-4 space-y-1 text-[10px]" style={{ opacity: 0.75 }}>
                    {personalInfo.email && <p>{personalInfo.email}</p>}
                    {personalInfo.phone && <p>{personalInfo.phone}</p>}
                    {personalInfo.location && <p>{personalInfo.location}</p>}
                  </div>
                </div>
              </div>
              <div style={{ width: "65%", backgroundColor: c.background }} />
            </div>
          );
        case "centered":
          return (
            <div style={{ padding: "32px 40px", textAlign: "center", borderBottom: `1px solid ${c.border}` }}>
              {personalInfo.photo && (
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3" style={{ border: `2px solid ${c.primary}` }}>
                  <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {nameTitle}
              <div className="mt-3 flex justify-center">{contact}</div>
            </div>
          );
        case "accent-bar":
          return (
            <div style={{ padding: "28px 40px" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: c.primary, marginBottom: "12px" }} />
              <div className="flex items-center gap-5">
                {personalInfo.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{ border: `2px solid ${c.primary}` }}>
                    <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {nameTitle}
              </div>
              <div className="mt-3">{contact}</div>
            </div>
          );
        default:
          return (
            <div style={{ padding: "28px 40px 24px", borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-5">
                {personalInfo.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{ border: `2px solid ${c.border}` }}>
                    <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {nameTitle}
              </div>
              <div className="mt-3">{contact}</div>
            </div>
          );
      }
    };

    const renderSkills = () => {
      if (skills.length === 0) return null;

      switch (variant.skillStyle) {
        case "bar":
          return (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex items-center justify-between text-[11px]" style={{ color: c.text }}>
                    <span style={{ fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ color: c.muted }}>{skill.proficiency}/5</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: c.surface }}>
                    <div className="h-full rounded-full" style={{ width: `${(skill.proficiency / 5) * 100}%`, backgroundColor: c.primary }} />
                  </div>
                </div>
              ))}
            </div>
          );
        case "grid":
          return (
            <div className="grid grid-cols-2 gap-1.5">
              {skills.map((skill) => (
                <div key={skill.id} style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: c.surface, fontSize: "10px", color: c.text, fontWeight: 500 }}>
                  {skill.name}
                  <span style={{ color: c.primary, marginLeft: "4px" }}>{skill.proficiency}</span>
                </div>
              ))}
            </div>
          );
        case "tag":
          return (
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span key={skill.id} style={{ padding: "3px 8px", borderRadius: "3px", border: `1px solid ${c.border}`, fontSize: "10px", color: c.text, backgroundColor: c.surface }}>
                  {skill.name}
                </span>
              ))}
            </div>
          );
        default:
          return (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} style={{ padding: "4px 10px", borderRadius: "12px", backgroundColor: c.surface, color: c.primary, fontSize: "10px", fontWeight: 500 }}>
                  {skill.name}
                </span>
              ))}
            </div>
          );
      }
    };

    const renderSection = (content: React.ReactNode, padding = "py-1") => {
      switch (variant.sectionStyle) {
        case "card":
          return <div className={padding} style={{ padding: "12px", borderRadius: "8px", backgroundColor: c.surface }}>{content}</div>;
        default:
          return <div className={padding}>{content}</div>;
      }
    };

    const spacingClass = variant.spacing === "compact" ? "space-y-4" : variant.spacing === "spacious" ? "space-y-8" : "space-y-6";

    const contentPadding = isTwoColumn ? "px-6 py-6" : "px-10 py-6";

    const mainContent = (
      <div className={contentPadding}>
        {/* Summary */}
        {personalInfo.summary && variant.headerStyle !== "sidebar" && (
          <div style={{ marginBottom: isTwoColumn ? "0" : "24px" }}>
            {sectionTitle("Professional Summary")}
            {renderSection(
              <p style={{ fontSize: "11px", lineHeight: 1.6, color: c.text }}>{personalInfo.summary}</p>
            )}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: isTwoColumn ? "0" : "24px" }}>
            {sectionTitle("Experience")}
            <div className={variant.spacing === "compact" ? "space-y-3" : "space-y-4"}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 style={{ fontSize: "13px", fontWeight: 600, color: c.heading }}>{exp.jobTitle}</h3>
                      <p style={{ fontSize: "11px", color: c.primary, fontWeight: 500 }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "10px", color: c.muted }}>
                      <p>{formatDate(exp.startDate)} &ndash; {exp.endDate ? formatDate(exp.endDate) : "Present"}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.responsibilities.filter(Boolean).map((r, i) => (
                      <li key={i} className="flex items-start gap-2" style={{ fontSize: "11px", color: c.text, lineHeight: 1.5 }}>
                        <span style={{ color: c.primary, marginTop: "3px" }}>{"\u2022"}</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: isTwoColumn ? "0" : "24px" }}>
            {sectionTitle("Education")}
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 style={{ fontSize: "13px", fontWeight: 600, color: c.heading }}>{edu.instituteName}</h3>
                  <p style={{ fontSize: "11px", color: c.text }}>
                    {edu.degree} &middot; {edu.passingYear} &middot; {edu.grade}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const sidebarContent = (
      <div style={{ padding: "24px 20px", backgroundColor: c.surface, height: "100%" }}>
        {personalInfo.summary && variant.headerStyle === "sidebar" && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Profile</h2>
            <p style={{ fontSize: "11px", lineHeight: 1.6, color: c.text }}>{personalInfo.summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>
              {variant.headerStyle === "sidebar" ? "Skills" : variant.skillStyle === "bar" ? "Core Skills" : "Skills"}
            </h2>
            {renderSkills()}
          </div>
        )}

        {advanced.certifications.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Certifications</h2>
            <ul className="space-y-1">
              {advanced.certifications.filter(Boolean).map((cert, i) => (
                <li key={i} className="flex items-start gap-2" style={{ fontSize: "11px", color: c.text }}>
                  <span style={{ color: c.primary }}>{"\u25B8"}</span>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {advanced.languages.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Languages</h2>
            <div className="space-y-0.5">
              {advanced.languages.map((lang, i) => (
                <p key={i} style={{ fontSize: "11px", color: c.text }}>
                  {lang.language} <span style={{ color: c.muted }}>&mdash; {lang.proficiency}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {advanced.hobbies.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Interests</h2>
            <div className="flex flex-wrap gap-1">
              {advanced.hobbies.filter(Boolean).map((h, i) => (
                <span key={i} style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "10px", backgroundColor: c.background, color: c.text }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          fontFamily: f.body,
          minHeight: "297mm",
          backgroundColor: c.background,
          color: c.text,
        }}
      >
        {renderHeader()}

        {isTwoColumn ? (
          <div className="flex" style={{ minHeight: "calc(297mm - 180px)" }}>
            <div style={{ width: "35%" }}>
              {sidebarContent}
            </div>
            <div style={{ width: "65%" }}>
              {mainContent}
            </div>
          </div>
        ) : (
          mainContent
        )}

        {/* Projects */}
        {advanced.projects.length > 0 && !isTwoColumn && (
          <div style={{ padding: "0 40px 24px" }}>
            {sectionTitle("Projects")}
            <div className="space-y-3">
              {advanced.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-start justify-between">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: c.heading }}>{p.title}</h3>
                    {p.links && <span style={{ fontSize: "10px", color: c.primary }}>{p.links}</span>}
                  </div>
                  <p style={{ fontSize: "10px", color: c.muted, fontWeight: 500 }}>{p.techStack}</p>
                  {p.description && <p style={{ fontSize: "11px", color: c.text, marginTop: "2px" }}>{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom extras for single-column */}
        {!isTwoColumn && (
          <div style={{ padding: "0 40px 24px" }}>
            <div className="grid grid-cols-2 gap-6">
              {advanced.certifications.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Certifications</h2>
                  <ul className="space-y-0.5">
                    {advanced.certifications.filter(Boolean).map((cert, i) => (
                      <li key={i} style={{ fontSize: "11px", color: c.text }}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}
              {advanced.languages.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Languages</h2>
                  <div className="space-y-0.5">
                    {advanced.languages.map((lang, i) => (
                      <p key={i} style={{ fontSize: "11px", color: c.text }}>
                        {lang.language} <span style={{ color: c.muted }}>&mdash; {lang.proficiency}</span>
                      </p>
                    ))}
                  </div>
                </section>
              )}
              {advanced.hobbies.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c.muted }}>Interests</h2>
                  <p style={{ fontSize: "11px", color: c.text }}>{advanced.hobbies.filter(Boolean).join(", ")}</p>
                </section>
              )}
            </div>
          </div>
        )}

        {/* Projects for two-column */}
        {advanced.projects.length > 0 && isTwoColumn && (
          <div style={{ padding: "0 24px 24px" }}>
            {sectionTitle("Projects")}
            <div className="space-y-2">
              {advanced.projects.map((p) => (
                <div key={p.id}>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, color: c.heading }}>{p.title}</h3>
                  <p style={{ fontSize: "10px", color: c.primary }}>{p.techStack}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ModernTemplate.displayName = "ModernTemplate";
