import { createContext, useContext, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   4 套潮系主题：NEON 霓虹 · SUNSET 日落 · MINT 薄荷 · OBSIDIAN 曜石
   ═══════════════════════════════════════════════════════════════════════════ */

export type ThemeId = "neon" | "sunset" | "mint" | "obsidian";

export interface SPalette {
  bg: string; surface: string; border: string; borderMed: string;
  primary: string; primaryDark: string; primaryLight: string; primaryMid: string;
  accent: string; accentLight: string; accentMid: string;
  success: string; successBg: string;
  warning: string; warningBg: string;
  danger: string; dangerBg: string;
  text: string; textSec: string; muted: string; mutedLight: string;
  radius: string; radiusSm: string; radiusLg: string;
  shadow: string; glass: string; glassBorder: string; onPrimary: string;
}

export interface ThemePalette {
  id: ThemeId; name: string; emoji: string; tagline: string;
  gradient: string;
  S: SPalette;
}

/* ── 1. NEON 霓虹（赛博粉紫） ───────────────────────────────────────── */
const NEON: ThemePalette = {
  id: "neon", name: "霓虹", emoji: "🌆", tagline: "Cyber Pink · 赛博之夜",
  gradient: "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)",
  S: {
    bg: "#fdf2f8", surface: "#ffffff",
    border: "rgba(236,72,153,0.08)", borderMed: "rgba(236,72,153,0.16)",
    primary: "#d946ef", primaryDark: "#a21caf",
    primaryLight: "rgba(217,70,239,0.08)", primaryMid: "rgba(217,70,239,0.18)",
    accent: "#f0abfc", accentLight: "rgba(236,72,153,0.08)", accentMid: "rgba(168,85,247,0.18)",
    success: "#10b981", successBg: "#ecfdf5",
    warning: "#f59e0b", warningBg: "#fffbeb",
    danger: "#ef4444", dangerBg: "#fef2f2",
    text: "#1e1b4b", textSec: "#581c87", muted: "#9ca3af", mutedLight: "#d1d5db",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 30px rgba(168,85,247,0.15)",
    glass: "rgba(255,255,255,0.65)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#ffffff",
  },
};

/* ── 2. SUNSET 日落（橘橙金） ───────────────────────────────────────── */
const SUNSET: ThemePalette = {
  id: "sunset", name: "日落", emoji: "🌅", tagline: "Coral Amber · 落日橘子海",
  gradient: "linear-gradient(135deg,#f97316 0%,#ef4444 45%,#ec4899 100%)",
  S: {
    bg: "#fff7ed", surface: "#ffffff",
    border: "rgba(249,115,22,0.08)", borderMed: "rgba(249,115,22,0.18)",
    primary: "#f97316", primaryDark: "#c2410c",
    primaryLight: "rgba(249,115,22,0.08)", primaryMid: "rgba(249,115,22,0.18)",
    accent: "#fed7aa", accentLight: "rgba(249,115,22,0.08)", accentMid: "rgba(239,68,68,0.16)",
    success: "#10b981", successBg: "#ecfdf5",
    warning: "#d97706", warningBg: "#fffbeb",
    danger: "#dc2626", dangerBg: "#fef2f2",
    text: "#431407", textSec: "#9a3412", muted: "#a8a29e", mutedLight: "#e7e5e4",
    radius: "16px", radiusSm: "10px", radiusLg: "24px",
    shadow: "0 8px 28px rgba(249,115,22,0.18)",
    glass: "rgba(255,255,255,0.7)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#ffffff",
  },
};

/* ── 3. MINT 薄荷（翡翠青绿） ────────────────────────────────────────── */
const MINT: ThemePalette = {
  id: "mint", name: "薄荷", emoji: "🍃", tagline: "Emerald Mint · 绿氧派对",
  gradient: "linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#0ea5e9 100%)",
  S: {
    bg: "#f0fdfa", surface: "#ffffff",
    border: "rgba(16,185,129,0.08)", borderMed: "rgba(20,184,166,0.18)",
    primary: "#10b981", primaryDark: "#047857",
    primaryLight: "rgba(16,185,129,0.08)", primaryMid: "rgba(20,184,166,0.18)",
    accent: "#a7f3d0", accentLight: "rgba(16,185,129,0.08)", accentMid: "rgba(14,165,233,0.16)",
    success: "#059669", successBg: "#ecfdf5",
    warning: "#f59e0b", warningBg: "#fffbeb",
    danger: "#ef4444", dangerBg: "#fef2f2",
    text: "#0f172a", textSec: "#134e4a", muted: "#64748b", mutedLight: "#cbd5e1",
    radius: "16px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 28px rgba(16,185,129,0.16)",
    glass: "rgba(255,255,255,0.68)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#ffffff",
  },
};

/* ── 4. OBSIDIAN 曜石（黑底琥珀金） ──────────────────────────────────── */
const OBSIDIAN: ThemePalette = {
  id: "obsidian", name: "曜石", emoji: "🪨", tagline: "Midnight Amber · 黑金之夜",
  gradient: "linear-gradient(135deg,#1f2937 0%,#111827 50%,#000000 100%)",
  S: {
    bg: "#0b0f19", surface: "#141a2a",
    border: "rgba(255,255,255,0.07)", borderMed: "rgba(255,255,255,0.14)",
    primary: "#f59e0b", primaryDark: "#d97706",
    primaryLight: "rgba(245,158,11,0.10)", primaryMid: "rgba(245,158,11,0.22)",
    accent: "#fbbf24", accentLight: "rgba(245,158,11,0.10)", accentMid: "rgba(251,191,36,0.22)",
    success: "#34d399", successBg: "rgba(52,211,153,0.10)",
    warning: "#fbbf24", warningBg: "rgba(251,191,36,0.10)",
    danger: "#f87171", dangerBg: "rgba(248,113,113,0.10)",
    text: "#f1f5f9", textSec: "#cbd5e1", muted: "#64748b", mutedLight: "#334155",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 30px rgba(0,0,0,0.6)",
    glass: "rgba(20,26,42,0.7)", glassBorder: "rgba(255,255,255,0.08)",
    onPrimary: "#111827",
  },
};

export const THEMES: ThemePalette[] = [NEON, SUNSET, MINT, OBSIDIAN];
export function getTheme(id: ThemeId): ThemePalette {
  return THEMES.find(t => t.id === id) ?? SUNSET;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE-LEVEL S SINGLETON + RERENDER STORE
   ═══════════════════════════════════════════════════════════════════════════
   原理：
     • 所有组件文件 import { S, useThemeSingleton } from '../theme'
     • S 是顶层可变对象引用（始终指向同一个 JS object）
     • ThemeProvider 每次渲染时，把当前主题的 S 浅拷贝合并进同一个顶层对象
     • 组件函数体第一行调用 useThemeSingleton()——订阅切换事件，一旦用户
       换主题，触发 useState 使得当前组件 rerender → 读取最新的顶层 S
   这样所有兄弟函数（NewGroupModal / MemberList / StatusBadge 等）都直接
   读同一个顶层 `S`，不需要各自调 hook。同时 React 组件能感知主题变了。
   ═══════════════════════════════════════════════════════════════════════════ */

// Shared mutable palette object. Always copy fields in, never replace the ref.
export let S: SPalette = { ...SUNSET.S };

// Current palette id + full theme
let currentId: ThemeId = "sunset";
export let currentTheme: ThemePalette = SUNSET;

// Lightweight pub/sub to notify subscribed React components on switch
type Listener = (tid: ThemeId) => void;
const listeners = new Set<Listener>();
function emit(tid: ThemeId) { listeners.forEach(l => l(tid)); }

// Public mutator: sync module-level S, paletteMeta, listeners
function applyTheme(id: ThemeId) {
  const t = getTheme(id);
  currentId = id;
  currentTheme = t;
  // Mutate in-place (preserve reference!)
  Object.assign(S, t.S);
  emit(id);
  // data-theme attribute
  try { document.documentElement.setAttribute("data-theme", id); } catch {}
}

const STORAGE_KEY = "sq_theme_id_v1";
function readStored(): ThemeId {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && (v === "neon" || v === "sunset" || v === "mint" || v === "obsidian")) return v;
  } catch {}
  return "sunset";
}

/* ── Hook for React components: call at TOP of every functional component ─ */
export function useThemeSingleton(): ThemePalette {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn: Listener = () => tick(x => x + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return currentTheme;
}

/* ── Context (for AppShell + ThemeSwitcher in App.tsx) ────────────────── */
interface ThemeCtx {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  palette: ThemePalette;
  themes: ThemePalette[];
}

const ThemeContext = createContext<ThemeCtx>({
  themeId: "sunset", setThemeId: () => {}, palette: SUNSET, themes: THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setId] = useState<ThemeId>(() => {
    const id = readStored();
    applyTheme(id);  // apply immediately on mount so module-level S is correct
    return id;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, themeId); } catch {}
  }, [themeId]);

  const setThemeId = (id: ThemeId) => {
    setId(id);
    applyTheme(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, palette: currentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  return useContext(ThemeContext);
}
