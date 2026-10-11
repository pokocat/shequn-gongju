import type { CSSProperties } from "react";
import type { ThemeId } from "./principalSociety";

export type PrincipalTheme = {
  id: ThemeId;
  name: string;
  tagline: string;
  vars: CSSProperties;
};

export const principalThemes: PrincipalTheme[] = [
  { id: "community-blue", name: "社群蓝", tagline: "专业协同型", vars: { "--ps-brand": "#2d6cdf", "--ps-brand-strong": "#1f4fae", "--ps-page": "#f4f7fc", "--ps-surface": "#ffffff", "--ps-text": "#1f2d43", "--ps-subtle": "#718096", "--ps-border": "#dfe7f2", "--ps-soft": "#eaf1ff", "--ps-success": "#3f9b72", "--ps-warning": "#c9822b", "--ps-danger": "#c75a58", "--ps-radius": "20px", "--ps-shadow": "0 14px 34px rgba(45,108,223,.12)" } },
  { id: "principal-green", name: "主理人绿", tagline: "生态成长型", vars: { "--ps-brand": "#4c8055", "--ps-brand-strong": "#315d3a", "--ps-page": "#f5f8f2", "--ps-surface": "#ffffff", "--ps-text": "#293a2d", "--ps-subtle": "#748277", "--ps-border": "#dfe8dc", "--ps-soft": "#e8f1e5", "--ps-success": "#4c8055", "--ps-warning": "#ba7b35", "--ps-danger": "#b85b57", "--ps-radius": "20px", "--ps-shadow": "0 14px 34px rgba(76,128,85,.12)" } },
  { id: "principal-black", name: "主理人黑", tagline: "高级工作台型", vars: { "--ps-brand": "#d9a441", "--ps-brand-strong": "#f0c36b", "--ps-page": "#111315", "--ps-surface": "#1b1e20", "--ps-text": "#f5f1e8", "--ps-subtle": "#a7a49d", "--ps-border": "#34383a", "--ps-soft": "#282c2e", "--ps-success": "#75b98c", "--ps-warning": "#e0a85d", "--ps-danger": "#dc7973", "--ps-radius": "20px", "--ps-shadow": "0 14px 34px rgba(0,0,0,.28)" } },
];

export const defaultPrincipalTheme: ThemeId = "community-blue";
export const principalThemeStorageKey = "principal-society-theme";

export function getPrincipalTheme(id: ThemeId) {
  return principalThemes.find(theme => theme.id === id) ?? principalThemes[0];
}
