"use client";

import { create } from "zustand";
import {
  CVData,
  PersonalInfo,
  Education,
  Experience,
  Skill,
  AdvancedData,
  Project,
  Language,
  CVTemplateId,
  StepId,
  EMPTY_CV,
  AuthUser,
} from "@/lib/schemas";
import { saveCVData, loadCVData, clearCVData } from "@/lib/storage";
import { isStepValid } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

// ─── Auth helpers (cookie-based) ───────────────────────────────────────────

async function fetchAuthUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const json = await res.json();
    return json.user;
  } catch {
    return null;
  }
}

async function fetchTokenBalance(): Promise<{ balance: number; expiresInDays: number }> {
  try {
    const res = await fetch("/api/tokens");
    if (!res.ok) return { balance: 0, expiresInDays: 0 };
    return await res.json();
  } catch {
    return { balance: 0, expiresInDays: 0 };
  }
}

// ─── Toast ─────────────────────────────────────────────────────────────────

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// ─── Store Interface ───────────────────────────────────────────────────────

interface CVStore {
  // CV Data
  data: CVData;
  currentStep: StepId;
  selectedTemplate: CVTemplateId;
  isDarkMode: boolean;
  hasData: boolean;
  toasts: ToastMessage[];

  // Auth
  user: AuthUser | null;
  isAuthLoading: boolean;
  tokenBalance: number;
  tokenExpiresInDays: number;

  // Initialization
  initialize: () => void;

  // Auth
  checkAuth: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Navigation
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Personal Info
  setPersonalInfo: (info: PersonalInfo) => void;
  updatePersonalField: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  removeEducation: (id: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: keyof Experience, value: string | string[]) => void;
  removeExperience: (id: string) => void;
  addResponsibility: (expId: string) => void;
  updateResponsibility: (expId: string, index: number, value: string) => void;
  removeResponsibility: (expId: string, index: number) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (id: string, field: keyof Skill, value: string | number) => void;
  removeSkill: (id: string) => void;

  // Advanced
  setAdvanced: (advanced: AdvancedData) => void;
  addProject: () => void;
  updateProject: (id: string, field: keyof Project, value: string) => void;
  removeProject: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (index: number, field: keyof Language, value: string) => void;
  removeLanguage: (index: number) => void;
  updateAdvancedArray: (field: keyof AdvancedData, index: number, value: string) => void;
  addAdvancedItem: (field: "certifications" | "extraQualifications" | "hobbies") => void;
  removeAdvancedItem: (field: "certifications" | "extraQualifications" | "hobbies", index: number) => void;

  // Template
  setTemplate: (template: CVTemplateId) => void;

  // Theme
  toggleTheme: () => void;

  // Data management
  resetData: () => void;
  autoSave: () => void;

  // Toasts
  addToast: (type: "success" | "error" | "info", message: string) => void;
  removeToast: (id: string) => void;
}

export const useCVStore = create<CVStore>((set, get) => ({
  // ─── Initial State ──────────────────────────────────────────────────────

  data: { ...EMPTY_CV },
  currentStep: 1,
  selectedTemplate: "minimalist",
  isDarkMode: true,
  hasData: false,
  toasts: [],

  user: null,
  isAuthLoading: true,
  tokenBalance: 0,
  tokenExpiresInDays: 0,

  // ─── Init ───────────────────────────────────────────────────────────────

  initialize: () => {
    const saved = loadCVData();
    if (saved) {
      set({ data: saved, hasData: true });
    }
    get().checkAuth();
  },

  // ─── Auth ───────────────────────────────────────────────────────────────

  checkAuth: async () => {
    set({ isAuthLoading: true });
    const user = await fetchAuthUser();
    if (user) {
      const tokens = await fetchTokenBalance();
      set({ user, tokenBalance: tokens.balance, tokenExpiresInDays: tokens.expiresInDays, isAuthLoading: false });
    } else {
      set({ user: null, tokenBalance: 0, tokenExpiresInDays: 0, isAuthLoading: false });
    }
  },

  refreshTokens: async () => {
    const tokens = await fetchTokenBalance();
    set({ tokenBalance: tokens.balance, tokenExpiresInDays: tokens.expiresInDays });
  },

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      set({ user: json.user });
      await get().refreshTokens();
      return true;
    } catch {
      return false;
    }
  },

  signup: async (name, email, password) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Signup failed");
      set({ user: json.user });
      await get().refreshTokens();
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, tokenBalance: 0, tokenExpiresInDays: 0 });
  },

  // ─── Navigation ─────────────────────────────────────────────────────────

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, data } = get();
    if (isStepValid(currentStep, data) && currentStep < 5) {
      set({ currentStep: (currentStep + 1) as StepId });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as StepId });
    }
  },

  // ─── Personal Info ──────────────────────────────────────────────────────

  setPersonalInfo: (info) => {
    set((state) => ({ data: { ...state.data, personalInfo: info } }));
    get().autoSave();
  },

  updatePersonalField: (field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, [field]: value },
      },
    }));
  },

  // ─── Education ──────────────────────────────────────────────────────────

  addEducation: () => {
    const newEdu: Education = {
      id: uuidv4(),
      instituteName: "",
      degree: "",
      passingYear: "",
      grade: "",
    };
    set((state) => ({
      data: { ...state.data, education: [...state.data.education, newEdu] },
    }));
  },

  updateEducation: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      },
    }));
    get().autoSave();
  },

  removeEducation: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((edu) => edu.id !== id),
      },
    }));
    get().autoSave();
  },

  // ─── Experience ─────────────────────────────────────────────────────────

  addExperience: () => {
    const newExp: Experience = {
      id: uuidv4(),
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      responsibilities: [""],
    };
    set((state) => ({
      data: { ...state.data, experience: [...state.data.experience, newExp] },
    }));
  },

  updateExperience: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    }));
    get().autoSave();
  },

  removeExperience: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter((exp) => exp.id !== id),
      },
    }));
    get().autoSave();
  },

  addResponsibility: (expId) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === expId
            ? { ...exp, responsibilities: [...exp.responsibilities, ""] }
            : exp
        ),
      },
    }));
  },

  updateResponsibility: (expId, index, value) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === expId
            ? {
                ...exp,
                responsibilities: exp.responsibilities.map((r, i) =>
                  i === index ? value : r
                ),
              }
            : exp
        ),
      },
    }));
    get().autoSave();
  },

  removeResponsibility: (expId, index) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === expId
            ? {
                ...exp,
                responsibilities: exp.responsibilities.filter((_, i) => i !== index),
              }
            : exp
        ),
      },
    }));
  },

  // ─── Skills ─────────────────────────────────────────────────────────────

  addSkill: () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: "",
      category: "Frontend",
      proficiency: 3,
    };
    set((state) => ({
      data: { ...state.data, skills: [...state.data.skills, newSkill] },
    }));
  },

  updateSkill: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.map((skill) =>
          skill.id === id ? { ...skill, [field]: value } : skill
        ),
      },
    }));
    get().autoSave();
  },

  removeSkill: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((skill) => skill.id !== id),
      },
    }));
    get().autoSave();
  },

  // ─── Advanced ───────────────────────────────────────────────────────────

  setAdvanced: (advanced) => {
    set((state) => ({ data: { ...state.data, advanced } }));
    get().autoSave();
  },

  addProject: () => {
    const newProject: Project = {
      id: uuidv4(),
      title: "",
      techStack: "",
      description: "",
      links: "",
    };
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          projects: [...state.data.advanced.projects, newProject],
        },
      },
    }));
  },

  updateProject: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          projects: state.data.advanced.projects.map((p) =>
            p.id === id ? { ...p, [field]: value } : p
          ),
        },
      },
    }));
    get().autoSave();
  },

  removeProject: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          projects: state.data.advanced.projects.filter((p) => p.id !== id),
        },
      },
    }));
    get().autoSave();
  },

  addLanguage: () => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          languages: [...state.data.advanced.languages, { language: "", proficiency: "" }],
        },
      },
    }));
  },

  updateLanguage: (index, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          languages: state.data.advanced.languages.map((lang, i) =>
            i === index ? { ...lang, [field]: value } : lang
          ),
        },
      },
    }));
    get().autoSave();
  },

  removeLanguage: (index) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          languages: state.data.advanced.languages.filter((_, i) => i !== index),
        },
      },
    }));
  },

  updateAdvancedArray: (field, index, value) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          [field]: (state.data.advanced[field] as string[]).map((item, i) =>
            i === index ? value : item
          ),
        },
      },
    }));
    get().autoSave();
  },

  addAdvancedItem: (field) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          [field]: [...(state.data.advanced[field] as string[]), ""],
        },
      },
    }));
  },

  removeAdvancedItem: (field, index) => {
    set((state) => ({
      data: {
        ...state.data,
        advanced: {
          ...state.data.advanced,
          [field]: (state.data.advanced[field] as string[]).filter((_, i) => i !== index),
        },
      },
    }));
  },

  // ─── Template ───────────────────────────────────────────────────────────

  setTemplate: (template) => set({ selectedTemplate: template }),

  // ─── Theme ──────────────────────────────────────────────────────────────

  toggleTheme: () =>
    set((state) => {
      const next = !state.isDarkMode;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return { isDarkMode: next };
    }),

  // ─── Data Management ────────────────────────────────────────────────────

  resetData: () => {
    clearCVData();
    set({ data: { ...EMPTY_CV }, hasData: false, currentStep: 1 });
  },

  autoSave: () => {
    const { data } = get();
    saveCVData(data);
    set({ hasData: true });
  },

  // ─── Toasts ─────────────────────────────────────────────────────────────

  addToast: (type, message) => {
    const id = uuidv4();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => get().removeToast(id), 5000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
