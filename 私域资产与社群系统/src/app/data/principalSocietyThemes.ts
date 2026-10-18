import type { CSSProperties } from "react";
import type { ThemeId } from "./principalSociety";

export type PrincipalThemeCopy = {
  messages: { title: string; subtitle: string; section: string; action: string };
  projects: { title: string; subtitle: string; section: string; action: string };
  console: { title: string; subtitle: string; section: string; action: string };
  growth: { title: string; subtitle: string; section: string; action: string };
  mine: { title: string; subtitle: string; section: string; action: string };
};

export type PrincipalTheme = {
  id: ThemeId;
  name: string;
  tagline: string;
  fontFamily: string;
  layout: "airy" | "editorial" | "dense" | "dashboard" | "content";
  vars: CSSProperties;
  copy: PrincipalThemeCopy;
};

const copy = (prefix: string, tone: string): PrincipalThemeCopy => ({
  messages: { title: prefix, subtitle: tone, section: "最近会话", action: "查看全部" },
  projects: { title: "项目", subtitle: tone, section: "正在推进", action: "发现项目" },
  console: { title: "主理台", subtitle: tone, section: "经营总览", action: "切换身份" },
  growth: { title: "成长", subtitle: tone, section: "今日任务", action: "继续前进" },
  mine: { title: "我的", subtitle: tone, section: "账户与权益", action: "管理设置" },
});

const palettes = {
  peach: ["#d86d4f", "#a84a35", "#fff7f1", "#fffdfb", "#3d2924", "#967b72", "#f4ded5", "#4b9b72", "#c4843b", "#c75a58", "24px", "0 16px 38px rgba(216,109,79,.14)"],
  orchid: ["#9a5bb5", "#6c3b85", "#faf5fc", "#ffffff", "#322638", "#8d7c91", "#f1e4f7", "#4c9b83", "#bd7c35", "#c45d75", "22px", "0 16px 38px rgba(154,91,181,.14)"],
  amber: ["#c88720", "#8e5b0d", "#fff9ed", "#fffdf8", "#392d1b", "#8f836e", "#f6e8c9", "#5a9a73", "#c88720", "#c35d51", "20px", "0 16px 34px rgba(200,135,32,.14)"],
  rose: ["#c95770", "#96364d", "#fff5f7", "#ffffff", "#38252b", "#927d83", "#f8e1e6", "#509678", "#bf8541", "#bc5362", "24px", "0 16px 38px rgba(201,87,112,.14)"],
  "mono-lime": ["#78a62d", "#4c7417", "#f8fbef", "#ffffff", "#29321d", "#7c8870", "#eaf2d2", "#5b9c68", "#ba8137", "#b95c55", "18px", "0 14px 30px rgba(120,166,45,.14)"],
  "mono-electric": ["#315ee8", "#183ca9", "#f2f6ff", "#ffffff", "#172444", "#71809d", "#e1eaff", "#3f9b72", "#bb7d31", "#c75a58", "18px", "0 14px 30px rgba(49,94,232,.14)"],
  "mono-lemon": ["#a69a16", "#70670b", "#fffdeb", "#ffffff", "#353313", "#89866a", "#f5f1c8", "#59956e", "#bb7b31", "#bd5b52", "18px", "0 14px 30px rgba(166,154,22,.12)"],
  "mono-orange": ["#dd6b20", "#a33d0e", "#fff6ef", "#ffffff", "#3b281f", "#987e72", "#fbe4d2", "#5b9870", "#c28135", "#c65d51", "18px", "0 14px 30px rgba(221,107,32,.14)"],
  forest: ["#397553", "#22533b", "#f1f7f1", "#ffffff", "#25372c", "#728579", "#dcecdf", "#397553", "#ba7b35", "#b85b57", "22px", "0 16px 36px rgba(57,117,83,.14)"],
  sage: ["#718c72", "#4e6d52", "#f4f8f2", "#ffffff", "#2d392e", "#7a887b", "#e3ede1", "#5e9972", "#b9823b", "#b65b57", "22px", "0 16px 36px rgba(113,140,114,.14)"],
  sound: ["#ef6b4f", "#bd3f2f", "#fff6f0", "#fffdfb", "#302522", "#917b74", "#fbe1d8", "#4b9877", "#c48538", "#c85a55", "26px", "0 18px 42px rgba(239,107,79,.14)"],
  citrus: ["#e09420", "#aa5c0c", "#fff9e9", "#ffffff", "#332b1c", "#92836d", "#f8eac6", "#52986d", "#c78332", "#c45b52", "16px", "0 12px 26px rgba(224,148,32,.16)"],
  "neon-night": ["#a7f34a", "#d4ff79", "#101510", "#171e19", "#efffe5", "#9cae91", "#263724", "#7ee6a5", "#e0ad5d", "#ef7d78", "18px", "0 16px 40px rgba(0,0,0,.35)"],
  "sky-data": ["#2b8ed8", "#1763a1", "#f1f8fd", "#ffffff", "#203545", "#718596", "#dcedf8", "#3d9a7a", "#c28233", "#c35957", "12px", "0 12px 28px rgba(43,142,216,.14)"],
  lavender: ["#8173cf", "#5a4ca1", "#f7f5ff", "#ffffff", "#2e2943", "#817b9a", "#e9e4fb", "#519779", "#bd8137", "#c45d69", "22px", "0 16px 36px rgba(129,115,207,.14)"],
  botanical: ["#5d8c52", "#386633", "#f2f8ee", "#ffffff", "#29382a", "#778877", "#e1efd9", "#5d985f", "#b5823c", "#b85c56", "26px", "0 18px 42px rgba(93,140,82,.14)"],
} as const;

const fonts = { editorial: "'Noto Serif SC', 'Songti SC', serif", modern: "'Avenir Next', 'PingFang SC', sans-serif", mono: "'SFMono-Regular', 'PingFang SC', monospace" };
const layouts: Record<ThemeId, PrincipalTheme["layout"]> = { peach: "airy", orchid: "editorial", amber: "airy", rose: "editorial", "mono-lime": "dense", "mono-electric": "dashboard", "mono-lemon": "dense", "mono-orange": "dense", forest: "airy", sage: "editorial", sound: "content", citrus: "dense", "neon-night": "dashboard", "sky-data": "dashboard", lavender: "editorial", botanical: "content" };
const copyMap: Record<ThemeId, PrincipalThemeCopy> = {
  peach: copy("消息", "温暖地接住每一次连接"), orchid: copy("消息", "让灵感在关系中生长"), amber: copy("消息", "把重要的人放在心上"), rose: copy("消息", "温柔推进每一个回应"), "mono-lime": copy("消息", "清晰处理每一条线索"), "mono-electric": copy("消息", "把协同变成行动面板"), "mono-lemon": copy("消息", "轻快处理今天的重点"), "mono-orange": copy("消息", "热烈推进每个下一步"), forest: copy("消息", "稳稳经营你的关系网络"), sage: copy("消息", "留一点从容给每次沟通"), sound: { ...copy("Messages", "Conversations for your next episode"), projects: { title: "Projects", subtitle: "Build the story behind the work", section: "In production", action: "Explore" }, console: { title: "Studio", subtitle: "Your host controls", section: "Show dashboard", action: "Switch role" }, growth: { title: "Growth", subtitle: "Keep the signal moving", section: "Next up", action: "Keep going" }, mine: { title: "Me", subtitle: "Profile, rights and settings", section: "Your toolkit", action: "Manage" } }, citrus: copy("消息", "快速对齐，马上执行"), "neon-night": copy("消息", "把能量聚到真正重要的事"), "sky-data": copy("消息", "用数据看见每一次变化"), lavender: copy("消息", "给关系一片柔和的空间"), botanical: copy("消息", "让关系像植物一样持续生长")
};

export const principalThemes: PrincipalTheme[] = (Object.keys(palettes) as ThemeId[]).map(id => {
  const [brand, strong, page, surface, text, subtle, soft, success, warning, danger, radius, shadow] = palettes[id];
  return { id, name: ({ peach: "蜜桃", orchid: "兰紫", amber: "琥珀", rose: "玫瑰", "mono-lime": "酸橙单色", "mono-electric": "电光单色", "mono-lemon": "柠檬单色", "mono-orange": "橙焰单色", forest: "深林", sage: "鼠尾草", sound: "Sound", citrus: "Citrus", "neon-night": "霓虹夜", "sky-data": "Sky Data", lavender: "薰衣草", botanical: "Botanical" } as Record<ThemeId, string>)[id], tagline: copyMap[id].messages.subtitle, fontFamily: id === "sound" ? fonts.editorial : id.startsWith("mono") || id === "sky-data" ? fonts.mono : fonts.modern, layout: layouts[id], vars: { "--ps-brand": brand, "--ps-brand-strong": strong, "--ps-page": page, "--ps-surface": surface, "--ps-text": text, "--ps-subtle": subtle, "--ps-border": soft, "--ps-soft": soft, "--ps-success": success, "--ps-warning": warning, "--ps-danger": danger, "--ps-radius": radius, "--ps-shadow": shadow }, copy: copyMap[id] };
});

export const defaultPrincipalTheme: ThemeId = "peach";
export const principalThemeStorageKey = "principal-society-theme";
export const principalThemeIds = principalThemes.map(theme => theme.id);
export function getPrincipalTheme(id: ThemeId) { return principalThemes.find(theme => theme.id === id) ?? principalThemes[0]; }
