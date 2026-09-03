/**
 * 项目资产列表 —— 会员运营工作台「会员运营」Tab 的核心视图。
 *
 * 「项目 × 资产类型」双维度矩阵：
 *   第一层：工作台 Tab（MemberOperationsWorkbench 提供）
 *   第二层：左侧项目栏（全部项目 / 12 个项目 / 库存池）
 *   第三层：顶部 微信号 | 微信群 | 代理·会员 segmented（计数徽章可直接点击切换）
 *   第四层：列表内搜索 + 筛选 + 排序
 *
 * 选中状态同步到 URL（?proj=&asset=），刷新/分享不丢。
 */
import { useMemo, useState } from "react";
import { ArrowUpDown, Building2, ChevronRight, Download, PackageOpen, Search, Smartphone, MessagesSquare, UserRound, Users } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
import { initialProjects, PLATFORM_POOL_ID, projectStatusBadge } from "../data/communicationTools";
import { projectWechats, projectGroups, projectPersons, type ProjectGroup, type ProjectPerson, type ProjectWechat } from "../data/projectAssets";

type AssetType = "wechat" | "groups" | "people";

const ASSET_TABS: Array<{ id: AssetType; label: string; icon: typeof UserRound }> = [
  { id: "wechat", label: "微信号", icon: Smartphone },
  { id: "groups", label: "微信群", icon: MessagesSquare },
  { id: "people", label: "代理 · 会员", icon: Users },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "使用中": { color: "#07c160", bg: "#ecfdf5" },
  "异常":   { color: "#dc2626", bg: "#fef2f2" },
  "未使用": { color: "#6b7280", bg: "#f3f4f6" },
  "待交接": { color: "#f59e0b", bg: "#fffbeb" },
  "正常":   { color: "#07c160", bg: "#ecfdf5" },
};

const SERIES_STYLES: Record<string, { color: string; bg: string }> = {
  "代理群系列":     { color: "#b45309", bg: "#fff7ed" },
  "零售会员类群系列": { color: "#1d4ed8", bg: "#eff6ff" },
};

const ROLE_STYLES: Record<string, { color: string; bg: string }> = {
  "代理": { color: "#7c3aed", bg: "#f5f3ff" },
  "会员": { color: "#0e7490", bg: "#ecfeff" },
};

const LEVEL_STYLES: Record<string, { color: string; bg: string }> = {
  "PRO会员": { color: "#3f6212", bg: "#f7fee7" },
  "体验官":  { color: "#1d4ed8", bg: "#eff6ff" },
  "新会员":  { color: "#334155", bg: "#f1f5f9" },
  "总代":    { color: "#b45309", bg: "#fef3c7" },
  "一级":    { color: "#7c3aed", bg: "#f5f3ff" },
  "二级":    { color: "#475569", bg: "#f1f5f9" },
};

function badge(color: string, bg: string, label: string, extraStyle?: Record<string, string | number>) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap"
      style={{ color, background: bg, borderRadius: 4, ...extraStyle }}>
      {label}
    </span>
  );
}

/** 导出当前视图为 CSV（带 UTF-8 BOM，Excel 打开中文不乱码） */
function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "\uFEFF" + [headers, ...rows].map(r => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProjectAssetList() {
  useThemeSingleton();
  const initialParams = new URLSearchParams(window.location.search);
  const [projectId, setProjectId] = useState<string>(initialParams.get("proj") || "all");
  const [asset, setAsset] = useState<AssetType>(() => {
    const a = initialParams.get("asset");
    return a === "groups" || a === "people" ? a : "wechat";
  });
  // 搜索与筛选
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("全部状态");
  const [kindF, setKindF] = useState("全部类型");
  const [seriesF, setSeriesF] = useState("全部系列");
  const [roleF, setRoleF] = useState("全部身份");
  const [levelF, setLevelF] = useState("全部等级");
  // 排序
  const [sortKey, setSortKey] = useState("influence");
  const [sortDesc, setSortDesc] = useState(true);

  const setProject = (pid: string) => { setProjectId(pid); syncUrl(pid, asset); };
  const setAssetType = (a: AssetType) => { setAsset(a); syncUrl(projectId, a); };
  function syncUrl(proj: string, ast: string) {
    const url = new URL(window.location.href);
    if (proj === "all") url.searchParams.delete("proj"); else url.searchParams.set("proj", proj);
    if (ast === "wechat") url.searchParams.delete("asset"); else url.searchParams.set("asset", ast);
    window.history.replaceState({}, "", url);
  }
  const changeSort = (key: string) => {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(true); }
  };
  const sortByKey = <T,>(rows: T[], keyCmp: (r: T) => number): T[] =>
    [...rows].sort((a, b) => sortDesc ? keyCmp(b) - keyCmp(a) : keyCmp(a) - keyCmp(b));

  // —— 项目解析 ——
  const selectedProject = projectId === "all" ? null
    : projectId === PLATFORM_POOL_ID ? { id: PLATFORM_POOL_ID, name: "库存池", short: "POOL", owner: "—", status: "active" as const, subtitle: "未分配给任何项目的账号", budget: "—", createdAt: "", ownerUid: "" }
    : initialProjects.find(p => p.id === projectId) || null;

  const pickProject = <T extends { projectId: string }>(rows: T[]): T[] =>
    projectId === "all" ? rows : rows.filter(r => r.projectId === projectId);

  // —— 三资产过滤 + 排序 ——
  const wechats = useMemo(() => {
    let rows = pickProject(projectWechats);
    if (kindF !== "全部类型") rows = rows.filter(w => w.kind === (kindF === "个人微信" ? "wechat" : "wecom"));
    if (statusF !== "全部状态") rows = rows.filter(w => w.status === statusF);
    if (q.trim()) { const kw = q.trim().toLowerCase(); rows = rows.filter(w => (w.account + w.nickname + w.owner).toLowerCase().includes(kw)); }
    if (sortKey === "friend") return sortByKey(rows, w => w.friendCount);
    if (sortKey === "groups") return sortByKey(rows, w => w.groupCount);
    return sortByKey(rows, w => +(w.lastLogin.replace(/-/g, "") || 0));
  }, [projectId, kindF, statusF, q, sortKey, sortDesc]);

  const groups = useMemo(() => {
    let rows = pickProject(projectGroups);
    if (seriesF !== "全部系列") rows = rows.filter(g => g.series === seriesF);
    if (statusF !== "全部状态") rows = rows.filter(g => g.ownerStatus === statusF);
    if (q.trim()) { const kw = q.trim().toLowerCase(); rows = rows.filter(g => (g.name + g.wechat + g.city + g.type).toLowerCase().includes(kw)); }
    if (sortKey === "members") return sortByKey(rows, g => g.members);
    if (sortKey === "push") return sortByKey(rows, g => g.push);
    return sortByKey(rows, g => g.scan);
  }, [projectId, seriesF, statusF, q, sortKey, sortDesc]);

  const persons = useMemo(() => {
    let rows = pickProject(projectPersons);
    if (roleF !== "全部身份") rows = rows.filter(p => p.role === roleF);
    if (levelF !== "全部等级") rows = rows.filter(p => p.level === levelF);
    if (q.trim()) { const kw = q.trim().toLowerCase(); rows = rows.filter(p => (p.name + p.wechat + p.referrer).toLowerCase().includes(kw)); }
    if (sortKey === "team") return sortByKey(rows, p => p.teamCount);
    if (sortKey === "revenue") return sortByKey(rows, p => p.revenue);
    return sortByKey(rows, p => p.influence);
  }, [projectId, roleF, levelF, q, sortKey, sortDesc]);

  // —— 计数 ——
  const counts = useMemo(() => ({
    wechat: pickProject(projectWechats).length,
    groups: pickProject(projectGroups).length,
    people: pickProject(projectPersons).length,
  }), [projectId]);

  const activeRows = asset === "wechat" ? wechats : asset === "groups" ? groups : persons;
  const projectNames = useMemo(() => {
    const m = new Map(initialProjects.map(p => [p.id, p.name]));
    return (pid: string) => (pid === PLATFORM_POOL_ID ? "库存池" : m.get(pid) || "—");
  }, []);

  const sortOptions = asset === "wechat"
    ? [["friend", "好友数"], ["groups", "群数"], ["lastLogin", "最近登录"]]
    : asset === "groups"
      ? [["members", "群人数"], ["push", "推送次数"], ["scan", "扫码次数"]]
      : [["influence", "影响力"], ["team", "团队人数"], ["revenue", "收益"]];

  const emptyHint = asset === "wechat"
    ? { title: projectId === PLATFORM_POOL_ID ? "库存池暂无未分配账号" : "该项目暂无微信号", sub: "去账号资产中心录入 / 分配微信号", href: "?view=pc&module=wechat", cta: "去账号资产中心" }
    : asset === "groups"
      ? { title: projectId === PLATFORM_POOL_ID ? "库存池不包含微信群" : "该项目暂无微信群", sub: "在账号资产中心为微信号分配群位后自动出现在这里", href: "?view=pc&module=wechat", cta: "去分配群位" }
      : { title: projectId === PLATFORM_POOL_ID ? "库存池不包含人员" : "该项目暂无代理 / 会员", sub: "会员入群或代理开卡后自动出现在这里", href: "?view=pc&module=members", cta: "去会员档案" };

  // —— 导出 CSV 配置（导出当前筛选+排序后的数据）——
  const exportConfig = asset === "wechat"
    ? {
        name: "微信号",
        headers: ["账号", "类型", "昵称", "归属项目", "服务负责人", "状态", "好友数", "群数", "认证", "最近登录"],
        rows: (wechats as ProjectWechat[]).map(w => [w.account, w.kind === "wechat" ? "个人微信" : "企业微信", w.nickname === "—" ? "未激活" : w.nickname, projectNames(w.projectId), w.owner, w.status, w.friendCount, w.groupCount, w.certified ? "已认证" : "未认证", w.lastLogin]),
      }
    : asset === "groups"
      ? {
          name: "微信群",
          headers: ["群编号", "群名", "系列", "群类型", "编码", "群主微信号", "城市", "人数", "容量", "推送", "扫码", "状态"],
          rows: (groups as ProjectGroup[]).map(g => [g.no, g.name, g.series, g.type, g.code, g.wechat, g.city, g.members, g.max, g.push, g.scan, g.ownerStatus]),
        }
      : {
          name: "代理会员",
          headers: ["姓名", "身份", "等级", "微信号", "归属项目", "上级推荐人", "团队人数", "影响力", "收益", "入群状态"],
          rows: (persons as ProjectPerson[]).map(p => [p.name, p.role, p.level, p.wechat, projectNames(p.projectId), p.referrer, p.teamCount, p.influence, p.revenue, p.inGroup ? "已入群" : "待入群"]),
        };
  const exportFileName = `${selectedProject ? selectedProject.name : "全部项目"}-${exportConfig.name}-${new Date().toISOString().slice(0, 10)}.csv`;

  return (
    <div className="h-full flex" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* ── 第一层结构：左侧项目栏 ─────────────────────────── */}
      <aside className="w-56 flex-shrink-0 overflow-auto" style={{ background: "#fff", borderRight: `1px solid ${S.border}` }}>
        <div className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase" style={{ color: S.muted }}>项目 · {initialProjects.length + 1} 个</div>
        {[{ id: "all", name: "全部项目", short: "ALL" }, ...initialProjects.map(p => ({ id: p.id, name: p.name, short: p.short })), { id: PLATFORM_POOL_ID, name: "库存池", short: "POOL" }].map(proj => {
          const isOn = projectId === proj.id;
          const realP = proj.id === "all" || proj.id === PLATFORM_POOL_ID ? null : initialProjects.find(p => p.id === proj.id);
          const st = realP ? projectStatusBadge(realP.status) : null;
          const cnt = proj.id === "all"
            ? projectWechats.length + projectGroups.length + projectPersons.length
            : (proj.id === PLATFORM_POOL_ID ? projectWechats.filter(w => w.projectId === PLATFORM_POOL_ID).length : projectWechats.filter(w => w.projectId === proj.id).length + projectGroups.filter(g => g.projectId === proj.id).length + projectPersons.filter(p => p.projectId === proj.id).length);
          return (
            <button key={proj.id} type="button" onClick={() => setProject(proj.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
              style={{ background: isOn ? "#1e293b" : "transparent", borderLeft: `3px solid ${isOn ? S.accent : "transparent"}` }}>
              <span className="text-xs font-bold truncate flex-1" style={{ color: isOn ? "#fff" : S.text }}>{proj.name}</span>
              <span className="text-[9px] font-bold" style={{ color: isOn ? "rgba(204,255,0,0.7)" : S.muted }}>{proj.short}</span>
              {st && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.color }} />}
              <span className="text-[9px] text-right tabular-nums min-w-6" style={{ color: isOn ? "rgba(255,255,255,0.6)" : S.muted }}>{cnt}</span>
              {isOn && <ChevronRight size={12} style={{ color: S.accent }} />}
            </button>
          );
        })}
        <div className="px-3 py-3 text-[9px] leading-relaxed" style={{ color: S.muted, borderTop: `1px dashed ${S.border}`, marginTop: 4 }}>
          计数 = 该项目的微信号 + 微信群 + 代理·会员
        </div>
      </aside>

      {/* ── 右侧主区 ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* 项目摘要条：三个计数徽章直接切换资产类型 */}
        <div className="px-5 py-3 flex-shrink-0" style={{ background: "#fff", borderBottom: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: S.text }}>{selectedProject ? selectedProject.name : "全部项目"}</span>
                {selectedProject && selectedProject.id !== PLATFORM_POOL_ID && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "#eef2ff", color: "#4338ca", borderRadius: 4 }}>{selectedProject.short}</span>
                )}
                {selectedProject && selectedProject.id !== PLATFORM_POOL_ID && selectedProject.status && (() => { const st = projectStatusBadge(selectedProject.status as "active"); return badge(st.color, st.bg, st.label); })()}
              </div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>
                {selectedProject
                  ? (selectedProject.id === PLATFORM_POOL_ID ? "未分配给任何项目的账号归集在这里" : `${selectedProject.owner} · ${selectedProject.budget} · ${selectedProject.subtitle}`)
                  : `全部 ${initialProjects.length} 个项目 · 聚合查看所有资产`}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {ASSET_TABS.map(tab => {
                const Icon = tab.icon;
                const on = asset === tab.id;
                const value = tab.id === "wechat" ? counts.wechat : tab.id === "groups" ? counts.groups : counts.people;
                return (
                  <button key={tab.id} type="button" onClick={() => setAssetType(tab.id)} title={`切换到${tab.label}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-left transition-all"
                    style={{ background: on ? "#1e293b" : "#fff", color: on ? S.accent : S.textSec, border: `1px solid ${on ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}>
                    <Icon size={13} />
                    <span className="text-[11px] font-bold whitespace-nowrap">{tab.label}</span>
                    <span className="text-[10px] font-bold tabular-nums px-1.5 min-w-6 text-center" style={{ background: on ? "rgba(204,255,0,0.16)" : "#f1f5f9", color: on ? S.accent : S.textSec, borderRadius: 999 }}>{value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 资产类型 segmented + 筛选行 */}
        <div className="px-5 pt-3 pb-2 flex-shrink-0 flex items-center gap-2 flex-wrap" style={{ background: S.bg }}>
          <div className="flex items-center gap-1" role="tablist" aria-label="资产类型">
            {ASSET_TABS.map(tab => (
              <button key={tab.id} type="button" role="tab" aria-selected={asset === tab.id} onClick={() => setAssetType(tab.id)}
                className="px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
                style={{ background: asset === tab.id ? S.accent : "#fff", color: asset === tab.id ? "#0b0f14" : S.muted, border: `1px solid ${asset === tab.id ? S.accent : S.border}`, borderRadius: S.radiusSm }}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <Search size={13} style={{ color: S.muted }} />
              <input className="w-40 bg-transparent outline-none text-xs" style={{ color: S.textSec }} placeholder={asset === "wechat" ? "搜索账号 / 昵称 / 负责人" : asset === "groups" ? "搜索群名 / 群主 / 城市" : "搜索姓名 / 微信号"} value={q} onChange={e => setQ(e.target.value)} />
            </div>
            {asset === "wechat" && (
              <>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={kindF} onChange={e => setKindF(e.target.value)}>
                  {["全部类型", "个人微信", "企业微信"].map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={statusF} onChange={e => setStatusF(e.target.value)}>
                  {["全部状态", "使用中", "异常", "未使用", "待交接"].map(o => <option key={o}>{o}</option>)}
                </select>
              </>
            )}
            {asset === "groups" && (
              <>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={seriesF} onChange={e => setSeriesF(e.target.value)}>
                  {["全部系列", "代理群系列", "零售会员类群系列"].map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={statusF} onChange={e => setStatusF(e.target.value)}>
                  {["全部状态", "正常", "待交接", "异常"].map(o => <option key={o}>{o}</option>)}
                </select>
              </>
            )}
            {asset === "people" && (
              <>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={roleF} onChange={e => { setRoleF(e.target.value); setLevelF("全部等级"); }}>
                  {["全部身份", "代理", "会员"].map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="px-2 py-1.5 text-xs outline-none" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.textSec }} value={levelF} onChange={e => setLevelF(e.target.value)}>
                  {(roleF === "代理" ? ["全部等级", "总代", "一级", "二级"] : roleF === "会员" ? ["全部等级", "PRO会员", "体验官", "新会员"] : ["全部等级", "PRO会员", "体验官", "新会员", "总代", "一级", "二级"]).map(o => <option key={o}>{o}</option>)}
                </select>
              </>
            )}
            <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <ArrowUpDown size={12} style={{ color: S.muted }} />
              <select className="bg-transparent outline-none text-xs" style={{ color: S.textSec }} value={sortKey} onChange={e => changeSort(e.target.value)}>
                {sortOptions.map(([k, label]) => <option key={k} value={k}>{label}{sortKey === k ? (sortDesc ? " ↓" : " ↑") : ""}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => exportCsv(exportFileName, exportConfig.headers, exportConfig.rows)}
              title={`导出当前视图为 CSV（共 ${activeRows.length} 条）`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold transition-all hover:brightness-95"
              style={{ background: "#fff", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <Download size={13} style={{ color: S.muted }} />
              导出 CSV
            </button>
          </div>
        </div>

        {/* 列表区 */}
        <div className="flex-1 min-h-0 overflow-auto px-5 pb-8">
          {!activeRows.length ? (
            <div className="mt-8 mx-auto max-w-md text-center py-12 px-6" style={{ background: "#fff", border: `1px dashed ${S.border}`, borderRadius: S.radiusLg }}>
              <PackageOpen size={34} style={{ color: S.muted }} className="mx-auto" />
              <div className="mt-3 text-sm font-bold" style={{ color: S.text }}>{emptyHint.title}</div>
              <div className="mt-1.5 text-xs" style={{ color: S.muted }}>{emptyHint.sub}</div>
              <a href={emptyHint.href} className="inline-block mt-4 px-4 py-2 text-xs font-bold" style={{ background: S.primary, color: S.onPrimary, borderRadius: S.radiusSm }}>{emptyHint.cta}</a>
            </div>
          ) : (
            <div className="mt-2" style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radius, minWidth: asset === "wechat" ? 900 : asset === "groups" ? 960 : 1060 }}>
              {/* 表头 */}
              {asset === "wechat" && (
                <div className="grid items-center px-4 py-2.5 text-xs font-semibold border-b gap-2" style={{ gridTemplateColumns: "1.4fr .75fr .65fr .55fr .5fr .4fr .55fr .65fr", color: S.textSec, background: "#f1f5f9", borderColor: S.border }}>
                  <span>账号</span><span>归属项目</span><span>服务负责人</span><span>状态</span><span>好友数</span><span>群数</span><span>认证</span><span>最近登录</span>
                </div>
              )}
              {asset === "groups" && (
                <div className="grid items-center px-4 py-2.5 text-xs font-semibold border-b gap-2" style={{ gridTemplateColumns: "1.7fr .8fr .6fr .5fr 1.05fr .45fr .45fr .5fr", color: S.textSec, background: "#f1f5f9", borderColor: S.border }}>
                  <span>群名</span><span>系列</span><span>群主微信号</span><span>城市</span><span>人数 / 容量</span><span>推送</span><span>扫码</span><span>状态</span>
                </div>
              )}
              {asset === "people" && (
                <div className="grid items-center px-4 py-2.5 text-xs font-semibold border-b gap-2" style={{ gridTemplateColumns: "1.05fr .45fr .55fr .7fr 1fr .6fr .55fr .55fr .6fr .45fr", color: S.textSec, background: "#f1f5f9", borderColor: S.border }}>
                  <span>姓名</span><span>身份</span><span>等级</span><span>微信号</span><span>归属项目</span><span>上级推荐人</span><span>团队人数</span><span>影响力</span><span>收益</span><span>入群</span>
                </div>
              )}
              {/* 行 */}
              {asset === "wechat" && (wechats as ProjectWechat[]).map((w, i) => (
                <div key={w.account + i} className="grid items-center gap-2 px-4 py-3 text-xs border-b transition-colors hover:bg-slate-50" style={{ gridTemplateColumns: "1.4fr .75fr .65fr .55fr .5fr .4fr .55fr .65fr", borderColor: S.border }}>
                  <span className="flex items-center gap-2 min-w-0">
                    {w.kind === "wechat" ? <Smartphone size={14} style={{ color: "#16a34a" }} /> : <Building2 size={14} style={{ color: "#2563eb" }} />}
                    <span className="min-w-0"><b className="block truncate" style={{ color: S.text }}>{w.account}</b><small className="block truncate" style={{ color: S.muted }}>{w.nickname === "—" ? "未激活" : w.nickname}</small></span>
                  </span>
                  <span className="truncate" style={{ color: S.textSec }}>{projectNames(w.projectId)}</span>
                  <span className="truncate" style={{ color: S.text }}>{w.owner}</span>
                  <span>{badge(STATUS_STYLES[w.status].color, STATUS_STYLES[w.status].bg, w.status)}</span>
                  <span className="tabular-nums" style={{ color: S.text }}>{w.friendCount.toLocaleString()}</span>
                  <span className="tabular-nums" style={{ color: S.text }}>{w.groupCount}</span>
                  <span>{w.certified ? badge("#15803d", "#f0fdf4", "已认证") : badge("#64748b", "#f1f5f9", "未认证")}</span>
                  <span style={{ color: S.muted }}>{w.lastLogin}</span>
                </div>
              ))}
              {asset === "groups" && (groups as ProjectGroup[]).map((g, i) => (
                <div key={g.no + i} className="grid items-center gap-2 px-4 py-3 text-xs border-b transition-colors hover:bg-slate-50" style={{ gridTemplateColumns: "1.7fr .8fr .6fr .5fr 1.05fr .45fr .45fr .5fr", borderColor: S.border }}>
                  <span className="min-w-0">
                    <b className="block truncate" style={{ color: S.text }}>{g.name}</b>
                    <small className="block truncate" style={{ color: S.muted }}>{g.type} · {g.code}</small>
                  </span>
                  <span>{badge(SERIES_STYLES[g.series].color, SERIES_STYLES[g.series].bg, g.series)}</span>
                  <span className="truncate" style={{ color: S.textSec }}>{g.wechat}</span>
                  <span style={{ color: S.text }}>{g.city}</span>
                  <span className="min-w-0">
                    <b className="block tabular-nums" style={{ color: g.members / g.max >= 0.9 ? "#c2410c" : S.text }}>{g.members} / {g.max}</b>
                    <span className="mt-1 block h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}>
                      <span className="block h-full" style={{ width: `${Math.max((g.members / g.max) * 100, g.members ? 3 : 0)}%`, background: g.members / g.max >= 0.9 ? "#f59e0b" : S.accent, borderRadius: 99 }} />
                    </span>
                  </span>
                  <span className="tabular-nums" style={{ color: S.text }}>{g.push}</span>
                  <span className="tabular-nums" style={{ color: S.text }}>{g.scan}</span>
                  <span>{badge(STATUS_STYLES[g.ownerStatus].color, STATUS_STYLES[g.ownerStatus].bg, g.ownerStatus)}</span>
                </div>
              ))}
              {asset === "people" && (persons as ProjectPerson[]).map((p, i) => (
                <div key={p.wechat + p.role + i} className="grid items-center gap-2 px-4 py-3 text-xs border-b transition-colors hover:bg-slate-50" style={{ gridTemplateColumns: "1.05fr .45fr .55fr .7fr 1fr .6fr .55fr .55fr .6fr .45fr", borderColor: S.border }}>
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 flex-shrink-0 grid place-items-center text-[10px] font-bold rounded" style={{ background: S.accentLight, color: S.text }}>{p.avatar}</span>
                    <span className="truncate font-bold" style={{ color: S.text }}>{p.name}</span>
                  </span>
                  <span>{badge(ROLE_STYLES[p.role].color, ROLE_STYLES[p.role].bg, p.role)}</span>
                  <span>{badge(LEVEL_STYLES[p.level].color, LEVEL_STYLES[p.level].bg, p.level)}</span>
                  <span className="truncate" style={{ color: S.textSec }}>{p.wechat}</span>
                  <span className="truncate" style={{ color: S.textSec }}>{projectNames(p.projectId)}</span>
                  <span className="truncate" style={{ color: S.muted }}>{p.referrer}</span>
                  <span className="tabular-nums" style={{ color: S.text }}>{p.teamCount.toLocaleString()}</span>
                  <span className="tabular-nums font-bold" style={{ color: S.text }}>{p.influence.toLocaleString()}</span>
                  <span className="tabular-nums" style={{ color: S.text }}>¥{p.revenue.toLocaleString()}</span>
                  <span>{p.inGroup ? badge("#15803d", "#f0fdf4", "已入群") : badge("#f59e0b", "#fffbeb", "待入群")}</span>
                </div>
              ))}
              <div className="px-4 py-2 text-[10px]" style={{ color: S.muted }}>共 {activeRows.length} 条 · 切换左侧项目或上方资产类型查看其他列表</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}