"use client";

import { useCallback, useEffect, useRef } from "react";

// Synthesized cat sounds using Web Audio API — no external files needed
function createMeow(ctx: AudioContext, variation: number = 0) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  filter.type = "bandpass";
  filter.frequency.value = 800 + variation * 200;
  filter.Q.value = 8;

  const now = ctx.currentTime;
  const dur = 0.3 + Math.random() * 0.3;

  // Meow frequency contour
  osc.frequency.setValueAtTime(400 + variation * 100, now);
  osc.frequency.linearRampToValueAtTime(700 + variation * 150, now + dur * 0.4);
  osc.frequency.linearRampToValueAtTime(350 + variation * 80, now + dur);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gain.gain.linearRampToValueAtTime(0.1, now + dur * 0.6);
  gain.gain.linearRampToValueAtTime(0, now + dur);

  osc.type = "sawtooth";
  osc.start(now);
  osc.stop(now + dur);
}

function createPurr(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sawtooth";
  osc.frequency.value = 28;

  const filter = ctx.createBiquadFilter();
  osc.disconnect();
  osc.connect(filter);
  filter.connect(gain);
  filter.type = "lowpass";
  filter.frequency.value = 300;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
  gain.gain.linearRampToValueAtTime(0, now + 0.7);

  osc.start(now);
  osc.stop(now + 0.7);
}

function createSwipe(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.linearRampToValueAtTime(200, now + 0.12);
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.12);
  osc.type = "sine";
  osc.start(now);
  osc.stop(now + 0.15);
}

// Global AudioContext singleton
let _ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) _ctx = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

// Hook — use this in components
export function useCatSound() {
  const playMeow = useCallback((variation?: number) => {
    const ctx = getCtx();
    if (!ctx) return;
    createMeow(ctx, variation ?? Math.floor(Math.random() * 5));
  }, []);

  const playPurr = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    createPurr(ctx);
  }, []);

  const playSwipe = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    createSwipe(ctx);
  }, []);

  return { playMeow, playPurr, playSwipe };
}

// Component that plays random meows on click anywhere (for landing page fun)
export default function AmbientCatSounds() {
  const enabled = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!enabled.current) { enabled.current = true; return; }
      // 8% chance on any click
      if (Math.random() > 0.08) return;
      const ctx = getCtx();
      if (!ctx) return;
      createMeow(ctx, Math.floor(Math.random() * 6));
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return null;
}
