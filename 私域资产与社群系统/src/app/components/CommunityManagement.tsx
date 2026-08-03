import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, ChevronLeft, ChevronRight, QrCode, Users, ArrowLeft, TrendingUp } from "lucide-react";

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

// ─── 新建微信群弹窗 ────────────────────────────────────────────
function NewGroupModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ project: "", type: "", city: "", wechat: "", groupNo: "", name: "", note: "", manager: "", service: "", pushCount: "100", scanCount: "100", memberCount: "100" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const groupTypes = ["体验官群", "PRO会员群", "游客群", "尊享群", "家族群", "分站管理群"];
  const wechatOptions = mockGroups.map(g => g.wechat).filter((v, i, a) => a.indexOf(v) === i);
  const inpStyle = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-[500px] overflow-hidden" style={{ background: "#fff", border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7", borderRadius: `${S.radiusLg} ${S.radiusLg} 0 0` }}>
          <span className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 新建微信群</span>
          <button onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4" style={{ maxHeight: "68vh", overflowY: "auto" }}>
          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>项目分类</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} value={form.project} onChange={e => set("project", e.target.value)}>
              <option value="">请选择</option>
              {["蜂乐码", "蜂乐玛PRO", "体验营", "代理"].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群类型</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="">请选择</option>
              {groupTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>管理地区</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} value={form.city} onChange={e => set("city", e.target.value)}>
              <option value="">请选择</option>
              {["北京", "吉林", "上海", "广州", "深圳", "成都", "杭州", "武汉"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>所属微信</label>
            <select className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} value={form.wechat} onChange={e => set("wechat", e.target.value)}>
              <option value="">请选择</option>
              {wechatOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群编号</label>
            <input className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="如 000013" value={form.groupNo} onChange={e => set("groupNo", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群名</label>
            <input className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="如 吉林蜂乐玛游客群1" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群管理</label>
            <input className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="负责人姓名" value={form.manager} onChange={e => set("manager", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>所属客服</label>
            <input className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="客服姓名" value={form.service} onChange={e => set("service", e.target.value)} />
          </div>

          {[{ label: "推送次数", key: "pushCount" }, { label: "扫码次数", key: "scanCount" }, { label: "入群人数（上限）", key: "memberCount" }].map(f => (
            <div key={f.key}>
              <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{f.label}</label>
              <input className="w-full px-3 py-2 text-xs outline-none" style={inpStyle} placeholder="100" value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <div className="col-span-2">
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群二维码</label>
            <div className="flex items-center gap-3 px-4 py-4 border-dashed cursor-pointer" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
              <QrCode size={18} style={{ color: S.text }} />
              <div>
                <div className="text-xs uppercase" style={{ color: S.text, fontFamily: "monospace" }}>点击上传群二维码图片</div>
                <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>支持 PNG / JPG，建议 500×500px</div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>群备注</label>
            <textarea className="w-full px-3 py-2 text-xs outline-none resize-none" rows={2}
              style={inpStyle}
              placeholder="其他说明..." value={form.note} onChange={e => set("note", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm uppercase font-bold" style={{ background: S.bg, color: S.muted, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>取消</button>
          <button className="flex-1 py-2.5 text-sm font-bold uppercase" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ─── 入群人名单 ────────────────────────────────────────────────
function MemberList({ group, onBack }: { group: typeof mockGroups[0]; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockMembers.filter(m =>
    m.wechatName.includes(search) || m.name.includes(search) || m.wechatId.includes(search) || m.phone.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cols = [
    { label: "编号", w: 60 }, { label: "头像", w: 48 }, { label: "微信名", w: 130 },
    { label: "姓名", w: 80 }, { label: "微信号", w: 110 }, { label: "地址", w: 100 },
    { label: "等级", w: 80 }, { label: "手机号码", w: 120 }, { label: "推荐人", w: 80 },
    { label: "家族", w: 70 }, { label: "影响力", w: 70 }, { label: "收益", w: 70 }, { label: "是否进群", w: 80 }, { label: "操作", w: 60 },
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
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <Search size={12} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs w-32" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索成员..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex items-center px-4 py-2.5 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0`, minWidth: "fit-content" }}>
          {cols.map(c => (
            <div key={c.label} className="flex-shrink-0 text-xs font-medium uppercase" style={{ width: c.w, color: "#555555", fontFamily: "monospace", letterSpacing: "0.05em" }}>{c.label}</div>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
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
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 70, color: S.text, fontFamily: "monospace" }}>{m.influence}</div>
              <div className="flex-shrink-0 text-xs font-medium" style={{ width: 70, color: S.text, fontFamily: "monospace" }}>{m.revenue}</div>
              <div className="flex-shrink-0" style={{ width: 80 }}>
                <span className="text-xs px-1.5 py-0.5 uppercase" style={{ background: m.inGroup ? S.accent : "#1a1a1a", color: m.inGroup ? "#000" : S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{m.inGroup ? "是" : "否"}</span>
              </div>
              <div className="flex-shrink-0" style={{ width: 60 }}>
                <button className="px-2 py-1 text-xs uppercase font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>修改</button>
              </div>
            </div>
          ))}
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
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
export default function CommunityManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [cityFilter, setCityFilter] = useState("全部");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [memberGroup, setMemberGroup] = useState<typeof mockGroups[0] | null>(null);
  const [selectedGroupNo, setSelectedGroupNo] = useState(mockGroups[1].no);

  if (memberGroup) return <MemberList group={memberGroup} onBack={() => setMemberGroup(null)} />;

  const types = ["全部", "体验官群", "PRO会员群", "游客群", "尊享群", "家族群", "分站管理群"];
  const cities = ["全部", "北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京"];
  const filtered = mockGroups.filter(g =>
    (typeFilter === "全部" || g.type === typeFilter) &&
    (cityFilter === "全部" || g.city.includes(cityFilter)) &&
    (g.name.includes(search) || g.city.includes(search) || g.wechat.includes(search) || g.groupNo.includes(search))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedGroup = mockGroups.find(g => g.no === selectedGroupNo) || filtered[0] || mockGroups[0];
  const groupIndex = Math.max(0, Number(selectedGroup.no) - 1);
  const groupMembers = Array.from({ length: 6 }, (_, index) => mockMembers[(groupIndex + index) % mockMembers.length]);
  const capacityPercent = Math.round((selectedGroup.memberCount / selectedGroup.max) * 100);
  const serviceOfficers = ["吴思远", "林小燕", "刘刚", "陈明", "张晓红", "李梦华"];
  const tableCols = [
    { label: "编号", w: 60 }, { label: "群名", w: 200 }, { label: "地区", w: 100 },
    { label: "所属微信", w: 90 }, { label: "群类型", w: 100 }, { label: "群主状态", w: 80 },
    { label: "推送次数", w: 80 }, { label: "扫码次数", w: 80 }, { label: "入群人数", w: 90 }, { label: "操作", w: 140 },
  ];
  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      {showModal && <NewGroupModal onClose={() => setShowModal(false)} />}

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
        <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索群名、城市、微信号..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>
        <div className="text-xs px-3 py-2 uppercase" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radius, fontFamily: "monospace" }}>共 {filtered.length} 个群</div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)_360px] gap-4">
        <section className="min-h-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            <span className="text-xs font-bold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>群列表 / {filtered.length}</span>
            <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>点击行查看详情</span>
          </div>
          <div className="overflow-auto flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}` }}>
            <div className="flex items-center px-4 py-2.5" style={{ background: "#fafafa", minWidth: "1120px" }}>
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
                <button key={g.no} className="w-full flex items-center px-4 py-2.5 text-left transition-all group" style={{ background: active ? S.accentLight : "transparent", borderBottom: `1px solid ${S.border}`, minWidth: "1120px", boxShadow: active ? `inset 3px 0 0 ${S.accent}` : "none" }}
                  onClick={() => setSelectedGroupNo(g.no)}
                >
                  <div className="flex-shrink-0 text-xs" style={{ width: 60, color: S.muted, fontFamily: "monospace" }}>{g.no}</div>
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
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 80, color: S.text, fontFamily: "monospace" }}>{g.pushCount}</div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.textSec, fontFamily: "monospace" }}>{g.scanCount}</div>
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{g.memberCount} 人</div>
                  <div className="flex-shrink-0 flex items-center gap-1.5" style={{ width: 140 }}>
                    <button className="px-2 py-1 text-xs uppercase font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={(event) => { event.stopPropagation(); setMemberGroup(g); }}>
                      <Users size={11} className="inline mr-0.5" />查看名单
                    </button>
                    <span className="px-2 py-1 text-xs uppercase" style={{ color: active ? S.text : S.muted, fontFamily: "monospace" }}>详情</span>
                  </div>
                </button>
              );
            })}
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
                </div>
                <button className="px-2.5 py-1.5 text-xs font-bold flex-shrink-0" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setMemberGroup(selectedGroup)}>
                  <Users size={12} className="inline mr-1" />入群名单
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-3">
                {[["推送", selectedGroup.pushCount], ["扫码", selectedGroup.scanCount], ["入群", selectedGroup.memberCount], ["容量", selectedGroup.max]].map(([l, v]) => (
                  <div key={l as string} className="p-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(204,255,0,0.16)", borderRadius: S.radiusSm }}>
                    <div className="text-xs" style={{ color: "rgba(204,255,0,0.65)", fontFamily: "monospace" }}>{l}</div>
                    <div className="text-base font-semibold mt-0.5" style={{ fontFamily: "monospace" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(204,255,0,0.16)" }}>
                <div className="grid grid-cols-3 gap-2">
                  {[["所属项目", selectedGroup.type.replace("群", "项目")], ["专属服务官", serviceOfficers[groupIndex % serviceOfficers.length]], ["群主状态", selectedGroup.ownerStatus]].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="text-xs" style={{ color: "rgba(204,255,0,0.62)", fontFamily: "monospace" }}>{label}</div>
                      <div className="text-xs font-bold mt-0.5 truncate" style={{ color: value === "待交接" ? "#ffd600" : S.accent, fontFamily: "monospace" }}>{value}</div>
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
            </div>

            <div className="p-4" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>群成员名单</div>
                    <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>已入群 {selectedGroup.memberCount} 人 · 展示最近成员</div>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }} onClick={() => setMemberGroup(selectedGroup)} title="查看全部成员名单">
                    <TrendingUp size={15} style={{ color: S.muted }} /> 全部
                  </button>
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
            <div className="grid grid-cols-2 gap-2">
              {["更新群二维码", "同步成员名单", "调整群主状态", "创建承接新群"].map((action, i) => (
                <button key={action} className="px-3 py-2.5 text-left text-xs font-bold" style={{ background: i === 0 ? S.accent : S.bg, color: "#000", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => i === 3 ? setShowModal(true) : undefined}>
                  {action}
                </button>
              ))}
            </div>
        </aside>
      </div>
    </div>
  );
}
