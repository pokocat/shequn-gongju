import { useSyncExternalStore } from "react";
import { defaultGroupTypeRules, type GroupTypeRule } from "./projectGroupRules";

export type SharedGroup = {
  no: string;
  name: string;
  city: string;
  wechat: string;
  groupNo: string;
  type: string;
  ownerStatus: string;
  pushCount: number;
  scanCount: number;
  memberCount: number;
  max: number;
  service?: string;
  project: string;
};

type CommunityState = {
  rulesByProject: Record<string, GroupTypeRule[]>;
  generatedGroups: SharedGroup[];
};

const STORAGE_KEY = "scrm-community-rules-v1";
const cloneRules = (rules: GroupTypeRule[]) => rules.map(rule => ({ ...rule, memberRoles: [...rule.memberRoles], cities: [...rule.cities] }));

const seedState: CommunityState = {
  rulesByProject: {
    "蜂乐码": cloneRules(defaultGroupTypeRules),
    "蜂乐玛PRO会员": cloneRules(defaultGroupTypeRules),
    "蜂乐玛体验官": cloneRules(defaultGroupTypeRules),
  },
  generatedGroups: [],
};

function loadState(): CommunityState {
  if (typeof window === "undefined") return seedState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedState;
    const parsed = JSON.parse(saved) as CommunityState;
    return {
      rulesByProject: { ...seedState.rulesByProject, ...(parsed.rulesByProject || {}) },
      generatedGroups: Array.isArray(parsed.generatedGroups) ? parsed.generatedGroups : [],
    };
  } catch {
    return seedState;
  }
}

let state = loadState();
const listeners = new Set<() => void>();

function publish(next: CommunityState) {
  state = next;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach(listener => listener());
}

export function useCommunityData() {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => listeners.delete(listener); },
    () => state,
    () => seedState,
  );
}

export function registerProjectRules(project: string, rules: GroupTypeRule[] = []) {
  if (state.rulesByProject[project]) return;
  publish({ ...state, rulesByProject: { ...state.rulesByProject, [project]: cloneRules(rules) } });
}

export function saveProjectRules(project: string, rules: GroupTypeRule[]) {
  publish({ ...state, rulesByProject: { ...state.rulesByProject, [project]: cloneRules(rules) } });
}

export function addGeneratedGroups(groups: SharedGroup[]) {
  publish({ ...state, generatedGroups: [...groups, ...state.generatedGroups] });
}

export function updateGeneratedGroup(no: string, patch: Partial<SharedGroup>) {
  if (!state.generatedGroups.some(group => group.no === no)) return;
  publish({
    ...state,
    generatedGroups: state.generatedGroups.map(group => group.no === no ? { ...group, ...patch } : group),
  });
}
