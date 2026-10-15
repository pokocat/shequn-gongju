import { describe, expect, it } from "vitest";
import {
  CAPABILITY_MENU_RULES,
  computeWizardProgress,
  capabilitySourceFor,
  currentWizardSignals,
  markWizardStepDone,
  modulesForCapabilities,
  resetPlatformMenuState,
  resolveCapabilityMenus,
  type WizardSignals,
} from "../src/app/data/platformMenuConfig";

const allPending: WizardSignals = {
  systemAccountsReady: false,
  capabilitiesReady: false,
  businessAccountsReady: false,
  teamPermissionsReady: false,
};

describe("能力 → 模块映射", () => {
  it("解析能力名称列表为去重模块集合", () => {
    const modules = modulesForCapabilities(["团长分销工具", "城市合伙人系统"]);
    expect(modules).toContain("订单");
    expect(modules).toContain("佣金");
    expect(modules).toContain("代理");
    expect(new Set(modules).size).toBe(modules.length);
  });

  it("忽略未知能力名称", () => {
    expect(modulesForCapabilities(["不存在的能力"])).toEqual([]);
  });
});

describe("动态能力菜单可见性", () => {
  it("开通订单模块时显示订单与履约", () => {
    const menus = resolveCapabilityMenus(["订单"]);
    expect(menus.map(menu => menu.key)).toEqual(["orders"]);
  });

  it("未开通任何模块时不显示任何动态菜单", () => {
    expect(resolveCapabilityMenus([])).toEqual([]);
  });

  it("多能力叠加时按规则顺序返回多项菜单", () => {
    const menus = resolveCapabilityMenus(["订单", "佣金", "代理", "服务"]);
    expect(menus.map(menu => menu.key)).toEqual(["orders", "channel", "cities", "commission", "tickets"]);
  });

  it("来源能力优先取项目中实际提供该模块的能力", () => {
    const rule = CAPABILITY_MENU_RULES.find(item => item.key === "orders")!;
    expect(capabilitySourceFor(rule, ["城市合伙人系统"])).toBe("城市合伙人系统");
    expect(capabilitySourceFor(rule, ["某未知能力"])).toBe(rule.fallbackSource);
  });
});

describe("启动向导进度", () => {
  it("全部未完成时第 1 步为进行中，进度 0/5", () => {
    const progress = computeWizardProgress(allPending);
    expect(progress.doneCount).toBe(0);
    expect(progress.total).toBe(5);
    expect(progress.complete).toBe(false);
    expect(progress.steps[0].current).toBe(true);
    expect(progress.steps.filter(step => step.current)).toHaveLength(1);
  });

  it("部分完成时标记已完成步骤并推进进行中步骤", () => {
    const progress = computeWizardProgress({ ...allPending, systemAccountsReady: true, capabilitiesReady: true });
    expect(progress.doneCount).toBe(2);
    expect(progress.steps[0].done).toBe(true);
    expect(progress.steps[1].done).toBe(true);
    expect(progress.steps[2].current).toBe(true);
  });

  it("前四步完成时末步「进入运营」自动达成且整体完成", () => {
    const progress = computeWizardProgress({
      systemAccountsReady: true,
      capabilitiesReady: true,
      businessAccountsReady: true,
      teamPermissionsReady: true,
    });
    expect(progress.doneCount).toBe(5);
    expect(progress.complete).toBe(true);
    expect(progress.steps.every(step => step.done)).toBe(true);
    expect(progress.steps.some(step => step.current)).toBe(false);
  });
});

describe("向导步骤标记完成", () => {
  it("标记某步完成后写入对应信号字段并推进进度", () => {
    resetPlatformMenuState();
    expect(computeWizardProgress(currentWizardSignals()).doneCount).toBe(1);

    markWizardStepDone("systemAccounts");

    expect(currentWizardSignals().systemAccountsReady).toBe(true);
    expect(computeWizardProgress(currentWizardSignals()).doneCount).toBe(2);
  });

  it("标记末步「进入运营」不产生副作用", () => {
    resetPlatformMenuState();
    markWizardStepDone("operation");
    expect(computeWizardProgress(currentWizardSignals()).doneCount).toBe(1);
  });
});
