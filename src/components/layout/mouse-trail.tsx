"use client";

import { useEffect, useRef } from "react";
import { useCVStore } from "@/store/cv-store";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isDarkMode = useCVStore((s) => s.isDarkMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: t.clientY };
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);

    const animate = () => {
      const { x, y } = mouseRef.current;

      // Spawn particles
      for (let i = 0; i < 2; i++) {
        if (x > 0 && y > 0) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.5;
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            life: 0,
            maxLife: 30 + Math.random() * 40,
            size: 1.5 + Math.random() * 3,
            hue: 348 + Math.random() * 20 - 10,
          });
        }
      }

      // Cap particles
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-150);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vx *= 0.98;
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = isDarkMode
          ? Math.sin(progress * Math.PI) * 0.6
          : Math.sin(progress * Math.PI) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode
          ? `hsla(${p.hue}, 100%, 50%, ${alpha})`
          : `hsla(${p.hue}, 80%, 40%, ${alpha})`;
        ctx.fill();

        if (progress > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5) * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode
            ? `hsla(${p.hue}, 80%, 80%, ${alpha * 0.5})`
            : `hsla(${p.hue}, 60%, 60%, ${alpha * 0.3})`;
          ctx.fill();
        }

        return p.life < p.maxLife;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  );
}
