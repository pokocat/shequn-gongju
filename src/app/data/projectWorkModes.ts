import type { IdentityRole } from "./accountTypes";

export type ProjectRelationshipWorkMode = "transparent" | "execution";

export type ProjectWorkModeRole = IdentityRole["roleKey"];

export type ProjectWorkModeConfig = {
  projectId: string;
  mode: ProjectRelationshipWorkMode;
  updatedAt: string;
  updatedBy: string;
};

export const DEFAULT_PROJECT_WORK_MODE: ProjectRelationshipWorkMode = "transparent";

export const PROJECT_WORK_MODE_META: Record<ProjectRelationshipWorkMode, { label: string; description: string }> = {
  transparent: {
    label: "监管透明模式",
    description: "工作人员可查看 AI 或外部系统同步的客观关系状态。"
  },
  execution: {
    label: "任务执行模式",
    description: "工作人员只查看待执行任务，客观关系结果仅对管理角色可见。"
  }
};

export const PROJECT_IDS: Record<string, string> = {
  PRO会员: "health-pro-member",
  体验官: "health-experience-member",
  一级代理: "city-agent-level-1",
  二级代理: "city-agent-level-2",
  城市运营中心: "city-operation-center",
  "7日训练营": "health-7-day-camp",
  "进阶班认证": "health-advanced-certification",
  "付费会员俱乐部": "health-paid-member-club",
  "健康学院": "education-health-academy",
  "亲子教育课": "education-parenting-course"
};

export const projectIdForName = (projectName: string) => PROJECT_IDS[projectName] ?? projectName;

export const roleLabel = (role: ProjectWorkModeRole) => ({
  super_admin: "超级管理员",
  eco_leader: "生态负责人",
  eco_coo: "生态COO",
  saas_owner: "SaaS负责人",
  saas_op: "SaaS运营",
  platform_admin: "平台管理员",
  platform_op: "平台运营",
  project_owner: "项目负责人",
  regional_op: "区域运营",
  service: "客服",
  teacher: "老师"
}[role]);

export const canConfigureProjectWorkMode = (role: ProjectWorkModeRole) =>
  role === "super_admin" ||
  role === "platform_admin" ||
  role === "regional_op" ||
  role === "project_owner";

export const canViewObjectiveState = (role: ProjectWorkModeRole, mode: ProjectRelationshipWorkMode) =>
  mode === "transparent" ||
  role === "super_admin" ||
  role === "eco_leader" ||
  role === "eco_coo" ||
  role === "saas_owner" ||
  role === "platform_admin" ||
  role === "project_owner" ||
  role === "regional_op";

export const projectWorkModeLabel = (mode: ProjectRelationshipWorkMode) => PROJECT_WORK_MODE_META[mode].label;

export const initialProjectWorkModes: Record<string, ProjectWorkModeConfig> = {};
