import { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   4 套潮系主题 × 2 种明暗模式 = 8 种外观
   主题：NEON 霓虹 · SUNSET 日落 · MINT 薄荷 · OBSIDIAN 曜石 · ACID 酸柠（经典黄绿荧光UI）
   模式：LIGHT（明亮）· DARK（暗黑）—— 独立开关
   ═══════════════════════════════════════════════════════════════════════════ */

export type ThemeId = "neon" | "sunset" | "mint" | "obsidian" | "acid";
export type DarkMode = "light" | "dark";

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
  gradient: string; accentGlow: string;
  /** Light 模式下的色板 */
  light: SPalette;
  /** Dark 模式下的色板 */
  dark: SPalette;
}

/* 色板 helper：每个主题分别定义 light / dark 两套 S。
   核心原则：primary/accent/渐变 保持不变（品牌识别色），
   bg/surface/text/border/shadow 明暗互换（氛围）。 */

/* ── 1. NEON 霓虹（赛博粉紫） ───────────────────────────────────────── */
const NEON: ThemePalette = {
  id: "neon", name: "霓虹", emoji: "🌆", tagline: "Cyber Pink · 赛博之夜",
  gradient: "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)",
  accentGlow: "0 0 0 2px rgba(168,85,247,0.25)",
  light: {
    bg: "#fdf2f8", surface: "#ffffff",
    border: "rgba(236,72,153,0.08)", borderMed: "rgba(236,72,153,0.18)",
    primary: "#d946ef", primaryDark: "#a21caf",
    primaryLight: "rgba(217,70,239,0.08)", primaryMid: "rgba(217,70,239,0.18)",
    accent: "#f0abfc", accentLight: "rgba(236,72,153,0.08)", accentMid: "rgba(168,85,247,0.18)",
    success: "#10b981", successBg: "#ecfdf5",
    warning: "#f59e0b", warningBg: "#fffbeb",
    danger: "#ef4444", dangerBg: "#fef2f2",
    text: "#1e1b4b", textSec: "#581c87", muted: "#9ca3af", mutedLight: "#d1d5db",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 30px rgba(168,85,247,0.14)",
    glass: "rgba(255,255,255,0.65)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#ffffff",
  },
  dark: {
    bg: "#0a0416", surface: "#150a2a",
    border: "rgba(217,70,239,0.14)", borderMed: "rgba(217,70,239,0.26)",
    primary: "#e879f9", primaryDark: "#c026d3",
    primaryLight: "rgba(232,121,249,0.14)", primaryMid: "rgba(232,121,249,0.26)",
    accent: "#f0abfc", accentLight: "rgba(236,72,153,0.14)", accentMid: "rgba(168,85,247,0.26)",
    success: "#34d399", successBg: "rgba(52,211,153,0.14)",
    warning: "#fbbf24", warningBg: "rgba(251,191,36,0.14)",
    danger: "#f87171", dangerBg: "rgba(248,113,113,0.14)",
    text: "#f5d0fe", textSec: "#e9d5ff", muted: "#7c6ca6", mutedLight: "#3b2d5c",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 24px rgba(168,85,247,0.25)",
    glass: "rgba(21,10,42,0.75)", glassBorder: "rgba(217,70,239,0.22)",
    onPrimary: "#1a0533",
  },
};

/* ── 2. SUNSET 日落（橘橙金） ───────────────────────────────────────── */
const SUNSET: ThemePalette = {
  id: "sunset", name: "日落", emoji: "🌅", tagline: "Coral Amber · 落日橘子海",
  gradient: "linear-gradient(135deg,#f97316 0%,#ef4444 45%,#ec4899 100%)",
  accentGlow: "0 0 0 2px rgba(249,115,22,0.25)",
  light: {
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
    shadow: "0 8px 28px rgba(249,115,22,0.16)",
    glass: "rgba(255,255,255,0.7)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#ffffff",
  },
  dark: {
    bg: "#140a05", surface: "#22120a",
    border: "rgba(249,115,22,0.14)", borderMed: "rgba(249,115,22,0.26)",
    primary: "#fb923c", primaryDark: "#ea580c",
    primaryLight: "rgba(251,146,60,0.14)", primaryMid: "rgba(251,146,60,0.26)",
    accent: "#fed7aa", accentLight: "rgba(249,115,22,0.14)", accentMid: "rgba(239,68,68,0.24)",
    success: "#34d399", successBg: "rgba(52,211,153,0.14)",
    warning: "#fbbf24", warningBg: "rgba(251,191,36,0.14)",
    danger: "#f87171", dangerBg: "rgba(248,113,113,0.14)",
    text: "#ffedd5", textSec: "#fed7aa", muted: "#a8a29e", mutedLight: "#442716",
    radius: "16px", radiusSm: "10px", radiusLg: "24px",
    shadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 24px rgba(249,115,22,0.22)",
    glass: "rgba(34,18,10,0.75)", glassBorder: "rgba(249,115,22,0.22)",
    onPrimary: "#1a0b05",
  },
};

/* ── 3. MINT 薄荷（翡翠青绿） ────────────────────────────────────────── */
const MINT: ThemePalette = {
  id: "mint", name: "薄荷", emoji: "🍃", tagline: "Emerald Mint · 绿氧派对",
  gradient: "linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#0ea5e9 100%)",
  accentGlow: "0 0 0 2px rgba(16,185,129,0.25)",
  light: {
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
  dark: {
    bg: "#031410", surface: "#0a241c",
    border: "rgba(20,184,166,0.14)", borderMed: "rgba(20,184,166,0.26)",
    primary: "#34d399", primaryDark: "#10b981",
    primaryLight: "rgba(52,211,153,0.14)", primaryMid: "rgba(52,211,153,0.26)",
    accent: "#a7f3d0", accentLight: "rgba(16,185,129,0.14)", accentMid: "rgba(14,165,233,0.24)",
    success: "#34d399", successBg: "rgba(52,211,153,0.14)",
    warning: "#fbbf24", warningBg: "rgba(251,191,36,0.14)",
    danger: "#f87171", dangerBg: "rgba(248,113,113,0.14)",
    text: "#ccfbf1", textSec: "#99f6e4", muted: "#64748b", mutedLight: "#0f3a2e",
    radius: "16px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 24px rgba(16,185,129,0.22)",
    glass: "rgba(10,36,28,0.75)", glassBorder: "rgba(20,184,166,0.22)",
    onPrimary: "#021510",
  },
};

/* ── 4. OBSIDIAN 曜石（黑底琥珀金） ──────────────────────────────────── */
const OBSIDIAN: ThemePalette = {
  id: "obsidian", name: "曜石", emoji: "🪨", tagline: "Midnight Amber · 黑金之夜",
  gradient: "linear-gradient(135deg,#1f2937 0%,#111827 50%,#000000 100%)",
  accentGlow: "0 0 0 2px rgba(245,158,11,0.25)",
  light: {
    // 曜石明：暖灰白 + 琥珀金（不常见但保持一致性的"亮版黑金"）
    bg: "#f8fafc", surface: "#ffffff",
    border: "rgba(15,23,42,0.08)", borderMed: "rgba(15,23,42,0.18)",
    primary: "#d97706", primaryDark: "#92400e",
    primaryLight: "rgba(217,119,6,0.08)", primaryMid: "rgba(217,119,6,0.18)",
    accent: "#fbbf24", accentLight: "rgba(245,158,11,0.08)", accentMid: "rgba(251,191,36,0.20)",
    success: "#10b981", successBg: "#ecfdf5",
    warning: "#d97706", warningBg: "#fffbeb",
    danger: "#dc2626", dangerBg: "#fef2f2",
    text: "#0f172a", textSec: "#475569", muted: "#64748b", mutedLight: "#cbd5e1",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 30px rgba(15,23,42,0.12)",
    glass: "rgba(255,255,255,0.72)", glassBorder: "rgba(15,23,42,0.10)",
    onPrimary: "#ffffff",
  },
  dark: {
    // 曜石暗（原始）：纯黑 + 琥珀金
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
    shadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 24px rgba(245,158,11,0.22)",
    glass: "rgba(20,26,42,0.75)", glassBorder: "rgba(255,255,255,0.08)",
    onPrimary: "#111827",
  },
};

/* ── 5. ACID 酸柠（经典黄绿荧光 · 原系统最早期UI配色） ───────────────────── */
const ACID: ThemePalette = {
  id: "acid", name: "酸柠", emoji: "💛", tagline: "Lime Acid · 经典黄绿荧光",
  gradient: "linear-gradient(135deg,#a3e635 0%,#bef264 50%,#eab308 100%)",
  accentGlow: "0 0 0 2px rgba(204,255,0,0.35)",
  light: {
    // 明亮黄绿：纸白+嫩柠草绿（经典荧光黄柔和化，不刺眼）
    bg: "#f7fce9", surface: "#ffffff",
    border: "rgba(163,230,53,0.10)", borderMed: "rgba(163,230,53,0.22)",
    primary: "#a3e635", primaryDark: "#65a30d",
    primaryLight: "rgba(163,230,53,0.10)", primaryMid: "rgba(163,230,53,0.22)",
    accent: "#ccff00", accentLight: "rgba(204,255,0,0.12)", accentMid: "rgba(204,255,0,0.28)",
    success: "#16a34a", successBg: "#f0fdf4",
    warning: "#eab308", warningBg: "#fefce8",
    danger: "#dc2626", dangerBg: "#fef2f2",
    text: "#1a2e05", textSec: "#4d7c0f", muted: "#78716c", mutedLight: "#d6d3d1",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 8px 28px rgba(101,163,13,0.18)",
    glass: "rgba(255,255,255,0.70)", glassBorder: "rgba(255,255,255,0.6)",
    onPrimary: "#1a2e05",
  },
  dark: {
    // 暗黑荧光：纯黑底 + 酸柠荧光黄（复刻早期 ccff00 + 0d0d0d 赛博味道）
    bg: "#0a1205", surface: "#141f0b",
    border: "rgba(204,255,0,0.14)", borderMed: "rgba(204,255,0,0.26)",
    primary: "#bef264", primaryDark: "#a3e635",
    primaryLight: "rgba(190,242,100,0.16)", primaryMid: "rgba(190,242,100,0.30)",
    accent: "#eaff5a", accentLight: "rgba(204,255,0,0.14)", accentMid: "rgba(204,255,0,0.30)",
    success: "#4ade80", successBg: "rgba(74,222,128,0.14)",
    warning: "#facc15", warningBg: "rgba(250,204,21,0.14)",
    danger: "#f87171", dangerBg: "rgba(248,113,113,0.14)",
    text: "#ecfccb", textSec: "#d9f99d", muted: "#a3a29e", mutedLight: "#2c3d14",
    radius: "14px", radiusSm: "10px", radiusLg: "22px",
    shadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 26px rgba(204,255,0,0.25)",
    glass: "rgba(20,31,11,0.75)", glassBorder: "rgba(204,255,0,0.24)",
    onPrimary: "#0a1205",
  },
};

export const THEMES: ThemePalette[] = [NEON, SUNSET, MINT, OBSIDIAN, ACID];
export function getTheme(id: ThemeId): ThemePalette {
  return THEMES.find(t => t.id === id) ?? SUNSET;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE-LEVEL S SINGLETON + pub/sub
   ═══════════════════════════════════════════════════════════════════════════ */

// Shared mutable palette object. Always copy fields in, never replace the ref.
export let S: SPalette = { ...SUNSET.light };

// Current state
let currentId: ThemeId = "sunset";
let currentMode: DarkMode = "light";
export let currentTheme: ThemePalette = SUNSET;
export let isDark: boolean = false;

type Listener = (tid: ThemeId) => void;
const listeners = new Set<Listener>();
function emit(tid: ThemeId) { listeners.forEach(l => l(tid)); }

/** Compute SPalette by combining theme id + dark mode */
export function resolvePalette(id: ThemeId, mode: DarkMode): SPalette {
  const t = getTheme(id);
  return mode === "dark" ? t.dark : t.light;
}

/** Public mutator — applies theme id AND dark mode together. */
function applyAppearance(id: ThemeId, mode: DarkMode) {
  const t = getTheme(id);
  currentId = id;
  currentMode = mode;
  currentTheme = t;
  isDark = mode === "dark";
  Object.assign(S, resolvePalette(id, mode));
  emit(id);
  try {
    document.documentElement.setAttribute("data-theme", id);
    document.documentElement.setAttribute("data-dark", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  } catch {}
}

const ID_KEY = "sq_theme_id_v1";
const MODE_KEY = "sq_dark_mode_v1";

function readStoredId(): ThemeId {
  try {
    const v = localStorage.getItem(ID_KEY);
    if (v && (v === "neon" || v === "sunset" || v === "mint" || v === "obsidian" || v === "acid")) return v;
  } catch {}
  return "sunset";
}
function readStoredMode(): DarkMode {
  try {
    const v = localStorage.getItem(MODE_KEY);
    if (v === "light" || v === "dark") return v;
    // 自动跟随系统：如果系统偏好 dark 则默认 dark
    if (typeof window !== "undefined" && window.matchMedia) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
  } catch {}
  return "light";
}

/* ── React hook ──────────────────────────────────────────────────────── */
export function useThemeSingleton(): ThemePalette {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn: Listener = () => tick(x => x + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return currentTheme;
}

/* ── Context ────────────────────────────────────────────────────────── */
interface ThemeCtx {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  darkMode: DarkMode;
  setDarkMode: (m: DarkMode) => void;
  toggleDarkMode: () => void;
  palette: ThemePalette;
  themes: ThemePalette[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeCtx>({
  themeId: "sunset", setThemeId: () => {},
  darkMode: "light", setDarkMode: () => {}, toggleDarkMode: () => {},
  palette: SUNSET, themes: THEMES, isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setId] = useState<ThemeId>(() => {
    const id = readStoredId();
    return id;
  });
  const [darkMode, setMode] = useState<DarkMode>(() => {
    const m = readStoredMode();
    // 同步初始化 module-level S + currentTheme + DOM 属性
    // 让 React 首帧渲染前 S 值就正确，避免 bg 颜色滞后 1 帧
    applyAppearance(readStoredId(), m);
    return m;
  });

  // 每次 themeId/darkMode 变化：同步持久化 + 同步应用到 S + listeners + <html>
  // 不用 useEffect：effect 是异步的，会让 S 滞后 1 个 render tick（主 bg 是旧色）
  const setThemeId = (id: ThemeId) => {
    if (id === themeId) return;
    applyAppearance(id, darkMode);
    try { localStorage.setItem(ID_KEY, id); } catch {}
    setId(id);
  };
  const setDarkMode = (m: DarkMode) => {
    if (m === darkMode) return;
    applyAppearance(themeId, m);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
    setMode(m);
  };
  const toggleDarkMode = () => setDarkMode(darkMode === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{
      themeId, setThemeId,
      darkMode, setDarkMode, toggleDarkMode,
      palette: currentTheme, themes: THEMES,
      isDark: isDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  return useContext(ThemeContext);
}

export function ThemeControls() {
  useThemeSingleton();
  const ctx = useTheme();
  const { themeId, setThemeId, darkMode, toggleDarkMode } = ctx;
  const dark = darkMode === "dark";
  const activePalette = resolvePalette(themeId, darkMode);

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* ── 暗黑模式开关 ─────────────────────────────────────────────── */}
      <button
        type="button"
        aria-label={dark ? "切换为明亮模式" : "切换为暗黑模式"}
        title={dark ? "暗黑模式 · 点击切换为明亮" : "明亮模式 · 点击切换为暗黑"}
        onClick={toggleDarkMode}
        className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: dark
            ? getTheme(themeId).gradient
            : S.surface,
          color: dark ? activePalette.onPrimary : S.muted,
          border: `1px solid ${dark ? "transparent" : S.borderMed}`,
          borderRadius: S.radiusSm,
          boxShadow: dark ? S.shadow : "none",
          backdropFilter: "blur(10px)",
        }}
      >
        {dark ? <Moon size={15} /> : <Sun size={15} />}
      </button>

      {/* ── 主题切换胶囊 ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 px-1.5 py-1 flex-shrink-0"
        style={{
          background: S.glass,
          border: `1px solid ${S.glassBorder}`,
          borderRadius: "999px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: S.shadow,
          fontFamily: "monospace",
        }}
      >
        <span className="px-1.5 text-[10px] font-bold tracking-[0.14em] select-none"
              style={{ color: S.muted }}>VIBE</span>
        {THEMES.map(t => {
          const active = t.id === themeId;
          return (
            <button
              key={t.id}
              type="button"
              title={`${t.name} · ${t.tagline}`}
              onClick={() => setThemeId(t.id)}
              className="w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 relative"
              style={{
                borderRadius: "999px",
                background: active ? t.gradient : "transparent",
                color: active ? "#fff" : S.textSec,
                transform: active ? "translateY(-1px) scale(1.05)" : "none",
                boxShadow: active ? S.shadow : "none",
                border: active ? "none" : "1px solid transparent",
              }}
            >
              {t.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
