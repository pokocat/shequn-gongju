import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, ChevronLeft, ChevronRight, ChevronDown, Upload, Building2, Users, MessageCircle, ArrowRight, Link, QrCode, Download, Copy, List, LayoutGrid, AlertTriangle, SlidersHorizontal, Edit3, Eye, EyeOff, ShieldCheck, LockKeyhole, History, CheckCircle2, RefreshCw, RotateCcw, GripVertical, MoreHorizontal, Activity, Phone, Briefcase, Check } from "lucide-react";
import { useCommunityData } from "../data/communityDataStore";
import { defaultGroupTypeRules } from "../data/projectGroupRules";

const S = {
  bg: "#fafafa",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.06)",
  borderMed: "rgba(0,0,0,0.12)",
  accent: "#ccff00",
  accentLight: "rgba(204,255,0,0.08)",
  accentMid: "rgba(204,255,0,0.18)",
  text: "#111111",
  textSec: "#444444",
  muted: "#888888",
  mutedLight: "#bbbbbb",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

// ─── 模拟数据 ─────────────────────────────────────────────────
const mockWechats = [
  { no: "00001", wechatId: "wx_bj_01", phone: "138-0012-3456", status: "使用中", nickname: "思远", gender: "男", qqNo: "287634521", boundEmail: "wsy@eco-saas.com", opsManager: "吴思远", memberManager: "张明", certified: true, invitedNew: 42, scanCount: 386, friendCount: 1823, city: "北京", project: "北京PRO服务", lastLogin: "2026-07-05", groupCount: 16, isInitiator: true, targetGroup: "北京PRO会员群01", targetGroupCount: 3, credential: "已认证" },
  { no: "00002", wechatId: "wx_sh_01", phone: "139-0012-3457", status: "使用中", nickname: "小燕", gender: "女", qqNo: "345782910", boundEmail: "lxy@eco-saas.com", opsManager: "林小燕", memberManager: "王静", certified: true, invitedNew: 38, scanCount: 312, friendCount: 356, city: "上海", project: "上海体验官", lastLogin: "2026-07-05", groupCount: 2, isInitiator: true, targetGroup: "上海体验官群01", targetGroupCount: 2, credential: "已认证" },
  { no: "00003", wechatId: "wx_gz_01", phone: "138-0012-3458", status: "异常", nickname: "刘刚", gender: "男", qqNo: "412893047", boundEmail: "lg@eco-saas.com", opsManager: "刘刚", memberManager: "陈强", certified: false, invitedNew: 21, scanCount: 187, friendCount: 234, city: "广州", project: "广州代理培训", lastLogin: "2026-06-05", groupCount: 1, isInitiator: false, targetGroup: "广州代理群", targetGroupCount: 1, credential: "未认证" },
  { no: "00004", wechatId: "wx_cd_01", phone: "152-0012-3461", status: "使用中", nickname: "志远", gender: "男", qqNo: "523019483", boundEmail: "zzr@eco-saas.com", opsManager: "赵志远", memberManager: "—", certified: false, invitedNew: 9, scanCount: 67, friendCount: 67, city: "成都", project: "成都分站", lastLogin: "2026-07-01", groupCount: 1, isInitiator: false, targetGroup: "成都分站群", targetGroupCount: 1, credential: "未认证" },
  { no: "00005", wechatId: "wx_sz_01", phone: "186-0012-3462", status: "使用中", nickname: "梦华", gender: "女", qqNo: "634102938", boundEmail: "lmh@eco-saas.com", opsManager: "李梦华", memberManager: "刘芳", certified: true, invitedNew: 31, scanCount: 278, friendCount: 310, city: "深圳", project: "深圳代理", lastLogin: "2026-07-04", groupCount: 2, isInitiator: true, targetGroup: "深圳代理群", targetGroupCount: 2, credential: "已认证" },
  { no: "00006", wechatId: "wx_hz_01", phone: "158-0012-3464", status: "使用中", nickname: "陈明", gender: "男", qqNo: "745293018", boundEmail: "cm@eco-saas.com", opsManager: "陈明", memberManager: "孙晨", certified: true, invitedNew: 18, scanCount: 134, friendCount: 140, city: "杭州", project: "杭州分站", lastLogin: "2026-07-05", groupCount: 1, isInitiator: true, targetGroup: "杭州会员群", targetGroupCount: 1, credential: "已认证" },
  { no: "00007", wechatId: "wx_bj_02", phone: "135-0012-3463", status: "未使用", nickname: "—", gender: "—", qqNo: "—", boundEmail: "—", opsManager: "—", memberManager: "—", certified: false, invitedNew: 0, scanCount: 0, friendCount: 0, city: "—", project: "—", lastLogin: "—", groupCount: 0, isInitiator: false, targetGroup: "—", targetGroupCount: 0, credential: "—" },
  { no: "00008", wechatId: "wx_wh_01", phone: "137-0012-3466", status: "使用中", nickname: "王芳", gender: "女", qqNo: "856304721", boundEmail: "wf@eco-saas.com", opsManager: "王芳", memberManager: "李新", certified: false, invitedNew: 14, scanCount: 98, friendCount: 120, city: "武汉", project: "武汉分站", lastLogin: "2026-07-03", groupCount: 1, isInitiator: false, targetGroup: "武汉分站群", targetGroupCount: 1, credential: "未认证" },
  { no: "00009", wechatId: "wx_nj_01", phone: "189-0012-3467", status: "使用中", nickname: "张磊", gender: "男", qqNo: "967415830", boundEmail: "zl@eco-saas.com", opsManager: "张磊", memberManager: "周琳", certified: true, invitedNew: 27, scanCount: 215, friendCount: 198, city: "南京", project: "南京分站", lastLogin: "2026-07-05", groupCount: 2, isInitiator: true, targetGroup: "南京会员群01", targetGroupCount: 2, credential: "已认证" },
  { no: "00010", wechatId: "wx_xa_01", phone: "177-0012-3468", status: "异常", nickname: "孙浩", gender: "男", qqNo: "108526394", boundEmail: "sh@eco-saas.com", opsManager: "孙浩（离职）", memberManager: "—", certified: false, invitedNew: 8, scanCount: 45, friendCount: 89, city: "西安", project: "西安分站", lastLogin: "2026-06-20", groupCount: 1, isInitiator: false, targetGroup: "西安分站群", targetGroupCount: 1, credential: "未认证" },
].map((item, index) => ({
  ...item,
  accountType: ["客服号", "招商号", "客服号", "招商号", "客服号"][index % 5],
  department: item.city === "—" ? "—" : `${item.city}服务中心`,
  region: item.city === "—" ? "—" : ({ 北京: "华北", 上海: "华东", 广州: "华南", 深圳: "华南", 成都: "西南", 杭州: "华东", 武汉: "华中", 南京: "华东", 西安: "西北" } as Record<string, string>)[item.city] || "其他",
  serviceOfficer: item.opsManager,
  normalFans: Math.max(0, item.friendCount - index * 19),
  blockedCount: index * 3,
  deletedCount: index * 2,
  wechatPassword: item.status === "未使用" ? "" : "Eco@2026",
  idCard: item.status === "未使用" ? "" : "110101********1234",
  idCardFront: "",
  idCardBack: "",
  bankCard: item.status === "未使用" ? "" : "6222********8899",
  paymentPassword: item.status === "未使用" ? "" : "已配置",
  qqPassword: item.qqNo === "—" ? "" : "QQ@2026",
  qqSecurity: item.qqNo === "—" ? "" : "已配置",
  emailPassword: item.boundEmail === "—" ? "" : "Mail@2026",
  emailSecurity: item.boundEmail === "—" ? "" : "已配置",
  emergencyContacts: [
    { wechatId: index === 0 ? "wx_sh_01" : "", name: index === 0 ? "林小燕" : "值班联系人", phone: index === 0 ? "139-0012-3457" : "", note: "紧急交接与安全核验", qr: true, avatarIndex: 1 },
    { wechatId: index === 0 ? "wx_hz_01" : "", name: index === 0 ? "陈明" : "区域负责人", phone: index === 0 ? "158-0012-3464" : "", note: "账号异常与登录告警", qr: true, avatarIndex: 5 },
    { wechatId: "", name: index === 0 ? "王总" : "平台管理员", phone: "", note: "最终安全审批", qr: true, avatarIndex: 0 },
  ],
  groupQrNames: item.status === "使用中" ? Array.from({ length: item.groupCount }, () => "已绑定二维码") : [],
  wechatQrName: item.status === "未使用" ? "" : "微信二维码已同步",
  groupType: item.targetGroup.includes("体验官") ? "体验官" : item.targetGroup.includes("代理") ? "游客" : item.targetGroup === "—" ? "" : "会员群",
}));

// ─── 模拟账号资产中心人员池（按人视图所需：角色/容量/负责项目）────
const assetPeoplePool: Record<string, {
  name: string; role: string; dept: string; phone: string;
  projects: string[]; capacity: number; used: number; avatarIdx: number;
}> = {
  acc_wusiyuan: { name: "吴思远", role: "项目负责人", dept: "北京服务中心", phone: "138-0012-3456", projects: ["北京PRO服务"], capacity: 4, used: 1, avatarIdx: 0 },
  acc_linxiaoyan:{ name: "林小燕", role: "运营号/客服", dept: "上海服务中心", phone: "139-0012-3457", projects: ["上海体验官"], capacity: 3, used: 1, avatarIdx: 1 },
  acc_liugang:   { name: "刘刚",   role: "区域运营",   dept: "广州服务中心", phone: "138-0012-3458", projects: ["广州代理培训"], capacity: 3, used: 1, avatarIdx: 2 },
  acc_zhaozhiyuan:{name: "赵志远", role: "区域运营",   dept: "成都服务中心", phone: "152-0012-3461", projects: ["成都分站"], capacity: 3, used: 1, avatarIdx: 3 },
  acc_limenghua: { name: "李梦华", role: "客服/服务官", dept: "深圳服务中心", phone: "186-0012-3462", projects: ["深圳代理"], capacity: 3, used: 1, avatarIdx: 4 },
  acc_chenming:  { name: "陈明",   role: "项目负责人", dept: "杭州服务中心", phone: "158-0012-3464", projects: ["杭州分站"], capacity: 4, used: 1, avatarIdx: 5 },
  acc_wangfang:  { name: "王芳",   role: "客服/服务官", dept: "武汉服务中心", phone: "137-0012-3466", projects: ["武汉分站"], capacity: 3, used: 1, avatarIdx: 6 },
  acc_zhanglei:  { name: "张磊",   role: "区域运营",   dept: "南京服务中心", phone: "189-0012-3467", projects: ["南京分站"], capacity: 4, used: 1, avatarIdx: 7 },
  acc_sunhao:    { name: "孙浩",   role: "区域运营(离职)", dept: "西安服务中心", phone: "177-0012-3468", projects: ["西安分站"], capacity: 3, used: 1, avatarIdx: 8 },
};
const nameToUid: Record<string, string> = Object.fromEntries(
  Object.entries(assetPeoplePool).map(([uid, p]) => [p.name, uid])
);
// 把 name（含"离职"后缀）匹配到 uid
function resolveOwnerUid(name: string): string | undefined {
  if (name === "—" || !name) return undefined;
  if (nameToUid[name]) return nameToUid[name];
  for (const [uid, p] of Object.entries(assetPeoplePool)) {
    if (name.startsWith(p.name)) return uid;
  }
  return undefined;
}

// ─── 为每个账号补齐 5 阶段生命周期 + 养号门槛 + ownerUid ───
// 今天 = 2026-08-29（当前 env 日期）
const TODAY = "2026-08-29";
function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO).getTime();
  const b = new Date(toISO).getTime();
  return Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}
function buildOnboardDate(index: number): string {
  const offsets = [90, 72, 45, 30, 60, 25, 1, 20, 50, 12];
  const offset = offsets[index] ?? 14;
  const d = new Date(TODAY);
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

// 注意：此函数内部引用了下方声明的 legacyStatusToLifecycle / NurturingGate，
// 必须在两者都声明完成后才可以调用（见 165 行）。
function buildAccountsWithLifecycleInternal(): PersonalAccount[] {
  return mockWechats.map((w, i) => {
    const onboardDate = (w as any).onboardDate || buildOnboardDate(i);
    const daysSince = daysBetween(onboardDate, TODAY);
    const certGatePass = !!w.certified || w.credential === "已认证";
    const friendGatePass = w.friendCount >= 200;
    const day7Pass = daysSince >= 7;
    const riskHits = (w.status === "异常" ? 3 : 0) + (w.credential !== "已认证" && w.credential !== "—" ? 1 : 0);
    const nurturing = {
      daysSinceOnboard: daysSince,
      day7Pass,
      friendGatePass,
      certGatePass,
      pass: day7Pass && friendGatePass && certGatePass,
      riskHits,
    } as NurturingGate;
    const base: LifecycleStage = legacyStatusToLifecycle[w.status] ?? "nurturing";
    let stage = base;
    if (stage === "nurturing") {
      if (w.project !== "—" && w.project !== "待配置") stage = "assigned_to_project";
      if (w.opsManager !== "—" && w.project !== "—" && w.project !== "待配置") stage = "assigned_to_person";
      if (w.status === "未使用" && daysSince < 3 && !certGatePass) stage = "registered";
      if (nurturing.pass && (w.project === "—" || w.project === "待配置")) stage = "nurturing";
    }
    const approvalRef = w.status === "待交接" ? `AP-2026-0${(i + 1).toString().padStart(2, "0")}` : undefined;
    return {
      ...w,
      lifecycleStage: stage,
      onboardDate,
      nurturing,
      approvalRef,
      ownerUid: resolveOwnerUid(w.opsManager),
    };
  });
}
// 延迟占位：真正的 accountsWithLifecycle 在 legacyStatusToLifecycle / NurturingGate 声明后再赋值
let accountsWithLifecycle: PersonalAccount[] = [];


const statusCfg: Record<string, { bg: string; color: string }> = {
  "使用中": { bg: "#f0fff4", color: "#276749" },
  "异常":   { bg: "#fff0f0", color: "#c53030" },
  "待交接": { bg: "#fffbeb", color: "#b45309" },
  "未使用": { bg: "#f5f5f5", color: "#888888" },
  "未启用": { bg: "#f5f5f5", color: "#777777" },
  "已停用": { bg: "#f5f5f5", color: "#777777" },
  "已归档": { bg: "#f0f0ec", color: "#888888" },
};

const PAGE_SIZE = 20;
type BrowseMode = "list" | "cards";
export type WeChatViewDimension = "type" | "project" | "person";

// ─── 5 阶段生命周期 ───────────────────────────────────────────────
// 注册入库 → 养号期（含7天/风控门槛）→ 分配到项目 → 发放到人（可走交接审批回收）→ 归档停用
export type LifecycleStage = "registered" | "nurturing" | "assigned_to_project" | "assigned_to_person" | "archived";
export const LIFECYCLE_FLOW: LifecycleStage[] = ["registered", "nurturing", "assigned_to_project", "assigned_to_person", "archived"];
export const lifecycleCfg: Record<LifecycleStage, { label: string; bg: string; color: string; border: string; dot: string }> = {
  registered:          { label: "注册入库",   bg: "#f3f4f6", color: "#374151", border: "#e5e7eb", dot: "#9ca3af" },
  nurturing:           { label: "养号期",     bg: "#fffbeb", color: "#92400e", border: "#fde68a", dot: "#f59e0b" },
  assigned_to_project: { label: "分配到项目", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
  assigned_to_person:  { label: "发放到人",   bg: "#ccff00", color: "#0d0d0d", border: "#b3cc00", dot: "#6b8e00" },
  archived:            { label: "归档停用",   bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db", dot: "#9ca3af" },
};
// 业务状态 → 5 阶段 映射（老 status 字符串，初始化时用于老数据回填 lifecycleStage）
const legacyStatusToLifecycle: Record<string, LifecycleStage> = {
  "未使用": "nurturing",
  "使用中": "assigned_to_person",
  "待交接": "assigned_to_person",
  "异常":   "assigned_to_person",
  "未启用": "registered",
  "已停用": "archived",
  "已归档": "archived",
};
// 养号门槛：登录天数、好友数、实名状态三项
type NurturingGate = {
  daysSinceOnboard: number;
  day7Pass: boolean;
  friendGatePass: boolean;
  certGatePass: boolean;
  pass: boolean;
  riskHits: number;
};
// 现在类型和映射都已就绪，填充 accountsWithLifecycle
accountsWithLifecycle = buildAccountsWithLifecycleInternal();

type PersonalAccount = (typeof mockWechats)[number] & {
  lifecycleStage: LifecycleStage;
  onboardDate: string;        // 注册入库日期
  nurturing: NurturingGate;
  approvalRef?: string;       // 最近的交接审批单号
  ownerUid?: string;          // 绑定到人 uid，便于和 SystemAccount 关联
};

type CapacityFilter = "全部" | "好友预警" | "群容量预警" | "同步异常";

function getAccountRisk(account: PersonalAccount) {
  const friendRate = account.friendCount / 2000;
  const groupRate = account.groupCount / Math.max(20, account.groupQrNames.length);
  const isSyncRisk = account.status === "异常" || (account.lastLogin !== "—" && account.lastLogin < "2026-06-25");
  return {
    friendRate,
    groupRate,
    isFriendRisk: friendRate >= 0.85,
    isGroupRisk: groupRate >= 0.8,
    isSyncRisk,
    isRisk: friendRate >= 0.85 || groupRate >= 0.8 || isSyncRisk,
  };
}

// ─── 时间相对化（同步显示 / 最近活跃）───────────────────────────────
function timeAgo(abs: string): { rel: string; abs: string } {
  if (!abs || abs === "—" || abs.includes("—") || abs.trim() === "") return { rel: "从未同步", abs: "未同步" };
  const y = parseInt(abs.slice(0, 4), 10);
  const m = parseInt(abs.slice(5, 7), 10) - 1;
  const d = parseInt(abs.slice(8, 10), 10);
  let hh = 9, mm = 0;
  if (abs.length >= 16 && /\d{2}:\d{2}/.test(abs.slice(11, 16))) {
    hh = parseInt(abs.slice(11, 13), 10);
    mm = parseInt(abs.slice(14, 16), 10);
  }
  const then = new Date(y, m, d, hh, mm, 0, 0).getTime();
  if (Number.isNaN(then)) return { rel: abs, abs };
  const now = new Date("2026-08-30T10:00:00").getTime();
  const diffMs = now - then;
  const diffMin = Math.round(diffMs / 60000);
  const diffH = Math.round(diffMin / 60);
  const diffD = Math.round(diffH / 24);
  let rel = "刚刚";
  if (diffMin < 1) rel = "刚刚";
  else if (diffMin < 60) rel = `${diffMin} 分钟前`;
  else if (diffH < 24) rel = `${diffH} 小时前`;
  else if (diffD < 30) rel = `${diffD} 天前`;
  else if (diffD < 365) rel = `${Math.round(diffD / 30)} 个月前`;
  else rel = `${Math.round(diffD / 365)} 年前`;
  return { rel, abs };
}

function BrowseModeToggle({ value, onChange, label }: { value: BrowseMode; onChange: (value: BrowseMode) => void; label: string }) {
  return (
    <div className="flex items-center p-0.5" aria-label={label} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
      <button
        type="button"
        title="列表浏览"
        aria-label="列表浏览"
        aria-pressed={value === "list"}
        className="w-8 h-7 flex items-center justify-center transition-all"
        style={{ background: value === "list" ? "#0d0d0d" : "transparent", color: value === "list" ? S.accent : S.muted, borderRadius: "4px" }}
        onClick={() => onChange("list")}
      >
        <List size={15} />
      </button>
      <button
        type="button"
        title="卡片浏览"
        aria-label="卡片浏览"
        aria-pressed={value === "cards"}
        className="w-8 h-7 flex items-center justify-center transition-all"
        style={{ background: value === "cards" ? "#0d0d0d" : "transparent", color: value === "cards" ? S.accent : S.muted, borderRadius: "4px" }}
        onClick={() => onChange("cards")}
      >
        <LayoutGrid size={15} />
      </button>
    </div>
  );
}

// ─── 新建微信号弹窗 ────────────────────────────────────────────
function NewWechatModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ no: "", wechatId: "", phone: "", nickname: "", gender: "男", wechatPassword: "", qqNo: "", qqPassword: "", qqSecurity: "", boundEmail: "", emailPassword: "", emailSecurity: "", ownerName: "", idCard: "", bankCard: "", opsManager: "", memberManager: "", city: "", region: "", department: "", project: "", accountType: "客服号", status: "库存", qr: "" });
  const [contacts, setContacts] = useState(["", "", ""]);
  const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "其他"];
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const field = (label: string, key: string, placeholder = "请输入", type = "text") => <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</span><input type={type} className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} placeholder={placeholder} value={(form as any)[key]} onChange={e => set(key, e.target.value)} /></label>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-[min(720px,calc(100vw-32px))] overflow-hidden" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}><div><div className="font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>录入微信号</div><div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>先录入资产，再完成归属与群绑定</div></div><button type="button" aria-label="关闭录入微信号" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button></div>
      <div className="flex gap-1 px-6 pt-4" role="tablist" aria-label="微信号录入步骤">{[[1,"微信信息"],[2,"绑定人与安全"],[3,"归属与群绑定"]].map(([number,label]) => <button key={number} type="button" role="tab" aria-selected={step === number} onClick={() => setStep(number as number)} className="flex-1 py-2 text-xs font-bold" style={{ background: step === number ? "#0d0d0d" : "#f5f5f5", color: step === number ? S.accent : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{number}. {label}</button>)}</div>
      <div className="p-6 space-y-4" style={{ maxHeight: "68vh", overflowY: "auto" }}>
        {step === 1 && <>
          <div className="grid grid-cols-2 gap-4">{field("编号", "no", "如 00011")}{field("微信号", "wechatId", "如 wx_bj_03")}{field("微信昵称", "nickname", "如 蜂乐·张三")}{field("绑定手机号", "phone", "138-xxxx-xxxx")}{field("微信密码", "wechatPassword", "仅授权人员可见", "password")}<label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>账号类型</span><select className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} value={form.accountType} onChange={e => set("accountType", e.target.value)}>{["客服号","招商号","运营号"].map(v => <option key={v}>{v}</option>)}</select></label></div>
          <div className="flex items-center gap-3 px-4 py-3" style={{ border: `1px dashed ${S.borderMed}`, background: "#f7f7f7", borderRadius: S.radiusSm }}><Upload size={14} style={{ color: S.text }} /><span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>上传微信头像 / 微信二维码</span><span className="ml-auto text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>PNG / JPG</span></div>
        </>}
        {step === 2 && <>
          <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>绑定人信息</div><div className="grid grid-cols-2 gap-4">{field("绑定人姓名", "ownerName")}{field("身份证号", "idCard", "敏感资料，保存后脱敏")}{field("银行卡号", "bankCard", "敏感资料，保存后脱敏")}{field("QQ号", "qqNo", "可选")}{field("QQ密码", "qqPassword", "仅授权人员可见", "password")}{field("QQ密保", "qqSecurity", "可选")}{field("绑定邮箱", "boundEmail", "可选")}{field("邮箱密码", "emailPassword", "仅授权人员可见", "password")}{field("邮箱密保", "emailSecurity", "可选")}</div>
          <div className="text-xs font-bold pt-2" style={{ color: S.text, fontFamily: "monospace" }}>紧急联系人（3位微信联系人）</div><div className="grid grid-cols-3 gap-3">{contacts.map((contact, index) => <div key={index} className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>联系人 {index + 1}</div><input className="w-full px-2.5 py-2 text-xs outline-none" style={inputStyle} placeholder="微信联系人姓名" value={contact} onChange={e => setContacts(items => items.map((item, i) => i === index ? e.target.value : item))} /><div className="mt-2 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>二维码与备注可在详情中补充</div></div>)}</div>
        </>}
        {step === 3 && <>
          <div className="grid grid-cols-2 gap-4">{field("归属项目", "project", "如 北京PRO服务")}{field("归属员工", "opsManager", "服务负责人")}{field("会员负责人", "memberManager")}{field("归属部门", "department", "如 北京服务中心")}{field("归属大区", "region", "如 华北")}</div>
          <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>城市分站</span><select className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)}><option value="">请选择</option>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
          <div className="flex items-center justify-between"><span className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>绑定微信群（最多 20 个）</span><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>已选择 0 / 20</span></div><div className="grid grid-cols-5 gap-2">{Array.from({ length: 20 }, (_, i) => <button key={i} type="button" className="h-14 text-xs" style={{ background: S.bg, border: `1px dashed ${S.borderMed}`, color: S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => {}}><QrCode size={14} className="mx-auto mb-1" />群位 {String(i + 1).padStart(2, "0")}</button>)}</div>
          <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>初始状态</span><select className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>{["库存","未启用","使用中","待交接"].map(status => <option key={status}>{status}</option>)}</select></label>
        </>}
      </div>
      <div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" onClick={step === 1 ? onClose : () => setStep(step - 1)} className="flex-1 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }}>{step === 1 ? "取消" : "上一步"}</button><button type="button" onClick={() => step === 3 ? onClose() : setStep(step + 1)} className="flex-1 py-2.5 text-sm font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>{step === 3 ? "保存并进入库存" : "下一步"}</button></div>
    </div>
  </div>;
}

// ─── 扫码授权后录入微信号 ──────────────────────────────────────
type WechatEntryForm = {
  no: string;
  wechatId: string;
  phone: string;
  nickname: string;
  wechatPassword: string;
  qqNo: string;
  qqPassword: string;
  qqSecurity: string;
  boundEmail: string;
  emailPassword: string;
  emailSecurity: string;
  ownerName: string;
  idCard: string;
  idCardFront: string;
  idCardBack: string;
  bankCard: string;
  paymentPassword: string;
  opsManager: string;
  memberManager: string;
  city: string;
  region: string;
  department: string;
  project: string;
  accountType: string;
  status: string;
  wechatQrName: string;
  enterpriseName: string;
  corpId: string;
  adminName: string;
  adminPhone: string;
  authorizationScope: string;
  memberCapacity: string;
  customerCapacity: string;
};
type EmergencyContactDraft = { wechatId: string; name: string; phone: string; avatarIndex: number };

function AuthorizedWechatModal({ onClose, onSave, accountKind = "personal" }: { onClose: () => void; onSave?: (form: WechatEntryForm, contacts: EmergencyContactDraft[]) => void; accountKind?: "personal" | "wecom" }) {
  const isWecom = accountKind === "wecom";
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState<WechatEntryForm>({ no: "", wechatId: "", phone: "", nickname: "", wechatPassword: "", qqNo: "", qqPassword: "", qqSecurity: "", boundEmail: "", emailPassword: "", emailSecurity: "", ownerName: "", idCard: "", idCardFront: "", idCardBack: "", bankCard: "", paymentPassword: "", opsManager: "", memberManager: "", city: "", region: "", department: "", project: "", accountType: "", status: "未使用", wechatQrName: "", enterpriseName: "", corpId: "", adminName: "", adminPhone: "", authorizationScope: "", memberCapacity: "2000", customerCapacity: "2000" });
  const [contacts, setContacts] = useState<EmergencyContactDraft[]>([
    { wechatId: "", name: "", phone: "", avatarIndex: 0 },
    { wechatId: "", name: "", phone: "", avatarIndex: 0 },
    { wechatId: "", name: "", phone: "", avatarIndex: 0 },
  ]);
  const resolveContact = (index: number, wechatId: string) => {
    const matched = mockWechats.find(account => account.wechatId.toLowerCase() === wechatId.trim().toLowerCase());
    setContacts(current => current.map((contact, contactIndex) => contactIndex === index ? {
      wechatId,
      name: matched?.nickname || "",
      phone: matched?.phone || "",
      avatarIndex: matched ? Math.max(0, Number(matched.no) - 1) : 0,
    } : contact));
  };
  const [wechatQrName, setWechatQrName] = useState("");
  const [entryError, setEntryError] = useState("");
  const inputStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));
  const field = (label: string, key: string, placeholder = "请输入", type = "text") => <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>{label}</span><input disabled={!authorized} type={type} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} placeholder={placeholder} value={(form as any)[key]} onChange={event => set(key, event.target.value)} /></label>;
  const section = (title: string, hint: string) => <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />{title}</div><span className="text-[10px]" style={{ color: S.muted }}>{hint}</span></div>;
  const authorize = () => {
    setAuthorized(true);
    setForm(current => ({ ...current, no: "00011", wechatId: isWecom ? "wecom_bj_03" : "wx_bj_03", nickname: isWecom ? "北京企业微信" : "思远", phone: isWecom ? "—" : "138-0012-3456", enterpriseName: isWecom ? "蜂乐玛科技有限公司" : "", corpId: isWecom ? "ww_8fenglema" : "", adminName: isWecom ? "吴思远" : "", adminPhone: isWecom ? "138-0012-3456" : "", department: isWecom ? "北京服务中心" : current.department, authorizationScope: isWecom ? "客户联系、客户群、通讯录" : "" }));
  };
  const confirmEntry = () => {
    if (!authorized) return;
    if (!form.wechatId.trim() || !wechatQrName || (isWecom && !form.enterpriseName.trim())) { setEntryError(isWecom ? "企业主体、企业微信号和企业微信二维码为必填项，请补全后再录入" : "微信号和微信二维码为必填项，请补全后再录入"); return; }
    onSave?.({ ...form, wechatQrName }, contacts);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-[min(1080px,calc(100vw-24px))] overflow-hidden" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}><div><div className="font-semibold">新建{isWecom ? "企业微信号" : "微信号"}</div><div className="text-xs mt-1" style={{ color: S.muted }}>先扫码授权登录，完成账号与安全资料；归属信息在领用时配置</div></div><button type="button" aria-label={`关闭录入${isWecom ? "企业微信号" : "微信号"}`} onClick={onClose}><X size={16} style={{ color: S.muted }} /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-[264px_minmax(0,1fr)]" style={{ maxHeight: "80vh" }}>
        <aside className="p-5 flex flex-col gap-4" style={{ background: "#fbfbfb", borderRight: `1px solid ${S.border}` }}>
          <div className="flex items-center justify-between"><span className="text-sm font-bold">{isWecom ? "企业微信扫码授权" : "微信扫码授权"}</span><span className="px-2 py-1 text-[10px] font-bold" style={{ background: authorized ? "#f0fff4" : "#fff8e8", color: authorized ? "#276749" : "#9a5a00", borderRadius: S.radiusSm }}>{authorized ? "已授权" : "待扫码"}</span></div>
          <div className="p-3 flex items-center justify-center" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}><img src="/zhuliren-final/assets/addwechat-reference-qr.png" alt="微信授权二维码" style={{ width: 206, height: 206, objectFit: "contain" }} /></div>
          <div className="text-center"><div className="text-xs font-bold">{authorized ? "授权成功，可继续填写" : `${isWecom ? "企业微信管理员" : "微信"}扫描二维码进入`}</div><div className="text-[10px] mt-1 leading-relaxed" style={{ color: S.muted }}>请使用待录入{isWecom ? "企业微信管理员" : "微信"}扫码，授权成功后系统自动读取微信昵称、微信号和头像。</div></div>
          <div className="p-3 space-y-2" style={{ background: authorized ? S.accentLight : "#fff8e8", border: `1px solid ${authorized ? S.accentMid : "#f2d6a0"}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold" style={{ color: authorized ? "#276749" : "#9a5a00" }}>{authorized ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}{authorized ? "身份已确认" : "授权前不会写入账号"}</div><div className="text-[10px] leading-relaxed" style={{ color: S.muted }}>{authorized ? "自动读取字段可修改，敏感字段仍需人工补充。" : "二维码仅用于本次登录授权，不会直接保存密码。"}</div></div>
          {!authorized ? <button type="button" className="w-full py-2.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }} onClick={authorize}>确认已扫码授权</button> : <button type="button" className="w-full py-2.5 text-xs font-bold" style={{ background: "#fff", color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }} onClick={() => setAuthorized(false)}>重新扫码授权</button>}
        </aside>
        <div className="min-w-0 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between px-3 py-2" style={{ background: authorized ? S.accentLight : "#f5f5f5", border: `1px solid ${authorized ? S.accentMid : S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold">{authorized ? <CheckCircle2 size={14} style={{ color: "#276749" }} /> : <LockKeyhole size={14} style={{ color: S.muted }} />}{authorized ? `${isWecom ? "企业微信资料" : "微信资料"}已获取，请继续完善表单` : "完成扫码授权后解锁表单"}</div><span className="text-[10px]" style={{ color: S.muted }}>必填项标记 *</span></div>
          <section className="space-y-3">{section(isWecom ? "企业微信信息" : "微信信息", "授权字段可修改")}<div className="grid grid-cols-1 lg:grid-cols-[96px_minmax(0,1fr)_148px] gap-4"><div className="flex flex-col items-center gap-2"><div className="w-20 h-20 overflow-hidden" style={{ background: "#f0f0f0", borderRadius: S.radius }}>{authorized && <img src={getAvatar(0)} alt="微信头像" className="w-full h-full object-cover" />}</div><span className="text-[10px]" style={{ color: S.muted }}>微信头像</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field(isWecom ? "企业微信名称" : "微信昵称", "nickname", "授权后自动获取")}{field(isWecom ? "企业微信号 *" : "微信号 *", "wechatId", "授权后自动获取")}{field(isWecom ? "管理员可见凭证" : "微信密码", "wechatPassword", "仅授权人员可见", "password")} {!isWecom && <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>账号类型（可后配）</span><select disabled={!authorized} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} value={form.accountType} onChange={event => set("accountType", event.target.value)}><option value="">暂不设置，领用时配置</option>{["客服号", "招商号", "运营号"].map(value => <option key={value}>{value}</option>)}</select></label>}</div><label className="min-h-[132px] flex flex-col items-center justify-center gap-2 px-3 py-3 text-center cursor-pointer transition-colors" style={{ border: `1px dashed ${S.borderMed}`, background: authorized ? "#fbfbfb" : "#f5f5f5", color: authorized ? S.textSec : S.muted, borderRadius: S.radiusSm, opacity: authorized ? 1 : 0.56 }}><input disabled={!authorized} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={event => { const name = event.target.files?.[0]?.name || ""; setWechatQrName(name); set("wechatQrName", name); }} /><QrCode size={24} style={{ color: authorized ? S.text : S.muted }} /><span className="text-xs font-semibold">{wechatQrName || `${isWecom ? "上传企业微信二维码" : "上传微信二维码"} *`}</span><span className="text-[10px]" style={{ color: S.muted }}>PNG / JPG · 必填</span></label></div></section>
          {isWecom ? <>
            <section className="space-y-3">{section("企业主体与授权", "扫码后自动获取，可校正")}<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field("企业主体 *", "enterpriseName", "授权后自动获取")}{field("企业主体 ID", "corpId", "授权后自动获取")}{field("企业管理员", "adminName", "已启用的企业管理员")}{field("管理员手机", "adminPhone", "用于授权通知")}{field("部门", "department", "可后续调整")}{field("授权范围", "authorizationScope", "客户联系、客户群、通讯录")}</div></section>
            <section className="space-y-3">{section("成员与运营配置", "项目归属可后续配置")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("成员席位上限", "memberCapacity", "2000")}{field("外部联系人上限", "customerCapacity", "2000")}{field("关联个人微信", "linkedPersonal", "可选，后续绑定")}</div><div className="px-3 py-2 text-[10px]" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius, color: S.text }}>新企微默认进入“注册入库 / 未使用”；项目、地区、账号类型和负责人在分配时配置。</div></section>
          </> : <>
            <section className="space-y-3">{section("绑定人信息", "敏感资料保存后脱敏")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("绑定人姓名", "ownerName")}{field("绑定人手机", "phone", "138-xxxx-xxxx")}{field("身份证号", "idCard", "敏感资料，保存后脱敏")}{field("银行卡号", "bankCard", "敏感资料，保存后脱敏")}{field("支付密码", "paymentPassword", "仅授权人员可见", "password")}</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="flex items-center gap-3 px-3 py-3 cursor-pointer" style={{ border: `1px dashed ${S.borderMed}`, background: authorized ? "#fbfbfb" : "#f5f5f5", borderRadius: S.radiusSm, opacity: authorized ? 1 : 0.56 }}><input disabled={!authorized} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={event => set("idCardFront", event.target.files?.[0]?.name || "")} /><div className="w-10 h-10 grid place-items-center" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><Upload size={16} /></div><div className="min-w-0"><div className="text-xs font-semibold truncate">{form.idCardFront || "上传身份证正面"}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>人像面 · JPG / PNG</div></div></label><label className="flex items-center gap-3 px-3 py-3 cursor-pointer" style={{ border: `1px dashed ${S.borderMed}`, background: authorized ? "#fbfbfb" : "#f5f5f5", borderRadius: S.radiusSm, opacity: authorized ? 1 : 0.56 }}><input disabled={!authorized} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={event => set("idCardBack", event.target.files?.[0]?.name || "")} /><div className="w-10 h-10 grid place-items-center" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><Upload size={16} /></div><div className="min-w-0"><div className="text-xs font-semibold truncate">{form.idCardBack || "上传身份证反面"}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>国徽面 · JPG / PNG</div></div></label></div></section>
            <section className="space-y-3">{section("QQ / 邮箱绑定信息", "可选")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("绑定QQ", "qqNo")}{field("QQ密码", "qqPassword", "仅授权人员可见", "password")}{field("QQ密保", "qqSecurity")}{field("绑定邮箱", "boundEmail")}{field("邮箱密码", "emailPassword", "仅授权人员可见", "password")}{field("邮箱密保", "emailSecurity")}</div></section>
            <section className="space-y-3">{section("紧急联系人信息", "3位微信联系人")}<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{contacts.map((contact, index) => <div key={index} className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-xs font-bold mb-2">联系人 {index + 1}</div><input disabled={!authorized} className="w-full px-2.5 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} placeholder="输入微信号自动匹配" value={contact.wechatId} onChange={event => resolveContact(index, event.target.value)} />{contact.wechatId && <div className="mt-2 flex items-center gap-2"><img src={getAvatar(contact.avatarIndex)} alt={contact.name || "微信联系人"} className="w-8 h-8 object-cover" style={{ borderRadius: S.radiusSm, opacity: contact.name ? 1 : 0.45 }} /><div className="min-w-0"><div className="text-xs font-semibold truncate">{contact.name || "未匹配到微信号"}</div><div className="text-[10px] truncate" style={{ color: S.muted }}>{contact.phone || "请确认微信号"}</div></div></div>}<div className="mt-2 text-[10px]" style={{ color: S.muted }}>输入已建微信号，自动带出头像、负责人和手机</div></div>)}</div></section>
          </>}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ borderTop: `1px solid ${S.border}` }}>{entryError ? <span className="text-[10px]" role="alert" style={{ color: "#c2410c" }}>{entryError}</span> : <span className="text-[10px]" style={{ color: S.muted }}>{authorized ? `${isWecom ? "企业微信资料" : "资料"}已授权，确认后账号进入未使用；项目归属和账号类型后续配置` : "请先完成二维码授权"}</span>}<div className="flex gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>取消</button><button type="button" disabled={!authorized} onClick={confirmEntry} className="px-6 py-2.5 text-sm font-bold disabled:cursor-not-allowed" style={{ background: authorized ? "#0d0d0d" : "#ddd", color: authorized ? S.accent : "#888", borderRadius: S.radius }}>{isWecom ? "确认接入" : "确认录入"}</button></div></div>
    </div>
  </div>;
}

type AllocationDraft = { project: string; opsManager: string; city: string; accountType: string; groupType: string };
type RegionCategory = { id: string; name: string; provinces: string[]; system?: boolean };

const provinceOptions = ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区", "台湾省"];

const cityOptionsByProvince: Record<string, string[]> = {
  "北京市": ["北京市"], "天津市": ["天津市"], "河北省": ["石家庄市", "唐山市", "保定市"], "山西省": ["太原市", "大同市", "运城市"], "内蒙古自治区": ["呼和浩特市", "包头市", "鄂尔多斯市"],
  "辽宁省": ["沈阳市", "大连市", "鞍山市"], "吉林省": ["长春市", "吉林市", "延边州"], "黑龙江省": ["哈尔滨市", "齐齐哈尔市", "大庆市"], "上海市": ["上海市"], "江苏省": ["南京市", "苏州市", "无锡市"],
  "浙江省": ["杭州市", "宁波市", "温州市"], "安徽省": ["合肥市", "芜湖市", "阜阳市"], "福建省": ["福州市", "厦门市", "泉州市"], "江西省": ["南昌市", "赣州市", "九江市"], "山东省": ["济南市", "青岛市", "烟台市"],
  "河南省": ["郑州市", "洛阳市", "南阳市"], "湖北省": ["武汉市", "宜昌市", "襄阳市"], "湖南省": ["长沙市", "株洲市", "衡阳市"], "广东省": ["广州市", "深圳市", "东莞市"], "广西壮族自治区": ["南宁市", "桂林市", "柳州市"],
  "海南省": ["海口市", "三亚市"], "重庆市": ["重庆市"], "四川省": ["成都市", "绵阳市", "乐山市"], "贵州省": ["贵阳市", "遵义市", "六盘水市"], "云南省": ["昆明市", "大理州", "曲靖市"],
  "西藏自治区": ["拉萨市", "日喀则市"], "陕西省": ["西安市", "咸阳市", "宝鸡市"], "甘肃省": ["兰州市", "天水市", "酒泉市"], "青海省": ["西宁市", "海东市"], "宁夏回族自治区": ["银川市", "吴忠市"],
  "新疆维吾尔自治区": ["乌鲁木齐市", "喀什地区", "伊犁州"], "香港特别行政区": ["香港"], "澳门特别行政区": ["澳门"], "台湾省": ["台北市", "高雄市", "台中市"],
};

const regionTemplates = [
  { id: "north", name: "华北市场", provinces: ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区"] },
  { id: "northeast", name: "东北市场", provinces: ["辽宁省", "吉林省", "黑龙江省"] },
  { id: "east", name: "华东市场", provinces: ["上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省"] },
  { id: "central", name: "华中市场", provinces: ["河南省", "湖北省", "湖南省"] },
  { id: "south", name: "华南市场", provinces: ["广东省", "广西壮族自治区", "海南省"] },
  { id: "southwest", name: "西南市场", provinces: ["重庆市", "四川省", "贵州省", "云南省", "西藏自治区"] },
  { id: "northwest", name: "西北市场", provinces: ["陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区"] },
  { id: "overseas", name: "海外市场", provinces: ["香港特别行政区", "澳门特别行政区", "台湾省"] },
];

function WechatAllocationModal({ account, onClose, onSave }: { account: PersonalAccount; onClose: () => void; onSave: (patch: Partial<PersonalAccount>) => void }) {
  const inputStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const normalizeProvince = (value: string) => provinceOptions.find(province => province.startsWith(value) || value.startsWith(province)) || value;
  const initialAccountCities = account.city !== "—" ? account.city.split(" / ") : [];
  const initialAccountProvinces = initialAccountCities.map(normalizeProvince);
  const projectOptions = Array.from(new Set(["体验官", "PRO会员", ...mockWechats.map(item => item.project).filter(value => value !== "—")]));
  const employeeRecords = Array.from(new Map(mockWechats.filter(item => item.opsManager !== "—").map(item => [item.opsManager, { name: item.opsManager, department: item.department }])).values()).slice(0, 100);
  const employeeDepartments = Array.from(new Set(employeeRecords.map(item => item.department)));
  const [draft, setDraft] = useState<AllocationDraft>({ project: account.project === "待配置" || account.project === "—" ? "" : account.project, opsManager: account.opsManager === "—" ? "" : account.opsManager, city: account.city === "—" ? "" : account.city, accountType: account.accountType === "待配置" ? "" : account.accountType, groupType: "" });
  const initialAssigned = Math.min(Math.max(account.groupCount || 0, 0), 20);
  const [groupCount, setGroupCount] = useState(20);
  const [selectedSlots, setSelectedSlots] = useState(() => Array.from({ length: 20 }, (_, index) => index < initialAssigned));
  const [qrNames, setQrNames] = useState(() => Array.from({ length: 20 }, (_, index) => index < initialAssigned ? (account.groupQrNames?.[index] || "已绑定二维码") : ""));
  const [groupTypeOptions, setGroupTypeOptions] = useState(() => defaultGroupTypeRules.map(rule => ({ name: rule.name, code: rule.code, memberRoles: rule.memberRoles, allocationMode: rule.allocationMode })));
  const [newGroupType, setNewGroupType] = useState("");
  const [groupTypeOpen, setGroupTypeOpen] = useState(false);
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [accountTypeOptions, setAccountTypeOptions] = useState(() => ["招商号", "客服号", "运营号"].map((name, index) => ({ id: `system-${index}`, name, system: true })));
  const [newAccountType, setNewAccountType] = useState("");
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(employeeDepartments[0] || "");
  const [regionCategories, setRegionCategories] = useState<RegionCategory[]>(() => [{ id: "nationwide", name: "全国", provinces: ["全国"], system: true }, { id: "overseas", name: "海外", provinces: ["海外"], system: true }, { id: "custom-1", name: "自定义分类一", provinces: initialAccountProvinces }, { id: "custom-2", name: "自定义分类二", provinces: [] }]);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [activeProvince, setActiveProvince] = useState(initialAccountProvinces[0] || provinceOptions[0]);
  const [regionCitySelections, setRegionCitySelections] = useState<Record<string, string[]>>(() => ({ "custom-1": initialAccountProvinces }));
  const [regionTemplateSelections, setRegionTemplateSelections] = useState<Record<string, string>>({});
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editingRegionName, setEditingRegionName] = useState("");
  const [newRegionName, setNewRegionName] = useState("");
  const [tagNames, setTagNames] = useState(["体验官会员群", "全国游客群"]);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const set = (key: keyof AllocationDraft, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const selectedCount = selectedSlots.filter(Boolean).length;
  const activeRegion = regionCategories.find(category => category.id === activeRegionId) || regionCategories[0];
  const selectedRule = groupTypeOptions.find(option => option.name === draft.groupType);
  const selectedRegionName = activeRegionId ? activeRegion.name : (account.region === "—" ? "待配置" : account.region);
  const activeProvinceSelected = activeRegion.provinces.includes(activeProvince);
  const claimedProvinceOwners = regionCategories.reduce<Record<string, string>>((owners, category) => {
    if (!category.system && category.id !== activeRegionId) category.provinces.forEach(province => { owners[province] = category.name; });
    return owners;
  }, {});
  const toggleSlot = (index: number) => setSelectedSlots(current => current.map((selected, slotIndex) => slotIndex === index ? !selected : selected));
  const updateGroupCount = (value: number) => {
    const next = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 100);
    setGroupCount(next);
    setSelectedSlots(current => Array.from({ length: next }, (_, index) => current[index] ?? false));
    setQrNames(current => Array.from({ length: next }, (_, index) => current[index] || ""));
  };
  const updateRegion = (id: string, provinces: string[]) => { const available = provinces.filter(province => !claimedProvinceOwners[province] || regionCategories.find(category => category.id === id)?.provinces.includes(province)); setRegionCategories(current => current.map(category => category.id === id ? { ...category, provinces: available } : category)); setRegionTemplateSelections(current => ({ ...current, [id]: "" })); setActiveProvince(current => available.includes(current) ? current : (available[0] || provinceOptions[0])); set("city", available.join(" / ")); };
  const updateRegionCities = (id: string, province: string, cities: string[]) => { setRegionCitySelections(current => ({ ...current, [id]: [...(current[id] || []).filter(city => !cityOptionsByProvince[province]?.includes(city)), ...cities] })); const selectedCities = [...(regionCitySelections[id] || []).filter(city => !cityOptionsByProvince[province]?.includes(city)), ...cities]; set("city", selectedCities.length ? selectedCities.join(" / ") : (regionCategories.find(category => category.id === id)?.provinces.join(" / ") || "")); };
  const addRegion = () => { const value = newRegionName.trim(); if (!value) return; const id = `custom-${Date.now()}`; setRegionCategories(current => [...current, { id, name: value, provinces: [] }]); setRegionCitySelections(current => ({ ...current, [id]: [] })); setActiveRegionId(id); setActiveProvince(provinceOptions[0]); setNewRegionName(""); };
  const removeRegion = (id: string) => { setRegionCategories(current => current.filter(category => category.id !== id)); setRegionTemplateSelections(current => { const next = { ...current }; delete next[id]; return next; }); if (activeRegionId === id) setActiveRegionId(null); };
  const beginEditRegion = (category: RegionCategory) => { setEditingRegionId(category.id); setEditingRegionName(category.name); };
  const saveRegionName = () => { const value = editingRegionName.trim(); if (!editingRegionId || !value) return; setRegionCategories(current => current.map(category => category.id === editingRegionId ? { ...category, name: value } : category)); setEditingRegionId(null); setEditingRegionName(""); };
  const applyRegionTemplate = (template: { id: string; provinces: string[] }) => { if (!activeRegionId || activeRegion.system) return; const available = template.provinces.filter(province => !claimedProvinceOwners[province]); setRegionCategories(current => current.map(category => category.id === activeRegionId ? { ...category, provinces: available } : category)); setRegionCitySelections(current => ({ ...current, [activeRegionId]: [] })); setRegionTemplateSelections(current => ({ ...current, [activeRegionId]: template.id })); setActiveProvince(available[0] || provinceOptions[0]); set("city", available.join(" / ")); setTemplateOpen(false); };
  const addGroupType = () => { const value = newGroupType.trim(); if (!value) return; const option = { name: value, code: `CUSTOM${String(groupTypeOptions.length + 1).padStart(2, "0")}`, memberRoles: ["待配置角色"], allocationMode: "轮巡分配" as const }; setGroupTypeOptions(current => [...current, option]); set("groupType", value); setNewGroupType(""); };
  const addAccountType = () => { const value = newAccountType.trim(); if (!value || accountTypeOptions.some(option => option.name === value)) return; setAccountTypeOptions(current => [...current, { id: `custom-${Date.now()}`, name: value, system: false }]); set("accountType", value); setNewAccountType(""); };
  const addTag = () => { const value = newTagName.trim(); if (!value || tagNames.includes(value)) return; setTagNames(current => [...current, value]); setNewTagName(""); };
  const save = () => {
    if (!draft.project || !draft.opsManager || !draft.city || !draft.groupType) { setError("请补全所属项目、已启用员工、地区和群类型"); return; }
    const missingQr = selectedSlots.some((selected, index) => selected && !qrNames[index]);
    if (missingQr) { setError("已选群位必须上传微信群二维码，不能留空"); return; }
    const assigned = selectedCount > 0;
    onSave({ project: draft.project, opsManager: draft.opsManager, serviceOfficer: draft.opsManager, city: draft.city, region: selectedRegionName, accountType: draft.accountType || "待配置", groupType: draft.groupType, groupCount: selectedCount, groupQrNames: qrNames, status: assigned ? "使用中" : "未使用", targetGroup: assigned ? `${draft.city}${draft.groupType}群01` : "待分配", targetGroupCount: selectedCount });
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-[min(1180px,calc(100vw-24px))] max-h-[94vh] overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}><div><div className="font-semibold">分配微信号</div><div className="text-xs mt-1" style={{ color: S.muted }}>为 {account.wechatId} 配置项目归属、群类型和微信群位；账号类型与微信群数可暂不设置</div></div><button type="button" aria-label="关闭微信号分配" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button></div>
      <div className="overflow-y-auto p-6 space-y-5">
        <section className="space-y-3"><div className="flex items-center gap-2 text-sm font-bold border-b pb-2" style={{ borderColor: S.border }}><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />微信号分配</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"><label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>所属项目 *</span><select className="w-full px-2.5 py-2 text-xs outline-none" value={draft.project} onChange={event => set("project", event.target.value)} style={inputStyle}><option value="">请选择</option>{projectOptions.map(value => <option key={value}>{value}</option>)}</select></label><div className="relative"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>所属员工 *</span><button type="button" className="w-full px-2.5 py-2 text-xs text-left" onClick={() => setEmployeeOpen(value => !value)} style={{ ...inputStyle, color: draft.opsManager ? S.text : S.muted }}>{draft.opsManager || "请选择已启用员工"}</button>{employeeOpen && <div className="absolute left-0 right-0 top-[58px] z-40 p-2 max-h-56 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}><div className="flex gap-1 mb-2 overflow-x-auto">{employeeDepartments.map(department => <button key={department} type="button" className="px-2 py-1 text-[10px] whitespace-nowrap" onClick={() => setActiveDepartment(department)} style={{ background: activeDepartment === department ? "#0d0d0d" : S.bg, color: activeDepartment === department ? S.accent : S.muted, borderRadius: S.radiusSm }}>{department}</button>)}</div>{employeeRecords.filter(record => record.department === activeDepartment).map(record => <button key={record.name} type="button" className="block w-full px-2 py-1.5 text-left text-xs hover:bg-lime-50" onClick={() => { set("opsManager", record.name); setEmployeeOpen(false); }}>{record.name}</button>)}</div>}</div><div className="relative"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>所属地区 *</span><button type="button" className="w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left" onClick={() => { setRegionOpen(value => !value); setTemplateOpen(false); }} style={inputStyle}><span className="truncate" style={{ color: draft.city ? S.text : S.muted }}>{draft.city || "请选择地区"}</span><ChevronDown size={13} style={{ color: S.muted, transform: regionOpen ? "rotate(180deg)" : undefined }} /></button>{regionOpen && <div className="absolute left-0 top-[58px] z-40 w-[720px] max-w-[calc(100vw-48px)] p-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, boxShadow: "0 12px 28px rgba(0,0,0,0.14)" }}><div className="flex gap-2"><div className="w-40 flex-shrink-0 space-y-1">{regionCategories.map(category => <div key={category.id} className="group flex items-center gap-1">{editingRegionId === category.id ? <input autoFocus value={editingRegionName} onChange={event => setEditingRegionName(event.target.value)} onBlur={saveRegionName} onKeyDown={event => { if (event.key === "Enter") saveRegionName(); }} className="min-w-0 flex-1 px-2 py-1.5 text-xs outline-none" style={inputStyle} /> : <button type="button" className="flex-1 px-2 py-1.5 text-left text-xs truncate" onClick={() => { setActiveRegionId(category.id); setTemplateOpen(false); setActiveProvince(category.provinces[0] || provinceOptions[0]); set("city", (regionCitySelections[category.id] || category.provinces).join(" / ")); }} style={{ background: activeRegionId === category.id ? "#0d0d0d" : S.bg, color: activeRegionId === category.id ? S.accent : S.textSec, borderRadius: S.radiusSm }}>{category.name}</button>}{!category.system && <div className="flex items-center opacity-0 group-hover:opacity-100"><button type="button" title={`编辑${category.name}`} aria-label={`编辑${category.name}`} className="px-1" onClick={() => beginEditRegion(category)}><Edit3 size={11} style={{ color: S.muted }} /></button><button type="button" title={`删除${category.name}`} aria-label={`删除${category.name}`} className="px-1" onClick={() => removeRegion(category.id)}><X size={11} style={{ color: S.muted }} /></button></div>}</div>)}<div className="flex gap-1 pt-1"><input value={newRegionName} onChange={event => setNewRegionName(event.target.value)} placeholder="新增分类" className="min-w-0 flex-1 px-2 py-1 text-[10px] outline-none" style={inputStyle} /><button type="button" title="新增地区分类" aria-label="新增地区分类" className="px-2" onClick={addRegion} style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}><Plus size={12} /></button></div></div>{activeRegionId ? <><div className="w-40 flex-shrink-0 p-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="mb-1 flex items-center justify-between text-[10px] font-semibold" style={{ color: S.muted }}><span>选择省份</span>{!activeRegion.system && <span>{activeRegion.provinces.length} 已选</span>}</div>{activeRegion.system ? <div className="text-[10px] leading-relaxed" style={{ color: S.muted }}>系统分类“{activeRegion.name}”自动接收未匹配地址。</div> : <div className="space-y-1 max-h-52 overflow-auto">{provinceOptions.map(province => { const owner = claimedProvinceOwners[province]; return (<label key={province} className="flex items-start gap-1 text-[10px]" style={{ color: owner ? S.muted : S.textSec, opacity: owner ? 0.72 : 1 }}><input type="checkbox" checked={activeRegion.provinces.includes(province)} disabled={Boolean(owner)} onChange={event => { if (owner) return; updateRegion(activeRegion.id, event.target.checked ? [...activeRegion.provinces, province] : activeRegion.provinces.filter(item => item !== province)); if (event.target.checked) setActiveProvince(province); }} /><span className="min-w-0 flex-1">{province}</span>{owner && <span className="whitespace-nowrap text-[9px]" style={{ color: S.muted }}>已选·{owner}</span>}</label>); })}</div>}</div>{!activeRegion.system && activeProvinceSelected && <div className="flex-1 min-w-0 p-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="mb-1 text-[10px] font-semibold" style={{ color: S.muted }}>选择城市 · {activeProvince}</div><div className="space-y-1 max-h-52 overflow-auto">{(cityOptionsByProvince[activeProvince] || ["全省"]).map(city => <label key={city} className="flex items-center gap-1 text-[10px]" style={{ color: S.textSec }}><input type="checkbox" checked={(regionCitySelections[activeRegion.id] || []).includes(city)} onChange={event => updateRegionCities(activeRegion.id, activeProvince, event.target.checked ? [...(regionCitySelections[activeRegion.id] || []), city] : (regionCitySelections[activeRegion.id] || []).filter(item => item !== city))} />{city}</label>)}</div></div>}</> : null}</div><div className="mt-2 pt-2" style={{ borderTop: `1px solid ${S.border}` }}><div className="flex items-center gap-2"><span className="text-[10px] font-semibold" style={{ color: S.muted }}>销售市场模板</span><div className="relative"><button type="button" disabled={!activeRegionId || activeRegion.system} onClick={() => setTemplateOpen(value => !value)} className="flex items-center gap-2 px-2 py-1 text-[10px]" style={{ background: S.bg, border: `1px solid ${S.border}`, color: activeRegionId && !activeRegion.system ? S.textSec : S.muted, borderRadius: S.radiusSm, opacity: !activeRegionId || activeRegion.system ? 0.5 : 1 }}><span>{regionTemplates.find(template => template.id === regionTemplateSelections[activeRegionId || ""])?.name || "选择市场模板"}</span><ChevronDown size={11} style={{ transform: templateOpen ? "rotate(180deg)" : undefined }} /></button>{templateOpen && activeRegionId && !activeRegion.system && <div className="absolute left-0 top-full mt-1 z-50 w-40 p-1" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, boxShadow: "0 10px 24px rgba(0,0,0,0.14)" }}>{regionTemplates.map(template => <button key={template.id} type="button" className="block w-full px-2 py-1.5 text-left text-[10px]" onClick={() => applyRegionTemplate(template)} style={{ background: regionTemplateSelections[activeRegionId] === template.id ? S.accentLight : S.surface, color: S.textSec, borderRadius: S.radiusSm }}>{template.name}</button>)}</div>}</div></div></div></div>}</div><div className="relative"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>微信号类型</span><button type="button" className="w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left" onClick={() => setAccountTypeOpen(value => !value)} style={inputStyle}><span className="truncate" style={{ color: draft.accountType ? S.text : S.muted }}>{draft.accountType || "暂不设置，领用时配置"}</span><ChevronDown size={13} style={{ color: S.muted, transform: accountTypeOpen ? "rotate(180deg)" : undefined }} /></button>{accountTypeOpen && <div className="absolute left-0 right-0 top-[58px] z-30 overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, boxShadow: "0 12px 28px rgba(0,0,0,0.14)" }}><button type="button" className="w-full px-3 py-2 text-left text-[10px]" onClick={() => { set("accountType", ""); setAccountTypeOpen(false); }} style={{ color: S.muted, borderBottom: `1px solid ${S.border}` }}>暂不设置，领用时配置</button>{accountTypeOptions.map(option => <div key={option.id} className="group flex items-center" style={{ borderBottom: `1px solid ${S.border}` }}><button type="button" className="flex-1 px-3 py-2 text-left text-xs" onClick={() => { set("accountType", option.name); setAccountTypeOpen(false); }} style={{ color: draft.accountType === option.name ? S.text : S.textSec, background: draft.accountType === option.name ? S.accentLight : S.surface }}>{option.name}</button>{!option.system && <button type="button" title={`删除${option.name}`} aria-label={`删除${option.name}`} className="px-2 opacity-0 group-hover:opacity-100" onClick={() => { setAccountTypeOptions(current => current.filter(item => item.id !== option.id)); if (draft.accountType === option.name) set("accountType", ""); }}><X size={12} style={{ color: S.muted }} /></button>}</div>)}<div className="flex items-center gap-1 p-2" style={{ background: S.bg }}><input value={newAccountType} onChange={event => setNewAccountType(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addAccountType(); }} placeholder="新增微信号类型" className="min-w-0 flex-1 px-2 py-1.5 text-[10px] outline-none" style={inputStyle} /><button type="button" title="新增微信号类型" aria-label="新增微信号类型" className="w-7 h-7 grid place-items-center flex-shrink-0" onClick={addAccountType} style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}><Plus size={12} /></button></div></div>}</div><label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>微信群数</span><input type="number" min={0} max={100} value={groupCount} onChange={event => updateGroupCount(Number(event.target.value))} className="w-full px-2.5 py-2 text-xs outline-none" style={inputStyle} /></label><div className="relative"><span className="block mb-1.5 text-xs" style={{ color: S.muted }}>群类型 *</span><button type="button" className="w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left" onClick={() => setGroupTypeOpen(value => !value)} style={inputStyle}><span className="truncate" style={{ color: draft.groupType ? S.text : S.muted }}>{draft.groupType || "请选择群类型"}</span><ChevronDown size={13} style={{ color: S.muted, transform: groupTypeOpen ? "rotate(180deg)" : undefined }} /></button>{groupTypeOpen && <div className="absolute left-0 right-0 top-[58px] z-30 overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, boxShadow: "0 12px 28px rgba(0,0,0,0.14)" }}>{groupTypeOptions.map(option => <div key={option.code} className="group flex items-center" style={{ borderBottom: `1px solid ${S.border}` }}><button type="button" className="flex-1 px-3 py-2 text-left text-xs" onClick={() => { set("groupType", option.name); setGroupTypeOpen(false); }} style={{ color: draft.groupType === option.name ? S.text : S.textSec, background: draft.groupType === option.name ? S.accentLight : S.surface }}>{option.name} · {option.code}</button>{!defaultGroupTypeRules.some(rule => rule.code === option.code) && <button type="button" title={`删除${option.name}`} aria-label={`删除${option.name}`} className="px-2 opacity-0 group-hover:opacity-100" onClick={() => { setGroupTypeOptions(current => current.filter(item => item.code !== option.code)); if (draft.groupType === option.name) set("groupType", ""); }}><X size={12} style={{ color: S.muted }} /></button>}</div>)}<div className="flex items-center gap-1 p-2" style={{ background: S.bg }}><input value={newGroupType} onChange={event => setNewGroupType(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addGroupType(); }} placeholder="新增群类型" className="min-w-0 flex-1 px-2 py-1.5 text-[10px] outline-none" style={inputStyle} /><button type="button" title="新增群类型" aria-label="新增群类型" className="w-7 h-7 grid place-items-center flex-shrink-0" onClick={addGroupType} style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}><Plus size={12} /></button></div></div>}</div></div></section>
        <section className="space-y-3"><div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />群类型规则预览</div><span className="text-xs" style={{ color: S.muted }}>选择后匹配群对象与分配方式</span></div><div className="flex flex-wrap gap-2">{groupTypeOptions.map(option => <div key={option.code} className="group flex items-center gap-1"><button type="button" className="px-2.5 py-1.5 text-xs" onClick={() => set("groupType", option.name)} style={{ background: draft.groupType === option.name ? "#0d0d0d" : S.bg, color: draft.groupType === option.name ? S.accent : S.textSec, border: `1px solid ${draft.groupType === option.name ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}>{option.name} · {option.code}</button>{!defaultGroupTypeRules.some(rule => rule.code === option.code) && <button type="button" title={`删除${option.name}`} aria-label={`删除${option.name}`} className="opacity-0 group-hover:opacity-100" onClick={() => { setGroupTypeOptions(current => current.filter(item => item.code !== option.code)); if (draft.groupType === option.name) set("groupType", ""); }}><X size={12} style={{ color: S.muted }} /></button>}</div>)}</div>{selectedRule && <div className="px-3 py-2 text-xs" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>群对象：{selectedRule.memberRoles.join("、")}　·　分配方式：{selectedRule.allocationMode}</div>}</section>
        <section className="space-y-2"><div className="flex items-center justify-between"><div className="text-xs font-bold">运营标签与账号类型映射</div><span className="text-[10px]" style={{ color: S.muted }}>客服号→体验官会员群；招商号→全国游客群</span></div><div className="flex flex-wrap gap-2">{tagNames.map(tag => <span key={tag} className="group inline-flex items-center gap-1 px-2 py-1 text-[10px]" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>{tag}<button type="button" title={`删除${tag}`} aria-label={`删除${tag}`} className="opacity-0 group-hover:opacity-100" onClick={() => setTagNames(current => current.filter(item => item !== tag))}><X size={10} style={{ color: S.muted }} /></button></span>)}<input value={newTagName} onChange={event => setNewTagName(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addTag(); }} placeholder="运营新增标签" className="w-28 px-2 py-1 text-[10px] outline-none" style={inputStyle} /></div></section>
        <section className="space-y-3"><div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />微信号绑定群</div><span className="text-xs" style={{ color: S.muted }}>{selectedCount} / {groupCount} 个群位已选择</span></div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">{selectedSlots.map((selected, index) => <div key={index} className="p-2" style={{ background: selected ? S.accentLight : S.bg, border: `1px ${selected ? "solid" : "dashed"} ${selected ? S.accent : S.borderMed}`, borderRadius: S.radiusSm }}><button type="button" onClick={() => toggleSlot(index)} className="w-full text-left"><div className="h-14 grid place-items-center" style={{ background: S.surface, borderRadius: S.radiusSm, color: selected ? S.text : S.muted }}><QrCode size={22} /></div><div className="mt-1 text-[10px] font-bold truncate" style={{ color: S.text, fontFamily: "monospace" }}>FL{String(index + 1).padStart(2, "0")}</div><div className="text-[10px]" style={{ color: selected ? "#276749" : S.muted }}>{selected ? "已使用" : "未使用"}</div></button><label className="mt-1 flex items-center gap-1 cursor-pointer text-[9px]" title="上传群二维码"><Upload size={11} /><span className="truncate">{qrNames[index] || "上传二维码"}</span><input className="sr-only" type="file" accept="image/png,image/jpeg" onChange={event => setQrNames(current => current.map((name, slotIndex) => slotIndex === index ? (event.target.files?.[0]?.name || name) : name))} /></label></div>)}</div></section>
        {error && <div role="alert" className="px-3 py-2 text-xs" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: S.radiusSm }}>{error}</div>}
      </div>
      <div className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}><span className="text-[10px]" style={{ color: S.muted }}>项目、员工、地区、群类型必填；账号类型和微信群数可暂不设置</span><div className="flex gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>取消</button><button type="button" onClick={save} className="px-6 py-2.5 text-sm font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }}>确认分配</button></div></div>
    </div>
  </div>;
}

// ─── 企业微信数据 ─────────────────────────────────────────────
const wecomAccounts = [
  { id: 1, wecomId: "北京企微-吴思远", corpId: "ww_eco_bj", linkedPersonal: "wx_bj_01", admin: "吴思远", dept: "北京服务中心", members: 487, memberCapacity: 2000, groupCapacity: 20, groups: ["北京PRO企微群", "北京体验官企微群", "内部协作群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "北京", note: "负责北京所有PRO用户的企微添加和群管理" },
  { id: 2, wecomId: "上海企微-林小燕", corpId: "ww_eco_sh", linkedPersonal: "wx_sh_01", admin: "林小燕", dept: "上海服务中心", members: 356, memberCapacity: 2000, groupCapacity: 20, groups: ["上海PRO企微群", "上海体验官企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "上海", note: "负责上海用户的企微双微信管理" },
  { id: 3, wecomId: "广州企微-刘刚", corpId: "ww_eco_gz", linkedPersonal: "wx_gz_01", admin: "刘刚", dept: "广州服务中心", members: 234, memberCapacity: 2000, groupCapacity: 20, groups: ["广州代理企微群"], status: "异常", syncStatus: "同步失败", lastSync: "2026-06-05", city: "广州", note: "企微30天未登录，与个人微信同步失败" },
  { id: 4, wecomId: "深圳企微-李梦华", corpId: "ww_eco_sz", linkedPersonal: "wx_sz_01", admin: "李梦华", dept: "深圳服务中心", members: 310, memberCapacity: 2000, groupCapacity: 20, groups: ["深圳代理企微群", "深圳游客企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-04", city: "深圳", note: "" },
  { id: 5, wecomId: "杭州企微-陈明", corpId: "ww_eco_hz", linkedPersonal: "wx_hz_01", admin: "陈明", dept: "杭州服务中心", members: 140, memberCapacity: 2000, groupCapacity: 20, groups: ["杭州会员企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "杭州", note: "" },
];

function WecomBrowseList({ accounts, selected, onSelect, onQrCode, onTransfer }: { accounts: typeof wecomAccounts; selected: number | null; onSelect: (id: number | null) => void; onQrCode: (account: typeof wecomAccounts[number]) => void; onTransfer: (account: typeof wecomAccounts[number]) => void }) {
  const statusStyles: Record<string, { bg: string; color: string }> = {
    "使用中": { bg: "#f0fff4", color: "#276749" },
    "异常": { bg: "#fff0f0", color: "#c53030" },
    "待交接": { bg: "#fff7ed", color: "#c2410c" },
    "库存": { bg: "#f5f5f5", color: "#777" },
  };
  return (
    <div className="flex-1 min-h-0 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
      <div className="min-w-[1460px]">
        <div className="grid items-center px-4 py-2.5 text-xs font-semibold" style={{ gridTemplateColumns: "1.35fr .95fr 1fr .75fr 1.15fr 1.05fr .8fr .85fr .65fr .6fr 1fr", color: S.textSec, background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, fontFamily: "monospace" }}>
          <span>企业微信账号</span><span>绑定个人微信</span><span>项目 / 地区</span><span>服务负责人</span><span>成员数</span><span>群数</span><span>同步状态</span><span>最近同步</span><span>二维码</span><span>状态</span><span>操作</span>
        </div>
        {accounts.map(w => {
          const isSelected = selected === w.id;
          const status = statusStyles[w.status] || { bg: "#f5f5f5", color: "#888" };
          const sync = w.syncStatus === "已同步" ? { bg: "#f0fff4", color: "#276749" } : { bg: "#fff0f0", color: "#c53030" };
          const memberRate = Math.min(w.members / w.memberCapacity, 1);
          const groupRate = Math.min(w.groups.length / w.groupCapacity, 1);
          return (
            <div
              key={w.id}
              role="group"
              className="grid w-full items-center gap-2 px-4 py-3 text-left transition-colors cursor-pointer"
              style={{ gridTemplateColumns: "1.35fr .95fr 1fr .75fr 1.15fr 1.05fr .8fr .85fr .65fr .6fr 1fr", background: isSelected ? S.accentLight : S.surface, borderBottom: `1px solid ${S.border}`, borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent", fontFamily: "monospace" }}
              onClick={() => onSelect(isSelected ? null : w.id)}
            >
              <span className="flex items-center gap-2 min-w-0">
                <img src={getAvatar(w.id - 1)} alt="" style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} />
                <span className="min-w-0"><b className="block truncate text-xs" style={{ color: S.text }}>{w.wecomId}</b><small className="block truncate" style={{ color: S.muted, fontSize: "10px" }}>{w.corpId}</small></span>
              </span>
              <span className="min-w-0"><b className="block truncate text-xs" style={{ color: S.text }}>{w.linkedPersonal}</b><small className="block truncate" style={{ color: S.muted, fontSize: "10px" }}>关联添加成员</small></span>
              <span className="min-w-0"><b className="block truncate text-xs" style={{ color: S.textSec }}>{w.dept}</b><small style={{ color: S.muted, fontSize: "10px" }}>{w.city}</small></span>
              <span className="text-xs font-medium truncate" style={{ color: S.text }}>{w.admin}</span>
              <span className="min-w-0"><b className="block text-xs" style={{ color: memberRate >= 0.85 ? "#c2410c" : S.text }}>{w.members.toLocaleString()} / {w.memberCapacity.toLocaleString()}</b><span className="mt-1 block h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><span className="block h-full" style={{ width: `${Math.max(memberRate * 100, w.members ? 3 : 0)}%`, background: memberRate >= 0.85 ? "#f59e0b" : S.accent, borderRadius: 99 }} /></span></span>
              <span className="min-w-0"><b className="block text-xs" style={{ color: groupRate >= 0.8 ? "#c2410c" : S.text }}>{w.groups.length} / {w.groupCapacity} 群</b><span className="mt-1 block h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><span className="block h-full" style={{ width: `${Math.max(groupRate * 100, w.groups.length ? 3 : 0)}%`, background: groupRate >= 0.8 ? "#f59e0b" : S.accent, borderRadius: 99 }} /></span></span>
              <span className="justify-self-start px-2 py-0.5 text-xs font-medium" style={{ background: sync.bg, color: sync.color, borderRadius: S.radiusSm }}>{w.syncStatus}</span>
              <span className="text-xs whitespace-nowrap" style={{ color: S.muted }}>{w.lastSync}</span>
              <button type="button" title="查看二维码" aria-label={`${w.wecomId} 查看二维码`} className="w-7 h-7 flex items-center justify-center" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); onQrCode(w); }}><QrCode size={14} /></button>
              <span className="justify-self-start px-2 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm }}>{w.status}</span>
              <span className="flex items-center gap-1">
                <button type="button" className="px-2 py-1 text-xs whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); onSelect(w.id); }}>查看</button>
                <button type="button" className="px-2 py-1 text-xs font-bold whitespace-nowrap" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); onTransfer(w); }}>交接</button>
              </span>
            </div>
          );
        })}
        {!accounts.length && <div className="py-16 text-center text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配企业微信，请调整筛选条件</div>}
      </div>
    </div>
  );
}

function WecomQrModal({ account, onClose, onCopy }: { account: typeof wecomAccounts[number]; onClose: () => void; onCopy: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(17,17,17,0.38)" }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="wecom-qr-title" className="w-full max-w-[420px] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 18px 60px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div><div id="wecom-qr-title" className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>企业微信二维码</div><div className="mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.wecomId} · {account.city}</div></div>
          <button type="button" title="关闭二维码" aria-label="关闭二维码" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 p-3" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <img src={getAvatar(account.id - 1)} alt={account.admin} style={{ width: 36, height: 36, borderRadius: S.radiusSm, objectFit: "cover" }} />
            <div className="min-w-0"><div className="truncate text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{account.linkedPersonal}</div><div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>负责人：{account.admin}</div></div>
          </div>
          <div className="mx-auto my-5 grid h-52 w-52 place-items-center" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radius, color: S.text }}><QrCode size={126} strokeWidth={1.25} /></div>
          <div className="text-center text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>扫码添加企业微信成员 · 二维码每日自动刷新</div>
        </div>
        <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }} onClick={onCopy}><Copy size={13} />复制二维码链接</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }} onClick={onClose}>完成</button>
        </div>
      </div>
    </div>
  );
}

function WecomCreateModal({ onClose, onSave }: { onClose: () => void; onSave?: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState({ enterprise: "", wecomId: "", corpId: "", admin: "", department: "", city: "", linkedPersonal: "", note: "" });
  const [error, setError] = useState("");
  const inputStyle = { background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const set = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const field = (label: string, key: keyof typeof form, placeholder = "请输入", required = false) => (
    <label className="block">
      <span className="mb-1.5 block text-xs" style={{ color: S.muted }}>{label}{required ? " *" : ""}</span>
      <input disabled={!authorized} value={form[key]} onChange={event => set(key, event.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} />
    </label>
  );
  const authorize = () => {
    setAuthorized(true);
    setForm(current => ({ ...current, enterprise: "蜂乐玛科技有限公司", corpId: "ww_8fenglema", wecomId: "企业微信_北京01", admin: "吴思远", department: "北京服务中心", city: "北京" }));
  };
  const confirm = () => {
    if (!authorized) return;
    if (!form.enterprise.trim() || !form.wecomId.trim() || !form.admin.trim()) {
      setError("请补全企业主体、企业微信号和管理员后再入库");
      return;
    }
    onSave?.();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div role="dialog" aria-modal="true" aria-labelledby="wecom-create-title" className="w-[min(980px,calc(100vw-24px))] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
          <div><div id="wecom-create-title" className="font-semibold">新建企业微信</div><div className="mt-1 text-xs" style={{ color: S.muted }}>先扫码授权企业主体，再完善企业微信资料</div></div>
          <button type="button" title="关闭新建企业微信" aria-label="关闭新建企业微信" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[264px_minmax(0,1fr)]" style={{ maxHeight: "76vh" }}>
          <aside className="p-5 flex flex-col gap-4" style={{ background: "#fbfbfb", borderRight: `1px solid ${S.border}` }}>
            <div className="flex items-center justify-between"><span className="text-sm font-bold">企业微信扫码授权</span><span className="px-2 py-1 text-[10px] font-bold" style={{ background: authorized ? S.accentLight : "#fff8e8", color: authorized ? "#276749" : "#9a5a00", borderRadius: S.radiusSm }}>{authorized ? "已授权" : "待扫码"}</span></div>
            <div className="p-5 flex items-center justify-center" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}><div className="grid place-items-center" style={{ width: 190, height: 190, background: "#fafafa", border: `8px solid ${authorized ? S.accent : "#111"}`, color: "#111" }}><QrCode size={132} strokeWidth={1.2} /></div></div>
            <div className="text-center"><div className="text-xs font-bold">{authorized ? "授权成功，可继续填写" : "企业管理员微信扫码"}</div><div className="mt-1 text-[10px] leading-relaxed" style={{ color: S.muted }}>使用企业微信管理员扫码，系统读取企业主体、管理员和组织信息。</div></div>
            <div className="p-3 space-y-2" style={{ background: authorized ? S.accentLight : "#fff8e8", border: `1px solid ${authorized ? S.accentMid : "#f2d6a0"}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold" style={{ color: authorized ? "#276749" : "#9a5a00" }}>{authorized ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}{authorized ? "企业身份已确认" : "授权前不会写入账号"}</div><div className="text-[10px] leading-relaxed" style={{ color: S.muted }}>扫码只用于本次授权，账号密码不会被保存。</div></div>
            <button type="button" className="w-full py-2.5 text-xs font-bold" style={{ background: authorized ? S.surface : "#0d0d0d", color: authorized ? S.textSec : S.accent, border: authorized ? `1px solid ${S.borderMed}` : "none", borderRadius: S.radius }} onClick={() => authorized ? setAuthorized(false) : authorize()}>{authorized ? "重新扫码授权" : "确认已扫码授权"}</button>
          </aside>
          <div className="min-w-0 overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between px-3 py-2" style={{ background: authorized ? S.accentLight : "#f5f5f5", border: `1px solid ${authorized ? S.accentMid : S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold">{authorized ? <CheckCircle2 size={14} style={{ color: "#276749" }} /> : <LockKeyhole size={14} style={{ color: S.muted }} />}{authorized ? "企业资料已获取，请继续完善表单" : "完成扫码授权后解锁表单"}</div><span className="text-[10px]" style={{ color: S.muted }}>必填项标记 *</span></div>
            <section className="space-y-3"><div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />企业微信信息</div><span className="text-[10px]" style={{ color: S.muted }}>授权字段可修改</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field("企业主体", "enterprise", "授权后自动获取", true)}{field("企业微信号", "wecomId", "授权后自动获取", true)}{field("企业主体 ID", "corpId", "授权后自动获取")}{field("管理员", "admin", "已启用的企业管理员", true)}</div></section>
            <section className="space-y-3"><div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />归属与运营信息</div><span className="text-[10px]" style={{ color: S.muted }}>可后续调整</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field("所属部门", "department", "例如：北京服务中心")}{field("运营城市", "city", "例如：北京")}{field("关联个人微信", "linkedPersonal", "可选，授权后绑定")}</div><label className="block"><span className="mb-1.5 block text-xs" style={{ color: S.muted }}>备注</span><textarea disabled={!authorized} value={form.note} onChange={event => set("note", event.target.value)} rows={3} placeholder="补充企业微信用途或运营说明" className="w-full resize-none px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} /></label></section>
            {error && <div className="px-3 py-2 text-xs" role="alert" style={{ color: "#c2410c", background: "#fff8e8", border: "1px solid #f2d6a0", borderRadius: S.radiusSm }}>{error}</div>}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ borderTop: `1px solid ${S.border}` }}><span className="text-[10px]" style={{ color: S.muted }}>{authorized ? "确认后企业微信进入注册入库，可在后续分配项目" : "请先完成企业微信扫码授权"}</span><div className="flex gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>取消</button><button type="button" disabled={!authorized} onClick={confirm} className="px-6 py-2.5 text-sm font-bold disabled:cursor-not-allowed" style={{ background: authorized ? "#0d0d0d" : "#ddd", color: authorized ? S.accent : "#888", borderRadius: S.radius }}>确认入库</button></div></div>
      </div>
    </div>
  );
}

function WecomTransferModal({ account, onClose, onSubmit }: { account: typeof wecomAccounts[number]; onClose: () => void; onSubmit: (receiver: string) => void }) {
  const [receiver, setReceiver] = useState("");
  const [reason, setReason] = useState("");
  const receivers = ["林小燕", "李梦华", "陈明", "王芳", "张磊"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(17,17,17,0.38)" }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="wecom-transfer-title" className="w-full max-w-[460px] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 18px 60px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div><div id="wecom-transfer-title" className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>发起企业微信交接</div><div className="mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.wecomId} · 当前负责人 {account.admin}</div></div>
          <button type="button" title="关闭交接" aria-label="关闭交接" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-2">
            {[['绑定个微', account.linkedPersonal], ['运营范围', `${account.city} · ${account.dept}`], ['成员数', `${account.members.toLocaleString()} / ${account.memberCapacity.toLocaleString()}`], ['群数', `${account.groups.length} / ${account.groupCapacity} 群`]].map(([label, value]) => <div key={label} className="px-3 py-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-1 truncate text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}
          </div>
          <label className="block"><span className="mb-1.5 block text-xs font-medium" style={{ color: S.textSec, fontFamily: "monospace" }}>接手负责人</span><select className="w-full px-3 py-2 text-xs outline-none" value={receiver} onChange={event => setReceiver(event.target.value)} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: receiver ? S.text : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}><option value="">请选择接手人</option>{receivers.filter(name => name !== account.admin).map(name => <option key={name}>{name}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-xs font-medium" style={{ color: S.textSec, fontFamily: "monospace" }}>交接说明 <span style={{ color: S.muted }}>（可选）</span></span><textarea className="w-full resize-none px-3 py-2 text-xs outline-none" rows={3} placeholder="例如：人员调岗，完成客户和群组权限交接" value={reason} onChange={event => setReason(event.target.value)} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} /></label>
        </div>
        <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-medium" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }} onClick={onClose}>取消</button><button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!receiver} style={{ background: receiver ? "#0d0d0d" : "#e8e8e8", color: receiver ? S.accent : S.muted, borderRadius: S.radius }} onClick={() => onSubmit(receiver)}>创建交接单</button></div>
      </div>
    </div>
  );
}

function PersonalWechatCards({ accounts, selectedRow, onSelect }: { accounts: typeof mockWechats; selectedRow: string | null; onSelect: (id: string | null) => void }) {
  if (!accounts.length) {
    return <div className="flex-1 grid place-items-center" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配数据</div>;
  }
  return (
    <div className="flex-1 overflow-auto pr-1">
      <div className="grid grid-cols-3 gap-3 content-start pb-2">
        {accounts.map(w => {
          const status = statusCfg[w.status] || { bg: "#f5f5f5", color: "#888" };
          const isSelected = selectedRow === w.no;
          const isStock = w.status === "未使用";
          const selBg = status.bg === "#f0fff4" ? "#dcfce7" : status.bg === "#fff0f0" ? "#fee2e2" : status.bg === "#fffbeb" ? "#fef3c7" : status.bg === "#f5f5f5" ? "#e9e9e9" : S.accentLight;
          return (
            <button
              key={w.no}
              type="button"
              onClick={() => onSelect(isSelected ? null : w.no)}
              className="p-4 text-left transition-all"
              style={{ background: isSelected ? selBg : S.surface, border: isSelected ? `2px solid ${S.accent}` : `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: isSelected ? "0 4px 16px rgba(13,13,13,0.08)" : "0 1px 4px rgba(0,0,0,0.05)", fontWeight: isSelected ? 600 : 500 }}
            >
              <div className="flex items-start gap-3">
                {isStock ? <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#f0f0ec", color: S.muted, borderRadius: S.radiusSm }}><MessageCircle size={16} /></div> : <img src={getAvatar(parseInt(w.no) - 1)} alt={w.nickname} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover" }} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5"><b className="truncate text-sm" style={{ color: S.text, fontFamily: "monospace" }}>{isStock ? "备用微信号" : w.nickname}</b><span className="px-1.5 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{w.status}</span></div>
                  <div className="mt-0.5 truncate text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{w.wechatId} · {w.city}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[["好友", isStock ? "—" : `${w.friendCount}/2000`], ["管理群", isStock ? "—" : `${w.groupCount} 个`], ["扫码", isStock ? "—" : w.scanCount]].map(([label, value]) => <div key={label as string} className="px-2 py-1.5 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><b className="block text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{value}</b><small style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>{label}</small></div>)}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 pt-2.5" style={{ borderTop: `1px solid ${S.border}` }}>
                <span className="truncate text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{isStock ? "待分配项目与服务人员" : w.targetGroup}</span>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: S.muted, fontFamily: "monospace" }}>{w.opsManager}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 容量/进度 四级色彩：<60%绿 / 60–85%琥珀 / 85–95%橙 / ≥95%红
function tierColor(rate: number): { text: string; bar: string } {
  const r = Math.max(0, Math.min(1, rate));
  if (r >= 0.95) return { text: "#b91c1c", bar: "#dc2626" };
  if (r >= 0.85) return { text: "#c2410c", bar: "#ea580c" };
  if (r >= 0.6) return { text: "#b45309", bar: "#d97706" };
  return { text: "#166534", bar: "#51b86a" };
}

function CapacitySummary({ primaryLabel, groupLabel, primaryValue, primaryMax, primaryWarning, groupValue, groupMax, groupWarning }: {
  primaryLabel: string; groupLabel: string; primaryValue: number; primaryMax: number; primaryWarning: boolean;
  groupValue: number; groupMax: number; groupWarning: boolean;
}) {
  const metrics = [
    { label: primaryLabel, value: primaryValue, max: primaryMax, warning: primaryWarning },
    { label: groupLabel, value: groupValue, max: groupMax, warning: groupWarning },
  ];
  return <div className="grid grid-cols-2 gap-3">
    {metrics.map(metric => {
      const rate = Math.min(1, metric.value / Math.max(1, metric.max));
      const col = tierColor(rate);
      const pct = Math.round(rate * 100);
      return <div key={metric.label} className="min-w-0">
        {/* 仅 1 行：圆点·标签·value/max 左对齐，百分比右对齐 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span style={{ width: 8, height: 8, borderRadius: 99, background: col.bar, flexShrink: 0 }} />
            <span className="text-[11px] truncate" style={{ color: S.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>{metric.label}</span>
            <span className="text-[11px] font-semibold truncate" style={{ color: col.text, fontFamily: "monospace", whiteSpace: "nowrap" }}>{metric.value.toLocaleString()}<span className="text-[10px] font-medium mx-0.5" style={{ color: S.muted }}>/</span>{metric.max.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-semibold flex-shrink-0 ml-1" style={{ color: col.text, fontFamily: "monospace" }}>{pct}%</span>
        </div>
        {/* 细进度条 高 2px，不单独占视觉高度 */}
        <div className="mt-1 h-[2px] rounded-full overflow-hidden" style={{ background: S.borderMed }}><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: col.bar }} /></div>
      </div>;
    })}
  </div>;
}

function DetailInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        className="w-full px-2.5 py-2 text-xs outline-none"
        style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, fontFamily: "monospace" }}
      />
    </label>
  );
}

function PersonalWechatDetail({ account, onClose, onAction, onUpdate, startEditing = false }: { account: PersonalAccount; onClose: () => void; onAction: (message: string) => void; onUpdate?: (no: string, patch: Partial<PersonalAccount>) => void; startEditing?: boolean }) {
  const risk = getAccountRisk(account);
  const isStock = account.status === "未使用";
  const status = statusCfg[account.status] || { bg: "#f5f5f5", color: "#888" };
  const lifecycle = lifecycleCfg[account.lifecycleStage];
  const syncStatus = risk.isSyncRisk ? "需核查" : account.status === "未使用" ? "未启用" : "同步正常";
  const syncStyle = risk.isSyncRisk ? { bg: "#fff7ed", color: "#c2410c" } : account.status === "未使用" ? { bg: "#f5f5f5", color: "#777" } : { bg: "#f0fff4", color: "#276749" };
  // P2-② 详情宽度可拖拽（范围 300–620，默认 360）
  const [width, setWidth] = useState<number>(() => {
    try { const v = Number(localStorage.getItem("pw_detail_w") || "360"); return Number.isFinite(v) && v >= 300 ? Math.min(620, v) : 360; } catch { return 360; }
  });
  const widthDragRef = useRef<{ x: number; start: number } | null>(null);
  const persistWidth = (next: number) => {
    const clamped = Math.max(300, Math.min(620, next));
    setWidth(clamped);
    try { localStorage.setItem("pw_detail_w", String(clamped)); } catch {}
  };
  const ed: EventListenerOrEventListenerObject = useCallback((e) => {
    const ev = e as MouseEvent;
    if (!widthDragRef.current) return;
    const dx = ev.clientX - widthDragRef.current.x;
    persistWidth(widthDragRef.current.start + dx); // 左侧手柄向左拖 = 缩小，向右 = 增大（和右侧手柄一致），但因为我们放在 aside 左边缘且 aside 是右对齐，所以 dx 直接加 start 就是新宽度
  }, []);
  const eu: EventListenerOrEventListenerObject = useCallback(() => {
    widthDragRef.current = null;
    window.removeEventListener("mousemove", ed);
    window.removeEventListener("mouseup", eu);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [ed]);
  const onWidthDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    widthDragRef.current = { x: e.clientX, start: width };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", ed);
    window.addEventListener("mouseup", eu);
  };
  const [editing, setEditing] = useState(startEditing);
  const [detailTab, setDetailTab] = useState<"profile" | "binding" | "operations" | "security">("profile");
  const [securityDraft, setSecurityDraft] = useState({ loginAlert: true, twoFactor: true, recoveryEmail: account.boundEmail === "—" ? "" : account.boundEmail });
  const [showPassword, setShowPassword] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [saved, setSaved] = useState({ project: account.project, city: account.city, opsManager: account.opsManager, memberManager: account.memberManager, targetGroup: account.targetGroup, nickname: account.nickname, gender: account.gender, phone: account.phone, qqNo: account.qqNo, boundEmail: account.boundEmail, accountType: account.accountType, region: account.region, department: account.department, serviceOfficer: account.serviceOfficer });
  const [draft, setDraft] = useState(saved);
  const [editError, setEditError] = useState("");
  const [qrMenuOpen, setQrMenuOpen] = useState(false);
  const qrMenuRef = useRef<HTMLDivElement | null>(null);
  const [securityExpanded, setSecurityExpanded] = useState(false);
  useEffect(() => {
    if (!qrMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (qrMenuRef.current && !(e.target instanceof Node && qrMenuRef.current.contains(e.target))) setQrMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [qrMenuOpen]);
  const lastSync = timeAgo(account.lastLogin);
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const cancelEdit = () => { setDraft(saved); setEditError(""); setEditing(false); };
  const saveEdit = () => {
    if (!isStock && (!draft.project.trim() || !draft.city.trim() || !draft.opsManager.trim())) {
      setEditError("使用中的账号请补全归属项目、城市和运营负责人");
      return;
    }
    setSaved(draft);
    onUpdate?.(account.no, draft);
    setEditError("");
    setEditing(false);
    onAction(`${account.wechatId} 的调度资料已保存`);
  };
  const saveSecurity = () => {
    setSecuritySaved(true);
    onAction(`${account.wechatId} 的个人安全设置已保存`);
    window.setTimeout(() => setSecuritySaved(false), 2800);
  };

  return (
    <aside className="flex-shrink-0 flex flex-row overflow-hidden" style={{ width, background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="个人微信详情">
      {/* P2-② 详情左边缘拖拽手柄条（5px 透明条，悬停显示主题色） */}
      <div onMouseDown={onWidthDragStart} title="左右拖动调整详情宽度（300–620）" style={{ width: 5, cursor: "col-resize", flexShrink: 0, background: S.border, borderRight: `1px solid ${S.borderMed}`, borderRadius: `${S.radiusLg} 0 0 ${S.radiusLg}` }} onMouseEnter={e => (e.currentTarget.style.background = S.accent)} onMouseLeave={e => (e.currentTarget.style.background = S.border)} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表账号后查看与调度</div>
        </div>
        <button type="button" title="关闭详情" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }} onClick={onClose}><X size={14} /></button>
      </div>
      <div className="px-4 pt-3 flex gap-1 flex-shrink-0" role="tablist" aria-label="个人微信详情标签">
        {[["profile", "账号资料"], ["binding", "绑定分配"], ["operations", "运营数据"], ["security", "个人安全"]].map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={detailTab === key} onClick={() => setDetailTab(key as "profile" | "binding" | "operations" | "security")} className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold" style={{ background: detailTab === key ? S.primary : S.surface, color: detailTab === key ? "#ffffff" : S.textSec, border: `1px solid ${detailTab === key ? S.primary : S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
            {key === "security" ? <ShieldCheck size={12} /> : key === "binding" ? <Link size={12} /> : key === "operations" ? <History size={12} /> : <MessageCircle size={12} />}{label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          {isStock ? <div className="w-12 h-12 grid place-items-center" style={{ background: "#f0f0ec", borderRadius: S.radiusSm, color: S.muted }}><MessageCircle size={18} /></div> : <img src={getAvatar(parseInt(account.no) - 1)} alt={account.nickname} style={{ width: 48, height: 48, borderRadius: S.radiusSm, objectFit: "cover" }} />}
          {/* 发放到人 生命周期标签已去掉（避免和使用中状态胶囊重复） */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap"><b className="text-sm truncate" style={{ color: S.text, fontFamily: "monospace" }}>{isStock ? "备用微信号" : account.nickname}</b><span className="px-1.5 py-0.5 text-xs" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{account.status}</span></div>
            <div className="mt-1 text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{account.wechatId}</div>
            {/* 序号 + 手机号 / 微信号 一行完整显示（不换行） */}
            <div className="mt-0.5 text-xs truncate whitespace-nowrap" style={{ color: S.muted, fontFamily: "monospace", letterSpacing: "-0.01em" }}>{account.no} · {account.phone} · {account.wechatId}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {/* 同步正常/同步异常文字不要，仅显示 6px 状态色小圆点 + 同步按钮 + QrCode + 更多 */}
            <div className="flex items-center gap-1 flex-wrap justify-end"><span title={`同步状态：${syncStatus}`} className="inline-flex items-center justify-center w-6 h-6" style={{ borderRadius: S.radiusSm, background: S.surface, border: `1px solid ${S.borderMed}` }}><span style={{ width: 6, height: 6, borderRadius: 99, background: syncStyle.color }} /></span><button type="button" title="立即同步账号与群数据" className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold transition-colors" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 已发起同步任务，请等待系统完成更新`)}><RefreshCw size={11} />同步</button><button type="button" title="查看二维码" className="w-7 h-7 grid place-items-center" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => onAction(`${account.wechatId} 的二维码查看入口已打开`)}><QrCode size={13} /></button><div className="relative" ref={qrMenuRef}><button type="button" title="二维码操作" aria-haspopup="menu" aria-expanded={qrMenuOpen} className="w-7 h-7 grid place-items-center" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} onClick={() => setQrMenuOpen(o => !o)}><MoreHorizontal size={13} /></button>{qrMenuOpen && createPortal(<div role="menu" className="absolute z-50 w-40 p-1 shadow-lg" style={{ right: 0, top: 32, background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>{[isStock ? { label: "上传微信号二维码", icon: QrCode, msg: `${account.wechatId} 已进入二维码上传流程` } : { label: "查看二维码", icon: Eye, msg: `${account.wechatId} 的二维码查看入口已打开` }, isStock ? { label: "从相册重新上传", icon: Upload, msg: `${account.wechatId} 已进入重新上传流程` } : { label: "重新同步群二维码", icon: RefreshCw, msg: `${account.wechatId} 的群二维码同步任务已创建` }, { label: "下载二维码图", icon: Download, msg: `${account.wechatId} 的二维码图下载已开始` }].map(item => <button key={item.label} role="menuitem" type="button" className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-left hover:brightness-[0.98]" style={{ background: "transparent", color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => { setQrMenuOpen(false); onAction(item.msg); }}><item.icon size={12} />{item.label}</button>)}</div>, qrMenuRef.current || document.body)}</div></div>
            <div className="text-[10px]" title={`绝对时间：${lastSync.abs}（今日 2026-08-30 10:00 计）`} style={{ color: S.muted, fontFamily: "monospace" }}>最近同步：{lastSync.rel}</div>
          </div>
        </div>


        {detailTab === "profile" && false && (risk.isRisk || account.status === "待交接") && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {account.status === "待交接" ? "账号待交接，请先指定接手服务人员。" : risk.isSyncRisk ? "账号近期未同步，请核查登录与企微绑定。" : "账号容量接近上限，建议优先停止分配新用户或新群。"}
            </div>
          </div>
        )}

        {/* 归属与调度卡：浅灰底，6项3列，去掉accentLight蓝底 */}
        {detailTab === "profile" && <div className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-1.5 mb-2"><Briefcase size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>归属与调度</div></div><div className="grid grid-cols-3 gap-2">{[["归属项目", saved.project], ["归属员工", saved.opsManager], ["账号类型", saved.accountType], ["归属大区", saved.region || "—"], ["归属部门", saved.department || "—"], ["服务官", saved.serviceOfficer]].map(([label, value]) => <div key={label}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value || "—"}</div></div>)}</div></div>}

        {/* 容量与活跃卡：四色进度条 + 下方补充活跃数据 */}
        {detailTab === "profile" && <div className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center gap-1.5"><Activity size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>容量与活跃</div></div>
          <CapacitySummary primaryLabel="好友数" groupLabel="群数" primaryValue={account.friendCount} primaryMax={2000} primaryWarning={risk.isFriendRisk} groupValue={account.groupCount} groupMax={20} groupWarning={risk.isGroupRisk} />
          <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: `1px solid ${S.border}` }}>{[["正常活粉", account.normalFans], ["扫码次数", account.scanCount], ["推送次数", account.invitedNew]].map(([label, value]) => <div key={label}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}</div>
        </div>}

        {/* 编辑态：归属与调度字段集中编辑 */}
        {detailTab === "profile" && (editing ? (
          <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>编辑调度资料</div>
            {isStock && <div className="px-2.5 py-2 text-[10px] leading-relaxed" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, color: S.muted, borderRadius: S.radiusSm }}>未使用养号阶段可暂不设置项目、账号类型、城市和负责人；领用时再补全。</div>}
            <DetailInput label="微信昵称" value={draft.nickname} onChange={value => updateDraft("nickname", value)} />
            <DetailInput label="归属项目" value={draft.project} onChange={value => updateDraft("project", value)} />
            <label className="block"><span className="block mb-1.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>账号类型</span><select className="w-full px-2.5 py-2 text-xs outline-none" value={draft.accountType} onChange={event => updateDraft("accountType", event.target.value)} style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, fontFamily: "monospace" }}><option value="待配置">待配置</option><option value="客服号">客服号</option><option value="招商号">招商号</option><option value="运营号">运营号</option></select></label>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="城市" value={draft.city} onChange={value => updateDraft("city", value)} /><DetailInput label="运营负责人" value={draft.opsManager} onChange={value => updateDraft("opsManager", value)} /></div>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="会员负责人" value={draft.memberManager} onChange={value => updateDraft("memberManager", value)} /><DetailInput label="目标群" value={draft.targetGroup} onChange={value => updateDraft("targetGroup", value)} /></div>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="绑定手机" value={draft.phone} onChange={value => updateDraft("phone", value)} /><DetailInput label="QQ号" value={draft.qqNo} onChange={value => updateDraft("qqNo", value)} /></div>
            <DetailInput label="绑定邮箱" value={draft.boundEmail} onChange={value => updateDraft("boundEmail", value)} />
            {editError && <div className="text-xs" role="alert" style={{ color: "#c2410c", fontFamily: "monospace" }}>{editError}</div>}
          </div>
        ) : (
          <>
          {/* 账号身份卡：微信昵称/二维码缩略图/认证状态/性别，删除微信号（头像卡有） */}
          <div className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-1.5 mb-2"><MessageCircle size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>账号身份</div></div>
            <div className="flex items-start gap-3">
              <button type="button" title={account.wechatQrName || "查看二维码"} className="w-12 h-12 grid place-items-center flex-shrink-0" style={{ background: S.surface, border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm, color: S.muted }} onClick={() => onAction(isStock ? `${account.wechatId} 已进入二维码上传流程` : `${account.wechatId} 的二维码查看入口已打开`)}><QrCode size={20} /></button>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 flex-1 min-w-0">
                {[["微信昵称", saved.nickname], ["性别", saved.gender], ["认证状态", account.certified ? "已认证" : "未认证"], ["微信二维码", account.wechatQrName || "待上传"]].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>
                    <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 联系方式卡：绑定手机/QQ号/绑定邮箱/紧急联系人 */}
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-1.5 mb-2"><Phone size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>联系方式</div></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {[["绑定手机", saved.phone, !!saved.phone && saved.phone !== "—"], ["QQ号", saved.qqNo, !!saved.qqNo && saved.qqNo !== "—"], ["绑定邮箱", saved.boundEmail, !!saved.boundEmail && saved.boundEmail !== "—"], ["紧急联系人", `${account.emergencyContacts.length} 位`, account.emergencyContacts.length > 0]].map(([label, value, bound]) => (
                <div key={label} className="min-w-0">
                  <div className="flex items-center gap-1"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>{bound ? <Check size={10} style={{ color: S.success }} /> : <span className="text-[9px]" style={{ color: S.muted }}>未绑定</span>}</div>
                  <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 安全凭证折叠区：默认折叠，点击展开（敏感字段脱敏，详细编辑在security Tab） */}
          <div className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <button type="button" className="w-full flex items-center justify-between" onClick={() => setSecurityExpanded(v => !v)}>
              <div className="flex items-center gap-1.5"><LockKeyhole size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>安全与凭证</div></div>
              <div className="flex items-center gap-2"><span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>已脱敏 · 点击展开</span><ChevronDown size={12} style={{ color: S.muted, transition: "transform 0.2s", transform: securityExpanded ? "rotate(180deg)" : "none" }} /></div>
            </button>
            {securityExpanded && <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-3 pt-3" style={{ borderTop: `1px solid ${S.border}` }}>{[["身份证号", account.idCard], ["银行卡号", account.bankCard], ["支付密码", account.paymentPassword], ["QQ密码", account.qqPassword], ["QQ密保", account.qqSecurity], ["邮箱密码", account.emailPassword], ["邮箱密保", account.emailSecurity]].map(([label, value]) => <div key={label} className="min-w-0"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value ? (label.includes("密码") ? "••••••••" : value) : "未配置"}</div></div>)}</div>}
          </div>
          </>
        ))}

        {detailTab === "binding" && <div className="space-y-3">
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>微信群绑定与二维码</div><div className="flex items-center gap-2"><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.groupCount} 个已使用 / {Math.max(20, account.groupQrNames.length)} 个群位</span><button type="button" className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的绑定配置入口已打开`)}>打开绑定配置</button></div></div><div className="grid grid-cols-2 gap-2">{Array.from({ length: Math.max(20, account.groupQrNames.length) }, (_, index) => { const bound = index < account.groupCount; const qrName = account.groupQrNames[index]; return <button key={index} type="button" className="p-2 text-left" style={{ background: bound ? S.accentLight : S.bg, border: `1px ${bound ? "solid" : "dashed"} ${bound ? S.accentMid : S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => onAction(bound ? `${account.wechatId} 的第 ${index + 1} 个群绑定编辑入口已打开` : `${account.wechatId} 的第 ${index + 1} 个群位可绑定`)}><div className="flex items-center gap-1.5"><QrCode size={12} /><span className="text-[10px] font-bold" style={{ color: bound ? S.text : S.muted, fontFamily: "monospace" }}>{bound ? `${account.city}运营群${String(index + 1).padStart(2, "0")}` : `空群位 ${String(index + 1).padStart(2, "0")}`}</span></div><div className="text-[9px] mt-1 truncate" title={qrName} style={{ color: S.muted, fontFamily: "monospace" }}>{bound ? (qrName || "待补充群二维码") : "点击绑定群二维码"}</div></button>; })}</div></div>
        </div>}

        {detailTab === "operations" && <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">{[["微信号人数", account.friendCount], ["正常活粉", account.normalFans], ["拉黑人数", account.blockedCount], ["删除人数", account.deletedCount], ["扫码次数", account.scanCount], ["推送次数", account.invitedNew], ["归属群数", account.groupCount], ["容量占用", `${Math.round((account.friendCount / 2000) * 100)}%`]].map(([label, value]) => <div key={label} className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-1 text-lg font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}</div>
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>运营状态</div><div className="flex items-center justify-between text-xs py-2" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}><span style={{ color: S.muted }}>同步状态</span><span style={{ color: risk.isSyncRisk ? "#c2410c" : "#276749" }}>{syncStatus}</span></div><div className="flex items-center justify-between text-xs py-2" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}><span style={{ color: S.muted }}>最近活跃</span><span style={{ color: S.textSec }}>{account.lastLogin}</span></div><div className="flex items-center justify-between text-xs py-2" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}><span style={{ color: S.muted }}>认证状态</span><span style={{ color: account.certified ? "#276749" : "#c2410c" }}>{account.certified ? "已认证" : "未认证"}</span></div></div>
        </div>}

        {detailTab === "security" && <div className="space-y-3">
          <div className="p-3 flex items-center gap-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}>
            <div className="w-9 h-9 grid place-items-center" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}><ShieldCheck size={18} /></div>
            <div className="min-w-0"><div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>安全状态良好</div><div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>最近检查：2026-07-05 09:12</div></div>
            <span className="ml-auto text-xs font-bold" style={{ color: "#276749", fontFamily: "monospace" }}>86 / 100</span>
          </div>
          <div className="p-3 space-y-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}><LockKeyhole size={13} />敏感绑定资料</div>
            <div className="grid grid-cols-2 gap-2">{[["身份证号", account.idCard], ["银行卡号", account.bankCard], ["支付密码", account.paymentPassword], ["QQ密码", account.qqPassword], ["QQ密保", account.qqSecurity], ["邮箱密码", account.emailPassword], ["邮箱密保", account.emailSecurity]].map(([label, value]) => <div key={label} className="min-w-0"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value ? (label.includes("密码") ? "••••••••" : value) : "未配置"}</div></div>)}</div>
            <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>敏感字段默认脱敏，需授权后查看并记录审计日志</div>
          </div>
          <div className="p-3 space-y-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}><Users size={13} />紧急联系人（3位微信联系人）</div><span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>最多 3 位</span></div>
            {account.emergencyContacts.map((contact, index) => <div key={index} className="flex items-center gap-2 py-2" style={{ borderTop: `1px solid ${S.border}` }}><div className="w-7 h-7 overflow-hidden grid place-items-center" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.muted }}>{contact.wechatId ? <img src={getAvatar(contact.avatarIndex)} alt={contact.name} className="w-full h-full object-cover" /> : <QrCode size={13} />}</div><div className="min-w-0 flex-1"><div className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{contact.name}</div><div className="text-[10px] truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{contact.phone || contact.note}{contact.wechatId ? ` · ${contact.wechatId}` : ""}</div></div><button type="button" className="px-2 py-1 text-[10px]" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的紧急联系人 ${index + 1} 编辑入口已打开`)}>编辑</button></div>)}
          </div>
          <div className="p-3 space-y-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}><LockKeyhole size={14} />登录凭证</div>
            <div className="flex items-center justify-between gap-2"><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>微信密码</span><span className="text-xs font-medium" style={{ color: S.textSec, fontFamily: "monospace" }}>{showPassword ? "Eco@2026" : "••••••••"}</span><button type="button" title={showPassword ? "隐藏密码" : "显示密码"} aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword(value => !value)} style={{ color: S.muted }}>{showPassword ? <EyeOff size={13} /> : <Eye size={13} />}</button><button type="button" className="px-2 py-1 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的密码更新流程已打开`)}>更新</button></div>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="绑定手机" value={account.phone} onChange={() => {}} /><DetailInput label="安全邮箱" value={securityDraft.recoveryEmail} placeholder="未配置" onChange={value => setSecurityDraft(current => ({ ...current, recoveryEmail: value }))} /></div>
          </div>
          <div className="p-3 space-y-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: S.text, fontFamily: "monospace" }}><ShieldCheck size={14} />登录保护</div>
            <label className="flex items-center justify-between py-2 text-xs cursor-pointer" style={{ color: S.textSec, fontFamily: "monospace" }}><span>异常登录提醒</span><input type="checkbox" checked={securityDraft.loginAlert} onChange={event => setSecurityDraft(current => ({ ...current, loginAlert: event.target.checked }))} /></label>
            <label className="flex items-center justify-between py-2 text-xs cursor-pointer" style={{ color: S.textSec, fontFamily: "monospace" }}><span>双重验证</span><input type="checkbox" checked={securityDraft.twoFactor} onChange={event => setSecurityDraft(current => ({ ...current, twoFactor: event.target.checked }))} /></label>
          </div>
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}><History size={14} />最近安全记录</div>
            {["07-05 09:12  ·  北京  ·  Safari 登录", "07-02 18:44  ·  管理台  ·  更新二维码", "06-28 10:06  ·  管理台  ·  发起交接"].map(item => <div key={item} className="flex items-center gap-2 py-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace", borderTop: `1px solid ${S.border}` }}><CheckCircle2 size={12} style={{ color: "#276749" }} />{item}</div>)}
          </div>
          {securitySaved && <div role="status" className="px-3 py-2 text-xs" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>个人安全设置已保存</div>}
        </div>}
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
        {detailTab === "security" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setSecurityDraft({ loginAlert: true, twoFactor: true, recoveryEmail: account.boundEmail === "—" ? "" : account.boundEmail })}>重置</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveSecurity}>保存安全设置</button></> : detailTab === "binding" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的绑定校验已通过`)}>校验绑定</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的群绑定配置已保存`)}>保存绑定</button></> : detailTab === "operations" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的运营数据导出任务已创建`)}>导出数据</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的交接单已创建`)}>发起交接</button></> : editing ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={cancelEdit}>取消</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveEdit}>保存修改</button></> : <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEditing(true)}><Edit3 size={13} className="inline mr-1" />编辑</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的交接单已创建`)}>发起交接</button></>}
      </div>
      </div>{/* flex-1 wrapper div 闭合 */}
    </aside>
  );
}

function WechatPreviewModal({ account, onClose }: { account: PersonalAccount; onClose: () => void }) {
  const isUnused = account.status === "未使用";
  const avatarIndex = Math.max(0, Number(account.no) - 1);
  const mask = (value: string | undefined, fallback = "未配置") => value ? "••••••••" : fallback;
  const display = (value: string | undefined, fallback = "未配置") => value && value !== "—" ? value : fallback;
  const totalSlots = Math.max(20, account.groupCount, account.groupQrNames.length);
  const groupRows = Array.from({ length: totalSlots }, (_, index) => {
    const bound = index < account.groupCount;
    const sequence = String(index + 1).padStart(2, "0");
    const groupNo = `FL${sequence}`;
    const groupBase = account.targetGroup === "—" ? `${display(account.city, "待配置")}${display(account.groupType, "会员")}群` : account.targetGroup.replace(/\d+$/, "");
    const groupName = bound ? `${groupBase}${sequence}` : "待配置群";
    return {
      bound,
      groupNo,
      groupName,
      city: bound ? display(account.city) : "暂无",
      qr: account.groupQrNames[index],
      available: bound ? Math.max(0, 90 - index * 3) : 0,
      assigned: bound ? Math.max(0, 56 - index * 2) : 0,
      joined: bound ? Math.max(0, 24 - index) : 0,
      unjoined: bound ? Math.max(0, 32 - index) : 0,
      scanned: bound ? Math.max(0, 10 - index) : 0,
    };
  });
  const infoItems = [
    ["微信昵称", display(account.nickname, "待获取")],
    ["微信号", display(account.wechatId, "待填写")],
    ["微信密码", mask(account.wechatPassword)],
    ["微信二维码", display(account.wechatQrName)],
    ["绑定人姓名", display(account.opsManager)],
    ["绑定人手机", display(account.phone)],
    ["身份证号", display(account.idCard)],
    ["身份证正面", account.idCardFront ? "已上传" : "未上传"],
    ["身份证反面", account.idCardBack ? "已上传" : "未上传"],
    ["银行卡号", display(account.bankCard)],
    ["支付密码", mask(account.paymentPassword)],
    ["绑定QQ", display(account.qqNo)],
    ["QQ密码", mask(account.qqPassword)],
    ["QQ密保", display(account.qqSecurity)],
    ["绑定邮箱", display(account.boundEmail)],
    ["邮箱密码", mask(account.emailPassword)],
    ["邮箱密保", display(account.emailSecurity)],
    ["微信号类型", display(account.accountType)],
    ["归属项目", display(account.project)],
    ["所属员工", display(account.opsManager)],
    ["归属大区", display(account.region)],
    ["所属地区", display(account.city)],
    ["群类型", display(account.groupType)],
    ["微信群数", `${account.groupCount} 个`],
  ];
  const tdStyle = { borderTop: `1px solid ${S.border}`, color: S.textSec, fontFamily: "monospace" };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(17,17,17,0.56)" }} role="dialog" aria-modal="true" aria-labelledby="wechat-preview-title">
      <div className="w-full max-w-[1280px] max-h-[94vh] flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 24px 70px rgba(0,0,0,0.22)" }}>
        <div className="flex items-center justify-between gap-4 px-5 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
          <div className="min-w-0"><div id="wechat-preview-title" className="text-base font-bold" style={{ color: S.text, fontFamily: "monospace" }}>微信号资料预览</div><div className="mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>完整展示录入资料、敏感字段状态及该微信号下的群信息 · {account.wechatId}</div></div>
          <button type="button" title="关闭预览" aria-label="关闭预览" className="w-8 h-8 grid place-items-center flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={15} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5 space-y-5" style={{ background: "#f4f5f6" }}>
          <section style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${S.border}` }}><div className="flex items-center gap-2 text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}><MessageCircle size={15} />微信信息</div><div className="flex items-center gap-2 text-xs" style={{ fontFamily: "monospace" }}><span className="px-2 py-1" style={{ background: statusCfg[account.status]?.bg || S.bg, color: statusCfg[account.status]?.color || S.textSec, borderRadius: S.radiusSm }}>{account.status}</span><span style={{ color: S.muted }}>编号 {account.no}</span></div></div>
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4">
                {isUnused ? <div className="w-16 h-16 grid place-items-center flex-shrink-0" style={{ background: "#f0f0ec", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.muted }}><MessageCircle size={24} /></div> : <img src={getAvatar(avatarIndex)} alt={account.nickname} className="w-16 h-16 flex-shrink-0 object-cover" style={{ borderRadius: S.radiusSm }} />}
                <div className="min-w-0 flex-1"><div className="text-lg font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{display(account.nickname, "待获取微信昵称")}</div><div className="mt-1 text-sm font-semibold" style={{ color: S.textSec, fontFamily: "monospace" }}>{display(account.wechatId, "待填写微信号")}</div><div className="mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{display(account.project)} · {display(account.city)} · {display(account.opsManager)}</div></div>
                <div className="w-24 h-24 grid place-items-center flex-shrink-0" style={{ background: S.bg, border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm, color: S.muted }}><QrCode size={38} /><span className="sr-only">微信二维码</span></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-3">{infoItems.map(([label, value]) => <div key={label} className="min-w-0"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-medium truncate" title={value} style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div></div>)}</div>
              <div className="mt-4 px-3 py-2 text-[10px]" style={{ color: S.muted, background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>省份 / 地区按分隔符展示：<span title={account.city}>{display(account.city, "暂未设置")}</span>；敏感字段仅显示脱敏结果，需授权后查看。</div>
            </div>
          </section>

          <section style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${S.border}` }}><div className="flex items-center gap-2 text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}><Users size={15} />紧急联系人</div><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.emergencyContacts.length} 位微信联系人</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">{account.emergencyContacts.map((contact, index) => <div key={index} className="flex items-center gap-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="w-10 h-10 overflow-hidden grid place-items-center flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.muted }}>{contact.wechatId ? <img src={getAvatar(contact.avatarIndex)} alt={contact.name} className="w-full h-full object-cover" /> : <QrCode size={15} />}</div><div className="min-w-0"><div className="text-xs font-bold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{display(contact.name)}</div><div className="mt-1 text-[10px] truncate" title={contact.phone || contact.note} style={{ color: S.muted, fontFamily: "monospace" }}>{display(contact.phone || contact.note)}{contact.wechatId ? ` · ${contact.wechatId}` : ""}</div></div></div>)}</div>
          </section>

          <section style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${S.border}` }}><div className="flex items-center gap-2 text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}><QrCode size={15} />微信群列表</div><div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>已使用 {account.groupCount} 个 · 群位 {totalSlots} 个</div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[1020px] text-[11px]" style={{ borderCollapse: "collapse" }}><thead><tr style={{ background: "#f7f7f7" }}>{["使用状态", "群编号", "微信群名称", "所属地区", "群二维码", "可分配人数", "已分配人数", "已进群", "未进群", "已扫码", "微信群管理"].map(label => <th key={label} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</th>)}</tr></thead><tbody>{groupRows.map(row => <tr key={row.groupNo} style={{ background: row.bound ? S.surface : "#fcfcfb" }}><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}><span className="inline-flex items-center gap-1.5" style={{ color: row.bound ? "#276749" : S.muted, fontWeight: 600 }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: row.bound ? "#51b86a" : S.mutedLight }} />{row.bound ? "已使用" : "未使用"}</span></td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.groupNo}</td><td className="px-3 py-2.5 max-w-[230px] truncate" title={row.groupName} style={tdStyle}>{row.groupName}</td><td className="px-3 py-2.5 max-w-[170px] truncate" title={row.city} style={tdStyle}>{row.city}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.bound ? <span className="inline-flex items-center gap-1"><QrCode size={14} />{row.qr || "已绑定二维码"}</span> : "暂无"}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.available}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.assigned}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.joined}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.unjoined}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{row.scanned}</td><td className="px-3 py-2.5 whitespace-nowrap" style={tdStyle}>{display(account.opsManager, "待配置")}</td></tr>)}</tbody></table></div>
          </section>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3 flex-shrink-0" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>预览只读 · 详细修改请使用“编辑”或“分配”</span><button type="button" className="px-4 py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={onClose}>关闭预览</button></div>
      </div>
    </div>
  );
}

function WecomDetail({ account, onClose, onAction }: { account: typeof wecomAccounts[number]; onClose: () => void; onAction: (message: string) => void }) {
  const status = statusCfg[account.status] || { bg: "#f5f5f5", color: "#888" };
  const sync = account.syncStatus === "同步失败"
    ? { bg: "#fff7ed", color: "#c2410c" }
    : { bg: "#f0fff4", color: "#276749" };
  const memberRate = account.members / account.memberCapacity;
  const groupRate = account.groups.length / account.groupCapacity;
  const hasRisk = account.status === "异常" || account.syncStatus === "同步失败" || memberRate >= 0.85 || groupRate >= 0.8;
  // P2-② 企微详情宽度可拖拽（范围 300–620，默认 360）
  const [wwidth, setWwidth] = useState<number>(() => {
    try { const v = Number(localStorage.getItem("ww_detail_w") || "360"); return Number.isFinite(v) && v >= 300 ? Math.min(620, v) : 360; } catch { return 360; }
  });
  const wwDragRef = useRef<{ x: number; start: number } | null>(null);
  const persistWw = (next: number) => {
    const clamped = Math.max(300, Math.min(620, next));
    setWwidth(clamped);
    try { localStorage.setItem("ww_detail_w", String(clamped)); } catch {}
  };
  const wwEd: EventListenerOrEventListenerObject = useCallback((e) => {
    const ev = e as MouseEvent;
    if (!wwDragRef.current) return;
    persistWw(wwDragRef.current.start + (ev.clientX - wwDragRef.current.x));
  }, []);
  const wwEu: EventListenerOrEventListenerObject = useCallback(() => {
    wwDragRef.current = null;
    window.removeEventListener("mousemove", wwEd);
    window.removeEventListener("mouseup", wwEu);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [wwEd]);
  const onWwDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    wwDragRef.current = { x: e.clientX, start: wwidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", wwEd);
    window.addEventListener("mouseup", wwEu);
  };
  const [editing, setEditing] = useState(false);
  const [wecomDetailTab, setWecomDetailTab] = useState<"profile" | "binding" | "operations">("profile");
  const [saved, setSaved] = useState({ linkedPersonal: account.linkedPersonal, dept: account.dept, admin: account.admin, city: account.city, note: account.note || "" });
  const [draft, setDraft] = useState(saved);
  const [editError, setEditError] = useState("");
  const [qrMenuOpen, setQrMenuOpen] = useState(false);
  const qrMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!qrMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (qrMenuRef.current && !(e.target instanceof Node && qrMenuRef.current.contains(e.target))) setQrMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [qrMenuOpen]);
  const lastSync = timeAgo(account.lastSync);
  const attributionInfo: Array<[string, string]> = [
    ["归属项目", account.project || "—"],
    ["归属员工", saved.admin],
    ["账号类型", "企业微信"],
    ["归属大区", account.region || "—"],
    ["归属部门", saved.dept],
  ];
  const slotTotal = Math.max(account.groupCapacity, account.groups.length);
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const cancelEdit = () => { setDraft(saved); setEditError(""); setEditing(false); };
  const saveEdit = () => {
    if (!draft.linkedPersonal.trim() || !draft.dept.trim() || !draft.admin.trim() || !draft.city.trim()) {
      setEditError("请补全绑定个微、运营部门、服务负责人和城市");
      return;
    }
    setSaved(draft);
    setEditError("");
    setEditing(false);
    onAction(`${account.wecomId} 的配置资料已保存`);
  };

  return (
    <aside className="flex-shrink-0 flex flex-row overflow-hidden" style={{ width: wwidth, background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="企业微信详情">
      {/* P2-② 企微详情左边缘拖拽手柄（5px，悬停主题色） */}
      <div onMouseDown={onWwDragStart} title="左右拖动调整详情宽度（300–620）" style={{ width: 5, cursor: "col-resize", flexShrink: 0, background: S.border, borderRight: `1px solid ${S.borderMed}`, borderRadius: `${S.radiusLg} 0 0 ${S.radiusLg}` }} onMouseEnter={e => (e.currentTarget.style.background = S.accent)} onMouseLeave={e => (e.currentTarget.style.background = S.border)} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表账号后查看与调度</div>
        </div>
        <button type="button" title="关闭详情" aria-label="关闭详情" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }} onClick={onClose}><X size={14} /></button>
      </div>
      <div className="px-4 pt-3 flex gap-1 flex-shrink-0" role="tablist" aria-label="企业微信详情标签">
        {[["profile", "账号资料", Building2], ["binding", "绑定分配", Link], ["operations", "运营数据", History]].map(([key, label, Ic]) => (
          <button key={key} type="button" role="tab" aria-selected={wecomDetailTab === key} onClick={() => setWecomDetailTab(key as "profile" | "binding" | "operations")} className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold" style={{ background: wecomDetailTab === key ? S.primary : S.surface, color: wecomDetailTab === key ? "#ffffff" : S.textSec, border: `1px solid ${wecomDetailTab === key ? S.primary : S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
            <Ic size={12} />{label as string}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          <img src={getAvatar(account.id - 1)} alt={account.admin} style={{ width: 48, height: 48, borderRadius: S.radiusSm, objectFit: "cover" }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap"><b className="text-sm truncate" style={{ color: S.text, fontFamily: "monospace" }}>{account.wecomId}</b><span className="px-1.5 py-0.5 text-xs" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{account.status}</span></div>
            <div className="mt-1 text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{account.corpId}</div>
            {/* 企微：城市/服务官/admin 手机 一行不换行（后续若有 admin 手机字段直接补上） */}
            <div className="mt-0.5 text-xs truncate whitespace-nowrap" style={{ color: S.muted, fontFamily: "monospace", letterSpacing: "-0.01em" }}>{saved.city} · 服务官 {saved.admin}{account.phone ? ` · ${account.phone}` : ""}{account.adminPhone ? ` · ${account.adminPhone}` : ""}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {/* 同步正常文字去掉，只留色点小圆点 */}
            <div className="flex items-center gap-1 flex-wrap justify-end"><span title={`同步状态：${account.syncStatus}`} className="inline-flex items-center justify-center w-6 h-6" style={{ borderRadius: S.radiusSm, background: S.surface, border: `1px solid ${S.borderMed}` }}><span style={{ width: 6, height: 6, borderRadius: 99, background: sync.color }} /></span><button type="button" title="立即同步企业微信成员、群和客户数据" className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold transition-colors" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wecomId} 已发起企业微信同步任务，请等待系统完成更新`)}><RefreshCw size={11} />同步</button><button type="button" title="查看二维码" aria-label={`${account.wecomId} 查看二维码`} className="w-7 h-7 grid place-items-center" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => onAction(`${account.wecomId} 的二维码查看入口已打开`)}><QrCode size={13} /></button><div className="relative" ref={qrMenuRef}><button type="button" title="二维码操作" aria-haspopup="menu" aria-expanded={qrMenuOpen} className="w-7 h-7 grid place-items-center" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} onClick={() => setQrMenuOpen(o => !o)}><MoreHorizontal size={13} /></button>{qrMenuOpen && createPortal(<div role="menu" className="absolute z-50 w-40 p-1 shadow-lg" style={{ right: 0, top: 32, background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>{[{ label: "查看企业成员二维码", icon: QrCode, msg: `${account.wecomId} 的成员二维码查看入口已打开` }, { label: "重新同步群二维码", icon: RefreshCw, msg: `${account.wecomId} 的群二维码同步任务已创建` }, { label: "下载企业联系我二维码", icon: Download, msg: `${account.wecomId} 的联系我二维码下载已开始` }].map(item => <button key={item.label} role="menuitem" type="button" className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-left hover:brightness-[0.98]" style={{ background: "transparent", color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => { setQrMenuOpen(false); onAction(item.msg); }}><item.icon size={12} />{item.label}</button>)}</div>, qrMenuRef.current || document.body)}</div></div>
            <div className="text-[10px]" title={`绝对时间：${lastSync.abs}（今日 2026-08-30 10:00 计）`} style={{ color: S.muted, fontFamily: "monospace" }}>最近同步：{lastSync.rel}</div>
          </div>
        </div>


        {wecomDetailTab === "profile" && false && hasRisk && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {account.status === "异常" || account.syncStatus === "同步失败" ? "企业微信同步异常，请核查登录状态与个人微信绑定。" : memberRate >= 0.85 ? "成员数接近上限，建议优先停止分配新用户。" : "群数接近上限，建议提前准备备用群。"}
            </div>
          </div>
        )}

        {/* 归属与调度卡：浅灰底，去掉accentLight蓝底 */}
        {wecomDetailTab === "profile" && <div className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-1.5 mb-2"><Briefcase size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>归属与调度</div></div><div className="grid grid-cols-3 gap-2">{attributionInfo.map(([label, value]) => <div key={label}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value || "—"}</div></div>)}</div></div>}

        {/* 容量与活跃卡：四色进度条 + 下方补充运营数据 */}
        {wecomDetailTab === "profile" && <div className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center gap-1.5"><Activity size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>容量与活跃</div></div>
          <CapacitySummary primaryLabel="成员数" groupLabel="群数" primaryValue={account.members} primaryMax={account.memberCapacity} primaryWarning={memberRate >= 0.85} groupValue={account.groups.length} groupMax={account.groupCapacity} groupWarning={groupRate >= 0.8} />
          <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: `1px solid ${S.border}` }}>{[["外部客户", account.customers], ["客户联系率", `${Math.round((account.customers / Math.max(1, account.members)) * 100)}%`], ["群容量使用", `${Math.round(groupRate * 100)}%`]].map(([label, value]) => <div key={label}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}</div>
        </div>}

        {/* 编辑态：归属与配置字段集中编辑 */}
        {wecomDetailTab === "profile" && (editing ? (
          <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>编辑配置资料</div>
            <DetailInput label="绑定个微" value={draft.linkedPersonal} onChange={value => updateDraft("linkedPersonal", value)} />
            <div className="grid grid-cols-2 gap-2"><DetailInput label="运营部门" value={draft.dept} onChange={value => updateDraft("dept", value)} /><DetailInput label="服务负责人" value={draft.admin} onChange={value => updateDraft("admin", value)} /></div>
            <DetailInput label="城市" value={draft.city} onChange={value => updateDraft("city", value)} />
            <label className="block"><span className="mb-1 block text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>运营备注</span><textarea value={draft.note} onChange={event => updateDraft("note", event.target.value)} rows={3} className="w-full resize-none px-2.5 py-2 text-xs outline-none" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, fontFamily: "monospace" }} /></label>
            {editError && <div className="text-xs" role="alert" style={{ color: "#c2410c", fontFamily: "monospace" }}>{editError}</div>}
          </div>
        ) : (
          <>
          {/* 企业身份卡：corpId/认证状态/绑定个微/开通时间/联系电话，删除企业ID（头像卡有企微ID） */}
          <div className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-1.5 mb-2"><Building2 size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>企业身份</div></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {[["绑定个微", saved.linkedPersonal], ["认证状态", account.verified ? "已认证" : "未认证"], ["开通时间", account.createdAt], ["联系电话", account.phone || "未填写"]].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label as string}</div>
                  <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{(value as string) || "未配置"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 运营备注卡：提升位置+标题+更好样式 */}
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-1.5 mb-2"><MessageCircle size={12} style={{ color: S.muted }} /><div className="text-[10px] font-semibold" style={{ color: S.muted, fontFamily: "monospace" }}>运营备注</div></div>
            {saved.note ? <div className="text-xs" style={{ color: S.textSec, lineHeight: 1.6, fontFamily: "monospace" }}>{saved.note}</div> : <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>暂无运营备注</div>}
          </div>
          </>
        ))}

        {wecomDetailTab === "binding" && <div className="space-y-3">
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>企微群绑定与二维码</div><div className="flex items-center gap-2"><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.groups.length} 个已使用 / {slotTotal} 个群位</span><button type="button" className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wecomId} 的绑定配置入口已打开`)}>打开绑定配置</button></div></div><div className="grid grid-cols-2 gap-2">{Array.from({ length: slotTotal }, (_, index) => { const bound = index < account.groups.length; const name = bound ? account.groups[index] : null; return <button key={index} type="button" className="p-2 text-left" style={{ background: bound ? S.accentLight : S.bg, border: `1px ${bound ? "solid" : "dashed"} ${bound ? S.accentMid : S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => onAction(bound ? `${account.wecomId} 的群【${name}】绑定编辑入口已打开` : `${account.wecomId} 的第 ${index + 1} 个空群位可绑定`)}><div className="flex items-center gap-1.5"><QrCode size={12} /><span className="text-[10px] font-bold" style={{ color: bound ? S.text : S.muted, fontFamily: "monospace" }}>{bound ? name : `空群位 ${String(index + 1).padStart(2, "0")}`}</span></div><div className="text-[9px] mt-1 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{bound ? "点击编辑群二维码" : "点击绑定群二维码"}</div></button>; })}</div></div>
        </div>}

        {wecomDetailTab === "operations" && <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">{[["企业成员数", account.members], ["外部客户数", account.customers], ["已建群数", account.groups.length], ["客户联系率", `${Math.round((account.customers / Math.max(1, account.members)) * 100)}%`], ["群容量使用", `${Math.round(groupRate * 100)}%`], ["成员容量使用", `${Math.round(memberRate * 100)}%`]].map(([label, value]) => <div key={label} className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-1 text-lg font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}</div>
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>运营状态</div>{[["同步状态", account.syncStatus, account.syncStatus === "同步失败" ? "#c2410c" : "#276749"], ["最近活跃", account.lastSync, S.textSec], ["企业认证", account.corpId.includes("未") ? "未认证" : "已认证", account.corpId.includes("未") ? "#c2410c" : "#276749"]].map(([k, v, c]) => <div key={k as string} className="flex items-center justify-between text-xs py-2" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}><span style={{ color: S.muted }}>{k as string}</span><span style={{ color: c as string }}>{v as string}</span></div>)}</div>
        </div>}
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
        {editing ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={cancelEdit}>取消</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveEdit}>保存修改</button></> : <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEditing(true)}><Edit3 size={13} className="inline mr-1" />编辑</button><button type="button" className="py-2 text-xs font-bold" style={{ background: S.primary, color: "#ffffff", border: `1px solid ${S.primary}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wecomId} 的交接单已创建`)}>发起交接</button></>}
      </div>
      </div>{/* flex-1 wrapper 闭合 */}
    </aside>
  );
}

function BrowsePager({ page, totalPages, total, onPageChange }: { page: number; totalPages: number; total: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#fafafa" }}>
      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>第 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} 条，共 {total} 条</div>
      <div className="flex items-center gap-1">
        <button className="w-7 h-7 flex items-center justify-center transition-all" style={{ background: page === 1 ? S.bg : S.primary, color: page === 1 ? S.muted : "#ffffff", border: `1px solid ${page === 1 ? S.border : S.primary}`, borderRadius: S.radiusSm }} onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(item => <button key={item} className="w-7 h-7 text-xs transition-all" style={{ background: page === item ? S.primary : S.surface, color: page === item ? "#ffffff" : S.muted, border: `1px solid ${page === item ? S.primary : S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onPageChange(item)}>{item}</button>)}
        <button className="w-7 h-7 flex items-center justify-center transition-all" style={{ background: page === totalPages ? S.bg : S.primary, color: page === totalPages ? S.muted : "#ffffff", border: `1px solid ${page === totalPages ? S.border : S.primary}`, borderRadius: S.radiusSm }} onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
      </div>
      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {PAGE_SIZE} 条</div>
    </div>
  );
}

// ─── 企业微信 Tab ─────────────────────────────────────────────
function WecomTab({ viewMode, onViewModeChange }: { viewMode: BrowseMode; onViewModeChange: (value: BrowseMode) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [qrAccount, setQrAccount] = useState<typeof wecomAccounts[number] | null>(null);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [lifecycleFilter, setLifecycleFilter] = useState<"全部" | LifecycleStage>("全部");
  const [lifecycleMenuOpen, setLifecycleMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("全部城市");
  const [deptFilter, setDeptFilter] = useState("全部部门");
  const detail = wecomAccounts.find(w => w.id === selected);
  const wecomStatusCfg: Record<string, { bg: string; color: string }> = {
    "使用中": { bg: "#f0fff4", color: "#276749" },
    "异常": { bg: "#fff0f0", color: "#c53030" },
    "待交接": { bg: "#fff7ed", color: "#c2410c" },
    "库存": { bg: "#f5f5f5", color: "#777" },
  };
  const syncCfg: Record<string, { bg: string; color: string }> = {
    "已同步":   { bg: "#f0fff4", color: "#276749" },
    "同步失败": { bg: "#fff0f0", color: "#c53030" },
  };
  const statusTabs = ["全部", "使用中", "异常", "待交接", "未使用"];
  const cities = ["全部城市", ...Array.from(new Set(wecomAccounts.map(account => account.city)))];
  const departments = ["全部部门", ...Array.from(new Set(wecomAccounts.map(account => account.dept)))];
  const getLifecycleStage = (account: typeof wecomAccounts[number]): LifecycleStage => account.status === "库存" ? "registered" : "assigned_to_person";
  const lifecycleTabs: ("全部" | LifecycleStage)[] = ["全部", ...LIFECYCLE_FLOW];
  const filteredAccounts = wecomAccounts.filter(account => {
    const matchesStatus = statusFilter === "全部" || (statusFilter === "未使用" ? account.status === "库存" : account.status === statusFilter);
    const matchesLifecycle = lifecycleFilter === "全部" || getLifecycleStage(account) === lifecycleFilter;
    const matchesCity = cityFilter === "全部城市" || account.city === cityFilter;
    const matchesDept = deptFilter === "全部部门" || account.dept === deptFilter;
    const query = search.trim();
    const matchesSearch = !query || [account.wecomId, account.corpId, account.linkedPersonal, account.admin, account.dept, account.city].some(value => value.includes(query));
    return matchesStatus && matchesLifecycle && matchesCity && matchesDept && matchesSearch;
  });
  const statusCounts: Record<string, number> = {
    全部: wecomAccounts.length,
    使用中: wecomAccounts.filter(account => account.status === "使用中").length,
    异常: wecomAccounts.filter(account => account.status === "异常").length,
    待交接: wecomAccounts.filter(account => account.status === "待交接").length,
    未使用: wecomAccounts.filter(account => account.status === "库存").length,
  };
  const lifecycleCounts: Record<"全部" | LifecycleStage, number> = {
    全部: wecomAccounts.length,
    registered: wecomAccounts.filter(account => getLifecycleStage(account) === "registered").length,
    nurturing: 0,
    assigned_to_project: 0,
    assigned_to_person: wecomAccounts.filter(account => getLifecycleStage(account) === "assigned_to_person").length,
    archived: 0,
  };
  const activeFilterCount = Number(cityFilter !== "全部城市") + Number(deptFilter !== "全部部门");
  const clearAdvancedFilters = () => {
    setCityFilter("全部城市");
    setDeptFilter("全部部门");
  };
  const runAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };
  const handleTransfer = (account: typeof wecomAccounts[number]) => {
    setSelected(account.id);
    runAction(`${account.wecomId} 的交接单已创建`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-shrink-0 order-2">
          <button type="button" aria-expanded={lifecycleMenuOpen} className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all" style={{ background: lifecycleMenuOpen || lifecycleFilter !== "全部" ? "#0d0d0d" : S.surface, color: lifecycleMenuOpen || lifecycleFilter !== "全部" ? S.accent : S.textSec, border: `1px solid ${lifecycleMenuOpen || lifecycleFilter !== "全部" ? "#0d0d0d" : S.border}`, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setLifecycleMenuOpen(value => !value)}>
            <span style={{ width: 7, height: 7, background: lifecycleFilter === "全部" ? S.mutedLight : lifecycleCfg[lifecycleFilter].dot, borderRadius: 99 }} />
            生命周期{lifecycleFilter !== "全部" ? ` · ${lifecycleCfg[lifecycleFilter].label}` : ""}
            <ChevronDown size={12} style={{ transform: lifecycleMenuOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {lifecycleMenuOpen && <div className="absolute left-0 top-full z-30 mt-2 w-48 p-1" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
            {lifecycleTabs.map(tab => {
              const active = lifecycleFilter === tab;
              const label = tab === "全部" ? "全部阶段" : lifecycleCfg[tab].label;
              return <button key={tab} type="button" className="w-full flex items-center justify-between gap-2 px-2.5 py-2 text-left text-xs" style={{ background: active ? S.accentLight : "transparent", color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => { setLifecycleFilter(tab); setLifecycleMenuOpen(false); }}><span className="flex items-center gap-2"><span style={{ width: 7, height: 7, background: tab === "全部" ? S.mutedLight : lifecycleCfg[tab].dot, borderRadius: 99 }} />{label}</span><b style={{ color: S.muted }}>{lifecycleCounts[tab]}</b></button>;
            })}
          </div>}
        </div>
        <div className="flex order-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {statusTabs.map((tab, index) => (
            <button key={tab} type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all" style={{ background: statusFilter === tab ? "#0d0d0d" : "transparent", color: statusFilter === tab ? S.accent : S.muted, fontFamily: "monospace", borderRight: index < statusTabs.length - 1 ? `1px solid ${S.border}` : "none" }} onClick={() => setStatusFilter(tab)}>
              {tab}<span className="px-1.5 py-0.5" style={{ background: statusFilter === tab ? S.accent : S.bg, color: statusFilter === tab ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
        <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2 order-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索企业微信 / 管理员 / 部门 / 城市..." value={search} onChange={event => setSearch(event.target.value)} />
          {search && <button type="button" title="清除搜索" onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap order-4" style={{ background: filtersOpen || activeFilterCount ? "#0d0d0d" : S.surface, border: `1px solid ${filtersOpen || activeFilterCount ? "#0d0d0d" : S.border}`, color: filtersOpen || activeFilterCount ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setFiltersOpen(value => !value)}>
          <SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span>
        </button>
        <div className="order-5"><BrowseModeToggle value={viewMode} onChange={onViewModeChange} label="企业微信浏览方式" /></div>
        {secondaryActionTargetId && <div id={secondaryActionTargetId} className="ml-auto flex items-center gap-2 flex-shrink-0 order-6" aria-label="账号资产操作" />}
      </div>

      {filtersOpen && <div className="flex items-end gap-3 p-3 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>城市</span><select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={cityFilter} onChange={event => setCityFilter(event.target.value)} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>部门</span><select className="min-w-40 px-2.5 py-2 text-xs outline-none" value={deptFilter} onChange={event => setDeptFilter(event.target.value)} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{departments.map(dept => <option key={dept}>{dept}</option>)}</select></label>
        <div className="mb-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>符合条件 <b style={{ color: S.text }}>{filteredAccounts.length}</b> 个账号</div>
        <button type="button" className="ml-auto px-3 py-2 text-xs" style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={clearAdvancedFilters}>重置筛选</button>
      </div>}

      {notice && <div className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}><span className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{notice}</span><button type="button" title="关闭提示" aria-label="关闭提示" onClick={() => setNotice("")}><X size={13} style={{ color: S.muted }} /></button></div>}

      <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        {viewMode === "cards" ? <div className="grid grid-cols-2 gap-3 flex-1 overflow-auto content-start pb-2">
          {filteredAccounts.map(w => {
            const st = wecomStatusCfg[w.status] || { bg: "#f5f5f5", color: "#888" };
            const sy = syncCfg[w.syncStatus] || { bg: "#f5f5f5", color: "#888" };
            const isSelected = selected === w.id;
            const selBgCard = st.bg === "#f0fff4" ? "#dcfce7" : st.bg === "#fff0f0" ? "#fee2e2" : st.bg === "#fffbeb" ? "#fef3c7" : st.bg === "#f5f5f5" ? "#e9e9e9" : S.accentLight;
            return (
              <div key={w.id} className="p-4 cursor-pointer transition-all" style={{ background: isSelected ? selBgCard : S.surface, border: isSelected ? `2px solid ${S.accent}` : `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: isSelected ? "0 4px 16px rgba(13,13,13,0.08)" : "0 1px 4px rgba(0,0,0,0.05)", fontWeight: isSelected ? 600 : 500 }} onClick={() => setSelected(isSelected ? null : w.id)}>
                <div className="flex items-start gap-3 mb-3">
                  <img src={getAvatar(w.id - 1)} alt={w.admin} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{w.wecomId}</span>
                      <span className="px-1.5 py-0.5 text-xs font-medium" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{w.status}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{w.dept} · {w.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mb-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <MessageCircle size={13} style={{ color: S.text }} />
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>绑定个人微信：</span>
                  <span className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{w.linkedPersonal}</span>
                  <ArrowRight size={11} style={{ color: S.mutedLight }} />
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>同步添加成员</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[["成员数", w.members], ["群数量", w.groups.length], ["城市", w.city]].map(([l, v]) => (
                    <div key={l as string} className="px-2 py-1.5 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                      <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{v}</div>
                      <div className="text-xs" style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-xs font-medium" style={{ background: sy.bg, color: sy.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{w.syncStatus}</span>
                  <span className="text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>最近同步 {w.lastSync}</span>
                </div>
                {w.groups.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1 pt-2.5" style={{ borderTop: `1px solid ${S.border}` }}>
                    {w.groups.map(g => <span key={g} className="px-2 py-0.5 text-xs" style={{ background: S.accentMid, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{g}</span>)}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-end gap-1.5 pt-2.5" style={{ borderTop: `1px solid ${S.border}` }}>
                  <button type="button" title="查看二维码" aria-label={`${w.wecomId} 查看二维码`} className="w-7 h-7 flex items-center justify-center" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); setQrAccount(w); }}><QrCode size={14} /></button>
                  <button type="button" className="px-2.5 py-1 text-xs" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); setSelected(w.id); }}>查看详情</button>
                  <button type="button" className="px-2.5 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); handleTransfer(w); }}>交接</button>
                </div>
              </div>
            );
          })}
        </div> : <WecomBrowseList accounts={filteredAccounts} selected={selected} onSelect={setSelected} onQrCode={setQrAccount} onTransfer={handleTransfer} />}
      </div>

      {false && detail && (
        <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }}>
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7" }}>
            <span className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>企业微信详情</span>
            <button onClick={() => setSelected(null)}><X size={14} style={{ color: S.muted }} /></button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="py-4 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <img src={getAvatar(detail.id - 1)} alt={detail.admin} style={{ width: 56, height: 56, borderRadius: S.radius, objectFit: "cover", margin: "0 auto 8px", display: "block" }} />
              <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.wecomId}</div>
              <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.corpId}</div>
              <div className="mt-2 flex items-center justify-center gap-2">
                {[detail.status, detail.syncStatus].map((s, i) => {
                  const cfg = i === 0
                    ? ({ "使用中": { bg: "#f0fff4", color: "#276749" }, "异常": { bg: "#fff0f0", color: "#c53030" }, "待交接": { bg: "#fff7ed", color: "#c2410c" }, "库存": { bg: "#f5f5f5", color: "#777" } }[s] || { bg: "#f5f5f5", color: "#888" })
                    : ({ "已同步": { bg: "#f0fff4", color: "#276749" }, "同步失败": { bg: "#fff0f0", color: "#c53030" } }[s] || { bg: "#f5f5f5", color: "#888" });
                  return <span key={i} className="px-2 py-0.5 text-xs font-medium" style={{ background: cfg.bg, color: cfg.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{s}</span>;
                })}
              </div>
            </div>
            <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="text-xs font-semibold mb-2" style={{ color: S.text, fontFamily: "monospace" }}><Link size={12} className="inline mr-1" />绑定个人微信</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5" style={{ background: S.accentMid, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <MessageCircle size={12} style={{ color: S.text }} />
                  <span className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.linkedPersonal}</span>
                </div>
                <ArrowRight size={12} style={{ color: S.muted }} />
                <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>新用户同时添加</span>
              </div>
            </div>
            {[["管理员", detail.admin], ["部门", detail.dept], ["城市", detail.city], ["成员数", `${detail.members} 人`], ["管理群数", `${detail.groups.length} 个`], ["最近同步", detail.lastSync]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                <span className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
            <div>
              <div className="text-xs mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>企微群组</div>
              <div className="space-y-1.5">
                {detail.groups.map(g => (
                  <div key={g} className="flex items-center gap-2 px-2.5 py-2" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                    <Users size={12} style={{ color: S.text }} />
                    <span className="text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>
            {detail.note && <div className="p-3 text-xs" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.muted, lineHeight: 1.6, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{detail.note}</div>}
          </div>
          <div className="p-4 flex flex-col gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
            <button className="w-full py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>编辑企业微信</button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 text-xs font-medium" style={{ background: S.bg, border: `1px solid rgba(0,0,0,0.10)`, color: S.text, borderRadius: S.radius, fontFamily: "monospace" }}>手动同步成员</button>
              <button className="py-2 text-xs font-medium" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace" }}>新建企微群</button>
            </div>
          </div>
        </div>
      )}
      {detail && <WecomDetail key={detail.id} account={detail} onClose={() => setSelected(null)} onAction={runAction} />}
      </div>

      {qrAccount && <WecomQrModal account={qrAccount} onClose={() => setQrAccount(null)} onCopy={() => runAction(`${qrAccount.wecomId} 的二维码链接已复制`)} />}
    </div>
  );
}

// ─── 个人微信默认运营列：低频资产资料收进右侧详情（极致紧凑版） ────────────────
const cols = [
  { key: "select", label: "", w: 24 },
  { key: "no", label: "编号", w: 36 },
  { key: "lifecycle", label: "生命周期", w: 62 },
  { key: "status", label: "使用状态", w: 54 },
  { key: "avatar", label: "微信头像", w: 40 },
  { key: "nickname", label: "微信昵称", w: 88 },
  { key: "wechatId", label: "微信号", w: 94 },
  { key: "project", label: "归属项目", w: 82 },
  { key: "type", label: "微信号类型", w: 56 },
  { key: "owner", label: "归属服务官", w: 70 },
  { key: "department", label: "归属部门", w: 86 },
  { key: "region", label: "省份 / 大区", w: 70 },
  { key: "city", label: "地区", w: 70 },
  { key: "friendCount", label: "好友数", w: 70 },
  { key: "blocked", label: "拉黑人数", w: 52 },
  { key: "deleted", label: "删除人数", w: 52 },
  { key: "normalFans", label: "正常活粉", w: 60 },
  { key: "groups", label: "群数", w: 50 },
  { key: "sync", label: "同步状态", w: 66 },
  { key: "updated", label: "最近同步", w: 64 },
  { key: "action", label: "操作", w: 168 },
];

// 状态 → 整行底色/状态点色/文字色
const rowTintByStatus: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  "使用中":   { bg: "rgba(34,197,94,0.055)", dot: "#22c55e", text: "#16a34a", label: "使用中" },
  "异常":     { bg: "rgba(249,115,22,0.075)", dot: "#ef4444", text: "#b91c1c", label: "异常"   },
  "待交接":   { bg: "rgba(245,158,11,0.08)",  dot: "#f59e0b", text: "#92400e", label: "待交接" },
  "未使用":   { bg: "rgba(148,163,184,0.07)", dot: "#94a3b8", text: "#475569", label: "未使用" },
  "已停用":   { bg: "rgba(100,116,139,0.08)", dot: "#64748b", text: "#334155", label: "已停用" },
};

// ─── 主组件 ───────────────────────────────────────────────────
interface WeChatManagementProps {
  controlledViewDimension?: WeChatViewDimension;
  controlledMainTab?: "personal" | "wecom";
  onMainTabChange?: (next: "personal" | "wecom") => void;
  hideAccountTypeTabs?: boolean;
  hideDimensionTabs?: boolean;
  hidePageTitle?: boolean;
  /** 将操作按钮渲染到统一资产入口的顶部操作区 */
  headerActionTargetId?: string;
  /** 将显示/导入/导出按钮渲染到筛选工具栏 */
  secondaryActionTargetId?: string;
  /** 将显示/导出/批量导入放入状态筛选工具栏，匹配旧版微信管理布局 */
  toolbarActionPlacement?: "header" | "toolbar";
}

function HeaderActionSlot({ targetId, children }: { targetId?: string; children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!targetId || typeof document === "undefined") return;
    setTarget(document.getElementById(targetId));
  }, [targetId]);
  return target ? createPortal(children, target) : <>{children}</>;
}

export default function WeChatManagement({ controlledViewDimension, controlledMainTab, onMainTabChange, hideAccountTypeTabs = false, hideDimensionTabs = false, hidePageTitle = false, headerActionTargetId, secondaryActionTargetId, toolbarActionPlacement = "header" }: WeChatManagementProps = {}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [lifecycleFilter, setLifecycleFilter] = useState<"全部" | LifecycleStage>("全部");
  const [lifecycleMenuOpen, setLifecycleMenuOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("全部城市");
  const [projectFilter, setProjectFilter] = useState("全部项目");
  const [departmentFilter, setDepartmentFilter] = useState("全部部门");
  const [accountTypeFilter, setAccountTypeFilter] = useState("全部类型");
  const [serviceFilter, setServiceFilter] = useState("全部服务官");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("全部");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showWecomCreateModal, setShowWecomCreateModal] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(["select", "status", "avatar", "nickname", "wechatId", "project", "owner", "region", "action"]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [detailVersion, setDetailVersion] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  // ── 三维度总视角 ──
  // 按账号类型：保留原 personal/wecom Tab 子切换
  // 按项目：按项目分组 + 空闲号池区
  // 按人：按人员分组 + 展开工具
  const [internalViewDimension, setInternalViewDimension] = useState<WeChatViewDimension>("type");
  const viewDimension = controlledViewDimension ?? internalViewDimension;
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedPeople, setExpandedPeople] = useState<Record<string, boolean>>({});
  const [internalMainTab, setInternalMainTab] = useState<"personal" | "wecom">("personal");
  const mainTab = controlledMainTab ?? internalMainTab;
  const setMainTab = (next: "personal" | "wecom") => { setInternalMainTab(next); onMainTabChange?.(next); setSelectedRow(null); setDetailMode("view"); };
  // 个人微信与企业微信共用浏览模式，切换账号类型时保持用户当前选择。
  const [wechatBrowseMode, setWechatBrowseModeState] = useState<BrowseMode>("list");
  // P2-④ 切换浏览方式（列表/卡片）或切换三维度时自动清空详情，避免个微详情在企微视角错位
  const setWechatBrowseMode = (next: BrowseMode) => { setWechatBrowseModeState(next); setSelectedRow(null); setDetailMode("view"); };
  const setViewDimension = (next: WeChatViewDimension) => { setInternalViewDimension(next); setSelectedRow(null); setDetailMode("view"); };
  const [createdAccounts, setCreatedAccounts] = useState<PersonalAccount[]>([]);
  const [accountOverrides, setAccountOverrides] = useState<Record<string, Partial<PersonalAccount>>>({});
  const [allocationAccount, setAllocationAccount] = useState<PersonalAccount | null>(null);
  const [previewAccount, setPreviewAccount] = useState<PersonalAccount | null>(null);
  // ── 列宽拖拽（表头分隔线拖动） ──
  // 防御：cols 在 Vite HMR 场景下偶发 undefined，先用硬编码默认宽度兜底，后续 effect 再同步一次
  const defaultColWidths: Record<string, number> = Object.fromEntries((cols || []).map(c => [c.key, c.w]));
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    if (defaultColWidths && Object.keys(defaultColWidths).length) return { ...defaultColWidths };
    return { select: 24, no: 36, lifecycle: 62, status: 54, avatar: 40, nickname: 88, wechatId: 94, project: 82, type: 56, owner: 70, department: 86, region: 70, city: 70, friendCount: 78, blocked: 52, deleted: 52, normalFans: 60, groups: 66, sync: 66, updated: 64, action: 168 };
  });
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; w: number } | null>(null);
  const { generatedGroups } = useCommunityData();

  // 给"新建微信号"出来的账号也补齐 lifecycle 相关字段，保证 createdAccounts 形态与 accountsWithLifecycle 一致
  const normalizeLifecycle = (account: PersonalAccount): PersonalAccount => {
    if (account.lifecycleStage && account.nurturing) return account;
    const onboardDate = account.onboardDate || TODAY;
    const daysSince = daysBetween(onboardDate, TODAY);
    const certGatePass = !!account.certified || account.credential === "已认证";
    const friendGatePass = account.friendCount >= 200;
    const day7Pass = daysSince >= 7;
    const riskHits = (account.status === "异常" ? 3 : 0) + (account.credential !== "已认证" && account.credential !== "—" ? 1 : 0);
    const nurturing: NurturingGate = { daysSinceOnboard: daysSince, day7Pass, friendGatePass, certGatePass, pass: day7Pass && friendGatePass && certGatePass, riskHits };
    const base: LifecycleStage = legacyStatusToLifecycle[account.status] ?? "nurturing";
    let stage: LifecycleStage = base;
    if (account.project !== "—" && account.project !== "待配置" && account.opsManager !== "—") stage = "assigned_to_person";
    else if (account.project !== "—" && account.project !== "待配置") stage = "assigned_to_project";
    else if (nurturing.pass) stage = "nurturing";
    const approvalRef = account.status === "待交接" ? `AP-2026-${Date.now().toString().slice(-4)}` : undefined;
    return {
      ...account,
      lifecycleStage: stage,
      onboardDate,
      nurturing,
      approvalRef,
      ownerUid: account.ownerUid ?? resolveOwnerUid(account.opsManager),
    };
  };

  const accounts = [...createdAccounts, ...accountsWithLifecycle]
    .map(account => normalizeLifecycle({ ...account, ...accountOverrides[account.no] }))
    .map(account => {
      const generatedGroupCount = generatedGroups.filter(group =>
        group.service === account.serviceOfficer && group.city.split("/").includes(account.city),
      ).length;
      return { ...account, groupCount: account.groupCount + generatedGroupCount };
    });
  // 企业微信沿用个人微信台账的字段与浏览结构，企业专属数据映射到同一套列配置。
  const enterpriseAccounts = wecomAccounts.map((enterprise, index) => normalizeLifecycle({
    ...(mockWechats[index % mockWechats.length] as PersonalAccount),
    no: `9${String(enterprise.id).padStart(4, "0")}`,
    wechatId: enterprise.wecomId,
    nickname: enterprise.wecomId,
    phone: "—",
    status: enterprise.status === "库存" ? "未使用" : enterprise.status,
    city: enterprise.city,
    region: ({ 北京: "华北", 上海: "华东", 广州: "华南", 深圳: "华南", 杭州: "华东" } as Record<string, string>)[enterprise.city] || "其他",
    project: accountsWithLifecycle[index]?.project || "待配置",
    department: enterprise.dept,
    accountType: "企业微信",
    opsManager: enterprise.admin,
    serviceOfficer: enterprise.admin,
    memberManager: "—",
    friendCount: enterprise.members,
    normalFans: enterprise.members,
    groupCount: enterprise.groups.length,
    targetGroup: enterprise.groups[0] || "—",
    targetGroupCount: enterprise.groups.length,
    groupQrNames: enterprise.groups.map(() => "企业群二维码已同步"),
    wechatQrName: "企业二维码已同步",
    lastLogin: enterprise.lastSync,
    credential: "已认证",
    certified: true,
    boundEmail: "—",
    qqNo: "—",
    wechatPassword: "",
    idCard: "",
    idCardFront: "",
    idCardBack: "",
    bankCard: "",
    paymentPassword: "",
    qqPassword: "",
    qqSecurity: "",
    emailPassword: "",
    emailSecurity: "",
    emergencyContacts: [],
  } as PersonalAccount));
  const displayedAccounts = mainTab === "wecom" ? enterpriseAccounts : accounts;

  const statusTabs = ["全部", "使用中", "异常", "待交接", "未使用"];
  const lifecycleTabs: ("全部" | LifecycleStage)[] = ["全部", ...LIFECYCLE_FLOW];
  const cities = ["全部城市", ...Array.from(new Set(displayedAccounts.map(w => w.city).filter(city => city !== "—")))];
  const projects = ["全部项目", ...Array.from(new Set(displayedAccounts.map(w => w.project).filter(project => project !== "—" && project !== "待配置")))];
  const departments = ["全部部门", ...Array.from(new Set(displayedAccounts.map(w => w.department).filter(department => department !== "—")))];
  const accountTypes = ["全部类型", ...Array.from(new Set(displayedAccounts.map(w => w.accountType)))];
  const serviceOfficers = ["全部服务官", ...Array.from(new Set(displayedAccounts.map(w => w.serviceOfficer).filter(value => value !== "—")))];
  const lifecycleCounts: Record<"全部" | LifecycleStage, number> = {
    全部: displayedAccounts.length,
    registered: displayedAccounts.filter(w => w.lifecycleStage === "registered").length,
    nurturing: displayedAccounts.filter(w => w.lifecycleStage === "nurturing").length,
    assigned_to_project: displayedAccounts.filter(w => w.lifecycleStage === "assigned_to_project").length,
    assigned_to_person: displayedAccounts.filter(w => w.lifecycleStage === "assigned_to_person").length,
    archived: displayedAccounts.filter(w => w.lifecycleStage === "archived").length,
  };
  const filtered = displayedAccounts.filter(w => {
    const risk = getAccountRisk(w);
    const searchMatch = w.wechatId.includes(search) || w.opsManager.includes(search) || w.memberManager.includes(search) || w.city.includes(search) || w.project.includes(search) || w.phone.includes(search) || w.nickname.includes(search);
    const capacityMatch = capacityFilter === "全部" || (capacityFilter === "好友预警" && risk.isFriendRisk) || (capacityFilter === "群容量预警" && risk.isGroupRisk) || (capacityFilter === "同步异常" && risk.isSyncRisk);
    const lifecycleMatch = lifecycleFilter === "全部" || w.lifecycleStage === lifecycleFilter;
    const legacyMatch = statusFilter === "全部" || w.status === statusFilter;
    return lifecycleMatch && legacyMatch
      && (cityFilter === "全部城市" || w.city === cityFilter)
      && (projectFilter === "全部项目" || w.project === projectFilter)
      && (departmentFilter === "全部部门" || w.department === departmentFilter)
      && (accountTypeFilter === "全部类型" || w.accountType === accountTypeFilter)
      && (serviceFilter === "全部服务官" || w.serviceOfficer === serviceFilter)
      && capacityMatch && searchMatch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = { 全部: displayedAccounts.length, 使用中: displayedAccounts.filter(w => w.status === "使用中").length, 异常: displayedAccounts.filter(w => w.status === "异常").length, 待交接: displayedAccounts.filter(w => w.status === "待交接").length, 未使用: displayedAccounts.filter(w => w.status === "未使用").length };
  const selectedAccount = displayedAccounts.find(w => w.no === selectedRow) || null;
  const activeFilterCount = Number(lifecycleFilter !== "全部") + Number(cityFilter !== "全部城市") + Number(projectFilter !== "全部项目") + Number(departmentFilter !== "全部部门") + Number(accountTypeFilter !== "全部类型") + Number(serviceFilter !== "全部服务官") + Number(capacityFilter !== "全部");
  const clearAdvancedFilters = () => { setLifecycleFilter("全部"); setCityFilter("全部城市"); setProjectFilter("全部项目"); setDepartmentFilter("全部部门"); setAccountTypeFilter("全部类型"); setServiceFilter("全部服务官"); setCapacityFilter("全部"); setPage(1); };
  const isColumnVisible = (key: string) => visibleColumns.includes(key);
  const columnStyle = (key: string, style: Record<string, string | number>) => ({ ...style, width: colWidths[key] ?? style.width, display: isColumnVisible(key) ? undefined : "none" });
  const visibleTableWidth = cols.filter(column => isColumnVisible(column.key)).reduce((total, column) => total + (colWidths[column.key] ?? column.w), 0);
  // 列宽拖拽：在表头分隔线按下鼠标时注册全局 move/up 监听器
  // 关键：起始宽度必须在 mousedown 此刻用局部变量捕获，不能在 setState 回调里读 ref
  // （否则 React StrictMode 双调用 / 异步调度时 ref 已被 onUp 清空 → reading 'w' of null）
  const handleColDragStart = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = Number(colWidths?.[key] ?? (cols.find(c => c.key === key)?.w) ?? 60);
    setDraggingCol(key);
    dragStartRef.current = { x: startX, w: startW };
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const nextW = Math.max(24, startW + delta);
      setColWidths(prev => {
        if (!prev) return { [key]: nextW };
        if (prev[key] === nextW) return prev;
        return { ...prev, [key]: nextW };
      });
    };
    const onUp = () => {
      setDraggingCol(null);
      dragStartRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };
  const toggleRow = (no: string) => setSelectedRows(current => current.includes(no) ? current.filter(item => item !== no) : [...current, no]);
  const runBulkAction = (action: string) => { if (!selectedRows.length) return; runAccountAction(`已对 ${selectedRows.length} 个微信号执行${action}`); setSelectedRows([]); };
  const runAccountAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };
  // 生命周期流转动作（养号达标→分配项目→发放到人→交接审批→回收→归档）
  const advanceLifecycle = (no: string) => {
    if (mainTab === "wecom") {
      const enterprise = enterpriseAccounts.find(account => account.no === no);
      if (enterprise) runAccountAction(`${enterprise.wechatId} 的生命周期推进已记录，可在企业微信详情继续配置项目与负责人`);
      return;
    }
    const acc = accounts.find(a => a.no === no);
    if (!acc) return;
    const flow = [...LIFECYCLE_FLOW];
    const idx = flow.indexOf(acc.lifecycleStage);
    // 发放到人后不再自动前进，由"交接审批/回收"操作
    if (acc.lifecycleStage === "archived") return;
    if (acc.lifecycleStage === "assigned_to_person") {
      runAccountAction(`${acc.wechatId} 当前已发放到人，如需变更请使用「发起交接审批」或「一键回收」`);
      return;
    }
    if (acc.lifecycleStage === "nurturing" && !acc.nurturing.pass) {
      runAccountAction(`${acc.wechatId} 还未通过养号门槛（7天/≥200好友/已认证），暂不可分配项目`);
      return;
    }
    const next = flow[Math.min(idx + 1, flow.length - 2)]; // 不再直接 advance 到 archived
    let patch: Partial<PersonalAccount> = { lifecycleStage: next };
    let statusPatch: Partial<PersonalAccount> = {};
    if (next === "assigned_to_project" && (acc.project === "—" || acc.project === "待配置")) {
      // 若无项目，给个默认项目（第一个项目池）
      const pick = projects[1] ?? "默认项目";
      patch.project = pick;
      statusPatch.status = "使用中";
    }
    if (next === "assigned_to_person" && acc.opsManager === "—") {
      // 若无负责人，按"北京PRO服务"服务官兜底
      const first = serviceOfficers[1] ?? "吴思远";
      patch.opsManager = first;
      patch.serviceOfficer = first;
      patch.ownerUid = resolveOwnerUid(first);
      statusPatch.status = "使用中";
    }
    setAccountOverrides(prev => ({ ...prev, [no]: { ...(prev[no] || {}), ...patch, ...statusPatch } }));
    runAccountAction(`${acc.wechatId} 已推进到「${lifecycleCfg[next].label}」`);
  };
  const recycleAccount = (no: string) => {
    if (mainTab === "wecom") {
      const enterprise = enterpriseAccounts.find(account => account.no === no);
      if (enterprise) runAccountAction(`${enterprise.wechatId} 已提交回收申请，等待企业管理员确认`);
      return;
    }
    const acc = accounts.find(a => a.no === no);
    if (!acc) return;
    // 回收：清空负责人 → 养号期/号池
    setAccountOverrides(prev => ({ ...prev, [no]: { ...(prev[no] || {}), opsManager: "—", memberManager: "—", ownerUid: undefined, lifecycleStage: "nurturing", status: "未使用" } }));
    runAccountAction(`${acc.wechatId} 已回收至养号池（空闲号池）`);
  };
  const archiveAccount = (no: string) => {
    if (mainTab === "wecom") {
      const enterprise = enterpriseAccounts.find(account => account.no === no);
      if (enterprise) runAccountAction(`${enterprise.wechatId} 已提交归档停用申请`);
      return;
    }
    const acc = accounts.find(a => a.no === no);
    if (!acc) return;
    setAccountOverrides(prev => ({ ...prev, [no]: { ...(prev[no] || {}), lifecycleStage: "archived", status: "已停用" } }));
    runAccountAction(`${acc.wechatId} 已归档停用`);
  };
  const startHandoverApproval = (no: string) => {
    if (mainTab === "wecom") {
      const enterprise = enterpriseAccounts.find(account => account.no === no);
      if (enterprise) runAccountAction(`已为 ${enterprise.wechatId} 发起企业微信交接审批`);
      return;
    }
    const acc = accounts.find(a => a.no === no);
    if (!acc) return;
    setAccountOverrides(prev => ({ ...prev, [no]: { ...(prev[no] || {}), status: "待交接", approvalRef: `AP-2026-${Date.now().toString().slice(-4)}` } }));
    runAccountAction(`已为 ${acc.wechatId} 发起交接审批（审批单号已生成，进入审批中心流程）`);
  };
  const openAccountDetail = (no: string, mode: "view" | "edit" = "view") => {
    setSelectedRow(no);
    setDetailMode(mode);
    setDetailVersion(version => version + 1);
  };
  const saveNewAccount = (form: WechatEntryForm, contacts: EmergencyContactDraft[]) => {
    const nextNo = String(Math.max(...accounts.map(account => Number(account.no) || 0)) + 1).padStart(5, "0");
    const template = mockWechats[mockWechats.length - 1];
    const base: PersonalAccount = {
      ...template,
      no: nextNo,
      wechatId: form.wechatId || `待配置_${nextNo}`,
      phone: form.phone || "—",
      nickname: form.nickname || "待配置",
      gender: "—",
      status: "未使用",
      certified: false,
      invitedNew: 0,
      scanCount: 0,
      friendCount: 0,
      isInitiator: false,
      qqNo: form.qqNo || "—",
      boundEmail: form.boundEmail || "—",
      opsManager: form.opsManager || "—",
      memberManager: form.memberManager || "—",
      city: form.city || "—",
      project: form.project || "待配置",
      lastLogin: "—",
      groupCount: 0,
      targetGroup: "—",
      targetGroupCount: 0,
      groupType: "",
      credential: form.wechatPassword ? "已认证" : "待补充",
      accountType: form.accountType || "待配置",
      department: form.department || "—",
      region: form.region || "—",
      serviceOfficer: form.opsManager || "—",
      normalFans: 0,
      blockedCount: 0,
      deletedCount: 0,
      wechatPassword: form.wechatPassword,
      idCard: form.idCard,
      idCardFront: form.idCardFront,
      idCardBack: form.idCardBack,
      bankCard: form.bankCard,
      paymentPassword: form.paymentPassword,
      qqPassword: form.qqPassword,
      qqSecurity: form.qqSecurity,
      emailPassword: form.emailPassword,
      emailSecurity: form.emailSecurity,
      emergencyContacts: contacts.map(contact => ({ wechatId: contact.wechatId, name: contact.name || "待配置", phone: contact.phone, note: "紧急交接与安全核验", qr: false, avatarIndex: contact.avatarIndex })),
      groupQrNames: [],
      wechatQrName: form.wechatQrName,
    } as PersonalAccount;
    // 新账号生命周期：若已填实名认证密码=注册入库当天，已实名=默认 nurturing（但 pass=false，<7天）
    const newAccount = normalizeLifecycle({
      ...base,
      lifecycleStage: base.credential === "已认证" ? "nurturing" : "registered",
    });
    setCreatedAccounts(current => [newAccount, ...current]);
    setLifecycleFilter(newAccount.lifecycleStage);
    setStatusFilter("未使用");
    setPage(1);
    runAccountAction(`${newAccount.wechatId} 已${newAccount.lifecycleStage === "registered" ? "注册入库" : "进入养号期"}，养号达标后可一键分配项目`);
  };
  const updateAccount = (no: string, patch: Partial<PersonalAccount>) => {
    setCreatedAccounts(current => current.map(account => account.no === no ? { ...account, ...patch } : account));
  };
  const saveAllocation = (no: string, patch: Partial<PersonalAccount>) => {
    if (mainTab === "wecom") {
      const enterprise = enterpriseAccounts.find(account => account.no === no);
      if (enterprise) runAccountAction(`${enterprise.wechatId} 已完成企业微信分配配置`);
      return;
    }
    setAccountOverrides(current => ({ ...current, [no]: { ...current[no], ...patch } }));
    runAccountAction(`${no} 已完成微信号分配`);
  };

  // 构建分组数据（按项目 / 按人）
  const groupByProject = (list: PersonalAccount[]) => {
    const groups: Record<string, PersonalAccount[]> = { "空闲号池": [] };
    for (const a of list) {
      const key = (!a.project || a.project === "—" || a.project === "待配置") ? "空闲号池" : a.project;
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }
    return groups;
  };
  const groupByPerson = (list: PersonalAccount[]) => {
    const groups: Record<string, PersonalAccount[]> = { "空闲未分配": [] };
    for (const a of list) {
      if (!a.ownerUid && (!a.opsManager || a.opsManager === "—")) {
        groups["空闲未分配"].push(a);
        continue;
      }
      const uid = a.ownerUid ?? `anon:${a.opsManager}`;
      if (!groups[uid]) groups[uid] = [];
      groups[uid].push(a);
    }
    return groups;
  };
  const getPerson = (uid: string) => {
    if (uid === "空闲未分配") return null;
    if (uid.startsWith("anon:")) {
      const name = uid.slice(5);
      return { uid, name, role: "外部临时", dept: "—", phone: "—", projects: [] as string[], capacity: 3, used: 0, avatarIdx: 0 };
    }
    const p = assetPeoplePool[uid];
    return p ? { uid, ...p } : null;
  };

  const dimensionTabs: { key: ViewDimension; label: string; icon: any; hint: string }[] = [
    { key: "type",    label: "按账号类型", icon: MessageCircle, hint: "个人微信 / 企业微信 切换，保留原列表与卡片浏览设计" },
    { key: "project", label: "按项目",     icon: Building2,     hint: "按项目分组展示，含独立「空闲号池」分区" },
    { key: "person",  label: "按人",       icon: Users,         hint: "按归属人分组头，展开查看此人名下全部工具" },
  ];

  const groupedByProject = groupByProject(filtered);
  const groupedByPeople = groupByPerson(filtered);
  const toggleProject = (p: string) => setExpandedProjects(prev => ({ ...prev, [p]: prev[p] === false ? true : false }));
  const togglePerson = (p: string) => setExpandedPeople(prev => ({ ...prev, [p]: prev[p] === false ? true : false }));

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && mainTab === "personal" && <AuthorizedWechatModal onClose={() => setShowModal(false)} onSave={saveNewAccount} />}
      {showWecomCreateModal && mainTab === "wecom" && <AuthorizedWechatModal accountKind="wecom" onClose={() => setShowWecomCreateModal(false)} onSave={() => runAccountAction("企业微信已注册入库，可继续分配项目")} />}
      {allocationAccount && <WechatAllocationModal account={allocationAccount} onClose={() => setAllocationAccount(null)} onSave={patch => saveAllocation(allocationAccount.no, patch)} />}
      {previewAccount && <WechatPreviewModal account={previewAccount} onClose={() => setPreviewAccount(null)} />}

      {/* 页头：三维度总视角 */}
      <div className="flex items-start justify-between flex-shrink-0 gap-4" style={hidePageTitle && headerActionTargetId ? { display: "contents" } : undefined}>
        {!hidePageTitle && <div className="min-w-0">
          <h2 className="font-semibold" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.04em" }}>微信管理</h2>
          <p className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>
            管理个人微信和企业微信，双账号同步服务用户
          </p>
        </div>}
        <HeaderActionSlot targetId={headerActionTargetId}>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2 items-center flex-wrap justify-end">
            {!hideDimensionTabs && <div className="flex p-0.5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              {dimensionTabs.map(tab => {
                const Icon = tab.icon;
                const on = viewDimension === tab.key;
                return (
                  <button key={tab.key} type="button" title={tab.hint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: on ? "#0d0d0d" : "transparent", color: on ? S.accent : S.muted, fontFamily: "monospace", borderRadius: S.radiusSm }} onClick={() => { setViewDimension(tab.key); setPage(1); }}>
                    <Icon size={13} /> {tab.label}
                  </button>
                );
              })}
            </div>}
            {viewDimension === "type" && !hideAccountTypeTabs && <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "personal" ? "#0d0d0d" : "transparent", color: mainTab === "personal" ? S.accent : S.muted, fontFamily: "monospace", borderRight: `1px solid ${S.border}` }} onClick={() => setMainTab("personal")}>
                <MessageCircle size={13} /> 个人微信
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "wecom" ? "#0d0d0d" : "transparent", color: mainTab === "wecom" ? S.accent : S.muted, fontFamily: "monospace" }} onClick={() => setMainTab("wecom")}>
                <Building2 size={13} /> 企业微信
              </button>
            </div>}
            <HeaderActionSlot targetId={secondaryActionTargetId}>
            {toolbarActionPlacement === "header" && viewDimension === "type" && <div className="relative">
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap" style={{ background: columnsOpen ? "#0d0d0d" : S.surface, border: `1px solid ${columnsOpen ? "#0d0d0d" : S.border}`, color: columnsOpen ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setColumnsOpen(value => !value)}>
                <Eye size={13} /> {headerActionTargetId ? "显示内容" : "显示内容管理"}
              </button>
              {columnsOpen && <div className="absolute right-0 top-full z-30 mt-2 w-72 p-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
                <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>列表显示字段</div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>
                  {cols.filter(column => !["select", "action", "nickname", "wechatId"].includes(column.key)).map(column => <label key={column.key} className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={isColumnVisible(column.key)} onChange={event => setVisibleColumns(current => event.target.checked ? Array.from(new Set([...current, column.key])) : current.filter(key => key !== column.key))} />{column.label}</label>)}
                </div>
                <button type="button" className="mt-3 w-full px-2 py-1.5 text-[10px] font-semibold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setVisibleColumns(cols.map(column => column.key))}>显示全部字段</button>
                <div className="mt-2 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>昵称、微信号始终完整展示；身份证、银行卡、密码等敏感字段在详情中脱敏。</div>
              </div>}
            </div>}
            {toolbarActionPlacement === "header" && <button type="button" onClick={() => setNotice(`已导出 ${filtered.length} 条微信账号数据`)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
              <Download size={13} /> 导出
            </button>}
            {toolbarActionPlacement === "header" && headerActionTargetId && <button type="button" onClick={() => setNotice("批量导入模板已打开，可导入微信账号数据")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
              <Upload size={13} /> 批量导入
            </button>}
            </HeaderActionSlot>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold whitespace-nowrap" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => mainTab === "wecom" ? setShowWecomCreateModal(true) : setShowModal(true)}>
              <Plus size={15} /> {headerActionTargetId ? (mainTab === "wecom" ? "接入企业微信" : "注册入库") : viewDimension === "type" && mainTab === "wecom" ? "新建企微账号" : "新建微信号（注册入库）"}
            </button>
          </div>
        </div>
        </HeaderActionSlot>
      </div>

      {notice && <div className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>
        <span className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{notice}</span>
        <button type="button" onClick={() => setNotice("")} title="关闭提示"><X size={13} style={{ color: S.muted }} /></button>
      </div>}

      {/* 运营状态 Tab + 搜索 + 过滤；生命周期放入高级筛选，保持旧版首行结构 */}
      <>
      <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
        <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {statusTabs.map((t, i) => (
            <button key={t} className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all" style={{ background: statusFilter === t ? "#0d0d0d" : "transparent", color: statusFilter === t ? S.accent : S.muted, fontFamily: "monospace", borderRight: i < statusTabs.length - 1 ? `1px solid ${S.border}` : "none" }} onClick={() => { setStatusFilter(t); setPage(1); }}>
              {t}
              <span className="px-1.5 py-0.5" style={{ background: statusFilter === t ? S.accent : S.bg, color: statusFilter === t ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{(counts as any)[t]}</span>
            </button>
          ))}
        </div>
        <label className="order-2 flex items-center gap-2 px-3 py-2 whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, color: S.textSec, fontFamily: "monospace" }}>
          <span className="w-2 h-2" style={{ background: lifecycleFilter === "全部" ? "#b8b8b8" : lifecycleCfg[lifecycleFilter].dot, borderRadius: 99 }} />
          <select aria-label="生命周期筛选" className="bg-transparent outline-none text-xs font-medium" value={lifecycleFilter} onChange={e => { setLifecycleFilter(e.target.value as "全部" | LifecycleStage); setPage(1); }}>
            {lifecycleTabs.map(stage => <option key={stage} value={stage}>{stage === "全部" ? "生命周期" : lifecycleCfg[stage].label}</option>)}
          </select>
        </label>
        <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索微信号 / 手机号 / 负责人 / 项目 / 地区..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap" style={{ background: filtersOpen || activeFilterCount ? "#0d0d0d" : S.surface, border: `1px solid ${filtersOpen || activeFilterCount ? "#0d0d0d" : S.border}`, color: filtersOpen || activeFilterCount ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span></button>
        {viewDimension === "type" && <div className="order-5"><BrowseModeToggle value={wechatBrowseMode} onChange={setWechatBrowseMode} label="微信账号浏览方式" /></div>}
        {secondaryActionTargetId && <div id={secondaryActionTargetId} className="ml-auto flex items-center gap-2 flex-shrink-0 order-6" aria-label="账号资产操作" />}
        {toolbarActionPlacement === "toolbar" && viewDimension === "type" && <>
          <div className="relative order-7">
            <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap" style={{ background: columnsOpen ? "#0d0d0d" : S.surface, border: `1px solid ${columnsOpen ? "#0d0d0d" : S.border}`, color: columnsOpen ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setColumnsOpen(value => !value)}><Eye size={13} /> 显示内容</button>
            {columnsOpen && <div className="absolute right-0 top-full z-30 mt-2 w-72 p-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
              <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>列表显示字段</div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{cols.filter(column => !["select", "action", "nickname", "wechatId"].includes(column.key)).map(column => <label key={column.key} className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={isColumnVisible(column.key)} onChange={event => setVisibleColumns(current => event.target.checked ? Array.from(new Set([...current, column.key])) : current.filter(key => key !== column.key))} />{column.label}</label>)}</div>
              <button type="button" className="mt-3 w-full px-2 py-1.5 text-[10px] font-semibold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setVisibleColumns(cols.map(column => column.key))}>显示全部字段</button>
            </div>}
          </div>
          <button type="button" onClick={() => setNotice(`已导出 ${filtered.length} 条微信账号数据`)} className="order-8 flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}><Download size={13} /> 导出</button>
          <button type="button" onClick={() => setNotice("批量导入模板已打开，可导入微信账号数据")} className="order-9 flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}><Upload size={13} /> 批量导入</button>
        </>}
      </div>

      {filtersOpen && <div className="flex items-end gap-3 p-3 flex-shrink-0 flex-wrap" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>地区</span><select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>归属项目</span><select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={projectFilter} onChange={e => { setProjectFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{projects.map(project => <option key={project}>{project}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>归属部门</span><select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={departmentFilter} onChange={e => { setDepartmentFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{departments.map(department => <option key={department}>{department}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>微信号类型</span><select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={accountTypeFilter} onChange={e => { setAccountTypeFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{accountTypes.map(type => <option key={type}>{type}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>服务官</span><select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={serviceFilter} onChange={e => { setServiceFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{serviceOfficers.map(service => <option key={service}>{service}</option>)}</select></label>
        <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>容量与同步</span><select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={capacityFilter} onChange={e => { setCapacityFilter(e.target.value as CapacityFilter); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{["全部", "好友预警", "群容量预警", "同步异常"].map(filter => <option key={filter}>{filter}</option>)}</select></label>
        <div className="mb-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>符合条件 <b style={{ color: S.text }}>{filtered.length}</b> 个账号</div>
        <button type="button" className="ml-auto px-3 py-2 text-xs" style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={clearAdvancedFilters}>重置筛选</button>
      </div>}
      </>

      {selectedRows.length > 0 && <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0 flex-wrap" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}><span className="text-xs font-bold">已选 {selectedRows.length} 个账号</span><button type="button" className="px-2 py-1 text-xs" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => runBulkAction("拉黑")}>批量拉黑</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("删除" )}>批量删除</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("标记活粉")}>标记活粉</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("发起交接审批")}>批量交接审批</button></div>}

      {/* ── 三视角主体渲染 ── */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">
        <div className="flex gap-4 flex-1 min-h-0">

          {/* ① 按账号类型视图 */}
          {viewDimension === "type" && (
            <>
                {wechatBrowseMode === "cards" ? (
                  <div className="flex-1 min-w-0 min-h-0 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <PersonalWechatCards accounts={paged} selectedRow={selectedRow} onSelect={id => { setSelectedRow(id); setDetailMode("view"); setDetailVersion(version => version + 1); }} />
                    <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
                  </div>
                ) : (
                  <div className="flex-1 min-w-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <div className="flex-1 overflow-auto">
                      <div style={{ minWidth: Math.max(680, visibleTableWidth), cursor: draggingCol ? "col-resize" : undefined, userSelect: draggingCol ? "none" : undefined }}>
                        <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f3f4f6", borderBottom: `1px solid ${S.border}` }}>
                          {cols.map(c => {
                            const isDragTarget = draggingCol === c.key;
                            const showHandle = c.key !== "select" && c.key !== "action";
                            return (
                              <div key={c.key} className="relative flex-shrink-0 flex items-center text-[11px] font-semibold tracking-tight" style={columnStyle(c.key, { width: c.w, color: isDragTarget ? S.accent : "#4b5563", fontFamily: "monospace", background: isDragTarget ? "rgba(204,255,0,0.12)" : undefined, boxShadow: isDragTarget ? `inset -1px 0 0 ${S.accent}` : undefined })}>
                                {c.key === "select" ? <input type="checkbox" aria-label="选择当前页账号" checked={paged.length > 0 && paged.every(item => selectedRows.includes(item.no))} onChange={event => setSelectedRows(event.target.checked ? Array.from(new Set([...selectedRows, ...paged.map(item => item.no)])) : selectedRows.filter(item => !paged.some(row => row.no === item)))} /> : <span className="truncate pr-2">{c.label}</span>}
                                {showHandle && (
                                  <span
                                    role="separator"
                                    aria-label={`拖动调整 ${c.label} 列宽`}
                                    title="拖动调整列宽"
                                    className="absolute right-0 top-0 bottom-0 grid place-items-center"
                                    style={{ width: 8, cursor: "col-resize", color: draggingCol === c.key ? S.accent : S.mutedLight, opacity: draggingCol === c.key ? 1 : 0.6, transform: "translateX(50%)" }}
                                    onMouseDown={e => handleColDragStart(e, c.key)}
                                  >
                                    <GripVertical size={12} strokeWidth={2} />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {paged.map(w => <AccountRowForGroups key={w.no} a={w} isSelected={selectedRow === w.no} isColumnVisible={isColumnVisible} columnStyle={columnStyle} visibleTableWidth={visibleTableWidth} risk={getAccountRisk(w)} cols={cols}
                          onToggleSelect={() => toggleRow(w.no)} checked={selectedRows.includes(w.no)}
                          onAdvance={() => advanceLifecycle(w.no)}
                          onPreview={() => setPreviewAccount(w)}
                          onHandover={() => startHandoverApproval(w.no)}
                          onRecycle={() => recycleAccount(w.no)}
                          onArchive={() => archiveAccount(w.no)}
                          onAllocate={() => setAllocationAccount(w)}
                          onClickRow={() => selectedRow === w.no ? setSelectedRow(null) : openAccountDetail(w.no)}
                        />)}
                        {paged.length === 0 && <div className="py-16 text-center text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配账号，请调整筛选条件</div>}
                      </div>
                    </div>
                    <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
                  </div>
                )}
            </>
          )}

          {/* ② 按项目视图：项目分组卡片 + 空闲号池独立分区 */}
          {viewDimension === "project" && (
            <div className="flex-1 min-h-0 overflow-auto space-y-4 pr-1">
            {Object.entries(groupedByProject).map(([projectName, list]) => {
              const isIdlePool = projectName === "空闲号池";
              const open = expandedProjects[projectName] ?? true;
              const total = list.length;
              const 发放到人 = list.filter(a => a.lifecycleStage === "assigned_to_person").length;
              const 待交接 = list.filter(a => a.status === "待交接").length;
              const 养号达标 = list.filter(a => a.lifecycleStage === "nurturing" && a.nurturing.pass).length;
              return (
                <section key={projectName} style={{ background: S.surface, border: `1px solid ${isIdlePool ? "#d1d5db" : S.border}`, borderRadius: S.radius, boxShadow: isIdlePool ? "inset 0 0 0 2px rgba(204,255,0,0.18)" : "none" }}>
                  <header className="flex flex-wrap items-center gap-3 px-4 py-3" style={{ borderBottom: open ? `1px solid ${S.border}` : "none", background: isIdlePool ? "linear-gradient(180deg, rgba(204,255,0,0.08), transparent)" : "#fafafa" }}>
                    <button type="button" onClick={() => toggleProject(projectName)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                      {open ? <ChevronDown size={15} style={{ color: S.muted }} /> : <ChevronRight size={15} style={{ color: S.muted }} />}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 flex items-center justify-center" style={{ background: isIdlePool ? "#ccff00" : "#0d0d0d", color: isIdlePool ? "#000" : "#ccff00", borderRadius: S.radiusSm }}>
                          {isIdlePool ? <ShieldCheck size={16} /> : <Building2 size={16} />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold flex items-center gap-2" style={{ fontFamily: "monospace", color: S.text }}>
                            {projectName}
                            {isIdlePool && <span className="px-1.5 py-0.5 text-[10px]" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>可领取 · 养号池</span>}
                          </div>
                          <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>
                            {isIdlePool ? "未被分配到任何项目的账号，养号达标后可一键分配到项目" : `项目下共 ${total} 个微信账号（含 7 天/好友/实名 养号门槛追踪）`}
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 text-[11px] flex-shrink-0" style={{ fontFamily: "monospace" }}>
                      {!isIdlePool && <><BadgeKPI label="发放到人" value={发放到人} bg="#ccff00" color="#000" /> <BadgeKPI label="待交接审批" value={待交接} bg="#fffbeb" color="#92400e" /></>}
                      {isIdlePool && <><BadgeKPI label="养号达标(可分配)" value={养号达标} bg="#ccff00" color="#000" /> <BadgeKPI label="总在池" value={total} bg="#f3f4f6" color="#374151" /></>}
                      {!isIdlePool && <BadgeKPI label="账号数" value={total} bg="#f3f4f6" color="#374151" />}
                    </div>
                  </header>
                  {open && <div className="p-3 space-y-2">
                    {list.length === 0 && <div className="py-8 text-center text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>暂无账号</div>}
                    {list.map(a => <AccountRowForGroups key={a.no} a={a} isSelected={selectedRow === a.no} isColumnVisible={isColumnVisible} columnStyle={columnStyle} visibleTableWidth={visibleTableWidth} risk={getAccountRisk(a)} cols={cols}
                      onToggleSelect={() => toggleRow(a.no)} checked={selectedRows.includes(a.no)}
                      onAdvance={() => advanceLifecycle(a.no)}
                      onPreview={() => setPreviewAccount(a)}
                      onHandover={() => startHandoverApproval(a.no)}
                      onRecycle={() => recycleAccount(a.no)}
                      onArchive={() => archiveAccount(a.no)}
                      onAllocate={() => setAllocationAccount(a)}
                      onClickRow={() => selectedRow === a.no ? setSelectedRow(null) : openAccountDetail(a.no)}
                    />)}
                  </div>}
                </section>
              );
            })}
          </div>
          )}

          {/* ③ 按人视图：分组头（账号资产中心人员卡片）+ 展开工具 */}
          {viewDimension === "person" && (
          <div className="flex-1 min-h-0 overflow-auto space-y-4 pr-1">
            {Object.entries(groupedByPeople).map(([uidOrIdle, list]) => {
              const person = getPerson(uidOrIdle);
              const open = expandedPeople[uidOrIdle] ?? true;
              const total = list.length;
              const 容量满 = person && person.capacity <= total;
              const 容量预警 = person && total / person.capacity >= 0.8;
              return (
                <section key={uidOrIdle} style={{ background: S.surface, border: `1px solid ${person ? S.border : "#d1d5db"}`, borderRadius: S.radius, boxShadow: !person ? "inset 0 0 0 2px rgba(204,255,0,0.18)" : "none" }}>
                  <header className="flex flex-wrap items-center gap-3 px-4 py-3" style={{ borderBottom: open ? `1px solid ${S.border}` : "none", background: !person ? "linear-gradient(180deg, rgba(204,255,0,0.08), transparent)" : "#fafafa" }}>
                    <button type="button" onClick={() => togglePerson(uidOrIdle)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                      {open ? <ChevronDown size={15} style={{ color: S.muted }} /> : <ChevronRight size={15} style={{ color: S.muted }} />}
                      <div className="flex items-center gap-3 min-w-0">
                        {!person ? (
                          <div className="w-10 h-10 flex items-center justify-center" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}><ShieldCheck size={17} /></div>
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0 overflow-hidden" style={{ borderRadius: S.radiusSm }}><img src={getAvatar(person.avatarIdx)} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-bold flex items-center gap-2 flex-wrap" style={{ fontFamily: "monospace", color: S.text }}>
                            {person ? person.name : "空闲未分配 · 无主账号池"}
                            {!person && <span className="px-1.5 py-0.5 text-[10px]" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>可认领</span>}
                            {person && <span className="px-1.5 py-0.5 text-[10px]" style={{ background: "#f3f4f6", color: "#374151", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{person.role}</span>}
                          </div>
                          <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>
                            {person ? <>部门：{person.dept} · 手机：{person.phone} · 负责项目：{person.projects.join("、") || "—"}</> : "尚未发放到人员，可在分配时选择负责人进行发放"}
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 text-[11px] flex-shrink-0" style={{ fontFamily: "monospace" }}>
                      <BadgeKPI label="名下工具" value={total} bg="#0d0d0d" color="#ccff00" />
                      {person && <><BadgeKPI label="容量用率" value={`${total}/${person.capacity}`} bg={容量满 ? "#fff0f0" : 容量预警 ? "#fff7ed" : "#f3f4f6"} color={容量满 ? "#c53030" : 容量预警 ? "#9a3412" : "#374151"} /> <BadgeKPI label="项目数" value={person.projects.length} bg="#eff6ff" color="#1d4ed8" /></>}
                      {!person && <BadgeKPI label="待认领" value={total} bg="#ccff00" color="#000" />}
                    </div>
                  </header>
                  {open && <div className="p-3 space-y-2">
                    {list.length === 0 && <div className="py-8 text-center text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>暂无账号</div>}
                    {list.map(a => <AccountRowForGroups key={a.no} a={a} isSelected={selectedRow === a.no} isColumnVisible={isColumnVisible} columnStyle={columnStyle} visibleTableWidth={visibleTableWidth} risk={getAccountRisk(a)} cols={cols}
                      onToggleSelect={() => toggleRow(a.no)} checked={selectedRows.includes(a.no)}
                      onAdvance={() => advanceLifecycle(a.no)}
                      onPreview={() => setPreviewAccount(a)}
                      onHandover={() => startHandoverApproval(a.no)}
                      onRecycle={() => recycleAccount(a.no)}
                      onArchive={() => archiveAccount(a.no)}
                      onAllocate={() => setAllocationAccount(a)}
                      onClickRow={() => selectedRow === a.no ? setSelectedRow(null) : openAccountDetail(a.no)}
                    />)}
                  </div>}
                </section>
              );
            })}
          </div>
          )}

          {/* 详情抽屉（三视角共用） */}
          {selectedAccount && (mainTab === "wecom" ? (
            (() => {
              // 从 wecomAccounts 原始企业台账反查：按 no = 9 + wecomId 对应关系（wechatId/nickname === enterprise.wecomId）
              const raw = wecomAccounts.find(e => e.wecomId === selectedAccount.wechatId || String(e.id) === selectedAccount.no.slice(1).replace(/^0+/, ""));
              if (raw) {
                return (
                  <WecomDetail
                    key={`${selectedAccount.no}-${detailVersion}`}
                    account={raw}
                    onClose={() => { setSelectedRow(null); setDetailMode("view"); }}
                    onAction={runAccountAction}
                  />
                );
              }
              // 兜底：用 PersonalAccount 适配成 wecomAccounts 形状避免白屏
              const fallback = {
                id: Number(selectedAccount.no) || 0,
                wecomId: selectedAccount.wechatId,
                corpId: "—",
                linkedPersonal: "—",
                admin: selectedAccount.opsManager || "—",
                dept: selectedAccount.department || "—",
                members: selectedAccount.friendCount || 0,
                memberCapacity: 2000,
                groupCapacity: 20,
                groups: Array.isArray(selectedAccount.groupQrNames) ? selectedAccount.groupQrNames : [],
                status: selectedAccount.status,
                syncStatus: selectedAccount.lastLogin ? (selectedAccount.status === "异常" ? "同步失败" : "已同步") : "未启用",
                lastSync: selectedAccount.lastLogin || "—",
                city: selectedAccount.city || "—",
                note: "",
              } as typeof wecomAccounts[number];
              return (
                <WecomDetail
                  key={`${selectedAccount.no}-${detailVersion}`}
                  account={fallback}
                  onClose={() => { setSelectedRow(null); setDetailMode("view"); }}
                  onAction={runAccountAction}
                />
              );
            })()
          ) : (
            <PersonalWechatDetail
              key={`${selectedAccount.no}-${detailVersion}`}
              account={selectedAccount}
              startEditing={detailMode === "edit"}
              onClose={() => { setSelectedRow(null); setDetailMode("view"); }}
              onAction={runAccountAction}
              onUpdate={updateAccount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 辅助小组件：分组视图下统一的账号行 ───
function BadgeKPI({ label, value, bg, color }: { label: string; value: number | string; bg: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: bg, color, borderRadius: S.radiusSm }}>
      <span className="text-[10px]" style={{ opacity: 0.7 }}>{label}</span>
      <b className="text-[11px]">{value}</b>
    </div>
  );
}
function AccountRowForGroups({
  a, isColumnVisible, columnStyle, visibleTableWidth, risk, isSelected, checked,
  onToggleSelect, onAdvance, onPreview, onHandover, onRecycle, onArchive, onAllocate, onClickRow,
}: {
  a: PersonalAccount;
  isColumnVisible: (key: string) => boolean;
  columnStyle: (key: string, style: Record<string, string | number>) => any;
  visibleTableWidth: number;
  risk: ReturnType<typeof getAccountRisk>;
  isSelected: boolean;
  checked: boolean;
  onToggleSelect: () => void;
  onAdvance: () => void;
  onPreview: () => void;
  onHandover: () => void;
  onRecycle: () => void;
  onArchive: () => void;
  onAllocate: () => void;
  onClickRow: () => void;
}) {
  const lc = lifecycleCfg[a.lifecycleStage];
  const syncLabel = risk.isSyncRisk ? "需核查" : a.status === "未使用" ? "未启用" : "正常";
  const syncColor = risk.isSyncRisk ? "#c2410c" : a.status === "未使用" ? S.muted : "#276749";
  const tint = rowTintByStatus[a.status] || rowTintByStatus["未使用"];
  const selBg = tint.bg === "#f0fff4" ? "#dcfce7" : tint.bg === "#fff0f0" ? "#fee2e2" : tint.bg === "#fffbeb" ? "#fef3c7" : tint.bg === "#f5f5f5" ? "#e9e9e9" : S.accentLight;
  const rowBg = isSelected ? selBg : tint.bg;
  const rowFontWeight = isSelected ? 700 : 500;
  return (
    <div role="button" tabIndex={0} className="flex items-center w-full text-left cursor-pointer transition-all" style={{ background: rowBg, borderBottom: `1px solid ${isSelected ? S.accent : S.border}`, borderLeft: isSelected ? `3px solid ${S.accent}` : `3px solid ${tint.dot}`, paddingTop: 15, paddingBottom: 15, paddingLeft: 16, paddingRight: 16, fontWeight: rowFontWeight as any }} onClick={onClickRow} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClickRow(); } }}>
      <div style={{ minWidth: Math.max(680, visibleTableWidth) }} className="w-full flex items-center">
        <div className="flex-shrink-0 flex items-center justify-center" style={columnStyle("select", { width: 24 })}><input type="checkbox" aria-label={`选择 ${a.wechatId}`} checked={checked} onClick={e => e.stopPropagation()} onChange={onToggleSelect} /></div>
        <div className="flex-shrink-0 text-[10px]" style={columnStyle("no", { width: 36, color: S.muted, fontFamily: "monospace" })}>{a.no}</div>
        <div className="flex-shrink-0" style={columnStyle("lifecycle", { width: 62 })}><button type="button" title={`入库 ${a.nurturing.daysSinceOnboard} 天 · 7天:${a.nurturing.day7Pass ? "✓" : "✗"} · 好友≥200:${a.nurturing.friendGatePass ? "✓" : "✗"} · 实名:${a.nurturing.certGatePass ? "✓" : "✗"} · 风控命中 ${a.nurturing.riskHits} · 点此推进`} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px]" style={{ background: lc.bg, color: lc.color, border: `1px solid ${lc.border}`, borderRadius: 999, fontFamily: "monospace", lineHeight: 1.2 }} onClick={e => { e.stopPropagation(); onAdvance(); }}><span style={{ width: 4, height: 4, background: lc.dot, borderRadius: 99 }} />{lc.label}</button></div>
        <div className="flex-shrink-0 flex items-center gap-1" style={columnStyle("status", { width: 54 })}><span style={{ width: 7, height: 7, background: tint.dot, borderRadius: 99, flexShrink: 0 }} /><span className="text-[10px] font-semibold" style={{ color: tint.text, fontFamily: "monospace" }}>{tint.label}</span></div>
        <div className="flex-shrink-0" style={columnStyle("avatar", { width: 40 })}>{a.status === "未使用" ? <div className="w-6 h-6 grid place-items-center" style={{ background: "#f0f0ec", borderRadius: 6, color: S.muted }}><MessageCircle size={12} /></div> : <img src={getAvatar(parseInt(a.no) - 1)} alt={a.nickname} style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover" }} />}</div>
        <div className="flex-shrink-0 min-w-0 whitespace-nowrap text-[11px]" title={a.nickname} style={columnStyle("nickname", { width: 88, color: S.textSec, fontFamily: "monospace" })}>{a.nickname === "—" ? "待配置" : a.nickname}</div>
        <div className="flex-shrink-0 min-w-0 whitespace-nowrap text-[11px] font-semibold" title={a.wechatId} style={columnStyle("wechatId", { width: 94, color: S.text, fontFamily: "monospace" })}>{a.wechatId}{a.approvalRef && <span className="ml-1 text-[9px]" style={{ color: "#92400e" }}>·{a.approvalRef}</span>}</div>
        <div className="flex-shrink-0 min-w-0 truncate text-[11px]" style={columnStyle("project", { width: 82, color: a.project === "待配置" ? S.muted : S.textSec, fontFamily: "monospace" })}>{a.project}</div>
        <div className="flex-shrink-0 text-[10px]" style={columnStyle("type", { width: 56, color: S.textSec, fontFamily: "monospace" })}>{a.accountType}</div>
        <div className="flex-shrink-0 min-w-0 truncate text-[11px]" style={columnStyle("owner", { width: 70, color: S.textSec, fontFamily: "monospace" })}>{a.serviceOfficer}</div>
        <div className="flex-shrink-0 min-w-0 truncate text-[10px]" style={columnStyle("department", { width: 86, color: S.muted, fontFamily: "monospace" })}>{a.department}</div>
        <div className="flex-shrink-0 min-w-0 truncate text-[10px]" title={`${a.region} / ${a.city}`} style={columnStyle("region", { width: 70, color: S.textSec, fontFamily: "monospace" })}>{[a.region, a.city].filter(v => v !== "—").join("/") || "—"}</div>
        <div className="flex-shrink-0 min-w-0 truncate text-[10px]" title={a.city} style={columnStyle("city", { width: 70, color: S.textSec, fontFamily: "monospace" })}>{a.city}</div>
        <div className="flex-shrink-0" style={columnStyle("friendCount", { width: 78 })}><b className="text-[10px]" style={{ color: risk.isFriendRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{a.friendCount.toLocaleString()}</b><span className="text-[9px]" style={{ color: S.muted, fontFamily: "monospace" }}> / 2k</span><div className="mt-0.5 h-[3px] overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.friendRate * 100, a.friendCount ? 4 : 0)}%`, height: "100%", background: risk.isFriendRisk ? "#f59e0b" : S.accent }} /></div></div>
        <div className="flex-shrink-0 text-[10px]" style={columnStyle("blocked", { width: 52, color: S.textSec, fontFamily: "monospace" })}>{a.blockedCount}</div>
        <div className="flex-shrink-0 text-[10px]" style={columnStyle("deleted", { width: 52, color: S.textSec, fontFamily: "monospace" })}>{a.deletedCount}</div>
        <div className="flex-shrink-0 text-[10px] font-medium" style={columnStyle("normalFans", { width: 60, color: S.textSec, fontFamily: "monospace" })}>{a.normalFans.toLocaleString()}</div>
        <div className="flex-shrink-0" style={columnStyle("groups", { width: 66 })}><b className="text-[10px]" style={{ color: risk.isGroupRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{a.groupCount}/{Math.max(20, a.groupQrNames.length)}</b><div className="mt-0.5 h-[3px] overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.groupRate * 100, a.groupCount ? 4 : 0)}%`, height: "100%", background: risk.isGroupRisk ? "#f59e0b" : S.accent }} /></div></div>
        <div className="flex-shrink-0" style={columnStyle("sync", { width: 66 })}><span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px]" style={{ background: risk.isSyncRisk ? "#fff7ed" : a.status === "未使用" ? "#f5f5f5" : "#f0fff4", color: syncColor, borderRadius: 999, fontFamily: "monospace" }}>{risk.isSyncRisk && <AlertTriangle size={9} />}{syncLabel}</span></div>
        <div className="flex-shrink-0 text-[10px]" style={columnStyle("updated", { width: 64, color: S.muted, fontFamily: "monospace" })}>{a.lastLogin}</div>
        <div className="flex-shrink-0 flex items-center gap-[3px] whitespace-nowrap" style={columnStyle("action", { width: 168 })}>
          <button type="button" title="预览账号详情" className="inline-flex items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-medium rounded-[5px]" style={{ background: S.surface, color: "#4b5563", border: `1px solid ${S.borderMed}`, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); onPreview(); }}><Eye size={10} />预览</button>
          {a.lifecycleStage === "assigned_to_person" && <button type="button" title="发起交接审批" className="inline-flex items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-semibold rounded-[5px]" style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); onHandover(); }}><ArrowRight size={10} />交接</button>}
          {a.lifecycleStage === "assigned_to_person" && <button type="button" title="一键回收账号" className="inline-flex items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-semibold rounded-[5px]" style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); onRecycle(); }}><RotateCcw size={10} />回收</button>}
          <button type="button" title="归档停用账号" className="inline-flex items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-medium rounded-[5px]" style={{ background: S.surface, color: "#4b5563", border: `1px solid ${S.borderMed}`, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); onArchive(); }}><History size={10} />归档</button>
          <button type="button" title="分配到项目/人" className="inline-flex items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-bold rounded-[5px]" style={{ background: "#0d0d0d", color: S.accent, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); onAllocate(); }}><Plus size={10} />分配</button>
        </div>
      </div>
    </div>
  );
}
