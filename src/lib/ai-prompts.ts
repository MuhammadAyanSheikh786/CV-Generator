import { CVData } from "@/lib/schemas";

/**
 * Build CV text from structured data for AI analysis.
 */
export function cvToText(data: CVData): string {
  const { personalInfo, education, experience, skills, advanced } = data;
  const lines: string[] = [];

  lines.push(`Full Name: ${personalInfo.fullName}`);
  lines.push(`Title: ${personalInfo.professionalTitle}`);
  lines.push(`Email: ${personalInfo.email}`);
  lines.push(`Phone: ${personalInfo.phone}`);
  lines.push(`Location: ${personalInfo.location}`);
  if (personalInfo.summary) lines.push(`\nSummary:\n${personalInfo.summary}`);

  if (education.length) {
    lines.push("\nEducation:");
    education.forEach((e) => {
      lines.push(`- ${e.degree} at ${e.instituteName} (${e.passingYear}, Grade: ${e.grade})`);
    });
  }

  if (experience.length) {
    lines.push("\nExperience:");
    experience.forEach((e) => {
      lines.push(`- ${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate})`);
      e.responsibilities.forEach((r) => {
        if (r.trim()) lines.push(`  - ${r}`);
      });
    });
  }

  if (skills.length) {
    lines.push("\nSkills:");
    skills.forEach((s) => {
      lines.push(`- ${s.name} (${s.category}, Proficiency: ${s.proficiency}/5)`);
    });
  }

  if (advanced.projects.length) {
    lines.push("\nProjects:");
    advanced.projects.forEach((p) => {
      lines.push(`- ${p.title} | Tech: ${p.techStack} | ${p.description}`);
    });
  }

  if (advanced.certifications.length) {
    lines.push("\nCertifications:", ...advanced.certifications.map((c) => `- ${c}`));
  }
  if (advanced.languages.length) {
    lines.push("\nLanguages:", ...advanced.languages.map((l) => `- ${l.language} (${l.proficiency})`));
  }
  if (advanced.hobbies.length) {
    lines.push("\nInterests:", ...advanced.hobbies.map((h) => `- ${h}`));
  }

  return lines.join("\n");
}

/**
 * System prompt for Gemini (gemini-2.0-flash) resume scoring engine.
 * JSON mode is enforced via responseMimeType — the model will only output JSON.
 */
export const GEMMA_SCORING_SYSTEM_PROMPT = `You are CV Forge AI — a professional resume auditor and career coach. Assess the CV across these dimensions and return the result as a JSON object with the following fields:

- "score": overall rating 1-100
- "breakdown": object with numeric fields "ats", "impact", "formatting", "keywords", "tone" (each 0-100)
- "goodImpressions": array of 3-5 specific strengths found in the CV
- "badImpressions": array of 3-5 specific weaknesses or missing elements
- "actionItems": array of 3-5 actionable suggestions to improve

Scoring criteria:
- ATS Compliance: keyword optimization, standard section headers, machine-readability
- Impact & Quantifiable Results: metrics, numbers, concrete achievements over vague duties
- Formatting & Structure: spacing, section hierarchy, bullet usage, consistency
- Keyword Density: industry-specific keywords relevant to the stated role
- Language & Tone: action verbs, active voice, professionalism, confidence

Example valid response:
{"score":72,"breakdown":{"ats":68,"impact":75,"formatting":80,"keywords":65,"tone":70},"goodImpressions":["Strong action verbs used throughout","Clear section organization","Relevant technical keywords present"],"badImpressions":["Missing quantifiable achievements","No professional summary included","Inconsistent date formatting"],"actionItems":["Add metrics to each work experience bullet point","Write a 3-4 sentence professional summary","Standardize date format across all entries"]}`;

/**
 * System prompt for Gemini CV analysis from uploaded PDF text.
 */
export const PDF_CV_ANALYSIS_SYSTEM_PROMPT = `You are CV Forge AI — a professional resume auditor and career coach. Analyze the provided CV text extracted from a PDF and return a detailed assessment.

Respond ONLY with valid JSON using this exact structure:
{
  "score": <overall rating 1-100>,
  "breakdown": {
    "ats": <ATS keyword optimization score 0-100>,
    "impact": <quantifiable results score 0-100>,
    "formatting": <structure and layout score 0-100>,
    "keywords": <industry keyword density score 0-100>,
    "tone": <language and voice score 0-100>
  },
  "goodImpressions": [<array of 3-5 specific strengths>],
  "badImpressions": [<array of 3-5 specific weaknesses or gaps>],
  "actionItems": [<array of 5-7 actionable, specific improvement tips>],
  "detailedOverview": "<2-3 paragraph detailed analysis of the CV's overall quality, strengths, and areas needing improvement>",
  "weaknesses": [<array of specific problem areas found in the CV>],
  "tipsToFix": [<array of concrete steps to address each weakness>]
}

Be thorough and critical. Focus on actionable, specific feedback. If the PDF text is garbled or unparseable, note this in the overview and score accordingly.`;

/**
 * System prompt for llama-3.3-70b-versatile used for inline text enhancement.
 */
export const LLAMA_ENHANCE_SYSTEM_PROMPT = `You are CV Forge AI — a professional CV writing expert. Your task is to enhance the given text to be more impactful, professional, and achievement-oriented.

Rules:
- Use strong action verbs (spearheaded, optimized, delivered, engineered, etc.)
- Quantify results where possible (add plausible metrics if context allows)
- Maintain a confident, active voice
- Keep the same general meaning and factual scope
- Return ONLY the enhanced text — no explanations, no labels, no markdown
- Preserve line breaks if the input has multiple lines`;

/**
 * System prompt for llama-3.3-70b-versatile used for template generation.
 */
export const LLAMA_TEMPLATE_SYSTEM_PROMPT = `You are CV Forge AI — a creative CV template designer. Given a natural language prompt describing a desired CV style, generate a template configuration that can be applied to the CV Forge platform.

Respond ONLY with valid JSON using this exact structure:

{
  "name": "<short template name, e.g. 'Midnight Gradient'>",
  "description": "<one-line description of the style>",
  "category": "<one of: Professional, Creative, Tech, Executive, Academic, Minimalist, Modern, Design>",
  "style": "<base style: minimalist | executive | techmodern | creative>",
  "layout": "<single-column | two-column>",
  "colors": {
    "primary": "<hex color for headers and key elements>",
    "secondary": "<hex color for secondary elements and borders>",
    "accent": "<hex accent color for highlights and icons>",
    "background": "<hex background color>",
    "text": "<hex text color>"
  },
  "fonts": {
    "heading": "<google font name for headings, e.g. 'Inter'>",
    "body": "<google font name for body text, e.g. 'Inter'>"
  }
}

Ensure colors form a cohesive, professional palette with sufficient contrast for readability.`;
