export const STORAGE_KEY = "cv-generator-data";
export const RATE_LIMIT_KEY = "cv-generator-rate-limit";

export const EXPIRY_DAYS = 10;
export const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const MAX_GENERATIONS_PER_DAY = 10;
export const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "Design",
  "Other",
] as const;

export const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
export const GEMINI_MODEL_SCORING = "gemma-4-31b-it";

export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL_ENHANCE = "llama-3.3-70b-versatile";
export const GROQ_MODEL_TEMPLATE = "llama-3.3-70b-versatile";
export const GROQ_MODEL_ANALYSIS = "llama-3.3-70b-versatile";

export const AI_MAX_CHECKS_PER_DAY = 10;

export const DATA_DIR = "data";
export const RATE_LIMIT_FILE = "rate-limits.json";
export const COMMUNITY_TEMPLATES_FILE = "community-templates.json";
export const USERS_FILE = "users.json";
export const SCANS_FILE = "cv-scans.json";

export const TEMPLATE_CATEGORIES = [
  "Professional",
  "Creative",
  "Tech",
  "Executive",
  "Academic",
  "Minimalist",
  "Modern",
  "Design",
] as const;

export const GRANT_TOKENS_ON_SIGNUP = 50;
export const TOKEN_EXPIRY_DAYS = 7;
