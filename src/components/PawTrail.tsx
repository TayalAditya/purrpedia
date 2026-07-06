"use client";

import { useEffect, useRef } from "react";
import { useCatSound } from "./CatSounds";

interface Paw { x: number; y: number; t: number; flipped: boolean; angle: number; }

const STORAGE_KEY = "purrpedia_paws_v2";
const MIN_DIST = 38;   // pixels between paws
const MAX_PAWS = 200;  // keep last 200

function loadPaws(): Paw[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function savePaws(paws: Paw[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(paws.slice(-MAX_PAWS))); } catch {}
}

export default function PawTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pawsRef = useRef<Paw[]>(loadPaws());
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const stepRef = useRef(0);
  const rafRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { playMeow } = useCatSound();

  useEffect(() => {
    // Build SVG paw image (theme-aware via CSS var, but we use orange always for visibility)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <ellipse cx="16" cy="21" rx="8" ry="7" fill="#F97316" opacity="0.9"/>
      <ellipse cx="8.5" cy="13" rx="3.5" ry="4" fill="#F97316" opacity="0.9"/>
      <ellipse cx="16" cy="11" rx="3.5" ry="4" fill="#F97316" opacity="0.9"/>
      <ellipse cx="23.5" cy="13" rx="3.5" ry="4" fill="#F97316" opacity="0.9"/>
      <ellipse cx="16" cy="21.5" rx="4.5" ry="3.5" fill="#C2530A" opacity="0.6"/>
      <ellipse cx="8.5" cy="13.5" rx="1.8" ry="2" fill="#C2530A" opacity="0.5"/>
      <ellipse cx="16" cy="11.5" rx="1.8" ry="2" fill="#C2530A" opacity="0.5"/>
      <ellipse cx="23.5" cy="13.5" rx="1.8" ry="2" fill="#C2530A" opacity="0.5"/>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    imgRef.current = img;

    // Canvas sizing
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Render loop
    const FADE_MS = 5000;
    const draw = () => {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      if (!imgRef.current?.complete) { rafRef.current = requestAnimationFrame(draw); return; }

      pawsRef.current.forEach(p => {
        const age = now - p.t;
        if (age > FADE_MS) return;
        const opacity = Math.max(0, (1 - age / FADE_MS) * 0.85);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        if (p.flipped) ctx.scale(-1, 1);
        ctx.drawImage(imgRef.current!, -16, -16, 32, 32);
        ctx.restore();
      });
      // Clean old paws
      pawsRef.current = pawsRef.current.filter(p => now - p.t < FADE_MS);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    // Mouse move → add paws
    const onMove = (e: MouseEvent) => {
      const mx = e.clientX, my = e.clientY;
      const last = lastPosRef.current;
      if (last) {
        const dx = mx - last.x, dy = my - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST) return;
        // Alternate left/right offset perpendicular to direction
        const angle = Math.atan2(dy, dx);
        const perp = angle + Math.PI / 2;
        const side = stepRef.current % 2 === 0 ? 1 : -1;
        const offset = 14 * side;
        const px = mx + Math.cos(perp) * offset;
        const py = my + Math.sin(perp) * offset;
        const paw: Paw = { x: px, y: py, t: Date.now(), flipped: side < 0, angle };
        pawsRef.current = [...pawsRef.current.slice(-MAX_PAWS + 1), paw];
        savePaws(pawsRef.current);
        stepRef.current++;
      }
      lastPosRef.current = { x: mx, y: my };
    };

    // Click = meow
    const onClick = () => playMeow();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      URL.revokeObjectURL(url);
    };
  }, [playMeow]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden
    />
  );
}
