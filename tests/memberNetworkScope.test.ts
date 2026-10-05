import { describe, expect, it } from "vitest";
import {
  calculateMemberNetworkScope,
  canViewMemberNetworkEntity,
  getMemberNetworkViews,
  memberNetworkExample,
} from "../src/app/data/memberNetworkScope";

describe("成员网络权限范围", () => {
  it("代理可见自己的 operation 社群和直属团长", () => {
    const scope = calculateMemberNetworkScope(
      "agent-self",
      "agent",
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    );

    expect(canViewMemberNetworkEntity(scope, "community-self", "operation")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "leader-direct", "direct_ownership")).toBe(true);
  });

  it("直属团长社群不属于代理 operation", () => {
    const scope = calculateMemberNetworkScope(
      "agent-self",
      "agent",
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    );

    expect(canViewMemberNetworkEntity(scope, "community-leader", "operation")).toBe(false);
  });

  it("代理的发展社群属于 development，推荐链路实体属于 recommendation", () => {
    const scope = calculateMemberNetworkScope(
      "agent-self",
      "agent",
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    );

    expect(canViewMemberNetworkEntity(scope, "agent-child", "development")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "leader-child", "development")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "community-child", "development")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "member-recommended", "recommendation")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "leader-recommended", "recommendation")).toBe(true);
    expect(canViewMemberNetworkEntity(scope, "community-recommended", "recommendation")).toBe(true);
  });

  it("团长可见 direct operation，且没有 development 视图", () => {
    const scope = calculateMemberNetworkScope(
      "leader-direct",
      "leader",
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    );
    const views = getMemberNetworkViews(scope);

    expect(canViewMemberNetworkEntity(scope, "community-leader", "operation")).toBe(true);
    expect(views.map(view => view.scope)).not.toContain("development");
  });
});
