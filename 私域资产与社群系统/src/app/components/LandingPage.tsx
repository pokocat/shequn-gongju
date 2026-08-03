import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Zap, Users, MessageCircle, Database, Shield, BarChart2, Radio, Star, Play, TrendingUp, Menu, X, Brain, Cpu, GitBranch, AlertTriangle, Target, Layers, ChevronRight, Activity } from "lucide-react";

// ─── 产品信息 ─────────────────────────────────────────────────
const PRODUCT = {
  name: "聚域",
  nameEn: "JuYu",
  tagline: "AI驱动 · 私域资产 · 社群运营",
  desc: "新一代 AI 驱动的私域智能运营平台。从账号资产到智能分群，从风险预警到自动推送，让 AI 替你做决策、做运营。",
};

const stats = [
  { value: "2,800+", label: "服务企业客户" },
  { value: "1,200万", label: "私域用户管理" },
  { value: "98.6%", label: "客户续约率" },
  { value: "47个", label: "城市分站落地" },
];

const painPoints = [
  { icon: "📱", title: "账号太多，难以管理", desc: "手机号、微信号、邮箱、公众号、抖音、小红书分散管理，时间久了不知道谁注册了什么" },
  { icon: "🔀", title: "微信号领用混乱", desc: "不同微信号用于不同项目，没有记录谁在用、用于什么、离职后如何交接" },
  { icon: "👥", title: "群和人员关系不清", desc: "一个微信管多个群，群服务谁、群容量多少、群码是否过期，一片混乱" },
  { icon: "🤖", title: "新用户分群靠人工", desc: "用户进来后按城市、身份、群容量手动分配，效率低且容易出错、重复" },
  { icon: "📊", title: "用户服务记录分散", desc: "手机号、微信、订单、工单、群信息各自独立，客服无法快速了解用户全貌" },
  { icon: "⚠️", title: "人员交接风险高", desc: "账号和群跟某个人绑定，人员离职时如没有交接流程，容易导致客户流失" },
];

const coreFeatures = [
  { icon: Database,      bg: "#ccff00", title: "账号资产中心",           desc: "统一管理手机号、微信号、邮箱及各平台媒体账号，支持身份证绑定、分配记录、证件上传" },
  { icon: MessageCircle, bg: "#ccff00", title: "企业微信 + 个人微信双轨", desc: "个人微信负责私域加人，企业微信负责服务管理，双账号同步添加用户" },
  { icon: Users,         bg: "#ccff00", title: "微信群智能管理",          desc: "群码刷新、满群预警、备用群管理、群活跃度监控，一览掌握所有群组状态" },
  { icon: Zap,           bg: "#ccff00", title: "AI 群分配引擎",           desc: "根据用户城市、身份、推荐关系、群容量自动推荐最优群组，支持人工调整" },
  { icon: Radio,         bg: "#ccff00", title: "全渠道流量绑定",          desc: "绑定抖音、小红书、微信小店、公众号等渠道，配置自动分配规则，追踪流量来源" },
  { icon: BarChart2,     bg: "#ccff00", title: "数据报表中心",            desc: "多维度数据看板，城市分析、渠道来源、项目报表、RFM用户分层，一目了然" },
  { icon: Shield,        bg: "#ccff00", title: "权限与交接管理",          desc: "角色权限矩阵、高风险操作审批、审计日志，人员变动时有序完成账号交接" },
  { icon: TrendingUp,    bg: "#ccff00", title: "影响力与分销",            desc: "用户影响力排行、分销佣金自动计算、多级代理管理、提现审批一站完成" },
];

const tiers = [
  { level: 1, label: "超级生态", bg: "rgba(204,255,0,0.12)", desc: "统管所有生态与资源" },
  { level: 2, label: "生态",     bg: "rgba(204,255,0,0.08)", desc: "垂直领域闭环体系" },
  { level: 3, label: "SaaS平台", bg: "rgba(204,255,0,0.05)", desc: "私域工具能力层" },
  { level: 4, label: "平台项目", bg: "rgba(204,255,0,0.03)", desc: "具体运营项目单元" },
];

const modules = [
  { name: "后台总览", items: ["KPI指标", "AI运营建议", "今日待办", "风险提醒"] },
  { name: "账号资产", items: ["手机号管理", "微信号领用", "媒体账号", "身份证上传"] },
  { name: "社群管理", items: ["群容量监控", "群码管理", "成员名单", "新建微信群"] },
  { name: "用户操作台", items: ["360度用户视图", "订单/工单", "群组分配", "服务记录"] },
  { name: "渠道流量", items: ["渠道绑定", "分配规则", "流量日志", "转化漏斗"] },
  { name: "数据报表", items: ["营收趋势", "城市分析", "渠道来源", "用户分层"] },
];

const clients = ["教育行业", "健康产业", "电商品牌", "代理分销", "知识付费", "城市合伙人"];

const testimonials = [
  { name: "王总", role: "某教育科技公司 · CEO", avatar: "王", content: "用聚域之前，我们的微信号、群和客服是三套系统，人员交接一次就要损失几十个客户。现在全部打通，离职交接30分钟搞定。" },
  { name: "林总监", role: "健康品牌 · 私域运营总监", avatar: "林", content: "AI智能分群功能帮我们把人工分配时间从每天2小时降到了5分钟。现在8个城市、34个群，一个人管得过来。" },
  { name: "赵经理", role: "连锁代理商 · 区域负责人", avatar: "赵", content: "AI风险预警太实用了，系统自动识别账号异常，比人工巡查还快，再也不怕账号出问题被动。" },
];

// ─── AI能力场景数据 ───────────────────────────────────────────
const aiCapabilities = [
  {
    id: "assign",
    icon: GitBranch,
    label: "AI 群分配引擎",
    badge: "ROUTING ENGINE",
    before: "每天人工分配2小时",
    after: "5分钟全部搞定",
    improvement: "效率提升 96%",
    color: "#ccff00",
    terminalLines: [
      { text: "// 新用户入库", type: "comment" },
      { text: 'user.city = "上海"', type: "code" },
      { text: 'user.identity = "VIP会员"', type: "code" },
      { text: 'user.source = "抖音-张老师"', type: "code" },
      { text: "", type: "blank" },
      { text: "// AI 分析最优群组", type: "comment" },
      { text: 'groups.filter(g => g.city === "上海")', type: "code" },
      { text: "  .filter(g => g.capacity < 480)", type: "code" },
      { text: "  .sort(by: matchScore desc)", type: "code" },
      { text: "", type: "blank" },
      { text: "✓ 推荐群：上海VIP服务群02", type: "success" },
      { text: "✓ 备选群：上海体验官群03", type: "success" },
      { text: "✓ 已自动通知：小红负责跟进", type: "success" },
    ],
  },
  {
    id: "risk",
    icon: AlertTriangle,
    label: "AI 风险预警",
    badge: "RISK DETECTION",
    before: "风险靠人工发现",
    after: "7×24小时自动监控",
    improvement: "预警响应提升 10×",
    color: "#ccff00",
    terminalLines: [
      { text: "// 实时账号健康扫描", type: "comment" },
      { text: 'scanning accounts... [68/68]', type: "code" },
      { text: "", type: "blank" },
      { text: "⚠ fengle_gz_01", type: "warn" },
      { text: "  last_login: 30天前", type: "warn" },
      { text: "  risk_level: HIGH", type: "warn" },
      { text: "", type: "blank" },
      { text: "⚠ 北京PRO群01", type: "warn" },
      { text: "  capacity: 487/500 (97.4%)", type: "warn" },
      { text: "  建议：立即建立备用群", type: "warn" },
      { text: "", type: "blank" },
      { text: "✓ 已发送预警给：运营负责人", type: "success" },
      { text: "✓ 工单已自动创建 #TK-2847", type: "success" },
    ],
  },
  {
    id: "rfm",
    icon: Target,
    label: "RFM 智能分层",
    badge: "USER SEGMENTATION",
    before: "用户标签靠人工打",
    after: "AI自动分层更新",
    improvement: "转化率提升 34%",
    color: "#ccff00",
    terminalLines: [
      { text: "// RFM 模型计算", type: "comment" },
      { text: "recency   × 0.35", type: "code" },
      { text: "frequency × 0.35", type: "code" },
      { text: "monetary  × 0.30", type: "code" },
      { text: "", type: "blank" },
      { text: "// 用户分层结果", type: "comment" },
      { text: '高价值客户    → "王牌会员" [284人]', type: "success" },
      { text: '潜力客户      → "成长之星" [612人]', type: "success" },
      { text: '流失风险客户  → "唤醒计划" [138人]', type: "warn" },
      { text: "", type: "blank" },
      { text: "// 自动触发推送任务", type: "comment" },
      { text: "PushTask.create({ segment: '唤醒计划' })", type: "code" },
      { text: "✓ 任务已创建，预计触达138人", type: "success" },
    ],
  },
  {
    id: "push",
    icon: Activity,
    label: "AI 智能推送",
    badge: "SMART PUSH",
    before: "群发靠手动逐个操作",
    after: "条件触发自动推送",
    improvement: "消息到达率 +62%",
    color: "#ccff00",
    terminalLines: [
      { text: "// 推送任务配置", type: "comment" },
      { text: 'task.name = "7日未购唤醒"', type: "code" },
      { text: 'task.trigger = "last_order > 7d"', type: "code" },
      { text: 'task.channel = ["微信群", "私聊"]', type: "code" },
      { text: "", type: "blank" },
      { text: "// AI 个性化生成", type: "comment" },
      { text: "message.personalize(user.name, user.city)", type: "code" },
      { text: "message.insert(coupon = '8折券')", type: "code" },
      { text: "", type: "blank" },
      { text: "// 执行报告", type: "comment" },
      { text: "✓ 发送：234人", type: "success" },
      { text: "✓ 阅读率：71.3%", type: "success" },
      { text: "✓ 转化：38单 / ¥26,400", type: "success" },
    ],
  },
];

const aiMetrics = [
  { label: "AI决策次数/天", value: "12,400+", icon: Brain },
  { label: "自动分群准确率", value: "99.2%", icon: Target },
  { label: "平均响应时间", value: "< 0.3s", icon: Cpu },
  { label: "风险事件拦截", value: "2,100+/月", icon: AlertTriangle },
];

// ─── 子组件 ───────────────────────────────────────────────────
function NavBar({ onEnterApp }: { onEnterApp: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ["AI 能力", "产品功能", "生态架构", "客户案例"];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(5,9,23,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(204,255,0,0.15)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: "#ccff00", borderRadius: "8px" }}>
            <Zap size={16} style={{ color: "#000" }} />
          </div>
          <span className="font-bold text-lg" style={{ color: "#fff", fontFamily: "monospace" }}>{PRODUCT.name}</span>
          <span className="text-xs px-2 py-0.5 font-mono font-bold" style={{ background: "#000", color: "#ccff00", borderRadius: "6px", border: "1px solid #ccff00" }}>AI · 私域云</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button key={item} className="text-sm font-mono transition-colors" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm px-4 py-2 font-mono transition-all" style={{ color: "rgba(255,255,255,0.7)", borderRadius: "8px" }}>登录</button>
          <button className="text-sm px-5 py-2 font-bold font-mono transition-all" style={{ background: "#ccff00", color: "#000", borderRadius: "8px" }} onClick={onEnterApp}>
            免费试用 <ArrowRight size={13} className="inline ml-1" />
          </button>
        </div>
        <button className="md:hidden" style={{ color: "rgba(255,255,255,0.7)" }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

function HeroSection({ onEnterApp }: { onEnterApp: () => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const floatingDecisions = [
    "AI → 上海VIP群02 ✓",
    "AI → 风险预警 #fengle ✓",
    "AI → 唤醒计划 推送 ✓",
    "AI → RFM 重算完成 ✓",
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16" style={{ background: "linear-gradient(160deg, #050917 0%, #0d1535 50%, #050917 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(204,255,0,0.18), transparent)", filter: "blur(100px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(204,255,0,0.1), transparent)", filter: "blur(120px)" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(204,255,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.2) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8" style={{ background: "#000", border: "1px solid #ccff00", borderRadius: "8px" }}>
            <Brain size={13} style={{ color: "#ccff00" }} />
            <span className="text-sm font-bold font-mono" style={{ color: "#ccff00" }}>AI 驱动的新一代私域运营平台</span>
            <div className="w-2 h-2 animate-pulse ml-1" style={{ background: "#ccff00", borderRadius: "50%" }} />
          </div>

          <h1 className="font-bold leading-tight mb-6" style={{ fontSize: "clamp(36px, 5vw, 72px)", color: "#fff", letterSpacing: "-0.02em", fontFamily: "monospace" }}>
            把私域运营<br />
            <span style={{ color: "#ccff00" }}>交给 AI 来做</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
            {PRODUCT.desc}
          </p>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <button className="flex items-center gap-2 px-8 py-4 text-base font-bold font-mono" style={{ background: "#ccff00", color: "#000", borderRadius: "8px" }} onClick={onEnterApp}>
              免费开始使用 <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 text-base font-bold font-mono" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "8px" }}>
              <Play size={16} /> 观看演示视频
            </button>
          </div>
          <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>无需信用卡 · 14天免费试用 · 随时取消</p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(204,255,0,0.2)", background: "#0d1535", borderRadius: "12px" }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(204,255,0,0.04)", borderBottom: "1px solid rgba(204,255,0,0.1)" }}>
              <div className="w-3 h-3 bg-red-500 opacity-80" style={{ borderRadius: "50%" }} />
              <div className="w-3 h-3 bg-yellow-500 opacity-80" style={{ borderRadius: "50%" }} />
              <div className="w-3 h-3 opacity-80" style={{ background: "#ccff00", borderRadius: "50%" }} />
              <div className="flex-1 mx-4 h-6 flex items-center px-3" style={{ background: "rgba(255,255,255,0.04)", borderRadius: "4px" }}>
                <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>app.juyuprivate.com/dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: "rgba(204,255,0,0.1)", borderRadius: "4px", border: "1px solid rgba(204,255,0,0.2)" }}>
                <div className="w-1.5 h-1.5 animate-pulse" style={{ background: "#ccff00", borderRadius: "50%" }} />
                <span className="text-xs font-mono font-bold" style={{ color: "#ccff00" }}>AI 在线</span>
              </div>
            </div>

            <div className="flex" style={{ height: "380px" }}>
              <div className="w-44 flex-shrink-0 p-4" style={{ background: "#000", borderRight: "1px solid rgba(204,255,0,0.1)" }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#ccff00", borderRadius: "4px" }}>
                    <Zap size={12} style={{ color: "#000" }} />
                  </div>
                  <span className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>聚域</span>
                </div>
                {["后台总览", "账号资产", "微信管理", "社群管理", "AI分群", "用户操作台", "数据报表"].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 px-2 py-1.5 mb-1" style={{ background: i === 0 ? "#ccff00" : "transparent", borderRadius: "6px" }}>
                    <div className="w-1.5 h-1.5" style={{ background: i === 0 ? "#000" : "rgba(204,255,0,0.3)", borderRadius: "50%" }} />
                    <span className="text-xs font-mono" style={{ color: i === 0 ? "#000" : "rgba(255,255,255,0.4)" }}>{item}</span>
                  </div>
                ))}
                {/* AI status mini panel */}
                <div className="mt-4 p-2" style={{ background: "rgba(204,255,0,0.06)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: "6px" }}>
                  <div className="text-xs font-mono font-bold mb-1.5" style={{ color: "rgba(204,255,0,0.6)", fontSize: "9px" }}>// AI ENGINE</div>
                  <div className="text-xs font-mono" style={{ color: "#ccff00", fontSize: "9px" }}>{floatingDecisions[tick % floatingDecisions.length]}</div>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-hidden">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "账号资产总数", value: "1,247" },
                    { label: "在用微信账号", value: "68" },
                    { label: "活跃社群数", value: "34" },
                    { label: "AI待处理", value: "3" },
                  ].map(c => (
                    <div key={c.label} className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: "8px" }}>
                      <div className="text-xs mb-1.5 font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>{c.label}</div>
                      <div className="text-xl font-bold font-mono" style={{ color: "#ccff00" }}>{c.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="col-span-2 p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(204,255,0,0.1)", height: "120px", borderRadius: "8px" }}>
                    <div className="text-xs mb-2 font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>用户增长趋势</div>
                    <div className="flex items-end gap-1 h-16">
                      {[40,55,45,70,60,80,75,90,85,100].map((h, i) => (
                        <div key={i} className="flex-1" style={{ height: `${h}%`, background: i === 9 ? "#ccff00" : `rgba(204,255,0,${0.15 + i * 0.06})`, borderRadius: "2px 2px 0 0" }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(204,255,0,0.1)", height: "120px", borderRadius: "8px" }}>
                    <div className="text-xs mb-2 font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>城市分布</div>
                    <div className="space-y-2">
                      {[["北京", 82], ["上海", 71], ["深圳", 58], ["广州", 45]].map(([city, pct]) => (
                        <div key={city as string}>
                          <div className="flex justify-between mb-0.5 font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>
                            <span>{city}</span><span>{pct}%</span>
                          </div>
                          <div className="h-1" style={{ background: "rgba(255,255,255,0.08)", borderRadius: "4px" }}>
                            <div className="h-full" style={{ width: `${pct}%`, background: "#ccff00", borderRadius: "4px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(204,255,0,0.1)", borderRadius: "8px" }}>
                  <div className="flex items-center gap-1.5 mb-2 font-mono" style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>
                    <Brain size={10} style={{ color: "#ccff00" }} />
                    <span>AI 运营建议 — 实时更新</span>
                    <div className="w-1.5 h-1.5 animate-pulse ml-auto" style={{ background: "#ccff00", borderRadius: "50%" }} />
                  </div>
                  <div className="flex gap-2">
                    {[
                      { t: "北京PRO群接近满员", level: "high" },
                      { t: "12名用户待分配群", level: "mid" },
                      { t: "唤醒计划推送就绪", level: "ok" },
                    ].map((s, i) => (
                      <div key={i} className="flex-1 text-xs px-2 py-1 font-mono" style={{ background: s.level === "high" ? "rgba(255,0,0,0.08)" : s.level === "mid" ? "rgba(204,255,0,0.06)" : "rgba(0,200,100,0.06)", color: s.level === "high" ? "#ff8888" : s.level === "mid" ? "rgba(204,255,0,0.8)" : "#6effa8", fontSize: "10px", borderRadius: "6px", border: `1px solid ${s.level === "high" ? "rgba(255,0,0,0.2)" : s.level === "mid" ? "rgba(204,255,0,0.2)" : "rgba(0,200,100,0.2)"}` }}>{s.t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating AI badge */}
          <div className="absolute -left-8 top-1/3 px-3 py-2 shadow-xl hidden md:flex items-center gap-2" style={{ background: "#000", border: "1px solid #ccff00", borderRadius: "10px" }}>
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#ccff00", borderRadius: "6px" }}>
              <Brain size={12} style={{ color: "#000" }} />
            </div>
            <div>
              <div className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>AI 决策</div>
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>已处理 12,400次</div>
            </div>
          </div>
          <div className="absolute -right-8 bottom-1/3 px-3 py-2 shadow-xl hidden md:flex items-center gap-2" style={{ background: "#000", border: "1px solid #ccff00", borderRadius: "10px" }}>
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "rgba(204,255,0,0.15)", borderRadius: "6px" }}>
              <TrendingUp size={12} style={{ color: "#ccff00" }} />
            </div>
            <div>
              <div className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>本月营收</div>
              <div className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>¥51.6 万 ↑13%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 border-y" style={{ background: "#050917", borderColor: "rgba(204,255,0,0.15)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="font-bold mb-1 font-mono" style={{ fontSize: "36px", color: "#ccff00" }}>{s.value}</div>
              <div className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Section (新增) ────────────────────────────────────────
function TerminalLine({ line, delay }: { line: { text: string; type: string }; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const colors: Record<string, string> = {
    comment: "rgba(204,255,0,0.4)",
    code: "rgba(255,255,255,0.75)",
    success: "#ccff00",
    warn: "#ffaa00",
    blank: "transparent",
  };

  return (
    <div className="font-mono text-xs transition-all" style={{ color: colors[line.type] || "rgba(255,255,255,0.5)", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-6px)", transition: "opacity 0.3s ease, transform 0.3s ease", minHeight: "18px" }}>
      {line.type !== "blank" && (
        <span>
          {line.type === "success" && <span style={{ color: "#ccff00", marginRight: "4px" }}>→</span>}
          {line.type === "warn" && <span style={{ color: "#ffaa00", marginRight: "4px" }}>!</span>}
          {line.type === "comment" && <span style={{ color: "rgba(204,255,0,0.35)", marginRight: "4px" }}></span>}
          {line.text}
        </span>
      )}
    </div>
  );
}

function AICapabilityCard({ cap, active, onClick }: { cap: typeof aiCapabilities[0]; active: boolean; onClick: () => void }) {
  return (
    <button className="w-full text-left p-4 transition-all" style={{ background: active ? "rgba(204,255,0,0.08)" : "transparent", border: `1px solid ${active ? "#ccff00" : "rgba(204,255,0,0.2)"}`, borderRadius: "10px", cursor: "pointer" }} onClick={onClick}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: active ? "#ccff00" : "rgba(204,255,0,0.1)", borderRadius: "8px" }}>
          <cap.icon size={16} style={{ color: active ? "#000" : "#ccff00" }} />
        </div>
        <div>
          <div className="text-sm font-bold font-mono" style={{ color: active ? "#ccff00" : "rgba(255,255,255,0.7)" }}>{cap.label}</div>
          <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>{cap.badge}</div>
        </div>
        {active && <ChevronRight size={14} style={{ color: "#ccff00", marginLeft: "auto" }} />}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-mono px-2 py-0.5" style={{ background: "rgba(255,50,50,0.1)", color: "#ff8888", borderRadius: "4px", textDecoration: "line-through", fontSize: "10px" }}>{cap.before}</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>→</span>
        <span className="text-xs font-mono px-2 py-0.5" style={{ background: "rgba(204,255,0,0.1)", color: "#ccff00", borderRadius: "4px", fontSize: "10px" }}>{cap.improvement}</span>
      </div>
    </button>
  );
}

function AISection() {
  const [activeCap, setActiveCap] = useState(0);
  const [terminalKey, setTerminalKey] = useState(0);

  const handleSelect = (i: number) => {
    setActiveCap(i);
    setTerminalKey(k => k + 1);
  };

  const cap = aiCapabilities[activeCap];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050917 0%, #070d24 100%)" }}>
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-3 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(204,255,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 font-bold font-mono" style={{ background: "#000", color: "#ccff00", border: "1px solid #ccff00", borderRadius: "8px", fontSize: "12px" }}>
            <Brain size={13} style={{ color: "#ccff00" }} /> AI CORE ENGINE
          </div>
          <h2 className="font-bold mb-4 text-white font-mono" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
            AI 是聚域的<span style={{ color: "#ccff00" }}>核心驱动力</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>
            不只是工具辅助，而是让 AI 主动做决策、做运营、做预警。<br />
            每一个关键节点，都有 AI 在背后实时运转。
          </p>
        </div>

        {/* AI metrics top bar */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {aiMetrics.map((m, i) => (
            <div key={i} className="p-4 text-center" style={{ background: "rgba(204,255,0,0.04)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: "10px" }}>
              <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(204,255,0,0.1)", borderRadius: "8px" }}>
                <m.icon size={16} style={{ color: "#ccff00" }} />
              </div>
              <div className="font-bold font-mono mb-1" style={{ color: "#ccff00", fontSize: "20px" }}>{m.value}</div>
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Main interactive panel */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left: capability list */}
          <div className="col-span-2 space-y-3">
            <div className="text-xs font-mono mb-4 font-bold" style={{ color: "rgba(204,255,0,0.5)", letterSpacing: "0.1em" }}>// SELECT AI CAPABILITY</div>
            {aiCapabilities.map((c, i) => (
              <AICapabilityCard key={c.id} cap={c} active={activeCap === i} onClick={() => handleSelect(i)} />
            ))}
          </div>

          {/* Right: terminal demo */}
          <div className="col-span-3">
            <div className="h-full" style={{ background: "#050917", border: "1px solid rgba(204,255,0,0.25)", borderRadius: "12px", overflow: "hidden" }}>
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(204,255,0,0.04)", borderBottom: "1px solid rgba(204,255,0,0.12)" }}>
                <div className="w-2.5 h-2.5 bg-red-500 opacity-70" style={{ borderRadius: "50%" }} />
                <div className="w-2.5 h-2.5 bg-yellow-400 opacity-70" style={{ borderRadius: "50%" }} />
                <div className="w-2.5 h-2.5 opacity-70" style={{ background: "#ccff00", borderRadius: "50%" }} />
                <div className="flex-1 mx-3 px-3 py-1 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "4px" }}>
                  <span className="text-xs font-mono" style={{ color: "rgba(204,255,0,0.5)" }}>juyu-ai-engine — {cap.badge}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 animate-pulse" style={{ background: "#ccff00", borderRadius: "50%" }} />
                    <span className="text-xs font-mono" style={{ color: "#ccff00", fontSize: "10px" }}>RUNNING</span>
                  </div>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-5 space-y-1" style={{ minHeight: "340px" }}>
                <div className="text-xs font-mono mb-3" style={{ color: "rgba(204,255,0,0.3)" }}>
                  $ juyu-ai run --module={cap.badge.toLowerCase().replace(" ", "_")}
                </div>
                <div key={terminalKey} className="space-y-1">
                  {cap.terminalLines.map((line, i) => (
                    <TerminalLine key={i} line={line} delay={i * 120} />
                  ))}
                </div>
              </div>

              {/* Bottom stats bar */}
              <div className="px-5 py-3 flex items-center gap-6" style={{ borderTop: "1px solid rgba(204,255,0,0.1)", background: "rgba(204,255,0,0.02)" }}>
                <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span style={{ color: "rgba(204,255,0,0.4)" }}>■</span> 处理时间 &lt; 0.3s
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span style={{ color: "rgba(204,255,0,0.4)" }}>■</span> {cap.after}
                </div>
                <div className="ml-auto text-xs font-mono font-bold" style={{ color: "#ccff00" }}>{cap.improvement}</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI workflow diagram */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="text-xs font-mono font-bold" style={{ color: "rgba(204,255,0,0.5)", letterSpacing: "0.1em" }}>// AI 工作流全景</div>
          </div>
          <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4">
            {[
              { label: "流量入口", sub: "抖音/小红书/公众号", icon: Radio },
              { label: "AI 识别", sub: "渠道/城市/身份", icon: Cpu },
              { label: "AI 分群", sub: "最优群组匹配", icon: GitBranch },
              { label: "AI 监控", sub: "风险/满群/异常", icon: AlertTriangle },
              { label: "AI 分层", sub: "RFM用户价值", icon: Layers },
              { label: "AI 推送", sub: "个性化触达", icon: Activity },
              { label: "数据反馈", sub: "持续优化模型", icon: BarChart2 },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="text-center" style={{ width: "100px" }}>
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2" style={{ background: i === 0 || i === arr.length - 1 ? "rgba(204,255,0,0.08)" : "rgba(204,255,0,0.12)", border: "1px solid rgba(204,255,0,0.3)", borderRadius: "10px" }}>
                    <step.icon size={18} style={{ color: "#ccff00" }} />
                  </div>
                  <div className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>{step.label}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 flex-shrink-0 flex items-center justify-center -mt-6">
                    <div className="w-full h-px" style={{ background: "linear-gradient(90deg, rgba(204,255,0,0.4), rgba(204,255,0,0.1))" }} />
                    <ChevronRight size={10} style={{ color: "rgba(204,255,0,0.4)", marginLeft: "-4px", flexShrink: 0 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PainPointsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-bold font-mono" style={{ background: "#000", color: "#ccff00", borderRadius: "8px" }}>
            你是否也遇到这些问题？
          </div>
          <h2 className="font-bold mb-4 font-mono" style={{ fontSize: "40px", color: "#0f172a", letterSpacing: "-0.02em" }}>
            私域运营的<span style={{ color: "#000" }}> 6 大痛点</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto font-mono" style={{ color: "#64748b" }}>
            这些问题正在消耗你的团队精力，也在流失你的客户价值
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {painPoints.map((p, i) => (
            <div key={i} className="p-6 transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-bold mb-2 font-mono" style={{ fontSize: "15px", color: "#111827" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed font-mono" style={{ color: "#6b7280" }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4" style={{ background: "#000", borderRadius: "8px" }}>
            <Brain size={18} style={{ color: "#ccff00" }} />
            <span className="font-bold font-mono" style={{ color: "#ccff00" }}>聚域 AI 把以上 6 个问题全部纳入自动化处理，一次解决</span>
            <ArrowRight size={16} style={{ color: "#ccff00" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24" style={{ background: "#f8f8f5" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-bold font-mono" style={{ background: "#000", color: "#ccff00", borderRadius: "8px" }}>
            核心功能模块
          </div>
          <h2 className="font-bold mb-4 font-mono" style={{ fontSize: "40px", color: "#0f172a", letterSpacing: "-0.02em" }}>
            覆盖私域运营<span style={{ color: "#000" }}>全链路</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto font-mono" style={{ color: "#64748b" }}>
            从账号资产到用户服务，从 AI 分群到数据分析，22个功能模块一体化覆盖
          </p>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {coreFeatures.map((f, i) => (
            <div key={i} className="p-5 bg-white transition-all hover:shadow-md hover:-translate-y-0.5" style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: f.bg, borderRadius: "8px" }}>
                <f.icon size={20} style={{ color: "#000" }} />
              </div>
              <h3 className="font-bold mb-2 text-sm font-mono" style={{ color: "#111827" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed font-mono" style={{ color: "#6b7280" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #050917 0%, #0d1535 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-bold font-mono" style={{ background: "#000", color: "#ccff00", border: "1px solid #ccff00", borderRadius: "8px" }}>
            四层生态架构
          </div>
          <h2 className="font-bold mb-4 text-white font-mono" style={{ fontSize: "40px", letterSpacing: "-0.02em" }}>
            生态级系统<span style={{ color: "#ccff00" }}>，不只是工具</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            从单个项目到多生态管理，聚域支持超级生态→生态→SaaS平台→平台四层架构，随业务规模弹性扩展
          </p>
        </div>

        <div className="flex items-center justify-center gap-0 mb-16">
          {tiers.map((t, i) => (
            <div key={t.level} className="flex items-center">
              <div className="text-center">
                <div className="w-20 h-20 flex flex-col items-center justify-center mx-auto mb-3" style={{ background: t.bg, border: "1px solid #ccff00", borderRadius: "10px" }}>
                  <div className="w-8 h-8 flex items-center justify-center text-sm font-bold font-mono mb-1" style={{ background: "#ccff00", color: "#000", borderRadius: "6px" }}>{t.level}</div>
                  <div className="text-xs font-bold font-mono" style={{ color: "#ccff00" }}>{t.label}</div>
                </div>
                <div className="text-xs max-w-24 text-center font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{t.desc}</div>
              </div>
              {i < tiers.length - 1 && (
                <div className="w-16 h-px mx-2" style={{ background: "linear-gradient(90deg, #ccff00, rgba(204,255,0,0.1))" }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <div key={i} className="p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: "10px" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5" style={{ background: "#ccff00", borderRadius: "50%" }} />
                <span className="font-bold text-sm font-mono" style={{ color: "#ccff00" }}>{m.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {m.items.map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <div className="w-1 h-1 flex-shrink-0" style={{ background: "#ccff00", borderRadius: "50%" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-bold font-mono" style={{ background: "#000", color: "#ccff00", borderRadius: "8px" }}>
            客户真实评价
          </div>
          <h2 className="font-bold mb-4 font-mono" style={{ fontSize: "40px", color: "#0f172a", letterSpacing: "-0.02em" }}>
            他们选择了聚域
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6" style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ color: "#ccff00" }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-6 font-mono" style={{ color: "#374151" }}>"{t.content}"</p>
              <div className="flex items-center gap-3">
                <img src={`https://images.unsplash.com/photo-${["1507003211169-0a1dd7228f2d","1534751516642-a1af1ef26a56","1624395213043-fa2e123b2656"][i % 3]}?w=200&h=200&fit=crop&crop=faces`} alt={t.name} style={{ width: 36, height: 36, borderRadius: "8px", objectFit: "cover" }} />
                <div>
                  <div className="text-sm font-bold font-mono" style={{ color: "#111827" }}>{t.name}</div>
                  <div className="text-xs font-mono" style={{ color: "#9ca3af" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm mb-4 font-mono" style={{ color: "#9ca3af" }}>已服务行业</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {clients.map(c => (
              <span key={c} className="px-4 py-2 text-sm font-bold font-mono" style={{ background: "#000", color: "#ccff00", borderRadius: "8px" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #050917 0%, #0d1535 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(204,255,0,0.1), transparent)", filter: "blur(100px)" }} />
        <div className="absolute inset-0 opacity-3" style={{ backgroundImage: "linear-gradient(rgba(204,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 font-bold font-mono" style={{ background: "#000", color: "#ccff00", border: "1px solid rgba(204,255,0,0.3)", borderRadius: "8px", fontSize: "12px" }}>
          <Brain size={12} /> AI 正在等待为你工作
        </div>
        <h2 className="font-bold mb-6 text-white font-mono" style={{ fontSize: "48px", letterSpacing: "-0.02em" }}>
          开始构建你的<br />
          <span style={{ color: "#ccff00" }}>AI 私域运营体系</span>
        </h2>
        <p className="text-lg mb-10 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
          14天免费试用，无需信用卡，团队即开即用
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-10 py-4 text-base font-bold font-mono" style={{ background: "#ccff00", color: "#000", borderRadius: "8px" }} onClick={onEnterApp}>
            立即免费试用 <ArrowRight size={16} />
          </button>
          <button className="px-8 py-4 text-base font-bold font-mono" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "8px" }}>
            预约演示
          </button>
        </div>
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {["14天免费体验", "专属客户成功顾问", "数据安全合规", "随时导出数据"].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-sm font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              <CheckCircle size={13} style={{ color: "#ccff00" }} /> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    "产品": ["AI 能力", "功能介绍", "定价方案", "更新日志"],
    "行业": ["教育行业", "健康产业", "电商品牌", "知识付费"],
    "公司": ["关于我们", "加入我们", "合作伙伴", "联系我们"],
    "支持": ["帮助中心", "视频教程", "社区论坛", "服务协议"],
  };

  return (
    <footer style={{ background: "#030712", borderTop: "1px solid rgba(204,255,0,0.1)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-5 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: "#ccff00", borderRadius: "8px" }}>
                <Zap size={16} style={{ color: "#000" }} />
              </div>
              <span className="font-bold text-lg font-mono" style={{ color: "#ccff00" }}>{PRODUCT.name}</span>
            </div>
            <p className="text-sm mb-4 font-mono" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              AI 驱动的私域资产<br />与社群运营平台
            </p>
            <div className="flex items-center gap-1.5 mb-2 px-2 py-1 w-fit" style={{ background: "rgba(204,255,0,0.06)", border: "1px solid rgba(204,255,0,0.15)", borderRadius: "6px" }}>
              <div className="w-1.5 h-1.5 animate-pulse" style={{ background: "#ccff00", borderRadius: "50%" }} />
              <span className="text-xs font-mono" style={{ color: "rgba(204,255,0,0.6)" }}>AI 引擎运行中</span>
            </div>
            <div className="text-xs font-mono mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>ICP备2024XXXXXX号</div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="text-sm font-bold mb-4 font-mono" style={{ color: "rgba(204,255,0,0.7)" }}>{group}</div>
              <div className="space-y-2.5">
                {items.map(item => (
                  <button key={item} className="block text-sm transition-colors text-left font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{item}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 flex items-center justify-between" style={{ borderTop: "1px solid rgba(204,255,0,0.08)" }}>
          <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>© 2026 聚域（JuYu）· 保留所有权利</p>
          <div className="flex gap-6">
            {["隐私政策", "服务条款", "Cookie政策"].map(item => (
              <button key={item} className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{item}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
export default function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "#050917" }}>
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
