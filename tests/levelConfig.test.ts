import { describe, expect, it } from "vitest";
import {
  businessIdentityLabels,
  businessIdentityOptions,
  canDevelopLeader,
  leaderDevelopmentRule,
  memberLevelOptions,
} from "../src/app/data/levelConfig";

describe("统一业务身份", () => {
  it("包含 D1-D5、团长和会员身份", () => {
    expect(businessIdentityOptions).toEqual(["D1", "D2", "D3", "D4", "D5", "LEADER", "MEMBER"]);
    expect(businessIdentityLabels.LEADER).toBe("团长");
    expect(memberLevelOptions).toContain("VIP");
  });

  it("仅 D2-D5 可以发展团长", () => {
    expect(canDevelopLeader("D1")).toBe(false);
    expect(canDevelopLeader("D2")).toBe(true);
    expect(canDevelopLeader("D3")).toBe(true);
    expect(canDevelopLeader("D4")).toBe(true);
    expect(canDevelopLeader("D5")).toBe(true);
  });

  it("团长发展规则独立于平台角色层级树", () => {
    expect(leaderDevelopmentRule.targetIdentityCode).toBe("LEADER");
    expect(leaderDevelopmentRule.sourceRoleCodes).not.toContain("D1");
  });
});
