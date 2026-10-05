export type MemberJoinedGroup = {
  name: string;
  type: string;
  status: "已入群";
};

const memberJoinedGroups: Record<number, MemberJoinedGroup[]> = {
  1: [
    { name: "北京PRO会员群01", type: "PRO会员", status: "已入群" },
    { name: "主理人成长社群·北京", type: "主理人社群", status: "已入群" },
  ],
  3: [
    { name: "北京PRO会员群01", type: "PRO会员", status: "已入群" },
  ],
  5: [
    { name: "北京PRO会员群01", type: "PRO会员", status: "已入群" },
  ],
};

export const getJoinedGroupsForMember = (rank: number): MemberJoinedGroup[] => memberJoinedGroups[rank] ?? [];
