import { useState } from "react";
import { getAvatar } from "./Avatar";
import GroupAssignment from "./GroupAssignment";
import { Search, Plus, X, ChevronLeft, ChevronRight, QrCode, Users, ArrowLeft, GitBranch, RefreshCw, ChevronDown, Edit3, Archive, UserCog, SlidersHorizontal } from "lucide-react";
import { buildGroupCode, buildGroupName, defaultGroupTypeRules, pickWechatAccount, type AllocationMode, type GroupTypeRule } from "../data/projectGroupRules";
import { addGeneratedGroups, updateGeneratedGroup, useCommunityData } from "../data/communityDataStore";

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
const mockGroups = [
  { no: "00001", name: "蜂乐玛体验官1群", city: "北京/吉林", wechat: "FLM001", groupNo: "000001", type: "体验官群", ownerStatus: "正常", pushCount: 100, scanCount: 100, memberCount: 100, max: 200 },
  { no: "00002", name: "蜂乐玛体验官2群", city: "北京/吉林", wechat: "FLM001", groupNo: "000002", type: "体验官群", ownerStatus: "正常", pushCount: 786, scanCount: 864, memberCount: 786, max: 1000 },
  { no: "00003", name: "蜂乐玛体验官3群", city: "北京/吉林", wechat: "FLM001", groupNo: "000003", type: "体验官群", ownerStatus: "正常", pushCount: 491, scanCount: 765, memberCount: 491, max: 500 },
  { no: "00004", name: "蜂乐玛尊享群1", city: "上海", wechat: "FLM002", groupNo: "000004", type: "尊享群", ownerStatus: "正常", pushCount: 774, scanCount: 220, memberCount: 200, max: 200 },
  { no: "00005", name: "蜂乐玛游客群1", city: "广州", wechat: "FLM003", groupNo: "000005", type: "游客群", ownerStatus: "正常", pushCount: 204, scanCount: 164, memberCount: 204, max: 500 },
  { no: "00006", name: "蜂乐玛家族群1", city: "深圳", wechat: "FLM004", groupNo: "000006", type: "家族群", ownerStatus: "正常", pushCount: 589, scanCount: 538, memberCount: 500, max: 500 },
  { no: "00007", name: "蜂乐玛体验官4群", city: "成都", wechat: "FLM005", groupNo: "000007", type: "体验官群", ownerStatus: "正常", pushCount: 780, scanCount: 967, memberCount: 380, max: 500 },
  { no: "00008", name: "蜂乐玛游客群2", city: "杭州", wechat: "FLM006", groupNo: "000008", type: "游客群", ownerStatus: "正常", pushCount: 401, scanCount: 805, memberCount: 401, max: 500 },
  { no: "00009", name: "蜂乐玛游客群3", city: "武汉", wechat: "FLM007", groupNo: "000009", type: "游客群", ownerStatus: "正常", pushCount: 308, scanCount: 453, memberCount: 308, max: 500 },
  { no: "00010", name: "蜂乐玛分站管理群", city: "南京", wechat: "FLM008", groupNo: "000010", type: "分站管理群", ownerStatus: "待交接", pushCount: 308, scanCount: 453, memberCount: 88, max: 200 },
  { no: "00011", name: "蜂乐玛PRO会员群1", city: "北京", wechat: "FLM001", groupNo: "000011", type: "PRO会员群", ownerStatus: "正常", pushCount: 0, scanCount: 0, memberCount: 312, max: 500 },
  { no: "00012", name: "蜂乐玛PRO会员群2", city: "上海", wechat: "FLM002", groupNo: "000012", type: "PRO会员群", ownerStatus: "正常", pushCount: 0, scanCount: 0, memberCount: 278, max: 500 },
];

const mockMembers = [
  { no: "00001", avatar: "盛", wechatName: "盛光年", name: "程涛", wechatId: "THEv424", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 2721, revenue: 9815, inGroup: true },
  { no: "00002", avatar: "皮", wechatName: "皮卡丘", name: "钱军", wechatId: "imp11", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 177, revenue: 6305, inGroup: true },
  { no: "00003", avatar: "D", wechatName: "Deborah Rodriguez", name: "文泽", wechatId: "FLM001", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 972, revenue: 9320, inGroup: true },
  { no: "00004", avatar: "梓", wechatName: "梓几", name: "许明", wechatId: "afs612", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 173, revenue: 9658, inGroup: true },
  { no: "00005", avatar: "海", wechatName: "海槽", name: "彭丽", wechatId: "125gfs", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 908, revenue: 5166, inGroup: true },
  { no: "00006", avatar: "D", wechatName: "Deborah Martinez", name: "罗平", wechatId: "DG1245", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 496, revenue: 1807, inGroup: true },
  { no: "00007", avatar: "小", wechatName: "小鸡猪", name: "魏静", wechatId: "?qiuzi512", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 508, revenue: 3956, inGroup: true },
  { no: "00008", avatar: "J", wechatName: "Jessica Anderson", name: "夏雨", wechatId: "dashu25", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 685, revenue: 6459, inGroup: true },
  { no: "00009", avatar: "漠", wechatName: "漠萝君", name: "唐芳", wechatId: "blgd321", city: "北京-北...", level: "体验官", phone: "13732112621", referrer: "皮卡丘", family: "暂无", influence: 831, revenue: 2817, inGroup: true },
];

const typeCfg: Record<string, { bg: string; color: string }> = {
  "体验官群":   { bg: S.accent,   color: "#000" },
  "PRO会员群":  { bg: "#1a1a1a",  color: S.accent },
  "游客群":     { bg: "#f0f0ec",  color: "#555" },
  "尊享群":     { bg: "#ffd600",  color: "#000" },
  "家族群":     { bg: "#f0f0f0", color: "#333333" },
  "分站管理群": { bg: "#f0f0ec",  color: "#555" },
};

const PAGE_SIZE = 8;
const serviceOfficers = ["吴思远", "林小燕", "刘刚", "陈明", "张晓红", "李梦华"];
const managerFor = (group: typeof mockGroups[0] & Partial<GroupForm>) => group.service || serviceOfficers[(Number(group.no) - 1) % serviceOfficers.length];

type GroupForm = {
  project: string; type: string; typeCode: string; city: string; cities: string[]; wechat: string; groupNo: string; name: string;
  note: string; manager: string; service: string; pushCount: string; scanCount: string;
  memberCount: string; allocationMode: AllocationMode; allocationMax: string; quantity: string;
};

// ─── 新建微信群弹窗 ────────────────────────────────────────────
function NewGroupModal({ onClose, group, onSave, rulesByProject }: { onClose: () => void; group?: typeof mockGroups[0] & Partial<GroupForm>; onSave?: (form: GroupForm) => void; rulesByProject: Record<string, GroupTypeRule[]> }) {
  const editing = Boolean(group);
  const projectOptions = Object.keys(rulesByProject);
  const initialProject = group?.project || projectOptions[0] || "蜂乐码";
  const initialRules = rulesByProject[initialProject] || [];
  const initialRule = initialRules.find(rule => `${rule.name}群` === group?.type) || initialRules[0] || defaultGroupTypeRules[0];
  const [form, setForm] = useState<GroupForm>({ project: initialProject, type: initialRule.name, typeCode: group?.typeCode || initialRule.code, city: group?.city || initialRule.cities[0], cities: group?.city?.split("/") || initialRule.cities.slice(0, 2), wechat: group?.wechat || "", groupNo: group?.groupNo || "系统生成", name: group?.name || buildGroupName(initialProject, initialRule.name, initialRule.cities[0], 1), note: group?.note || "", manager: group?.manager || "系统分配", service: group?.service || "系统继承", pushCount: String(group?.pushCount ?? 0), scanCount: String(group?.scanCount ?? 0), memberCount: String(group?.memberCount ?? 0), allocationMode: group?.allocationMode || initialRule.allocationMode, allocationMax: String(group?.allocationMax ?? group?.max ?? initialRule.capacity), quantity: "1" });
  const set = (key: keyof GroupForm, value: string | string[]) => setForm(current => ({ ...current, [key]: value }));
  const activeRules = rulesByProject[form.project] || [];
  const rule = activeRules.find(item => item.name === form.type) || initialRule;
  const inpStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };
  const toggleCity = (city: string) => set("cities", form.cities.includes(city) ? form.cities.filter(item => item !== city) : [...form.cities, city]);
  const previewCount = Math.max(1, Math.min(5, Number(form.quantity) || 1));
  const previewCities = form.allocationMode === "统一分配" ? [form.cities.join("/") || "待选地区"] : Array.from({ length: previewCount }, (_, index) => form.cities[index % Math.max(form.cities.length, 1)] || "待选地区");
  const preview = Array.from({ length: previewCount }, (_, index) => {
    const city = previewCities[index]; const sequence = index + 1; const codeCity = form.allocationMode === "统一分配" ? "全国" : city;
    return { city, code: buildGroupCode(rule.code, codeCity, sequence), name: editing ? form.name : (form.name && previewCount === 1 ? form.name : buildGroupName(form.project, rule.name, city, sequence)) };
  });
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}><div className="w-[680px] max-w-[calc(100vw-28px)] overflow-hidden" style={{ background: "#fff", border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}><div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7" }}><div><div className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// {editing ? "编辑微信群基础信息" : "新建微信群"}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>系统编号只读，地区、微信号和客服按规则自动归属</div></div><button onClick={onClose} aria-label="关闭"><X size={16} style={{ color: S.muted }} /></button></div><div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: "68vh" }}>
    <label className="block text-xs font-bold">项目<select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.project} onChange={e => { const project = e.target.value; const next = rulesByProject[project]?.find(item => item.enabled); setForm(current => ({ ...current, project, type: next?.name || "", typeCode: next?.code || "", cities: next?.cities.slice(0, 2) || [], city: next?.cities[0] || "", name: next ? buildGroupName(project, next.name, next.cities[0], 1) : "", allocationMode: next?.allocationMode || "轮巡分配", allocationMax: String(next?.capacity || 500) })); }} disabled={editing}>{projectOptions.map(project => <option key={project}>{project}</option>)}</select></label>
    <label className="block text-xs font-bold">群类型<select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.type} onChange={e => { const next = activeRules.find(item => item.name === e.target.value) || rule; setForm(current => ({ ...current, type: next.name, typeCode: next.code, name: buildGroupName(current.project, next.name, next.cities[0], 1), allocationMode: next.allocationMode, cities: next.cities.slice(0, 2), allocationMax: String(next.capacity) })); }} disabled={editing || !activeRules.length}>{!activeRules.length && <option value="">请先配置群类型规则</option>}{activeRules.filter(item => item.enabled).map(item => <option key={item.id}>{item.name}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>匹配身份：{activeRules.length ? rule.memberRoles.join("、") : "待配置"}</span></label>
    {!activeRules.length && <div className="col-span-2 px-3 py-2 text-xs" style={{ background: "#fff8e8", color: "#9a5a00", border: "1px solid #f2d6a0", borderRadius: S.radiusSm }}>当前项目尚未配置可用群类型，请先在“项目与生态”的项目配置中新增并启用群类型规则。</div>}
    <div className="col-span-2 p-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}><div className="flex items-center justify-between"><span className="text-xs font-bold">群编号配置</span><span className="text-[10px]" style={{ color: S.muted }}>群类型代码和序号由系统生成</span></div><div className="grid grid-cols-3 gap-2 mt-2"><input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#fff" }} value={rule.code.toUpperCase()} readOnly /><input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#fff" }} value={form.cities.length ? form.cities.join(" / ") : "未选择省份"} readOnly /><input className="px-3 py-2 text-xs" style={{ ...inpStyle, background: "#fff" }} value={preview[0]?.code || "待生成"} readOnly /></div></div>
    <div className="col-span-2"><div className="text-xs font-bold mb-2">管理地区（可多选）</div><div className="flex flex-wrap gap-2">{rule.cities.map(city => <label key={city} className="flex items-center gap-1 px-2.5 py-1.5 text-xs cursor-pointer" style={{ background: form.cities.includes(city) ? "#0d0d0d" : "#f7f7f7", color: form.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${form.cities.includes(city) ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={form.cities.includes(city)} onChange={() => toggleCity(city)} />{city}</label>)}</div></div>
    <label className="block text-xs font-bold">分配方式<select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.allocationMode} onChange={e => set("allocationMode", e.target.value)} disabled={editing}><option>轮巡分配</option><option>统一分配</option></select></label>
    <label className="block text-xs font-bold">创建数量<input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} type="number" min="1" max="100" value={form.quantity} onChange={e => set("quantity", e.target.value)} disabled={editing} /></label>
    <label className="block text-xs font-bold">默认群容量<input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} type="number" min="1" value={form.allocationMax} onChange={e => set("allocationMax", e.target.value)} disabled={editing} /></label>
    <label className="block text-xs font-bold">运营群名{editing ? <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} value={form.name} onChange={e => set("name", e.target.value)} /> : <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="留空使用系统模板" value={form.name === buildGroupName(form.project, rule.name, rule.cities[0], 1) ? "" : form.name} onChange={e => set("name", e.target.value)} />}<span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>默认：项目 + 群类型 + 地区 + 序号 + 群</span></label>
    <div className="col-span-2"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold">生成预览</span><span className="text-[10px]" style={{ color: S.muted }}>预览最多展示 5 个</span></div><div className="border overflow-hidden" style={{ borderColor: S.border, borderRadius: S.radiusSm }}>{preview.map(item => <div key={item.code} className="flex items-center gap-3 px-3 py-2 text-xs" style={{ borderBottom: `1px solid ${S.border}` }}><span className="font-bold" style={{ width: 90, color: S.text }}>{item.code}</span><span className="flex-1" style={{ color: S.textSec }}>{item.name}</span><span style={{ color: S.muted }}>{item.city}</span><span style={{ color: S.muted }}>按建号时间自动分配</span></div>)}</div></div>
    <label className="col-span-2 block text-xs font-bold">群备注<textarea className="w-full mt-1 px-3 py-2 text-xs outline-none resize-none" rows={2} style={inpStyle} placeholder="其他说明..." value={form.note} onChange={e => set("note", e.target.value)} /></label>
  </div><div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}><button onClick={onClose} className="flex-1 py-2.5 text-sm uppercase font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>取消</button><button onClick={() => { onSave?.(form); onClose(); }} disabled={!form.type || !form.cities.length || !activeRules.length} className="flex-1 py-2.5 text-sm font-bold uppercase" style={{ background: form.type && form.cities.length && activeRules.length ? "#0d0d0d" : "#ddd", color: form.type && form.cities.length && activeRules.length ? S.accent : "#888", borderRadius: S.radius, fontFamily: "monospace" }}>{editing ? "保存基础信息" : "生成群组"}</button></div></div></div>;
}

// ─── 入群人名单 ────────────────────────────────────────────────
function MemberList({ group, onBack }: { group: typeof mockGroups[0]; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [page, setPage] = useState(1);
  const [editingMemberNo, setEditingMemberNo] = useState<string | null>(null);

  const filtered = mockMembers.filter(m => {
    const status = m.inGroup ? "已进群" : "待进群";
    return (statusFilter === "全部状态" || status === statusFilter) && (m.wechatName.includes(search) || m.name.includes(search) || m.wechatId.includes(search) || m.phone.includes(search));
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cols = [
    { label: "编号", w: 60 }, { label: "头像", w: 48 }, { label: "微信名", w: 130 },
    { label: "姓名", w: 80 }, { label: "微信号", w: 110 }, { label: "地址", w: 100 },
    { label: "等级", w: 80 }, { label: "手机号码", w: 120 }, { label: "推荐人", w: 80 },
    { label: "家族", w: 70 }, { label: "历史扫码", w: 78 }, { label: "影响力", w: 70 }, { label: "收益", w: 70 }, { label: "入群状态", w: 80 }, { label: "操作", w: 60 },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="flex items-center gap-1.5 text-sm uppercase font-bold" style={{ color: S.text, fontFamily: "monospace" }} onClick={onBack}>
          <ArrowLeft size={15} /> 返回群列表
        </button>
        <span style={{ color: S.muted }}>›</span>
        <span className="text-sm font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{group.name}</span>
        <span className="px-2 py-0.5 text-xs uppercase" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>入群人名单</span>
      </div>

      <div className="flex items-center gap-6 px-4 py-3 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群编号 <span className="ml-1 font-medium" style={{ color: S.text }}>{group.groupNo}</span></div>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>所属微信 <span className="ml-1 font-medium" style={{ color: S.text }}>{group.wechat}</span></div>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>城市 <span className="ml-1 font-medium" style={{ color: S.text }}>{group.city}</span></div>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>推送次数 <span style={{ color: S.text }} className="ml-1 font-medium">{group.pushCount}</span></div>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>扫码次数 <span style={{ color: S.text }} className="ml-1 font-medium">{group.scanCount}</span></div>
        <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>入群人数 <span style={{ color: S.text }} className="ml-1 font-medium">{group.memberCount}/{group.max}</span></div>
        <select value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setPage(1); }} className="px-2.5 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec, fontFamily: "monospace" }} aria-label="按入群状态筛选"><option>全部状态</option><option>已进群</option><option>待进群</option></select>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <Search size={12} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs w-32" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索成员..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        {/* 表头与数据行必须共用同一个滚动容器，避免横向滚动后字段错位 */}
        <div className="flex-1 overflow-auto" aria-label="群成员名单横向滚动表格">
          <div style={{ minWidth: "1120px" }}>
            <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
              {cols.map(c => (
                <div key={c.label} className="flex-shrink-0 text-xs font-medium uppercase" style={{ width: c.w, color: "#555555", fontFamily: "monospace", letterSpacing: "0.05em" }}>{c.label}</div>
              ))}
            </div>
          {paged.map((m) => (
            <div key={m.no} className="flex items-center px-4 py-2.5 transition-all" style={{ background: "transparent", borderBottom: `1px solid ${S.border}`, minWidth: "fit-content" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div className="flex-shrink-0 text-xs" style={{ width: 60, color: S.muted, fontFamily: "monospace" }}>{m.no}</div>
              <div className="flex-shrink-0" style={{ width: 48 }}>
                <img src={getAvatar(parseInt(m.no) - 1)} alt={m.wechatName} style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} />
              </div>
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 130, color: S.text, fontFamily: "monospace" }}>{m.wechatName}</div>
              <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.muted, fontFamily: "monospace" }}>{m.name}</div>
              <div className="flex-shrink-0 text-xs" style={{ width: 110, color: S.muted, fontFamily: "monospace" }}>{m.wechatId}</div>
              <div className="flex-shrink-0 text-xs" style={{ width: 100, color: S.muted, fontFamily: "monospace" }}>{m.city}</div>
              <div className="flex-shrink-0" style={{ width: 80 }}>
                <span className="px-1.5 py-0.5 text-xs uppercase" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{m.level}</span>
              </div>
              <div className="flex-shrink-0 text-xs" style={{ width: 120, color: S.muted, fontFamily: "monospace" }}>{m.phone}</div>
              <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.muted, fontFamily: "monospace" }}>{m.referrer}</div>
              <div className="flex-shrink-0 text-xs" style={{ width: 70, color: S.muted, fontFamily: "monospace" }}>{m.family}</div>
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 78, color: S.textSec, fontFamily: "monospace" }}>{Number(m.no) * 17 + 11}</div>
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 70, color: S.text, fontFamily: "monospace" }}>{m.influence}</div>
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 70, color: S.text, fontFamily: "monospace" }}>{m.revenue}</div>
              <div className="flex-shrink-0" style={{ width: 80 }}>
                <span className="text-xs px-1.5 py-0.5 uppercase" style={{ background: m.inGroup ? S.accent : "#fff7ed", color: m.inGroup ? "#000" : "#c2410c", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{m.inGroup ? "已进群" : "待进群"}</span>
              </div>
              <div className="flex-shrink-0" style={{ width: 60 }}>
                <button className="px-2 py-1 text-xs uppercase font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={event => { event.stopPropagation(); setEditingMemberNo(m.no); }}>修改</button>
              </div>
            </div>
          ))}
          {paged.length === 0 && <div className="py-12 text-center text-xs" style={{ color: S.muted }}>暂无匹配成员，请调整搜索条件</div>}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
          <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>共 {filtered.length} 条成员</div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === 1 ? S.bg : S.accent, color: "#000", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} className="w-7 h-7 text-xs" style={{ background: page === p ? "#1a1a1a" : S.bg, color: page === p ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === totalPages ? S.bg : S.accent, color: "#000", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
          </div>
          <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {PAGE_SIZE} 条</div>
        </div>
      </div>

      {editingMemberNo && (() => {
        const member = mockMembers.find(item => item.no === editingMemberNo);
        if (!member) return null;
        return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.42)" }}>
          <div className="w-[min(420px,calc(100vw-32px))] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}`, background: "#f7f7f7" }}>
              <div><div className="text-sm font-bold" style={{ color: S.text }}>编辑群成员</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>{member.wechatName} · {member.wechatId}</div></div>
              <button type="button" title="关闭编辑" aria-label="关闭编辑" onClick={() => setEditingMemberNo(null)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted }}><X size={15} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>群内角色</label><select defaultValue="普通成员" className="w-full px-2.5 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>普通成员</option><option>群管理员</option><option>群主</option></select></div><div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>进群状态</label><select defaultValue={member.inGroup ? "已进群" : "待进群"} className="w-full px-2.5 py-2 text-xs outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>已进群</option><option>待进群</option><option>已退出</option></select></div></div>
              <div><label className="block text-[10px] mb-1" style={{ color: S.muted }}>成员备注</label><textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="补充成员服务备注..." /></div>
            </div>
            <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" onClick={() => setEditingMemberNo(null)} className="flex-1 py-2 text-xs font-bold" style={{ background: "#f0f0ec", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>取消</button><button type="button" onClick={() => setEditingMemberNo(null)} className="flex-1 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>保存修改</button></div>
          </div>
        </div>;
      })()}
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
export default function CommunityManagement() {
  const [activeWorkspace, setActiveWorkspace] = useState<"groups" | "assignment">("groups");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [cityFilter, setCityFilter] = useState("全部");
  const [managerFilter, setManagerFilter] = useState("全部服务官");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editGroupNo, setEditGroupNo] = useState<string | null>(null);
  const [archivedGroupNos, setArchivedGroupNos] = useState<string[]>([]);
  const [groupEdits, setGroupEdits] = useState<Record<string, Partial<typeof mockGroups[0]>>>({});
  const [memberGroup, setMemberGroup] = useState<typeof mockGroups[0] | null>(null);
  const [selectedGroupNo, setSelectedGroupNo] = useState(mockGroups[1].no);
  const [ownerStatusOverrides, setOwnerStatusOverrides] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState("");
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const { rulesByProject, generatedGroups } = useCommunityData();

  if (activeWorkspace === "assignment") return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      <div className="flex items-center justify-between flex-shrink-0 gap-4">
        <div className="min-w-0"><h2 className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>// 微信群管理</h2><p className="text-xs mt-0.5 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>群库、成员准入与智能分配规则在同一工作区配置</p></div>
        <span className="hidden xl:inline text-xs px-3 py-2" style={{ background: S.accentLight, color: S.textSec, border: `1px solid ${S.accentMid}`, borderRadius: S.radius, fontFamily: "monospace" }}>成员分配规则</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0" role="tablist" aria-label="微信群管理功能">
        <button type="button" role="tab" aria-selected={false} onClick={() => setActiveWorkspace("groups")} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Users size={13} />群库管理</button>
        <button type="button" role="tab" aria-selected className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, border: "1px solid #0d0d0d", borderRadius: S.radiusSm }}><GitBranch size={13} />分配规则 <span className="px-1.5 py-0.5" style={{ background: S.accent, color: "#000", borderRadius: "999px", fontSize: "9px" }}>8</span></button>
      </div>
      <div className="flex-1 min-h-0"><GroupAssignment embedded /></div>
    </div>
  );

  if (memberGroup) return <MemberList group={memberGroup} onBack={() => setMemberGroup(null)} />;

  const groups = [...generatedGroups, ...mockGroups].map(group => ({ ...group, ...(groupEdits[group.no] || {}) })).filter(group => !archivedGroupNos.includes(group.no));
  const types = ["全部", ...Array.from(new Set(groups.map(group => group.type)))];
  const cities = ["全部", ...Array.from(new Set(groups.flatMap(group => group.city.split("/"))))];
  const managers = ["全部服务官", ...serviceOfficers];
  const filtered = groups.filter(g =>
    (typeFilter === "全部" || g.type === typeFilter) &&
    (cityFilter === "全部" || g.city.includes(cityFilter)) &&
    (managerFilter === "全部服务官" || managerFor(g) === managerFilter) &&
    (g.name.includes(search) || g.city.includes(search) || g.wechat.includes(search) || g.groupNo.includes(search))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedGroupBase = groups.find(g => g.no === selectedGroupNo) || filtered[0] || groups[0] || mockGroups[0];
  const selectedGroup = { ...selectedGroupBase, ownerStatus: ownerStatusOverrides[selectedGroupBase.no] || selectedGroupBase.ownerStatus };
  const groupIndex = Math.max(0, Number(selectedGroup.no) - 1);
  const groupMembers = Array.from({ length: 6 }, (_, index) => mockMembers[(groupIndex + index) % mockMembers.length]);
  const capacityPercent = Math.round((selectedGroup.memberCount / selectedGroup.max) * 100);
  const announceAction = (message: string) => setActionNotice(message);
  const saveGroup = (form: GroupForm) => {
    if (!editGroupNo) return;
    const patch = { name: form.name, city: form.city, note: form.note, memberCount: Number(form.memberCount), pushCount: Number(form.pushCount), scanCount: Number(form.scanCount), max: Number(form.allocationMax) };
    setGroupEdits(current => ({ ...current, [editGroupNo]: patch }));
    updateGeneratedGroup(editGroupNo, patch);
    setActionNotice(`${form.name || selectedGroup.name} 的群配置已保存`);
    setEditGroupNo(null);
  };
  const createGroups = (form: GroupForm) => {
    const projectRules = rulesByProject[form.project] || [];
    const rule = projectRules.find(item => item.name === form.type) || projectRules[0];
    if (!rule) { setActionNotice("当前项目尚未配置可用群类型，请先返回项目配置完成规则设置"); return; }
    const quantity = Math.max(1, Math.min(100, Number(form.quantity) || 1));
    const selectedCities = form.cities.length ? form.cities : rule.cities.slice(0, 1);
    const accountUsage: Record<string, number> = {};
    groups.forEach(item => { if (item.wechat && item.wechat !== "待分配") accountUsage[item.wechat] = (accountUsage[item.wechat] || 0) + 1; });
    const sequenceByCity: Record<string, number> = {};
    const generated = Array.from({ length: quantity }, (_, index) => {
      const assignedCity = form.allocationMode === "统一分配" ? "全国" : selectedCities[index % selectedCities.length];
      const displayCity = form.allocationMode === "统一分配" ? selectedCities.join("/") : assignedCity;
      sequenceByCity[assignedCity] = (sequenceByCity[assignedCity] || 0) + 1;
      const sequence = sequenceByCity[assignedCity];
      const account = pickWechatAccount(form.project, assignedCity, accountUsage);
      if (account) accountUsage[account.id] = (accountUsage[account.id] || 0) + 1;
      const customName = form.name && form.name !== buildGroupName(form.project, rule.name, rule.cities[0], 1) ? `${form.name}${quantity > 1 ? `${index + 1}群` : ""}` : buildGroupName(form.project, rule.name, displayCity, sequence);
      return { no: String(groups.length + index + 1).padStart(5, "0"), name: customName, city: displayCity, wechat: account?.wechat || "待分配", groupNo: buildGroupCode(rule.code, assignedCity, sequence), type: `${rule.name}群`, ownerStatus: "正常", pushCount: 0, scanCount: 0, memberCount: 0, max: Number(form.allocationMax) || rule.capacity, service: account?.service || "待分配", project: form.project };
    });
    addGeneratedGroups(generated);
    setActionNotice(`已生成 ${quantity} 个${rule.name}群，微信号与客服按建号时间自动归属`);
  };
  const archiveGroup = (group: typeof mockGroups[0]) => {
    if (group.memberCount > 0) {
      setActionNotice(`${group.name} 仍有 ${group.memberCount} 名成员，请先完成转移后再归档`);
      return;
    }
    setArchivedGroupNos(current => [...current, group.no]);
    setActionNotice(`${group.name} 已归档，可在群库回收站恢复`);
  };
  const setOwnerStatus = (nextStatus: string) => {
    if (nextStatus === selectedGroup.ownerStatus) return;
    setOwnerStatusOverrides(current => ({ ...current, [selectedGroup.no]: nextStatus }));
    setActionNotice(`群主状态已调整为“${nextStatus}”`);
  };
  const tableCols = [
    { label: "编号", w: 120 }, { label: "群名", w: 200 }, { label: "地区", w: 100 },
    { label: "所属微信", w: 90 }, { label: "群类型", w: 100 }, { label: "群主状态", w: 80 }, { label: "服务官", w: 90 },
    { label: "推送次数", w: 80 }, { label: "扫码次数", w: 80 }, { label: "入群人数", w: 90 }, { label: "操作", w: 190 },
  ];
  const usedCount = groups.filter(group => group.memberCount > 0).length;
  const fullCount = groups.filter(group => group.memberCount >= group.max).length;
  const selectedTypeChildren = expandedType ? groups.filter(group => group.type === expandedType) : [];
  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && <NewGroupModal onClose={() => setShowModal(false)} onSave={createGroups} rulesByProject={rulesByProject} />}
      {editGroupNo && (() => { const editGroup = groups.find(group => group.no === editGroupNo); return editGroup ? <NewGroupModal key={editGroupNo} group={editGroup} onClose={() => setEditGroupNo(null)} onSave={saveGroup} rulesByProject={rulesByProject} /> : null; })()}

      <div className="flex items-center justify-between flex-shrink-0 gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>// 微信群管理</h2>
          <p className="text-xs mt-0.5 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>在同一工作区筛选群列表、查看实时详情并执行群运营动作</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden xl:inline text-xs px-3 py-2 uppercase" style={{ background: S.accentLight, color: S.textSec, border: `1px solid ${S.accentMid}`, borderRadius: S.radius, fontFamily: "monospace" }}>列表 / 详情联动</span>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold uppercase" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setShowModal(true)}>
            <Plus size={15} /> 新建微信群
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0" role="tablist" aria-label="微信群管理功能">
        <button type="button" role="tab" aria-selected className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, border: "1px solid #0d0d0d", borderRadius: S.radiusSm }}><Users size={13} />群库管理</button>
        <button type="button" role="tab" aria-selected={false} onClick={() => setActiveWorkspace("assignment")} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><GitBranch size={13} />分配规则 <span className="px-1.5 py-0.5" style={{ background: S.accent, color: "#000", borderRadius: "999px", fontSize: "9px" }}>8</span></button>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
        <div className="flex gap-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {types.map(t => (
            <button
              key={t}
              className="px-3 py-1.5 text-xs transition-all uppercase"
              style={{ background: typeFilter === t ? "#0d0d0d" : "transparent", color: typeFilter === t ? S.accent : S.muted, fontFamily: "monospace", borderRight: `1px solid ${S.border}` }}
              onClick={() => { setTypeFilter(t); setPage(1); }}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          className="px-3 py-1.5 text-xs outline-none"
          style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, color: S.textSec, fontFamily: "monospace" }}
          value={cityFilter}
          onChange={e => { setCityFilter(e.target.value); setPage(1); }}
        >
          {cities.map(c => <option key={c} value={c}>{c === "全部" ? "全部地区" : c}</option>)}
        </select>
        <select className="px-3 py-1.5 text-xs outline-none" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, color: S.textSec, fontFamily: "monospace" }} value={managerFilter} onChange={e => { setManagerFilter(e.target.value); setPage(1); }} aria-label="按服务官筛选">
          {managers.map(manager => <option key={manager}>{manager}</option>)}
        </select>
        <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索群名、城市、微信号..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <div className="text-xs px-3 py-2 uppercase" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radius, fontFamily: "monospace" }}>共 {filtered.length} 个群</div>
      </div>

      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {[['总群数', groups.length], ['已使用', usedCount], ['未使用', groups.length - usedCount], ['已满员', fullCount]].map(([label, value]) => <div key={label as string} className="px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-sm font-bold" style={{ color: S.text }}>{value}</div><div className="text-[10px]" style={{ color: S.muted }}>{label}</div></div>)}
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)_360px] gap-4">
        <section className="min-h-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            <span className="text-xs font-bold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>群列表 / {filtered.length}</span>
            <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>点击行查看详情</span>
          </div>
          <div className="overflow-auto flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}` }}>
            <div className="flex items-center px-4 py-2.5" style={{ background: "#fafafa", minWidth: "1180px" }}>
            {tableCols.map(c => (
              <div key={c.label} className="flex-shrink-0 text-xs font-medium uppercase" style={{ width: c.w, color: "#555555", fontFamily: "monospace", letterSpacing: "0.05em" }}>{c.label}</div>
            ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {paged.map((g) => {
              const tc = typeCfg[g.type] || { bg: "#f0f0ec", color: "#555" };
              const pct = g.memberCount / g.max;
              const active = selectedGroup.no === g.no;
              return (
                <div key={g.no} role="button" tabIndex={0} className="w-full flex items-center px-4 py-2.5 text-left transition-all group" style={{ background: active ? S.accentLight : "transparent", borderBottom: `1px solid ${S.border}`, minWidth: "1180px", boxShadow: active ? `inset 3px 0 0 ${S.accent}` : "none" }}
                  onClick={() => setSelectedGroupNo(g.no)}
                  onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedGroupNo(g.no); } }}
                >
                  <div className="flex-shrink-0 text-xs font-bold" style={{ width: 60, color: S.muted, fontFamily: "monospace" }}>{g.groupNo}</div>
                  <div className="flex-shrink-0" style={{ width: 200 }}>
                    <div className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{g.name}</div>
                    <div className="mt-1 h-1 overflow-hidden" style={{ background: S.border, width: 140, borderRadius: "4px" }}>
                      <div className="h-full" style={{ width: `${Math.min(100, pct * 100)}%`, background: pct >= 0.9 ? "#1a1a1a" : S.accent, borderRadius: "4px" }} />
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: pct >= 0.9 ? S.text : S.muted, fontFamily: "monospace" }}>{g.memberCount}/{g.max}</div>
                  </div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 100, color: S.muted, fontFamily: "monospace" }}>{g.city}</div>
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.wechat}</div>
                  <div className="flex-shrink-0" style={{ width: 100 }}>
                    <span className="px-1.5 py-0.5 text-xs uppercase" style={{ background: tc.bg, color: tc.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{g.type}</span>
                  </div>
                  <div className="flex-shrink-0" style={{ width: 80 }}>
                    <span className="text-xs px-1.5 py-0.5 uppercase" style={{ background: g.ownerStatus === "正常" ? S.accent : "#ffd600", color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{g.ownerStatus}</span>
                  </div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 90, color: S.textSec, fontFamily: "monospace" }}>{managerFor(g)}</div>
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 80, color: S.text, fontFamily: "monospace" }}>{g.pushCount}</div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.textSec, fontFamily: "monospace" }}>{g.scanCount}</div>
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.memberCount} 人</div>
                  <div className="flex-shrink-0 flex items-center gap-1.5" style={{ width: 190 }}>
                    <button className="px-2 py-1 text-xs uppercase font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={(event) => { event.stopPropagation(); setMemberGroup(g); }}>
                      <Users size={11} className="inline mr-0.5" />查看名单
                    </button>
                    <button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={(event) => { event.stopPropagation(); setEditGroupNo(g.no); }}><Edit3 size={11} className="inline mr-0.5" />编辑</button>
                    <button type="button" title="归档群" aria-label="归档群" className="w-7 h-7 grid place-items-center" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={(event) => { event.stopPropagation(); archiveGroup(g); }}><Archive size={13} /></button>
                  </div>
                </div>
              );
            })}
            {expandedType && <div className="mx-4 my-2 p-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold">{expandedType} · 子群明细 ({selectedTypeChildren.length})</span><button className="text-xs" style={{ color: S.muted }} onClick={() => setExpandedType(null)}>收起</button></div><div className="grid grid-cols-2 gap-2">{selectedTypeChildren.map(child => <button key={child.no} className="flex items-center justify-between px-2 py-2 text-left text-xs" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setSelectedGroupNo(child.no)}><span className="font-bold">{child.groupNo}</span><span style={{ color: S.muted }}>{child.city} · {child.memberCount}/{child.max}</span></button>)}</div></div>}
          </div>

          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
            <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>第 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} 条，共 {filtered.length} 条</div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === 1 ? S.bg : S.accent, color: "#000", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className="w-7 h-7 text-xs" style={{ background: page === p ? "#1a1a1a" : S.bg, color: page === p ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === totalPages ? S.bg : S.accent, color: "#000", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
            </div>
            <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {PAGE_SIZE} 条</div>
          </div>
        </section>
        <aside className="min-h-0 overflow-auto flex flex-col gap-3 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="p-3" style={{ background: "#0d0d0d", borderRadius: S.radius, color: S.accent }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase" style={{ color: "rgba(204,255,0,0.65)", fontFamily: "monospace" }}>GROUP / {selectedGroup.groupNo}</div>
                  <div className="text-lg font-semibold mt-0.5" style={{ fontFamily: "monospace", letterSpacing: 0 }}>{selectedGroup.name}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(204,255,0,0.72)", fontFamily: "monospace" }}>{selectedGroup.city} · {selectedGroup.wechat} · {selectedGroup.type}</div>
                  <button type="button" className="mt-2 px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.08)", color: S.accent, border: "1px solid rgba(204,255,0,0.24)", borderRadius: S.radiusSm }} onClick={() => setExpandedType(expandedType === selectedGroup.type ? null : selectedGroup.type)}>{expandedType === selectedGroup.type ? "收起同类型子群" : "展开此群类型下的所有子群"}</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-3">
                {[["推送", selectedGroup.pushCount], ["扫码", selectedGroup.scanCount], ["入群", selectedGroup.memberCount], ["容量", selectedGroup.max]].map(([l, v]) => {
                  const metric = (
                    <>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(204,255,0,0.65)", fontFamily: "monospace" }}>{l}{l === "入群" && <Users size={11} />}</div>
                      <div className="text-base font-semibold mt-0.5" style={{ fontFamily: "monospace" }}>{v}</div>
                    </>
                  );
                  return l === "入群" ? (
                    <button key={l as string} type="button" className="p-2 text-left transition-all" aria-label="查看入群名单" title="查看入群名单" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(204,255,0,0.16)", borderRadius: S.radiusSm, color: S.accent, fontFamily: "monospace" }} onClick={() => setMemberGroup(selectedGroup)}>
                      {metric}
                    </button>
                  ) : (
                    <div key={l as string} className="p-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(204,255,0,0.16)", borderRadius: S.radiusSm }}>
                      {metric}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(204,255,0,0.16)" }}>
                <div className="grid grid-cols-3 gap-2">
                  {[["所属项目", selectedGroup.type.replace("群", "项目")], ["专属服务官", serviceOfficers[groupIndex % serviceOfficers.length]], ["群主状态", selectedGroup.ownerStatus]].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="text-xs" style={{ color: "rgba(204,255,0,0.62)", fontFamily: "monospace" }}>{label}</div>
                      {label === "群主状态" ? (
                        <div className="relative mt-0.5 w-fit">
                          <select aria-label="调整群主状态" title="选择群主状态" value={value} onChange={event => setOwnerStatus(event.target.value)} className="appearance-none cursor-pointer bg-transparent pr-4 text-xs font-bold outline-none" style={{ color: value === "待交接" ? "#ffd600" : S.accent, fontFamily: "monospace" }}>
                            <option value="正常" style={{ background: "#0d0d0d", color: S.accent }}>正常</option>
                            <option value="待交接" style={{ background: "#0d0d0d", color: "#ffd600" }}>待交接</option>
                          </select>
                          <ChevronDown size={12} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" style={{ color: value === "待交接" ? "#ffd600" : S.accent }} />
                        </div>
                      ) : (
                        <div className="text-xs font-bold mt-0.5 truncate" style={{ color: value === "待交接" ? "#ffd600" : S.accent, fontFamily: "monospace" }}>{value}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs flex-shrink-0" style={{ color: "rgba(204,255,0,0.62)", fontFamily: "monospace" }}>容量占用 {capacityPercent}%</span>
                  <div className="h-1 flex-1 overflow-hidden" style={{ background: "rgba(204,255,0,0.14)", borderRadius: 4 }}>
                    <div className="h-full" style={{ width: `${Math.min(100, capacityPercent)}%`, background: capacityPercent >= 90 ? "#ffd600" : S.accent, borderRadius: 4 }} />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(204,255,0,0.16)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase" style={{ color: "rgba(204,255,0,0.72)", fontFamily: "monospace" }}>群运营操作</span>
                  <span className="text-[10px] uppercase" style={{ color: "rgba(255,255,255,0.42)", fontFamily: "monospace" }}>QUICK ACTIONS</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button type="button" className="flex items-center gap-2 px-3 py-2.5 text-left text-xs font-bold" style={{ background: S.accent, color: "#000", border: `1px solid ${S.accent}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => announceAction(`${selectedGroup.name} 的群二维码更新任务已创建`)}>
                    <QrCode size={14} /> 更新群二维码
                  </button>
                  <button type="button" className="flex items-center gap-2 px-3 py-2.5 text-left text-xs font-bold" style={{ background: "rgba(255,255,255,0.08)", color: S.accent, border: "1px solid rgba(204,255,0,0.24)", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => announceAction(`${selectedGroup.name} 的成员名单同步已排队`)}>
                    <RefreshCw size={14} /> 同步成员名单
                  </button>
                  <button type="button" className="col-span-2 flex items-center gap-2 px-3 py-2.5 text-left text-xs font-bold" style={{ background: "transparent", color: "rgba(255,255,255,0.86)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setShowModal(true)}>
                    <Plus size={14} /> 创建承接新群
                  </button>
                </div>
                {actionNotice && <div role="status" className="mt-2 px-3 py-2 text-xs" style={{ background: "rgba(204,255,0,0.12)", color: S.accent, border: "1px solid rgba(204,255,0,0.24)", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{actionNotice}</div>}
              </div>
            </div>

            <div className="p-4" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>群成员名单</div>
                    <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>已入群 {selectedGroup.memberCount} 人 · 展示最近成员</div>
                  </div>
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>最近成员</span>
                </div>
                {groupMembers.map((m, i) => (
                  <div key={m.no} className="flex items-center py-2.5" style={{ borderTop: i === 0 ? "none" : `1px solid ${S.border}` }}>
                    <img src={getAvatar((groupIndex + i) % mockMembers.length)} alt={m.wechatName} style={{ width: 30, height: 30, borderRadius: S.radiusSm, objectFit: "cover" }} />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{m.wechatName}</div>
                      <div className="text-xs truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{selectedGroup.city} / {m.level}</div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{m.influence}</span>
                  </div>
                ))}
              </div>
        </aside>
      </div>
    </div>
  );
}
