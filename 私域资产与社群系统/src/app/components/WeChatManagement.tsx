import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, ChevronLeft, ChevronRight, Upload, Building2, Users, MessageCircle, ArrowRight, Link, QrCode, Download, Copy, List, LayoutGrid, AlertTriangle, SlidersHorizontal, Edit3, Eye, EyeOff, ShieldCheck, LockKeyhole, History, CheckCircle2 } from "lucide-react";
import { useCommunityData } from "../data/communityDataStore";

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
  { no: "00001", wechatId: "fengle_bj_01", phone: "138-0012-3456", status: "使用中", nickname: "蜂乐·吴思远", gender: "男", qqNo: "287634521", boundEmail: "wsy@fenglema.com", opsManager: "吴思远", memberManager: "张明", certified: true, invitedNew: 42, scanCount: 386, friendCount: 1823, city: "北京", project: "北京PRO服务", lastLogin: "2026-07-05", groupCount: 16, isInitiator: true, targetGroup: "北京PRO会员群01", targetGroupCount: 3, credential: "已认证" },
  { no: "00002", wechatId: "fengle_sh_01", phone: "139-0012-3457", status: "使用中", nickname: "蜂乐·林小燕", gender: "女", qqNo: "345782910", boundEmail: "lxy@fenglema.com", opsManager: "林小燕", memberManager: "王静", certified: true, invitedNew: 38, scanCount: 312, friendCount: 356, city: "上海", project: "上海体验官", lastLogin: "2026-07-05", groupCount: 2, isInitiator: true, targetGroup: "上海体验官群01", targetGroupCount: 2, credential: "已认证" },
  { no: "00003", wechatId: "fengle_gz_01", phone: "138-0012-3458", status: "异常", nickname: "蜂乐·刘刚", gender: "男", qqNo: "412893047", boundEmail: "lg@fenglema.com", opsManager: "刘刚", memberManager: "陈强", certified: false, invitedNew: 21, scanCount: 187, friendCount: 234, city: "广州", project: "广州代理培训", lastLogin: "2026-06-05", groupCount: 1, isInitiator: false, targetGroup: "广州代理群", targetGroupCount: 1, credential: "未认证" },
  { no: "00004", wechatId: "fengle_cd_01", phone: "152-0012-3461", status: "待交接", nickname: "蜂乐·赵志远", gender: "男", qqNo: "523019483", boundEmail: "zzr@fenglema.com", opsManager: "赵志远", memberManager: "—", certified: false, invitedNew: 9, scanCount: 67, friendCount: 67, city: "成都", project: "成都分站", lastLogin: "2026-07-01", groupCount: 1, isInitiator: false, targetGroup: "成都分站群", targetGroupCount: 1, credential: "未认证" },
  { no: "00005", wechatId: "fengle_sz_01", phone: "186-0012-3462", status: "使用中", nickname: "蜂乐·李梦华", gender: "女", qqNo: "634102938", boundEmail: "lmh@fenglema.com", opsManager: "李梦华", memberManager: "刘芳", certified: true, invitedNew: 31, scanCount: 278, friendCount: 310, city: "深圳", project: "深圳代理", lastLogin: "2026-07-04", groupCount: 2, isInitiator: true, targetGroup: "深圳代理群", targetGroupCount: 2, credential: "已认证" },
  { no: "00006", wechatId: "fengle_hz_01", phone: "158-0012-3464", status: "使用中", nickname: "蜂乐·陈明", gender: "男", qqNo: "745293018", boundEmail: "cm@fenglema.com", opsManager: "陈明", memberManager: "孙晨", certified: true, invitedNew: 18, scanCount: 134, friendCount: 140, city: "杭州", project: "杭州分站", lastLogin: "2026-07-05", groupCount: 1, isInitiator: true, targetGroup: "杭州会员群", targetGroupCount: 1, credential: "已认证" },
  { no: "00007", wechatId: "fengle_bj_02", phone: "135-0012-3463", status: "库存", nickname: "—", gender: "—", qqNo: "—", boundEmail: "—", opsManager: "—", memberManager: "—", certified: false, invitedNew: 0, scanCount: 0, friendCount: 0, city: "—", project: "—", lastLogin: "—", groupCount: 0, isInitiator: false, targetGroup: "—", targetGroupCount: 0, credential: "—" },
  { no: "00008", wechatId: "fengle_wh_01", phone: "137-0012-3466", status: "使用中", nickname: "蜂乐·王芳", gender: "女", qqNo: "856304721", boundEmail: "wf@fenglema.com", opsManager: "王芳", memberManager: "李新", certified: false, invitedNew: 14, scanCount: 98, friendCount: 120, city: "武汉", project: "武汉分站", lastLogin: "2026-07-03", groupCount: 1, isInitiator: false, targetGroup: "武汉分站群", targetGroupCount: 1, credential: "未认证" },
  { no: "00009", wechatId: "fengle_nj_01", phone: "189-0012-3467", status: "使用中", nickname: "蜂乐·张磊", gender: "男", qqNo: "967415830", boundEmail: "zl@fenglema.com", opsManager: "张磊", memberManager: "周琳", certified: true, invitedNew: 27, scanCount: 215, friendCount: 198, city: "南京", project: "南京分站", lastLogin: "2026-07-05", groupCount: 2, isInitiator: true, targetGroup: "南京会员群01", targetGroupCount: 2, credential: "已认证" },
  { no: "00010", wechatId: "fengle_xa_01", phone: "177-0012-3468", status: "待交接", nickname: "蜂乐·孙浩", gender: "男", qqNo: "108526394", boundEmail: "sh@fenglema.com", opsManager: "孙浩（离职）", memberManager: "—", certified: false, invitedNew: 8, scanCount: 45, friendCount: 89, city: "西安", project: "西安分站", lastLogin: "2026-06-20", groupCount: 1, isInitiator: false, targetGroup: "西安分站群", targetGroupCount: 1, credential: "未认证" },
].map((item, index) => ({
  ...item,
  accountType: ["客服号", "招商号", "客服号", "招商号", "客服号"][index % 5],
  department: item.city === "—" ? "—" : `${item.city}服务中心`,
  region: item.city === "—" ? "—" : ({ 北京: "华北", 上海: "华东", 广州: "华南", 深圳: "华南", 成都: "西南", 杭州: "华东", 武汉: "华中", 南京: "华东", 西安: "西北" } as Record<string, string>)[item.city] || "其他",
  serviceOfficer: item.opsManager,
  normalFans: Math.max(0, item.friendCount - index * 19),
  blockedCount: index * 3,
  deletedCount: index * 2,
  wechatPassword: item.status === "库存" ? "" : "Fengle@2026",
  idCard: item.status === "库存" ? "" : "110101********1234",
  bankCard: item.status === "库存" ? "" : "6222********8899",
  qqPassword: item.qqNo === "—" ? "" : "QQ@2026",
  qqSecurity: item.qqNo === "—" ? "" : "已配置",
  emailPassword: item.boundEmail === "—" ? "" : "Mail@2026",
  emailSecurity: item.boundEmail === "—" ? "" : "已配置",
  emergencyContacts: [
    { name: index === 0 ? "林小燕" : "值班联系人", note: "紧急交接与安全核验", qr: true },
    { name: index === 0 ? "陈明" : "区域负责人", note: "账号异常与登录告警", qr: true },
    { name: index === 0 ? "王总" : "平台管理员", note: "最终安全审批", qr: true },
  ],
}));

const statusCfg: Record<string, { bg: string; color: string }> = {
  "使用中": { bg: "#f0fff4", color: "#276749" },
  "异常":   { bg: "#fff0f0", color: "#c53030" },
  "待交接": { bg: "#fffbeb", color: "#b45309" },
  "库存":   { bg: "#f5f5f5", color: "#888888" },
  "未启用": { bg: "#f5f5f5", color: "#777777" },
  "已停用": { bg: "#f5f5f5", color: "#777777" },
  "已归档": { bg: "#f0f0ec", color: "#888888" },
};

const PAGE_SIZE = 20;
type BrowseMode = "list" | "cards";
type PersonalAccount = typeof mockWechats[number];
type CapacityFilter = "全部" | "好友预警" | "群容量预警" | "同步异常";

function getAccountRisk(account: PersonalAccount) {
  const friendRate = account.friendCount / 2000;
  const groupRate = account.groupCount / 20;
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
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "其他"];
  const inputStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const field = (label: string, key: string, placeholder = "请输入", type = "text") => <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</span><input type={type} className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} placeholder={placeholder} value={(form as any)[key]} onChange={e => set(key, e.target.value)} /></label>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-[min(720px,calc(100vw-32px))] overflow-hidden" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}><div><div className="font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>录入微信号</div><div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>先录入资产，再完成归属与群绑定</div></div><button type="button" aria-label="关闭录入微信号" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button></div>
      <div className="flex gap-1 px-6 pt-4" role="tablist" aria-label="微信号录入步骤">{[[1,"微信信息"],[2,"绑定人与安全"],[3,"归属与群绑定"]].map(([number,label]) => <button key={number} type="button" role="tab" aria-selected={step === number} onClick={() => setStep(number as number)} className="flex-1 py-2 text-xs font-bold" style={{ background: step === number ? "#0d0d0d" : "#f5f5f5", color: step === number ? S.accent : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{number}. {label}</button>)}</div>
      <div className="p-6 space-y-4" style={{ maxHeight: "68vh", overflowY: "auto" }}>
        {step === 1 && <>
          <div className="grid grid-cols-2 gap-4">{field("编号", "no", "如 00011")}{field("微信号", "wechatId", "如 fengle_bj_03")}{field("微信昵称", "nickname", "如 蜂乐·张三")}{field("绑定手机号", "phone", "138-xxxx-xxxx")}{field("微信密码", "wechatPassword", "仅授权人员可见", "password")}<label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>账号类型</span><select className="w-full px-3 py-2 text-xs outline-none" style={inputStyle} value={form.accountType} onChange={e => set("accountType", e.target.value)}>{["客服号","招商号","运营号"].map(v => <option key={v}>{v}</option>)}</select></label></div>
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
function AuthorizedWechatModal({ onClose }: { onClose: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState({ no: "", wechatId: "", phone: "", nickname: "", wechatPassword: "", qqNo: "", qqPassword: "", qqSecurity: "", boundEmail: "", emailPassword: "", emailSecurity: "", ownerName: "", idCard: "", bankCard: "", opsManager: "", memberManager: "", city: "", region: "", department: "", project: "", accountType: "客服号", status: "库存" });
  const [contacts, setContacts] = useState(["", "", ""]);
  const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "其他"];
  const inputStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));
  const field = (label: string, key: string, placeholder = "请输入", type = "text") => <label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>{label}</span><input disabled={!authorized} type={type} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} placeholder={placeholder} value={(form as any)[key]} onChange={event => set(key, event.target.value)} /></label>;
  const section = (title: string, hint: string) => <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-sm font-bold"><span style={{ width: 3, height: 15, background: S.accent, borderRadius: 99 }} />{title}</div><span className="text-[10px]" style={{ color: S.muted }}>{hint}</span></div>;
  const authorize = () => {
    setAuthorized(true);
    setForm(current => ({ ...current, no: "00011", wechatId: "fengle_bj_03", nickname: "蜂乐·吴思远", phone: "138-0012-3456", project: "北京PRO服务", city: "北京", region: "华北", department: "北京服务中心", ownerName: "吴思远", opsManager: "吴思远", memberManager: "张明" }));
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-[min(1080px,calc(100vw-24px))] overflow-hidden" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}><div><div className="font-semibold">新建微信号</div><div className="text-xs mt-1" style={{ color: S.muted }}>先扫码授权登录，获取微信资料后再补充账号安全与归属信息</div></div><button type="button" aria-label="关闭录入微信号" onClick={onClose}><X size={16} style={{ color: S.muted }} /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-[264px_minmax(0,1fr)]" style={{ maxHeight: "80vh" }}>
        <aside className="p-5 flex flex-col gap-4" style={{ background: "#fbfbfb", borderRight: `1px solid ${S.border}` }}>
          <div className="flex items-center justify-between"><span className="text-sm font-bold">微信扫码授权</span><span className="px-2 py-1 text-[10px] font-bold" style={{ background: authorized ? "#f0fff4" : "#fff8e8", color: authorized ? "#276749" : "#9a5a00", borderRadius: S.radiusSm }}>{authorized ? "已授权" : "待扫码"}</span></div>
          <div className="p-3 flex items-center justify-center" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}><img src="/zhuliren-final/assets/addwechat-reference-qr.png" alt="微信授权二维码" style={{ width: 206, height: 206, objectFit: "contain" }} /></div>
          <div className="text-center"><div className="text-xs font-bold">{authorized ? "授权成功，可继续填写" : "微信扫描二维码进入"}</div><div className="text-[10px] mt-1 leading-relaxed" style={{ color: S.muted }}>请使用待录入微信扫码，授权成功后系统自动读取微信昵称、微信号和头像。</div></div>
          <div className="p-3 space-y-2" style={{ background: authorized ? S.accentLight : "#fff8e8", border: `1px solid ${authorized ? S.accentMid : "#f2d6a0"}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold" style={{ color: authorized ? "#276749" : "#9a5a00" }}>{authorized ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}{authorized ? "身份已确认" : "授权前不会写入账号"}</div><div className="text-[10px] leading-relaxed" style={{ color: S.muted }}>{authorized ? "自动读取字段可修改，敏感字段仍需人工补充。" : "二维码仅用于本次登录授权，不会直接保存密码。"}</div></div>
          {!authorized ? <button type="button" className="w-full py-2.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }} onClick={authorize}>确认已扫码授权</button> : <button type="button" className="w-full py-2.5 text-xs font-bold" style={{ background: "#fff", color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }} onClick={() => setAuthorized(false)}>重新扫码授权</button>}
        </aside>
        <div className="min-w-0 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between px-3 py-2" style={{ background: authorized ? S.accentLight : "#f5f5f5", border: `1px solid ${authorized ? S.accentMid : S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-xs font-bold">{authorized ? <CheckCircle2 size={14} style={{ color: "#276749" }} /> : <LockKeyhole size={14} style={{ color: S.muted }} />}{authorized ? "微信资料已获取，请继续完善表单" : "完成扫码授权后解锁表单"}</div><span className="text-[10px]" style={{ color: S.muted }}>必填项标记 *</span></div>
          <section className="space-y-3">{section("微信信息", "授权字段可修改")}<div className="grid grid-cols-1 lg:grid-cols-[96px_1fr] gap-4"><div className="flex flex-col items-center gap-2"><div className="w-20 h-20 overflow-hidden" style={{ background: "#f0f0f0", borderRadius: S.radius }}>{authorized && <img src={getAvatar(0)} alt="微信头像" className="w-full h-full object-cover" />}</div><span className="text-[10px]" style={{ color: S.muted }}>微信头像</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{field("微信昵称", "nickname", "授权后自动获取")}{field("微信号 *", "wechatId", "授权后自动获取")}{field("微信密码", "wechatPassword", "仅授权人员可见", "password")}<label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>账号类型</span><select disabled={!authorized} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} value={form.accountType} onChange={event => set("accountType", event.target.value)}>{["客服号", "招商号", "运营号"].map(value => <option key={value}>{value}</option>)}</select></label></div></div><div className="flex items-center gap-3 px-3 py-2.5" style={{ border: `1px dashed ${S.borderMed}`, background: "#f7f7f7", borderRadius: S.radiusSm, opacity: authorized ? 1 : 0.56 }}><Upload size={14} /><span className="text-xs">补充头像或微信二维码</span><span className="ml-auto text-[10px]" style={{ color: S.muted }}>PNG / JPG</span></div></section>
          <section className="space-y-3">{section("绑定人信息", "敏感资料保存后脱敏")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("绑定人姓名", "ownerName")}{field("绑定人手机", "phone", "138-xxxx-xxxx")}{field("身份证号", "idCard", "敏感资料，保存后脱敏")}{field("银行卡号", "bankCard", "敏感资料，保存后脱敏")}</div></section>
          <section className="space-y-3">{section("QQ / 邮箱绑定信息", "可选")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("绑定QQ", "qqNo")}{field("QQ密码", "qqPassword", "仅授权人员可见", "password")}{field("QQ密保", "qqSecurity")}{field("绑定邮箱", "boundEmail")}{field("邮箱密码", "emailPassword", "仅授权人员可见", "password")}{field("邮箱密保", "emailSecurity")}</div></section>
          <section className="space-y-3">{section("紧急联系人信息", "3位微信联系人")}<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{contacts.map((contact, index) => <div key={index} className="p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-xs font-bold mb-2">联系人 {index + 1}</div><input disabled={!authorized} className="w-full px-2.5 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} placeholder="微信联系人姓名" value={contact} onChange={event => setContacts(items => items.map((item, i) => i === index ? event.target.value : item))} /><div className="mt-2 text-[10px]" style={{ color: S.muted }}>二维码与备注可在个人安全中补充</div></div>)}</div></section>
          <section className="space-y-3">{section("归属与运营信息", "用于自动分配群组与客服")}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{field("归属项目", "project", "如 北京PRO服务")}{field("归属员工", "opsManager", "服务负责人")}{field("会员负责人", "memberManager")}{field("归属部门", "department", "如 北京服务中心")}{field("归属大区", "region", "如 华北")}<label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>城市分站</span><select disabled={!authorized} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} value={form.city} onChange={event => set("city", event.target.value)}><option value="">请选择</option>{cities.map(city => <option key={city}>{city}</option>)}</select></label><label className="block"><span className="block text-xs mb-1.5" style={{ color: S.muted }}>初始状态</span><select disabled={!authorized} className="w-full px-3 py-2 text-xs outline-none disabled:cursor-not-allowed" style={{ ...inputStyle, opacity: authorized ? 1 : 0.56 }} value={form.status} onChange={event => set("status", event.target.value)}>{["库存", "未启用", "使用中", "待交接"].map(status => <option key={status}>{status}</option>)}</select></label></div><div className="flex items-center gap-2 text-[10px]" style={{ color: S.muted }}><QrCode size={13} />授权成功后可在详情中绑定最多 20 个微信群</div></section>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ borderTop: `1px solid ${S.border}` }}><span className="text-[10px]" style={{ color: S.muted }}>{authorized ? "资料已授权，确认后账号进入库存状态" : "请先完成二维码授权"}</span><div className="flex gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>取消</button><button type="button" disabled={!authorized} onClick={onClose} className="px-6 py-2.5 text-sm font-bold disabled:cursor-not-allowed" style={{ background: authorized ? "#0d0d0d" : "#ddd", color: authorized ? S.accent : "#888", borderRadius: S.radius }}>确认录入</button></div></div>
    </div>
  </div>;
}

// ─── 企业微信数据 ─────────────────────────────────────────────
const wecomAccounts = [
  { id: 1, wecomId: "蜂乐玛企微-吴思远", corpId: "ww_fenglema_bj", linkedPersonal: "fengle_bj_01", admin: "吴思远", dept: "北京服务中心", members: 487, memberCapacity: 2000, groupCapacity: 20, groups: ["北京PRO企微群", "北京体验官企微群", "内部协作群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "北京", note: "负责北京所有PRO用户的企微添加和群管理" },
  { id: 2, wecomId: "蜂乐玛企微-林小燕", corpId: "ww_fenglema_sh", linkedPersonal: "fengle_sh_01", admin: "林小燕", dept: "上海服务中心", members: 356, memberCapacity: 2000, groupCapacity: 20, groups: ["上海PRO企微群", "上海体验官企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "上海", note: "负责上海用户的企微双微信管理" },
  { id: 3, wecomId: "蜂乐玛企微-刘刚", corpId: "ww_fenglema_gz", linkedPersonal: "fengle_gz_01", admin: "刘刚", dept: "广州服务中心", members: 234, memberCapacity: 2000, groupCapacity: 20, groups: ["广州代理企微群"], status: "异常", syncStatus: "同步失败", lastSync: "2026-06-05", city: "广州", note: "企微30天未登录，与个人微信同步失败" },
  { id: 4, wecomId: "蜂乐玛企微-李梦华", corpId: "ww_fenglema_sz", linkedPersonal: "fengle_sz_01", admin: "李梦华", dept: "深圳服务中心", members: 310, memberCapacity: 2000, groupCapacity: 20, groups: ["深圳代理企微群", "深圳游客企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-04", city: "深圳", note: "" },
  { id: 5, wecomId: "蜂乐玛企微-陈明", corpId: "ww_fenglema_hz", linkedPersonal: "fengle_hz_01", admin: "陈明", dept: "杭州服务中心", members: 140, memberCapacity: 2000, groupCapacity: 20, groups: ["杭州会员企微群"], status: "使用中", syncStatus: "已同步", lastSync: "2026-07-05", city: "杭州", note: "" },
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
          <span>企业微信账号</span><span>绑定个人微信</span><span>项目 / 地区</span><span>服务负责人</span><span>成员容量</span><span>管理群位</span><span>同步状态</span><span>最近同步</span><span>二维码</span><span>状态</span><span>操作</span>
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
            {[['绑定个微', account.linkedPersonal], ['运营范围', `${account.city} · ${account.dept}`], ['成员容量', `${account.members.toLocaleString()} / ${account.memberCapacity.toLocaleString()}`], ['管理群位', `${account.groups.length} / ${account.groupCapacity} 群`]].map(([label, value]) => <div key={label} className="px-3 py-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-1 truncate text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div></div>)}
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
          const isStock = w.status === "库存";
          return (
            <button
              key={w.no}
              type="button"
              onClick={() => onSelect(isSelected ? null : w.no)}
              className="p-4 text-left transition-all"
              style={{ background: isSelected ? S.accentLight : S.surface, border: isSelected ? `1px solid ${S.accent}` : `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
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

function CapacityMeter({ label, value, max, warning }: { label: string; value: number; max: number; warning: boolean }) {
  const rate = Math.min(value / max, 1);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs" style={{ fontFamily: "monospace" }}>
        <span style={{ color: S.muted }}>{label}</span>
        <b style={{ color: warning ? "#c2410c" : S.text }}>{value.toLocaleString()} / {max.toLocaleString()}</b>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}>
        <div style={{ width: `${Math.max(rate * 100, value ? 4 : 0)}%`, height: "100%", background: warning ? "#f59e0b" : S.accent, borderRadius: 99 }} />
      </div>
    </div>
  );
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

function PersonalWechatDetail({ account, onClose, onAction, startEditing = false }: { account: PersonalAccount; onClose: () => void; onAction: (message: string) => void; startEditing?: boolean }) {
  const risk = getAccountRisk(account);
  const isStock = account.status === "库存";
  const status = statusCfg[account.status] || { bg: "#f5f5f5", color: "#888" };
  const syncStatus = risk.isSyncRisk ? "需核查" : account.status === "库存" ? "未启用" : "同步正常";
  const syncStyle = risk.isSyncRisk ? { bg: "#fff7ed", color: "#c2410c" } : account.status === "库存" ? { bg: "#f5f5f5", color: "#777" } : { bg: "#f0fff4", color: "#276749" };
  const [editing, setEditing] = useState(startEditing);
  const [detailTab, setDetailTab] = useState<"profile" | "binding" | "operations" | "security">("profile");
  const [securityDraft, setSecurityDraft] = useState({ loginAlert: true, twoFactor: true, recoveryEmail: account.boundEmail === "—" ? "" : account.boundEmail });
  const [showPassword, setShowPassword] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [saved, setSaved] = useState({ project: account.project, city: account.city, opsManager: account.opsManager, memberManager: account.memberManager, targetGroup: account.targetGroup, nickname: account.nickname, gender: account.gender, phone: account.phone, qqNo: account.qqNo, boundEmail: account.boundEmail });
  const [draft, setDraft] = useState(saved);
  const [editError, setEditError] = useState("");
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const cancelEdit = () => { setDraft(saved); setEditError(""); setEditing(false); };
  const saveEdit = () => {
    if (!draft.project.trim() || !draft.city.trim() || !draft.opsManager.trim()) {
      setEditError("请补全归属项目、城市和运营负责人");
      return;
    }
    setSaved(draft);
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
    <aside className="w-[400px] flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="个人微信详情">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表账号后查看与调度</div>
        </div>
        <button type="button" title="关闭详情" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }} onClick={onClose}><X size={14} /></button>
      </div>
      <div className="px-4 pt-3 flex gap-1 flex-shrink-0" role="tablist" aria-label="个人微信详情标签">
        {[["profile", "账号资料"], ["binding", "绑定分配"], ["operations", "运营数据"], ["security", "个人安全"]].map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={detailTab === key} onClick={() => setDetailTab(key as "profile" | "binding" | "operations" | "security")} className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold" style={{ background: detailTab === key ? "#0d0d0d" : "#f5f5f5", color: detailTab === key ? S.accent : S.muted, border: `1px solid ${detailTab === key ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
            {key === "security" ? <ShieldCheck size={12} /> : key === "binding" ? <Link size={12} /> : key === "operations" ? <History size={12} /> : <MessageCircle size={12} />}{label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          {isStock ? <div className="w-12 h-12 grid place-items-center" style={{ background: "#f0f0ec", borderRadius: S.radiusSm, color: S.muted }}><MessageCircle size={18} /></div> : <img src={getAvatar(parseInt(account.no) - 1)} alt={account.nickname} style={{ width: 48, height: 48, borderRadius: S.radiusSm, objectFit: "cover" }} />}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap"><b className="text-sm truncate" style={{ color: S.text, fontFamily: "monospace" }}>{isStock ? "备用微信号" : account.nickname}</b><span className="px-1.5 py-0.5 text-xs" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{account.status}</span></div>
            <div className="mt-1 text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{account.wechatId}</div>
            <div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.no} · {account.phone}</div>
          </div>
          <button type="button" title="更新群二维码" className="w-9 h-9 grid place-items-center" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => onAction(`${account.wechatId} 的二维码更新入口已打开`)}><QrCode size={17} /></button>
        </div>

        {detailTab === "profile" && (risk.isRisk || account.status === "待交接") && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {account.status === "待交接" ? "账号待交接，请先指定接手服务人员。" : risk.isSyncRisk ? "账号近期未同步，请核查登录与企微绑定。" : "账号容量接近上限，建议优先停止分配新用户或新群。"}
            </div>
          </div>
        )}

        {detailTab === "profile" && <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <CapacityMeter label="好友容量" value={account.friendCount} max={2000} warning={risk.isFriendRisk} />
          <CapacityMeter label="管理群位" value={account.groupCount} max={20} warning={risk.isGroupRisk} />
          <div className="flex items-center justify-between pt-1 text-xs" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>
            <span style={{ color: S.muted }}>同步状态</span>
            <span className="px-1.5 py-0.5" style={{ background: syncStyle.bg, color: syncStyle.color, borderRadius: S.radiusSm }}>{syncStatus}</span>
          </div>
        </div>}

        {detailTab === "profile" && (editing ? (
          <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>编辑调度资料</div>
            <DetailInput label="微信昵称" value={draft.nickname} onChange={value => updateDraft("nickname", value)} />
            <DetailInput label="归属项目" value={draft.project} onChange={value => updateDraft("project", value)} />
            <div className="grid grid-cols-2 gap-2"><DetailInput label="城市" value={draft.city} onChange={value => updateDraft("city", value)} /><DetailInput label="运营负责人" value={draft.opsManager} onChange={value => updateDraft("opsManager", value)} /></div>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="会员负责人" value={draft.memberManager} onChange={value => updateDraft("memberManager", value)} /><DetailInput label="目标群" value={draft.targetGroup} onChange={value => updateDraft("targetGroup", value)} /></div>
            <div className="grid grid-cols-2 gap-2"><DetailInput label="绑定手机" value={draft.phone} onChange={value => updateDraft("phone", value)} /><DetailInput label="QQ号" value={draft.qqNo} onChange={value => updateDraft("qqNo", value)} /></div>
            <DetailInput label="绑定邮箱" value={draft.boundEmail} onChange={value => updateDraft("boundEmail", value)} />
            {editError && <div className="text-xs" role="alert" style={{ color: "#c2410c", fontFamily: "monospace" }}>{editError}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[["微信昵称", saved.nickname], ["性别", saved.gender], ["绑定手机", saved.phone], ["QQ号", saved.qqNo], ["绑定邮箱", saved.boundEmail], ["归属项目", saved.project], ["城市", saved.city], ["运营负责人", saved.opsManager], ["会员负责人", saved.memberManager], ["目标群", saved.targetGroup], ["认证状态", account.certified ? "已认证" : "未认证"], ["最近同步", account.lastLogin]].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>
                <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div>
              </div>
            ))}
          </div>
        ))}

        {detailTab === "profile" && <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}><Link size={13} />绑定关系总览</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[["项目 / 地区", `${saved.project} · ${saved.city}`], ["运营负责人", saved.opsManager], ["会员负责人", saved.memberManager], ["目标群", saved.targetGroup]].map(([label, value]) => <div key={label} className="min-w-0"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div></div>)}
          </div>
          <div className="flex items-center justify-between text-xs" style={{ borderTop: `1px solid ${S.border}`, paddingTop: 8, fontFamily: "monospace" }}><span style={{ color: S.muted }}>已关联微信群</span><b style={{ color: S.text }}>{account.groupCount} 个</b></div>
          <button type="button" className="mt-2 w-full py-2 text-xs font-semibold" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的绑定配置入口已打开`)}>打开绑定配置</button>
        </div>}

        {detailTab === "profile" && <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center justify-between text-xs" style={{ fontFamily: "monospace" }}><span style={{ color: S.muted }}>二维码状态</span><b style={{ color: isStock ? S.muted : S.text }}>{isStock ? "待上传" : "已同步 · 3 天前"}</b></div>
          <button type="button" className="mt-2 w-full py-2 text-xs font-semibold" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(isStock ? `${account.wechatId} 已进入二维码上传流程` : `${account.wechatId} 的群二维码同步任务已创建`)}>{isStock ? "上传二维码" : "重新同步二维码"}</button>
        </div>}

        {detailTab === "binding" && <div className="space-y-3">
          <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}><div className="grid grid-cols-2 gap-2">{[["归属项目", account.project], ["归属员工", account.opsManager], ["账号类型", account.accountType], ["归属大区", account.region], ["归属部门", account.department], ["服务官", account.serviceOfficer]].map(([label, value]) => <div key={label}><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div></div>)}</div></div>
          <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>微信群绑定</div><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{account.groupCount} / 20</span></div><div className="grid grid-cols-2 gap-2">{Array.from({ length: 20 }, (_, index) => { const bound = index < account.groupCount; return <button key={index} type="button" className="p-2 text-left" style={{ background: bound ? S.accentLight : S.bg, border: `1px ${bound ? "solid" : "dashed"} ${bound ? S.accentMid : S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => onAction(bound ? `${account.wechatId} 的第 ${index + 1} 个群绑定编辑入口已打开` : `${account.wechatId} 的第 ${index + 1} 个群位可绑定`)}><div className="flex items-center gap-1.5"><QrCode size={12} /><span className="text-[10px] font-bold" style={{ color: bound ? S.text : S.muted, fontFamily: "monospace" }}>{bound ? `${account.city}运营群${String(index + 1).padStart(2, "0")}` : `空群位 ${String(index + 1).padStart(2, "0")}`}</span></div><div className="text-[9px] mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>{bound ? `GROUP-${String(index + 1).padStart(3, "0")}` : "点击绑定群二维码"}</div></button>; })}</div></div>
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
            <div className="grid grid-cols-2 gap-2">{[["身份证号", account.idCard], ["银行卡号", account.bankCard], ["QQ密码", account.qqPassword], ["QQ密保", account.qqSecurity], ["邮箱密码", account.emailPassword], ["邮箱密保", account.emailSecurity]].map(([label, value]) => <div key={label} className="min-w-0"><div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div><div className="mt-0.5 text-xs truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value ? (label.includes("密码") ? "••••••••" : value) : "未配置"}</div></div>)}</div>
            <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>敏感字段默认脱敏，需授权后查看并记录审计日志</div>
          </div>
          <div className="p-3 space-y-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}><Users size={13} />紧急联系人（3位微信联系人）</div><span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>最多 3 位</span></div>
            {account.emergencyContacts.map((contact, index) => <div key={index} className="flex items-center gap-2 py-2" style={{ borderTop: `1px solid ${S.border}` }}><div className="w-7 h-7 grid place-items-center" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.muted }}><QrCode size={13} /></div><div className="min-w-0 flex-1"><div className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{contact.name}</div><div className="text-[10px] truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{contact.note}</div></div><button type="button" className="px-2 py-1 text-[10px]" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的紧急联系人 ${index + 1} 编辑入口已打开`)}>编辑</button></div>)}
          </div>
          <div className="p-3 space-y-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}><LockKeyhole size={14} />登录凭证</div>
            <div className="flex items-center justify-between gap-2"><span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>微信密码</span><span className="text-xs font-medium" style={{ color: S.textSec, fontFamily: "monospace" }}>{showPassword ? "Fengle@2026" : "••••••••"}</span><button type="button" title={showPassword ? "隐藏密码" : "显示密码"} aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword(value => !value)} style={{ color: S.muted }}>{showPassword ? <EyeOff size={13} /> : <Eye size={13} />}</button><button type="button" className="px-2 py-1 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的密码更新流程已打开`)}>更新</button></div>
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
        {detailTab === "security" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setSecurityDraft({ loginAlert: true, twoFactor: true, recoveryEmail: account.boundEmail === "—" ? "" : account.boundEmail })}>重置</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveSecurity}>保存安全设置</button></> : detailTab === "binding" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的绑定校验已通过`)}>校验绑定</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的群绑定配置已保存`)}>保存绑定</button></> : detailTab === "operations" ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的运营数据导出任务已创建`)}>导出数据</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的交接单已创建`)}>发起交接</button></> : editing ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={cancelEdit}>取消</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveEdit}>保存修改</button></> : <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEditing(true)}><Edit3 size={13} className="inline mr-1" />编辑</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的交接单已创建`)}>发起交接</button></>}
      </div>
    </aside>
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
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState({ linkedPersonal: account.linkedPersonal, dept: account.dept, admin: account.admin, city: account.city, note: account.note || "" });
  const [draft, setDraft] = useState(saved);
  const [editError, setEditError] = useState("");
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
    <aside className="w-[310px] flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="企业微信详情">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表账号后查看与调度</div>
        </div>
        <button type="button" title="关闭详情" aria-label="关闭详情" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }} onClick={onClose}><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          <img src={getAvatar(account.id - 1)} alt={account.admin} style={{ width: 48, height: 48, borderRadius: S.radiusSm, objectFit: "cover" }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap"><b className="text-sm truncate" style={{ color: S.text, fontFamily: "monospace" }}>{account.wecomId}</b><span className="px-1.5 py-0.5 text-xs" style={{ background: status.bg, color: status.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{account.status}</span></div>
            <div className="mt-1 text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{account.corpId}</div>
            <div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{saved.city} · {saved.admin}</div>
          </div>
          <button type="button" title="查看二维码" aria-label="查看二维码" className="w-9 h-9 grid place-items-center" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => onAction(`${account.wecomId} 的二维码查看入口已打开`)}><QrCode size={17} /></button>
        </div>

        {hasRisk && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {account.status === "异常" || account.syncStatus === "同步失败" ? "企业微信同步异常，请核查登录状态与个人微信绑定。" : memberRate >= 0.85 ? "成员容量接近上限，建议优先停止分配新用户。" : "管理群位接近上限，建议提前准备备用群。"}
            </div>
          </div>
        )}

        <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <CapacityMeter label="成员容量" value={account.members} max={account.memberCapacity} warning={memberRate >= 0.85} />
          <CapacityMeter label="管理群位" value={account.groups.length} max={account.groupCapacity} warning={groupRate >= 0.8} />
          <div className="flex items-center justify-between pt-1 text-xs" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>
            <span style={{ color: S.muted }}>同步状态</span>
            <span className="px-1.5 py-0.5" style={{ background: sync.bg, color: sync.color, borderRadius: S.radiusSm }}>{account.syncStatus}</span>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>编辑配置资料</div>
            <DetailInput label="绑定个微" value={draft.linkedPersonal} onChange={value => updateDraft("linkedPersonal", value)} />
            <div className="grid grid-cols-2 gap-2"><DetailInput label="运营部门" value={draft.dept} onChange={value => updateDraft("dept", value)} /><DetailInput label="服务负责人" value={draft.admin} onChange={value => updateDraft("admin", value)} /></div>
            <DetailInput label="城市" value={draft.city} onChange={value => updateDraft("city", value)} />
            <label className="block"><span className="mb-1 block text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>运营备注</span><textarea value={draft.note} onChange={event => updateDraft("note", event.target.value)} rows={3} className="w-full resize-none px-2.5 py-2 text-xs outline-none" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, fontFamily: "monospace" }} /></label>
            {editError && <div className="text-xs" role="alert" style={{ color: "#c2410c", fontFamily: "monospace" }}>{editError}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[["绑定个微", saved.linkedPersonal], ["运营部门", saved.dept], ["服务负责人", saved.admin], ["城市", saved.city], ["最近同步", account.lastSync], ["企业 ID", account.corpId]].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>
                <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="text-xs mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>企微群组</div>
          <div className="space-y-1.5">
            {account.groups.map(group => (
              <div key={group} className="flex items-center gap-2 px-2.5 py-2" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <Users size={12} style={{ color: S.text }} />
                <span className="text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{group}</span>
              </div>
            ))}
          </div>
        </div>
        {saved.note && <div className="p-3 text-xs" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.muted, lineHeight: 1.6, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{saved.note}</div>}
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
        {editing ? <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={cancelEdit}>取消</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={saveEdit}>保存修改</button></> : <><button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEditing(true)}><Edit3 size={13} className="inline mr-1" />编辑</button><button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wecomId} 的交接单已创建`)}>发起交接</button></>}
      </div>
    </aside>
  );
}

function BrowsePager({ page, totalPages, total, onPageChange }: { page: number; totalPages: number; total: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#fafafa" }}>
      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>第 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} 条，共 {total} 条</div>
      <div className="flex items-center gap-1">
        <button className="w-7 h-7 flex items-center justify-center transition-all" style={{ background: page === 1 ? S.bg : "#0d0d0d", color: page === 1 ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(item => <button key={item} className="w-7 h-7 text-xs transition-all" style={{ background: page === item ? "#0d0d0d" : S.surface, color: page === item ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onPageChange(item)}>{item}</button>)}
        <button className="w-7 h-7 flex items-center justify-center transition-all" style={{ background: page === totalPages ? S.bg : "#0d0d0d", color: page === totalPages ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
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
  const statusTabs = ["全部", "使用中", "异常", "待交接", "库存"];
  const cities = ["全部城市", ...Array.from(new Set(wecomAccounts.map(account => account.city)))];
  const departments = ["全部部门", ...Array.from(new Set(wecomAccounts.map(account => account.dept)))];
  const filteredAccounts = wecomAccounts.filter(account => {
    const matchesStatus = statusFilter === "全部" || account.status === statusFilter;
    const matchesCity = cityFilter === "全部城市" || account.city === cityFilter;
    const matchesDept = deptFilter === "全部部门" || account.dept === deptFilter;
    const query = search.trim();
    const matchesSearch = !query || [account.wecomId, account.corpId, account.linkedPersonal, account.admin, account.dept, account.city].some(value => value.includes(query));
    return matchesStatus && matchesCity && matchesDept && matchesSearch;
  });
  const statusCounts: Record<string, number> = {
    全部: wecomAccounts.length,
    使用中: wecomAccounts.filter(account => account.status === "使用中").length,
    异常: wecomAccounts.filter(account => account.status === "异常").length,
    待交接: wecomAccounts.filter(account => account.status === "待交接").length,
    库存: wecomAccounts.filter(account => account.status === "库存").length,
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
        <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {statusTabs.map((tab, index) => (
            <button key={tab} type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all" style={{ background: statusFilter === tab ? "#0d0d0d" : "transparent", color: statusFilter === tab ? S.accent : S.muted, fontFamily: "monospace", borderRight: index < statusTabs.length - 1 ? `1px solid ${S.border}` : "none" }} onClick={() => setStatusFilter(tab)}>
              {tab}<span className="px-1.5 py-0.5" style={{ background: statusFilter === tab ? S.accent : S.bg, color: statusFilter === tab ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
        <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索企业微信 / 管理员 / 部门 / 城市..." value={search} onChange={event => setSearch(event.target.value)} />
          {search && <button type="button" title="清除搜索" onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap" style={{ background: filtersOpen || activeFilterCount ? "#0d0d0d" : S.surface, border: `1px solid ${filtersOpen || activeFilterCount ? "#0d0d0d" : S.border}`, color: filtersOpen || activeFilterCount ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setFiltersOpen(value => !value)}>
          <SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span>
        </button>
        <BrowseModeToggle value={viewMode} onChange={onViewModeChange} label="企业微信浏览方式" />
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
            return (
              <div key={w.id} className="p-4 cursor-pointer transition-all" style={{ background: isSelected ? S.accentLight : S.surface, border: isSelected ? `1px solid ${S.borderMed}` : `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }} onClick={() => setSelected(isSelected ? null : w.id)}>
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

// ─── 个人微信默认运营列：低频资产资料收进右侧详情 ────────────────
const cols = [
  { key: "select", label: "", w: 36 },
  { key: "no", label: "编号", w: 62 },
  { key: "status", label: "使用状态", w: 82 },
  { key: "avatar", label: "微信头像", w: 66 },
  { key: "nickname", label: "微信昵称", w: 126 },
  { key: "wechatId", label: "微信号", w: 134 },
  { key: "project", label: "归属项目", w: 142 },
  { key: "type", label: "微信号类型", w: 88 },
  { key: "owner", label: "归属服务官", w: 116 },
  { key: "department", label: "归属部门", w: 138 },
  { key: "region", label: "归属大区", w: 88 },
  { key: "city", label: "地区", w: 88 },
  { key: "friendCount", label: "微信号人数", w: 120 },
  { key: "blocked", label: "拉黑人数", w: 82 },
  { key: "deleted", label: "删除人数", w: 82 },
  { key: "normalFans", label: "正常活粉", w: 92 },
  { key: "groups", label: "归属群数", w: 104 },
  { key: "sync", label: "同步状态", w: 104 },
  { key: "updated", label: "最近同步", w: 105 },
  { key: "action", label: "操作", w: 132 },
];

// ─── 主组件 ───────────────────────────────────────────────────
export default function WeChatManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [cityFilter, setCityFilter] = useState("全部城市");
  const [projectFilter, setProjectFilter] = useState("全部项目");
  const [departmentFilter, setDepartmentFilter] = useState("全部部门");
  const [accountTypeFilter, setAccountTypeFilter] = useState("全部类型");
  const [serviceFilter, setServiceFilter] = useState("全部服务官");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("全部");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [detailVersion, setDetailVersion] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [mainTab, setMainTab] = useState<"personal" | "wecom">("personal");
  const [personalView, setPersonalView] = useState<BrowseMode>("list");
  const [wecomView, setWecomView] = useState<BrowseMode>("cards");
  const { generatedGroups } = useCommunityData();

  const accounts = mockWechats.map(account => {
    const generatedGroupCount = generatedGroups.filter(group =>
      group.service === account.serviceOfficer && group.city.split("/").includes(account.city),
    ).length;
    return { ...account, groupCount: account.groupCount + generatedGroupCount };
  });

  const statusTabs = ["全部", "使用中", "异常", "待交接", "库存"];
  const cities = ["全部城市", ...Array.from(new Set(accounts.map(w => w.city).filter(city => city !== "—")))];
  const projects = ["全部项目", ...Array.from(new Set(accounts.map(w => w.project).filter(project => project !== "—")))];
  const departments = ["全部部门", ...Array.from(new Set(accounts.map(w => w.department).filter(department => department !== "—")))];
  const accountTypes = ["全部类型", "客服号", "招商号", "运营号"];
  const serviceOfficers = ["全部服务官", ...Array.from(new Set(accounts.map(w => w.serviceOfficer).filter(value => value !== "—")))];
  const filtered = accounts.filter(w => {
    const risk = getAccountRisk(w);
    const searchMatch = w.wechatId.includes(search) || w.opsManager.includes(search) || w.memberManager.includes(search) || w.city.includes(search) || w.project.includes(search) || w.phone.includes(search) || w.nickname.includes(search);
    const capacityMatch = capacityFilter === "全部" || (capacityFilter === "好友预警" && risk.isFriendRisk) || (capacityFilter === "群容量预警" && risk.isGroupRisk) || (capacityFilter === "同步异常" && risk.isSyncRisk);
    return (statusFilter === "全部" || w.status === statusFilter) && (cityFilter === "全部城市" || w.city === cityFilter) && (projectFilter === "全部项目" || w.project === projectFilter) && (departmentFilter === "全部部门" || w.department === departmentFilter) && (accountTypeFilter === "全部类型" || w.accountType === accountTypeFilter) && (serviceFilter === "全部服务官" || w.serviceOfficer === serviceFilter) && capacityMatch && searchMatch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = { 全部: accounts.length, 使用中: accounts.filter(w => w.status === "使用中").length, 异常: accounts.filter(w => w.status === "异常").length, 待交接: accounts.filter(w => w.status === "待交接").length, 库存: accounts.filter(w => w.status === "库存").length };
  const selectedAccount = accounts.find(w => w.no === selectedRow) || null;
  const activeFilterCount = Number(cityFilter !== "全部城市") + Number(projectFilter !== "全部项目") + Number(departmentFilter !== "全部部门") + Number(accountTypeFilter !== "全部类型") + Number(serviceFilter !== "全部服务官") + Number(capacityFilter !== "全部");
  const clearAdvancedFilters = () => { setCityFilter("全部城市"); setProjectFilter("全部项目"); setDepartmentFilter("全部部门"); setAccountTypeFilter("全部类型"); setServiceFilter("全部服务官"); setCapacityFilter("全部"); setPage(1); };
  const toggleRow = (no: string) => setSelectedRows(current => current.includes(no) ? current.filter(item => item !== no) : [...current, no]);
  const runBulkAction = (action: string) => { if (!selectedRows.length) return; runAccountAction(`已对 ${selectedRows.length} 个微信号执行${action}`); setSelectedRows([]); };
  const runAccountAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };
  const openAccountDetail = (no: string, mode: "view" | "edit" = "view") => {
    setSelectedRow(no);
    setDetailMode(mode);
    setDetailVersion(version => version + 1);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && <AuthorizedWechatModal onClose={() => setShowModal(false)} />}

      {/* 页头 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-semibold" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.04em" }}>微信管理</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理个人微信和企业微信，双账号同步服务用户</p>
        </div>
        <div className="flex gap-2 items-center">
          {/* 主Tab切换 */}
          <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "personal" ? "#0d0d0d" : "transparent", color: mainTab === "personal" ? S.accent : S.muted, fontFamily: "monospace", borderRight: `1px solid ${S.border}` }} onClick={() => setMainTab("personal")}>
              <MessageCircle size={13} /> 个人微信
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "wecom" ? "#0d0d0d" : "transparent", color: mainTab === "wecom" ? S.accent : S.muted, fontFamily: "monospace" }} onClick={() => setMainTab("wecom")}>
              <Building2 size={13} /> 企业微信
            </button>
          </div>
          {mainTab === "personal" && <div className="relative">
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap" style={{ background: columnsOpen ? "#0d0d0d" : S.surface, border: `1px solid ${columnsOpen ? "#0d0d0d" : S.border}`, color: columnsOpen ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setColumnsOpen(value => !value)}>
              <Eye size={13} /> 显示内容管理
            </button>
            {columnsOpen && <div className="absolute right-0 top-full z-30 mt-2 w-72 p-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
              <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>列表与详情字段</div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>
                {["左侧：账号资料", "左侧：归属与运营", "左侧：人数与群数", "左侧：同步与操作", "右侧：绑定人与安全", "右侧：紧急联系人 ×3", "右侧：二维码与凭证", "右侧：完整调度资料"].map(item => <span key={item}>✓ {item}</span>)}
              </div>
              <div className="mt-3 pt-2 text-[10px]" style={{ color: S.muted, borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>身份证、银行卡、密码等敏感字段默认脱敏。</div>
            </div>}
          </div>}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
            <Download size={13} /> 导出
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold whitespace-nowrap" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setShowModal(true)}>
            <Plus size={15} /> {mainTab === "personal" ? "新建微信号" : "新建企微账号"}
          </button>
        </div>
      </div>

      {mainTab === "wecom" && <WecomTab viewMode={wecomView} onViewModeChange={setWecomView} />}

      {mainTab === "personal" && <>
        {notice && <div className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>
          <span className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{notice}</span>
          <button type="button" onClick={() => setNotice("")} title="关闭提示"><X size={13} style={{ color: S.muted }} /></button>
        </div>}

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
            {statusTabs.map((t, i) => (
              <button key={t} className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all" style={{ background: statusFilter === t ? "#0d0d0d" : "transparent", color: statusFilter === t ? S.accent : S.muted, fontFamily: "monospace", borderRight: i < statusTabs.length - 1 ? `1px solid ${S.border}` : "none" }} onClick={() => { setStatusFilter(t); setPage(1); }}>
                {t}
                <span className="px-1.5 py-0.5" style={{ background: statusFilter === t ? S.accent : S.bg, color: statusFilter === t ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{(counts as any)[t]}</span>
              </button>
            ))}
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <Search size={13} style={{ color: S.muted }} />
            <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索微信号 / 手机号 / 负责人 / 项目 / 地区..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
          </div>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap" style={{ background: filtersOpen || activeFilterCount ? "#0d0d0d" : S.surface, border: `1px solid ${filtersOpen || activeFilterCount ? "#0d0d0d" : S.border}`, color: filtersOpen || activeFilterCount ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span></button>
          <BrowseModeToggle value={personalView} onChange={setPersonalView} label="个人微信浏览方式" />
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

        {selectedRows.length > 0 && <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}><span className="text-xs font-bold">已选 {selectedRows.length} 个账号</span><button type="button" className="px-2 py-1 text-xs" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => runBulkAction("拉黑")}>批量拉黑</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("删除" )}>批量删除</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("标记活粉")}>标记活粉</button><button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }} onClick={() => runBulkAction("发起交接")}>批量交接</button></div>}

        <div className="flex gap-4 flex-1 min-h-0">
          {personalView === "cards" ? (
            <div className="flex-1 min-w-0 min-h-0 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <PersonalWechatCards accounts={paged} selectedRow={selectedRow} onSelect={id => { setSelectedRow(id); setDetailMode("view"); setDetailVersion(version => version + 1); }} />
              <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
            </div>
          ) : (
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
                <div><div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>个人微信账号</div><div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>默认显示调度字段；点击账号查看完整资产资料</div></div>
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 <b style={{ color: S.text }}>{filtered.length}</b> 条</div>
              </div>
              <div className="flex-1 overflow-auto">
                <div style={{ minWidth: 1900 }}>
                  <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}` }}>
                    {cols.map(c => <div key={c.key} className="flex-shrink-0 text-xs font-semibold" style={{ width: c.w, color: "#555", fontFamily: "monospace" }}>{c.key === "select" ? <input type="checkbox" aria-label="选择当前页账号" checked={paged.length > 0 && paged.every(item => selectedRows.includes(item.no))} onChange={event => setSelectedRows(event.target.checked ? Array.from(new Set([...selectedRows, ...paged.map(item => item.no)])) : selectedRows.filter(item => !paged.some(row => row.no === item)))} /> : c.label}</div>)}
                  </div>
                  {paged.map(w => {
                    const isSelected = selectedRow === w.no;
                    const risk = getAccountRisk(w);
                    const syncLabel = risk.isSyncRisk ? "需核查" : w.status === "库存" ? "未启用" : "正常";
                    const syncColor = risk.isSyncRisk ? "#c2410c" : w.status === "库存" ? S.muted : "#276749";
                    return <div key={w.no} role="button" tabIndex={0} className="flex items-center w-full px-4 text-left cursor-pointer transition-all" style={{ background: isSelected ? S.accentLight : S.surface, borderBottom: `1px solid ${S.border}`, borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent", paddingTop: 10, paddingBottom: 10 }} onClick={() => isSelected ? setSelectedRow(null) : openAccountDetail(w.no)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); isSelected ? setSelectedRow(null) : openAccountDetail(w.no); } }}>
                      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 36 }}><input type="checkbox" aria-label={`选择 ${w.wechatId}`} checked={selectedRows.includes(w.no)} onClick={e => e.stopPropagation()} onChange={() => toggleRow(w.no)} /></div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 62, color: S.muted, fontFamily: "monospace" }}>{w.no}</div>
                      <div className="flex-shrink-0" style={{ width: 82 }}><span className="px-1.5 py-0.5 text-xs" style={{ background: (statusCfg[w.status] || statusCfg["库存"]).bg, color: (statusCfg[w.status] || statusCfg["库存"]).color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{w.status}</span></div>
                      <div className="flex-shrink-0" style={{ width: 66 }}>{w.status === "库存" ? <div className="w-8 h-8 grid place-items-center" style={{ background: "#f0f0ec", borderRadius: S.radiusSm, color: S.muted }}><MessageCircle size={14} /></div> : <img src={getAvatar(parseInt(w.no) - 1)} alt={w.nickname} style={{ width: 32, height: 32, borderRadius: S.radiusSm, objectFit: "cover" }} />}</div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" style={{ width: 126, color: S.textSec, fontFamily: "monospace" }}>{w.nickname === "—" ? "待配置" : w.nickname}</div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs font-semibold" style={{ width: 134, color: S.text, fontFamily: "monospace" }}>{w.wechatId}</div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" style={{ width: 142, color: S.textSec, fontFamily: "monospace" }}>{w.project}</div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 88, color: S.textSec, fontFamily: "monospace" }}>{w.accountType}</div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" style={{ width: 116, color: S.textSec, fontFamily: "monospace" }}>{w.serviceOfficer}</div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" style={{ width: 138, color: S.muted, fontFamily: "monospace" }}>{w.department}</div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 88, color: S.textSec, fontFamily: "monospace" }}>{w.region}</div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 88, color: S.textSec, fontFamily: "monospace" }}>{w.city}</div>
                      <div className="flex-shrink-0" style={{ width: 120 }}><b className="text-xs" style={{ color: risk.isFriendRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{w.friendCount.toLocaleString()}</b><span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}> / 2,000</span><div className="mt-1 h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.friendRate * 100, w.friendCount ? 4 : 0)}%`, height: "100%", background: risk.isFriendRisk ? "#f59e0b" : S.accent }} /></div></div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 82, color: S.textSec, fontFamily: "monospace" }}>{w.blockedCount}</div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 82, color: S.textSec, fontFamily: "monospace" }}>{w.deletedCount}</div>
                      <div className="flex-shrink-0 text-xs font-medium" style={{ width: 92, color: S.textSec, fontFamily: "monospace" }}>{w.normalFans.toLocaleString()}</div>
                      <div className="flex-shrink-0" style={{ width: 104 }}><b className="text-xs" style={{ color: risk.isGroupRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{w.groupCount} / 20 群</b><div className="mt-1 h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.groupRate * 100, w.groupCount ? 4 : 0)}%`, height: "100%", background: risk.isGroupRisk ? "#f59e0b" : S.accent }} /></div></div>
                      <div className="flex-shrink-0" style={{ width: 106 }}><span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs" style={{ background: risk.isSyncRisk ? "#fff7ed" : w.status === "库存" ? "#f5f5f5" : "#f0fff4", color: syncColor, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{risk.isSyncRisk && <AlertTriangle size={10} />}{syncLabel}</span></div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 105, color: S.muted, fontFamily: "monospace" }}>{w.lastLogin}</div>
                      <div className="flex-shrink-0 flex gap-1.5" style={{ width: 132 }}><button type="button" className="px-2 py-1 text-xs font-semibold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); openAccountDetail(w.no, "edit"); }}><Edit3 size={11} className="inline mr-0.5" />编辑</button><button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); openAccountDetail(w.no); }}>查看</button></div>
                    </div>;
                  })}
                  {paged.length === 0 && <div className="py-16 text-center text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配账号，请调整筛选条件</div>}
                </div>
              </div>
              <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
            </div>
          )}
          {selectedAccount && <PersonalWechatDetail key={`${selectedAccount.no}-${detailVersion}`} account={selectedAccount} startEditing={detailMode === "edit"} onClose={() => { setSelectedRow(null); setDetailMode("view"); }} onAction={runAccountAction} />}
        </div>
      </>}
    </div>
  );
}
