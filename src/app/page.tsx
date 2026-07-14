"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/store/cv-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getFirebaseAuthModule } from "@/lib/firebase-client";
import { signOut } from "firebase/auth";
import { getInitials } from "@/lib/utils";
import { getRemainingGenerations } from "@/lib/rate-limit";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "AI Resume Checker",
    description: "Get a comprehensive multi-dimensional AI analysis of your CV. Score across ATS compliance, impact, formatting, keywords, and tone with actionable feedback.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 15.5L14 19l3.5-4.5L21 21l-3.5-5.5z" />
      </svg>
    ),
    title: "AI Text Enhancement",
    description: "Polish your professional summary and bullet points instantly with AI. Refine raw text into powerful, achievement-oriented content that stands out to recruiters.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Multi-Step Wizard",
    description: "Guided step-by-step process that makes building your CV effortless. Just fill in the details and we handle the formatting.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Professional Templates",
    description: "Choose from 4 expertly designed templates — or generate your own with AI. Minimalist, Executive, Tech Modern, Creative, and community creations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Export to PDF & PNG",
    description: "Download your CV as a high-quality PDF or PNG with a single click. Ready to print or share digitally.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Skill Proficiency Tracking",
    description: "Rate your skills across categories with a visual proficiency scale. Showcase your strengths at a glance.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Live Preview",
    description: "See your CV come to life in real-time as you type. No surprises — what you see is exactly what you get.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Auto-Save & Resume",
    description: "Your progress is automatically saved. Leave anytime and pick up right where you left off.",
  },
];

const templates = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, typography-focused design with plenty of white space. Perfect for traditional industries.",
    gradient: "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
    accent: "bg-slate-500",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Two-column corporate layout with a refined sidebar. Ideal for senior roles and management.",
    gradient: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950",
    accent: "bg-blue-600",
  },
  {
    id: "techmodern",
    name: "Tech Modern",
    description: "Dark, terminal-inspired design for tech professionals. Stand out with a modern aesthetic.",
    gradient: "from-zinc-800 to-zinc-900",
    accent: "bg-emerald-500",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold gradient accents and vibrant colors for design-forward portfolios and creative roles.",
    gradient: "from-rose-50 to-amber-50 dark:from-rose-950 dark:to-amber-950",
    accent: "bg-gradient-to-r from-rose-500 to-amber-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Fill Your Details",
    description: "Complete your personal info, education, experience, skills, and more through our intuitive multi-step form.",
  },
  {
    number: "02",
    title: "Pick a Template",
    description: "Choose from 4 professionally designed templates and see a live preview of your CV instantly.",
  },
  {
    number: "03",
    title: "Download & Share",
    description: "Export your finished CV as a polished PDF or PNG. Ready to send to employers in minutes.",
  },
];

export default function Home() {
  const router = useRouter();
  const { isDarkMode } = useCVStore();
  const user = useCVStore((s) => s.user);
  const tokenBalance = useCVStore((s) => s.tokenBalance);
  const auth = typeof window !== "undefined" ? getFirebaseAuthModule() : null;
  const remainingGens = getRemainingGenerations();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    if (auth) await signOut(auth);
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }, [auth, router]);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-900 dark:text-dark-100">
      <div className="fixed inset-0 bg-grid-light dark:bg-grid pointer-events-none" />

      {/* Premium AI Ribbon */}
      <div className="relative z-50 bg-gradient-to-r from-lightning-500/10 via-lightning-500/5 to-lightning-500/10 border-b border-lightning-500/10">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-dark-600 dark:text-dark-300">
            <svg className="w-4 h-4 text-lightning-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            We use <span className="font-bold text-lightning-500">paid premium AI</span> — Gemini, Claude &amp; Groq.
          </span>
          <span className="text-xs sm:text-sm font-semibold text-dark-500 dark:text-dark-400">
            You get it <span className="text-green-500 font-bold">100% free</span>. No catch.
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-40 border-b border-dark-100/50 dark:border-dark-800/50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-lightning-500 flex items-center justify-center shadow-lg shadow-lightning-500/30 group-hover:shadow-lightning-500/50 transition-shadow">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-base sm:text-xl font-bold gradient-text">CV Forge</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-dark-500 dark:text-dark-400 hover:text-lightning-500 dark:hover:text-lightning-500 transition-colors">Features</a>
              <a href="#templates" className="text-sm text-dark-500 dark:text-dark-400 hover:text-lightning-500 dark:hover:text-lightning-500 transition-colors">Templates</a>
              <a href="#how-it-works" className="text-sm text-dark-500 dark:text-dark-400 hover:text-lightning-500 dark:hover:text-lightning-500 transition-colors">How It Works</a>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-lightning-500 hover:bg-lightning-500/10 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    AI Resume Checker
                  </Link>
                  <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-dark-200 dark:border-dark-700">
                    <div className="w-7 h-7 rounded-lg bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center text-[10px] font-bold text-lightning-500 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-semibold text-dark-800 dark:text-dark-200 leading-tight">{user.name}</p>
                      <div className="flex items-center gap-2 text-[9px] text-dark-400 dark:text-dark-500">
                        <span>{tokenBalance} tokens</span>
                        <span>{remainingGens} gens</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-1 p-1.5 rounded-lg text-dark-400 dark:text-dark-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Logout"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                  {/* Mobile: show avatar + dashboard */}
                  <Link
                    href="/dashboard"
                    className="sm:hidden flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-lightning-500"
                  >
                    <div className="w-6 h-6 rounded-md bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center text-[8px] font-bold overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-dark-500 dark:text-dark-400 hover:text-lightning-500 dark:hover:text-lightning-500 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-lightning text-xs sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2.5"
                  >
                    <span className="hidden sm:inline">Sign Up Free</span>
                    <span className="sm:hidden">Free</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </>
              )}
              <ThemeToggle />
              <Link
                href="/builder"
                className="btn-lightning text-xs sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2.5"
              >
                <span className="hidden sm:inline">Build Your CV</span>
                <span className="sm:hidden">Build</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-20 sm:pb-36">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-lightning-500/5 dark:bg-lightning-500/10 blur-[120px] pointer-events-none" />

            {/* Floating AI Badges */}
            <div className="hidden sm:block pointer-events-none select-none">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 left-4 lg:left-16 xl:left-24"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-dark-200/50 dark:border-dark-700/50 shadow-lg">
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <span className="text-xs font-semibold text-dark-700 dark:text-dark-200">Gemini AI</span>
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md">Paid</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-24 right-4 lg:right-16 xl:right-24"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-dark-200/50 dark:border-dark-700/50 shadow-lg">
                  <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm3 7h-4V7h2v4h2v2z"/></svg>
                  <span className="text-xs font-semibold text-dark-700 dark:text-dark-200">Claude AI</span>
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md">Paid</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-36 left-8 lg:left-20"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-dark-200/50 dark:border-dark-700/50 shadow-lg">
                  <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  <span className="text-xs font-semibold text-dark-700 dark:text-dark-200">Groq Cloud</span>
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md">Paid</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-48 right-6 lg:right-20"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-dark-200/50 dark:border-dark-700/50 shadow-lg">
                  <svg className="w-4 h-4 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" /></svg>
                  <span className="text-xs font-semibold text-dark-700 dark:text-dark-200">AI Template Gen</span>
                  <span className="text-[10px] font-medium text-lightning-600 dark:text-lightning-400 bg-lightning-500/10 px-1.5 py-0.5 rounded-md">Free</span>
                </div>
              </motion.div>
            </div>

            <div className="relative text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border border-lightning-500/20 bg-lightning-500/5 text-lightning-600 dark:text-lightning-400 mb-4 sm:mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-lightning-500 animate-pulse" />
                  Free AI-Powered CV Builder
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
              >
                Forge a CV That
                <br />
                <span className="gradient-text">Opens Doors</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 sm:mt-6 text-base sm:text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
              >
                Build stunning, professional CVs in minutes with our powerful builder.
                Choose from expert-crafted templates, customize every detail, and download
                as PDF or PNG — all for free.
              </motion.p>

              {/* Mobile AI badges row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="sm:hidden mt-6 flex flex-wrap items-center justify-center gap-2"
              >
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-dark-800/80 border border-dark-200/50 dark:border-dark-700/50 text-[10px] font-medium text-dark-600 dark:text-dark-300">
                  <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                  Gemini <span className="text-green-500 font-bold">Free</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-dark-800/80 border border-dark-200/50 dark:border-dark-700/50 text-[10px] font-medium text-dark-600 dark:text-dark-300">
                  <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                  Claude <span className="text-green-500 font-bold">Free</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-dark-800/80 border border-dark-200/50 dark:border-dark-700/50 text-[10px] font-medium text-dark-600 dark:text-dark-300">
                  <svg className="w-3 h-3 text-purple-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                  Groq <span className="text-green-500 font-bold">Free</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-dark-800/80 border border-dark-200/50 dark:border-dark-700/50 text-[10px] font-medium text-dark-600 dark:text-dark-300">
                  <svg className="w-3 h-3 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l.75-3.75L2 9l7.5-1.5L12 2l4.5 7.5L18.5 7l.5 4.5" /></svg>
                  Template Gen
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <Link
                  href="/builder"
                  className="btn-lightning text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                >
                  Build Your CV Free
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#features"
                  className="btn-ghost text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                >
                  Explore Features
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
              >
                {[
                  { value: "8+", label: "AI Features & Templates" },
                  { value: "5", label: "Form Steps" },
                  { value: "2", label: "Export Formats" },
                  { value: "100%", label: "Free to Use" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-[10px] sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5 sm:mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works - AI Flow */}
      <section className="relative py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { step: "01", title: "Build or Upload", desc: "Use our multi-step builder or upload your existing CV PDF in seconds." },
              { step: "02", title: "AI Analyzes", desc: "Our premium AI scans for ATS compliance, impact, keywords, and tone." },
              { step: "03", title: "Get Results", desc: "Receive a detailed 1-100 score with actionable tips to improve." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="card-3d p-4 sm:p-5 text-center"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-bold text-lightning-500">{item.step}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-dark-100 mb-1">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-dark-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Powered By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-3d p-5 sm:p-8 text-center mt-4 sm:mt-6"
          >
            <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-dark-400 mb-3 sm:mb-4">
              Powered by Premium AI Technology
            </h3>
            <p className="text-xs sm:text-sm text-dark-300 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
              CV Forge leverages <span className="text-lightning-500 font-semibold">Gemini Advanced</span>,{" "}
              <span className="text-lightning-500 font-semibold">Claude</span>, and{" "}
              <span className="text-lightning-500 font-semibold">Groq Cloud</span> — the same enterprise-grade AI models
              used by Fortune 500 companies. Get professional-grade CV analysis and enhancement,{" "}
              <span className="font-bold text-dark-100"> completely free</span>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-dark-500">
              <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lightning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Next.js 14
              </span>
              <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lightning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                TypeScript
              </span>
              <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lightning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Tailwind CSS
              </span>
              <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lightning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Prisma ORM
              </span>
              <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lightning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Framer Motion
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.span variants={fadeUp} className="text-[10px] sm:text-sm font-semibold text-lightning-500 tracking-wider uppercase">Features</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold px-2 sm:px-0">
              Everything You Need to
              <br />
              <span className="gradient-text">Build the Perfect CV</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 sm:mt-4 text-xs sm:text-base text-dark-500 dark:text-dark-400 max-w-xl mx-auto px-4 sm:px-0">
              From guided forms to professional templates, we&apos;ve got every detail covered.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="card-3d p-4 sm:p-8 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-lightning-500/10 dark:bg-lightning-500/5 border border-lightning-500/20 flex items-center justify-center text-lightning-500 mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-dark-900 dark:text-dark-100 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="relative py-16 sm:py-32 bg-dark-50/50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.span variants={fadeUp} className="text-[10px] sm:text-sm font-semibold text-lightning-500 tracking-wider uppercase">Templates</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold">
              Choose Your
              <br />
              <span className="gradient-text">Perfect Style</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 sm:mt-4 text-xs sm:text-base text-dark-500 dark:text-dark-400 max-w-xl mx-auto px-4 sm:px-0">
              Four unique designs, each crafted to make your experience shine.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-3 sm:gap-6"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                variants={fadeUp}
                className="card-3d p-4 sm:p-8 group"
              >
                {/* Template preview block */}
                <div className={`h-28 sm:h-48 rounded-xl bg-gradient-to-br ${template.gradient} mb-3 sm:mb-5 flex items-center justify-center overflow-hidden relative`}>
                  <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg ${template.accent} opacity-20`} />
                  <div className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 rounded-full ${template.accent} opacity-10`} />
                  <div className={`absolute bottom-5 sm:bottom-8 left-2 sm:left-3 right-5 sm:right-8 h-1.5 sm:h-2 rounded-full ${template.accent} opacity-8`} />
                  <div className={`absolute bottom-8 sm:bottom-14 left-2 sm:left-3 w-8 sm:w-12 h-1.5 sm:h-2 rounded-full ${template.accent} opacity-6`} />
                  <span className="text-[10px] sm:text-xs font-mono text-dark-400 dark:text-dark-500 opacity-50">{template.id}</span>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-dark-900 dark:text-dark-100 mb-1 sm:mb-2">{template.name}</h3>
                <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 leading-relaxed">{template.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-10"
          >
            <Link href="/builder" className="btn-lightning text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              Start Building — It&apos;s Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.span variants={fadeUp} className="text-[10px] sm:text-sm font-semibold text-lightning-500 tracking-wider uppercase">How It Works</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold">
              Three Simple Steps to
              <br />
              <span className="gradient-text">Your Dream CV</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-lightning-500/20 via-lightning-500/40 to-lightning-500/20" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-lightning-500/10 dark:bg-lightning-500/5 border border-lightning-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 relative z-10">
                  <span className="text-base sm:text-xl font-bold gradient-text">{step.number}</span>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-dark-900 dark:text-dark-100 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 leading-relaxed max-w-xs mx-auto px-2 sm:px-0">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-32 bg-dark-50/50 dark:bg-dark-900/50">
        <div className="absolute inset-0 bg-grid-light dark:bg-grid pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-lightning-500/5 dark:bg-lightning-500/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-3d p-6 sm:p-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Ready to Build Your
              <br />
              <span className="gradient-text">Professional CV?</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-dark-500 dark:text-dark-400 max-w-lg mx-auto px-2 sm:px-0">
              Join thousands of professionals who have already forged their career with CV Forge.
            </p>

            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto mb-8 sm:mb-10">
              {[
                { value: "1K+", label: "CVs Created" },
                { value: "4", label: "Templates" },
                { value: "100%", label: "Free" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-dark-500 dark:text-dark-400 mt-0.5 sm:mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/builder"
              className="btn-lightning text-sm sm:text-base px-6 sm:px-10 py-3 sm:py-4 inline-flex w-full sm:w-auto"
            >
              Build Your CV Now
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-lightning-500 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold gradient-text">CV Forge</span>
            </div>
            <p className="text-[10px] sm:text-xs text-dark-500 dark:text-dark-500 text-center sm:text-left">
              Built By AM Studio — free for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
