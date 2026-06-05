export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  summary: string;
  photo: string;
}

export interface Education {
  id: string;
  instituteName: string;
  degree: string;
  passingYear: string;
  grade: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  responsibilities: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "Tools"
  | "Design"
  | "Other";

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string;
  links: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface AdvancedData {
  projects: Project[];
  certifications: string[];
  extraQualifications: string[];
  hobbies: string[];
  languages: Language[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  advanced: AdvancedData;
}

export interface CVStorageData {
  data: CVData;
  createdAt: number;
  updatedAt: number;
}

export interface RateLimitState {
  count: number;
  resetTimestamp: number;
}

export type CVTemplateId = "minimalist" | "executive" | "techmodern" | "creative";

export type StepId = 1 | 2 | 3 | 4 | 5;

export interface StepConfig {
  id: StepId;
  label: string;
  description: string;
  category: "basic" | "intermediate" | "advanced";
}

export const STEPS: StepConfig[] = [
  { id: 1, label: "Personal Info", description: "Basic details & contact", category: "basic" },
  { id: 2, label: "Education", description: "Qualifications & degrees", category: "basic" },
  { id: 3, label: "Experience", description: "Work history & achievements", category: "intermediate" },
  { id: 4, label: "Skills", description: "Core competencies & tools", category: "intermediate" },
  { id: 5, label: "Advanced", description: "Projects, certs & more", category: "advanced" },
];

export interface AIScoreBreakdown {
  ats: number;
  impact: number;
  formatting: number;
  keywords: number;
  tone: number;
}

export interface AICheckResult {
  score: number;
  breakdown: AIScoreBreakdown;
  goodImpressions: string[];
  badImpressions: string[];
  actionItems: string[];
}

export interface PDFAnalysisResult extends AICheckResult {
  detailedOverview: string;
  weaknesses: string[];
  tipsToFix: string[];
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
}

export interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  style: CVTemplateId;
  layout: "single-column" | "two-column";
  colors: TemplateColors;
  fonts: TemplateFonts;
  generatedBy: string;
  generatedByEmail: string;
  downloads: number;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  tokens: {
    balance: number;
    expiresAt: string;
  };
}

export const EMPTY_CV: CVData = {
  personalInfo: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    summary: "",
    photo: "",
  },
  education: [],
  experience: [],
  skills: [],
  advanced: {
    projects: [],
    certifications: [],
    extraQualifications: [],
    hobbies: [],
    languages: [],
  },
};
