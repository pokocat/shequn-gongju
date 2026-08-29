import { useState } from "react";
import { Search, Plus, AlertTriangle, X, Phone, Mail, MessageCircle, Globe, ChevronDown, Filter, ExternalLink, Upload, CreditCard, Eye, EyeOff, CheckCircle, List, LayoutGrid } from "lucide-react";

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

// ─── 模拟数据 ───────────────────────────────────────────────
const phones = [
  { id: 1, number: "138-0012-3456", carrier: "中国移动", region: "北京市朝阳区",  idOwner: "吴思远", idNumber: "110105198801011234", idFront: true,  idBack: true,  assignedTo: "吴思远", assignedProject: "北京PRO服务",    registrations: ["微信 wx_bj_01", "支付宝"],           manager: "吴思远",         status: "使用中", risk: "normal",   note: "北京主号" },
  { id: 2, number: "139-0012-3457", carrier: "中国联通", region: "上海市浦东新区", idOwner: "林小燕", idNumber: "310115199203154321", idFront: true,  idBack: true,  assignedTo: "林小燕", assignedProject: "上海体验官服务",  registrations: ["微信 wx_sh_01", "抖音 @eco_sh"], manager: "林小燕",         status: "使用中", risk: "normal",   note: "上海主号" },
  { id: 3, number: "138-0012-3458", carrier: "中国移动", region: "广州市天河区",  idOwner: "刘刚",   idNumber: "440106199507223456", idFront: true,  idBack: false, assignedTo: "刘刚",   assignedProject: "广州代理培训",    registrations: ["微信 wx_gz_01"],                     manager: "刘刚",           status: "异常",   risk: "high",     note: "30天未登录微信，身份证背面未上传" },
  { id: 4, number: "152-0012-3461", carrier: "中国电信", region: "成都市武侯区",  idOwner: "赵志远", idNumber: "510104199212075678", idFront: true,  idBack: true,  assignedTo: "赵志远", assignedProject: "成都分站",         registrations: ["微信 wx_cd_01"],                     manager: "赵志远（待交接）", status: "待交接", risk: "warning",  note: "人员离职，待交接" },
  { id: 5, number: "186-0012-3462", carrier: "中国移动", region: "深圳市南山区",  idOwner: "李梦华", idNumber: "440305199409186789", idFront: true,  idBack: true,  assignedTo: "李梦华", assignedProject: "深圳代理",          registrations: ["微信 wx_sz_01"],                     manager: "李梦华",         status: "使用中", risk: "normal",   note: "深圳主号" },
  { id: 6, number: "135-0012-3463", carrier: "中国联通", region: "待分配",        idOwner: "—",      idNumber: "—",                 idFront: false, idBack: false, assignedTo: "—",      assignedProject: "—",                registrations: [],                                        manager: "—",              status: "空闲",   risk: "normal",   note: "备用号，身份证信息待补充" },
  { id: 7, number: "158-0012-3464", carrier: "中国移动", region: "杭州市西湖区",  idOwner: "陈明",   idNumber: "330106199305280123", idFront: true,  idBack: true,  assignedTo: "陈明",   assignedProject: "杭州分站",          registrations: ["微信 wx_hz_01"],                     manager: "陈明",           status: "使用中", risk: "normal",   note: "杭州主号" },
];

const wechats = [
  { id: 1, wechatId: "wx_bj_01", boundPhone: "138-0012-3456", friendCount: 487, groups: ["北京PRO会员群01", "北京PRO会员群02", "北京体验官备用群"], manager: "吴思远", project: "北京PRO服务", status: "使用中", risk: "normal", lastLogin: "2026-07-05" },
  { id: 2, wechatId: "wx_sh_01", boundPhone: "139-0012-3457", friendCount: 356, groups: ["上海PRO会员群01", "上海游客群01"], manager: "林小燕", project: "上海体验官", status: "使用中", risk: "normal", lastLogin: "2026-07-05" },
  { id: 3, wechatId: "wx_gz_01", boundPhone: "138-0012-3458", friendCount: 234, groups: ["广州代理群01"], manager: "刘刚", project: "广州代理培训", status: "异常", risk: "high", lastLogin: "2026-06-05" },
  { id: 4, wechatId: "wx_cd_01", boundPhone: "152-0012-3461", friendCount: 67, groups: ["成都分站群01"], manager: "赵志远", project: "成都分站", status: "待交接", risk: "warning", lastLogin: "2026-07-01" },
  { id: 5, wechatId: "wx_sz_01", boundPhone: "186-0012-3462", friendCount: 310, groups: ["深圳代理群01", "深圳游客群01"], manager: "李梦华", project: "深圳代理", status: "使用中", risk: "normal", lastLogin: "2026-07-04" },
  { id: 6, wechatId: "wx_bj_02", boundPhone: "—（未绑定手机）", friendCount: 0, groups: [], manager: "—", project: "—", status: "库存", risk: "normal", lastLogin: "—" },
  { id: 7, wechatId: "wx_hz_01", boundPhone: "158-0012-3464", friendCount: 140, groups: ["杭州会员群01"], manager: "陈明", project: "杭州分站", status: "使用中", risk: "normal", lastLogin: "2026-07-05" },
];

const mediaAccounts = [
  { id: 1, group: "微信生态", platform: "公众号", emoji: "📢", color: "#000000", colorBg: "#f0f0f0", name: "官方公众号", verified: true, loginType: "邮箱登录", loginId: "admin@eco-saas.com", pwdStore: "公司密码库 1Password", followers: "12,800", contentCount: "286篇文章", lastPost: "2026-07-04", engagement: "4.2%", manager: "内容运营团队", status: "使用中", risk: "normal", note: "主要内容发布渠道，绑定小程序和视频号同一主体", tags: ["认证账号", "已绑小程序", "已绑视频号"] },
  { id: 2, group: "微信生态", platform: "视频号", emoji: "🎬", color: "#000000", colorBg: "#f0f0f0", name: "官方视频号", verified: true, loginType: "微信账号关联（无独立账号密码）", loginId: "关联公众号主体登录", pwdStore: "无需单独密码", followers: "4,200", contentCount: "68个视频", lastPost: "2026-07-03", engagement: "6.8%", manager: "内容运营团队", status: "使用中", risk: "normal", note: "与公众号同一主体，通过公众号后台管理，无需单独账号", tags: ["挂载公众号", "直播功能已开通"] },
  { id: 3, group: "内容平台", platform: "抖音", emoji: "🎵", color: "#000000", colorBg: "#f0f0f0", name: "@eco_official", verified: true, loginType: "手机号登录", loginId: "139-0012-3459", pwdStore: "公司密码库 1Password", followers: "28,600", contentCount: "142个视频", lastPost: "2026-07-05", engagement: "8.3%", manager: "张晓红", status: "使用中", risk: "normal", note: "主推流量渠道，已开通企业号橱窗，每周3-5条更新", tags: ["企业蓝V", "橱窗已开通", "直播已开通"] },
  { id: 4, group: "内容平台", platform: "小红书", emoji: "📕", color: "#000000", colorBg: "#f0f0f0", name: "eco_life", verified: false, loginType: "手机号登录（无需微信绑定）", loginId: "140-0012-3460", pwdStore: "公司密码库 1Password", followers: "9,300", contentCount: "234篇笔记", lastPost: "2026-07-04", engagement: "5.1%", manager: "王美丽", status: "使用中", risk: "normal", note: "生活方式内容为主，引流私域主账号", tags: ["个人号", "已申请专业号"] },
  { id: 5, group: "内容平台", platform: "小红书", emoji: "📕", color: "#000000", colorBg: "#f0f0f0", name: "eco_pro", verified: true, loginType: "邮箱登录（独立账号，不绑手机）", loginId: "pro@eco-saas.com", pwdStore: "公司密码库 1Password", followers: "3,100", contentCount: "87篇笔记", lastPost: "2026-06-28", engagement: "7.4%", manager: "王美丽", status: "使用中", risk: "normal", note: "PRO会员专属内容账号，主打深度干货，导流加入PRO", tags: ["专业号", "PRO专属"] },
  { id: 6, group: "内容平台", platform: "微博", emoji: "🐦", color: "#000000", colorBg: "#f0f0f0", name: "@官方账号", verified: true, loginType: "手机号登录", loginId: "158-0012-3465", pwdStore: "公司密码库 1Password", followers: "5,700", contentCount: "1,240条微博", lastPost: "2026-07-02", engagement: "1.8%", manager: "内容运营团队", status: "使用中", risk: "normal", note: "品牌官微，更新频率低，主要用于品牌背书和官方声明", tags: ["蓝V认证", "低频更新"] },
  { id: 7, group: "内容平台", platform: "B站", emoji: "📺", color: "#000000", colorBg: "#f0f0f0", name: "官方长视频", verified: false, loginType: "邮箱登录", loginId: "bili@eco-saas.com", pwdStore: "公司密码库 1Password", followers: "2,100", contentCount: "23个投稿", lastPost: "2026-03-10", engagement: "3.2%", manager: "内容运营团队", status: "空闲", risk: "normal", note: "长视频内容账号，目前暂停更新，待规划内容方向后重启", tags: ["暂停更新", "待重启"] },
  { id: 8, group: "内容平台", platform: "快手", emoji: "⚡", color: "#000000", colorBg: "#f0f0f0", name: "官方快手号", verified: false, loginType: "手机号登录", loginId: "186-0012-3470", pwdStore: "公司密码库 1Password", followers: "1,340", contentCount: "31个视频", lastPost: "2026-05-20", engagement: "2.9%", manager: "张晓红", status: "空闲", risk: "normal", note: "下沉市场测试账号，ROI不佳，暂停投入", tags: ["测试阶段", "暂停更新"] },
  { id: 9, group: "内容平台", platform: "知乎", emoji: "🔵", color: "#000000", colorBg: "#f0f0f0", name: "创始人IP", verified: true, loginType: "手机号登录", loginId: "138-0012-3456", pwdStore: "创始人本人保管", followers: "4,680", contentCount: "56篇专栏", lastPost: "2026-06-30", engagement: "9.1%", manager: "创始人王总", status: "使用中", risk: "normal", note: "创始人个人IP，主写私域运营方法论，高质量引流", tags: ["创始人IP", "专栏已开通", "知乎认证"] },
  { id: 10, group: "内容平台", platform: "领英", emoji: "💼", color: "#000000", colorBg: "#f0f0f0", name: "Eco SaaS 官方", verified: false, loginType: "邮箱登录（境外平台）", loginId: "admin@eco-saas.com", pwdStore: "公司密码库 1Password", followers: "890", contentCount: "34篇动态", lastPost: "2026-06-15", engagement: "5.6%", manager: "内容运营团队", status: "空闲", risk: "normal", note: "面向B端和招募合伙人，更新频率低", tags: ["B端获客", "低频更新"] },
];

const emailOthers = [
  { id: 1, type: "邮箱", identifier: "admin@eco-saas.com", usedFor: "公众号后台、小程序、视频号管理", manager: "系统管理", status: "使用中", risk: "normal" },
  { id: 2, type: "邮箱", identifier: "pro@eco-saas.com", usedFor: "小红书PRO账号", manager: "王美丽", status: "使用中", risk: "normal" },
  { id: 3, type: "邮箱", identifier: "bili@eco-saas.com", usedFor: "B站账号", manager: "内容运营团队", status: "使用中", risk: "normal" },
  { id: 4, type: "苹果ID", identifier: "apple@eco-saas.com", usedFor: "iPhone 设备管理、TestFlight", manager: "技术团队", status: "使用中", risk: "normal" },
  { id: 5, type: "企业微信", identifier: "健康运营科技有限公司", usedFor: "内部协作、客服接待", manager: "HR 团队", status: "使用中", risk: "normal" },
  { id: 6, type: "云账号", identifier: "阿里云 main@eco-saas.com", usedFor: "服务器、OSS、域名", manager: "技术团队", status: "使用中", risk: "warning" },
];

// ─── 工具 ────────────────────────────────────────────────────
const statusStyle: Record<string, { bg: string; color: string; borderRadius: string }> = {
  "使用中":  { bg: S.accent, color: "#000", borderRadius: S.radiusSm },
  "正常":    { bg: S.accent, color: "#000", borderRadius: S.radiusSm },
  "已完成":  { bg: S.accent, color: "#000", borderRadius: S.radiusSm },
  "配置完成":{ bg: S.accent, color: "#000", borderRadius: S.radiusSm },
  "异常":    { bg: "#fff0f0", color: "#c53030", borderRadius: S.radiusSm },
  "高风险":  { bg: "#fff0f0", color: "#c53030", borderRadius: S.radiusSm },
  "已拒绝":  { bg: "#fff0f0", color: "#c53030", borderRadius: S.radiusSm },
  "待处理":  { bg: "#fffbeb", color: "#b45309", borderRadius: S.radiusSm },
  "待交接":  { bg: "#fffbeb", color: "#b45309", borderRadius: S.radiusSm },
  "待发送":  { bg: "#fffbeb", color: "#b45309", borderRadius: S.radiusSm },
  "空闲":    { bg: "#f0f0f0", color: "#333", borderRadius: S.radiusSm },
  "库存":    { bg: "#f0f0f0", color: "#333", borderRadius: S.radiusSm },
  "草稿":    { bg: "#f0f0f0", color: "#333", borderRadius: S.radiusSm },
  "进行中":  { bg: "#f0f0f0", color: "#333", borderRadius: S.radiusSm },
  "审核中":  { bg: "#f0f0f0", color: "#333", borderRadius: S.radiusSm },
};

const platformIcon: Record<string, string> = {
  "公众号": "📢", "视频号": "🎬", "抖音": "🎵", "小红书": "📕", "微博": "🐦", "B站": "📺",
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] || { bg: S.accent, color: "#000", borderRadius: S.radiusSm };
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 text-xs w-fit font-medium" style={{ background: s.bg, color: s.color, borderRadius: s.borderRadius, fontFamily: "monospace" }}>
      {status}
    </span>
  );
}

function RiskIcon({ risk }: { risk: string }) {
  if (risk === "high") return <AlertTriangle size={12} style={{ color: "#1a1a1a" }} />;
  if (risk === "warning") return <AlertTriangle size={12} style={{ color: S.muted }} />;
  return null;
}

function BrowseModeToggle({ value, onChange, label }: { value: "list" | "cards"; onChange: (value: "list" | "cards") => void; label: string }) {
  return (
    <div className="flex items-center p-0.5" aria-label={label} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
      <button type="button" title="列表浏览" aria-label="列表浏览" aria-pressed={value === "list"} className="w-8 h-7 flex items-center justify-center transition-all" style={{ background: value === "list" ? "#0d0d0d" : "transparent", color: value === "list" ? S.accent : S.muted, borderRadius: "4px" }} onClick={() => onChange("list")}>
        <List size={15} />
      </button>
      <button type="button" title="卡片浏览" aria-label="卡片浏览" aria-pressed={value === "cards"} className="w-8 h-7 flex items-center justify-center transition-all" style={{ background: value === "cards" ? "#0d0d0d" : "transparent", color: value === "cards" ? S.accent : S.muted, borderRadius: "4px" }} onClick={() => onChange("cards")}>
        <LayoutGrid size={15} />
      </button>
    </div>
  );
}

function Row({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <div
      className="flex items-center px-4 py-2.5 cursor-pointer transition-all gap-4"
      style={{
        background: selected ? "rgba(204,255,0,0.08)" : "transparent",
        borderBottom: `1px solid ${S.border}`,
        borderLeft: selected ? `3px solid ${S.accent}` : "3px solid transparent",
        color: selected ? S.text : S.text,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function ColHead({ children, width }: { children: React.ReactNode; width: string }) {
  return <div className="flex-shrink-0 text-xs font-medium uppercase" style={{ color: "#555555", width, fontFamily: "monospace", letterSpacing: "0.05em" }}>{children}</div>;
}

function Col({ children, width, highlight }: { children: React.ReactNode; width: string; highlight?: boolean }) {
  return <div className="flex-shrink-0 text-xs" style={{ width, color: highlight ? S.text : S.textSec, fontFamily: "monospace" }}>{children}</div>;
}

// ─── 总览 Tab ────────────────────────────────────────────────
const allAccounts = [
  ...phones.map(p => ({ id: `ph-${p.id}`, type: "手机号", identifier: p.number, detail: `${p.carrier} · 注册${p.registrations.length}个账号`, manager: p.manager, status: p.status, risk: p.risk })),
  ...wechats.map(w => ({ id: `wx-${w.id}`, type: "微信号", identifier: w.wechatId, detail: `好友${w.friendCount}人 · ${w.groups.length}个群`, manager: w.manager, status: w.status, risk: w.risk })),
  ...mediaAccounts.map(m => ({ id: `md-${m.id}`, type: m.platform, identifier: m.name, detail: `${m.loginType} · ${m.followers}粉丝`, manager: m.manager, status: m.status, risk: m.risk })),
  ...emailOthers.map(e => ({ id: `em-${e.id}`, type: e.type, identifier: e.identifier, detail: e.usedFor, manager: e.manager, status: e.status, risk: e.risk })),
];

const typeColors: Record<string, { bg: string; color: string }> = {
  "手机号":   { bg: S.accent, color: "#000" },
  "微信号":   { bg: S.accent, color: "#000" },
  "公众号":   { bg: "#ffd600", color: "#000" },
  "视频号":   { bg: "#f0f0ec", color: "#555" },
  "抖音":     { bg: "#1a1a1a", color: S.accent },
  "小红书":   { bg: "#1a1a1a", color: S.accent },
  "邮箱":     { bg: "#f0f0ec", color: "#555" },
  "苹果ID":   { bg: "#f0f0ec", color: "#555" },
  "企业微信": { bg: S.accent, color: "#000" },
  "云账号":   { bg: "#ffd600", color: "#000" },
};

function OverviewTab({ search }: { search: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = allAccounts.filter(a =>
    a.identifier.toLowerCase().includes(search.toLowerCase()) ||
    a.manager.includes(search) || a.type.includes(search)
  );
  const detail = allAccounts.find(a => a.id === selected);

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex items-center px-4 py-2.5 gap-4 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
          <ColHead width="80px">类型</ColHead>
          <ColHead width="200px">账号标识</ColHead>
          <ColHead width="220px">详情</ColHead>
          <ColHead width="100px">保管人</ColHead>
          <ColHead width="80px">状态</ColHead>
          <ColHead width="40px">风险</ColHead>
        </div>
        <div className="overflow-auto flex-1">
          {filtered.map(a => {
            const tc = typeColors[a.type] || { bg: "#f0f0ec", color: "#555" };
            return (
              <Row key={a.id} selected={selected === a.id} onClick={() => setSelected(selected === a.id ? null : a.id)}>
                <span className="flex-shrink-0 px-2 py-0.5 text-xs" style={{ background: tc.bg, color: tc.color, width: "80px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{a.type}</span>
                <Col width="200px" highlight><div className="flex items-center gap-1"><RiskIcon risk={a.risk} />{a.identifier}</div></Col>
                <Col width="220px">{a.detail}</Col>
                <Col width="100px">{a.manager}</Col>
                <div style={{ width: "80px" }}><StatusBadge status={a.status} /></div>
                <Col width="40px">{a.risk !== "normal" && <RiskIcon risk={a.risk} />}</Col>
              </Row>
            );
          })}
        </div>
      </div>

      {detail && (
        <div className="w-64 flex-shrink-0 p-4 flex flex-col gap-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>// 账号详情</span>
            <button onClick={() => setSelected(null)}><X size={13} style={{ color: S.muted }} /></button>
          </div>
          <div className="py-3 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-2xl mb-1">{platformIcon[detail.type] || "📱"}</div>
            <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.identifier}</div>
            <div className="text-xs mt-1 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.type}</div>
            <div className="mt-2 flex justify-center"><StatusBadge status={detail.status} /></div>
          </div>
          {[["保管人", detail.manager], ["详情", detail.detail]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
              <span className="text-xs text-right max-w-[140px]" style={{ color: S.text, fontFamily: "monospace" }}>{v}</span>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>编辑</button>
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: S.bg, border: `1px solid rgba(0,0,0,0.10)`, color: S.text, borderRadius: S.radius, fontFamily: "monospace" }}>发起交接</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 新增手机号弹窗 ──────────────────────────────────────────
function NewPhoneModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ number: "", carrier: "中国移动", region: "", idOwner: "", idNumber: "", assignedTo: "", assignedProject: "", note: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inp = { background: "#f7f7f7", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-[560px] overflow-hidden" style={{ background: "#fff", border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7", borderRadius: `${S.radiusLg} ${S.radiusLg} 0 0` }}>
          <span className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 新增手机号</span>
          <button onClick={onClose}><X size={16} style={{ color: S.muted }} /></button>
        </div>

        <div className="p-6 space-y-5" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div>
            <div className="text-xs font-medium mb-3 flex items-center gap-2 uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>
              <Phone size={13} /> // 号码基本信息
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>手机号码 *</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="138-xxxx-xxxx" value={form.number} onChange={e => set("number", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>运营商 *</label>
                <select className="w-full px-3 py-2 text-xs outline-none cursor-pointer" style={inp} value={form.carrier} onChange={e => set("carrier", e.target.value)}>
                  {["中国移动","中国联通","中国电信","中国广电"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>号码归属区域 *</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="如 北京市朝阳区" value={form.region} onChange={e => set("region", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-3 flex items-center gap-2 uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>
              <CreditCard size={13} /> // 注册身份证信息
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>身份证所有人 *</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="真实姓名" value={form.idOwner} onChange={e => set("idOwner", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>身份证号码 *</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="18位身份证号" value={form.idNumber} onChange={e => set("idNumber", e.target.value)} />
              </div>

              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>身份证正面（人像面）</label>
                <div className="border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 py-5" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
                    <CreditCard size={18} style={{ color: "#000" }} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase" style={{ color: S.text, fontFamily: "monospace" }}>点击上传正面</div>
                    <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>JPG/PNG，≤5MB</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                    <Upload size={10} /> 上传图片
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>身份证反面（国徽面）</label>
                <div className="border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 py-5" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
                    <CreditCard size={18} style={{ color: "#000" }} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase" style={{ color: S.text, fontFamily: "monospace" }}>点击上传反面</div>
                    <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>JPG/PNG，≤5MB</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                    <Upload size={10} /> 上传图片
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-3 flex items-center gap-2 uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>
              <Globe size={13} /> // 分配与使用
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>分配给谁</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="保管人姓名" value={form.assignedTo} onChange={e => set("assignedTo", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>归属项目</label>
                <input className="w-full px-3 py-2 text-xs outline-none" style={inp} placeholder="如 北京PRO服务" value={form.assignedProject} onChange={e => set("assignedProject", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>备注</label>
                <textarea className="w-full px-3 py-2 text-xs outline-none resize-none" rows={2} style={inp} placeholder="其他说明..." value={form.note} onChange={e => set("note", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm uppercase font-bold" style={{ background: S.bg, color: S.text, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>取消</button>
          <button className="flex-1 py-2.5 text-sm font-bold uppercase" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ─── 手机号 Tab ──────────────────────────────────────────────
function PhoneTab({ search }: { search: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showIdNum, setShowIdNum] = useState<Record<number, boolean>>({});
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = phones.filter(p =>
    p.number.includes(search) || p.manager.includes(search) ||
    p.carrier.includes(search) || p.region.includes(search) ||
    p.idOwner.includes(search) || p.assignedTo.includes(search) ||
    p.assignedProject.includes(search)
  );
  const detail = phones.find(p => p.id === selected);

  const maskId = (id: string) => id === "—" ? "—" : `${id.slice(0, 6)}****${id.slice(-4)}`;

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {showNewModal && <NewPhoneModal onClose={() => setShowNewModal(false)} />}

      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
            <span>共 <b style={{ color: S.text }}>{filtered.length}</b> 个手机号</span>
            <span style={{ color: S.text, fontWeight: "bold" }}>⚠ 身份证未完整：{phones.filter(p => !p.idFront || !p.idBack).length} 个</span>
            <span style={{ color: S.muted }}>○ 待分配：{phones.filter(p => p.assignedTo === "—").length} 个</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setShowNewModal(true)}>
            <Plus size={13} /> 新增手机号
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center px-4 py-2.5 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0`, minWidth: "fit-content" }}>
            {([["手机号码",140],["运营商",80],["归属区域",120],["身份证人",90],["身份证号",150],["证件",64],["分配给",90],["归属项目",130],["已注册账号",200],["状态",80]] as [string,number][]).map(([l,w]) => (
              <div key={l} className="flex-shrink-0 text-xs uppercase" style={{ width: w, color: "#555555", fontFamily: "monospace", letterSpacing: "0.05em" }}>{l}</div>
            ))}
          </div>

          <div className="overflow-auto flex-1">
            {filtered.map((p) => {
              const isSelected = selected === p.id;
              return (
                <div
                  key={p.id}
                  className="flex items-center px-4 py-2.5 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? "rgba(204,255,0,0.08)" : "transparent",
                    borderBottom: `1px solid ${S.border}`,
                    borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent",
                    minWidth: "fit-content",
                    color: S.text,
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  onClick={() => setSelected(isSelected ? null : p.id)}
                >
                  <div className="flex-shrink-0 flex items-center gap-1.5 text-xs" style={{ width: 140, fontFamily: "monospace" }}>
                    <RiskIcon risk={p.risk} />
                    <Phone size={11} style={{ color: S.muted }} />
                    <span style={{ color: S.text }}>{p.number}</span>
                  </div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 80, color: S.muted, fontFamily: "monospace" }}>{p.carrier}</div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 120, color: S.muted, fontFamily: "monospace" }}>{p.region}</div>
                  <div className="flex-shrink-0 text-xs font-medium" style={{ width: 90, color: S.text, fontFamily: "monospace" }}>{p.idOwner}</div>
                  <div className="flex-shrink-0 flex items-center gap-1.5 text-xs" style={{ width: 150 }}>
                    <span style={{ color: S.muted, fontFamily: "monospace" }}>
                      {showIdNum[p.id] ? p.idNumber : maskId(p.idNumber)}
                    </span>
                    {p.idNumber !== "—" && (
                      <button onClick={e => { e.stopPropagation(); setShowIdNum(v => ({ ...v, [p.id]: !v[p.id] })); }}>
                        {showIdNum[p.id] ? <EyeOff size={10} style={{ color: S.muted }} /> : <Eye size={10} style={{ color: S.muted }} />}
                      </button>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1" style={{ width: 64 }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs" style={{ color: p.idFront ? S.text : S.mutedLight, fontSize: "10px", fontFamily: "monospace" }}>{p.idFront ? "✓正" : "✗正"}</span>
                      <span className="text-xs" style={{ color: p.idBack ? S.text : S.mutedLight, fontSize: "10px", fontFamily: "monospace" }}>{p.idBack ? "✓反" : "✗反"}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 90, color: p.assignedTo === "—" ? S.muted : S.textSec, fontFamily: "monospace" }}>{p.assignedTo}</div>
                  <div className="flex-shrink-0 text-xs" style={{ width: 130, color: p.assignedProject === "—" ? S.muted : S.text, fontFamily: "monospace" }}>{p.assignedProject}</div>
                  <div className="flex-shrink-0" style={{ width: 200 }}>
                    {p.registrations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.registrations.map((r, i) => (
                          <span key={i} className="px-1.5 py-0.5" style={{ background: "#f0f0ec", color: S.textSec, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace", border: `1px solid ${S.border}` }}>{r}</span>
                        ))}
                      </div>
                    ) : <span style={{ color: S.muted, fontSize: "11px", fontFamily: "monospace" }}>暂无</span>}
                  </div>
                  <div className="flex-shrink-0" style={{ width: 80 }}><StatusBadge status={p.status} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {detail && (
        <div className="w-[300px] flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }}>
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid rgba(0,0,0,0.08)`, background: "#f7f7f7", borderRadius: `${S.radiusLg} ${S.radiusLg} 0 0` }}>
            <span className="text-sm font-medium uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 手机号详情</span>
            <button onClick={() => setSelected(null)}><X size={13} style={{ color: S.muted }} /></button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="py-4 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <Phone size={20} className="mx-auto mb-2" style={{ color: S.text }} />
              <div className="text-lg font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.number}</div>
              <div className="text-xs mt-0.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.carrier} · {detail.region}</div>
              <div className="mt-2 flex justify-center"><StatusBadge status={detail.status} /></div>
            </div>

            <div className="overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: S.accentMid, borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                <CreditCard size={13} style={{ color: S.text }} />
                <span className="text-xs font-medium uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 注册身份证</span>
                {detail.idFront && detail.idBack
                  ? <span className="ml-auto text-xs flex items-center gap-1" style={{ color: S.text, fontFamily: "monospace" }}><CheckCircle size={11} /> 已完整上传</span>
                  : <span className="ml-auto text-xs flex items-center gap-1" style={{ color: S.text, fontFamily: "monospace" }}><AlertTriangle size={11} /> 资料不完整</span>
                }
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: S.muted, fontFamily: "monospace" }}>身份证所有人</span>
                  <span style={{ color: S.text, fontFamily: "monospace" }}>{detail.idOwner}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: S.muted, fontFamily: "monospace" }}>身份证号码</span>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: S.text, fontFamily: "monospace" }}>
                      {showIdNum[detail.id] ? detail.idNumber : (detail.idNumber !== "—" ? `${detail.idNumber.slice(0,6)}****${detail.idNumber.slice(-4)}` : "—")}
                    </span>
                    {detail.idNumber !== "—" && (
                      <button onClick={() => setShowIdNum(v => ({ ...v, [detail.id]: !v[detail.id] }))}>
                        {showIdNum[detail.id] ? <EyeOff size={11} style={{ color: S.muted }} /> : <Eye size={11} style={{ color: S.muted }} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <div className="text-xs mb-1.5 flex items-center gap-1 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>
                      正面（人像面）
                      {detail.idFront && <CheckCircle size={10} style={{ color: S.text }} />}
                    </div>
                    {detail.idFront ? (
                      <div className="h-20 flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ background: S.accentMid, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        <CreditCard size={20} style={{ color: S.text }} />
                        <span className="text-xs uppercase" style={{ color: S.text, fontFamily: "monospace" }}>已上传</span>
                        <span className="text-xs" style={{ color: S.textSec, fontSize: "10px", fontFamily: "monospace" }}>点击查看</span>
                      </div>
                    ) : (
                      <div className="h-20 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
                        <Upload size={16} style={{ color: S.muted }} />
                        <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>未上传</span>
                        <span className="text-xs" style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>点击上传</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs mb-1.5 flex items-center gap-1 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>
                      反面（国徽面）
                      {detail.idBack && <CheckCircle size={10} style={{ color: S.text }} />}
                    </div>
                    {detail.idBack ? (
                      <div className="h-20 flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ background: S.accentMid, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        <CreditCard size={20} style={{ color: S.text }} />
                        <span className="text-xs uppercase" style={{ color: S.text, fontFamily: "monospace" }}>已上传</span>
                        <span className="text-xs" style={{ color: S.textSec, fontSize: "10px", fontFamily: "monospace" }}>点击查看</span>
                      </div>
                    ) : (
                      <div className="h-20 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ border: `1px dashed rgba(0,0,0,0.10)`, background: "#f7f7f7", borderRadius: S.radiusSm }}>
                        <Upload size={16} style={{ color: S.muted }} />
                        <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>未上传</span>
                        <span className="text-xs" style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>点击上传</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="px-3 py-2" style={{ background: S.accentLight, borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                <span className="text-xs font-medium uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 分配 &amp; 使用</span>
              </div>
              <div className="p-3 space-y-2">
                {[
                  ["分配给", detail.assignedTo],
                  ["归属项目", detail.assignedProject],
                  ["保管人", detail.manager],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs py-1" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <span style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                    <span style={{ color: v === "—" ? S.mutedLight : S.text, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs mb-2 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>
                已注册 {detail.registrations.length} 个平台账号
              </div>
              {detail.registrations.length > 0 ? detail.registrations.map((r, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <Globe size={11} style={{ color: S.text }} />
                  <span className="text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{r}</span>
                </div>
              )) : (
                <div className="text-xs px-2.5 py-2" style={{ background: "#f7f7f7", color: S.muted, fontFamily: "monospace", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>该手机号尚未注册任何平台账号</div>
              )}
            </div>

            {detail.note && (
              <div className="p-3 text-xs" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.muted, lineHeight: 1.6, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                {detail.note}
              </div>
            )}

            {detail.risk !== "normal" && (
              <div className="flex items-start gap-2 p-3" style={{ background: "#f5f5f5", border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radiusSm }}>
                <AlertTriangle size={12} style={{ color: S.accent, marginTop: 1, flexShrink: 0 }} />
                <span className="text-xs uppercase" style={{ color: S.accent, fontFamily: "monospace" }}>
                  {detail.risk === "high" ? "账号存在异常，请尽快处理" : "存在交接风险，请及时处理"}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>编辑信息</button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 text-xs uppercase font-bold" style={{ background: S.bg, color: S.text, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>登记关联账号</button>
              <button className="py-2 text-xs uppercase font-bold" style={{ background: S.bg, color: S.text, border: `1px solid rgba(0,0,0,0.10)`, borderRadius: S.radius, fontFamily: "monospace" }}>重新分配</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 微信号 Tab ──────────────────────────────────────────────
function WechatTab({ search }: { search: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = wechats.filter(w => w.wechatId.includes(search) || w.manager.includes(search) || w.project.includes(search));
  const detail = wechats.find(w => w.id === selected);

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex items-center px-4 py-2.5 gap-4 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
          <ColHead width="160px">微信号</ColHead>
          <ColHead width="160px">绑定手机</ColHead>
          <ColHead width="70px">好友数</ColHead>
          <ColHead width="60px">群数量</ColHead>
          <ColHead width="100px">保管人</ColHead>
          <ColHead width="120px">归属项目</ColHead>
          <ColHead width="80px">状态</ColHead>
          <ColHead width="80px">最近登录</ColHead>
        </div>
        <div className="overflow-auto flex-1">
          {filtered.map(w => {
            const daysAgo = w.lastLogin !== "—" ? Math.floor((new Date("2026-07-05").getTime() - new Date(w.lastLogin).getTime()) / 86400000) : null;
            const loginRisk = daysAgo !== null && daysAgo > 7;
            return (
              <Row key={w.id} selected={selected === w.id} onClick={() => setSelected(selected === w.id ? null : w.id)}>
                <Col width="160px" highlight>
                  <div className="flex items-center gap-1.5">
                    <RiskIcon risk={w.risk} />
                    <MessageCircle size={12} style={{ color: S.muted }} />
                    {w.wechatId}
                  </div>
                </Col>
                <Col width="160px">
                  {w.boundPhone === "—（未绑定手机）" ? (
                    <span className="px-1.5 py-0.5 text-xs uppercase" style={{ background: "#fff8e1", color: "#b45309", fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>未绑定手机号</span>
                  ) : w.boundPhone}
                </Col>
                <Col width="70px">{w.friendCount}</Col>
                <Col width="60px">{w.groups.length} 个</Col>
                <Col width="100px">{w.manager}</Col>
                <Col width="120px">{w.project}</Col>
                <div style={{ width: "80px" }}><StatusBadge status={w.status} /></div>
                <Col width="80px">
                  <span style={{ color: loginRisk ? S.text : S.muted, fontWeight: loginRisk ? "bold" : "normal", fontFamily: "monospace" }}>
                    {daysAgo !== null ? `${daysAgo}天前` : "—"}
                  </span>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>

      {detail && (
        <div className="w-64 flex-shrink-0 p-4 flex flex-col gap-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 微信号详情</span>
            <button onClick={() => setSelected(null)}><X size={13} style={{ color: S.muted }} /></button>
          </div>
          <div className="py-3 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <MessageCircle size={20} className="mx-auto mb-1" style={{ color: S.text }} />
            <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.wechatId}</div>
            {detail.boundPhone === "—（未绑定手机）" ? (
              <span className="mt-1 inline-block px-2 py-0.5 text-xs uppercase" style={{ background: "#fff8e1", color: "#b45309", borderRadius: S.radiusSm, fontFamily: "monospace" }}>未绑定手机号</span>
            ) : <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.boundPhone}</div>}
            <div className="mt-2 flex justify-center"><StatusBadge status={detail.status} /></div>
          </div>
          {detail.groups.length > 0 && (
            <div>
              <div className="text-xs mb-1.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>管理 {detail.groups.length} 个群组</div>
              {detail.groups.map((g, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 mb-1" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{g}</span>
                </div>
              ))}
            </div>
          )}
          {[["保管人", detail.manager], ["归属项目", detail.project], ["好友数", `${detail.friendCount} 人`], ["最近登录", detail.lastLogin]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
              <span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{v}</span>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-auto">
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>编辑信息</button>
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: S.bg, border: `1px solid rgba(0,0,0,0.10)`, color: S.text, borderRadius: S.radius, fontFamily: "monospace" }}>发起交接</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 媒体账号 Tab ─────────────────────────────────────────────
function MediaTab({ search, platform, viewMode }: { search: string; platform: string; viewMode: "list" | "cards" }) {
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = mediaAccounts.filter(m =>
    (platform === "全部媒体" || m.platform === platform) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.platform.includes(search) ||
      m.manager.includes(search) ||
      m.loginId.includes(search))
  );
  const detail = mediaAccounts.find(m => m.id === selected);
  const wechatGroup = filtered.filter(m => m.group === "微信生态");
  const contentGroup = filtered.filter(m => m.group === "内容平台");
  const totalFollowers = filtered.reduce((total, m) => total + Number(m.followers.replace(/,/g, "")), 0);
  const activeCount = filtered.filter(m => m.status === "使用中").length;
  const idleCount = filtered.filter(m => m.status === "空闲").length;

  function MediaCard({ account }: { account: typeof mediaAccounts[number] }) {
    const isSelected = selected === account.id;
    return (
      <button
        className="w-full p-3 text-left transition-all"
        style={{ background: isSelected ? S.accentLight : S.surface, border: `1px solid ${isSelected ? S.accent : S.border}`, borderRadius: S.radius, boxShadow: isSelected ? `inset 3px 0 0 ${S.accent}` : "none" }}
        onClick={() => setSelected(isSelected ? null : account.id)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg leading-none">{account.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5"><span className="text-xs font-bold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{account.name}</span>{account.verified && <span className="text-xs px-1" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>✓</span>}</div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{account.platform} · {account.manager}</div>
            </div>
          </div>
          <StatusBadge status={account.status} />
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {[["粉丝", account.followers], ["内容", account.contentCount], ["互动", account.engagement]].map(([label, value]) => (
            <div key={label as string} className="px-2 py-1.5" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <div className="text-xs font-semibold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 text-[10px]" style={{ color: S.muted, borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>
          <span className="truncate">负责人：{account.manager}</span><span className="flex-shrink-0">发布 {account.lastPost}</span>
        </div>
      </button>
    );
  }

  function MediaList({ accounts }: { accounts: typeof mediaAccounts }) {
    return (
      <div className="overflow-auto flex-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="min-w-[920px]">
          <div className="flex items-center gap-3 px-3 py-2.5 text-xs" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555", fontFamily: "monospace" }}>
            {[['账号 / 平台', 240], ['状态', 78], ['粉丝', 90], ['内容', 112], ['互动率', 82], ['登录方式', 180], ['负责人', 130], ['最近发布', 95]].map(([label, width]) => <div key={label as string} className="flex-shrink-0 font-semibold" style={{ width }}>{label}</div>)}
          </div>
          {accounts.map(account => {
            const isSelected = selected === account.id;
            return (
              <button key={account.id} type="button" className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all" style={{ background: isSelected ? S.accentLight : "transparent", borderBottom: `1px solid ${S.border}`, borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent", fontFamily: "monospace" }} onClick={() => setSelected(isSelected ? null : account.id)}>
                <div className="flex items-center gap-2 flex-shrink-0" style={{ width: 240 }}>
                  <span className="text-base">{account.emoji}</span>
                  <div className="min-w-0"><div className="flex items-center gap-1 text-xs font-bold truncate" style={{ color: S.text }}>{account.name}{account.verified && <span className="px-1 text-[10px]" style={{ background: S.accent, color: "#000", borderRadius: 3 }}>✓</span>}</div><div className="text-[10px] truncate" style={{ color: S.muted }}>{account.platform} · {account.loginId}</div></div>
                </div>
                <div className="flex-shrink-0" style={{ width: 78 }}><StatusBadge status={account.status} /></div>
                <div className="flex-shrink-0 text-xs font-semibold" style={{ width: 90, color: S.text }}>{account.followers}</div>
                <div className="flex-shrink-0 text-xs" style={{ width: 112, color: S.textSec }}>{account.contentCount}</div>
                <div className="flex-shrink-0 text-xs font-semibold" style={{ width: 82, color: S.text }}>{account.engagement}</div>
                <div className="flex-shrink-0 text-[10px] truncate" style={{ width: 180, color: S.muted }}>{account.loginType}</div>
                <div className="flex-shrink-0 text-xs truncate" style={{ width: 130, color: S.textSec }}>{account.manager}</div>
                <div className="flex-shrink-0 text-[10px]" style={{ width: 95, color: S.muted }}>{account.lastPost}</div>
              </button>
            );
          })}
          {!accounts.length && <div className="py-12 text-center text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>未找到匹配的媒体账号</div>}
        </div>
      </div>
    );
  }

  function GroupSection({ title, accounts }: { title: string; accounts: typeof mediaAccounts }) {
    if (!accounts.length) return null;
    return (
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase" style={{ color: S.text, fontFamily: "monospace" }}>{title}</h3>
          <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{accounts.length} 个账号</span>
        </div>
        <div className="grid grid-cols-3 gap-3">{accounts.map(account => <MediaCard key={account.id} account={account} />)}</div>
      </section>
    );
  }

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden pr-1">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[["媒体账号", filtered.length, "当前筛选结果"], ["全平台粉丝", totalFollowers.toLocaleString(), "累计覆盖"], ["正常运营", activeCount, "可持续更新"], ["待处理", idleCount, "空闲待激活"]].map(([label, value, hint]) => (
            <div key={label as string} className="px-4 py-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{label}</div>
              <div className="text-2xl font-semibold mt-1" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>{hint}</div>
            </div>
          ))}
        </div>
        {viewMode === "list" ? <MediaList accounts={filtered} /> : <div className="space-y-4 overflow-auto pb-4"><GroupSection title="微信生态" accounts={wechatGroup} /><GroupSection title="内容平台" accounts={contentGroup} />{!filtered.length && <div className="text-center py-12" style={{ color: S.muted, fontFamily: "monospace" }}>未找到匹配的媒体账号</div>}</div>}
      </div>

      {detail && (
        <div className="w-72 flex-shrink-0 p-4 flex flex-col gap-3 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 账号详情</span>
            <button onClick={() => setSelected(null)}><X size={13} style={{ color: S.muted }} /></button>
          </div>

          <div className="py-4 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-4xl mb-2">{detail.emoji}</div>
            <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.name}</div>
            <div className="text-xs mt-0.5 uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.platform}</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <StatusBadge status={detail.status} />
              {detail.verified && (
                <span className="px-1.5 py-0.5 text-xs uppercase" style={{ background: S.accent, color: "#000", fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>✓ 已认证</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "粉丝", value: detail.followers, highlight: false },
              { label: "内容", value: detail.contentCount, highlight: false },
              { label: "互动率", value: detail.engagement, highlight: true },
            ].map(s => (
              <div key={s.label} className="px-2 py-2 text-center" style={{ background: s.highlight ? S.accentMid : S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>{s.value}</div>
                <div className="text-xs mt-0.5 uppercase" style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {detail.tags.map(t => (
              <span key={t} className="px-2 py-0.5 text-xs" style={{ background: S.bg, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace", border: `1px solid ${S.border}` }}>{t}</span>
            ))}
          </div>

          <div className="p-3 space-y-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-medium mb-1 uppercase" style={{ color: S.text, fontFamily: "monospace" }}>// 登录凭证</div>
            <div className="flex justify-between">
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>登录方式</span>
              <span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{detail.loginType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>登录 ID</span>
              <span className="text-xs text-right max-w-[160px]" style={{ color: S.text, fontFamily: "monospace" }}>{detail.loginId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>密码保管</span>
              <span className="text-xs text-right max-w-[160px]" style={{ color: S.textSec, fontFamily: "monospace" }}>{detail.pwdStore}</span>
            </div>
          </div>

          {[["保管人", detail.manager], ["最近发布", detail.lastPost]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
              <span className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
              <span className="text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{v}</span>
            </div>
          ))}

          {detail.note && (
            <div className="p-3 text-xs" style={{ background: "#f7f7f7", color: S.muted, lineHeight: 1.6, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {detail.note}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-auto">
            <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>编辑信息</button>
            <button className="w-full py-2 text-xs uppercase font-bold flex items-center justify-center gap-1" style={{ background: S.bg, border: `1px solid rgba(0,0,0,0.10)`, color: S.text, borderRadius: S.radius, fontFamily: "monospace" }}>
              <ExternalLink size={11} /> 打开平台后台
            </button>
            {detail.status === "空闲" && (
              <button className="w-full py-2 text-xs uppercase font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace" }}>重启账号运营</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 邮箱/其他 Tab ────────────────────────────────────────────
function EmailOtherTab({ search }: { search: string }) {
  const filtered = emailOthers.filter(e => e.identifier.includes(search) || e.manager.includes(search) || e.type.includes(search) || e.usedFor.includes(search));
  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
      <div className="flex items-center px-4 py-2.5 gap-4 flex-shrink-0" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
        <ColHead width="90px">账号类型</ColHead>
        <ColHead width="230px">账号标识</ColHead>
        <ColHead width="280px">用于哪些平台/用途</ColHead>
        <ColHead width="100px">保管人</ColHead>
        <ColHead width="80px">状态</ColHead>
      </div>
      <div className="overflow-auto flex-1">
        {filtered.map(e => {
          const tc = typeColors[e.type] || { bg: "#f0f0ec", color: "#555" };
          return (
            <div key={e.id} className="flex items-center px-4 py-3 gap-4" style={{ borderBottom: `1px solid ${S.border}` }}>
              <span className="flex-shrink-0 px-2 py-0.5 text-xs" style={{ background: tc.bg, color: tc.color, width: "90px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{e.type}</span>
              <Col width="230px" highlight>
                <div className="flex items-center gap-1.5">
                  {e.risk !== "normal" && <RiskIcon risk={e.risk} />}
                  <Mail size={11} style={{ color: S.muted }} />
                  {e.identifier}
                </div>
              </Col>
              <Col width="280px">{e.usedFor}</Col>
              <Col width="100px">{e.manager}</Col>
              <div style={{ width: "80px" }}><StatusBadge status={e.status} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────
const tabs = [
  { id: "all",   label: "总览",    count: allAccounts.length,    icon: Globe },
  { id: "phone", label: "手机号",  count: phones.length,         icon: Phone },
  { id: "wx",    label: "微信号",  count: wechats.length,        icon: MessageCircle },
  { id: "other", label: "邮箱/其他", count: emailOthers.length,  icon: Mail },
];

const mediaPlatformFilters = [
  { platform: "全部媒体", count: mediaAccounts.length, emoji: "◉" },
  ...Array.from(new Set(mediaAccounts.map(m => m.platform))).map(platform => ({
    platform,
    count: mediaAccounts.filter(m => m.platform === platform).length,
    emoji: mediaAccounts.find(m => m.platform === platform)?.emoji || "◌",
  })),
];

export default function AccountAssets() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [mediaExpanded, setMediaExpanded] = useState(false);
  const [mediaPlatform, setMediaPlatform] = useState("全部媒体");
  const [mediaView, setMediaView] = useState<"list" | "cards">("cards");

  const riskCount = allAccounts.filter(a => a.risk !== "normal").length;

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold uppercase" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>// 账号资产中心</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>统一管理手机号、微信号、媒体账号和其他凭证，支持跨平台关联查看</p>
        </div>
        <div className="flex gap-2">
          {riskCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase" style={{ background: "#f5f5f5", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>
              <AlertTriangle size={12} /> {riskCount} 个账号存在风险
            </div>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>
            <Plus size={13} /> 新增账号
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "账号总数", value: allAccounts.length },
          { label: "手机号", value: phones.length },
          { label: "微信号", value: wechats.length },
          { label: "媒体账号", value: mediaAccounts.length },
          { label: "⚠ 风险账号", value: riskCount },
        ].map(s => (
          <div key={s.label} className="px-3 py-2.5" style={{ background: S.surface, border: `1px solid rgba(0,0,0,0.08)`, borderRadius: S.radiusLg, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-xs uppercase" style={{ color: S.muted, fontFamily: "monospace" }}>{s.label}</div>
            <div className="font-semibold mt-0.5" style={{ color: S.text, fontSize: "20px", fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0 p-0 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all uppercase"
              style={{ background: activeTab === t.id ? "#0d0d0d" : "transparent", color: activeTab === t.id ? S.accent : S.muted, fontFamily: "monospace", borderRight: `1px solid ${S.border}` }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              <span className="px-1.5 py-0.5" style={{ background: activeTab === t.id ? S.accent : S.bg, color: activeTab === t.id ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                {t.count}
              </span>
            </button>
          ))}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all uppercase"
            style={{ background: activeTab === "media" ? "#0d0d0d" : "transparent", color: activeTab === "media" ? S.accent : S.muted, fontFamily: "monospace" }}
            onClick={() => {
              setActiveTab("media");
              setMediaExpanded(expanded => activeTab === "media" ? !expanded : true);
            }}
            aria-expanded={mediaExpanded}
          >
            媒体账号
            <span className="px-1.5 py-0.5" style={{ background: activeTab === "media" ? S.accent : S.bg, color: activeTab === "media" ? "#000" : S.muted, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {mediaAccounts.length}
            </span>
            <ChevronDown size={12} style={{ transform: mediaExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input
            className="bg-transparent outline-none text-xs flex-1"
            style={{ color: S.textSec, fontFamily: "monospace" }}
            placeholder={activeTab === "phone" ? "搜索手机号、运营商、保管人..." : activeTab === "wx" ? "搜索微信号、保管人、项目..." : activeTab === "media" ? "搜索平台、账号名称、登录ID..." : "搜索账号、保管人..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>

        <div className="relative flex-shrink-0">
          <select
            className="appearance-none px-3 py-2 pr-7 text-xs outline-none cursor-pointer"
            style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {["全部状态", "使用中", "空闲", "异常", "待交接", "库存"].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: S.muted }} />
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 text-xs flex-shrink-0 uppercase" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
          <Filter size={12} /> 导出
        </button>
      </div>

      {activeTab === "media" && mediaExpanded && (
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <span className="text-xs flex-shrink-0 font-bold" style={{ color: S.text, fontFamily: "monospace" }}>媒体账号 /</span>
          {mediaPlatformFilters.map(filter => (
            <button
              key={filter.platform}
              className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1.5 text-xs transition-all"
              style={{
                background: mediaPlatform === filter.platform ? S.accent : "transparent",
                color: mediaPlatform === filter.platform ? "#000" : S.textSec,
                border: `1px solid ${mediaPlatform === filter.platform ? S.accent : S.border}`,
                borderRadius: S.radiusSm,
                fontFamily: "monospace",
              }}
              onClick={() => setMediaPlatform(filter.platform)}
            >
              <span>{filter.emoji}</span>{filter.platform}<span style={{ color: mediaPlatform === filter.platform ? "#000" : S.muted }}>{filter.count}</span>
            </button>
          ))}
          <div className="ml-auto pl-2 flex-shrink-0" style={{ borderLeft: `1px solid ${S.border}` }}>
            <BrowseModeToggle value={mediaView} onChange={setMediaView} label="媒体账号浏览方式" />
          </div>
        </div>
      )}

      {activeTab === "all"   && <OverviewTab search={search} />}
      {activeTab === "phone" && <PhoneTab search={search} />}
      {activeTab === "wx"    && <WechatTab search={search} />}
      {activeTab === "media" && <MediaTab key={mediaPlatform} search={search} platform={mediaPlatform} viewMode={mediaView} />}
      {activeTab === "other" && <EmailOtherTab search={search} />}
    </div>
  );
}
