"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Eye,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Trophy,
  Flame,
  Activity,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  ArrowLeft,
  Sliders,
} from "lucide-react";

// Types
type TrainerMode = "continuous" | "challenge" | "peripheral";
type GamePhase = "idle" | "memorize" | "tracking" | "select" | "result";

interface TrailPoint {
  x: number;
  y: number;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isTarget: boolean;
  isSelected?: boolean;
  trail: TrailPoint[];
  redness: number; // 0 = white, 1 = red
}

interface TrainerStats {
  roundsPlayed: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  score: number;
  level: number;
}

export default function AugentrainerPage() {
  const t = useTranslations("tools.augentrainer_page");

  // Config & State
  const [mode, setMode] = useState<TrainerMode>("continuous");
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [dotCount, setDotCount] = useState<number>(8);
  const [dotSize, setDotSize] = useState<number>(6);
  const [speed, setSpeed] = useState<number>(3.2);
  const [complexity, setComplexity] = useState<number>(2); // 1 = Linear, 2 = Dynamic (bounces), 3 = Curved, 4 = Chaotic
  const [trailLength, setTrailLength] = useState<number>(18);
  const [trackingDuration, setTrackingDuration] = useState<number>(7);
  const [showFixationCross, setShowFixationCross] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Time & Progress
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(0);
  const [continuousStatus, setContinuousStatus] = useState<"highlight" | "tracking">("highlight");
  const [continuousCycles, setContinuousCycles] = useState<number>(0);
  const [isResultCorrect, setIsResultCorrect] = useState<boolean | null>(null);

  // Stats
  const [stats, setStats] = useState<TrainerStats>({
    roundsPlayed: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    score: 0,
    level: 1,
  });

  // Refs for non-reactive animation access
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const continuousTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Live state refs
  const modeRef = useRef<TrainerMode>(mode);
  const phaseRef = useRef<GamePhase>(phase);
  const continuousStatusRef = useRef<"highlight" | "tracking">(continuousStatus);
  const speedRef = useRef<number>(speed);
  const complexityRef = useRef<number>(complexity);
  const dotSizeRef = useRef<number>(dotSize);
  const trailLengthRef = useRef<number>(trailLength);
  const showFixationCrossRef = useRef<boolean>(showFixationCross);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const targetBadgeText = t("overlays.targetBadge");
  const yourClickBadgeText = t("overlays.yourClickBadge");
  const labelsRef = useRef<{ target: string; yourClick: string }>({
    target: targetBadgeText,
    yourClick: yourClickBadgeText,
  });

  useEffect(() => {
    labelsRef.current = {
      target: targetBadgeText,
      yourClick: yourClickBadgeText,
    };
  }, [targetBadgeText, yourClickBadgeText]);

  // Keep refs synchronized
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    continuousStatusRef.current = continuousStatus;
  }, [continuousStatus]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    complexityRef.current = complexity;
  }, [complexity]);
  useEffect(() => {
    dotSizeRef.current = dotSize;
    dotsRef.current.forEach((d) => (d.radius = dotSize));
  }, [dotSize]);
  useEffect(() => {
    trailLengthRef.current = trailLength;
  }, [trailLength]);
  useEffect(() => {
    showFixationCrossRef.current = showFixationCross;
  }, [showFixationCross]);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Toggle Sound with immediate AudioContext suspension
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEnabledRef.current = next;
      if (!next && audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend().catch(() => {});
      }
      return next;
    });
  };

  // Web Audio API
  const playSound = useCallback((type: "highlight" | "countdown" | "success" | "fail" | "tick") => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "highlight") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "tick") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(739.99, now + 0.12);
        osc.frequency.setValueAtTime(880, now + 0.24);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "fail") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio support fallback
    }
  }, []);

  // Spawn dots
  const spawnDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr || 600;
    const height = canvas.height / dpr || 600;
    const cx = width / 2;
    const cy = height / 2;
    const arenaRadius = Math.min(width, height) * 0.44;

    const newDots: Dot[] = [];
    const targetIndex = Math.floor(Math.random() * dotCount);

    for (let i = 0; i < dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * (arenaRadius - dotSizeRef.current * 3.5);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const moveAngle = Math.random() * Math.PI * 2;
      const currentSpeed = speedRef.current;
      const vx = Math.cos(moveAngle) * currentSpeed;
      const vy = Math.sin(moveAngle) * currentSpeed;

      const isTarget = i === targetIndex;

      newDots.push({
        id: i,
        x,
        y,
        vx,
        vy,
        radius: dotSizeRef.current,
        isTarget,
        isSelected: false,
        trail: [],
        redness: isTarget ? 1 : 0,
      });
    }

    dotsRef.current = newDots;
  }, [dotCount]);

  // Continuous Flow Cycle Loop
  const runContinuousStep = useCallback(() => {
    setContinuousStatus("highlight");
    playSound("highlight");

    continuousTimerRef.current = setTimeout(() => {
      setContinuousStatus("tracking");

      continuousTimerRef.current = setTimeout(() => {
        setContinuousStatus("highlight");
        playSound("highlight");
        setContinuousCycles((prev) => prev + 1);

        continuousTimerRef.current = setTimeout(() => {
          runContinuousStep();
        }, 2500);
      }, trackingDuration * 1000);
    }, 2500);
  }, [playSound, trackingDuration]);

  // Start Challenge Mode
  const startChallengeRound = useCallback(() => {
    spawnDots();
    setPhase("memorize");
    setIsResultCorrect(null);
    setPhaseTimeLeft(3);
    playSound("highlight");

    let countdown = 3;
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);

    phaseTimerRef.current = setInterval(() => {
      countdown -= 1;
      setPhaseTimeLeft(countdown);
      if (countdown <= 0) {
        if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
        setPhase("tracking");
        setPhaseTimeLeft(trackingDuration);

        let trackingCount = trackingDuration;
        phaseTimerRef.current = setInterval(() => {
          trackingCount -= 1;
          setPhaseTimeLeft(trackingCount);
          if (trackingCount <= 0) {
            if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
            setPhase("select");
          }
        }, 1000);
      }
    }, 1000);
  }, [spawnDots, trackingDuration, playSound]);

  // Start Training
  const handleStart = () => {
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (continuousTimerRef.current) clearTimeout(continuousTimerRef.current);

    if (mode === "continuous") {
      setPhase("tracking");
      runContinuousStep();
    } else {
      startChallengeRound();
    }
  };

  // Stop / Reset
  const handleReset = () => {
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (continuousTimerRef.current) clearTimeout(continuousTimerRef.current);
    setPhase("idle");
    setContinuousStatus("highlight");
    setPhaseTimeLeft(0);
    setIsResultCorrect(null);
    spawnDots();
  };

  // Handle dot selection in Challenge mode (with accurate CSS pixel hit testing)
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "select") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    let clickedDot: Dot | null = null;
    let minDist = Infinity;

    dotsRef.current.forEach((dot) => {
      const dist = Math.hypot(dot.x - clickX, dot.y - clickY);
      const hitRadius = Math.max(30, dot.radius * 4);
      if (dist <= hitRadius && dist < minDist) {
        minDist = dist;
        clickedDot = dot;
      }
    });

    if (clickedDot) {
      const targetDot = clickedDot as Dot;
      targetDot.isSelected = true;

      const isCorrect = targetDot.isTarget;
      setIsResultCorrect(isCorrect);
      setPhase("result");

      if (isCorrect) {
        playSound("success");
        setStats((prev) => {
          const newStreak = prev.streak + 1;
          const streakBonus = newStreak * 30;
          const speedBonus = Math.round(speedRef.current * 25);
          const levelBonus = prev.level * 50;
          return {
            roundsPlayed: prev.roundsPlayed + 1,
            correctAnswers: prev.correctAnswers + 1,
            streak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
            score: prev.score + 100 + streakBonus + speedBonus + levelBonus,
            level: newStreak > 0 && newStreak % 3 === 0 ? prev.level + 1 : prev.level,
          };
        });
      } else {
        playSound("fail");
        setStats((prev) => ({
          ...prev,
          roundsPlayed: prev.roundsPlayed + 1,
          streak: 0,
        }));
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Continuous Canvas Physics & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const size = Math.min(parent.clientWidth, 680);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    spawnDots();

    const render = () => {
      if (!isMounted) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;
      const arenaRadius = Math.min(width, height) * 0.44;
      const time = Date.now() / 1000;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Arena Outer Glow & Background
      const bgGrad = ctx.createRadialGradient(cx, cy, arenaRadius * 0.1, cx, cy, arenaRadius);
      bgGrad.addColorStop(0, "rgba(18, 30, 49, 0.75)");
      bgGrad.addColorStop(0.7, "rgba(11, 20, 36, 0.92)");
      bgGrad.addColorStop(1, "rgba(6, 12, 22, 0.99)");

      ctx.beginPath();
      ctx.arc(cx, cy, arenaRadius, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Outer Arena Ring
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "rgba(125, 211, 192, 0.35)";
      ctx.shadowColor = "rgba(125, 211, 192, 0.3)";
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Inner subtle boundary ring
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, arenaRadius * 0.97, 0, Math.PI * 2);
      ctx.stroke();

      // Central Fixation Cross
      if (showFixationCrossRef.current || modeRef.current === "peripheral") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        const arm = 12;
        ctx.beginPath();
        ctx.moveTo(cx - arm, cy);
        ctx.lineTo(cx + arm, cy);
        ctx.moveTo(cx, cy - arm);
        ctx.lineTo(cx + arm, cy);
        ctx.stroke();

        ctx.fillStyle = "rgba(125, 211, 192, 0.8)";
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Movement condition
      const currentPhase = phaseRef.current;
      const currentMode = modeRef.current;
      const shouldMove =
        currentPhase === "tracking" ||
        currentPhase === "memorize" ||
        (currentMode === "continuous" && currentPhase !== "idle");

      const dots = dotsRef.current;
      const currentSpeed = speedRef.current;
      const maxTrail = trailLengthRef.current;

      // Update positions, collisions & trails
      dots.forEach((dot, i) => {
        if (shouldMove) {
          // Complex continuous organic curve steering for complexity > 1
          const compLevel = complexityRef.current;
          if (compLevel > 1) {
            const curveSteer = Math.sin(time * 2.2 + dot.id * 1.9) * 0.022 * (compLevel - 1);
            const curAngle = Math.atan2(dot.vy, dot.vx) + curveSteer;
            dot.vx = Math.cos(curAngle) * currentSpeed;
            dot.vy = Math.sin(curAngle) * currentSpeed;
          }

          dot.x += dot.vx;
          dot.y += dot.vy;

          dot.trail.push({ x: dot.x, y: dot.y });
          if (dot.trail.length > maxTrail) {
            dot.trail.shift();
          }

          const dx = dot.x - cx;
          const dy = dot.y - cy;
          const distFromCenter = Math.hypot(dx, dy);

          if (distFromCenter + dot.radius >= arenaRadius) {
            const nx = dx / distFromCenter;
            const ny = dy / distFromCenter;
            const dotProduct = dot.vx * nx + dot.vy * ny;

            dot.vx = dot.vx - 2 * dotProduct * nx;
            dot.vy = dot.vy - 2 * dotProduct * ny;

            const clampedDist = arenaRadius - dot.radius - 1;
            dot.x = cx + nx * clampedDist;
            dot.y = cy + ny * clampedDist;
          }

          // Elastic collision between balls (direction changes on contact)
          for (let j = i + 1; j < dots.length; j++) {
            const other = dots[j];
            const bdx = other.x - dot.x;
            const bdy = other.y - dot.y;
            const bdist = Math.hypot(bdx, bdy);
            const minDist = dot.radius + other.radius;

            if (bdist < minDist && bdist > 0) {
              const bnx = bdx / bdist;
              const bny = bdy / bdist;
              const btx = -bny;
              const bty = bnx;

              const dpNorm1 = dot.vx * bnx + dot.vy * bny;
              const dpNorm2 = other.vx * bnx + other.vy * bny;

              const dpTan1 = dot.vx * btx + dot.vy * bty;
              const dpTan2 = other.vx * btx + other.vy * bty;

              // Only resolve if balls are moving toward each other
              if (dpNorm1 - dpNorm2 > 0) {
                // Swap normal velocity components (elastic impact)
                const newNorm1 = dpNorm2;
                const newNorm2 = dpNorm1;

                dot.vx = btx * dpTan1 + bnx * newNorm1;
                dot.vy = bty * dpTan1 + bny * newNorm1;

                other.vx = btx * dpTan2 + bnx * newNorm2;
                other.vy = bty * dpTan2 + bny * newNorm2;

                // Positional separation to prevent overlapping
                const overlap = 0.5 * (minDist - bdist + 1);
                dot.x -= bnx * overlap;
                dot.y -= bny * overlap;
                other.x += bnx * overlap;
                other.y += bny * overlap;
              }
            }
          }
        }

        let targetRedness = 0;
        if (currentMode === "continuous") {
          targetRedness = dot.isTarget && continuousStatusRef.current === "highlight" ? 1 : 0;
        } else {
          if (currentPhase === "memorize" && dot.isTarget) targetRedness = 1;
          else if (currentPhase === "result" && dot.isTarget) targetRedness = 1;
        }

        dot.redness += (targetRedness - dot.redness) * 0.12;
      });

      // 1. Draw Motion Trails
      dots.forEach((dot) => {
        if (dot.trail.length < 2) return;

        ctx.save();
        for (let t = 0; t < dot.trail.length - 1; t++) {
          const p1 = dot.trail[t];
          const p2 = dot.trail[t + 1];
          const progress = t / dot.trail.length;
          const alpha = progress * 0.65;
          const lineWidth = Math.max(1, dot.radius * 0.75 * progress);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";

          if (dot.redness > 0.05) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * dot.redness + (1 - dot.redness) * alpha * 0.7})`;
            ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
            ctx.shadowBlur = 6 * dot.redness;
          } else {
            ctx.strokeStyle = `rgba(240, 249, 255, ${alpha * 0.55})`;
            ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
            ctx.shadowBlur = 4;
          }
          ctx.stroke();
        }
        ctx.restore();
      });

      // 2. Draw Dots
      dots.forEach((dot) => {
        ctx.save();

        if (currentPhase === "result") {
          // RESULT PHASE: Clearly show the original target vs false choice
          if (dot.isTarget) {
            // Original Target: Glowing Emerald Green with target badge
            const pulse = 1 + Math.sin(time * 8) * 0.22;
            ctx.shadowColor = "rgba(16, 185, 129, 0.95)";
            ctx.shadowBlur = 22 * pulse;

            // Pulsing Target Ring
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.85 * pulse})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 2.3 * pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Emerald Core
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 1.25, 0, Math.PI * 2);
            ctx.fill();

            // Target Badge above
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#6ee7b7";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(labelsRef.current.target, dot.x, dot.y - dot.radius * 2.8);
          } else if (dot.isSelected && !dot.isTarget) {
            // False Selection: Glowing Rose Red with error badge
            const pulse = 1 + Math.sin(time * 8) * 0.18;
            ctx.shadowColor = "rgba(244, 63, 94, 0.95)";
            ctx.shadowBlur = 18 * pulse;

            ctx.strokeStyle = `rgba(244, 63, 94, ${0.85 * pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 2.1 * pulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "#f43f5e";
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 1.15, 0, Math.PI * 2);
            ctx.fill();

            // Click Badge above
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#fda4af";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(labelsRef.current.yourClick, dot.x, dot.y - dot.radius * 2.6);
          } else {
            // Other neutral dots dimmed
            ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
            ctx.shadowBlur = 3;
            ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 0.85, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (dot.redness > 0.05) {
          const pulse = 1 + Math.sin(time * 8) * 0.2 * dot.redness;

          if (dot.redness > 0.4) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.75 * dot.redness * pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 2 * pulse, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.shadowColor = `rgba(239, 68, 68, ${0.9 * dot.redness})`;
          ctx.shadowBlur = 14 * dot.redness;

          const r = 255;
          const g = Math.round(255 * (1 - dot.redness) + 68 * dot.redness);
          const b = Math.round(255 * (1 - dot.redness) + 68 * dot.redness);

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (dot.isSelected) {
          ctx.shadowColor = "rgba(250, 204, 21, 0.9)";
          ctx.shadowBlur = 14;
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius * 1.8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Selection phase visual feedback
          if (currentPhase === "select") {
            const selectPulse = 1 + Math.sin(time * 6 + dot.id) * 0.15;
            ctx.strokeStyle = "rgba(125, 211, 192, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius * 2.2 * selectPulse, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [spawnDots]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (continuousTimerRef.current) clearTimeout(continuousTimerRef.current);
    };
  }, []);

  return (
    <section className="container" style={{ paddingTop: "6rem", paddingBottom: "5rem" }}>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/tools/solution"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          <ArrowLeft size={16} />
          <span>{t("back")}</span>
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 2.5rem auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            borderRadius: "50px",
            background: "rgba(125, 211, 192, 0.12)",
            border: "1px solid rgba(125, 211, 192, 0.25)",
            color: "var(--accent-teal)",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "1rem",
          }}
        >
          <Eye size={15} />
          <span>{t("badge")}</span>
        </div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>
          {t("title") === "Eye Trainer" ? (
            <>
              Eye <span className="gradient-text">Trainer</span>
            </>
          ) : (
            <>
              Augen<span className="gradient-text">trainer</span>
            </>
          )}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
          {mode === "peripheral"
            ? t("headers.peripheral")
            : mode === "challenge"
            ? t("headers.challenge")
            : t("headers.continuous")}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
        <button
          onClick={() => {
            setMode("continuous");
            handleReset();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.4rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: mode === "continuous" ? 700 : 500,
            background: mode === "continuous" ? "var(--accent-teal)" : "var(--glass-bg)",
            color: mode === "continuous" ? "#0a0f1a" : "var(--text-primary)",
            border: mode === "continuous" ? "1px solid var(--accent-teal)" : "1px solid var(--glass-border)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: mode === "continuous" ? "0 4px 20px rgba(125, 211, 192, 0.35)" : "none",
          }}
        >
          <RotateCcw size={16} />
          <span>{t("tabs.continuous")}</span>
        </button>

        <button
          onClick={() => {
            setMode("challenge");
            handleReset();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.4rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: mode === "challenge" ? 700 : 500,
            background: mode === "challenge" ? "var(--accent-teal)" : "var(--glass-bg)",
            color: mode === "challenge" ? "#0a0f1a" : "var(--text-primary)",
            border: mode === "challenge" ? "1px solid var(--accent-teal)" : "1px solid var(--glass-border)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: mode === "challenge" ? "0 4px 20px rgba(125, 211, 192, 0.35)" : "none",
          }}
        >
          <Target size={16} />
          <span>{t("tabs.challenge")}</span>
        </button>

        <button
          onClick={() => {
            setMode("peripheral");
            setShowFixationCross(true);
            handleReset();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.4rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: mode === "peripheral" ? 700 : 500,
            background: mode === "peripheral" ? "var(--accent-teal)" : "var(--glass-bg)",
            color: mode === "peripheral" ? "#0a0f1a" : "var(--text-primary)",
            border: mode === "peripheral" ? "1px solid var(--accent-teal)" : "1px solid var(--glass-border)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: mode === "peripheral" ? "0 4px 20px rgba(125, 211, 192, 0.35)" : "none",
          }}
        >
          <Sparkles size={16} />
          <span>{t("tabs.peripheral")}</span>
        </button>
      </div>

      {/* Main Training Area (2 Columns) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "start" }}>
        {/* Left Column: Canvas Arena */}
        <div
          ref={containerRef}
          className="glass"
          style={{
            padding: "2rem",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: isFullscreen ? "fixed" : "relative",
            inset: isFullscreen ? 0 : "auto",
            zIndex: isFullscreen ? 9999 : 1,
            background: isFullscreen ? "#060c16" : "var(--glass-bg)",
            minHeight: "540px",
          }}
        >
          {/* Status Bar */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", zIndex: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-teal)", display: "inline-block", boxShadow: "0 0 10px var(--accent-teal)" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {mode === "continuous" && (
                  continuousStatus === "highlight"
                    ? t("status.continuousHighlight")
                    : t("status.continuousTracking")
                )}
                {mode === "peripheral" && (
                  phase === "idle"
                    ? t("status.peripheralIdle")
                    : phase === "memorize"
                    ? t("status.peripheralMemorize", { timeLeft: phaseTimeLeft })
                    : phase === "tracking"
                    ? t("status.peripheralTracking", { timeLeft: phaseTimeLeft })
                    : phase === "select"
                    ? t("status.peripheralSelect")
                    : isResultCorrect
                    ? t("status.peripheralCorrect")
                    : t("status.peripheralWrong")
                )}
                {mode === "challenge" && (
                  phase === "idle"
                    ? t("status.challengeIdle")
                    : phase === "memorize"
                    ? t("status.challengeMemorize", { timeLeft: phaseTimeLeft })
                    : phase === "tracking"
                    ? t("status.challengeTracking", { timeLeft: phaseTimeLeft })
                    : phase === "select"
                    ? t("status.challengeSelect")
                    : isResultCorrect
                    ? t("status.challengeCorrect")
                    : t("status.challengeWrong")
                )}
              </span>
            </div>

            {/* Quick Actions (Audio & Fullscreen) */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={toggleSound}
                className="glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  color: soundEnabled ? "var(--accent-teal)" : "var(--text-secondary)",
                  background: soundEnabled ? "rgba(125, 211, 192, 0.1)" : "var(--glass-bg)",
                  border: soundEnabled ? "1px solid rgba(125, 211, 192, 0.3)" : "1px solid var(--glass-border)",
                  cursor: "pointer",
                }}
                title={soundEnabled ? t("controls.mute") : t("controls.unmute")}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
                title={t("controls.fullscreen")}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                borderRadius: "50%",
                maxWidth: "100%",
                cursor: phase === "select" ? "pointer" : "default",
                boxShadow: "0 0 40px rgba(125, 211, 192, 0.15)",
              }}
            />

            {/* Idle Overlay Button */}
            {phase === "idle" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(6, 12, 22, 0.75)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "50%",
                  padding: "2rem",
                }}
              >
                <button
                  onClick={handleStart}
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "0.9rem 2.2rem",
                    borderRadius: "50px",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 25px rgba(125, 211, 192, 0.4)",
                    marginBottom: "0.85rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Play size={18} fill="currentColor" />
                  <span>{t("overlays.startBtn")}</span>
                </button>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", maxWidth: "290px", margin: 0, lineHeight: 1.4 }}>
                  {mode === "peripheral"
                    ? t("overlays.descPeripheral")
                    : mode === "continuous"
                    ? t("overlays.descContinuous")
                    : t("overlays.descChallenge")}
                </p>
              </div>
            )}

            {/* Next Round Button after Result */}
            {phase === "result" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(6, 12, 22, 0.8)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "50%",
                  padding: "2rem",
                }}
              >
                <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                  {isResultCorrect ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-teal)", fontWeight: 800, fontSize: "1.25rem" }}>
                      <CheckCircle2 size={26} />
                      <span>{t("overlays.correctHit")}</span>
                    </div>
                  ) : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#f87171", fontWeight: 800, fontSize: "1.25rem" }}>
                      <XCircle size={26} />
                      <span>{t("overlays.wrongHit")}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={startChallengeRound}
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.8rem",
                    borderRadius: "50px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>{t("overlays.nextRoundBtn")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Bar Controls */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
              {phase === "idle" ? (
                <button
                  onClick={handleStart}
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "50px",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  <Play size={15} fill="currentColor" />
                  <span>{t("controls.start")}</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="glass"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "50px",
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={15} />
                  <span>{t("controls.reset")}</span>
                </button>
              )}
            </div>

            {mode === "continuous" && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Clock size={16} style={{ color: "var(--accent-teal)" }} />
                <span>{t("controls.cycles")}:</span>
                <strong style={{ color: "#ffffff", fontSize: "1rem" }}>{continuousCycles}</strong>
              </div>
            )}

            {mode !== "continuous" && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>{t("controls.streak")}:</span>
                  <strong style={{ color: "var(--accent-teal)" }}>{stats.streak}🔥</strong>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>{t("controls.score")}:</span>
                  <strong style={{ color: "#ffffff" }}>{stats.score}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings & Live Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Stats Card */}
          <div className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: "rgba(125, 211, 192, 0.15)",
                  color: "var(--accent-teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trophy size={22} />
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
                {t("stats.title")}
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  <Flame size={15} style={{ color: "#fbbf24" }} />
                  <span>{t("stats.streak")}</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                  {stats.streak}
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  <Activity size={15} style={{ color: "var(--accent-teal)" }} />
                  <span>{t("stats.level")}</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-teal)" }}>
                  {stats.level}
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  <CheckCircle2 size={15} style={{ color: "var(--accent-blue)" }} />
                  <span>{t("stats.accuracy")}</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                  {stats.roundsPlayed > 0
                    ? `${Math.round((stats.correctAnswers / stats.roundsPlayed) * 100)}%`
                    : "—"}
                </div>
              </div>

              <div
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  <Zap size={15} style={{ color: "var(--accent-purple)" }} />
                  <span>{t("stats.points")}</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                  {stats.score}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="glass" style={{ padding: "2.5rem", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: "rgba(91, 155, 213, 0.15)",
                  color: "var(--accent-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sliders size={22} />
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
                {t("params.title")}
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Dot Size */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.dotSize")}:</span>
                  <strong style={{ color: "var(--accent-teal)" }}>{dotSize}px</strong>
                </div>
                <input
                  type="range"
                  min={4}
                  max={12}
                  value={dotSize}
                  onChange={(e) => setDotSize(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-teal)", cursor: "pointer" }}
                />
              </div>

              {/* Trail Length */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.trailLength")}:</span>
                  <strong style={{ color: "var(--accent-blue)" }}>{trailLength}</strong>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={trailLength}
                  onChange={(e) => setTrailLength(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer" }}
                />
              </div>

              {/* Dot Count */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.dotCount")}:</span>
                  <strong style={{ color: "var(--accent-teal)" }}>{dotCount}</strong>
                </div>
                <input
                  type="range"
                  min={3}
                  max={16}
                  value={dotCount}
                  onChange={(e) => {
                    setDotCount(Number(e.target.value));
                    handleReset();
                  }}
                  style={{ width: "100%", accentColor: "var(--accent-teal)", cursor: "pointer" }}
                />
              </div>

              {/* Speed */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.speed")}:</span>
                  <strong style={{ color: "#fbbf24" }}>
                    {speed <= 2.2
                      ? t("params.speeds.slow")
                      : speed <= 4.0
                      ? t("params.speeds.medium")
                      : speed <= 6.0
                      ? t("params.speeds.fast")
                      : t("params.speeds.expert")}
                  </strong>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={7.5}
                  step={0.5}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#fbbf24", cursor: "pointer" }}
                />
              </div>

              {/* Complexity */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.complexity")}:</span>
                  <strong
                    style={{
                      color:
                        complexity === 1
                          ? "var(--accent-teal)"
                          : complexity === 2
                          ? "var(--accent-blue)"
                          : complexity === 3
                          ? "#fbbf24"
                          : "#f87171",
                    }}
                  >
                    {complexity === 1
                      ? t("params.complexities.1")
                      : complexity === 2
                      ? t("params.complexities.2")
                      : complexity === 3
                      ? t("params.complexities.3")
                      : t("params.complexities.4")}
                  </strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor:
                      complexity === 1
                        ? "var(--accent-teal)"
                        : complexity === 2
                        ? "var(--accent-blue)"
                        : complexity === 3
                        ? "#fbbf24"
                        : "#f87171",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Tracking Duration */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <span>{t("params.duration")}:</span>
                  <strong style={{ color: "var(--accent-purple)" }}>{trackingDuration}s</strong>
                </div>
                <input
                  type="range"
                  min={3}
                  max={15}
                  step={1}
                  value={trackingDuration}
                  onChange={(e) => setTrackingDuration(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-purple)", cursor: "pointer" }}
                />
              </div>

              {/* Fixation Cross Toggle */}
              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ color: "var(--text-primary)", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={showFixationCross}
                    onChange={(e) => setShowFixationCross(e.target.checked)}
                    style={{ accentColor: "var(--accent-teal)", cursor: "pointer" }}
                  />
                  <span>{t("params.fixationCross")}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Scoring System Section */}
      <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Card 1: Game Rules */}
        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <Target size={48} strokeWidth={1.5} style={{ color: "var(--accent-teal)" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("rules.title")}
          </h4>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <div style={{ marginBottom: "0.85rem" }}>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>{t("rules.step1Title")}</strong>
              {t("rules.step1Desc")}
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>{t("rules.step2Title")}</strong>
              {t("rules.step2Desc")}
            </div>
            <div>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>{t("rules.step3Title")}</strong>
              {t("rules.step3Desc")}
            </div>
          </div>
        </div>

        {/* Card 2: Peripheral Vision Guide */}
        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <Sparkles size={48} strokeWidth={1.5} style={{ color: "var(--accent-purple)" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("peripheralGuide.title")}
          </h4>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <div style={{ marginBottom: "0.85rem" }}>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>{t("peripheralGuide.crossTitle")}</strong>
              {t("peripheralGuide.crossDesc")}
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.2rem" }}>{t("peripheralGuide.cornerTitle")}</strong>
              {t("peripheralGuide.cornerDesc")}
            </div>
            <div>
              <strong style={{ color: "var(--accent-purple)", display: "block", marginBottom: "0.2rem" }}>{t("peripheralGuide.effectTitle")}</strong>
              {t("peripheralGuide.effectDesc")}
            </div>
          </div>
        </div>

        {/* Card 3: Scoring & Level System */}
        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <Trophy size={48} strokeWidth={1.5} style={{ color: "#fbbf24" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("scoring.title")}
          </h4>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0.85rem 0" }}>
              <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", paddingBottom: "0.35rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <span>{t("scoring.base")}:</span>
                <strong style={{ color: "#ffffff" }}>{t("scoring.baseVal")}</strong>
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", paddingBottom: "0.35rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <span>{t("scoring.streak")}:</span>
                <strong style={{ color: "#fbbf24" }}>{t("scoring.streakVal")}</strong>
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", paddingBottom: "0.35rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <span>{t("scoring.speed")}:</span>
                <strong style={{ color: "var(--accent-blue)" }}>{t("scoring.speedVal")}</strong>
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span>{t("scoring.level")}:</span>
                <strong style={{ color: "var(--accent-teal)" }}>{t("scoring.levelVal")}</strong>
              </li>
            </ul>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <strong>{t("scoring.levelUpLabel")}:</strong> {t("scoring.levelUp")}
            </p>
          </div>
        </div>
      </div>

      {/* Guide & Scientific Context Section */}
      <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <Eye size={48} strokeWidth={1.5} style={{ color: "var(--accent-teal)" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("science.motTitle")}
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            {t("science.motDesc")}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-teal)" }} />
              <span>{t("science.motPoint1")}</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-teal)" }} />
              <span>{t("science.motPoint2")}</span>
            </li>
          </ul>
        </div>

        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <ShieldCheck size={48} strokeWidth={1.5} style={{ color: "var(--accent-blue)" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("science.ergoTitle")}
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            {t("science.ergoDesc")}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
              <span>{t("science.ergoPoint1")}</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
              <span>{t("science.ergoPoint2")}</span>
            </li>
          </ul>
        </div>

        <div
          className="glass"
          style={{
            padding: "2.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <Info size={48} strokeWidth={1.5} style={{ color: "#fbbf24" }} />
          </div>
          <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {t("science.tipsTitle")}
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            {t("science.tipsDesc")}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }} />
              <span>{t("science.tipsPoint1")}</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }} />
              <span>{t("science.tipsPoint2")}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
