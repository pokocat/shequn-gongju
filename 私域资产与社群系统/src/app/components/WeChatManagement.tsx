import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, ChevronLeft, ChevronRight, Upload, Building2, Users, MessageCircle, ArrowRight, Link, QrCode, Download, Copy, List, LayoutGrid, AlertTriangle, SlidersHorizontal, Edit3 } from "lucide-react";

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
];

const statusCfg: Record<string, { bg: string; color: string }> = {
  "使用中": { bg: "#f0fff4", color: "#276749" },
  "异常":   { bg: "#fff0f0", color: "#c53030" },
  "待交接": { bg: "#fffbeb", color: "#b45309" },
  "库存":   { bg: "#f5f5f5", color: "#888888" },
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
  const [form, setForm] = useState({ no: "", wechatId: "", phone: "", nickname: "", gender: "男", qqNo: "", boundEmail: "", opsManager: "", memberManager: "", city: "", project: "", status: "使用中" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "其他"];
  const statuses = ["使用中", "库存", "待交接"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-[560px] overflow-hidden" style={{ background: "#fff", border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7" }}>
          <span className="font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>新建微信号</span>
          <button onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {[
            { label: "编号", key: "no", placeholder: "如 00011" },
            { label: "微信号", key: "wechatId", placeholder: "如 fengle_bj_03" },
            { label: "绑定手机号", key: "phone", placeholder: "138-xxxx-xxxx" },
            { label: "微信昵称", key: "nickname", placeholder: "如 蜂乐·张三" },
            { label: "QQ号", key: "qqNo", placeholder: "可选" },
            { label: "绑定邮箱", key: "boundEmail", placeholder: "可选" },
            { label: "运营负责人", key: "opsManager", placeholder: "保管人姓名" },
            { label: "会员负责人", key: "memberManager", placeholder: "会员管理员" },
            { label: "归属项目", key: "project", placeholder: "如 北京PRO服务" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>{f.label}</label>
              <input className="w-full px-3 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>性别</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} value={form.gender} onChange={e => set("gender", e.target.value)}>
              {["男","女","未知"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>城市分站</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} value={form.city} onChange={e => set("city", e.target.value)}>
              <option value="">请选择</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>初始状态</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} value={form.status} onChange={e => set("status", e.target.value)}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>微信头像</label>
            <div className="flex items-center gap-3 px-4 py-3 border-dashed cursor-pointer" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
              <Upload size={14} style={{ color: S.text }} />
              <span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>点击上传微信头像截图</span>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs mb-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>备注</label>
            <textarea className="w-full px-3 py-2 text-xs outline-none resize-none" rows={2} style={{ background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} placeholder="其他说明..." />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>取消</button>
          <button className="flex-1 py-2.5 text-sm font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>保存</button>
        </div>
      </div>
    </div>
  );
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

function PersonalWechatDetail({ account, onClose, onAction }: { account: PersonalAccount; onClose: () => void; onAction: (message: string) => void }) {
  const risk = getAccountRisk(account);
  const isStock = account.status === "库存";
  const status = statusCfg[account.status] || { bg: "#f5f5f5", color: "#888" };
  const syncStatus = risk.isSyncRisk ? "需核查" : account.status === "库存" ? "未启用" : "同步正常";
  const syncStyle = risk.isSyncRisk ? { bg: "#fff7ed", color: "#c2410c" } : account.status === "库存" ? { bg: "#f5f5f5", color: "#777" } : { bg: "#f0fff4", color: "#276749" };

  return (
    <aside className="w-[310px] flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="个人微信详情">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表账号后查看与调度</div>
        </div>
        <button type="button" title="关闭详情" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }} onClick={onClose}><X size={14} /></button>
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

        {(risk.isRisk || account.status === "待交接") && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {account.status === "待交接" ? "账号待交接，请先指定接手服务人员。" : risk.isSyncRisk ? "账号近期未同步，请核查登录与企微绑定。" : "账号容量接近上限，建议优先停止分配新用户或新群。"}
            </div>
          </div>
        )}

        <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <CapacityMeter label="好友容量" value={account.friendCount} max={2000} warning={risk.isFriendRisk} />
          <CapacityMeter label="管理群位" value={account.groupCount} max={20} warning={risk.isGroupRisk} />
          <div className="flex items-center justify-between pt-1 text-xs" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>
            <span style={{ color: S.muted }}>同步状态</span>
            <span className="px-1.5 py-0.5" style={{ background: syncStyle.bg, color: syncStyle.color, borderRadius: S.radiusSm }}>{syncStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[["归属项目", account.project], ["城市", account.city], ["运营负责人", account.opsManager], ["会员负责人", account.memberManager], ["目标群", account.targetGroup], ["最近同步", account.lastLogin]].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>
              <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center justify-between text-xs" style={{ fontFamily: "monospace" }}><span style={{ color: S.muted }}>二维码状态</span><b style={{ color: isStock ? S.muted : S.text }}>{isStock ? "待上传" : "已同步 · 3 天前"}</b></div>
          <button type="button" className="mt-2 w-full py-2 text-xs font-semibold" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(isStock ? `${account.wechatId} 已进入二维码上传流程` : `${account.wechatId} 的群二维码同步任务已创建`)}>{isStock ? "上传二维码" : "重新同步二维码"}</button>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
        <button type="button" className="py-2 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 已进入编辑模式`)}><Edit3 size={13} className="inline mr-1" />编辑</button>
        <button type="button" className="py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => onAction(`${account.wechatId} 的交接单已创建`)}>发起交接</button>
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
  const [transferAccount, setTransferAccount] = useState<typeof wecomAccounts[number] | null>(null);
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
                  <button type="button" className="px-2.5 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); setTransferAccount(w); }}>交接</button>
                </div>
              </div>
            );
          })}
        </div> : <WecomBrowseList accounts={filteredAccounts} selected={selected} onSelect={setSelected} onQrCode={setQrAccount} onTransfer={setTransferAccount} />}
      </div>

      {detail && (
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
      </div>

      {qrAccount && <WecomQrModal account={qrAccount} onClose={() => setQrAccount(null)} onCopy={() => runAction(`${qrAccount.wecomId} 的二维码链接已复制`)} />}
      {transferAccount && <WecomTransferModal account={transferAccount} onClose={() => setTransferAccount(null)} onSubmit={receiver => { setTransferAccount(null); runAction(`${transferAccount.wecomId} 的交接单已创建，接手人：${receiver}`); }} />}
    </div>
  );
}

// ─── 个人微信默认运营列：低频资产资料收进右侧详情 ────────────────
const cols = [
  { key: "account", label: "微信账号", w: 218 },
  { key: "scope", label: "项目 / 地区", w: 166 },
  { key: "owner", label: "服务负责人", w: 126 },
  { key: "friends", label: "好友容量", w: 124 },
  { key: "groups", label: "管理群位", w: 118 },
  { key: "sync", label: "同步状态", w: 106 },
  { key: "updated", label: "最近同步", w: 105 },
  { key: "qrcode", label: "二维码", w: 70 },
  { key: "action", label: "操作", w: 132 },
];

// ─── 主组件 ───────────────────────────────────────────────────
export default function WeChatManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [cityFilter, setCityFilter] = useState("全部城市");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("全部");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [mainTab, setMainTab] = useState<"personal" | "wecom">("personal");
  const [personalView, setPersonalView] = useState<BrowseMode>("list");
  const [wecomView, setWecomView] = useState<BrowseMode>("cards");

  const statusTabs = ["全部", "使用中", "异常", "待交接", "库存"];
  const cities = ["全部城市", ...Array.from(new Set(mockWechats.map(w => w.city).filter(city => city !== "—")))];
  const filtered = mockWechats.filter(w => {
    const risk = getAccountRisk(w);
    const searchMatch = w.wechatId.includes(search) || w.opsManager.includes(search) || w.memberManager.includes(search) || w.city.includes(search) || w.project.includes(search) || w.phone.includes(search) || w.nickname.includes(search);
    const capacityMatch = capacityFilter === "全部" || (capacityFilter === "好友预警" && risk.isFriendRisk) || (capacityFilter === "群容量预警" && risk.isGroupRisk) || (capacityFilter === "同步异常" && risk.isSyncRisk);
    return (statusFilter === "全部" || w.status === statusFilter) && (cityFilter === "全部城市" || w.city === cityFilter) && capacityMatch && searchMatch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = { 全部: mockWechats.length, 使用中: mockWechats.filter(w => w.status === "使用中").length, 异常: mockWechats.filter(w => w.status === "异常").length, 待交接: mockWechats.filter(w => w.status === "待交接").length, 库存: mockWechats.filter(w => w.status === "库存").length };
  const selectedAccount = mockWechats.find(w => w.no === selectedRow) || null;
  const activeFilterCount = Number(cityFilter !== "全部城市") + Number(capacityFilter !== "全部");
  const clearAdvancedFilters = () => { setCityFilter("全部城市"); setCapacityFilter("全部"); setPage(1); };
  const runAccountAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && <NewWechatModal onClose={() => setShowModal(false)} />}

      {/* 页头 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-semibold" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.04em" }}>微信管理</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理个人微信和企业微信，双账号同步服务用户</p>
        </div>
        <div className="flex gap-2">
          {/* 主Tab切换 */}
          <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "personal" ? "#0d0d0d" : "transparent", color: mainTab === "personal" ? S.accent : S.muted, fontFamily: "monospace", borderRight: `1px solid ${S.border}` }} onClick={() => setMainTab("personal")}>
              <MessageCircle size={13} /> 个人微信
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap" style={{ background: mainTab === "wecom" ? "#0d0d0d" : "transparent", color: mainTab === "wecom" ? S.accent : S.muted, fontFamily: "monospace" }} onClick={() => setMainTab("wecom")}>
              <Building2 size={13} /> 企业微信
            </button>
          </div>
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
            <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索微信号 / 手机号 / 负责人 / 城市..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
          </div>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap" style={{ background: filtersOpen || activeFilterCount ? "#0d0d0d" : S.surface, border: `1px solid ${filtersOpen || activeFilterCount ? "#0d0d0d" : S.border}`, color: filtersOpen || activeFilterCount ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span></button>
          <BrowseModeToggle value={personalView} onChange={setPersonalView} label="个人微信浏览方式" />
        </div>

        {filtersOpen && <div className="flex items-end gap-3 p-3 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>城市</span><select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
          <label className="block"><span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>容量与同步</span><select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={capacityFilter} onChange={e => { setCapacityFilter(e.target.value as CapacityFilter); setPage(1); }} style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{["全部", "好友预警", "群容量预警", "同步异常"].map(filter => <option key={filter}>{filter}</option>)}</select></label>
          <div className="mb-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>符合条件 <b style={{ color: S.text }}>{filtered.length}</b> 个账号</div>
          <button type="button" className="ml-auto px-3 py-2 text-xs" style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={clearAdvancedFilters}>重置筛选</button>
        </div>}

        <div className="flex gap-4 flex-1 min-h-0">
          {personalView === "cards" ? (
            <div className="flex-1 min-w-0 min-h-0 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <PersonalWechatCards accounts={paged} selectedRow={selectedRow} onSelect={setSelectedRow} />
              <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
            </div>
          ) : (
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
                <div><div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>个人微信账号</div><div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>默认显示调度字段；点击账号查看完整资产资料</div></div>
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 <b style={{ color: S.text }}>{filtered.length}</b> 条</div>
              </div>
              <div className="flex-1 overflow-auto">
                <div style={{ minWidth: 1165 }}>
                  <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}` }}>
                    {cols.map(c => <div key={c.key} className="flex-shrink-0 text-xs font-semibold" style={{ width: c.w, color: "#555", fontFamily: "monospace" }}>{c.label}</div>)}
                  </div>
                  {paged.map(w => {
                    const isSelected = selectedRow === w.no;
                    const risk = getAccountRisk(w);
                    const syncLabel = risk.isSyncRisk ? "需核查" : w.status === "库存" ? "未启用" : "正常";
                    const syncColor = risk.isSyncRisk ? "#c2410c" : w.status === "库存" ? S.muted : "#276749";
                    return <div key={w.no} role="button" tabIndex={0} className="flex items-center w-full px-4 text-left cursor-pointer transition-all" style={{ background: isSelected ? S.accentLight : S.surface, borderBottom: `1px solid ${S.border}`, borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent", paddingTop: 10, paddingBottom: 10 }} onClick={() => setSelectedRow(isSelected ? null : w.no)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedRow(isSelected ? null : w.no); } }}>
                      <div className="flex-shrink-0 flex items-center gap-2.5" style={{ width: 218 }}>
                        {w.status === "库存" ? <div className="w-8 h-8 grid place-items-center" style={{ background: "#f0f0ec", borderRadius: S.radiusSm, color: S.muted }}><MessageCircle size={14} /></div> : <img src={getAvatar(parseInt(w.no) - 1)} alt="" style={{ width: 32, height: 32, borderRadius: S.radiusSm, objectFit: "cover" }} />}
                        <span className="min-w-0"><b className="block truncate text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{w.wechatId}</b><small className="block mt-0.5 truncate" style={{ color: S.muted, fontSize: 10, fontFamily: "monospace" }}>{w.nickname === "—" ? "待配置人员" : `${w.nickname} · ${w.no}`}</small></span>
                      </div>
                      <div className="flex-shrink-0 min-w-0" style={{ width: 166 }}><b className="block truncate text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{w.project}</b><small className="block mt-0.5" style={{ color: S.muted, fontSize: 10, fontFamily: "monospace" }}>{w.city}</small></div>
                      <div className="flex-shrink-0 min-w-0" style={{ width: 126 }}><b className="block truncate text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{w.opsManager}</b><small className="block mt-0.5 truncate" style={{ color: S.muted, fontSize: 10, fontFamily: "monospace" }}>{w.memberManager}</small></div>
                      <div className="flex-shrink-0" style={{ width: 124 }}><b className="text-xs" style={{ color: risk.isFriendRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{w.friendCount.toLocaleString()} / 2,000</b><div className="mt-1 h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.friendRate * 100, w.friendCount ? 4 : 0)}%`, height: "100%", background: risk.isFriendRisk ? "#f59e0b" : S.accent }} /></div></div>
                      <div className="flex-shrink-0" style={{ width: 118 }}><b className="text-xs" style={{ color: risk.isGroupRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{w.groupCount} / 20 群</b><div className="mt-1 h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}><div style={{ width: `${Math.max(risk.groupRate * 100, w.groupCount ? 4 : 0)}%`, height: "100%", background: risk.isGroupRisk ? "#f59e0b" : S.accent }} /></div></div>
                      <div className="flex-shrink-0" style={{ width: 106 }}><span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs" style={{ background: risk.isSyncRisk ? "#fff7ed" : w.status === "库存" ? "#f5f5f5" : "#f0fff4", color: syncColor, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{risk.isSyncRisk && <AlertTriangle size={10} />}{syncLabel}</span></div>
                      <div className="flex-shrink-0 text-xs" style={{ width: 105, color: S.muted, fontFamily: "monospace" }}>{w.lastLogin}</div>
                      <div className="flex-shrink-0" style={{ width: 70 }}>{w.status === "库存" ? <span className="text-xs" style={{ color: S.muted }}>待上传</span> : <button type="button" title="同步二维码" className="w-7 h-7 grid place-items-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} onClick={e => { e.stopPropagation(); runAccountAction(`${w.wechatId} 的二维码同步任务已创建`); }}><QrCode size={14} /></button>}</div>
                      <div className="flex-shrink-0 flex gap-1.5" style={{ width: 132 }}><button type="button" className="px-2 py-1 text-xs font-semibold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); setSelectedRow(w.no); }}>查看</button><button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={e => { e.stopPropagation(); setSelectedRow(w.no); runAccountAction(`${w.wechatId} 的交接单已创建`); }}>交接</button></div>
                    </div>;
                  })}
                  {paged.length === 0 && <div className="py-16 text-center text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配账号，请调整筛选条件</div>}
                </div>
              </div>
              <BrowsePager page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
            </div>
          )}
          {selectedAccount && <PersonalWechatDetail account={selectedAccount} onClose={() => setSelectedRow(null)} onAction={runAccountAction} />}
        </div>
      </>}
    </div>
  );
}
