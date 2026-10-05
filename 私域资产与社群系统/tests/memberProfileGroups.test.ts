import { describe, expect, it } from "vitest";
import { getJoinedGroupsForMember } from "../src/app/data/memberProfileGroups";

describe("会员已加入社群展示", () => {
  it("只返回已入群会员的具体社群信息", () => {
    expect(getJoinedGroupsForMember(1)).toEqual([
      { name: "北京PRO会员群01", type: "PRO会员", status: "已入群" },
      { name: "主理人成长社群·北京", type: "主理人社群", status: "已入群" },
    ]);
  });

  it("未入群会员返回空列表", () => {
    expect(getJoinedGroupsForMember(2)).toEqual([]);
  });
});
