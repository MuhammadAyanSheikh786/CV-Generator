"use client";

import { useEffect } from "react";
import { useCVStore } from "@/store/cv-store";
import { MouseTrail } from "@/components/layout/mouse-trail";

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useCVStore((s) => s.initialize);
  const isDarkMode = useCVStore((s) => s.isDarkMode);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <MouseTrail />
      {children}
    </>
  );
}
