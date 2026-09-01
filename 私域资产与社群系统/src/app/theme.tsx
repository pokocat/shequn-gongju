import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   5 套潮系主题 × 3 种明暗模式 = 10+ 种外观
   主题：NEON 霓虹 · SUNSET 日落 · MINT 薄荷 · OBSIDIAN 曜石 · ACID 酸柠（经典黄绿荧光UI）
   模式：LIGHT（强制明亮）· DARK（强制暗黑）· AUTO（跟随系统 prefers-color-scheme）
   ═══════════════════════════════════════════════════════════════════════════ */

export type ThemeId = "neon" | "sunset" | "mint" | "obsidian" | "acid";
export type DarkMode = "light" | "dark" | "auto";
export type ResolvedMode = "light" | "dark";

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

/** 读取系统 prefers-color-scheme，SSR / 不可用时返回 light */
function getSystemScheme(): ResolvedMode {
  try {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  } catch {}
  return "light";
}

/** 把用户模式（light/dark/auto）解析成最终的亮 / 暗色板 */
export function resolveUserMode(mode: DarkMode): ResolvedMode {
  if (mode === "auto") return getSystemScheme();
  return mode;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE-LEVEL S SINGLETON + pub/sub
   ═══════════════════════════════════════════════════════════════════════════ */

// Shared mutable palette object. Always copy fields in, never replace the ref.
export let S: SPalette = { ...SUNSET.light };

// Current state
let currentId: ThemeId = "sunset";
let currentUserMode: DarkMode = "light";
let currentResolved: ResolvedMode = "light";
export let currentTheme: ThemePalette = SUNSET;
export let isDark: boolean = false;

type Listener = (tid: ThemeId) => void;
const listeners = new Set<Listener>();
function emit(tid: ThemeId) { listeners.forEach(l => l(tid)); }

/** Compute SPalette by combining theme id + resolved light/dark mode */
export function resolvePalette(id: ThemeId, resolved: ResolvedMode): SPalette {
  const t = getTheme(id);
  return resolved === "dark" ? t.dark : t.light;
}

/** Public mutator — applies theme id AND user mode (auto → resolve by system) together. */
function applyAppearance(id: ThemeId, userMode: DarkMode) {
  const resolved = resolveUserMode(userMode);
  const t = getTheme(id);
  currentId = id;
  currentUserMode = userMode;
  currentResolved = resolved;
  currentTheme = t;
  isDark = resolved === "dark";
  Object.assign(S, resolvePalette(id, resolved));
  emit(id);
  try {
    document.documentElement.setAttribute("data-theme", id);
    document.documentElement.setAttribute("data-dark-mode", userMode);
    document.documentElement.setAttribute("data-dark", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
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
    if (v === "light" || v === "dark" || v === "auto") return v;
  } catch {}
  return "auto"; // 默认跟随系统：新用户首次进 / 无 localStorage → auto
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
  darkMode: DarkMode;                 // 用户选择：light / dark / auto
  setDarkMode: (m: DarkMode) => void;
  toggleDarkMode: () => void;         // 3 态循环：light → auto → dark → light
  cycleDarkMode: () => void;          // 同 toggleDarkMode（别名更清晰）
  resolvedMode: ResolvedMode;         // 实际解析的亮/暗
  resolvedDark: boolean;              // 等价于 resolvedMode === "dark"（UI 判定用）
  palette: ThemePalette;
  themes: ThemePalette[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeCtx>({
  themeId: "sunset", setThemeId: () => {},
  darkMode: "auto", setDarkMode: () => {}, toggleDarkMode: () => {}, cycleDarkMode: () => {},
  resolvedMode: "light", resolvedDark: false,
  palette: SUNSET, themes: THEMES, isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setId] = useState<ThemeId>(() => readStoredId());
  const [darkMode, setMode] = useState<DarkMode>(() => {
    const m = readStoredMode();
    // 首帧同步：module-level S + currentTheme + DOM 属性
    applyAppearance(readStoredId(), m);
    return m;
  });
  // 记录当前解析出的 resolvedMode，随系统变化更新，供 UI 判断颜色风格
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>(() => resolveUserMode(readStoredMode()));

  // ═══ 系统明暗变化监听（auto 模式时实时跟随）═══
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // 无论当前用户在哪个模式，都同步解析一下：
      // - 若用户选 auto：立即重新应用 S + listeners rerender
      // - 若用户选 light/dark：resolved 不变，也重算一下避免状态机漂移
      const nextResolved = resolveUserMode(darkMode);
      if (nextResolved !== currentResolved) {
        applyAppearance(themeId, darkMode);
        setResolvedMode(nextResolved);
      }
    };
    // 兼容 Safari 13 旧 API
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else (mql as any).addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else (mql as any).removeListener(handler);
    };
  }, [themeId, darkMode]);

  // 每次 themeId/darkMode 变化：同步持久化 + 同步应用到 S + listeners + <html>
  const setThemeId = (id: ThemeId) => {
    if (id === themeId) return;
    applyAppearance(id, darkMode);
    try { localStorage.setItem(ID_KEY, id); } catch {}
    setId(id);
    setResolvedMode(resolveUserMode(darkMode));
  };
  const setDarkMode = (m: DarkMode) => {
    if (m === darkMode) return;
    applyAppearance(themeId, m);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
    setMode(m);
    setResolvedMode(resolveUserMode(m));
  };
  // 3 态循环：明亮(☀️) → 自动(🖥️) → 暗黑(🌙) → 明亮
  const cycleDarkMode = () => {
    const order: DarkMode[] = ["light", "auto", "dark"];
    const idx = order.indexOf(darkMode);
    const next = order[(idx + 1) % order.length];
    setDarkMode(next);
  };
  // 向后兼容：保留 toggleDarkMode 名字指向 3 态循环
  const toggleDarkMode = cycleDarkMode;

  return (
    <ThemeContext.Provider value={{
      themeId, setThemeId,
      darkMode, setDarkMode, toggleDarkMode, cycleDarkMode,
      resolvedMode, resolvedDark: resolvedMode === "dark",
      palette: currentTheme, themes: THEMES,
      isDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  return useContext(ThemeContext);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DarkModePicker —— 暗黑模式下拉选择器（共用组件）
   · 触发器：显示当前态 icon + 样式，右侧带下拉 chevron
   · 菜单：☀️ 强制明亮 / 🖥️ 跟随系统 / 🌙 强制暗黑，当前态打勾
   · 关闭三条路径：选中 / 点击外部 / Esc
   · 两处复用：PC ThemeControls + Landing NavBar
   ═══════════════════════════════════════════════════════════════════════════ */
export function DarkModePicker({
  className = "",
  menuAlign = "right", // "left" | "right"
}: { className?: string; menuAlign?: "left" | "right" }) {
  useThemeSingleton();
  const ctx = useTheme();
  const { themeId, setDarkMode, darkMode, resolvedDark } = ctx;
  const activePalette = resolvePalette(themeId, resolvedDark ? "dark" : "light");

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // ── 关闭三条路径 ──
  // 挂载时只注册一次，通过 openRef 读取最新 open 状态，
  // 避免 browser_click 等工具在同一事件序列里先 pointerdown 再 click 导致
  // "click 触发 setOpen(true) → useEffect 注册新 handler → 后续 pointerdown 被捕获 → 立即关闭" 的竞态问题
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!openRef.current) return;
      if (!wrapperRef.current || !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!openRef.current) return;
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // ── 当前触发器外观 ──
  const trigger = (() => {
    switch (darkMode) {
      case "light":
        return { Icon: Sun, bg: S.surface, color: S.muted, border: `1px solid ${S.borderMed}`, shadow: "none", isAuto: false };
      case "auto":
        return { Icon: Monitor, bg: `linear-gradient(135deg, ${S.borderMed} 0%, ${S.accentMid} 50%, ${S.border} 100%)`, color: S.text, border: `1px solid ${S.primaryMid}`, shadow: S.accentGlow, isAuto: true };
      case "dark":
      default:
        return { Icon: Moon, bg: getTheme(themeId).gradient, color: activePalette.onPrimary, border: "1px solid transparent", shadow: S.shadow, isAuto: false };
    }
  })();

  // ── 菜单项数据 ──
  const items: { value: DarkMode; Icon: typeof Sun; label: string; hint?: string }[] = [
    { value: "light", Icon: Sun, label: "强制明亮" },
    { value: "auto", Icon: Monitor, label: "跟随系统", hint: `实际显示${resolvedDark ? "暗黑" : "明亮"}` },
    { value: "dark", Icon: Moon, label: "强制暗黑" },
  ];

  return (
    <div ref={wrapperRef} className={`relative flex-shrink-0 ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="dark-mode-picker-menu"
        aria-label={`暗黑模式：${darkMode === "light" ? "强制明亮" : darkMode === "auto" ? `跟随系统（实际${resolvedDark ? "暗黑" : "明亮"}）` : "强制暗黑"} · 点击选择`}
        title="暗黑模式 · 点击选择 明亮 / 跟随系统 / 暗黑"
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: trigger.bg,
          color: trigger.color,
          border: trigger.border,
          borderRadius: S.radiusSm,
          boxShadow: trigger.shadow,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <trigger.Icon size={15} />
        {trigger.isAuto && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center font-black"
            style={{
              background: S.primary,
              color: activePalette.onPrimary,
              fontSize: 9,
              lineHeight: 1,
              borderRadius: 999,
              border: `1.5px solid ${S.surface}`,
              fontFamily: "monospace",
            }}
          >A</span>
        )}
      </button>

      {/* Menu */}
      {open && (
        <div
          id="dark-mode-picker-menu"
          role="listbox"
          aria-label="选择暗黑模式"
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: `calc(100% + 8px)`,
            [menuAlign === "left" ? "left" : "right"]: 0,
            minWidth: 188,
            background: S.surface,
            border: `1px solid ${S.borderMed}`,
            borderRadius: S.radiusLg,
            boxShadow: S.shadow,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            padding: "6px",
            zIndex: 1000,
          }}
        >
          {items.map(it => {
            const active = darkMode === it.value;
            return (
              <button
                key={it.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setDarkMode(it.value); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: S.radiusSm,
                  background: active ? S.primaryLight : "transparent",
                  color: active ? S.primaryDark : S.text,
                  cursor: "pointer",
                  border: "none",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  lineHeight: 1.3,
                  transition: "background 120ms",
                }}
                onMouseEnter={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = S.glass; (e.currentTarget as HTMLElement).style.color = S.primary; }
                }}
                onMouseLeave={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = S.text; }
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 24, height: 24,
                    alignItems: "center", justifyContent: "center",
                    borderRadius: 6,
                    background: active ? S.primary : S.surface,
                    border: `1px solid ${active ? "transparent" : S.borderMed}`,
                    color: active ? activePalette.onPrimary : S.muted,
                    flexShrink: 0,
                  }}
                >
                  <it.Icon size={13} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  {it.label}
                  {it.hint && (
                    <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: S.muted, marginTop: 1 }}>
                      {it.hint}
                    </span>
                  )}
                </span>
                {active && (
                  <span style={{ color: S.primary, display: "inline-flex" }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ThemePicker —— 主题风格下拉选择器
   · 触发器：当前主题 emoji + 名称 + 下拉箭头
   · 菜单：emoji + 名称 + tagline，当前项打勾
   · 关闭三条路径：选中 / 点击外部 / Esc
   · 关闭事件监听只注册一次，避免 pointerdown/click 竞态
   ═══════════════════════════════════════════════════════════════════════════ */
export function ThemePicker({
  className = "",
  menuAlign = "right",
}: { className?: string; menuAlign?: "left" | "right" }) {
  useThemeSingleton();
  const ctx = useTheme();
  const { themeId, setThemeId, resolvedDark } = ctx;
  const activePalette = resolvePalette(themeId, resolvedDark ? "dark" : "light");
  const currentTheme = getTheme(themeId);

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // ── 关闭三条路径（只注册一次，用 ref 读最新 open） ──
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!openRef.current) return;
      if (!wrapperRef.current || !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!openRef.current) return;
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // ── 触发器：显示 VIBE 标签 + 当前主题 ──
  const trigger = (
    <div
      className="flex items-center gap-1.5 pr-1 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        paddingLeft: 8,
        paddingTop: 4,
        paddingBottom: 4,
        background: S.glass,
        border: `1px solid ${S.glassBorder}`,
        borderRadius: "999px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: S.shadow,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: S.muted,
          fontFamily: "monospace",
          userSelect: "none",
        }}
      >
        VIBE
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          borderRadius: "999px",
          background: currentTheme.gradient,
          color: activePalette.onPrimary,
          fontSize: 12,
          fontWeight: 700,
          boxShadow: S.accentGlow,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>{currentTheme.emoji}</span>
        <span>{currentTheme.name}</span>
      </span>
      <ChevronDown size={12} style={{ color: S.muted, flexShrink: 0 }} />
    </div>
  );

  return (
    <div ref={wrapperRef} className={`relative flex-shrink-0 ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="theme-picker-menu"
        aria-label={`主题风格：${currentTheme.name} · 点击选择`}
        title="主题风格 · 点击选择 霓虹 / 日落 / 薄荷 / 曜石 / 酸柠"
        onClick={() => setOpen(o => !o)}
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        {trigger}
      </button>

      {/* Menu */}
      {open && (
        <div
          id="theme-picker-menu"
          role="listbox"
          aria-label="选择主题风格"
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: `calc(100% + 8px)`,
            [menuAlign === "left" ? "left" : "right"]: 0,
            minWidth: 200,
            background: S.surface,
            border: `1px solid ${S.borderMed}`,
            borderRadius: S.radiusLg,
            boxShadow: S.shadow,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            padding: "6px",
            zIndex: 1000,
          }}
        >
          {THEMES.map(t => {
            const active = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setThemeId(t.id); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: S.radiusSm,
                  background: active ? S.primaryLight : "transparent",
                  color: active ? S.primaryDark : S.text,
                  cursor: "pointer",
                  border: "none",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  lineHeight: 1.3,
                  transition: "background 120ms",
                }}
                onMouseEnter={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = S.glass; (e.currentTarget as HTMLElement).style.color = S.primary; }
                }}
                onMouseLeave={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = S.text; }
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 28, height: 28,
                    alignItems: "center", justifyContent: "center",
                    borderRadius: 8,
                    background: active ? t.gradient : S.surface,
                    border: `1px solid ${active ? "transparent" : S.borderMed}`,
                    color: active ? activePalette.onPrimary : S.muted,
                    fontSize: 14,
                    flexShrink: 0,
                    boxShadow: active ? S.shadow : "none",
                  }}
                >
                  {t.emoji}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  {t.name}
                  <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: S.muted, marginTop: 1 }}>
                    {t.tagline}
                  </span>
                </span>
                {active && (
                  <span style={{ color: S.primary, display: "inline-flex" }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ThemeControls —— PC 视图 Header 右上角使用
   ═══════════════════════════════════════════════════════════════════════════ */
export function ThemeControls() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* ── 暗黑模式下拉选择器 ──────────────────────────────────────── */}
      <DarkModePicker />

      {/* ── 主题风格下拉选择器 ──────────────────────────────────────── */}
      <ThemePicker />
    </div>
  );
}
