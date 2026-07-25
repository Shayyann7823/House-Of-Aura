"use client";

import { useEffect, useRef, useState } from "react";

export function LazyVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // screen se 200px pehle hi load start ho jaye
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad && (
        <video
          className="h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}