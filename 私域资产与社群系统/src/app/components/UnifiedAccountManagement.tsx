import { useMemo, useState } from "react";
import { Building2, BriefcaseBusiness, Check, ChevronDown, Code2, MessageCircle, Share2, Sparkles } from "lucide-react";
import WeChatManagement from "./WeChatManagement";
import AccountsAndResourceCenter from "./AccountsAndResourceCenter";
import type { CommunicationToolType } from "../data/communicationTools";

type UnifiedCategory = "all" | "communication" | "content" | "workspace" | "developer" | "business";
type UnifiedViewDimension = "type" | "project" | "person";
type Subtype = { key: string; label: string; type: CommunicationToolType | "all"; platform?: string; types?: CommunicationToolType[]; hint?: string };

// 软蓝灰统一色板（与 AccountsAndResourceCenter / WeChatManagement 一致）
const S = {
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  primaryLight: "rgba(59,130,246,0.08)",
  primaryMid: "rgba(59,130,246,0.20)",
  accent: "#bfdbfe",
  text: "#1e293b",
  textSec: "#475569",
  muted: "#94a3b8",
  border: "rgba(15,23,42,0.06)",
  borderMed: "rgba(15,23,42,0.12)",
  bg: "#fafafa",
  surface: "#ffffff",
  radius: 8,
} as const;

const CATEGORY_TABS: { key: UnifiedCategory; label: string; hint: string; icon: typeof MessageCircle }[] = [
  { key: "all", label: "全部", hint: "查看全部账号资产", icon: Building2 },
  { key: "communication", label: "通讯与身份", hint: "微信、手机号、邮箱等登录身份", icon: MessageCircle },
  { key: "content", label: "内容与微信生态", hint: "公众号、小程序、视频号与内容平台", icon: Share2 },
  { key: "workspace", label: "协作与 AI", hint: "Figma、ChatGPT、Claude、WorkBuddy、Trae", icon: Sparkles },
  { key: "developer", label: "开发与基础设施", hint: "GitHub、代码仓库、云服务与域名", icon: Code2 },
  { key: "business", label: "业务系统", hint: "SCRM、CRM、ERP、财务与数据系统", icon: BriefcaseBusiness },
];

const CATEGORY_SUBTYPES: Record<UnifiedCategory, Subtype[]> = {
  all: [{ key: "all-assets", label: "全部账号", type: "all", hint: "手机号、邮箱、微信及各类系统账号" }],
  communication: [
    { key: "all-communication", label: "全部", type: "all", types: ["wechat", "wecom", "phone", "email"], hint: "微信、手机号和邮箱" },
    { key: "wechat", label: "微信账号", type: "wechat", hint: "个人微信 / 企业微信" },
    { key: "phone", label: "手机号", type: "phone", hint: "号码与实名" },
    { key: "email", label: "邮箱", type: "email", hint: "邮箱与密保" },
  ],
  content: [
    { key: "all-content", label: "全部渠道", type: "media" },
    { key: "official-account", label: "公众号", type: "media", platform: "公众号" },
    { key: "mini-program", label: "小程序", type: "media", platform: "小程序" },
    { key: "video-account", label: "视频号", type: "media", platform: "视频号" },
    { key: "douyin", label: "抖音", type: "media", platform: "抖音" },
    { key: "xiaohongshu", label: "小红书", type: "media", platform: "小红书" },
    { key: "kuaishou", label: "快手", type: "media", platform: "快手" },
    { key: "bilibili", label: "B站", type: "media", platform: "B站" },
  ],
  workspace: [
    { key: "all-workspace", label: "全部协作与 AI", type: "workspace" },
    { key: "figma", label: "Figma", type: "workspace", platform: "Figma" },
    { key: "chatgpt", label: "ChatGPT", type: "workspace", platform: "ChatGPT" },
    { key: "claude", label: "Claude", type: "workspace", platform: "Claude" },
    { key: "workbuddy", label: "WorkBuddy", type: "workspace", platform: "WorkBuddy" },
    { key: "trae", label: "Trae", type: "workspace", platform: "Trae" },
  ],
  developer: [
    { key: "all-developer", label: "全部开发资源", type: "developer" },
    { key: "github", label: "GitHub", type: "developer", platform: "GitHub" },
    { key: "gitlab", label: "GitLab", type: "developer", platform: "GitLab" },
    { key: "cloud", label: "云服务", type: "developer", platform: "云服务" },
    { key: "domain", label: "域名", type: "developer", platform: "域名" },
    { key: "database", label: "数据库", type: "developer", platform: "数据库" },
  ],
  business: [
    { key: "all-business", label: "全部业务系统", type: "business" },
    { key: "scrm", label: "SCRM", type: "business", platform: "SCRM" },
    { key: "crm", label: "CRM", type: "business", platform: "CRM" },
    { key: "erp", label: "ERP", type: "business", platform: "ERP" },
    { key: "finance", label: "财务系统", type: "business", platform: "财务系统" },
    { key: "support", label: "客服系统", type: "business", platform: "客服系统" },
    { key: "analytics", label: "数据报表", type: "business", platform: "数据报表" },
  ],
};

interface UnifiedAccountManagementProps {
  initialCategory?: UnifiedCategory;
  initialSubtype?: string;
}

export default function UnifiedAccountManagement({ initialCategory = "all", initialSubtype }: UnifiedAccountManagementProps = {}) {
  const initialCategorySubtypes = CATEGORY_SUBTYPES[initialCategory];
  const [activeCategory, setActiveCategory] = useState<UnifiedCategory>(initialCategory);
  const [activeSubtype, setActiveSubtype] = useState(initialSubtype || initialCategorySubtypes[0].key);
  const [selectedSubtypeKeys, setSelectedSubtypeKeys] = useState<string[]>([initialSubtype || initialCategorySubtypes[0].key]);
  const [wechatMode, setWechatMode] = useState<"personal" | "wecom">("personal");
  const [viewDimension, setViewDimension] = useState<UnifiedViewDimension>("type");
  const [moreOpen, setMoreOpen] = useState(false);
  const subtypes = CATEGORY_SUBTYPES[activeCategory];
  const selectedSubtype = useMemo(() => subtypes.find(item => item.key === activeSubtype) || subtypes[0], [activeSubtype, subtypes]);
  const selectedSubtypes = useMemo(() => selectedSubtypeKeys.map(key => subtypes.find(item => item.key === key)).filter(Boolean) as Subtype[], [selectedSubtypeKeys, subtypes]);
  const onlyWechatSelected = selectedSubtypeKeys.length === 1 && selectedSubtypeKeys[0] === "wechat";
  const selectedToolTypes = useMemo(() => Array.from(new Set(selectedSubtypes.flatMap(item => item.types || (item.type !== "all" ? [item.type] : [])))) as CommunicationToolType[], [selectedSubtypes]);
  const selectedPlatforms = useMemo(() => Array.from(new Set(selectedSubtypes.map(item => item.platform).filter(Boolean))) as string[], [selectedSubtypes]);

  const selectCategory = (category: UnifiedCategory) => {
    setActiveCategory(category);
    setActiveSubtype(CATEGORY_SUBTYPES[category][0].key);
    setSelectedSubtypeKeys([CATEGORY_SUBTYPES[category][0].key]);
    setMoreOpen(false);
  };

  const toggleSubtype = (key: string) => {
    const subtype = subtypes.find(item => item.key === key);
    if (!subtype) return;
    const isReset = subtype.key.startsWith("all-") || subtype.key === "all-assets";
    // 单类型点击（非 all-、非 wechat 复合tab）：互相单选替代，避免手机+邮箱等多类混合造成语义不清晰
    const isSingleSubtype = !isReset && key !== "wechat";
    setSelectedSubtypeKeys(current => {
      let next;
      if (isReset) next = [key];
      else if (current.includes(key)) next = current.filter(item => item !== key);
      else if (isSingleSubtype) next = [key];  // 单选替代
      else next = [...current.filter(item => !item.startsWith("all-")), key];  // wechat：追加（wechat内部再分personal/wecom）
      const resolved = next.length ? next : [subtypes[0].key];
      setActiveSubtype(resolved[resolved.length - 1]);
      return resolved;
    });
  };

  const assetNav = (mobile = false) => (
    <div className={`${mobile ? "flex" : "hidden xl:flex"} items-center flex-shrink-0 overflow-x-auto`} role="tablist" aria-label="账号资产类型">
      {CATEGORY_TABS.map((tab, index) => {
        const active = activeCategory === tab.key;
        const Icon = tab.icon;
        return <button key={tab.key} type="button" role="tab" aria-selected={active} title={tab.hint} onClick={() => selectCategory(tab.key)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap rounded-md" style={{ background: active ? S.primary : "transparent", color: active ? "#ffffff" : S.muted, borderRight: index < CATEGORY_TABS.length - 1 ? `1px solid ${S.border}` : "none", fontFamily: "monospace" }}><Icon size={13} />{tab.label}</button>;
      })}
    </div>
  );

  return (
    <div className="h-full min-h-0 flex flex-col" style={{ background: S.bg }}>
      <div className="flex items-center justify-between gap-4 px-6 py-2.5 flex-shrink-0" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-4 min-w-0">
          <Building2 size={14} style={{ color: S.muted }} />
          <div className="min-w-0">
            <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>账号资产中心</div>
            <div className="text-[10px] truncate" style={{ color: S.muted, fontFamily: "monospace" }}>统一台账 · 五阶段生命周期 · 三种查看维度</div>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0" role="tablist" aria-label="查看维度">
          {([
            { key: "type", label: "按账号类型", hint: "按资产类型与平台查看", icon: MessageCircle },
            { key: "project", label: "按项目", hint: "按项目分组并查看空闲号池", icon: Building2 },
            { key: "person", label: "按人", hint: "按负责人展开名下工具", icon: Share2 },
          ] as { key: UnifiedViewDimension; label: string; hint: string; icon: typeof MessageCircle }[]).map((tab, index) => {
            const active = viewDimension === tab.key;
            const Icon = tab.icon;
            return <button key={tab.key} type="button" role="tab" aria-selected={active} title={tab.hint} onClick={() => setViewDimension(tab.key)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap rounded-md" style={{ background: active ? S.primary : "transparent", color: active ? "#ffffff" : S.muted, borderRight: index < 2 ? `1px solid ${S.border}` : "none", fontFamily: "monospace" }}><Icon size={13} />{tab.label}</button>;
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-2 flex-shrink-0 overflow-x-auto" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        {assetNav(true)}
        <div id="unified-account-header-actions" className="flex items-center flex-shrink-0" aria-label="注册入库操作" />
        {onlyWechatSelected && <div id="unified-wechat-register" className="flex items-center flex-shrink-0" aria-label="微信账号注册入库" />}
      </div>

      {activeCategory !== "all" && <div className="flex items-center gap-2 px-6 py-2 flex-shrink-0 overflow-x-auto" style={{ background: S.surface, borderBottom: `1px solid ${S.borderMed}` }} role="tablist" aria-label={`${CATEGORY_TABS.find(tab => tab.key === activeCategory)?.label}子标签`}>
        {subtypes.slice(0, 5).map(subtype => {
          if (subtype.key === "wechat") {
            const selected = selectedSubtypeKeys.includes(subtype.key);
            return <div key={subtype.key} className="flex flex-shrink-0 overflow-hidden" style={{ border: `1px solid ${selected ? S.primary : S.borderMed}`, borderRadius: S.radius }} role="tablist" aria-label="微信账号类型">
              {(["personal", "wecom"] as const).map((mode, index) => {
                const active = wechatMode === mode;
                return <button key={mode} type="button" role="tab" aria-selected={active && selected} onClick={() => { if (!selected) toggleSubtype("wechat"); setActiveSubtype("wechat"); setWechatMode(mode); }} className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold transition-all" style={{ background: active && selected ? S.primary : "#fff", color: active && selected ? "#ffffff" : S.textSec, borderRight: index === 0 ? `1px solid ${S.borderMed}` : "none", fontFamily: "monospace" }}>{mode === "personal" ? "个人微信" : "企业微信"}</button>;
              })}
            </div>;
          }
          const active = selectedSubtypeKeys.includes(subtype.key);
          return <button key={subtype.key} type="button" role="tab" aria-selected={active} title={subtype.hint || subtype.label} onClick={() => toggleSubtype(subtype.key)} className="flex items-center gap-1 flex-shrink-0 px-3 py-1.5 text-xs font-semibold transition-all" style={{ background: active ? S.primary : "#fff", color: active ? "#ffffff" : S.textSec, border: `1px solid ${active ? S.primary : S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }}>{active && !subtype.key.startsWith("all-") && <Check size={12} />}{subtype.label}</button>;
        })}
        {subtypes.length > 5 && <div className="relative flex-shrink-0"><button type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen(value => !value)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold" style={{ background: moreOpen ? S.primary : "#fff", color: moreOpen ? "#ffffff" : S.textSec, border: `1px solid ${moreOpen ? S.primary : S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }}>更多类型 <ChevronDown size={12} /></button>{moreOpen && <div className="absolute left-0 top-full z-30 mt-2 w-48 p-2 space-y-1" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: 8, boxShadow: "0 12px 28px rgba(15,23,42,0.14)" }}>{subtypes.slice(5).map(subtype => { const active = selectedSubtypeKeys.includes(subtype.key); return <button key={subtype.key} type="button" onClick={() => toggleSubtype(subtype.key)} className="w-full flex items-center justify-between px-2.5 py-2 text-left text-xs" style={{ background: active ? S.primaryLight : "#fff", color: active ? S.primaryDark : S.textSec, borderRadius: 6, fontFamily: "monospace" }}><span>{subtype.label}</span>{active && <Check size={13} />}</button>; })}</div>}</div>}
      </div>}

      <div className="flex-1 min-h-0 overflow-hidden">
        {onlyWechatSelected ? (
          <WeChatManagement controlledViewDimension={viewDimension} controlledMainTab={wechatMode} onMainTabChange={setWechatMode} hideAccountTypeTabs hideDimensionTabs hidePageTitle toolbarActionPlacement="toolbar" headerActionTargetId="unified-wechat-register" />
        ) : (
          <AccountsAndResourceCenter key={selectedSubtypeKeys.join("-")} initialTopTab={selectedToolTypes.length === 1 ? selectedToolTypes[0] : "all"} embedded controlledViewDimension={viewDimension} hideDimensionControls platformFilter={selectedPlatforms.length === 1 ? selectedPlatforms[0] : null} platformFilters={selectedPlatforms.length > 1 ? selectedPlatforms : undefined} toolTypes={selectedToolTypes.length ? selectedToolTypes : undefined} headerActionTargetId="unified-account-header-actions" secondaryActionTargetId="unified-secondary-actions" />
        )}
      </div>
    </div>
  );
}
