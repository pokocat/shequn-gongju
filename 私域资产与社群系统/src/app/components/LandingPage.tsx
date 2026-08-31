import { useState, useEffect } from "react";
import { S, useThemeSingleton, useTheme, resolvePalette, getTheme, DarkMode, ResolvedMode } from "../theme";
import { Sun, Moon, Monitor, ArrowRight, CheckCircle, Zap, Users, MessageCircle, Database, Shield, BarChart2, Radio, Star, Play, TrendingUp, Menu, X, Brain, Cpu, GitBranch, AlertTriangle, Target, Layers, ChevronRight, Activity, FileCheck, FolderKanban, Palette, Settings, Receipt, Wrench, LineChart, Home, Sparkles, Rocket, Coins, MapPin, RefreshCw, FileSpreadsheet, Scale } from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// 平台功能 & 内容（贴合系统实际落地模块）
// ══════════════════════════════════════════════════════════════════════════════

const PRODUCT = {
  name: "聚域",
  nameEn: "JuYu",
  tagline: "私域资产 · 账号全生命周期 · 社群运营中枢",
  desc: "一套系统打通账号注册入库、养号风控、分配到项目、发放到人、审批交接、归档停用，同时整合社群、订单、工具、数据、主理人公社与会员小程序，AI 让运营从 2 小时变 5 分钟。",
};

const NAV_ITEMS = ["产品模块", "AI 能力", "客户痛点", "行业方案", "关于我们"];

const stats = [
  { value: "3,200+", label: "管理私域账号" },
  { value: "680 万", label: "私域好友 & 群成员" },
  { value: "5 阶段", label: "账号生命周期闭环" },
  { value: "8 大模块", label: "覆盖私域运营全景" },
  { value: "4 色分级", label: "容量 / 风控自动预警" },
  { value: "5 套潮系主题", label: "明暗双模式随心切换" },
];

const painPoints = [
  { icon: "📱", title: "账号散落多平台，根本管不住", desc: "个微、企微、手机号、邮箱、公众号、媒体账号各管各的，时间久了谁在用、用在什么项目、有没有过期，一片混乱" },
  { icon: "🚦", title: "没有养号与风控，被封才后悔", desc: "刚注册就猛加好友，完全没有 7 天养号期 / 风控门槛 / 异常预警，账号挂掉造成一批客户失联" },
  { icon: "🔀", title: "发放到项目和人，领用全靠口头", desc: "项目要拿号就问管理员要，没有领用记录；人员离职时交接一塌糊涂，客户和群也跟着一起带走" },
  { icon: "👥", title: "群容量 / 群码 / 群归属混乱", desc: "一个微信管 20 个群，满群没人补、群码过期没人换、谁负责哪个群不清楚；进群靠人工分配效率极低" },
  { icon: "📋", title: "审批与交接全靠企业微信私聊", desc: "账号申领、回收、工具权限、提现、高风险操作全部在聊天里流转，没有审计，出问题追溯不到责任人" },
  { icon: "🎨", title: "后台长得都一样，员工不爱用", desc: "千篇一律蓝灰后台，切换主题还得改 CSS；年轻人不喜欢，培训成本高" },
];

/**
 * 8 大核心功能 —— 对应系统左侧导航实际存在的 8 个模块
 * （账号资产中心 / 订单管理 / 社群管理 / 审批中心 / 工具中心 / 数据中心 / 主理人公社 / 会员小程序）
 * 每一项描述都真实对应代码里已落地的能力。
 */
const coreFeatures: { icon: any; title: string; desc: string; tags: string[] }[] = [
  {
    icon: Database,
    title: "账号资产中心（微信/企微双体系）",
    desc: "5 阶段生命周期：注册入库 → 养号期（7天/风控门槛）→ 分配到项目 → 发放到人（可走交接审批回收）→ 归档停用。支持按账号类型 / 按项目（带分组+空闲号池） / 按人（带工具展开）三个维度查看；容量进度条四色分级（绿/琥珀/橙/红），详情宽度可拖拽持久化。",
    tags: ["个微详情 / 企微详情", "5 张账号卡片化", "四色容量分级", "列宽拖拽 & 持久化", "7 天养号风控"],
  },
  {
    icon: Receipt,
    title: "订单管理中心",
    desc: "订单全生命周期：创建 → 支付 → 发货 → 完成/退款/售后。多条件筛选、状态胶囊、订单 360 视图（用户、项目、明细、流水、售后记录），支持批量导出与财务对账。",
    tags: ["订单 360 视图", "售后工单", "财务对账", "状态胶囊化", "批量导出"],
  },
  {
    icon: Users,
    title: "社群管理中心",
    desc: "群码刷新、满群预警、备用群自动切换、群活跃度看板、成员名单、新建微信群/企业微信群。AI 根据城市/身份/群容量自动分配最优群组，减少人工排队等待。",
    tags: ["群码 & 满群预警", "备用群池", "AI 群分配", "活跃度看板", "归属与项目映射"],
  },
  {
    icon: FileCheck,
    title: "审批中心",
    desc: "多级审批流程：账号申领 / 回收 / 工具权限 / 提现 / 高风险操作。条件路由（金额阈值、项目分级自动升级审批人）、审批记录审计、可撤回、催办，与账号资产中心 & 工具中心无缝联动。",
    tags: ["多级流程", "条件路由", "审计日志", "催办 / 撤回", "与申领联动"],
  },
  {
    icon: Wrench,
    title: "工具中心",
    desc: "人货场工具池：推送口令、拉群助手、群发触达、SOP 任务、内容素材库、标签清洗、手机号校验。每台人领到的工具可独立开关、可收回、可审批。",
    tags: ["群发 & SOP", "推送口令", "素材库", "标签清洗", "到人可回收"],
  },
  {
    icon: LineChart,
    title: "数据中心 & AI 报表",
    desc: "多维度 KPI 看板：城市分析、渠道来源、项目报表、RFM 用户分层、账号健康度、群活分布。AI 运营建议（今日要做什么）、风险提醒、可自定义图表导出。",
    tags: ["城市 / 渠道 / 项目", "RFM 分层", "账号健康度", "AI 运营建议", "导出图表"],
  },
  {
    icon: Sparkles,
    title: "主理人公社",
    desc: "城市合伙人 / 主理人独立工作台：自己的项目、账号池、工具池、群池、分销数据、影响力排行、多级代理管理。支持提现审批、业绩归属、佣金自动计算。",
    tags: ["城市合伙人", "独立工作台", "影响力排行", "佣金计算", "提现审批"],
  },
  {
    icon: Home,
    title: "会员小程序（私域用户端）",
    desc: "会员端小程序：我的账户 / 我的群 / 订单 / 积分 / 内容 / 服务申请。与后台账号资产/社群/订单/审批深度打通，用户换群、升级、申请服务、发起工单小程序一键搞定。",
    tags: ["我的群 & 服务", "订单 / 积分", "申请换群", "工单系统", "与后台全打通"],
  },
];

/** 4 级业务架构（更贴合系统真实层级） */
const tiers = [
  { level: 1, label: "超级生态", desc: "统管所有主理人 / 城市 / 项目 / 账号池" },
  { level: 2, label: "主理人 / 城市", desc: "城市合伙人独立工作台与结算" },
  { level: 3, label: "平台项目", desc: "具体业务单元 = 项目 + 分配到它的账号 / 工具 / 群" },
  { level: 4, label: "私域运营人", desc: "领到账号与工具 → 服务用户 → 产生订单 → 审批交接" },
];

/** 模块矩阵 —— 8 大模块 × 典型功能点（替换原来 6 个） */
const modules = coreFeatures.map((f) => ({ name: f.title.split("（")[0].split("中心")[0] + "中心", items: f.tags }));

const industries = ["教培机构", "健康产康", "新消费品牌", "城市合伙人", "代理分销", "知识付费", "社群团购", "私域电商"];

const testimonials = [
  { name: "王总", role: "某教育科技公司 · CEO", avatar: "王", content: "用聚域之前，个微、企微、群和客服是三套系统，运营人员离职交接一次就要丢掉几十个客户。现在 5 阶段生命周期+审批回收，30 分钟走完。" },
  { name: "林总监", role: "健康品牌 · 私域运营总监", avatar: "林", content: "AI 智能分群 + 四色容量预警太实用了，之前每天人工分群 2 小时，现在 5 分钟搞定；满群 80% 系统自动调备用群码，不用盯着群容量。" },
  { name: "赵经理", role: "连锁代理商 · 区域负责人", avatar: "赵", content: "主理人公社独立工作台，每个城市合伙人自己拿号、自己领工具、自己看数据，总公司只做审批和风控，管理成本降了 70%。" },
];

/** AI 能力矩阵 —— 4 个真实场景 */
const aiCapabilities = [
  {
    id: "assign",
    icon: GitBranch,
    label: "AI 群分配引擎",
    badge: "ROUTING ENGINE",
    before: "每天人工分群 2 小时",
    after: "5 分钟全部搞定",
    improvement: "效率提升 96%",
    terminalLines: [
      { text: "// 新用户入库", type: "comment" },
      { text: 'user.city    = "上海"', type: "code" },
      { text: 'user.identity = "年度会员"', type: "code" },
      { text: 'user.source   = "抖音-张老师"', type: "code" },
      { text: "", type: "blank" },
      { text: "// AI 读取所有群容量与归属", type: "comment" },
      { text: "pool = 容量<70% 城市=上海 的群 × 12", type: "code" },
      { text: "score(pool, city, identity, source, capacity)", type: "code" },
      { text: "", type: "blank" },
      { text: "→ 推荐 上海·VIP·抖音来源群#3", type: "success" },
      { text: "→ 备用群：上海·VIP·通用群#7", type: "success" },
    ],
  },
  {
    id: "risk",
    icon: AlertTriangle,
    label: "AI 账号风控 & 养号引擎",
    badge: "RISK ENGINE",
    before: "被封了才发现",
    after: "事前预警 92%",
    improvement: "异常识别 ↑ 12x",
    terminalLines: [
      { text: "// 监测账号 WX_88423 近 7 天", type: "comment" },
      { text: "7d_add_friends    = 427 （阈值 150）", type: "warn" },
      { text: "new_ip_signins    = 3 个", type: "warn" },
      { text: "mass_send_count   = 18", type: "warn" },
      { text: "", type: "blank" },
      { text: "! 养号期 7 天未过，高风险行为", type: "warn" },
      { text: "", type: "blank" },
      { text: "→ 自动暂停群发任务", type: "success" },
      { text: "→ 推送至审批：暂停该号 48h", type: "success" },
      { text: "→ 建议：切换备用号 WX_77512", type: "success" },
    ],
  },
  {
    id: "approval",
    icon: Scale,
    label: "AI 审批路由",
    badge: "APPROVAL ROUTER",
    before: "私聊流转找不到人",
    after: "自动 30 秒到审批人",
    improvement: "审批时效 ↑ 85%",
    terminalLines: [
      { text: "// 运营申请：申领 3 个个微号", type: "comment" },
      { text: "operator = 李运营", type: "code" },
      { text: "items    = [WX_331, WX_332, WX_333]", type: "code" },
      { text: "project  = 上海·教培·英语营", type: "code" },
      { text: "", type: "blank" },
      { text: "AI 路由规则计算", type: "comment" },
      { text: "申领数量 3 ≤ 5 → 项目主管审批即可", type: "code" },
      { text: "金额阈值   0 → 不用升级到财务", type: "code" },
      { text: "高风险操作 否 → 不用升级到总监", type: "code" },
      { text: "", type: "blank" },
      { text: "→ 通知 项目主管 · 王主管", type: "success" },
      { text: "→ SLA 2h，超时自动催办", type: "success" },
    ],
  },
  {
    id: "insight",
    icon: Brain,
    label: "AI 运营洞察",
    badge: "INSIGHT ENGINE",
    before: "看数据靠直觉",
    after: "每日 AI 运营建议",
    improvement: "决策效率 ↑ 6x",
    terminalLines: [
      { text: "// 今日 AI 运营建议（2026-09-01）", type: "comment" },
      { text: "", type: "blank" },
      { text: "1. 上海·VIP 群 13 号容量 95% 🔴", type: "warn" },
      { text: "   → 建议：启动备用群·VIP-14", type: "success" },
      { text: "", type: "blank" },
      { text: "2. 个微 WX_5523 近 3 天加好友 0", type: "warn" },
      { text: "   → 建议：检查手机在线 / 工具状态", type: "success" },
      { text: "", type: "blank" },
      { text: "3. 杭州渠道 ROI ↓ 18% 连续 3 周", type: "warn" },
      { text: "   → 建议：缩减投放 20% + 转抖音达人", type: "success" },
    ],
  },
];

const floatingDecisions = [
  "自动分配 42 位新用户 → 上海·VIP-07 / 广州·普通-12 / 深圳·高潜-03",
  "风控检测到个微 WX-3342 日增 217 位好友 → 暂停 24h，通知主管审批",
  "13 号群容量 95% → 自动切换到备用群 VIP-14，群码已刷新",
  "申请回收 8 个企微账号（原运营离职）→ 流转至交接审批 陈主管",
  "AI 建议：本周 杭州渠道 ROI ↓18%，建议缩减 20% 转抖音达人投放",
];

// ══════════════════════════════════════════════════════════════════════════════
// 工具函数：每个 section 内部调用 useThemeSingleton() + 取 S 全局色板
//   这样主题切换时（通过 pub/sub），组件 rerender，S.bg/... 已是最新值。
// ══════════════════════════════════════════════════════════════════════════════
function CTA() {
  return {
    bg: S.primary,
    text: S.onPrimary,
    hover: S.primaryDark,
    ring: S.accentGlow,
  };
}

/* ─────────────────────────── NavBar ─────────────────────────── */
function NavBar({ onEnterApp }: { onEnterApp: () => void }) {
  useThemeSingleton();
  const ctx = useTheme();
  const { darkMode, toggleDarkMode, themeId, resolvedDark } = ctx;
  const activePalette = resolvePalette(themeId, resolvedDark ? "dark" : "light");
  const S_ = S;
  const cta = CTA();
  const [menuOpen, setMenuOpen] = useState(false);

  // 3 态对应 UI：明亮(☀️) → 自动(🖥️带A徽标) → 暗黑(🌙)
  const buttonState = (() => {
    switch (darkMode as DarkMode) {
      case "light":
        return {
          Icon: Sun,
          aria: "当前为明亮模式 · 点击切换为自动跟随系统",
          title: "明亮模式（强制）· 点击切换为「自动跟随系统」",
          bg: S_.surface,
          color: S_.muted,
          border: `1px solid ${S_.borderMed}`,
          shadow: "none",
          badge: false,
        };
      case "auto":
        return {
          Icon: Monitor,
          aria: `当前为自动跟随系统（实际：${resolvedDark ? "暗黑" : "明亮"}）· 点击切换为暗黑模式`,
          title: `自动跟随系统 · 实际显示${resolvedDark ? "暗黑" : "明亮"} · 点击切换为「强制暗黑」`,
          bg: `linear-gradient(135deg, ${S_.borderMed} 0%, ${S_.accentMid} 50%, ${S_.border} 100%)`,
          color: S_.text,
          border: `1px solid ${S_.primaryMid}`,
          shadow: S_.accentGlow,
          badge: true,
        };
      case "dark":
      default:
        return {
          Icon: Moon,
          aria: "当前为暗黑模式 · 点击切换为明亮模式",
          title: "暗黑模式（强制）· 点击切换为「强制明亮」",
          bg: getTheme(themeId).gradient,
          color: activePalette.onPrimary,
          border: "1px solid transparent",
          shadow: S_.shadow,
          badge: false,
        };
    }
  })();
  const { Icon } = buttonState;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-colors"
      style={{ background: S_.glass, backdropFilter: "blur(14px)", borderBottom: `1px solid ${S_.glassBorder}` }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ background: S_.primary, borderRadius: "10px", boxShadow: S_.accentGlow }}
          >
            <Zap size={17} style={{ color: cta.text }} />
          </div>
          <span className="font-black text-xl" style={{ color: S_.text, fontFamily: "monospace", letterSpacing: "0.02em" }}>
            {PRODUCT.name}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 font-mono font-bold"
            style={{
              background: S_.primaryLight,
              color: S_.primaryDark,
              borderRadius: "6px",
              border: `1px solid ${S_.primaryMid}`,
            }}
          >
            AI · 私域云 · 8 模块
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className="text-sm font-mono transition-colors"
              style={{ color: S_.textSec }}
              onMouseEnter={(e) => (e.currentTarget.style.color = S_.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = S_.textSec)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* ── 暗黑模式开关（3 态：明亮 ⇄ 自动 ⇄ 暗黑） ──────────────── */}
          <button
            type="button"
            aria-label={buttonState.aria}
            title={buttonState.title}
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5 relative"
            style={{
              background: buttonState.bg,
              color: buttonState.color,
              border: buttonState.border,
              borderRadius: S_.radiusSm,
              boxShadow: buttonState.shadow,
              backdropFilter: "blur(10px)",
            }}
          >
            <Icon size={15} />
            {buttonState.badge && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center font-black"
                style={{
                  background: S_.primary,
                  color: activePalette.onPrimary,
                  fontSize: 9,
                  lineHeight: 1,
                  borderRadius: 999,
                  border: `1.5px solid ${S_.surface}`,
                  fontFamily: "monospace",
                }}
              >A</span>
            )}
          </button>
          <button
            className="text-sm px-4 py-2 font-mono transition-all"
            style={{ color: S_.textSec, borderRadius: S_.radiusSm, background: "transparent", border: `1px solid ${S_.borderMed}` }}
          >
            登录
          </button>
          <button
            className="text-sm px-5 py-2 font-bold font-mono transition-all"
            style={{ background: cta.bg, color: cta.text, borderRadius: S_.radiusSm, boxShadow: cta.ring }}
            onClick={onEnterApp}
            onMouseEnter={(e) => (e.currentTarget.style.background = cta.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = cta.bg)}
          >
            立即进入 →
          </button>
          <button
            className="md:hidden"
            style={{ color: S_.textSec }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t flex flex-col gap-2 p-4"
          style={{ background: S_.surface, borderColor: S_.border }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className="text-left py-2 px-3 font-mono text-sm"
              style={{ color: S_.textSec, borderRadius: S_.radiusSm }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────── HeroSection ─────────────────────────── */
function HeroSection({ onEnterApp }: { onEnterApp: () => void }) {
  useThemeSingleton();
  const S_ = S;
  const cta = CTA();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3200);
    return () => clearInterval(t);
  }, []);

  const sidebar = ["账号资产", "订单", "社群", "审批", "工具", "数据", "主理人", "会员小程序"];
  const kpiCards = [
    { label: "今日新增用户", value: "428" },
    { label: "账号健康度", value: "94%" },
    { label: "审批 SLA", value: "19min" },
    { label: "本月营收", value: "¥51.6万" },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background: `linear-gradient(160deg, ${S_.bg} 0%, ${S_.surface} 50%, ${S_.bg} 100%)`,
      }}
    >
      {/* 主题色 辉光 / 网格 */}
      <div
        className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${S_.primaryMid}, transparent 70%)`, filter: "blur(120px)", opacity: 0.9 }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${S_.accentMid}, transparent 70%)`, filter: "blur(140px)", opacity: 0.8 }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${S_.primary} 1px, transparent 1px), linear-gradient(90deg, ${S_.primary} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
        <div className="text-center mb-10 lg:mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8"
            style={{
              background: S_.surface,
              border: `1px solid ${S_.primaryMid}`,
              borderRadius: S_.radiusSm,
              boxShadow: S_.shadow,
            }}
          >
            <Sparkles size={13} style={{ color: S_.primary }} />
            <span className="text-sm font-bold font-mono" style={{ color: S_.primaryDark }}>
              新一代 私域全栈运营平台 · 账号 5 阶段生命周期 · 8 大模块 · AI 驱动
            </span>
            <div className="w-2 h-2 animate-pulse ml-1" style={{ background: S_.accent, borderRadius: "50%", boxShadow: S_.accentGlow }} />
          </div>

          <h1
            className="font-black leading-[1.08] mb-6"
            style={{ fontSize: "clamp(36px, 5.2vw, 76px)", color: S_.text, letterSpacing: "-0.03em", fontFamily: "monospace" }}
          >
            私域的 <span style={{ color: S_.primary }}>脏活 · 累活 · 操心活</span>
            <br />
            <span style={{ background: `linear-gradient(135deg, ${S_.primary} 0%, ${S_.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              交给聚域 + AI 来做
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-mono"
            style={{ color: S_.textSec }}
          >
            从「注册入库 → 养号风控 → 分配到项目 → 发放到人 → 审批交接 → 归档停用」6 步打通账号生命链；
            社群、订单、审批、工具、数据、主理人、小程序 8 大模块一站搞定；
            5 套潮系主题 + 明暗双模式，员工爱用。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              className="flex items-center gap-2 px-8 py-4 text-base font-black font-mono"
              style={{ background: cta.bg, color: cta.text, borderRadius: S_.radiusSm, boxShadow: `0 12px 40px ${S_.primaryMid}` }}
              onClick={onEnterApp}
              onMouseEnter={(e) => (e.currentTarget.style.background = cta.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = cta.bg)}
            >
              <Rocket size={18} /> 立即体验后台
              <ArrowRight size={18} />
            </button>
            <button
              className="flex items-center gap-2 px-8 py-4 text-base font-bold font-mono"
              style={{
                background: S_.surface,
                border: `1px solid ${S_.borderMed}`,
                color: S_.text,
                borderRadius: S_.radiusSm,
              }}
            >
              <Play size={16} /> 观看 3 分钟演示
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["✅ 14 天免费试用", "✅ 不用绑信用卡", "✅ 30 天不满意退款", "✅ 8 大模块全开放"].map((t) => (
              <p key={t} className="text-sm font-mono" style={{ color: S_.muted }}>
                {t}
              </p>
            ))}
          </div>
        </div>

        {/* 后台预览卡片（产品化 mock，颜色 100% 走主题） */}
        <div
          className="overflow-hidden max-w-6xl mx-auto"
          style={{
            border: `1px solid ${S_.borderMed}`,
            background: S_.surface,
            borderRadius: S_.radiusLg,
            boxShadow: S_.shadow,
          }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{ background: S_.bg, borderBottom: `1px solid ${S_.border}` }}
          >
            <div className="w-3 h-3" style={{ background: S_.danger, borderRadius: "50%" }} />
            <div className="w-3 h-3" style={{ background: S_.warning, borderRadius: "50%" }} />
            <div className="w-3 h-3 opacity-90" style={{ background: S_.success, borderRadius: "50%" }} />
            <div
              className="flex-1 mx-4 h-7 flex items-center px-3"
              style={{ background: S_.surface, border: `1px solid ${S_.border}`, borderRadius: "6px" }}
            >
              <span className="text-xs font-mono" style={{ color: S_.muted }}>
                app.juyu.shequn/accounts?view=pc
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1"
              style={{ background: S_.accentLight, borderRadius: "6px", border: `1px solid ${S_.accentMid}` }}
            >
              <div className="w-1.5 h-1.5 animate-pulse" style={{ background: S_.accent, borderRadius: "50%" }} />
              <span className="text-[10px] font-mono font-black" style={{ color: S_.primaryDark }}>
                AI · ONLINE
              </span>
            </div>
          </div>

          {/* 主体 2 列：侧边栏 + 主区域 */}
          <div className="flex" style={{ minHeight: "360px" }}>
            {/* 侧栏 */}
            <div
              className="w-52 flex-shrink-0 p-4"
              style={{ background: S_.bg, borderRight: `1px solid ${S_.border}` }}
            >
              <div className="flex items-center gap-2 mb-5 px-1">
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ background: S_.primary, borderRadius: "6px", boxShadow: S_.accentGlow }}
                >
                  <Zap size={12} style={{ color: cta.text }} />
                </div>
                <div>
                  <div className="text-[13px] font-black font-mono" style={{ color: S_.text }}>
                    聚域
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: S_.muted }}>
                    v2.6 · 8 模块
                  </div>
                </div>
              </div>
              {sidebar.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-2.5 py-2 mb-1 rounded-md"
                  style={{
                    background: i === 0 ? S_.primary : "transparent",
                    color: i === 0 ? cta.text : S_.textSec,
                    borderRadius: S_.radiusSm,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5"
                    style={{
                      background: i === 0 ? cta.text : S_.accent,
                      borderRadius: "50%",
                      opacity: i === 0 ? 1 : 0.5,
                    }}
                  />
                  <span className="text-xs font-mono font-semibold">{item}</span>
                </div>
              ))}

              <div
                className="mt-4 p-2.5"
                style={{
                  background: S_.accentLight,
                  border: `1px solid ${S_.accentMid}`,
                  borderRadius: S_.radiusSm,
                }}
              >
                <div
                  className="text-[9px] font-mono font-black mb-1.5 flex items-center gap-1"
                  style={{ color: S_.primaryDark, letterSpacing: "0.08em" }}
                >
                  <Brain size={9} /> AI 引擎
                </div>
                <div
                  className="text-[10px] font-mono leading-relaxed"
                  style={{ color: S_.primaryDark }}
                >
                  {floatingDecisions[tick % floatingDecisions.length]}
                </div>
              </div>
            </div>

            {/* 主区域 */}
            <div className="flex-1 p-4 flex flex-col gap-3" style={{ background: S_.bg }}>
              {/* 4 KPI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {kpiCards.map((c) => (
                  <div
                    key={c.label}
                    className="p-3"
                    style={{
                      background: S_.surface,
                      border: `1px solid ${S_.borderMed}`,
                      borderRadius: S_.radius,
                    }}
                  >
                    <div
                      className="mb-1 font-mono"
                      style={{ color: S_.muted, fontSize: "10px" }}
                    >
                      {c.label}
                    </div>
                    <div className="text-xl font-black font-mono" style={{ color: S_.primary }}>
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* 图表 2 列 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                {/* 用户增长柱 */}
                <div
                  className="col-span-2 p-3 flex flex-col"
                  style={{
                    background: S_.surface,
                    border: `1px solid ${S_.borderMed}`,
                    height: "130px",
                    borderRadius: S_.radius,
                  }}
                >
                  <div
                    className="mb-2 font-mono flex items-center gap-1"
                    style={{ color: S_.textSec, fontSize: "10px" }}
                  >
                    <Activity size={9} style={{ color: S_.primary }} /> 用户增长趋势 · 近 10 天
                  </div>
                  <div className="flex items-end gap-1.5 flex-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const h = 20 + (i * 7 + ((i * i) % 11)) % 75;
                      return (
                        <div
                          key={i}
                          className="flex-1 transition-colors"
                          style={{
                            height: `${h}%`,
                            background: i === 9 ? S_.primary : `${S_.accentLight}`,
                            borderRadius: "3px 3px 0 0",
                            borderTop: i === 9 ? `2px solid ${S_.accent}` : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 城市分布 */}
                <div
                  className="p-3"
                  style={{
                    background: S_.surface,
                    border: `1px solid ${S_.borderMed}`,
                    height: "130px",
                    borderRadius: S_.radius,
                  }}
                >
                  <div
                    className="mb-2 font-mono flex items-center gap-1"
                    style={{ color: S_.textSec, fontSize: "10px" }}
                  >
                    <MapPin size={9} style={{ color: S_.accent }} /> 城市分布 TOP 5
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { n: "上海", p: 92 },
                      { n: "杭州", p: 68 },
                      { n: "深圳", p: 54 },
                      { n: "广州", p: 41 },
                    ].map((c) => (
                      <div key={c.n}>
                        <div
                          className="flex justify-between mb-0.5 font-mono"
                          style={{ color: S_.textSec, fontSize: "9px" }}
                        >
                          <span>{c.n}</span>
                          <span>{c.p}%</span>
                        </div>
                        <div
                          className="h-1.5 w-full overflow-hidden"
                          style={{ background: S_.mutedLight, borderRadius: "4px" }}
                        >
                          <div
                            className="h-full"
                            style={{
                              width: `${c.p}%`,
                              background: `linear-gradient(90deg, ${S_.primary}, ${S_.accent})`,
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 风险事件流 */}
              <div
                className="p-3"
                style={{
                  background: S_.surface,
                  border: `1px solid ${S_.borderMed}`,
                  borderRadius: S_.radius,
                }}
              >
                <div
                  className="flex items-center gap-1.5 mb-2 font-mono"
                  style={{ color: S_.textSec, fontSize: "10px" }}
                >
                  <Brain size={9} style={{ color: S_.primary }} />
                  <span className="font-black">AI 今日风险流</span>
                  <RefreshCw size={8} style={{ color: S_.muted, marginLeft: 4 }} />
                  <div
                    className="w-1.5 h-1.5 animate-pulse ml-auto"
                    style={{ background: S_.accent, borderRadius: "50%" }}
                  />
                </div>
                <div className="flex items-stretch gap-1.5 overflow-x-auto">
                  {[
                    { l: "high", t: "WX-3342 高风险" },
                    { l: "mid", t: "群 VIP-13 容量 95%" },
                    { l: "low", t: "申领 3 号已通过" },
                    { l: "mid", t: "抖音渠道 ROI↓18%" },
                    { l: "low", t: "工具#12 已回收" },
                    { l: "high", t: "陈× 交接 8 号" },
                    { l: "low", t: "养号 12 号出关" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-[96px] text-[10px] px-2 py-1.5 font-mono whitespace-nowrap"
                      style={{
                        background:
                          s.l === "high"
                            ? S_.dangerBg
                            : s.l === "mid"
                            ? S_.warningBg
                            : S_.successBg,
                        color:
                          s.l === "high"
                            ? S_.danger
                            : s.l === "mid"
                            ? S_.warning
                            : S_.success,
                        borderRadius: "6px",
                        border: `1px solid ${
                          s.l === "high"
                            ? "rgba(220,38,38,0.25)"
                            : s.l === "mid"
                            ? S_.accentMid
                            : "rgba(22,163,74,0.22)"
                        }`,
                      }}
                    >
                      {s.t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 两侧浮动信息胶囊 */}
        <div
          className="absolute -left-8 top-1/3 px-3 py-2 shadow-xl hidden md:flex items-center gap-2"
          style={{
            background: S_.surface,
            border: `1px solid ${S_.primaryMid}`,
            borderRadius: "10px",
            boxShadow: S_.shadow,
          }}
        >
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{ background: S_.primary, borderRadius: "6px" }}
          >
            <Brain size={12} style={{ color: cta.text }} />
          </div>
          <div className="text-xs leading-tight">
            <div className="font-black font-mono" style={{ color: S_.primaryDark }}>
              AI 决策
            </div>
            <div className="font-mono" style={{ color: S_.muted }}>
              累计处理 12,481 次
            </div>
          </div>
        </div>

        <div
          className="absolute -right-8 bottom-1/3 px-3 py-2 shadow-xl hidden md:flex items-center gap-2"
          style={{
            background: S_.surface,
            border: `1px solid ${S_.accentMid}`,
            borderRadius: "10px",
            boxShadow: S_.shadow,
          }}
        >
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{ background: S_.accentLight, borderRadius: "6px" }}
          >
            <Coins size={12} style={{ color: S_.primary }} />
          </div>
          <div className="text-xs leading-tight">
            <div className="font-black font-mono" style={{ color: S_.primaryDark }}>
              本月营收
            </div>
            <div className="font-black font-mono" style={{ color: S_.primary }}>
              ¥51.6 万 ↑13%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── StatsSection ─────────────────────────── */
function StatsSection() {
  useThemeSingleton();
  const S_ = S;
  return (
    <section
      className="py-16 border-y"
      style={{ background: S_.bg, borderColor: S_.border }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="font-black mb-1.5 font-mono"
                style={{
                  fontSize: "clamp(24px, 3vw, 40px)",
                  background: `linear-gradient(135deg, ${S_.primary}, ${S_.accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <div className="text-sm font-mono" style={{ color: S_.textSec }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── AISection ─────────────────────────── */
function AISection() {
  useThemeSingleton();
  const S_ = S;
  const cta = CTA();
  const [active, setActive] = useState("assign");
  const [lineIdx, setLineIdx] = useState(0);

  const activeCap = aiCapabilities.find((c) => c.id === active) || aiCapabilities[0];

  useEffect(() => {
    setLineIdx(0);
    const lines = activeCap.terminalLines;
    const t = setInterval(() => setLineIdx((x) => (x + 1 >= lines.length ? lines.length : x + 1)), 500);
    return () => clearInterval(t);
  }, [active, activeCap.terminalLines.length]);

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${S_.bg} 0%, ${S_.surface} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${S_.primary} 1px, transparent 1px), linear-gradient(90deg, ${S_.primary} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-black font-mono"
            style={{
              background: S_.surface,
              color: S_.primaryDark,
              border: `1px solid ${S_.primaryMid}`,
              borderRadius: S_.radiusSm,
              fontSize: "12px",
            }}
          >
            <Brain size={13} style={{ color: S_.primary }} /> AI CORE ENGINE · 四大智能引擎
          </div>
          <h2
            className="font-black mb-4 font-mono"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              color: S_.text,
            }}
          >
            AI 是聚域的
            <span style={{ color: S_.primary }}>核心驱动力</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-mono" style={{ color: S_.textSec }}>
            不是口号上的 AI：4 个可落地引擎真实跑在每一个业务节点上，24h 替你分群、风控、审批、出洞察。
          </p>
        </div>

        {/* 亮点 4 数 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {aiCapabilities.map((m) => (
            <div
              key={m.id}
              className="p-5 text-center"
              style={{
                background: S_.accentLight,
                border: `1px solid ${S_.accentMid}`,
                borderRadius: S_.radius,
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mx-auto mb-3"
                style={{ background: S_.primaryLight, borderRadius: S_.radiusSm }}
              >
                <m.icon size={18} style={{ color: S_.primary }} />
              </div>
              <div
                className="font-black font-mono mb-1"
                style={{
                  color: S_.primary,
                  fontSize: "22px",
                  background: `linear-gradient(135deg, ${S_.primary}, ${S_.accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {m.improvement}
              </div>
              <div className="text-xs font-mono" style={{ color: S_.textSec }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* 能力选择 + 终端 */}
        <div className="grid md:grid-cols-[320px_1fr] gap-5">
          <div className="space-y-2">
            <div
              className="text-xs font-mono mb-3 font-black"
              style={{ color: S_.primaryDark, letterSpacing: "0.1em" }}
            >
              // 选择 AI 引擎
            </div>
            {aiCapabilities.map((cap) => {
              const isActive = cap.id === active;
              return (
                <button
                  key={cap.id}
                  className="w-full text-left p-4 transition-all"
                  style={{
                    background: isActive ? S_.primaryLight : S_.surface,
                    border: `1px solid ${isActive ? S_.primary : S_.borderMed}`,
                    borderRadius: S_.radius,
                    cursor: "pointer",
                    boxShadow: isActive ? S_.accentGlow : "none",
                  }}
                  onClick={() => setActive(cap.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isActive ? S_.primary : S_.accentLight,
                        borderRadius: S_.radiusSm,
                      }}
                    >
                      <cap.icon size={16} style={{ color: isActive ? cta.text : S_.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-black font-mono"
                        style={{ color: isActive ? S_.primaryDark : S_.text }}
                      >
                        {cap.label}
                      </div>
                      <div
                        className="text-[10px] font-mono"
                        style={{ color: S_.muted, letterSpacing: "0.1em" }}
                      >
                        {cap.badge}
                      </div>
                    </div>
                    {isActive && <ChevronRight size={14} style={{ color: S_.primary }} />}
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 line-through"
                      style={{
                        background: S_.dangerBg,
                        color: S_.danger,
                        borderRadius: "4px",
                        textDecoration: "line-through",
                      }}
                    >
                      {cap.before}
                    </span>
                    <ArrowRight size={10} style={{ color: S_.muted }} />
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 font-black"
                      style={{
                        background: S_.successBg,
                        color: S_.success,
                        borderRadius: "4px",
                      }}
                    >
                      {cap.after}
                    </span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 font-black ml-auto"
                      style={{
                        background: `linear-gradient(135deg, ${S_.primaryLight}, ${S_.accentLight})`,
                        color: S_.primaryDark,
                        borderRadius: "4px",
                      }}
                    >
                      {cap.improvement}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="h-full font-mono"
            style={{
              background: S_.surface,
              border: `1px solid ${S_.borderMed}`,
              borderRadius: S_.radiusLg,
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3.5"
              style={{ background: S_.bg, borderBottom: `1px solid ${S_.border}` }}
            >
              <div className="w-2.5 h-2.5" style={{ background: S_.danger, borderRadius: "50%" }} />
              <div className="w-2.5 h-2.5" style={{ background: S_.warning, borderRadius: "50%" }} />
              <div className="w-2.5 h-2.5 opacity-80" style={{ background: S_.success, borderRadius: "50%" }} />
              <div
                className="flex-1 mx-3 px-3 py-1 flex items-center justify-between"
                style={{ background: S_.surface, border: `1px solid ${S_.border}`, borderRadius: "4px" }}
              >
                <span className="text-xs" style={{ color: S_.muted }}>
                  ai.juyu.engine/{activeCap.id}
                </span>
                <Cpu size={10} style={{ color: S_.primary }} />
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1"
                style={{ background: S_.primaryLight, borderRadius: "4px", border: `1px solid ${S_.primaryMid}` }}
              >
                <div className="w-1.5 h-1.5 animate-pulse" style={{ background: S_.primary, borderRadius: "50%" }} />
                <span className="text-[10px] font-black" style={{ color: S_.primaryDark }}>
                  RUNNING
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-0.5" style={{ minHeight: "340px" }}>
              {activeCap.terminalLines.map((line, i) => {
                const visible = i < lineIdx;
                const color =
                  line.type === "comment"
                    ? S_.muted
                    : line.type === "success"
                    ? S_.success
                    : line.type === "warn"
                    ? S_.warning
                    : line.type === "blank"
                    ? "transparent"
                    : S_.text;
                return (
                  <div
                    key={`${activeCap.id}-${i}`}
                    className="font-mono text-sm transition-all"
                    style={{
                      color,
                      opacity: visible ? 1 : 0,
                      transform: visible ? "none" : "translateX(-6px)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                      minHeight: "20px",
                      paddingLeft: line.text.startsWith("//") ? 0 : line.type === "code" ? 16 : 0,
                    }}
                  >
                    {line.type === "success" && <span style={{ color: S_.success, marginRight: 6 }}>→</span>}
                    {line.type === "warn" && <span style={{ color: S_.warning, marginRight: 6 }}>!</span>}
                    {line.type === "comment" && <span style={{ color: S_.muted, marginRight: 6 }}>//</span>}
                    {line.text.replace(/^\/\/\s?/, "").replace(/^→\s?/, "").replace(/^!\s?/, "")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PainPointsSection ─────────────────────────── */
function PainPointsSection() {
  useThemeSingleton();
  const S_ = S;
  return (
    <section className="py-24" style={{ background: S_.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-black font-mono"
            style={{
              background: S_.dangerBg,
              color: S_.danger,
              border: `1px solid rgba(220,38,38,0.3)`,
              borderRadius: S_.radiusSm,
              fontSize: "12px",
            }}
          >
            <AlertTriangle size={13} /> 私域运营 6 大普遍痛点
          </div>
          <h2
            className="font-black mb-4 font-mono"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              color: S_.text,
            }}
          >
            你在私域里遇到的<span style={{ color: S_.danger }}>每一件烦心事</span>
            <br />
            我们都在代码里给它写了个解决方案
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {painPoints.map((p) => (
            <div
              key={p.title}
              className="p-6"
              style={{
                background: S_.surface,
                border: `1px solid ${S_.borderMed}`,
                borderRadius: S_.radius,
              }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center mb-4 text-2xl"
                style={{ background: S_.accentLight, borderRadius: S_.radiusSm }}
              >
                {p.icon}
              </div>
              <h3 className="text-lg font-black mb-2" style={{ color: S_.text }}>
                {p.title}
              </h3>
              <p className="text-sm font-mono leading-relaxed" style={{ color: S_.textSec }}>
                {p.desc}
              </p>
              <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: `1px dashed ${S_.borderMed}` }}>
                <div
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                  style={{ background: S_.successBg, borderRadius: "50%" }}
                >
                  <CheckCircle size={12} style={{ color: S_.success }} />
                </div>
                <span className="text-xs font-mono font-black" style={{ color: S_.success }}>
                  聚域已解决 · 在对应模块有专属处理流程
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FeaturesSection ─────────────────────────── */
function FeaturesSection() {
  useThemeSingleton();
  const S_ = S;
  const cta = CTA();
  return (
    <section className="py-24" style={{ background: S_.surface }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-black font-mono"
            style={{
              background: S_.primaryLight,
              color: S_.primaryDark,
              border: `1px solid ${S_.primaryMid}`,
              borderRadius: S_.radiusSm,
              fontSize: "12px",
            }}
          >
            <Layers size={13} /> 8 大模块 · 全栈闭环
          </div>
          <h2
            className="font-black mb-4 font-mono"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              color: S_.text,
            }}
          >
            一套系统 = <span style={{ color: S_.primary }}>8 个后台 + 1 个小程序</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-mono" style={{ color: S_.textSec }}>
            不用再 3 套系统、4 个 SASS、5 张 Excel 互相导。聚域 8 个模块一张表、一套权限、一条审计链路，全打通。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {coreFeatures.map((f, i) => (
            <div
              key={f.title}
              className="p-7 flex gap-5"
              style={{
                background: S_.bg,
                border: `1px solid ${S_.borderMed}`,
                borderRadius: S_.radiusLg,
              }}
            >
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${S_.primaryLight}, ${S_.accentLight})`,
                    border: `1px solid ${S_.primaryMid}`,
                    borderRadius: S_.radius,
                    boxShadow: S_.accentGlow,
                  }}
                >
                  <f.icon size={22} style={{ color: S_.primary }} />
                </div>
                <div
                  className="w-8 h-8 flex items-center justify-center font-mono font-black text-xs"
                  style={{
                    background: S_.surface,
                    color: S_.primaryDark,
                    border: `1px solid ${S_.borderMed}`,
                    borderRadius: "50%",
                  }}
                >
                  0{i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black mb-2" style={{ color: S_.text }}>
                  {f.title}
                </h3>
                <p
                  className="text-sm font-mono mb-4 leading-relaxed"
                  style={{ color: S_.textSec }}
                >
                  {f.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono font-semibold px-2 py-1"
                      style={{
                        background: S_.surface,
                        color: S_.primaryDark,
                        border: `1px solid ${S_.primaryMid}`,
                        borderRadius: "6px",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 模块矩阵（8×能力标签网格） */}
        <div className="mt-14">
          <h3
            className="text-center font-black mb-8 font-mono"
            style={{ fontSize: "24px", color: S_.text }}
          >
            模块能力矩阵
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {modules.map((m) => (
              <div
                key={m.name}
                className="p-4"
                style={{
                  background: S_.bg,
                  border: `1px solid ${S_.borderMed}`,
                  borderRadius: S_.radius,
                }}
              >
                <div
                  className="text-sm font-black mb-3 font-mono flex items-center gap-2"
                  style={{ color: S_.primaryDark }}
                >
                  <Target size={13} /> {m.name}
                </div>
                <ul className="space-y-1.5">
                  {m.items.map((it) => (
                    <li
                      key={it}
                      className="text-xs font-mono flex items-start gap-2"
                      style={{ color: S_.textSec }}
                    >
                      <span style={{ color: S_.accent }}>◆</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── EcosystemSection ─────────────────────────── */
function EcosystemSection() {
  useThemeSingleton();
  const S_ = S;
  const cta = CTA();
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: S_.bg }}>
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${S_.primaryLight}, transparent 70%)`,
          opacity: 0.8,
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-black font-mono"
            style={{
              background: S_.accentLight,
              color: S_.primaryDark,
              border: `1px solid ${S_.accentMid}`,
              borderRadius: S_.radiusSm,
              fontSize: "12px",
            }}
          >
            <GitBranch size={13} /> 4 级业务架构
          </div>
          <h2
            className="font-black mb-4 font-mono"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              color: S_.text,
            }}
          >
            从 <span style={{ color: S_.primary }}>主理人</span> 到 <span style={{ color: S_.accent }}>一线运营</span>
            <br />
            每层都有对应工作台与结算
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.level}
              className="relative p-6 text-center"
              style={{
                background: `linear-gradient(180deg, ${S_.surface}, ${S_.bg})`,
                border: `1px solid ${S_.borderMed}`,
                borderRadius: S_.radiusLg,
              }}
            >
              <div
                className="inline-flex items-center justify-center font-black font-mono mb-3"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${S_.primary}, ${S_.accent})`,
                  color: cta.text,
                  fontSize: 22,
                  boxShadow: S_.accentGlow,
                }}
              >
                L{t.level}
              </div>
              <div className="font-black mb-1.5" style={{ fontSize: 20, color: S_.text }}>
                {t.label}
              </div>
              <div className="text-sm font-mono" style={{ color: S_.textSec }}>
                {t.desc}
              </div>
              {t.level < 4 && (
                <ChevronRight
                  className="hidden md:block absolute top-1/2 -right-[22px] -translate-y-1/2 z-10"
                  size={20}
                  style={{ color: S_.primary }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 行业 */}
        <div className="mt-20">
          <div
            className="text-center text-xs font-mono mb-6 tracking-[0.2em]"
            style={{ color: S_.muted }}
          >
            TRUSTED BY · 这些行业都在用聚域搭私域
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {industries.map((c) => (
              <div
                key={c}
                className="px-5 py-3 font-black font-mono text-sm"
                style={{
                  background: S_.surface,
                  border: `1px solid ${S_.borderMed}`,
                  borderRadius: S_.radiusSm,
                  color: S_.textSec,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── TestimonialsSection ─────────────────────────── */
function TestimonialsSection() {
  useThemeSingleton();
  const S_ = S;
  return (
    <section className="py-24" style={{ background: S_.surface }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-black font-mono"
            style={{
              background: S_.successBg,
              color: S_.success,
              border: `1px solid rgba(22,163,74,0.3)`,
              borderRadius: S_.radiusSm,
              fontSize: "12px",
            }}
          >
            <Star size={13} /> 真实客户反馈
          </div>
          <h2
            className="font-black mb-4 font-mono"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              color: S_.text,
            }}
          >
            用了 60 天的私域负责人怎么说？
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-7"
              style={{
                background: S_.bg,
                border: `1px solid ${S_.borderMed}`,
                borderRadius: S_.radiusLg,
              }}
            >
              <div className="flex items-center gap-1 mb-4" style={{ color: S_.warning }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={S_.warning} />
                ))}
              </div>
              <p
                className="text-sm font-mono leading-relaxed mb-6"
                style={{ color: S_.text }}
              >
                “{t.content}”
              </p>
              <div
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: `1px solid ${S_.border}` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center font-black font-mono"
                  style={{
                    background: `linear-gradient(135deg, ${S_.primary}, ${S_.accent})`,
                    color: S_.onPrimary,
                    borderRadius: "50%",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-black" style={{ color: S_.text }}>
                    {t.name}
                  </div>
                  <div className="text-xs font-mono" style={{ color: S_.muted }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTASection ─────────────────────────── */
function CTASection({ onEnterApp }: { onEnterApp: () => void }) {
  useThemeSingleton();
  const S_ = S;
  const cta = CTA();
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: S_.bg }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${S_.primaryMid}, transparent 60%)`,
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 70%, ${S_.accentMid}, transparent 55%)`,
          opacity: 0.55,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div
          className="p-10 md:p-16 text-center"
          style={{
            background: S_.glass,
            backdropFilter: "blur(18px)",
            border: `1px solid ${S_.glassBorder}`,
            borderRadius: "32px",
            boxShadow: S_.shadow,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Palette size={18} style={{ color: S_.primary }} />
            <span
              className="text-sm font-black font-mono"
              style={{ color: S_.primaryDark }}
            >
              5 套潮系主题 · 明暗双模式 · 员工爱用
            </span>
          </div>
          <h2
            className="font-black mb-5 font-mono"
            style={{
              fontSize: "clamp(32px, 5vw, 62px)",
              letterSpacing: "-0.03em",
              color: S_.text,
            }}
          >
            现在就启动你的
            <span
              style={{
                background: `linear-gradient(135deg, ${S_.primary} 0%, ${S_.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              私域全栈平台
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto mb-8 font-mono leading-relaxed"
            style={{ color: S_.textSec }}
          >
            账号 5 阶段 · 8 大模块 · AI 4 引擎 · 会员小程序 · 4 级业务架构，都准备好了。
            14 天免费、全模块开放、不用绑卡。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              className="flex items-center gap-2 px-10 py-4 text-lg font-black font-mono"
              style={{
                background: cta.bg,
                color: cta.text,
                borderRadius: S_.radius,
                boxShadow: `0 16px 48px ${S_.primaryMid}`,
              }}
              onClick={onEnterApp}
              onMouseEnter={(e) => (e.currentTarget.style.background = cta.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = cta.bg)}
            >
              <Rocket size={20} /> 免费进入后台
              <ArrowRight size={20} />
            </button>
            <button
              className="flex items-center gap-2 px-10 py-4 text-lg font-bold font-mono"
              style={{
                background: S_.surface,
                border: `1px solid ${S_.borderMed}`,
                color: S_.text,
                borderRadius: S_.radius,
              }}
            >
              <Settings size={18} /> 预约演示
            </button>
          </div>
          <div
            className="text-xs font-mono flex items-center justify-center gap-5 flex-wrap"
            style={{ color: S_.muted }}
          >
            <span>
              <CheckCircle size={12} style={{ color: S_.success }} /> 30 分钟完成导入上线
            </span>
            <span>
              <CheckCircle size={12} style={{ color: S_.success }} /> 企业数据独立部署可选
            </span>
            <span>
              <CheckCircle size={12} style={{ color: S_.success }} /> 7×24h 专属客服对接
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Footer ─────────────────────────── */
function Footer() {
  useThemeSingleton();
  const S_ = S;
  const cols: { t: string; l: string[] }[] = [
    { t: "产品", l: ["账号资产中心", "订单管理", "社群管理", "审批中心", "工具中心"] },
    { t: "平台", l: ["数据中心", "主理人公社", "会员小程序", "AI 引擎", "开放 API"] },
    { t: "解决方案", l: ["教培私域", "健康产康", "城市合伙人", "代理分销", "新消费品牌"] },
    { t: "公司", l: ["关于我们", "客户案例", "加入我们", "商务合作", "服务条款"] },
  ];
  return (
    <footer className="py-16" style={{ background: S_.surface, borderTop: `1px solid ${S_.border}` }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-6 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ background: S_.primary, borderRadius: "10px" }}
              >
                <Zap size={18} style={{ color: S_.onPrimary }} />
              </div>
              <div>
                <div
                  className="font-black text-xl"
                  style={{ color: S_.text, fontFamily: "monospace" }}
                >
                  {PRODUCT.name}
                </div>
                <div className="text-xs font-mono" style={{ color: S_.muted }}>
                  {PRODUCT.tagline}
                </div>
              </div>
            </div>
            <p className="text-sm font-mono leading-relaxed mb-4" style={{ color: S_.textSec }}>
              {PRODUCT.desc}
            </p>
            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: S_.muted }}
            >
              <Palette size={12} style={{ color: S_.primary }} />
              系统内置 5 套潮系主题 · 支持暗黑模式独立切换
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.t}>
              <div
                className="text-sm font-black mb-4 font-mono"
                style={{ color: S_.text }}
              >
                {c.t}
              </div>
              <ul className="space-y-2.5">
                {c.l.map((it) => (
                  <li key={it}>
                    <a
                      className="text-sm font-mono transition-colors"
                      style={{ color: S_.textSec }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = S_.primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = S_.textSec)}
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${S_.border}` }}
        >
          <div className="text-xs font-mono" style={{ color: S_.muted }}>
            © 2026 {PRODUCT.name}（JuYu）· 聚域私域云 · 沪ICP备XXXXXX号
          </div>
          <div className="flex items-center gap-4 text-xs font-mono" style={{ color: S_.muted }}>
            <FileSpreadsheet size={12} /> 隐私政策
            <span>·</span>
            <Shield size={12} /> 服务 SLA
            <span>·</span>
            <Settings size={12} /> 安全合规
          </div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 主组件：每 10s 触发一次 useThemeSingleton，保证 rerender
//   （真实触发 rerender 由 theme.tsx 的 pub/sub 机制驱动）
// ══════════════════════════════════════════════════════════════════════════════
export default function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  useThemeSingleton();
  const S_ = S;
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: S_.bg,
        color: S_.text,
        transition: "background-color 300ms ease, color 200ms ease",
      }}
    >
      <NavBar onEnterApp={onEnterApp} />
      <HeroSection onEnterApp={onEnterApp} />
      <StatsSection />
      <AISection />
      <PainPointsSection />
      <FeaturesSection />
      <EcosystemSection />
      <TestimonialsSection />
      <CTASection onEnterApp={onEnterApp} />
      <Footer />
    </div>
  );
}
