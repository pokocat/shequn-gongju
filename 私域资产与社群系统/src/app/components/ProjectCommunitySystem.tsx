import { useMemo, useState } from "react";
import { getAvatar } from "./Avatar";
import GroupAssignment from "./GroupAssignment";
import { Archive, Edit3, GitBranch, Plus, Search, Users, UsersRound, X } from "lucide-react";
import { buildGroupCode, buildGroupName, pickWechatAccount, type AllocationMode, type GroupTypeRule } from "../data/projectGroupRules";
import { addGeneratedGroups, allocateGroupNumbers, archiveGroup, getCommunityScopeKey, saveGroupEdit, useCommunityData, type CommunityScope, type SharedGroup } from "../data/communityDataStore";
import { S, useThemeSingleton } from "../theme";

const MOCK_MEMBERS = [
  { no: "00001", avatar: "盛", wechatName: "盛光年", name: "程涛", wechatId: "THEv424", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 2721, revenue: 9815, inGroup: true },
  { no: "00002", avatar: "皮", wechatName: "皮卡丘", name: "钱军", wechatId: "imp11", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 177, revenue: 6305, inGroup: true },
  { no: "00003", avatar: "D", wechatName: "Deborah Rodriguez", name: "文泽", wechatId: "FLM001", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 972, revenue: 9320, inGroup: true },
  { no: "00004", avatar: "梓", wechatName: "梓几", name: "许明", wechatId: "afs612", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 173, revenue: 9658, inGroup: true },
  { no: "00005", avatar: "海", wechatName: "海槽", name: "彭丽", wechatId: "125gfs", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 908, revenue: 5166, inGroup: true },
  { no: "00006", avatar: "D", wechatName: "Deborah Martinez", name: "罗平", wechatId: "DG1245", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 496, revenue: 1807, inGroup: false },
  { no: "00007", avatar: "小", wechatName: "小鸡猪", name: "魏静", wechatId: "?qiuzi512", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 508, revenue: 3956, inGroup: false },
  { no: "00008", avatar: "J", wechatName: "Jessica Anderson", name: "夏雨", wechatId: "dashu25", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 685, revenue: 6459, inGroup: true },
  { no: "00009", avatar: "漠", wechatName: "漠萝君", name: "唐芳", wechatId: "blgd321", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 831, revenue: 2817, inGroup: true },
];

const serviceOfficers = ["吴思远", "林小燕", "刘刚", "陈明", "张晓红", "李梦华"];
const managerFor = (group: SharedGroup) => group.service || serviceOfficers[(Number(group.no) - 1) % serviceOfficers.length];
const typeCfg: Record<string, { bg: string; color: string }> = {
  "体验官群": { bg: S.accent, color: "#ffffff" },
  "PRO会员群": { bg: "#1e293b", color: S.accent },
  "游客群": { bg: "#f1f5f9", color: "#475569" },
  "尊享群": { bg: "#3b82f6", color: "#ffffff" },
  "家族群": { bg: "#f1f5f9", color: "#475569" },
  "分站管理群": { bg: "#f1f5f9", color: "#475569" },
};

type GroupForm = {
  type: string; typeCode: string; city: string; cities: string[]; wechat: string; groupNo: string; name: string;
  note: string; manager: string; service: string; pushCount: string; scanCount: string;
  memberCount: string; allocationMode: AllocationMode; allocationMax: string; quantity: string;
};

// ─── 创建社群弹窗（锁定当前项目） ───────────────────────────────
function NewGroupModal({ onClose, onSave, group, platform, scope, project, rules }: {
  onClose: () => void; onSave: (form: GroupForm) => void; group?: SharedGroup & Partial<GroupForm>; platform: string; scope: CommunityScope; project?: string; rules: GroupTypeRule[];
}) {
  const editing = Boolean(group);
  const activeRules = rules.filter(rule => rule.enabled);
  const scopeLabel = scope === "platform" ? "平台" : "项目";
  const scopeNameLabel = scope === "platform" ? "平台名称" : "项目名称";
  const communityName = project || platform;
  const initialRule = activeRules.find(rule => `${rule.name}群` === group?.type) || activeRules[0] || { id: "empty", name: "", code: "", tier: "培育" as const, memberRoles: [], entryCondition: "", capacity: 0, cities: [], allocationMode: "轮巡分配" as AllocationMode, nameTemplate: "", enabled: false };
  const [form, setForm] = useState<GroupForm>({
    type: initialRule.name, typeCode: group?.typeCode || initialRule.code, city: group?.city || initialRule.cities[0],
    cities: group?.city?.split("/") || initialRule.cities.slice(0, 2), wechat: group?.wechat || "",
    groupNo: group?.groupNo || "系统生成", name: group?.name || buildGroupName(communityName, initialRule.name, initialRule.cities[0], 1),
    note: group?.note || "", manager: group?.manager || "系统分配", service: group?.service || "系统继承",
    pushCount: String(group?.pushCount ?? 0), scanCount: String(group?.scanCount ?? 0), memberCount: String(group?.memberCount ?? 0),
    allocationMode: group?.allocationMode || initialRule.allocationMode, allocationMax: String(group?.allocationMax ?? group?.max ?? initialRule.capacity), quantity: "1",
  });
  const set = (key: keyof GroupForm, value: string | string[]) => setForm(current => ({ ...current, [key]: value }));
  const rule = activeRules.find(item => item.name === form.type) || initialRule;
  const inpStyle = { background: "#f1f5f9", border: "1px solid rgba(15,23,42,0.12)", color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const toggleCity = (city: string) => set("cities", form.cities.includes(city) ? form.cities.filter(item => item !== city) : [...form.cities, city]);
  const previewCount = Math.max(1, Math.min(5, Number(form.quantity) || 1));
  const previewCities = form.allocationMode === "统一分配" ? [form.cities.join("/") || "待选地区"] : Array.from({ length: previewCount }, (_, index) => form.cities[index % Math.max(form.cities.length, 1)] || "待选地区");
  const preview = Array.from({ length: previewCount }, (_, index) => {
    const city = previewCities[index];
    const sequence = index + 1;
    const codeCity = form.allocationMode === "统一分配" ? "全国" : city;
    return { city, code: buildGroupCode(rule.code, codeCity, sequence), name: editing ? form.name : (form.name && previewCount === 1 ? form.name : buildGroupName(communityName, rule.name, city, sequence)) };
  });
  const canSubmit = Boolean(form.type && form.cities.length && activeRules.length);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="w-[680px] max-w-[calc(100vw-28px)] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.10)", borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#f1f5f9" }}>
          <div>
            <div className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// {editing ? `编辑${scopeLabel}社群` : `创建${scopeLabel}社群 · ${communityName}`}</div>
            <div className="text-[10px] mt-1" style={{ color: S.muted }}>系统编号只读，地区、微信号和客服按规则自动归属</div>
          </div>
          <button onClick={onClose} aria-label="关闭"><X size={16} style={{ color: S.muted }} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: "68vh" }}>
          <label className="block text-xs font-bold">所属{scopeNameLabel}<input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ ...inpStyle, background: "#ffffff" }} value={communityName} readOnly /><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>社群体系按{scopeLabel}隔离，切换{scopeLabel}即切换整套社群</span></label>
          <label className="block text-xs font-bold">群类型<select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.type} onChange={e => { const next = activeRules.find(item => item.name === e.target.value) || rule; setForm(current => ({ ...current, type: next.name, typeCode: next.code, name: buildGroupName(communityName, next.name, next.cities[0], 1), allocationMode: next.allocationMode, cities: next.cities.slice(0, 2), allocationMax: String(next.capacity) })); }} disabled={editing || !activeRules.length}>{!activeRules.length && <option value="">请先配置群类型规则</option>}{activeRules.map(item => <option key={item.id}>{item.name}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>匹配身份：{activeRules.length ? rule.memberRoles.join("、") : "待配置"}</span></label>
          {!activeRules.length && <div className="col-span-2 px-3 py-2 text-xs" style={{ background: "#fff8e8", color: "#9a5a00", border: "1px solid #f2d6a0", borderRadius: S.radiusSm }}>当前{scopeLabel}尚未配置可用群类型，请先在「群类型规则」中新增并启用群类型规则。</div>}
          <div className="col-span-2 p-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold">群编号配置</span><span className="text-[10px]" style={{ color: S.muted }}>群类型代码和序号由系统生成</span></div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#ffffff" }} value={rule.code.toUpperCase()} readOnly />
              <input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#ffffff" }} value={form.cities.length ? form.cities.join(" / ") : "未选择省份"} readOnly />
              <input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#ffffff" }} value={preview[0]?.code || "待生成"} readOnly />
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs font-bold mb-2">管理地区（可多选）</div>
            <div className="flex flex-wrap gap-2">{rule.cities.map(city => <label key={city} className="flex items-center gap-1 px-2.5 py-1.5 text-xs cursor-pointer" style={{ background: form.cities.includes(city) ? "#1e293b" : "#f1f5f9", color: form.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${form.cities.includes(city) ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={form.cities.includes(city)} onChange={() => toggleCity(city)} />{city}</label>)}</div>
          </div>
          <label className="block text-xs font-bold">分配方式<select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.allocationMode} onChange={e => set("allocationMode", e.target.value)} disabled={editing}><option>轮巡分配</option><option>统一分配</option></select></label>
          <label className="block text-xs font-bold">创建数量<input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} type="number" min="1" max="100" value={form.quantity} onChange={e => set("quantity", e.target.value)} disabled={editing} /></label>
          <label className="block text-xs font-bold">默认群容量<input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} type="number" min="1" value={form.allocationMax} onChange={e => set("allocationMax", e.target.value)} disabled={editing} /></label>
          <label className="block text-xs font-bold">运营群名{editing ? <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.name} onChange={e => set("name", e.target.value)} /> : <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="留空使用系统模板" value={form.name === buildGroupName(communityName, rule.name, rule.cities[0], 1) ? "" : form.name} onChange={e => set("name", e.target.value)} />}<span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>默认：{scopeNameLabel} + 群类型 + 地区 + 序号 + 群</span></label>
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold">生成预览</span><span className="text-[10px]" style={{ color: S.muted }}>预览最多展示 5 个</span></div>
            <div className="border overflow-hidden" style={{ borderColor: S.border, borderRadius: S.radiusSm }}>{preview.map(item => <div key={item.code} className="flex items-center gap-3 px-3 py-2 text-xs" style={{ borderBottom: `1px solid ${S.border}` }}><span className="font-bold" style={{ width: 90, color: S.text }}>{item.code}</span><span className="flex-1" style={{ color: S.textSec }}>{item.name}</span><span style={{ color: S.muted }}>{item.city}</span><span style={{ color: S.muted }}>按建号时间自动分配</span></div>)}</div>
          </div>
          <label className="col-span-2 block text-xs font-bold">群备注<textarea className="w-full mt-1 px-3 py-2 text-xs outline-none resize-none" rows={2} style={inpStyle} placeholder="其他说明..." value={form.note} onChange={e => set("note", e.target.value)} /></label>
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm uppercase font-bold" style={{ background: S.bg, color: S.muted, border: "1px solid rgba(0,0,0,0.10)", borderRadius: S.radius, fontFamily: "monospace" }}>取消</button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!canSubmit} className="flex-1 py-2.5 text-sm font-bold uppercase" style={{ background: canSubmit ? "#1e293b" : "#ddd", color: canSubmit ? S.accent : "#888", borderRadius: S.radius, fontFamily: "monospace" }}>{editing ? "保存基础信息" : "生成群组"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── 入群人名单弹窗 ────────────────────────────────────────────
function GroupMemberModal({ group, onClose }: { group: SharedGroup; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [editingMemberNo, setEditingMemberNo] = useState<string | null>(null);
  const filtered = MOCK_MEMBERS.filter(m => {
    const status = m.inGroup ? "已进群" : "待进群";
    return (statusFilter === "全部状态" || status === statusFilter) && (m.wechatName.includes(search) || m.name.includes(search) || m.wechatId.includes(search) || m.phone.includes(search));
  });
  const cols = [
    { label: "编号", w: 60 }, { label: "头像", w: 48 }, { label: "微信名", w: 130 },
    { label: "姓名", w: 80 }, { label: "微信号", w: 110 }, { label: "地址", w: 100 },
    { label: "等级", w: 80 }, { label: "手机号码", w: 120 }, { label: "推荐人", w: 80 },
    { label: "历史扫码", w: 78 }, { label: "影响力", w: 70 }, { label: "入群状态", w: 80 }, { label: "操作", w: 60 },
  ];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.42)" }} onClick={onClose}>
      <div className="w-[min(1060px,calc(100vw-32px))] overflow-hidden" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: S.surface }}>
          <div>
            <div className="text-sm font-bold" style={{ color: S.text }}>入群人名单 · {group.name}</div>
            <div className="text-[10px] mt-1 font-mono" style={{ color: S.muted }}>群编号 {group.groupNo} · 所属微信 {group.wechat} · {group.city} · 入群 {group.memberCount}/{group.max}</div>
          </div>
          <button type="button" title="关闭名单" aria-label="关闭名单" onClick={onClose} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted }}><X size={15} /></button>
        </div>
        <div className="flex items-center gap-3 px-5 py-3" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="px-2.5 py-2 text-xs outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec, fontFamily: "monospace" }} aria-label="按入群状态筛选"><option>全部状态</option><option>已进群</option><option>待进群</option></select>
          <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            <Search size={12} style={{ color: S.muted }} />
            <input className="bg-transparent outline-none text-xs w-40" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索成员..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ml-auto text-xs font-mono" style={{ color: S.muted }}>共 {filtered.length} 条成员</div>
        </div>
        <div className="overflow-auto" style={{ maxHeight: "56vh" }} aria-label="群成员名单横向滚动表格">
          <div style={{ minWidth: "1060px" }}>
            <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}` }}>
              {cols.map(c => <div key={c.label} className="flex-shrink-0 text-xs font-medium uppercase" style={{ width: c.w, color: "#475569", fontFamily: "monospace", letterSpacing: "0.05em" }}>{c.label}</div>)}
            </div>
            {filtered.map(m => (
              <div key={m.no} className="flex items-center px-4 py-2.5" style={{ background: "transparent", borderBottom: `1px solid ${S.border}` }}>
                <div className="flex-shrink-0 text-xs" style={{ width: 60, color: S.muted, fontFamily: "monospace" }}>{m.no}</div>
                <div className="flex-shrink-0" style={{ width: 48 }}><img src={getAvatar(parseInt(m.no) - 1)} alt={m.wechatName} style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} /></div>
                <div className="flex-shrink-0 text-xs font-medium" style={{ width: 130, color: S.text, fontFamily: "monospace" }}>{m.wechatName}</div>
                <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.muted, fontFamily: "monospace" }}>{m.name}</div>
                <div className="flex-shrink-0 text-xs" style={{ width: 110, color: S.muted, fontFamily: "monospace" }}>{m.wechatId}</div>
                <div className="flex-shrink-0 text-xs" style={{ width: 100, color: S.muted, fontFamily: "monospace" }}>{m.city}</div>
                <div className="flex-shrink-0" style={{ width: 80 }}><span className="px-1.5 py-0.5 text-xs uppercase" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{m.level}</span></div>
                <div className="flex-shrink-0 text-xs" style={{ width: 120, color: S.muted, fontFamily: "monospace" }}>{m.phone}</div>
                <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.muted, fontFamily: "monospace" }}>{m.referrer}</div>
                <div className="flex-shrink-0 text-xs font-medium" style={{ width: 78, color: S.textSec, fontFamily: "monospace" }}>{Number(m.no) * 17 + 11}</div>
                <div className="flex-shrink-0" style={{ width: 80 }}><span className="text-xs px-1.5 py-0.5 uppercase" style={{ background: m.inGroup ? S.accent : "#fff7ed", color: m.inGroup ? "#ffffff" : "#c2410c", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{m.inGroup ? "已进群" : "待进群"}</span></div>
                <div className="flex-shrink-0" style={{ width: 60 }}><button className="px-2 py-1 text-xs uppercase font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={event => { event.stopPropagation(); setEditingMemberNo(m.no); }}>修改</button></div>
              </div>
            ))}
            {filtered.length === 0 && <div className="py-10 text-center text-xs" style={{ color: S.muted }}>暂无匹配成员，请调整搜索条件</div>}
          </div>
        </div>
        {editingMemberNo && (() => {
          const member = MOCK_MEMBERS.find(item => item.no === editingMemberNo);
          if (!member) return null;
          return <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.42)" }} onClick={() => setEditingMemberNo(null)}>
            <div className="w-[min(420px,calc(100vw-32px))] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f1f5f9" }}>
                <div><div className="text-sm font-bold" style={{ color: S.text }}>编辑群成员</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>{member.wechatName} · {member.wechatId}</div></div>
                <button type="button" title="关闭编辑" aria-label="关闭编辑" onClick={() => setEditingMemberNo(null)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted }}><X size={15} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>群内角色</label><select defaultValue="普通成员" className="w-full px-2.5 py-2 text-xs outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>普通成员</option><option>群管理员</option><option>群主</option></select></div><div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>进群状态</label><select defaultValue={member.inGroup ? "已进群" : "待进群"} className="w-full px-2.5 py-2 text-xs outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>已进群</option><option>待进群</option><option>已退出</option></select></div></div>
                <div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>成员备注</label><textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="补充成员服务备注..." /></div>
              </div>
              <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" onClick={() => setEditingMemberNo(null)} className="flex-1 py-2 text-xs font-bold" style={{ background: "#f1f5f9", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>取消</button><button type="button" onClick={() => setEditingMemberNo(null)} className="flex-1 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>保存修改</button></div>
            </div>
          </div>;
        })()}
      </div>
    </div>
  );
}

// ─── 社群体系面板：项目配置内闭环（创建社群 / 群库 / 分配规则） ──
export default function ProjectCommunitySystem({ platform, scope, project, rules, onGoRules }: {
  platform: string; scope: CommunityScope; project?: string; rules: GroupTypeRule[]; onGoRules: () => void;
}) {
  useThemeSingleton();
  const { generatedGroups, groupEditsByScope, archivedGroupNosByScope } = useCommunityData();
  const [subTab, setSubTab] = useState<"library" | "assignment">("library");
  const [showModal, setShowModal] = useState(false);
  const [editGroupNo, setEditGroupNo] = useState<string | null>(null);
  const [memberGroup, setMemberGroup] = useState<SharedGroup | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const enabledRules = rules.filter(rule => rule.enabled);
  const scopeLabel = scope === "platform" ? "平台" : "项目";
  const scopeKey = getCommunityScopeKey(platform, scope, project);
  const communityName = project || platform;
  const scopeEdits = groupEditsByScope[scopeKey] || {};
  const archivedNos = archivedGroupNosByScope[scopeKey] || [];
  const projectGroups = useMemo(() => generatedGroups
    .filter(group => getCommunityScopeKey(group.platform, group.scope, group.project) === scopeKey)
    .map(group => ({ ...group, ...(scopeEdits[group.no] || {}) }))
    .filter(group => !archivedNos.includes(group.no)), [generatedGroups, scopeKey, scopeEdits, archivedNos]);
  const filtered = projectGroups.filter(g => g.name.includes(search) || g.city.includes(search) || g.wechat.includes(search) || g.groupNo.includes(search));
  const usedCount = projectGroups.filter(g => g.memberCount > 0).length;
  const fullCount = projectGroups.filter(g => g.memberCount >= g.max).length;
  const totalCapacity = projectGroups.reduce((sum, g) => sum + g.max, 0);

  const createGroups = (form: GroupForm) => {
    const rule = enabledRules.find(item => item.name === form.type);
    if (!rule) { setNotice(`当前${scopeLabel}尚未配置可用群类型，请先在「群类型规则」中启用`); return; }
    const quantity = Math.max(1, Math.min(100, Number(form.quantity) || 1));
    const selectedCities = form.cities.length ? form.cities : rule.cities.slice(0, 1);
    const accountUsage: Record<string, number> = {};
    projectGroups.forEach(item => { if (item.wechat && item.wechat !== "待分配") accountUsage[item.wechat] = (accountUsage[item.wechat] || 0) + 1; });
    const numbers = allocateGroupNumbers(platform, scope, project, quantity);
    const sequenceByCity: Record<string, number> = {};
    const generated: SharedGroup[] = Array.from({ length: quantity }, (_, index) => {
      const assignedCity = form.allocationMode === "统一分配" ? "全国" : selectedCities[index % selectedCities.length];
      const displayCity = form.allocationMode === "统一分配" ? selectedCities.join("/") : assignedCity;
      sequenceByCity[assignedCity] = (sequenceByCity[assignedCity] || 0) + 1;
      const sequence = sequenceByCity[assignedCity];
      const account = pickWechatAccount(scope, project, assignedCity, accountUsage);
      if (account) accountUsage[account.id] = (accountUsage[account.id] || 0) + 1;
      const customName = form.name && form.name !== buildGroupName(communityName, rule.name, rule.cities[0], 1) ? `${form.name}${quantity > 1 ? `${index + 1}群` : ""}` : buildGroupName(communityName, rule.name, displayCity, sequence);
      return { no: numbers[index], name: customName, city: displayCity, wechat: account?.wechat || "待分配", groupNo: buildGroupCode(rule.code, assignedCity, sequence), type: `${rule.name}群`, ownerStatus: "正常", pushCount: 0, scanCount: 0, memberCount: 0, max: Number(form.allocationMax) || rule.capacity, service: account?.service || "待分配", platform, scope, ...(scope === "project" ? { project } : {}) };
    });
    addGeneratedGroups(generated);
    setNotice(`已生成 ${quantity} 个${rule.name}群，微信号与客服按建号时间自动归属`);
  };
  const saveGroup = (form: GroupForm) => {
    if (!editGroupNo) return;
    const target = projectGroups.find(group => group.no === editGroupNo);
    const patch = { name: form.name, city: form.city, note: form.note, memberCount: Number(form.memberCount), pushCount: Number(form.pushCount), scanCount: Number(form.scanCount), max: Number(form.allocationMax) };
    saveGroupEdit(platform, scope, project, editGroupNo, patch);
    setNotice(`${form.name || target?.name} 的群配置已保存`);
    setEditGroupNo(null);
  };
  const handleArchiveGroup = (group: SharedGroup) => {
    if (group.memberCount > 0) { setNotice(`${group.name} 仍有 ${group.memberCount} 名成员，请先完成转移后再归档`); return; }
    archiveGroup(platform, scope, project, group.no);
    setNotice(`${group.name} 已归档，可在群库中恢复`);
  };
  const editGroup = editGroupNo ? projectGroups.find(group => group.no === editGroupNo) : null;

  return (
    <div className="space-y-3">
      {showModal && <NewGroupModal onClose={() => setShowModal(false)} onSave={createGroups} platform={platform} scope={scope} project={project} rules={rules} />}
      {editGroup && <NewGroupModal key={editGroup.no} group={{ ...editGroup, ...(scopeEdits[editGroup.no] || {}) }} onClose={() => setEditGroupNo(null)} onSave={saveGroup} platform={platform} scope={scope} project={project} rules={rules} />}
      {memberGroup && <GroupMemberModal group={memberGroup} onClose={() => setMemberGroup(null)} />}
      {notice && <div className="fixed top-5 left-1/2 z-[80] px-4 py-2.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transform: "translateX(-50%)" }} onClick={() => setNotice("")}>{notice}</div>}

      <div className="p-4" style={{ background: S.accentLight, border: "1px solid rgba(204,255,0,.35)", borderRadius: S.radius }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold"><UsersRound size={16} />{scopeLabel}社群体系 · 随{scopeLabel}闭环</div>
          <span className="text-[10px] font-mono" style={{ color: S.muted }}>群类型规则 → 创建社群 → 分配规则 → 入群名单</span>
        </div>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: S.muted }}>社群是「{communityName}」的运营载体：先在群类型规则中定义漏斗层级，再按规则生成社群，新会员入群由分配规则自动路由；切换{scopeLabel}即切换整套社群体系。</p>
      </div>

      {!enabledRules.length && (
        <div className="p-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: S.radius }}>
          <div className="text-xs font-bold" style={{ color: "#9a3412" }}>当前{scopeLabel}尚未启用任何群类型</div>
          <div className="text-[11px] mt-1" style={{ color: "#9a3412" }}>先在「群类型规则」中启用群类型，才能创建{scopeLabel}社群。</div>
          <button type="button" className="mt-2 px-3 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={onGoRules}>去配置群类型规则</button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {[["群总数", projectGroups.length], ["已使用", usedCount], ["已满员", fullCount], ["总容量", totalCapacity.toLocaleString()]].map(([label, value]) => (
          <div key={label as string} className="px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-sm font-bold" style={{ color: S.text }}>{value as number}</div>
            <div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1" role="tablist" aria-label="社群体系工作区">
          <button type="button" role="tab" aria-selected={subTab === "library"} onClick={() => setSubTab("library")} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: subTab === "library" ? "#1e293b" : S.surface, color: subTab === "library" ? S.accent : S.muted, border: `1px solid ${subTab === "library" ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><Users size={13} />群库 <span className="px-1.5 py-0.5" style={{ background: S.accent, color: S.onPrimary, borderRadius: "999px", fontSize: "9px" }}>{projectGroups.length}</span></button>
          <button type="button" role="tab" aria-selected={subTab === "assignment"} onClick={() => setSubTab("assignment")} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: subTab === "assignment" ? "#1e293b" : S.surface, color: subTab === "assignment" ? S.accent : S.muted, border: `1px solid ${subTab === "assignment" ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><GitBranch size={13} />分配规则</button>
        </div>
        <button type="button" disabled={!enabledRules.length} onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: enabledRules.length ? "#1e293b" : "#ddd", color: enabledRules.length ? S.accent : "#888", borderRadius: S.radiusSm }}>
          <Plus size={13} />创建{scopeLabel}社群
        </button>
      </div>

      {subTab === "library" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <Search size={13} style={{ color: S.muted }} />
            <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索群名、城市、微信号、群编号..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
          </div>
          <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, maxHeight: 340 }}>
            <div style={{ minWidth: 860 }}>
              <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}` }}>
                {([["群编号", 90], ["群名", 220], ["地区", 90], ["所属微信", 90], ["群类型", 90], ["服务官", 80], ["入群人数", 110], ["操作", 150]] as [string, number][]).map(([label, w]) => (
                  <div key={label} className="flex-shrink-0 text-xs font-medium uppercase" style={{ width: w, color: "#475569", fontFamily: "monospace", letterSpacing: "0.05em" }}>{label}</div>
                ))}
              </div>
              {filtered.map(g => {
                const tc = typeCfg[g.type] || { bg: "#f1f5f9", color: "#475569" };
                const pct = g.memberCount / g.max;
                return (
                  <div key={g.no} className="flex items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <div className="flex-shrink-0 text-xs font-bold" style={{ width: 90, color: S.muted, fontFamily: "monospace" }}>{g.groupNo}</div>
                    <div className="flex-shrink-0" style={{ width: 220 }}>
                      <div className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{g.name}</div>
                      <div className="mt-1 h-1 overflow-hidden" style={{ background: S.border, width: 160, borderRadius: "4px" }}>
                        <div className="h-full" style={{ width: `${Math.min(100, pct * 100)}%`, background: pct >= 0.9 ? "#1e293b" : S.accent, borderRadius: "4px" }} />
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: pct >= 0.9 ? S.text : S.muted, fontFamily: "monospace" }}>{g.memberCount}/{g.max}</div>
                    </div>
                    <div className="flex-shrink-0 text-xs" style={{ width: 90, color: S.muted, fontFamily: "monospace" }}>{g.city}</div>
                    <div className="flex-shrink-0 text-xs font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.wechat}</div>
                    <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 text-xs" style={{ background: tc.bg, color: tc.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{g.type}</span></div>
                    <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.textSec, fontFamily: "monospace" }}>{managerFor(g)}</div>
                    <div className="flex-shrink-0 text-xs font-medium" style={{ width: 110, color: S.text, fontFamily: "monospace" }}>{g.memberCount} 人</div>
                    <div className="flex-shrink-0 flex items-center gap-1.5" style={{ width: 150 }}>
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setMemberGroup(g)}><Users size={11} className="inline mr-0.5" />名单</button>
                      <button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEditGroupNo(g.no)}><Edit3 size={11} className="inline mr-0.5" />编辑</button>
                      <button type="button" title="归档群" aria-label="归档群" className="w-7 h-7 grid place-items-center" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => handleArchiveGroup(g)}><Archive size={13} /></button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <div className="py-10 text-center text-xs" style={{ color: S.muted }}>{enabledRules.length ? `本${scopeLabel}暂无社群，点击右上角「创建${scopeLabel}社群」开始搭建` : `启用群类型规则后即可创建${scopeLabel}社群`}</div>}
            </div>
          </div>
        </div>
      )}

      {subTab === "assignment" && (
        <div className="space-y-2">
          <div className="p-3 text-xs leading-relaxed" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, color: S.muted }}>
            新会员按 <b style={{ color: S.text }}>城市 + 会员身份 + 群容量</b> 自动路由到当前{scopeLabel}的目标社群；满员群自动跳过，支持人工调整。
          </div>
          <div className="h-[560px] overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius, background: S.bg }}>
            <GroupAssignment embedded />
          </div>
        </div>
      )}
    </div>
  );
}
