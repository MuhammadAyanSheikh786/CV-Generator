"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ToastContainer } from "@/components/ui/toast";
import { useCVStore } from "@/store/cv-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFirebaseAuthModule, getGoogleProvider } from "@/lib/firebase-client";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function SignupPage() {
  const auth = typeof window !== "undefined" ? getFirebaseAuthModule() : null as any;
  const googleProvider = typeof window !== "undefined" ? getGoogleProvider() : null as any;
  const addToast = useCVStore((s) => s.addToast);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      const token = await cred.user.getIdToken();
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      addToast("success", "Account created! You received 50 free tokens.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      addToast("success", "Account created! You received 50 free tokens.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("auth/popup-closed-by-user")) return;
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <Header />
      <ToastContainer />

      <main className="relative max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-8"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-lightning-500/10 border border-lightning-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-lightning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              Create <span className="gradient-text">Account</span>
            </h1>
            <p className="text-sm text-dark-400 mt-2">
              Get 50 free tokens to analyze your CVs every week.
            </p>
          </div>

          {/* Google Sign-Up */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-800/50 hover:bg-dark-800 text-sm font-medium text-dark-200 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark-900 px-2 text-dark-500">or sign up with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl p-3"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="lightning"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating account..." : "Create Account"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-lightning-500/5 border border-lightning-500/20">
            <p className="text-xs text-dark-400 text-center">
              <span className="text-lightning-500 font-semibold">50 tokens</span> credited on signup,
              refreshed every <span className="text-lightning-500 font-semibold">7 days</span>.
              Each CV scan costs <span className="text-lightning-500 font-semibold">1 token</span>.
            </p>
          </div>

          <p className="text-center text-sm text-dark-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-lightning-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
