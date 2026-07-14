"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useCVStore } from "@/store/cv-store";
import { getRemainingGenerations } from "@/lib/rate-limit";
import { getInitials } from "@/lib/utils";
import { getFirebaseAuthModule } from "@/lib/firebase-client";
import { signOut } from "firebase/auth";

export function Header() {
  const router = useRouter();
  const hasData = useCVStore((s) => s.hasData);
  const user = useCVStore((s) => s.user);
  const tokenBalance = useCVStore((s) => s.tokenBalance);
  const pathname = usePathname();
  const auth = typeof window !== "undefined" ? getFirebaseAuthModule() : null;

  const handleLogout = useCallback(async () => {
    if (auth) await signOut(auth);
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }, [auth, router]);

  const remainingGens = getRemainingGenerations();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo + User Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-lightning-500 flex items-center justify-center shadow-lg shadow-lightning-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold gradient-text">CV Forge</h1>
                <p className="text-[10px] text-dark-400 dark:text-dark-500 hidden sm:block">
                  Professional Resume Builder
                </p>
              </div>
            </Link>

            {/* User Profile — visible on all pages when logged in */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-dark-200 dark:border-dark-700">
                <div className="w-8 h-8 rounded-lg bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center text-xs font-bold text-lightning-500 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-dark-800 dark:text-dark-200 leading-tight">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-dark-400 dark:text-dark-500">
                    <span className="flex items-center gap-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tokenBalance}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {remainingGens}
                    </span>
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
            )}
          </motion.div>

          {/* Right: Nav links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {pathname !== "/" && (
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 dark:text-dark-500 hover:text-lightning-500 hover:bg-lightning-500/10 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            )}
            {pathname !== "/builder" && (
              <Link
                href="/builder"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 dark:text-dark-500 hover:text-lightning-500 hover:bg-lightning-500/10 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Builder
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-lightning-500 hover:bg-lightning-500/10 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/resume-checker"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 dark:text-dark-500 hover:text-lightning-500 hover:bg-lightning-500/10 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  AI Resume Checker
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 dark:text-dark-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
                {/* Mobile: Dashboard + Profile */}
                <Link
                  href="/dashboard"
                  className="sm:hidden flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-lightning-500 hover:bg-lightning-500/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center text-[8px] font-bold text-lightning-500 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <span className="text-[10px]">{tokenBalance}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 dark:text-dark-500 hover:text-lightning-500 hover:bg-lightning-500/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-lightning text-xs px-4 py-1.5"
                >
                  Get Started
                </Link>
              </>
            )}
            {hasData && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Auto-saving
              </motion.span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
