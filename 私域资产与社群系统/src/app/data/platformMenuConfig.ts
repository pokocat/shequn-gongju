import { useSyncExternalStore } from "react";

/**
 * 聚域平台菜单配置数据层
 *
 * 职责：
 * 1. 能力 → 功能模块映射（决定哪些动态菜单出现）
 * 2. 启动向导 5 步定义与完成判定
 * 3. 项目能力状态、向导信号、折叠状态的本地存取
 *
 * 说明：能力开通状态与向导信号当前用本地数据模拟，预留接口边界，
 * 后续接入真实后端时，只需替换本文件的读写实现，页面无需改动。
 */

/* ───────────────────────── 能力 → 模块映射 ───────────────────────── */

/** 能力名称 → 该能力提供的功能模块标识 */
export const CAPABILITY_MODULE_MAP: Record<string, string[]> = {
  "社群增长套件": ["会员", "社群", "活动"],
  "会员运营工作台": ["会员", "订单", "活动"],
  "团长分销工具": ["订单", "佣金", "会员"],
  "城市合伙人系统": ["代理", "订单", "佣金"],
  "主理人公社": ["会员", "社群", "课程"],
  "AI 学习社": ["课程", "训练营", "认证"],
  "AI 营养补剂会员平台": ["商城", "会员", "服务"],
  "AI 主理人公社": ["招募", "社群", "协作"],
  "AI 艺人孵化": ["报名", "任务", "签约"],
  "AI 艺人授权": ["授权", "合同", "订单"],
  "AI 明星切片": ["内容", "团队", "结算"],
  "AI 短剧": ["投稿", "制作", "投流"],
  "AI 超级广告": ["广告主", "素材", "报表"],
  "AI 知识付费": ["课程", "专栏", "社群"],
  "AI 教育": ["学员", "家长", "课程"],
  "AI 军师": ["诊断", "咨询", "交付"],
  "AI 创始 IP": ["内容", "线索", "合作"],
  "企业微信运营助手": ["客户", "企微", "社群"],
  "会员增长方案包": ["会员", "活动", "订单"],
  "企业微信配置服务": ["企微", "客户", "社群"],
  "社群运营陪跑": ["运营", "服务"],
  "订单系统": ["订单"],
  "城市合伙人": ["代理", "订单", "佣金"],
};

/** 由能力名称列表解析出功能模块集合 */
export function modulesForCapabilities(capabilities: string[]): string[] {
  const modules = new Set<string>();
  capabilities.forEach(name => (CAPABILITY_MODULE_MAP[name] ?? []).forEach(module => modules.add(module)));
  return Array.from(modules);
}

/* ───────────────────────── 动态能力菜单规则 ───────────────────────── */

export type CapabilityMenuKey = "orders" | "channel" | "cities" | "commission" | "tickets";

export type CapabilityMenuRule = {
  key: CapabilityMenuKey;
  label: string;
  /** 命中任一模块即显示该菜单 */
  modules: string[];
  /** 缺省来源能力名（用于菜单项右侧小字标注） */
  fallbackSource: string;
};

export const CAPABILITY_MENU_RULES: CapabilityMenuRule[] = [
  { key: "orders", label: "订单与履约", modules: ["订单"], fallbackSource: "团长分销工具" },
  { key: "channel", label: "渠道分发与分销", modules: ["代理"], fallbackSource: "城市合伙人系统" },
  { key: "cities", label: "城市分站", modules: ["城市", "代理"], fallbackSource: "城市合伙人系统" },
  { key: "commission", label: "佣金与结算", modules: ["佣金"], fallbackSource: "团长分销工具" },
  { key: "tickets", label: "工单中心", modules: ["服务"], fallbackSource: "社群运营陪跑" },
];

/** 按已开通模块解析出应显示的动态能力菜单 */
export function resolveCapabilityMenus(unlockedModules: string[]): CapabilityMenuRule[] {
  const unlocked = new Set(unlockedModules);
  return CAPABILITY_MENU_RULES.filter(rule => rule.modules.some(module => unlocked.has(module)));
}

/** 找出为某个动态菜单提供能力的具体能力名（用于来源标注） */
export function capabilitySourceFor(rule: CapabilityMenuRule, capabilities: string[]): string {
  const hit = capabilities.find(name =>
    (CAPABILITY_MODULE_MAP[name] ?? []).some(module => rule.modules.includes(module)),
  );
  return hit ?? rule.fallbackSource;
}

/* ───────────────────────── 启动向导 5 步 ───────────────────────── */

export type WizardStepKey =
  | "systemAccounts"
  | "capabilities"
  | "businessAccounts"
  | "teamPermissions"
  | "operation";

export type WizardStep = {
  key: WizardStepKey;
  index: number;
  label: string;
  /** 点击后跳转的模块 id */
  targetModule: string;
  /** 目标位置说明 */
  targetHint: string;
};

export const WIZARD_STEPS: WizardStep[] = [
  { key: "systemAccounts", index: 1, label: "开通系统账号", targetModule: "wechat", targetHint: "账号资产中心 · 系统账号" },
  { key: "capabilities", index: 2, label: "开通业务能力", targetModule: "capabilities", targetHint: "业务能力中心 · 当前项目" },
  { key: "businessAccounts", index: 3, label: "接入业务账号", targetModule: "wechat", targetHint: "账号资产中心 · 业务资产" },
  { key: "teamPermissions", index: 4, label: "配置团队权限", targetModule: "permissions", targetHint: "角色与权限配置" },
  { key: "operation", index: 5, label: "进入运营", targetModule: "users", targetHint: "经营工作台" },
];

/** 向导各步骤的完成信号（真实接入后由后端能力/账号/权限状态回写） */
export type WizardSignals = {
  systemAccountsReady: boolean;
  capabilitiesReady: boolean;
  businessAccountsReady: boolean;
  teamPermissionsReady: boolean;
};

export type WizardStepState = WizardStep & { done: boolean; current: boolean };

export type WizardProgress = {
  steps: WizardStepState[];
  doneCount: number;
  total: number;
  complete: boolean;
};

/** 计算向导进度：① - ④ 由信号决定，⑤ 在 ① - ④ 全完成后达成 */
export function computeWizardProgress(signals: WizardSignals): WizardProgress {
  const signalMap: Record<Exclude<WizardStepKey, "operation">, boolean> = {
    systemAccounts: signals.systemAccountsReady,
    capabilities: signals.capabilitiesReady,
    businessAccounts: signals.businessAccountsReady,
    teamPermissions: signals.teamPermissionsReady,
  };
  const firstFourDone = WIZARD_STEPS.slice(0, 4).every(step => signalMap[step.key as Exclude<WizardStepKey, "operation">]);
  const doneFlags = WIZARD_STEPS.map(step =>
    step.key === "operation" ? firstFourDone : signalMap[step.key as Exclude<WizardStepKey, "operation">],
  );
  const doneCount = doneFlags.filter(Boolean).length;
  const complete = doneCount === WIZARD_STEPS.length;
  const currentIndex = doneFlags.findIndex(done => !done);
  const steps = WIZARD_STEPS.map((step, position) => ({
    ...step,
    done: doneFlags[position],
    current: !complete && position === currentIndex,
  }));
  return { steps, doneCount, total: WIZARD_STEPS.length, complete };
}

/* ───────────────────────── 本地状态存取 ───────────────────────── */

/** 默认能力：保证现有菜单可见性不回归 */
export const DEFAULT_PROJECT_CAPABILITIES: string[] = [
  "社群增长套件",
  "会员运营工作台",
  "团长分销工具",
  "城市合伙人系统",
  "企业微信运营助手",
];

/** 默认向导信号：② 已由默认能力达成，其余待配置 */
export const DEFAULT_WIZARD_SIGNALS: WizardSignals = {
  systemAccountsReady: false,
  capabilitiesReady: true,
  businessAccountsReady: false,
  teamPermissionsReady: false,
};

export type PlatformMenuState = {
  capabilitiesByProject: Record<string, string[]>;
  signals: WizardSignals;
  configGroupCollapsed: boolean;
  wizardMinimized: boolean;
};

const STORAGE_KEY = "scrm-platform-menu-v1";

const seedState: PlatformMenuState = {
  capabilitiesByProject: {},
  signals: { ...DEFAULT_WIZARD_SIGNALS },
  configGroupCollapsed: false,
  wizardMinimized: false,
};

function loadState(): PlatformMenuState {
  if (typeof window === "undefined") return seedState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedState;
    const parsed = JSON.parse(saved) as Partial<PlatformMenuState>;
    return {
      capabilitiesByProject: parsed.capabilitiesByProject ?? {},
      signals: { ...DEFAULT_WIZARD_SIGNALS, ...(parsed.signals ?? {}) },
      configGroupCollapsed: Boolean(parsed.configGroupCollapsed),
      wizardMinimized: Boolean(parsed.wizardMinimized),
    };
  } catch {
    return seedState;
  }
}

let state = loadState();
const listeners = new Set<() => void>();

function publish(next: PlatformMenuState) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 隐私模式下 localStorage 不可写，忽略持久化 */
    }
  }
  listeners.forEach(listener => listener());
}

export function usePlatformMenuData(): PlatformMenuState {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => seedState,
  );
}

/** 读取某项目已开通能力，缺省回落到默认能力 */
export function projectCapabilities(projectName: string): string[] {
  return state.capabilitiesByProject[projectName] ?? DEFAULT_PROJECT_CAPABILITIES;
}

/** 读取当前向导信号（只读消费方与测试使用） */
export function currentWizardSignals(): WizardSignals {
  return state.signals;
}

export function setProjectCapabilities(projectName: string, capabilities: string[]) {
  publish({
    ...state,
    capabilitiesByProject: { ...state.capabilitiesByProject, [projectName]: [...capabilities] },
  });
}

export function updateWizardSignals(patch: Partial<WizardSignals>) {
  publish({ ...state, signals: { ...state.signals, ...patch } });
}

/** 向导步骤 → 完成信号字段的映射 */
const STEP_SIGNAL_KEY: Record<Exclude<WizardStepKey, "operation">, keyof WizardSignals> = {
  systemAccounts: "systemAccountsReady",
  capabilities: "capabilitiesReady",
  businessAccounts: "businessAccountsReady",
  teamPermissions: "teamPermissionsReady",
};

/** 标记向导某一步完成（接入真实后端后由系统自动回写） */
export function markWizardStepDone(key: WizardStepKey) {
  if (key === "operation") return;
  const signalKey = STEP_SIGNAL_KEY[key];
  publish({ ...state, signals: { ...state.signals, [signalKey]: true } });
}

export function setConfigGroupCollapsed(collapsed: boolean) {
  publish({ ...state, configGroupCollapsed: collapsed });
}

export function setWizardMinimized(minimized: boolean) {
  publish({ ...state, wizardMinimized: minimized });
}

/** 重置菜单状态（调试用） */
export function resetPlatformMenuState() {
  publish({ ...seedState, capabilitiesByProject: {} });
}
