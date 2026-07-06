"use client";

import { useEffect, useRef, useState } from "react";

export default function CatCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let raf: number;
    let tx = -100, ty = -100;
    let cx = -100, cy = -100;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; setVisible(true); };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const tick = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.transform = `translate(${cx - 14}px, ${cy - 14}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none transition-opacity duration-200"
      style={{
        opacity: visible ? 1 : 0,
        willChange: "transform",
      }}
      aria-hidden
    >
      {/* SVG paw — orange on dark, visible always */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main pad */}
        <ellipse cx="14" cy="18" rx="7" ry="6" fill="#F97316" opacity="0.95"/>
        {/* Toe beans */}
        <ellipse cx="8" cy="12" rx="3" ry="3.5" fill="#F97316" opacity="0.95"/>
        <ellipse cx="14" cy="10" rx="3" ry="3.5" fill="#F97316" opacity="0.95"/>
        <ellipse cx="20" cy="12" rx="3" ry="3.5" fill="#F97316" opacity="0.95"/>
        {/* Inner pads (darker) */}
        <ellipse cx="14" cy="18.5" rx="4" ry="3.2" fill="#EA6A0F" opacity="0.7"/>
        <ellipse cx="8" cy="12.5" rx="1.6" ry="1.8" fill="#EA6A0F" opacity="0.7"/>
        <ellipse cx="14" cy="10.5" rx="1.6" ry="1.8" fill="#EA6A0F" opacity="0.7"/>
        <ellipse cx="20" cy="12.5" rx="1.6" ry="1.8" fill="#EA6A0F" opacity="0.7"/>
      </svg>
    </div>
  );
}
