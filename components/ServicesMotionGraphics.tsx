"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Server,
  Cloud,
  Shield,
  Database,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface SceneConfig {
  id: string;
  badge: string;
  title: string;
  shortTitle?: string;
  tagline: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  secondaryColor: string;
  features: string[];
  metrics: { label: string; value: string; status: string }[];
  codeSnippet: string;
}

const SCENE_DURATION_MS = 6500; // 6.5s per scene

export function ServicesMotionGraphics() {
  const t = useTranslations("motion");

  const scenes: SceneConfig[] = useMemo(
    () => [
      {
        id: "intro",
        badge: t("scenes.intro.badge"),
        title: t("scenes.intro.title"),
        tagline: t("scenes.intro.tagline"),
        category: t("scenes.intro.category"),
        description: t("scenes.intro.description"),
        icon: Sparkles,
        accentColor: "var(--accent-teal)",
        secondaryColor: "var(--accent-blue)",
        features: t.raw("scenes.intro.features") as string[],
        metrics: t.raw("scenes.intro.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `// thesolution.at - Core Architecture
await Infrastructure.deploy({
  target: ["Datacenter", "AWS", "GCP", "Databricks"],
  resilience: "99.999%",
  compliance: "EU-GDPR / NIS2 Ready"
});`,
      },
      {
        id: "datacenter",
        badge: t("scenes.datacenter.badge"),
        title: t("scenes.datacenter.title"),
        tagline: t("scenes.datacenter.tagline"),
        category: t("scenes.datacenter.category"),
        description: t("scenes.datacenter.description"),
        icon: Server,
        accentColor: "var(--accent-blue)",
        secondaryColor: "var(--accent-teal)",
        features: t.raw("scenes.datacenter.features") as string[],
        metrics: t.raw("scenes.datacenter.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: critical-workload-dc1
spec:
  running: true
  template:
    spec:
      domain:
        resources: { requests: { memory: 64Gi, cpu: 16 } }
        networkInterface: { bridge: "cilium-mesh" }`,
      },
      {
        id: "multicloud",
        badge: t("scenes.multicloud.badge"),
        title: t("scenes.multicloud.title"),
        shortTitle: t("scenes.multicloud.shortTitle"),
        tagline: t("scenes.multicloud.tagline"),
        category: t("scenes.multicloud.category"),
        description: t("scenes.multicloud.description"),
        icon: Cloud,
        accentColor: "var(--accent-teal)",
        secondaryColor: "#38bdf8",
        features: t.raw("scenes.multicloud.features") as string[],
        metrics: t.raw("scenes.multicloud.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `module "multicloud_mesh" {
  source = "./modules/cross-cloud-peering"
  aws_region = "eu-central-1"
  gcp_region = "europe-west3"
  encryption = "AES-256-GCM / WireGuard"
  traffic_failover = "automatic_bgp"
}`,
      },
      {
        id: "vmware",
        badge: t("scenes.vmware.badge"),
        title: t("scenes.vmware.title"),
        tagline: t("scenes.vmware.tagline"),
        category: t("scenes.vmware.category"),
        description: t("scenes.vmware.description"),
        icon: Shield,
        accentColor: "#a855f7",
        secondaryColor: "var(--accent-blue)",
        features: t.raw("scenes.vmware.features") as string[],
        metrics: t.raw("scenes.vmware.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `// Broadcom VCF License Cost Reduction Engine
const audit = await VMwareOptimizer.analyze({
  currentSockets: 48,
  targetVCFSuite: "VCF_Enterprise",
  consolidationRatio: 1.84,
  estimatedSavings: "EUR 120,000/yr"
});`,
      },
      {
        id: "databricks",
        badge: t("scenes.databricks.badge"),
        title: t("scenes.databricks.title"),
        tagline: t("scenes.databricks.tagline"),
        category: t("scenes.databricks.category"),
        description: t("scenes.databricks.description"),
        icon: Database,
        accentColor: "#f59e0b",
        secondaryColor: "var(--accent-teal)",
        features: t.raw("scenes.databricks.features") as string[],
        metrics: t.raw("scenes.databricks.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `// Databricks Streaming Delta Pipeline
val stream = spark.readStream
  .format("delta")
  .load("/lakehouse/silver/telemetry")
  .groupBy(window($"timestamp", "1 minute"), $"serviceId")
  .agg(avg($"latency").as("avg_latency"))
  .writeStream.format("delta").start("/lakehouse/gold/kpis")`,
      },
      {
        id: "finale",
        badge: t("scenes.finale.badge"),
        title: t("scenes.finale.title"),
        tagline: t("scenes.finale.tagline"),
        category: t("scenes.finale.category"),
        description: t("scenes.finale.description"),
        icon: Sparkles,
        accentColor: "var(--accent-teal)",
        secondaryColor: "#a855f7",
        features: t.raw("scenes.finale.features") as string[],
        metrics: t.raw("scenes.finale.metrics") as { label: string; value: string; status: string }[],
        codeSnippet: `// Connect with thesolution.at
Contact.connect({
  consulting: ["Datacenter", "AWS/GCP", "VMware", "Databricks"],
  email: "contact@thesolution.at",
  status: "Ready to accelerate your business"
});`,
      },
    ],
    [t]
  );

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sceneStartTimeRef = useRef<number>(Date.now());
  const elapsedPauseTimeRef = useRef<number>(0);

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  // Background Ambient Music Synchronization
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    if (isAudioEnabled && isPlaying) {
      audio.play().catch(() => {
        // Autoplay policy prevented playback until user interaction
      });
    } else {
      audio.pause();
    }
  }, [isAudioEnabled, isPlaying]);

  // Web Audio Synth for Subtle Cybernetic SFX (Client-side, Zero external asset dependency)
  const playSceneTransitionChime = useCallback(() => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft harmonic frequencies depending on scene
      const freqMap = [523.25, 659.25, 783.99, 880.00, 1046.50, 1174.66];
      const baseFreq = freqMap[currentSceneIdx % freqMap.length];

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isAudioEnabled, currentSceneIdx]);

  // Scene switcher
  const goToScene = useCallback(
    (idx: number) => {
      const nextIdx = (idx + scenes.length) % scenes.length;
      setCurrentSceneIdx(nextIdx);
      setProgress(0);
      sceneStartTimeRef.current = Date.now();
      elapsedPauseTimeRef.current = 0;
    },
    [scenes.length]
  );

  const nextScene = useCallback(() => goToScene(currentSceneIdx + 1), [goToScene, currentSceneIdx]);
  const prevScene = useCallback(() => goToScene(currentSceneIdx - 1), [goToScene, currentSceneIdx]);

  // Sound trigger on scene change
  useEffect(() => {
    playSceneTransitionChime();
  }, [currentSceneIdx, playSceneTransitionChime]);

  // Main timer loop for autoplay and progress calculation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = now - sceneStartTimeRef.current;
        const currentProgress = Math.min(100, (elapsed / SCENE_DURATION_MS) * 100);
        setProgress(currentProgress);

        if (elapsed >= SCENE_DURATION_MS) {
          nextScene();
        }
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, nextScene]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (isPlaying) {
      elapsedPauseTimeRef.current = Date.now() - sceneStartTimeRef.current;
      setIsPlaying(false);
      backgroundAudioRef.current?.pause();
    } else {
      sceneStartTimeRef.current = Date.now() - elapsedPauseTimeRef.current;
      setIsPlaying(true);
      if (isAudioEnabled) {
        backgroundAudioRef.current?.play().catch(() => {});
      }
    }
  };

  // Handle Audio Mute/Unmute Toggle
  const toggleAudio = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    const audio = backgroundAudioRef.current;
    if (audio) {
      if (nextState && isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  };

  // Canvas background motion graphics (Constellation Grid, Waves & Pulse Beams)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes for the background network
    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));

    let animationTime = 0;

    const render = () => {
      animationTime += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Gradient backdrop glow based on active scene
      const scene = scenes[currentSceneIdx] || scenes[0];
      const isTeal = scene.accentColor.includes("teal");
      const isPurple = scene.accentColor.includes("purple") || scene.accentColor.includes("a855f7");
      const isGold = scene.accentColor.includes("f59e0b");

      const primaryGlow = isTeal
        ? "rgba(125, 211, 192, 0.06)"
        : isPurple
        ? "rgba(168, 85, 247, 0.06)"
        : isGold
        ? "rgba(245, 158, 11, 0.06)"
        : "rgba(59, 130, 246, 0.06)";

      // Radial energetic focal point
      const focalX = width * 0.65;
      const focalY = height * 0.5;
      const radGlow = ctx.createRadialGradient(focalX, focalY, 20, focalX, focalY, width * 0.6);
      radGlow.addColorStop(0, primaryGlow);
      radGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radGlow;
      ctx.fillRect(0, 0, width, height);

      // High-tech subtle grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated Cybernetic Concentric Radar Rings around focal point
      for (let r = 1; r <= 3; r++) {
        const ringRadius = (r * 110 + (animationTime * 18) % 110) * (height / 600);
        const ringAlpha = Math.max(0, 0.09 - ringRadius / (width * 0.8));
        ctx.beginPath();
        ctx.arc(focalX, focalY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isTeal
          ? `rgba(125, 211, 192, ${ringAlpha})`
          : `rgba(91, 155, 213, ${ringAlpha})`;
        ctx.setLineDash([4, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Dynamic Node & Edge Constellation
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Draw connecting lines to close neighbors
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(125, 211, 192, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node
        const pulse = Math.sin(animationTime * 2 + n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isTeal
          ? `rgba(125, 211, 192, ${0.2 + pulse * 0.4})`
          : `rgba(91, 155, 213, ${0.2 + pulse * 0.4})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentSceneIdx, scenes]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const IconComponent = currentScene.icon;

  return (
    <section id="motion" className="container" style={{ margin: "5rem auto", position: "relative", scrollMarginTop: "6rem" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1.1rem",
            borderRadius: "9999px",
            background: "rgba(125, 211, 192, 0.08)",
            border: "1px solid rgba(125, 211, 192, 0.3)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--accent-teal)",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <Sparkles size={16} /> {t("badge")}
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.2 }}>
          {t("title")} <span className="gradient-text">{t("titleHighlight")}</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto", fontSize: "1.1rem" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Motion Graphics Player Container */}
      <div
        ref={containerRef}
        className="glass"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(125, 211, 192, 0.25)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(125, 211, 192, 0.08)",
          background: "linear-gradient(180deg, rgba(13, 20, 36, 0.95) 0%, rgba(7, 10, 18, 0.98) 100%)",
          position: "relative",
          minHeight: "560px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background Animation Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Background Ambient Audio Track (Ummbrella - Deep Abstract Ambient) */}
        <audio ref={backgroundAudioRef} src="/audio/ambient-motion.mp3" loop preload="auto" />

        {/* Top Control Bar: Scene Selector Tabs & Status */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            background: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(10px)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Scene Navigation Pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {scenes.map((s, idx) => {
              const active = idx === currentSceneIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => goToScene(idx)}
                  style={{
                    background: active ? "rgba(125, 211, 192, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: active ? "1px solid var(--accent-teal)" : "1px solid rgba(255, 255, 255, 0.08)",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    padding: "0.35rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: active ? 600 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  title={s.title}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: active ? "var(--accent-teal)" : "rgba(255, 255, 255, 0.3)",
                      boxShadow: active ? "0 0 8px var(--accent-teal)" : "none",
                    }}
                  />
                  <span>0{idx + 1}</span>
                  <span className="hidden sm:inline" style={{ opacity: active ? 1 : 0.7 }}>
                    {s.shortTitle || s.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Utility Toggles (Audio, Fullscreen) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {isAudioEnabled && (
              <div
                className="animate-in fade-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.72rem",
                  color: "var(--accent-teal)",
                  background: "rgba(125, 211, 192, 0.08)",
                  border: "1px solid rgba(125, 211, 192, 0.2)",
                  borderRadius: "6px",
                  padding: "0.3rem 0.6rem",
                }}
                title={t("soundtrackTitle")}
              >
                <Music size={12} className="animate-pulse" />
                <span className="hidden md:inline">{t("ambientTrack")}</span>
              </div>
            )}

            <button
              onClick={toggleAudio}
              style={{
                background: isAudioEnabled ? "rgba(125, 211, 192, 0.18)" : "rgba(255, 255, 255, 0.05)",
                border: isAudioEnabled ? "1px solid var(--accent-teal)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: isAudioEnabled ? "var(--accent-teal)" : "var(--text-secondary)",
                borderRadius: "8px",
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              aria-label={isAudioEnabled ? t("muteLabel") : t("unmuteLabel")}
              title={isAudioEnabled ? t("soundActiveTitle") : t("soundMutedTitle")}
            >
              {isAudioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{isAudioEnabled ? t("soundOn") : t("soundOff")}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--text-secondary)",
                borderRadius: "8px",
                padding: "0.45rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label={t("toggleFullscreen")}
              title={t("fullscreen")}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Scene Content Area (Split: Left Storyboard / Right Kinetic Telemetry & Code) */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            padding: "2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {/* LEFT: Cinematic Narrative & Feature List */}
          <div
            key={`narrative-${currentScene.id}`}
            className="animate-in fade-in slide-in-from-left-6"
            style={{
              animationDuration: "500ms",
              animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Scene Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: currentScene.accentColor,
                marginBottom: "0.75rem",
                background: "rgba(255, 255, 255, 0.04)",
                padding: "0.25rem 0.65rem",
                borderRadius: "6px",
                border: `1px solid rgba(125, 211, 192, 0.2)`,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: currentScene.accentColor,
                  boxShadow: `0 0 8px ${currentScene.accentColor}`,
                }}
              />
              {currentScene.badge}
            </div>

            {/* Title with Dynamic Highlight */}
            <h3
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "0.5rem",
                color: "var(--text-primary)",
              }}
            >
              {currentScene.title}
            </h3>

            {/* Tagline */}
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--accent-teal)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.2rem",
              }}
            >
              {currentScene.tagline}
            </div>

            {/* Description Paragraph */}
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
              }}
            >
              {currentScene.description}
            </p>

            {/* Feature Highlights Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem", marginBottom: "1.75rem" }}>
              {currentScene.features.map((feat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    fontSize: "0.92rem",
                    color: "rgba(255, 255, 255, 0.88)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(125, 211, 192, 0.15)",
                      color: "var(--accent-teal)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Call-to-action on final scene */}
            {currentScene.id === "finale" ? (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="#contact" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                  {t("requestProject")} <ArrowRight size={16} />
                </a>
                <Link href="/tools/solution" className="btn glass" style={{ padding: "0.75rem 1.5rem" }}>
                  {t("allSolutions")}
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Link
                  href="/tools/solution"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--accent-teal)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    textDecoration: "underline",
                  }}
                >
                  {t("specLink")} <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: High-Tech Telemetry HUD & Live Architecture Visualizer */}
          <div
            key={`hud-${currentScene.id}`}
            className="animate-in fade-in slide-in-from-right-6"
            style={{
              animationDuration: "500ms",
              animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="glass"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(5, 8, 18, 0.75)",
                backdropFilter: "blur(16px)",
                padding: "1.5rem",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* HUD Header with Icon and Live Status Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "rgba(125, 211, 192, 0.1)",
                      border: "1px solid rgba(125, 211, 192, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: currentScene.accentColor,
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {t("archLayer")}
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {currentScene.category}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "9999px",
                    background: "rgba(39, 201, 63, 0.12)",
                    border: "1px solid rgba(39, 201, 63, 0.3)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#4ade80",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 6px #4ade80",
                    }}
                    className="animate-pulse"
                  />
                  {t("activeStatus")}
                </div>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                {currentScene.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-teal)", lineHeight: 1.2 }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", marginTop: "0.25rem" }}>
                      [{m.status}]
                    </div>
                  </div>
                ))}
              </div>

              {/* Code / Architecture Declaration Terminal */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.55)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "1rem",
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: "0.8rem",
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", gap: "6px", marginBottom: "0.75rem", opacity: 0.4 }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }} />
                  <span style={{ fontSize: "0.7rem", color: "#888", marginLeft: "0.5rem" }}>
                    infra_spec.ts
                  </span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    color: "rgba(255, 255, 255, 0.85)",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  <code>{currentScene.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Playback & Scrubber Controls */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "1rem 1.5rem",
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Timeline Progress Bar (Clickable scrubber) */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPercent = (e.clientX - rect.left) / rect.width;
              const targetScene = Math.min(
                scenes.length - 1,
                Math.max(0, Math.floor(clickPercent * scenes.length))
              );
              goToScene(targetScene);
            }}
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              marginBottom: "1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Base Filled Duration */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: `${((currentSceneIdx + progress / 100) / scenes.length) * 100}%`,
                background: "linear-gradient(90deg, var(--accent-blue), var(--accent-teal))",
                transition: "width 0.05s linear",
              }}
            />
          </div>

          {/* Buttons & Status Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Player Controls (Prev, Play/Pause, Next, Reset) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button
                onClick={prevScene}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--text-primary)",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={t("prevScene")}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={togglePlayPause}
                style={{
                  background: isPlaying
                    ? "linear-gradient(135deg, var(--accent-blue), var(--accent-teal))"
                    : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "0.5rem 1.1rem",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  boxShadow: isPlaying ? "0 0 15px rgba(125, 211, 192, 0.3)" : "none",
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? t("pause") : t("play")}</span>
              </button>

              <button
                onClick={nextScene}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--text-primary)",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={t("nextScene")}
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={() => goToScene(0)}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "var(--text-secondary)",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={t("replay")}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Time / Scene Counter & Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div>
                {t("scene")}{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>0{currentSceneIdx + 1}</span>{" "}
                {t("of")}{" "}
                <span>0{scenes.length}</span>
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.8rem",
                  color: "var(--accent-teal)",
                }}
              >
                00:{Math.floor((currentSceneIdx * SCENE_DURATION_MS + (progress / 100) * SCENE_DURATION_MS) / 1000)
                  .toString()
                  .padStart(2, "0")}{" "}
                / 00:{Math.floor((scenes.length * SCENE_DURATION_MS) / 1000)}s
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
