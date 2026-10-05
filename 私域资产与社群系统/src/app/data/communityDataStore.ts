import { useSyncExternalStore } from "react";
import type { GroupTypeRule } from "./projectGroupRules";

export type CommunityScope = "platform" | "project";

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
  note?: string;
  service?: string;
  platform: string;
  scope: CommunityScope;
  project?: string;
};

type CommunityState = {
  rulesByScope: Record<string, GroupTypeRule[]>;
  generatedGroups: SharedGroup[];
  groupEditsByScope: Record<string, Record<string, Partial<SharedGroup>>>;
  archivedGroupNosByScope: Record<string, string[]>;
  groupSequencesByScope: Record<string, number>;
};

const STORAGE_KEY = "scrm-community-rules-v1";
const DEFAULT_PLATFORM = "主理人公社";

export function getCommunityScopeKey(platform: string, scope: CommunityScope, project?: string) {
  return scope === "platform" ? `platform:${platform}` : `project:${platform}:${project ?? ""}`;
}

const cloneRules = (rules: GroupTypeRule[]) => rules.map(rule => ({ ...rule, memberRoles: [...rule.memberRoles], cities: [...rule.cities] }));
const seedState: CommunityState = { rulesByScope: {}, generatedGroups: [], groupEditsByScope: {}, archivedGroupNosByScope: {}, groupSequencesByScope: {} };

function normalizeGroup(group: SharedGroup & { platform?: string; scope?: CommunityScope }) {
  const platform = group.platform || DEFAULT_PLATFORM;
  const scope = group.scope || (group.project ? "project" : "platform");
  return { ...group, platform, scope, ...(scope === "project" && group.project ? { project: group.project } : {}) };
}

function loadState(): CommunityState {
  if (typeof window === "undefined") return seedState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedState;
    const parsed = JSON.parse(saved) as Partial<CommunityState> & { rulesByProject?: Record<string, GroupTypeRule[]> };
    const migratedRules = Object.entries(parsed.rulesByProject || {}).reduce<Record<string, GroupTypeRule[]>>((result, [project, rules]) => {
      result[getCommunityScopeKey(DEFAULT_PLATFORM, "project", project)] = cloneRules(rules);
      return result;
    }, {});
    const generatedGroups = Array.isArray(parsed.generatedGroups) ? parsed.generatedGroups.map(group => normalizeGroup(group)) : [];
    const groupSequencesByScope = { ...(parsed.groupSequencesByScope || {}) };
    generatedGroups.forEach(group => {
      const key = getCommunityScopeKey(group.platform, group.scope, group.project);
      const current = groupSequencesByScope[key] || 0;
      const sequence = Number(group.no);
      if (Number.isFinite(sequence)) groupSequencesByScope[key] = Math.max(current, sequence);
    });
    return {
      rulesByScope: { ...migratedRules, ...(parsed.rulesByScope || {}) },
      generatedGroups,
      groupEditsByScope: parsed.groupEditsByScope || {},
      archivedGroupNosByScope: parsed.archivedGroupNosByScope || {},
      groupSequencesByScope,
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

export function registerScopeRules(platform: string, scope: CommunityScope, project: string | undefined, rules: GroupTypeRule[] = []) {
  const key = getCommunityScopeKey(platform, scope, project);
  if (state.rulesByScope[key]) return;
  publish({ ...state, rulesByScope: { ...state.rulesByScope, [key]: cloneRules(rules) } });
}

export function saveScopeRules(platform: string, scope: CommunityScope, project: string | undefined, rules: GroupTypeRule[]) {
  const key = getCommunityScopeKey(platform, scope, project);
  publish({ ...state, rulesByScope: { ...state.rulesByScope, [key]: cloneRules(rules) } });
}

export function registerProjectRules(project: string, rules: GroupTypeRule[] = []) {
  registerScopeRules(DEFAULT_PLATFORM, "project", project, rules);
}

export function saveProjectRules(project: string, rules: GroupTypeRule[]) {
  saveScopeRules(DEFAULT_PLATFORM, "project", project, rules);
}

export function addGeneratedGroups(groups: SharedGroup[]) {
  publish({ ...state, generatedGroups: [...groups.map(normalizeGroup), ...state.generatedGroups] });
}

export function allocateGroupNumbers(platform: string, scope: CommunityScope, project: string | undefined, count: number) {
  const key = getCommunityScopeKey(platform, scope, project);
  const start = state.groupSequencesByScope[key] || 0;
  const numbers = Array.from({ length: count }, (_, index) => String(start + index + 1).padStart(5, "0"));
  publish({ ...state, groupSequencesByScope: { ...state.groupSequencesByScope, [key]: start + count } });
  return numbers;
}

export function saveGroupEdit(platform: string, scope: CommunityScope, project: string | undefined, no: string, patch: Partial<SharedGroup>) {
  const key = getCommunityScopeKey(platform, scope, project);
  publish({
    ...state,
    groupEditsByScope: {
      ...state.groupEditsByScope,
      [key]: { ...(state.groupEditsByScope[key] || {}), [no]: patch },
    },
    generatedGroups: state.generatedGroups.map(group => group.no === no && getCommunityScopeKey(group.platform, group.scope, group.project) === key ? { ...group, ...patch } : group),
  });
}

export function archiveGroup(platform: string, scope: CommunityScope, project: string | undefined, no: string) {
  const key = getCommunityScopeKey(platform, scope, project);
  const archived = state.archivedGroupNosByScope[key] || [];
  if (archived.includes(no)) return;
  publish({ ...state, archivedGroupNosByScope: { ...state.archivedGroupNosByScope, [key]: [...archived, no] } });
}

export function updateGeneratedGroup(platform: string, scope: CommunityScope, project: string | undefined, no: string, patch: Partial<SharedGroup>) {
  const key = getCommunityScopeKey(platform, scope, project);
  if (!state.generatedGroups.some(group => group.no === no && getCommunityScopeKey(group.platform, group.scope, group.project) === key)) return;
  saveGroupEdit(platform, scope, project, no, patch);
}
