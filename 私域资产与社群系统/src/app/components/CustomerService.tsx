import { useLayoutEffect, useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, ChevronLeft, ChevronRight, ArrowLeft, Eye, EyeOff, QrCode, ExternalLink, Archive } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const PAGE_SIZE = 8;

// ─── 模拟数据 ─────────────────────────────────────────────────
const csStaff = [
  { id: 1,  no: "00001", gender: "女", name: "杨桂英", phone: "13732112621", account: "admin1",  password: "T7321021", area: "华北/吉林",  area2: "华北/吉林/吉林市", role: "探哥",  wechatCount: 0, groupCount: 0,  qqNo: "暂无", qqEmail: "暂无", qqGroup: "暂无", wechatId: "暂无", recruitTime: "暂无", qrLink: "暂无", wechats: [] },
  { id: 2,  no: "00009", gender: "女", name: "李娜",   phone: "13732112621", account: "admin2",  password: "S8432012", area: "华南/广西",  area2: "华南/广西/南宁市", role: "假面",  wechatCount: 8, groupCount: 30, qqNo: "345678921", qqEmail: "lina@qq.com", qqGroup: "南宁会员群", wechatId: "wx_gx_01", recruitTime: "2024-03-15", qrLink: "https://wx.qq.com/qr/001", wechats: ["ECO001","ECO002"] },
  { id: 3,  no: "00002", gender: "男", name: "吴杰",   phone: "15796482156", account: "admin3",  password: "A9821034", area: "华东/安徽",  area2: "华东/安徽/合肥市", role: "探哥",  wechatCount: 5, groupCount: 30, qqNo: "412893047", qqEmail: "wujie@qq.com", qqGroup: "合肥会员群", wechatId: "wx_ah_01", recruitTime: "2024-05-20", qrLink: "https://wx.qq.com/qr/002", wechats: ["ECO003","ECO004","ECO005"] },
  { id: 4,  no: "00003", gender: "女", name: "傅小小", phone: "18965442359", account: "admin4",  password: "P4532198", area: "华东/浙江",  area2: "华东/浙江/杭州市", role: "假面",  wechatCount: 6, groupCount: 30, qqNo: "523019483", qqEmail: "fuxiao@qq.com", qqGroup: "杭州会员群", wechatId: "wx_hz_02", recruitTime: "2024-02-10", qrLink: "https://wx.qq.com/qr/003", wechats: ["ECO001","ECO006"] },
  { id: 5,  no: "00004", gender: "男", name: "李超",   phone: "14562358974", account: "admin5",  password: "Q3219087", area: "华西/甘肃",  area2: "华西/甘肃/兰州市", role: "假面",  wechatCount: 9, groupCount: 30, qqNo: "634102938", qqEmail: "lichao@qq.com", qqGroup: "兰州会员群", wechatId: "wx_gs_01", recruitTime: "2024-06-01", qrLink: "https://wx.qq.com/qr/004", wechats: ["ECO002","ECO007"] },
  { id: 6,  no: "00005", gender: "男", name: "邓磊",   phone: "13754821454", account: "admin6",  password: "W6781245", area: "华中/河北",  area2: "华中/河北/石家庄", role: "探哥",  wechatCount: 1, groupCount: 30, qqNo: "745293018", qqEmail: "denglei@qq.com", qqGroup: "石家庄会员群", wechatId: "wx_hb_01", recruitTime: "2024-01-08", qrLink: "https://wx.qq.com/qr/005", wechats: ["ECO003"] },
  { id: 7,  no: "00006", gender: "男", name: "何杰",   phone: "14858944572", account: "admin7",  password: "E5431987", area: "华南/广西",  area2: "华南/广西/桂林市", role: "假面",  wechatCount: 1, groupCount: 30, qqNo: "856304721", qqEmail: "hejie@qq.com", qqGroup: "桂林会员群", wechatId: "wx_gl_01", recruitTime: "2024-04-12", qrLink: "https://wx.qq.com/qr/006", wechats: ["ECO004"] },
  { id: 8,  no: "00007", gender: "男", name: "徐尚",   phone: "15648295763", account: "admin8",  password: "R2198765", area: "华北/辽宁",  area2: "华北/辽宁/沈阳市", role: "假面",  wechatCount: 3, groupCount: 30, qqNo: "967415830", qqEmail: "xushang@qq.com", qqGroup: "沈阳会员群", wechatId: "wx_ln_01", recruitTime: "2023-11-20", qrLink: "https://wx.qq.com/qr/007", wechats: ["ECO001","ECO005","ECO006"] },
  { id: 9,  no: "00008", gender: "女", name: "谭敏仪", phone: "15487235464", account: "admin9",  password: "T1987432", area: "华中/河北",  area2: "华中/河北/保定市", role: "假面",  wechatCount: 4, groupCount: 30, qqNo: "108526394", qqEmail: "tanmin@qq.com", qqGroup: "保定会员群", wechatId: "wx_bd_01", recruitTime: "2024-07-05", qrLink: "https://wx.qq.com/qr/008", wechats: ["ECO002","ECO003","ECO007"] },
  { id: 10, no: "00010", gender: "女", name: "陈小芬", phone: "13987654321", account: "admin10", password: "Y9871234", area: "华东/江苏",  area2: "华东/江苏/南京市", role: "探哥",  wechatCount: 6, groupCount: 30, qqNo: "219873456", qqEmail: "chenfen@qq.com", qqGroup: "南京会员群", wechatId: "wx_nj_02", recruitTime: "2024-03-28", qrLink: "https://wx.qq.com/qr/009", wechats: ["ECO004","ECO005"] },
];

const wechatTabs = ["ECO001","ECO002","ECO003","ECO004","ECO005","ECO006","ECO007"];

const groupDetail = Array.from({ length: 10 }, (_, i) => ({
  groupNo: `0000${i + 1}`,
  name: `体验官${i + 1}群`,
  orgName: ["北京分社","上海分社","广州分社","深圳分社","成都分社","杭州分社","武汉分社","南京分社","西安分社","重庆分社"][i],
  groupInCount: [3,2,4,1,2,3,1,2,1,2][i],
  wechat: ["ECO001","ECO002","ECO001","ECO003","ECO002","ECO001","ECO004","ECO002","ECO003","ECO001"][i],
  serviceStaff: ["吴思远","林小燕","刘刚","李梦华","陈明","吴思远","林小燕","张磊","孙浩","陈明"][i],
  groupOwner: ["思远","小燕","刘刚","梦华","陈明","吴思远","林小燕","张磊","孙浩","陈明"][i],
  manualCount: [12,8,15,6,10,9,7,11,5,13][i],
  friendCount: [487,356,234,310,140,198,120,215,89,175][i],
  memberCount: [100,786,491,200,204,500,380,308,150,260][i],
  actualCount: [98,780,488,195,200,495,375,302,148,255][i],
  status: ["配置完成","待配置","配置完成","配置完成","待配置","配置完成","配置完成","配置完成","待配置","配置完成"][i],
  type: ["体验官群","游客群","PRO会员群","尊享群","体验官群","家族群","游客群","分站群","体验官群","PRO会员群"][i],
  updatedAt: ["2026-07-05","2026-07-04","2026-06-28","2026-07-05","2026-07-01","2026-07-05","2026-07-03","2026-07-05","2026-06-20","2026-07-04"][i],
}));

const getAssignedWechatIds = (staff: typeof csStaff[0]) => Array.from(new Set(staff.wechats));
const getManagedGroupCount = (staff: typeof csStaff[0]) => {
  const assigned = getAssignedWechatIds(staff);
  return groupDetail.filter(group => assigned.includes(group.wechat)).length;
};

// ─── 新建客服弹窗 ─────────────────────────────────────────────
function NewStaffModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ no: "", gender: "男", name: "", phone: "", account: "", password: "", role: "探哥" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { background: "#f1f5f9", border: `1px solid rgba(15,23,42,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="w-[400px] overflow-hidden" style={{ background: "#ffffff", borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(15,23,42,0.12)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f1f5f9" }}>
          <span className="font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>新建客服</span>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5">
            <X size={15} style={{ color: S.muted }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3.5">
          {[
            { label: "工号", key: "no", placeholder: "000010", type: "text" },
            { label: "姓名", key: "name", placeholder: "皮卡丘", type: "text" },
            { label: "手机", key: "phone", placeholder: "13732112621", type: "text" },
            { label: "登录账号", key: "account", placeholder: "admin1", type: "text" },
            { label: "密码", key: "password", placeholder: "13732112621", type: "password" },
          ].map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <label className="w-20 text-right text-xs flex-shrink-0" style={{ color: S.muted, fontFamily: "monospace" }}>{f.label}：</label>
              <input type={f.type} className="flex-1 px-3 py-2 text-xs outline-none" style={inputStyle} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <label className="w-20 text-right text-xs flex-shrink-0" style={{ color: S.muted, fontFamily: "monospace" }}>性别：</label>
            <select className="flex-1 px-3 py-2 text-xs outline-none" style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
              {["男","女"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 text-right text-xs flex-shrink-0" style={{ color: S.muted, fontFamily: "monospace" }}>服务管：</label>
            <select className="flex-1 px-3 py-2 text-xs outline-none" style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)}>
              {["探哥","假面"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4" style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}>
          <button className="px-12 py-2.5 text-sm font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={onClose}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ─── 客服详情页 ───────────────────────────────────────────────
function StaffDetail({ staff, onBack }: { staff: typeof csStaff[0]; onBack: () => void }) {
  const initialWechatIds = getAssignedWechatIds(staff);
  const [configuredWechatIds, setConfiguredWechatIds] = useState(initialWechatIds);
  const tabOptions = configuredWechatIds.length > 1 ? ["全部", ...configuredWechatIds] : configuredWechatIds;
  const [activeTab, setActiveTab] = useState<string | null>(tabOptions[0] ?? null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [draftWechatIds, setDraftWechatIds] = useState(initialWechatIds);
  const [page, setPage] = useState(1);
  const GRP_PAGE = 8;

  useLayoutEffect(() => {
    document.querySelector<HTMLElement>("[data-pc-content]")?.scrollTo({ top: 0, left: 0 });
  }, []);

  const statusCfg: Record<string, { bg: string; color: string }> = {
    "配置完成": { bg: "#f0fff4", color: "#276749" },
    "待配置":   { bg: "#fffbeb", color: "#b45309" },
  };

  const filteredGroups = activeTab === "全部"
    ? groupDetail.filter(group => configuredWechatIds.includes(group.wechat))
    : activeTab
      ? groupDetail.filter(group => group.wechat === activeTab)
      : [];
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / GRP_PAGE));
  const paged = filteredGroups.slice((page - 1) * GRP_PAGE, page * GRP_PAGE);
  const hasWechat = configuredWechatIds.length > 0;
  const openConfig = () => {
    setDraftWechatIds(configuredWechatIds);
    setShowConfig(true);
  };
  const saveConfig = () => {
    const nextIds = Array.from(new Set(draftWechatIds));
    setConfiguredWechatIds(nextIds);
    setActiveTab(nextIds.length > 1 ? "全部" : nextIds[0] ?? null);
    setPage(1);
    setShowConfig(false);
  };

  const detailCols: [string, number, string][] = [
    ["群号",70, ""],["群名",150, ""],["社名",90, ""],["所在群数量",80, "hidden lg:block"],["微信账号",90, ""],
    ["服务员",80, ""],["群主",120, "hidden lg:block"],["人工",60, "hidden lg:block"],["二维码",60, "hidden lg:block"],
    ["微信好友数量",90, ""],["数量",60, "hidden lg:block"],["实际数量",70, "hidden lg:block"],["更新时间",95, "hidden lg:block"],["状态",80, ""],
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div className="w-[360px] max-w-[calc(100vw-32px)] overflow-hidden" style={{ background: S.surface, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div>
                <div className="font-semibold" style={{ color: S.text }}>配置微信号</div>
                <div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>为 {staff.name} 选择可管理的微信号</div>
              </div>
              <button type="button" aria-label="关闭配置微信号" onClick={() => setShowConfig(false)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted }}><X size={15} /></button>
            </div>
            <div className="px-5 py-4 space-y-2">
              {wechatTabs.map(id => {
                const checked = draftWechatIds.includes(id);
                return (
                  <label key={id} className="flex items-center justify-between px-3 py-2.5 cursor-pointer" style={{ background: checked ? S.accentLight : "#f1f5f9", border: `1px solid ${checked ? "rgba(204,255,0,0.35)" : S.border}`, borderRadius: S.radiusSm }}>
                    <span className="text-sm font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{id}</span>
                    <input type="checkbox" checked={checked} onChange={() => setDraftWechatIds(current => checked ? current.filter(value => value !== id) : [...current, id])} />
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}>
              <button type="button" onClick={() => setShowConfig(false)} className="px-3 py-2 text-xs" style={{ background: "#f1f5f9", color: S.textSec, borderRadius: S.radiusSm }}>取消</button>
              <button type="button" onClick={saveConfig} className="px-3 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>保存配置</button>
            </div>
          </div>
        </div>
      )}
      {/* 面包屑 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="flex items-center gap-1.5 text-sm font-medium" style={{ color: S.muted, fontFamily: "monospace" }} onClick={onBack}>
          <ArrowLeft size={14} /> 客服管理
        </button>
        <span style={{ color: S.mutedLight }}>›</span>
        <span className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>客服：{staff.name}</span>
        <span className="px-2 py-0.5 text-xs font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radiusSm, fontFamily: "monospace" }}>绑定微信</span>
      </div>

      {/* 档案卡 */}
      <div className="flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {/* 头部信息 */}
        <div className="flex flex-wrap items-start gap-5 p-5">
          <img src={getAvatar(staff.id - 1)} alt={staff.name} style={{ width: 60, height: 60, borderRadius: S.radius, objectFit: "cover", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-semibold" style={{ fontSize: "17px", color: S.text, fontFamily: "monospace" }}>{staff.name}</span>
              <span className="px-2 py-0.5 text-xs" style={{ background: staff.gender === "女" ? "#fff0f6" : "#eff8ff", color: staff.gender === "女" ? "#d53f8c" : "#3182ce", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{staff.gender}</span>
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: S.accentMid, color: "#ffffff", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{staff.role}</span>
            </div>
            {/* 基础信息网格 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1.5">
              {[
                ["工号", staff.no],
                ["查看账号", staff.account],
                ["电话", staff.phone],
                ["管理地区", staff.area2],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-1.5 text-xs">
                  <span style={{ color: S.muted, fontFamily: "monospace", flexShrink: 0 }}>{k}：</span>
                  <span style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="text-center px-4 py-2.5" style={{ background: hasWechat ? S.accentMid : "#fff7ed", border: `1px solid ${hasWechat ? "rgba(204,255,0,0.3)" : "#fed7aa"}`, borderRadius: S.radius }}>
              <div className="text-2xl font-bold" style={{ color: hasWechat ? S.text : "#c2410c", fontFamily: "monospace" }}>{configuredWechatIds.length}</div>
              <div className="text-xs mt-0.5" style={{ color: hasWechat ? S.textSec : "#9a3412", fontFamily: "monospace" }}>已配置微信号</div>
            </div>
            <div className="text-center px-4 py-2.5" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="text-2xl font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{groupDetail.filter(group => configuredWechatIds.includes(group.wechat)).length}</div>
              <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>关联群数</div>
            </div>
          </div>
        </div>

        {/* 微信绑定信息 */}
        <div className="px-5 pb-4" style={{ borderTop: `1px solid ${S.border}` }}>
          <div className="text-xs font-semibold pt-3 pb-2" style={{ color: S.muted, fontFamily: "monospace" }}>微信绑定信息</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
            {[
              ["QQ账号", staff.qqNo],
              ["QQ邮件", staff.qqEmail],
              ["QQ账号群", staff.qqGroup],
              ["微信账号", staff.wechatId],
              ["招募时间", staff.recruitTime],
              ["二维码链接", staff.qrLink !== "暂无" ? "已配置" : "暂无"],
              ["密码", staff.password],
              ["二维码", staff.qrLink !== "暂无" ? "已生成" : "暂无"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs">
                <span style={{ color: S.muted, fontFamily: "monospace", flexShrink: 0 }}>{k}：</span>
                {k === "密码" ? (
                  <>
                    <span style={{ color: S.textSec, fontFamily: "monospace" }}>{showPwd ? v : "••••••••"}</span>
                    <button type="button" aria-label={showPwd ? "隐藏密码" : "显示密码"} onClick={() => setShowPwd(value => !value)}>
                      {showPwd ? <EyeOff size={12} style={{ color: S.muted }} /> : <Eye size={12} style={{ color: S.muted }} />}
                    </button>
                  </>
                ) : (
                  <span style={{ color: k === "二维码链接" && v !== "暂无" ? "#3182ce" : S.textSec, fontFamily: "monospace" }}>{v}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 微信 Tab 栏 */}
        <div className="flex items-center gap-0 px-5 pb-4 pt-1 flex-wrap" style={{ borderTop: `1px solid ${S.border}` }}>
          {tabOptions.map(t => (
            <button key={t} className="px-3 py-1.5 text-xs transition-all" style={{ background: activeTab === t ? "#1e293b" : "#f1f5f9", color: activeTab === t ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace", margin: "2px" }} onClick={() => { setActiveTab(t); setPage(1); }}>
              {t}
            </button>
          ))}
          {!hasWechat && <span className="text-xs px-2 py-1.5" style={{ color: "#9a3412", fontFamily: "monospace" }}>尚未配置微信号，请先完成绑定</span>}
          <button type="button" onClick={openConfig} className="px-3 py-1.5 text-xs font-bold ml-auto" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radiusSm, fontFamily: "monospace", margin: "2px" }}>配置微信</button>
        </div>
      </div>

      {/* 群组表格 */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: "100%", width: "max-content" }}>
            {hasWechat && (
              <div className="flex items-center px-4 py-2.5 flex-shrink-0 text-xs" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, fontFamily: "monospace" }}>
                {detailCols.map(([l, w, visibility]) => (
                  <div key={l} className={`${visibility} flex-shrink-0 font-semibold`} style={{ width: w, color: "#475569" }}>{l}</div>
                ))}
              </div>
            )}
            {paged.map((g) => {
            const st = statusCfg[g.status] || { bg: "#f1f5f9", color: "#888" };
            return (
              <div key={g.groupNo} className="flex items-center px-4 text-xs transition-all" style={{ background: "transparent", borderBottom: `1px solid ${S.border}`, minWidth: "fit-content", paddingTop: "9px", paddingBottom: "9px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.018)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex-shrink-0" style={{ width: 70, color: S.mutedLight, fontFamily: "monospace" }}>{g.groupNo}</div>
                <div className="flex-shrink-0 font-medium" style={{ width: 150, color: S.text, fontFamily: "monospace" }}>{g.name}</div>
                <div className="flex-shrink-0" style={{ width: 90, color: S.muted, fontFamily: "monospace" }}>{g.orgName}</div>
                <div className="hidden lg:block flex-shrink-0 font-medium" style={{ width: 80, color: S.text, fontFamily: "monospace" }}>{g.groupInCount}</div>
                <div className="flex-shrink-0 font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.wechat}</div>
                <div className="flex-shrink-0" style={{ width: 80, color: S.textSec, fontFamily: "monospace" }}>{g.serviceStaff}</div>
                <div className="hidden lg:block flex-shrink-0" style={{ width: 120, color: S.muted, fontFamily: "monospace" }}>{g.groupOwner}</div>
                <div className="hidden lg:block flex-shrink-0 font-medium" style={{ width: 60, color: S.text, fontFamily: "monospace" }}>{g.manualCount}</div>
                <div className="hidden lg:block flex-shrink-0" style={{ width: 60 }}>
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                    <QrCode size={13} style={{ color: S.textSec }} />
                  </div>
                </div>
                <div className="flex-shrink-0 font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.friendCount}</div>
                <div className="hidden lg:block flex-shrink-0 font-medium" style={{ width: 60, color: S.text, fontFamily: "monospace" }}>{g.memberCount}</div>
                <div className="hidden lg:block flex-shrink-0" style={{ width: 70, color: g.actualCount < g.memberCount ? "#c53030" : S.textSec, fontFamily: "monospace" }}>{g.actualCount}</div>
                <div className="hidden lg:block flex-shrink-0" style={{ width: 95, color: S.muted, fontFamily: "monospace" }}>{g.updatedAt}</div>
                <div className="flex-shrink-0" style={{ width: 80 }}>
                  <span className="px-1.5 py-0.5 font-medium" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{g.status}</span>
                </div>
              </div>
            );
            })}
            {paged.length === 0 && (
              <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
                <div>
                  <div className="text-sm font-semibold" style={{ color: S.text }}>暂无关联群组</div>
                  <div className="mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                    {hasWechat ? "当前微信号还没有关联群组" : "完成微信绑定后，这里会显示关联群组"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#f8fafc" }}>
          <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 {filteredGroups.length} 条</div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === 1 ? S.bg : "#1e293b", color: page === 1 ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="w-7 h-7 text-xs" style={{ background: page === p ? "#1e293b" : S.surface, color: page === p ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === totalPages ? S.bg : "#1e293b", color: page === totalPages ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
          </div>
          <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {GRP_PAGE} 条</div>
        </div>
      </div>
    </div>
  );
}

// ─── 主列表页 ─────────────────────────────────────────────────
export default function CustomerService() {
  useThemeSingleton();
const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detailStaff, setDetailStaff] = useState<typeof csStaff[0] | null>(null);
  const [showPwds, setShowPwds] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});
  const [archivedStaff, setArchivedStaff] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  if (detailStaff) return <StaffDetail staff={detailStaff} onBack={() => setDetailStaff(null)} />;

  const filtered = csStaff.filter(s => {
    const status = statusOverrides[s.no] || (s.no === "00001" ? "停用" : "启用");
    return !archivedStaff.includes(s.no) && (statusFilter === "全部状态" || status === statusFilter) && (s.name.includes(search) || s.no.includes(search) || s.area.includes(search) || s.account.includes(search));
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cols: [string, number][] = [
    ["工号",64],["性别",52],["姓名",90],["手机",130],["登录账号",110],
    ["密码",120],["管理地区",150],["服务管",72],
    ["配置微信号(个)",105],["管理群数(个)",100],["状态",70],["操作",170],
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && <NewStaffModal onClose={() => setShowModal(false)} />}
      {notice && <div role="status" className="flex items-center justify-between gap-2 px-4 py-2.5 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius, color: S.text, fontFamily: "monospace" }}><span className="text-xs">{notice}</span><button type="button" aria-label="关闭提示" onClick={() => setNotice("")}><X size={13} /></button></div>}

      {/* 页头 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-semibold" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.04em" }}>客服管理</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理客服人员账号、管理地区、配置微信号和群组</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setShowModal(true)}>
          <Plus size={15} /> 新建客服
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="请输入工号或姓名..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <button className="px-4 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>搜索</button>
        <select className="px-3 py-2 text-xs outline-none" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setPage(1); }} style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} aria-label="按员工状态筛选"><option>全部状态</option><option>启用</option><option>停用</option></select>
        <div className="text-xs px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radius, fontFamily: "monospace" }}>共 {filtered.length} 名</div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: "100%", width: "max-content" }}>
            <div className="sticky top-0 z-10 flex items-center px-4 py-2.5 text-xs" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569", fontFamily: "monospace" }}>
              {cols.map(([l, w]) => <div key={l} className="flex-shrink-0 font-semibold" style={{ width: w }}>{l}</div>)}
            </div>
            {paged.map((s) => (
              <div key={s.no} className="flex items-center px-4 py-3 text-xs transition-all" style={{ background: "transparent", borderBottom: `1px solid ${S.border}`, minWidth: "fit-content" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.018)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex-shrink-0" style={{ width: 64, color: S.mutedLight, fontFamily: "monospace" }}>{s.no}</div>
                <div className="flex-shrink-0" style={{ width: 52 }}>
                  <span className="px-1.5 py-0.5 text-xs" style={{ background: s.gender === "女" ? "#fff0f6" : "#eff8ff", color: s.gender === "女" ? "#d53f8c" : "#3182ce", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{s.gender}</span>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 90 }}>
                  <img src={getAvatar(s.id - 1)} alt={s.name} style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <span className="font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{s.name}</span>
                </div>
                <div className="flex-shrink-0" style={{ width: 130, color: S.muted, fontFamily: "monospace" }}>{s.phone}</div>
                <div className="flex-shrink-0 font-medium" style={{ width: 110, color: S.text, fontFamily: "monospace" }}>{s.account}</div>
                <div className="flex-shrink-0" style={{ width: 120 }}>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: S.textSec, fontFamily: "monospace" }}>{showPwds[s.no] ? s.password : "••••••••"}</span>
                    <button onClick={() => setShowPwds(p => ({ ...p, [s.no]: !p[s.no] }))}>
                      {showPwds[s.no] ? <EyeOff size={11} style={{ color: S.muted }} /> : <Eye size={11} style={{ color: S.muted }} />}
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0" style={{ width: 150, color: S.muted, fontFamily: "monospace" }}>{s.area2}</div>
                <div className="flex-shrink-0" style={{ width: 72 }}>
                  <span className="px-2 py-0.5 text-xs font-medium" style={{ background: S.accentMid, color: "#ffffff", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{s.role}</span>
                </div>
                <div className="flex-shrink-0 font-medium" style={{ width: 105, color: getAssignedWechatIds(s).length > 0 ? S.text : S.mutedLight, fontFamily: "monospace" }}>{getAssignedWechatIds(s).length > 0 ? `${getAssignedWechatIds(s).length} 个` : "暂无"}</div>
                <div className="flex-shrink-0 font-medium" style={{ width: 100, color: getManagedGroupCount(s) > 0 ? S.text : S.mutedLight, fontFamily: "monospace" }}>{getManagedGroupCount(s) > 0 ? `${getManagedGroupCount(s)} 个` : "暂无"}</div>
                <div className="flex-shrink-0" style={{ width: 70 }}>
                  {(() => { const active = (statusOverrides[s.no] || (s.no === "00001" ? "停用" : "启用")) === "启用"; return <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: active ? "#f0fff4" : "#f1f5f9", color: active ? "#276749" : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{active ? "启用" : "停用"}</span>; })()}
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5" style={{ width: 170 }}>
                  <button className="px-2.5 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setDetailStaff(s)}>管理</button>
                  <button type="button" className="px-2 py-1.5 text-xs font-semibold" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setStatusOverrides(current => ({ ...current, [s.no]: (current[s.no] || (s.no === "00001" ? "停用" : "启用")) === "启用" ? "停用" : "启用" }))}>{(statusOverrides[s.no] || (s.no === "00001" ? "停用" : "启用")) === "启用" ? "停用" : "启用"}</button>
                  <button type="button" title="归档员工" aria-label="归档员工" className="w-7 h-7 grid place-items-center" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => { if (getAssignedWechatIds(s).length || getManagedGroupCount(s)) { setNotice(`${s.name} 仍配置了微信号或群，请先完成交接后归档`); return; } setArchivedStaff(current => [...current, s.no]); setNotice(`${s.name} 已归档`); }}><Archive size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#f8fafc" }}>
          <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>第 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} 条，共 {filtered.length} 条</div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === 1 ? S.bg : "#1e293b", color: page === 1 ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="w-7 h-7 text-xs" style={{ background: page === p ? "#1e293b" : S.surface, color: page === p ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center" style={{ background: page === totalPages ? S.bg : "#1e293b", color: page === totalPages ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
          </div>
          <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {PAGE_SIZE} 条</div>
        </div>
      </div>
    </div>
  );
}
