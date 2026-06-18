"use client";

import { useEffect } from "react";
import { useCVStore } from "@/store/cv-store";
import { MouseTrail } from "@/components/layout/mouse-trail";
import { getFirebaseAuthModule } from "@/lib/firebase-client";
import { onAuthStateChanged } from "firebase/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useCVStore((s) => s.initialize);
  const checkAuth = useCVStore((s) => s.checkAuth);
  const isDarkMode = useCVStore((s) => s.isDarkMode);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const auth = getFirebaseAuthModule();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        document.cookie = "token=; path=/; max-age=0";
      }
      checkAuth();
    });

    return () => unsubscribe();
  }, [checkAuth]);

  return (
    <>
      <MouseTrail />
      {children}
    </>
  );
}
