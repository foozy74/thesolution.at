"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, X, Info } from "lucide-react";

export interface FormulaBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  showFormulaBadge?: boolean;
  baseSpeed?: number;
  opacity?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  scale: number;
  alpha: number;
}

interface Mote {
  n: number;
  strandIndex: number;
  speed: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
}

// Evaluation of the exact mathematical formula F(n, t)
export function evaluateFormula(n: number, t: number): Point3D {
  const x = Math.pow(Math.max(0, n), 1.5) / (n + 1000);
  const y = Math.sin(0.1 * n * Math.sin(83.3333 * t));
  const z = 0.1 * n * t;
  return { x, y, z };
}

// Mathematical constants for F(n, t)
const T_PERIOD = (2 * Math.PI) / 83.3333; // ≈ 0.07539825 s
const N_MAX = 280;
const NUM_STRANDS = 6;
const POINTS_PER_STRAND = 140;
const NUM_MOTES = 24;

export function FormulaBackground({
  className = "",
  style,
  showFormulaBadge = true,
  baseSpeed = 1.0,
  opacity = 0.5,
}: FormulaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Purely informational badge modal (no manual curve controls)
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  // Mouse rotation targets for parallax
  const mouseRotX = useRef(0);
  const mouseRotY = useRef(0);
  const currentRotX = useRef(0);
  const currentRotY = useRef(0);

  // Autonomous time accumulators
  const animTime = useRef(0);
  const totalElapsed = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const prefersReducedMotion = useRef(false);

  // Motes / floating energy quanta along the curves
  const motesRef = useRef<Mote[]>([]);

  // Initialize motes
  useEffect(() => {
    const motes: Mote[] = [];
    for (let i = 0; i < NUM_MOTES; i++) {
      motes.push({
        n: Math.random() * N_MAX,
        strandIndex: Math.floor(Math.random() * NUM_STRANDS),
        speed: 8 + Math.random() * 14,
        size: 1.2 + Math.random() * 1.6,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.2 + Math.random() * 1.8,
      });
    }
    motesRef.current = motes;
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = media.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Gentle mouse parallax
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRotY.current = nx * 0.18; // smooth subtle yaw
    mouseRotX.current = -ny * 0.12; // smooth subtle pitch
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRotX.current = 0;
    mouseRotY.current = 0;
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;

    // Handle high DPI retina display sizing safely
    const handleResize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const clientW = container.clientWidth || window.innerWidth;
      const clientH = container.clientHeight || window.innerHeight;
      if (clientW <= 0 || clientH <= 0) return;

      const clampedW = Math.min(clientW, 3840);
      const clampedH = Math.min(clientH, 2160);

      const targetW = Math.floor(clampedW * dpr);
      const targetH = Math.floor(clampedH * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Visibility observer to pause loop when off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Characteristic bounds for normalization
    const xMax = Math.pow(N_MAX, 1.5) / (N_MAX + 1000); // ≈ 3.66
    const zMax = 0.1 * N_MAX * T_PERIOD; // ≈ 2.11

    // Render step
    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      if (!isVisibleRef.current) {
        lastTimeRef.current = time;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      totalElapsed.current += dt;

      // Ultra-soft rate: slow, hypnotic wave progression (~55s per breathing cycle)
      const speedScale = prefersReducedMotion.current ? 0.04 : baseSpeed;
      const SIM_SPEED_FACTOR = 0.0014;
      animTime.current += dt * SIM_SPEED_FACTOR * speedScale;

      // Organic autonomous drift: self-evolving perspective even without user mouse interaction
      const autoDriftPitch = 0.03 * Math.sin(totalElapsed.current * 0.06);
      const autoDriftYaw = 0.05 * Math.sin(totalElapsed.current * 0.04 + 1.0);

      // Smooth camera interpolation with heavy damping
      currentRotX.current += (mouseRotX.current + autoDriftPitch - currentRotX.current) * 0.03;
      currentRotY.current += (mouseRotY.current + autoDriftYaw - currentRotY.current) * 0.03;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      if (width <= 0 || height <= 0) return;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Camera parameters
      const basePitch = 0.15 + currentRotX.current;
      const baseYaw = -0.1 + currentRotY.current;
      const cosYaw = Math.cos(baseYaw);
      const sinYaw = Math.sin(baseYaw);
      const cosPitch = Math.cos(basePitch);
      const sinPitch = Math.sin(basePitch);

      const fov = 900;
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      // Autonomous breathing amplitude: naturally swells and subsides like calm deep water
      const autoBreathing = 0.88 + 0.16 * Math.sin(totalElapsed.current * 0.08);
      const scaleX = (width * 0.98) / xMax;
      const scaleY = Math.min(60, height * 0.09) * autoBreathing;
      const scaleZ = (width * 0.25) / zMax;

      // Store projected points for all strands
      const strandPoints: ProjectedPoint[][] = [];
      const strandAlphas: number[] = [];

      for (let s = 0; s < NUM_STRANDS; s++) {
        // Self-evolving strand phase modulation: strands gently expand and interlock
        const phaseEvolution = 0.05 * T_PERIOD * Math.sin(totalElapsed.current * 0.05 + s * 1.2);
        const strandPhase = (s / NUM_STRANDS) * T_PERIOD + phaseEvolution;
        const strandTime = (animTime.current + strandPhase) % T_PERIOD;

        // Smooth sinusoidal Hann window ensures zero discontinuities at cycle seams
        const rawAlpha = Math.sin((Math.PI * strandTime) / T_PERIOD);
        const windowAlpha = Math.pow(Math.max(0, rawAlpha), 1.4);
        strandAlphas.push(windowAlpha);

        const points: ProjectedPoint[] = [];

        for (let i = 0; i < POINTS_PER_STRAND; i++) {
          const n = (i / (POINTS_PER_STRAND - 1)) * N_MAX;
          const { x, y, z } = evaluateFormula(n, strandTime);

          // Center coordinates relative to formula bounds
          const Xw = (x - xMax * 0.5) * scaleX;
          const Yw = y * scaleY;
          const Zw = (z - zMax * 0.5) * scaleZ;

          // 3D Rotation (Yaw then Pitch)
          const X1 = Xw * cosYaw + Zw * sinYaw;
          const Y1 = Yw;
          const Z1 = -Xw * sinYaw + Zw * cosYaw;

          const X2 = X1;
          const Y2 = Y1 * cosPitch - Z1 * sinPitch;
          const Z2 = Y1 * sinPitch + Z1 * cosPitch;

          // Perspective projection
          const p = fov / (fov + Z2);
          const px = centerX + X2 * p;
          const py = centerY - Y2 * p;

          // Soft edge fade: curves gently dissolve before hitting the screen margins
          const edgeFade = Math.sin((Math.PI * i) / (POINTS_PER_STRAND - 1));

          points.push({ x: px, y: py, z: Z2, scale: p, alpha: edgeFade });
        }
        strandPoints.push(points);
      }

      // Faint organic cross-connections (breathing lattice)
      ctx.lineWidth = 1;
      for (let s = 0; s < NUM_STRANDS - 1; s++) {
        const pStrand1 = strandPoints[s];
        const pStrand2 = strandPoints[s + 1];
        const blendedAlpha = Math.min(strandAlphas[s], strandAlphas[s + 1]);

        if (blendedAlpha > 0.08) {
          const step = 12;
          for (let i = 12; i < POINTS_PER_STRAND - 12; i += step) {
            const pt1 = pStrand1[i];
            const pt2 = pStrand2[i];
            const pointEdge = Math.min(pt1.alpha, pt2.alpha);

            const filamentAlpha =
              blendedAlpha * 0.08 * opacity * pointEdge * Math.min(pt1.scale, 1.1);

            ctx.strokeStyle = `rgba(125, 211, 192, ${filamentAlpha})`;
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
          }
        }
      }

      // Draw the primary mathematical curve ribbons with smooth Bézier splines
      for (let s = 0; s < NUM_STRANDS; s++) {
        const points = strandPoints[s];
        const strandAlpha = strandAlphas[s];
        if (strandAlpha < 0.02) continue;

        const effectiveAlpha = strandAlpha * opacity;

        // Elegant flowing gradient from Teal (#7dd3c0) to Cyan (#5b9bd5) to Soft Purple (#9b8fb8)
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0.0, "rgba(125, 211, 192, 0.75)");
        gradient.addColorStop(0.5, "rgba(91, 155, 213, 0.8)");
        gradient.addColorStop(1.0, "rgba(155, 143, 184, 0.65)");

        // Pass 1: Soft ambient glow halo
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.6;
        ctx.globalAlpha = 0.16 * effectiveAlpha;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();

        // Pass 2: Clean, silky ribbon curve
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.65 * effectiveAlpha;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;

      // Update and render gentle quantum motes drifting along curves
      motesRef.current.forEach((mote) => {
        mote.n = (mote.n + mote.speed * dt * speedScale) % N_MAX;
        mote.pulsePhase += dt * mote.pulseSpeed;

        const sIdx = mote.strandIndex;
        const phaseEvolution = 0.05 * T_PERIOD * Math.sin(totalElapsed.current * 0.05 + sIdx * 1.2);
        const strandPhase = (sIdx / NUM_STRANDS) * T_PERIOD + phaseEvolution;
        const strandTime = (animTime.current + strandPhase) % T_PERIOD;
        const rawAlpha = Math.sin((Math.PI * strandTime) / T_PERIOD);
        const windowAlpha = Math.pow(Math.max(0, rawAlpha), 1.4);

        if (windowAlpha < 0.06) return;

        const { x, y, z } = evaluateFormula(mote.n, strandTime);
        const Xw = (x - xMax * 0.5) * scaleX;
        const Yw = y * scaleY;
        const Zw = (z - zMax * 0.5) * scaleZ;

        const X1 = Xw * cosYaw + Zw * sinYaw;
        const Y1 = Yw;
        const Z1 = -Xw * sinYaw + Zw * cosYaw;

        const X2 = X1;
        const Y2 = Y1 * cosPitch - Z1 * sinPitch;
        const Z2 = Y1 * sinPitch + Z1 * cosPitch;

        const p = fov / (fov + Z2);
        const px = centerX + X2 * p;
        const py = centerY - Y2 * p;

        const edgeFactor = Math.sin((Math.PI * mote.n) / N_MAX);
        const pulse = 0.75 + 0.25 * Math.sin(mote.pulsePhase);
        const moteRadius = Math.max(0.8, mote.size * p * pulse);
        const moteAlpha = Math.min(1, windowAlpha * opacity * 0.75 * edgeFactor);

        if (moteAlpha <= 0.01) return;

        // Soft radial glow point
        const radGlow = ctx.createRadialGradient(px, py, 0, px, py, moteRadius * 3.5);
        radGlow.addColorStop(0, `rgba(255, 255, 255, ${moteAlpha})`);
        radGlow.addColorStop(0.35, `rgba(125, 211, 192, ${moteAlpha * 0.7})`);
        radGlow.addColorStop(1, "rgba(91, 155, 213, 0)");

        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(px, py, moteRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [baseSpeed, opacity]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Primary HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Discreet, read-only Math Badge (No sliders or adjustment controls) */}
      {showFormulaBadge && (
        <div
          className="flex flex-col items-start gap-2"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "2rem",
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          {/* Read-Only Info Card */}
          {isOpenInfo && (
            <div
              className="glass p-5 rounded-2xl shadow-2xl mb-2 backdrop-blur-xl border border-[rgba(125,211,192,0.2)] max-w-sm w-80 text-left animate-in fade-in zoom-in-95 duration-200"
              style={{
                backgroundColor: "rgba(10, 15, 26, 0.9)",
                color: "var(--text-primary)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[rgba(125,211,192,0.15)] text-[var(--accent-teal)]">
                    <Sparkles size={16} />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">
                    Math Core: F(n, t)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpenInfo(false)}
                  className="p-1 text-[var(--text-secondary)] hover:text-white rounded-md transition-colors"
                  aria-label="Schließen"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Exact Formula LaTeX Representation */}
              <div className="my-3 p-3 rounded-lg bg-[rgba(0,0,0,0.45)] border border-[rgba(125,211,192,0.15)] font-mono text-xs overflow-x-auto select-all">
                <div className="text-[var(--accent-teal)] font-bold mb-1">
                  F(n, t) =
                </div>
                <div className="pl-4 text-xs space-y-1 text-slate-300">
                  <div>
                    ⎡ <span className="text-[var(--accent-teal)]">n^(3/2) / (n + 1000)</span> ⎤
                  </div>
                  <div>
                    ⎢ <span className="text-[var(--accent-blue)]">sin(0.1n · sin(83.3333t))</span> ⎥
                  </div>
                  <div>
                    ⎣ <span className="text-[var(--accent-purple)]">0.1 · n · t</span> ⎦
                  </div>
                </div>
              </div>

              <div className="text-xs text-[var(--text-secondary)] space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-[var(--text-primary)]">X:</strong> Sublineare Raumkrümmung & asymptotische Skalierung.
                </p>
                <p>
                  <strong className="text-[var(--text-primary)]">Y:</strong> Frequenzmodulierte harmonische Interferenzwellen.
                </p>
                <p>
                  <strong className="text-[var(--text-primary)]">Z:</strong> Zeitliche Tiefenprojektion & kontinuierlicher Fluss.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-[var(--accent-teal)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse" />
                  Autonome Evolution
                </span>
                <span>Self-evolving Field</span>
              </div>
            </div>
          )}

          {/* Trigger Pill Button */}
          <button
            type="button"
            onClick={() => setIsOpenInfo(!isOpenInfo)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 shadow-lg border hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isOpenInfo
                ? "rgba(125, 211, 192, 0.2)"
                : "rgba(10, 15, 26, 0.8)",
              borderColor: isOpenInfo
                ? "var(--accent-teal)"
                : "rgba(125, 211, 192, 0.35)",
              color: "var(--accent-teal)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            title="Formel F(n, t) anzeigen"
          >
            <Sparkles size={13} className="text-[var(--accent-teal)] animate-pulse" />
            <span className="tracking-wide">F(n, t) Vector Field</span>
            <Info size={12} className="opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
}
