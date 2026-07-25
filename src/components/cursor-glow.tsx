"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 h-[500px] w-[500px] rounded-full opacity-[0.18] blur-[80px] transition-transform duration-100 ease-out z-0"
      style={{ background: "radial-gradient(circle, #C9A15A 0%, transparent 70%)" }}
    />
  );
}