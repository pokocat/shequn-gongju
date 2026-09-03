/**
 * 会员运营工作台「项目 × 资产」双维度矩阵的演示数据。
 *
 * 三套资产（微信号 / 微信群 / 代理·会员）全部挂 projectId，projectId 为
 * PLATFORM_POOL_ID 时表示"库存池（未分配给任何项目）"。
 * 数据口径与现有模块对齐：微信号的账号/昵称与账号资产中心一致（wx_ai_01 等），
 * 微信群沿用「AIF01~05 群类型规则」的命名习惯，代理·会员复用影响力排行榜人名。
 */
import { PLATFORM_POOL_ID } from "./communicationTools";

// ─── 微信号 ──────────────────────────────────────────────────
export type WechatAssetStatus = "使用中" | "异常" | "未使用" | "待交接";
export type WechatKind = "wechat" | "wecom"; // 个人微信 / 企业微信

export interface ProjectWechat {
  kind: WechatKind;
  account: string;       // wx_ai_01 / 北京企微-吴思远
  nickname: string;      // 昵称；"—" 表示未启用
  projectId: string;     // PLATFORM_POOL_ID = 库存池
  status: WechatAssetStatus;
  owner: string;         // 服务负责人
  friendCount: number;
  groupCount: number;
  certified: boolean;
  lastLogin: string;
}

export const projectWechats: ProjectWechat[] = [
  { kind: "wechat", account: "wx_ai_01", nickname: "思远", projectId: "p_ai_community", status: "使用中", owner: "吴思远", friendCount: 1823, groupCount: 16, certified: true,  lastLogin: "2026-07-05" },
  { kind: "wechat", account: "wx_ai_02", nickname: "小燕", projectId: "p_ai_talent",    status: "使用中", owner: "林小燕", friendCount: 356,  groupCount: 5,  certified: true,  lastLogin: "2026-07-05" },
  { kind: "wechat", account: "wx_ai_03", nickname: "刘刚", projectId: "p_ai_payk",      status: "异常",   owner: "刘刚",   friendCount: 234,  groupCount: 3,  certified: false, lastLogin: "2026-06-05" },
  { kind: "wechat", account: "wx_ai_04", nickname: "志远", projectId: "p_ai_community", status: "使用中", owner: "赵志远", friendCount: 67,   groupCount: 2,  certified: false, lastLogin: "2026-07-01" },
  { kind: "wechat", account: "wx_ai_05", nickname: "梦华", projectId: "p_ai_edu",       status: "使用中", owner: "李梦华", friendCount: 310,  groupCount: 2,  certified: true,  lastLogin: "2026-07-04" },
  { kind: "wechat", account: "wx_ai_06", nickname: "陈明", projectId: "p_ai_payk",      status: "使用中", owner: "孙晨",   friendCount: 140,  groupCount: 1,  certified: true,  lastLogin: "2026-07-05" },
  { kind: "wechat", account: "wx_ai_07", nickname: "—",   projectId: PLATFORM_POOL_ID,  status: "未使用", owner: "—",     friendCount: 0,    groupCount: 0,  certified: false, lastLogin: "—" },
  { kind: "wechat", account: "wx_ai_08", nickname: "王芳", projectId: "p_ai_talent",    status: "使用中", owner: "李新",   friendCount: 120,  groupCount: 2,  certified: false, lastLogin: "2026-07-03" },
  { kind: "wechat", account: "wx_ai_09", nickname: "张磊", projectId: "p_ai_edu",       status: "使用中", owner: "周琳",   friendCount: 198,  groupCount: 3,  certified: true,  lastLogin: "2026-07-05" },
  { kind: "wechat", account: "wx_ai_10", nickname: "孙浩", projectId: "p_ai_community", status: "异常",   owner: "孙浩（离职）", friendCount: 89, groupCount: 1,  certified: false, lastLogin: "2026-06-20" },
  { kind: "wechat", account: "wx_ai_11", nickname: "雪婷", projectId: "p_ai_nutrition", status: "使用中", owner: "王芳",   friendCount: 268,  groupCount: 3,  certified: true,  lastLogin: "2026-07-06" },
  { kind: "wechat", account: "wx_ai_12", nickname: "一川", projectId: "p_ai_host",      status: "使用中", owner: "张磊",   friendCount: 512,  groupCount: 6,  certified: true,  lastLogin: "2026-07-06" },
  { kind: "wechat", account: "wx_ai_13", nickname: "北辰", projectId: "p_ai_short",     status: "使用中", owner: "赵志远", friendCount: 96,   groupCount: 2,  certified: false, lastLogin: "2026-07-02" },
  { kind: "wechat", account: "wx_ai_14", nickname: "元启", projectId: "p_ai_advisor",   status: "使用中", owner: "吴思源", friendCount: 41,   groupCount: 1,  certified: true,  lastLogin: "2026-06-28" },
  { kind: "wechat", account: "wx_ai_15", nickname: "阿彻", projectId: "p_ai_star_slice", status: "异常",  owner: "刘刚",   friendCount: 158,  groupCount: 2,  certified: false, lastLogin: "2026-06-30" },
  { kind: "wechat", account: "wx_ai_16", nickname: "—",   projectId: PLATFORM_POOL_ID,  status: "未使用", owner: "—",     friendCount: 0,    groupCount: 0,  certified: false, lastLogin: "—" },
  { kind: "wechat", account: "wx_ai_17", nickname: "曼曼", projectId: "p_ai_founders_ip", status: "使用中", owner: "吴思源", friendCount: 73, groupCount: 2, certified: true, lastLogin: "2026-07-01" },
  { kind: "wechat", account: "wx_ai_18", nickname: "洛川", projectId: "p_ai_ads",       status: "使用中", owner: "孙浩",   friendCount: 55,   groupCount: 1,  certified: false, lastLogin: "2026-07-03" },
  { kind: "wechat", account: "wx_ai_19", nickname: "玖玖", projectId: "p_ai_talent_ip", status: "使用中", owner: "陈明",   friendCount: 45,   groupCount: 1,  certified: false, lastLogin: "2026-07-02" },
  { kind: "wecom",  account: "北京企微-吴思远", nickname: "吴思远", projectId: "p_ai_community", status: "使用中", owner: "吴思远", friendCount: 487, groupCount: 3, certified: true,  lastLogin: "2026-07-05" },
  { kind: "wecom",  account: "上海企微-林小燕", nickname: "林小燕", projectId: "p_ai_edu",       status: "使用中", owner: "林小燕", friendCount: 356, groupCount: 2, certified: true,  lastLogin: "2026-07-05" },
  { kind: "wecom",  account: "广州企微-刘刚",   nickname: "刘刚",   projectId: "p_ai_star_slice", status: "异常",   owner: "刘刚", friendCount: 234, groupCount: 1, certified: true,  lastLogin: "2026-06-05" },
  { kind: "wecom",  account: "深圳企微-李梦华", nickname: "李梦华", projectId: "p_ai_payk",      status: "使用中", owner: "李梦华", friendCount: 310, groupCount: 2, certified: true,  lastLogin: "2026-07-04" },
  { kind: "wecom",  account: "杭州企微-陈明",   nickname: "陈明",   projectId: "p_ai_talent_ip", status: "使用中", owner: "陈明",   friendCount: 140, groupCount: 1, certified: true,  lastLogin: "2026-07-05" },
];

// ─── 微信群 ──────────────────────────────────────────────────
export type GroupSeries = "代理群系列" | "零售会员类群系列";
export type GroupOwnerStatus = "正常" | "待交接" | "异常";

export interface ProjectGroup {
  no: string;
  name: string;
  projectId: string;
  series: GroupSeries;
  type: string;        // 群类型：流量营/体验营/选课群/正价班级/讲师私域/代理总群/分站管理群/家族群/…
  code: string;        // AIF01~05 / AG01~ …
  wechat: string;      // 群主微信号 account，与 projectWechats 呼应
  city: string;
  members: number;
  max: number;
  push: number;
  scan: number;
  ownerStatus: GroupOwnerStatus;
}

export const projectGroups: ProjectGroup[] = [
  // —— AI学习社群（16 群，含两套系列）——
  { no: "000001", name: "AI学·流量营 AIF01 01群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "流量营",   code: "AIF01", wechat: "wx_ai_01", city: "北京", members: 172, max: 200,  push: 342, scan: 296, ownerStatus: "正常" },
  { no: "000002", name: "AI学·体验营 AIF02 02群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "体验营",   code: "AIF02", wechat: "wx_ai_01", city: "北京", members: 310, max: 500,  push: 512, scan: 468, ownerStatus: "正常" },
  { no: "000003", name: "AI学·选课群 AIF03 03群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "选课群",   code: "AIF03", wechat: "wx_ai_01", city: "全国", members: 288, max: 500,  push: 486, scan: 452, ownerStatus: "正常" },
  { no: "000004", name: "AI学·正价班级 AIF04 04群",   projectId: "p_ai_community", series: "零售会员类群系列", type: "正价班级", code: "AIF04", wechat: "wx_ai_01", city: "全国", members: 120, max: 200,  push: 203, scan: 176, ownerStatus: "正常" },
  { no: "000005", name: "AI学·讲师私域 AIF05 05群",   projectId: "p_ai_community", series: "零售会员类群系列", type: "讲师私域", code: "AIF05", wechat: "wx_ai_01", city: "全国", members: 86,  max: 200,  push: 154, scan: 133, ownerStatus: "正常" },
  { no: "000006", name: "AI学·流量营 AIF01 06群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "流量营",   code: "AIF01", wechat: "wx_ai_01", city: "上海", members: 168, max: 200,  push: 300, scan: 274, ownerStatus: "正常" },
  { no: "000007", name: "AI学·体验营 AIF02 07群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "体验营",   code: "AIF02", wechat: "wx_ai_01", city: "上海", members: 296, max: 500,  push: 470, scan: 421, ownerStatus: "正常" },
  { no: "000008", name: "AI学·选课群 AIF03 08群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "选课群",   code: "AIF03", wechat: "wx_ai_04", city: "上海", members: 201, max: 500,  push: 352, scan: 319, ownerStatus: "正常" },
  { no: "000009", name: "AI学·正价班级 AIF04 09群",   projectId: "p_ai_community", series: "零售会员类群系列", type: "正价班级", code: "AIF04", wechat: "wx_ai_04", city: "深圳", members: 98,  max: 200,  push: 176, scan: 150, ownerStatus: "正常" },
  { no: "000010", name: "AI学·流量营 AIF01 10群",     projectId: "p_ai_community", series: "零售会员类群系列", type: "流量营",   code: "AIF01", wechat: "wx_ai_04", city: "广州", members: 142, max: 200,  push: 258, scan: 231, ownerStatus: "正常" },
  { no: "000011", name: "AI学·代理总群",             projectId: "p_ai_community", series: "代理群系列",     type: "代理总群", code: "AG01",  wechat: "wx_ai_01", city: "北京", members: 487, max: 500,  push: 610, scan: 553, ownerStatus: "正常" },
  { no: "000012", name: "AI学·华北代理群",           projectId: "p_ai_community", series: "代理群系列",     type: "分站管理群", code: "AG02", wechat: "wx_ai_01", city: "北京", members: 320, max: 500,  push: 402, scan: 366, ownerStatus: "正常" },
  { no: "000013", name: "AI学·华东代理群",           projectId: "p_ai_community", series: "代理群系列",     type: "分站管理群", code: "AG03", wechat: "wx_ai_04", city: "上海", members: 268, max: 500,  push: 339, scan: 305, ownerStatus: "正常" },
  { no: "000014", name: "AI学·华南代理群",           projectId: "p_ai_community", series: "代理群系列",     type: "分站管理群", code: "AG04", wechat: "wx_ai_04", city: "广州", members: 215, max: 500,  push: 288, scan: 261, ownerStatus: "正常" },
  { no: "000015", name: "AI学·家族群",               projectId: "p_ai_community", series: "代理群系列",     type: "家族群",   code: "AG05", wechat: "wx_ai_01", city: "全国", members: 512, max: 1000, push: 528, scan: 497, ownerStatus: "正常" },
  { no: "000016", name: "AI学·分站管理群",           projectId: "p_ai_community", series: "代理群系列",     type: "分站管理群", code: "AG06", wechat: "wx_ai_01", city: "全国", members: 88,  max: 200,  push: 108, scan: 96,  ownerStatus: "待交接" },
  // —— AI艺人孵化平台 ——
  { no: "000017", name: "AI艺·流量营 AIF01 01群",     projectId: "p_ai_talent", series: "零售会员类群系列", type: "流量营",   code: "AIF01", wechat: "wx_ai_02", city: "北京", members: 210, max: 500,  push: 384, scan: 352, ownerStatus: "正常" },
  { no: "000018", name: "AI艺·体验营 AIF02 02群",     projectId: "p_ai_talent", series: "零售会员类群系列", type: "体验营",   code: "AIF02", wechat: "wx_ai_02", city: "全国", members: 156, max: 500,  push: 261, scan: 230, ownerStatus: "正常" },
  { no: "000019", name: "AI艺·内容创作组",            projectId: "p_ai_talent", series: "代理群系列",     type: "运营组",   code: "AG01",  wechat: "wx_ai_08", city: "全国", members: 132, max: 200,  push: 197, scan: 175, ownerStatus: "正常" },
  { no: "000020", name: "AI艺·运营组",                projectId: "p_ai_talent", series: "代理群系列",     type: "运营组",   code: "AG02",  wechat: "wx_ai_02", city: "全国", members: 96,  max: 200,  push: 143, scan: 122, ownerStatus: "待交接" },
  // —— AI知识付费平台 ——
  { no: "000021", name: "AI知·选课群 AIF03 01群",     projectId: "p_ai_payk", series: "零售会员类群系列", type: "选课群",   code: "AIF03", wechat: "wx_ai_03", city: "全国", members: 185, max: 500,  push: 312, scan: 284, ownerStatus: "正常" },
  { no: "000022", name: "AI知·读书会付费群",          projectId: "p_ai_payk", series: "零售会员类群系列", type: "正价班级", code: "AIF04", wechat: "wx_ai_06", city: "全国", members: 240, max: 500,  push: 226, scan: 209, ownerStatus: "正常" },
  { no: "000023", name: "AI知·分销组",                projectId: "p_ai_payk", series: "代理群系列",     type: "分销组",   code: "AG01",  wechat: "wx_ai_03", city: "全国", members: 158, max: 500,  push: 281, scan: 252, ownerStatus: "正常" },
  // —— AI教育平台 ——
  { no: "000024", name: "AI教·正价班级 AIF04 01群",   projectId: "p_ai_edu", series: "零售会员类群系列", type: "正价班级", code: "AIF04", wechat: "wx_ai_05", city: "北京", members: 176, max: 200,  push: 241, scan: 218, ownerStatus: "正常" },
  { no: "000025", name: "AI教·学员服务群",            projectId: "p_ai_edu", series: "零售会员类群系列", type: "服务",     code: "AIF05", wechat: "wx_ai_09", city: "全国", members: 268, max: 500,  push: 302, scan: 276, ownerStatus: "正常" },
  { no: "000026", name: "AI教·合作机构群",            projectId: "p_ai_edu", series: "代理群系列",     type: "运营组",   code: "AG01",  wechat: "wx_ai_05", city: "全国", members: 89,  max: 500,  push: 117, scan: 101, ownerStatus: "正常" },
  // —— 其余项目 ——
  { no: "000027", name: "AI星·素材分发群",            projectId: "p_ai_star_slice", series: "代理群系列", type: "分销组",   code: "AG01",  wechat: "wx_ai_15", city: "全国", members: 121, max: 500,  push: 168, scan: 149, ownerStatus: "待交接" },
  { no: "000028", name: "AI营·流量营 AIF01 01群",     projectId: "p_ai_nutrition", series: "零售会员类群系列", type: "流量营", code: "AIF01", wechat: "wx_ai_11", city: "全国", members: 96,  max: 200,  push: 154, scan: 138, ownerStatus: "正常" },
  { no: "000029", name: "AI营·补剂会员群",            projectId: "p_ai_nutrition", series: "零售会员类群系列", type: "正价班级", code: "AIF04", wechat: "wx_ai_11", city: "全国", members: 143, max: 500,  push: 219, scan: 192, ownerStatus: "正常" },
  { no: "000030", name: "AI主·主理人群",              projectId: "p_ai_host", series: "代理群系列",     type: "代理总群", code: "AG01", wechat: "wx_ai_12", city: "全国", members: 122, max: 500, push: 187, scan: 165, ownerStatus: "正常" },
  { no: "000031", name: "AI主·内容变现群",            projectId: "p_ai_host", series: "零售会员类群系列", type: "选课群", code: "AIF03", wechat: "wx_ai_12", city: "全国", members: 187, max: 500, push: 233, scan: 210, ownerStatus: "正常" },
  { no: "000032", name: "AI主·IP孵化营",              projectId: "p_ai_host", series: "零售会员类群系列", type: "体验营",   code: "AIF02", wechat: "wx_ai_12", city: "全国", members: 98,  max: 200,  push: 141, scan: 126, ownerStatus: "正常" },
  { no: "000033", name: "AI剧·投流交流群",            projectId: "p_ai_short", series: "代理群系列",    type: "运营组",   code: "AG01", wechat: "wx_ai_13", city: "全国", members: 67,  max: 200,  push: 92,  scan: 81,  ownerStatus: "正常" },
  { no: "000034", name: "AI广·素材共创群",            projectId: "p_ai_ads", series: "代理群系列",      type: "运营组",   code: "AG01", wechat: "wx_ai_18", city: "全国", members: 41,  max: 200,  push: 55,  scan: 48,  ownerStatus: "待交接" },
  { no: "000035", name: "AI军·创始人私董群",          projectId: "p_ai_advisor", series: "零售会员类群系列", type: "讲师私域", code: "AIF05", wechat: "wx_ai_14", city: "全国", members: 36, max: 100, push: 60,  scan: 52,  ownerStatus: "正常" },
  { no: "000036", name: "AI创·创始IP矩阵群",          projectId: "p_ai_founders_ip", series: "代理群系列", type: "运营组",  code: "AG01", wechat: "wx_ai_17", city: "全国", members: 44, max: 200, push: 61,  scan: 53,  ownerStatus: "正常" },
  { no: "000037", name: "AI授·授权合作群",            projectId: "p_ai_talent_ip", series: "代理群系列", type: "分销组",  code: "AG01", wechat: "wx_ai_19", city: "全国", members: 28, max: 200, push: 36,  scan: 31,  ownerStatus: "待交接" },
];

// ─── 代理 · 会员 ─────────────────────────────────────────────
export type PeopleRole = "代理" | "会员";

export interface ProjectPerson {
  name: string;
  avatar: string;
  wechat: string;
  projectId: string;
  role: PeopleRole;
  level: string;        // 代理：总代/一级/二级；会员：PRO会员/体验官/新会员
  referrer: string;     // 上级推荐人
  teamCount: number;    // 团队人数（代理）或 拉新人数（会员）
  influence: number;    // 影响力
  revenue: number;      // 收益（元）
  city: string;
  inGroup: boolean;     // 是否已入群
}

export const projectPersons: ProjectPerson[] = [
  // —— 代理（12）——
  { name: "盛光年", avatar: "盛", wechat: "THEv424", projectId: "p_ai_community", role: "代理", level: "总代", referrer: "盛光年", teamCount: 8023, influence: 3510, revenue: 96801, city: "北京-朝阳", inGroup: true },
  { name: "皮卡丘", avatar: "皮", wechat: "imp11",   projectId: "p_ai_community", role: "代理", level: "一级", referrer: "盛光年", teamCount: 6544, influence: 2877, revenue: 61250, city: "北京-海淀", inGroup: true },
  { name: "文泽",   avatar: "文", wechat: "FLM001",  projectId: "p_ai_community", role: "代理", level: "一级", referrer: "皮卡丘", teamCount: 5231, influence: 2104, revenue: 48960, city: "北京-朝阳", inGroup: true },
  { name: "梓几",   avatar: "梓", wechat: "afs612",  projectId: "p_ai_host",      role: "代理", level: "二级", referrer: "文泽",   teamCount: 4102, influence: 1754, revenue: 37012, city: "北京-西城", inGroup: true },
  { name: "海槽",   avatar: "海", wechat: "125gfs",  projectId: "p_ai_nutrition", role: "代理", level: "一级", referrer: "皮卡丘", teamCount: 3788, influence: 1432, revenue: 35608, city: "北京-东城", inGroup: true },
  { name: "漠萝君", avatar: "漠", wechat: "blgd321", projectId: "p_ai_edu",       role: "代理", level: "二级", referrer: "海槽",   teamCount: 2610, influence: 1264, revenue: 29810, city: "上海",      inGroup: true },
  { name: "小鸡猪", avatar: "小", wechat: "qiuzi512", projectId: "p_ai_payk",     role: "代理", level: "一级", referrer: "盛光年", teamCount: 2250, influence: 1107, revenue: 25960, city: "广州",      inGroup: true },
  { name: "北辰",   avatar: "北", wechat: "BEICHEN", projectId: "p_ai_short",     role: "代理", level: "一级", referrer: "皮卡丘", teamCount: 1630, influence: 908,  revenue: 18950, city: "杭州",      inGroup: true },
  { name: "玖玖",   avatar: "玖", wechat: "JIUJIU9", projectId: "p_ai_talent",    role: "代理", level: "二级", referrer: "漠萝君", teamCount: 1200, influence: 776,  revenue: 16200, city: "成都",      inGroup: true },
  { name: "洛川",   avatar: "洛", wechat: "LUOCHUAN", projectId: "p_ai_ads",      role: "代理", level: "一级", referrer: "盛光年", teamCount: 890,  influence: 654,  revenue: 12108, city: "深圳",      inGroup: true },
  { name: "曼曼",   avatar: "曼", wechat: "MANMAN",  projectId: "p_ai_founders_ip", role: "代理", level: "二级", referrer: "玖玖", teamCount: 640,  influence: 512,  revenue: 9860,  city: "北京",      inGroup: true },
  { name: "元启",   avatar: "元", wechat: "YUANQI",  projectId: "p_ai_advisor",   role: "代理", level: "一级", referrer: "盛光年", teamCount: 330,  influence: 401,  revenue: 7812,  city: "北京",      inGroup: true },
  // —— 会员（14）——
  { name: "程涛",   avatar: "程", wechat: "THEv424", projectId: "p_ai_community", role: "会员", level: "PRO会员", referrer: "盛光年", teamCount: 87,  influence: 2721, revenue: 9815,  city: "北京-朝阳", inGroup: true },
  { name: "钱军",   avatar: "钱", wechat: "imp11",   projectId: "p_ai_community", role: "会员", level: "体验官", referrer: "皮卡丘", teamCount: 12,  influence: 177,  revenue: 6305,  city: "北京-海淀", inGroup: true },
  { name: "许明",   avatar: "许", wechat: "afs612",  projectId: "p_ai_community", role: "会员", level: "体验官", referrer: "皮卡丘", teamCount: 9,   influence: 173,  revenue: 9658,  city: "北京-西城", inGroup: true },
  { name: "彭丽",   avatar: "彭", wechat: "125gfs",  projectId: "p_ai_nutrition", role: "会员", level: "PRO会员", referrer: "海槽",  teamCount: 34,  influence: 908,  revenue: 5166,  city: "上海",      inGroup: true },
  { name: "罗平",   avatar: "罗", wechat: "DG1245",  projectId: "p_ai_community", role: "会员", level: "新会员", referrer: "皮卡丘", teamCount: 3,   influence: 496,  revenue: 1807,  city: "北京-朝阳", inGroup: true },
  { name: "魏静",   avatar: "魏", wechat: "qiuzi512", projectId: "p_ai_payk",     role: "会员", level: "体验官", referrer: "小鸡猪", teamCount: 11,  influence: 508,  revenue: 3956,  city: "广州",      inGroup: true },
  { name: "夏雨",   avatar: "夏", wechat: "dashu25", projectId: "p_ai_edu",       role: "会员", level: "PRO会员", referrer: "海槽",  teamCount: 21,  influence: 685,  revenue: 6459,  city: "上海",      inGroup: false },
  { name: "唐芳",   avatar: "唐", wechat: "blgd321", projectId: "p_ai_edu",       role: "会员", level: "新会员", referrer: "漠萝君", teamCount: 2,   influence: 831,  revenue: 2817,  city: "成都",      inGroup: true },
  { name: "赵凡",   avatar: "赵", wechat: "ZHAOFAN", projectId: "p_ai_host",      role: "会员", level: "PRO会员", referrer: "梓几",  teamCount: 28,  influence: 1204, revenue: 12680, city: "北京",      inGroup: true },
  { name: "周小雨", avatar: "周", wechat: "ZHOUXY",  projectId: "p_ai_short",     role: "会员", level: "新会员", referrer: "北辰",  teamCount: 4,   influence: 368,  revenue: 2610,  city: "杭州",      inGroup: false },
  { name: "林朵",   avatar: "林", wechat: "LINDDO",  projectId: "p_ai_talent",    role: "会员", level: "体验官", referrer: "玖玖",  teamCount: 15,  influence: 562,  revenue: 4102,  city: "成都",      inGroup: true },
  { name: "何佳",   avatar: "何", wechat: "HEJIA88", projectId: "p_ai_advisor",   role: "会员", level: "新会员", referrer: "元启",  teamCount: 5,   influence: 412,  revenue: 3980,  city: "北京",      inGroup: true },
  { name: "苏晴",   avatar: "苏", wechat: "SUQING",  projectId: "p_ai_star_slice", role: "会员", level: "体验官", referrer: "洛川", teamCount: 8,  influence: 389,  revenue: 3310,  city: "深圳",      inGroup: true },
  { name: "韩立",   avatar: "韩", wechat: "HANLI09", projectId: "p_ai_founders_ip", role: "会员", level: "新会员", referrer: "曼曼", teamCount: 2,  influence: 297,  revenue: 2408,  city: "北京",      inGroup: false },
];