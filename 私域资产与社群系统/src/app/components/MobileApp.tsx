import { useState } from "react";
import { Home, Users, CheckSquare, TrendingUp, User, Bell, ChevronRight, QrCode, Star, ArrowUp, Clock, CheckCircle, Gift, MessageCircle, Wallet, Search, ArrowDown, Plus, Settings, Shield, FileText, Package, Heart } from "lucide-react";

// ─── 颜色系统（白底黄绿黑移动端） ────────────────────────────────
const M = {
  bg: "#ffffff",
  surface: "#ffffff",
  surface2: "#f7f9ef",
  border: "rgba(73,101,0,0.18)",
  borderDim: "#e5e9db",
  primary: "#668c00",
  primaryFill: "#b8f000",
  primaryLight: "rgba(184,240,0,0.16)",
  muted: "#72796a",
  text: "#1e293b",
  textSec: "#3e4637",
};

// ─── 首页 ─────────────────────────────────────────────────────
function HomeTab() {
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const announcements = [
    { title: "7月PRO特训营报名中", sub: "PRO会员9折，限额50席" },
    { title: "积分兑换上新", sub: "新增2款专属周边礼盒" },
    { title: "你的6月数据报告", sub: "本月影响力提升23%" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ background: M.bg }}>
      {/* 顶部 */}
      <div className="px-5 pt-12 pb-4" style={{ background: M.bg, borderBottom: `1px solid ${M.borderDim}` }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-bold tracking-wider" style={{ fontSize: "17px", color: M.text, fontFamily: "monospace" }}>嗨，李云天</div>
            <div className="text-xs mt-0.5 flex items-center gap-1.5 font-mono" style={{ color: M.primary }}>
              <Star size={11} style={{ color: M.primary }} />
              PRO会员 · 北京 · 有效至 2027-03-01
            </div>
          </div>
          <div className="relative">
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "8px" }}>
              <Bell size={17} style={{ color: M.primary }} />
            </div>
            <div className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center font-bold" style={{ fontSize: "9px", background: M.primaryFill, color: "#ffffff", borderRadius: "50%" }}>3</div>
          </div>
        </div>

        {/* PRO会员卡 */}
        <div className="p-5 relative overflow-hidden mb-4" style={{ background: M.surface, border: `2px solid ${M.primaryFill}`, borderRadius: "12px" }}>
          <div className="absolute top-0 right-0 w-24 h-24 opacity-20" style={{ background: M.primaryFill, borderRadius: "50%" }} />
          <div className="flex items-start justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={13} style={{ color: M.primary }} />
                <span className="text-xs font-bold tracking-widest" style={{ color: M.primary, fontFamily: "monospace" }}>PRO 会员</span>
              </div>
              <div className="font-bold" style={{ fontSize: "18px", color: M.text, fontFamily: "monospace" }}>会员中心</div>
            </div>
            <div className="w-11 h-11 flex items-center justify-center text-lg font-bold" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "8px" }}>李</div>
          </div>
          <div className="flex items-end justify-between relative">
            <div>
              <div className="text-xs mb-0.5 font-mono" style={{ color: M.muted }}>会员有效期</div>
              <div className="font-bold text-sm font-mono" style={{ color: M.text }}>2026.03.01 → 2027.03.01</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono" style={{ color: M.muted }}>积分余额</div>
              <div className="font-bold" style={{ color: M.primary }}>2,840 分</div>
            </div>
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: QrCode,        label: "入群码",   color: M.primary },
            { icon: Gift,          label: "我的权益",  color: M.primary },
            { icon: MessageCircle, label: "联系客服",  color: M.primary },
            { icon: Wallet,        label: "我的收益",  color: M.primary },
          ].map(a => (
            <button key={a.label} className="flex flex-col items-center gap-2 py-3" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "10px" }}>
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: M.primaryLight, borderRadius: "8px" }}>
                <a.icon size={17} style={{ color: M.primary }} />
              </div>
              <span className="text-xs font-mono" style={{ color: M.textSec }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 公告轮播 */}
      <div className="px-5 mb-4 mt-4">
        <div className="p-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 animate-pulse" style={{ background: M.primaryFill, borderRadius: "50%" }} />
              <div>
                <div className="text-sm font-bold font-mono" style={{ color: M.text }}>{announcements[announcementIdx].title}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: M.muted }}>{announcements[announcementIdx].sub}</div>
              </div>
            </div>
            <div className="flex gap-1">
              {announcements.map((_, i) => (
                <button key={i} className="w-2 h-2" style={{ background: i === announcementIdx ? M.primary : M.borderDim, borderRadius: "50%" }} onClick={() => setAnnouncementIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="px-5 mb-4">
        <div className="text-sm font-bold mb-3 tracking-widest font-mono" style={{ color: M.text }}>// 本月数据</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "影响力", value: "3,510", delta: "+12%", color: M.primary },
            { label: "推荐新人", value: "8 人",  delta: "+3",   color: M.primary },
            { label: "收益",    value: "¥1,240", delta: "+23%", color: M.primary },
          ].map(s => (
            <div key={s.label} className="p-3" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
              <div className="text-xs mb-1 font-mono" style={{ color: M.muted }}>{s.label}</div>
              <div className="font-bold font-mono" style={{ color: M.primary, fontSize: "15px" }}>{s.value}</div>
              <div className="flex items-center gap-0.5 mt-0.5 text-xs font-mono" style={{ color: M.primary }}>
                <ArrowUp size={10} />{s.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 我的服务老师 */}
      <div className="px-5 mb-4">
        <div className="text-sm font-bold mb-3 tracking-widest font-mono" style={{ color: M.text }}>// 服务老师</div>
        <div className="p-4 flex items-center gap-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
              <div className="w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "10px" }}>吴</div>
          <div className="flex-1">
            <div className="font-bold font-mono" style={{ color: M.text }}>吴思远</div>
            <div className="text-xs mt-0.5 font-mono" style={{ color: M.muted }}>北京区域 · 5年经验</div>
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} style={{ color: M.primary }} />)}
              <span className="text-xs ml-1 font-mono" style={{ color: M.muted }}>4.9分</span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-xs font-bold font-mono" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "8px" }}>联系</button>
        </div>
      </div>

      {/* 待办 */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold tracking-widest font-mono" style={{ color: M.text }}>// 待办事项</span>
          <span className="text-xs font-mono" style={{ color: M.primary }}>查看全部</span>
        </div>
        {[
          { text: "完成 7 月学习打卡 Day 5", urgent: true,  time: "今日" },
          { text: "参与本周线上交流会",       urgent: false, time: "周五" },
          { text: "更新个人收益申请",          urgent: false, time: "月底" },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${M.borderDim}` }}>
            <div className="w-4 h-4 border-2 flex-shrink-0" style={{ borderColor: t.urgent ? M.primary : M.muted, borderRadius: "4px" }} />
            <span className="flex-1 text-sm font-mono" style={{ color: M.textSec }}>{t.text}</span>
            <span className="text-xs font-mono" style={{ color: M.muted }}>{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 社群 ─────────────────────────────────────────────────────
function CommunityTab() {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="flex flex-col h-full overflow-auto" style={{ background: M.bg }}>
      <div className="px-5 pt-12 pb-4 flex-shrink-0" style={{ background: M.bg, borderBottom: `1px solid ${M.borderDim}` }}>
        <div className="font-bold mb-1 tracking-widest font-mono" style={{ fontSize: "20px", color: M.text }}>// 我的社群</div>
        <div className="text-xs font-mono" style={{ color: M.muted }}>已加入 1 个群 · 推荐 2 个可加入</div>
      </div>

      <div className="px-5 mt-4">
        {/* 已加入 */}
        <div className="text-xs font-bold mb-2 tracking-widest font-mono" style={{ color: M.primary }}>[ 已加入 ]</div>
        <div className="p-4 mb-4" style={{ background: M.surface, border: `2px solid ${M.primary}`, borderRadius: "12px" }}>
          <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "10px" }}>北</div>
            <div>
              <div className="font-bold font-mono" style={{ color: M.text }}>北京PRO会员群01</div>
              <div className="text-xs mt-0.5 flex items-center gap-2 font-mono" style={{ color: M.muted }}>
                <span>PRO会员</span><span>·</span><span>487人</span><span>·</span><span>吴思远</span>
              </div>
            </div>
          </div>
          <div className="mb-1.5 flex justify-between text-xs font-mono" style={{ color: M.muted }}>
            <span>群容量</span><span style={{ color: M.primary }}>487/500 · 接近满群</span>
          </div>
          <div className="h-1.5 overflow-hidden mb-3" style={{ background: M.borderDim, borderRadius: "4px" }}>
            <div className="h-full" style={{ width: "97.4%", background: M.primaryFill, borderRadius: "4px" }} />
          </div>
          <button className="w-full py-2.5 text-sm font-bold font-mono flex items-center justify-center gap-2" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "8px" }} onClick={() => setShowQR(true)}>
            <QrCode size={16} /> 查看入群二维码
          </button>
        </div>

        {/* QR 码弹窗 */}
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)" }} onClick={() => setShowQR(false)}>
            <div className="p-6 mx-8" style={{ background: M.surface, border: `2px solid ${M.primary}`, borderRadius: "14px" }}>
              <div className="text-center mb-4">
                <div className="font-bold font-mono" style={{ color: M.text }}>北京PRO会员群01</div>
                <div className="text-xs mt-1 font-mono" style={{ color: M.muted }}>长按识别进群</div>
              </div>
              <div className="w-48 h-48 flex items-center justify-center mx-auto mb-4" style={{ background: "#ffffff", borderRadius: "8px" }}>
                <QrCode size={120} style={{ color: "#ffffff" }} />
              </div>
              <div className="text-center text-xs font-mono" style={{ color: M.muted }}>二维码有效期至 2026-07-31</div>
            </div>
          </div>
        )}

        {/* 推荐 */}
        <div className="text-xs font-bold mb-2 tracking-widest font-mono" style={{ color: M.muted }}>[ 推荐加入 ]</div>
        {[
          { name: "北京体验官群01", count: 123, max: 200, type: "体验官" },
          { name: "北京PRO会员群02（备用）", count: 12, max: 500, type: "PRO会员" },
        ].map((g, i) => (
          <div key={i} className="p-4 mb-3" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-sm font-mono" style={{ color: M.text }}>{g.name}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: M.muted }}>{g.type} · {g.count}/{g.max} 人</div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold font-mono" style={{ background: M.primaryLight, color: M.primary, borderRadius: "6px", border: `1px solid ${M.primary}` }}>{g.type}</span>
            </div>
            <div className="h-1 overflow-hidden mb-3" style={{ background: M.borderDim, borderRadius: "4px" }}>
              <div className="h-full" style={{ width: `${Math.round((g.count / g.max) * 100)}%`, background: M.primaryFill, borderRadius: "4px" }} />
            </div>
            <button className="w-full py-2 text-xs font-bold font-mono" style={{ background: M.primaryLight, color: M.primary, border: `1px solid ${M.primary}`, borderRadius: "8px" }}>申请加入</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 任务 ─────────────────────────────────────────────────────
function TaskTab() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const tasks = [
    { id: 1, title: "回访新用户陈美玲",       type: "服务回访", priority: "高", deadline: "今日 14:00", points: 50 },
    { id: 2, title: "处理入群异常：刘晓峰",   type: "入群异常", priority: "高", deadline: "今日 12:00", points: 30 },
    { id: 3, title: "完成本周群活跃报告",      type: "日常运营", priority: "中", deadline: "明日",       points: 20 },
    { id: 4, title: "7月打卡 Day 5",           type: "每日签到", priority: "低", deadline: "今日",       points: 10 },
    { id: 5, title: "分享特训营预告朋友圈",    type: "内容任务", priority: "低", deadline: "后日",       points: 20 },
  ];
  const priorityColor: Record<string, string> = { "高": M.primary, "中": "#ffcc00", "低": "#94a3b8" };
  const completedCount = completedIds.length;
  const totalPoints = completedIds.reduce((s, id) => s + (tasks.find(t => t.id === id)?.points || 0), 0);

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ background: M.bg }}>
      <div className="px-5 pt-12 pb-4 flex-shrink-0" style={{ background: M.bg, borderBottom: `1px solid ${M.borderDim}` }}>
        <div className="font-bold mb-1 tracking-widest font-mono" style={{ fontSize: "20px", color: M.text }}>// 我的任务</div>
        <div className="flex items-center gap-4 text-xs mt-2 font-mono">
          <span style={{ color: M.muted }}>今日进度</span>
          <span style={{ color: M.primary, fontWeight: 700 }}>{completedCount}/{tasks.length} 已完成</span>
          {completedCount > 0 && <span style={{ color: "#ffcc00" }}>+{totalPoints} 积分获得</span>}
        </div>
        {/* 进度条 */}
        <div className="mt-3 h-2 overflow-hidden" style={{ background: M.borderDim, borderRadius: "4px" }}>
          <div className="h-full transition-all" style={{ width: `${(completedCount / tasks.length) * 100}%`, background: M.primaryFill, borderRadius: "4px" }} />
        </div>
      </div>

      <div className="px-5 mt-4 space-y-2 mb-8">
        {tasks.map(t => {
          const isDone = completedIds.includes(t.id);
          return (
            <div key={t.id} className="p-4 transition-all" style={{ background: isDone ? "rgba(184,240,0,0.08)" : M.surface, border: `1px solid ${isDone ? M.primary : M.border}`, opacity: isDone ? 0.75 : 1, borderRadius: "12px" }}>
              <div className="flex items-start gap-3">
                <button className="mt-0.5 flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all" style={{ borderColor: isDone ? M.primary : priorityColor[t.priority], background: isDone ? M.primaryFill : "transparent", borderRadius: "4px" }} onClick={() => setCompletedIds(prev => isDone ? prev.filter(id => id !== t.id) : [...prev, t.id])}>
                  {isDone && <CheckCircle size={12} style={{ color: "#ffffff" }} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold font-mono" style={{ color: isDone ? M.muted : M.text, textDecoration: isDone ? "line-through" : "none" }}>{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 font-mono font-bold" style={{ background: M.primaryLight, color: M.primary, borderRadius: "4px", border: `1px solid rgba(184,240,0,0.4)` }}>{t.type}</span>
                    <span className="text-xs flex items-center gap-1 font-mono" style={{ color: M.muted }}>
                      <Clock size={10} />{t.deadline}
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: M.primary }}>+{t.points}积分</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 收益 ─────────────────────────────────────────────────────
function EarningsTab() {
  const [activeMonth, setActiveMonth] = useState(3);
  const months = [{ m: "4月", v: 3200 }, { m: "5月", v: 4500 }, { m: "6月", v: 3800 }, { m: "7月", v: 1240 }];
  const maxV = Math.max(...months.map(m => m.v));
  const records = [
    { desc: "分销佣金 · 推荐李云天", amount: "+¥298", date: "07-05", type: "分销", positive: true },
    { desc: "服务奖励 · 7月绩效",     amount: "+¥500", date: "07-01", type: "奖励", positive: true },
    { desc: "提现至微信零钱",         amount: "-¥800", date: "06-30", type: "提现", positive: false },
    { desc: "分销佣金 · 推荐赵志远", amount: "+¥188", date: "06-28", type: "分销", positive: true },
    { desc: "提现至银行卡",           amount: "-¥500", date: "06-15", type: "提现", positive: false },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ background: M.bg }}>
      {/* 收益总额卡 */}
      <div className="px-5 pt-12 pb-5" style={{ background: M.bg, borderBottom: `1px solid ${M.borderDim}` }}>
        <div className="font-bold mb-4 tracking-widest font-mono" style={{ fontSize: "20px", color: M.text }}>// 我的收益</div>
        <div className="p-5" style={{ background: M.surface, border: `2px solid ${M.primary}`, borderRadius: "12px" }}>
          <div className="text-xs mb-1 font-mono" style={{ color: M.muted }}>本月收益</div>
          <div className="text-4xl font-bold mb-2 font-mono" style={{ color: M.primary }}>¥1,240</div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <ArrowUp size={12} style={{ color: M.primary }} />
            <span style={{ color: M.primary, fontWeight: 700 }}>较上月 +12.3%</span>
            <span style={{ color: M.muted }}>· 累计 ¥12,740</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        {/* 月度迷你图 */}
        <div className="p-4 mb-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
          <div className="text-sm font-bold mb-3 tracking-widest font-mono" style={{ color: M.text }}>近4月收益</div>
          <div className="flex items-end gap-2 h-20 mb-2">
            {months.map((m, i) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveMonth(i)}>
                <div className="w-full transition-all" style={{ height: `${Math.round((m.v / maxV) * 72)}px`, background: i === activeMonth ? M.primaryFill : "rgba(184,240,0,0.35)", borderRadius: "4px 4px 0 0" }} />
                <div className="text-xs font-mono" style={{ color: i === activeMonth ? M.primary : M.muted }}>{m.m}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-xs font-mono" style={{ color: M.muted }}>{months[activeMonth].m}收益：</span>
            <span className="text-sm font-bold font-mono" style={{ color: M.primary }}>¥{months[activeMonth].v.toLocaleString()}</span>
          </div>
        </div>

        {/* 4统计卡 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "累计收益", value: "¥12,740" },
            { label: "待结算",   value: "¥380" },
            { label: "已提现",   value: "¥12,360" },
            { label: "分销收益", value: "¥3,200" },
          ].map(s => (
            <div key={s.label} className="p-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
              <div className="text-xs mb-1 font-mono" style={{ color: M.muted }}>{s.label}</div>
              <div className="font-bold font-mono" style={{ color: M.primary, fontSize: "17px" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* 提现按钮 */}
        <button className="w-full py-4 text-base font-bold mb-4 font-mono" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "8px" }}>
          <Wallet size={16} className="inline mr-2" />申请提现
        </button>

        {/* 明细 */}
        <div className="overflow-hidden mb-8" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
          {/* Table header */}
          <div className="px-4 py-3 font-bold text-sm font-mono" style={{ color: "#ffffff", background: "#1e293b", borderBottom: `1px solid ${M.borderDim}` }}>收益明细</div>
          {records.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < records.length - 1 ? `1px solid ${M.borderDim}` : "none" }}>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: r.positive ? M.primaryLight : "rgba(0,0,0,0.04)", borderRadius: "8px", border: `1px solid ${r.positive ? M.primary : M.borderDim}` }}>
                <Wallet size={14} style={{ color: r.positive ? M.primary : M.muted }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-mono" style={{ color: M.text }}>{r.desc}</div>
                <div className="text-xs mt-0.5 flex items-center gap-2 font-mono" style={{ color: M.muted }}>
                  <span>{r.date}</span><span className="px-1.5 py-0.5" style={{ background: M.bg, fontSize: "10px", color: M.muted, border: `1px solid ${M.borderDim}`, borderRadius: "4px" }}>{r.type}</span>
                </div>
              </div>
              <div className="font-bold font-mono" style={{ color: r.positive ? M.primary : "#ff4444" }}>{r.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 我的 ─────────────────────────────────────────────────────
function ProfileTab() {
  const badges = [
    { name: "活跃达人", icon: "⚡", color: M.primary },
    { name: "推荐之星", icon: "★", color: M.primary },
    { name: "学习先锋", icon: "▲", color: M.primary },
  ];
  const orders = [
    { name: "PRO会员年卡", amount: "¥2,480", date: "2026-03-01", status: "已完成" },
    { name: "续费PRO年卡", amount: "¥2,480", date: "2025-03-01", status: "已完成" },
    { name: "体验营课程",   amount: "¥980",  date: "2025-01-15", status: "已完成" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ background: M.bg }}>
      {/* 个人资料头 */}
      <div className="px-5 pt-12 pb-5 text-center" style={{ background: M.bg, borderBottom: `1px solid ${M.borderDim}` }}>
        <div className="w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-3" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "50%" }}>李</div>
        <div className="font-bold font-mono" style={{ fontSize: "19px", color: M.text }}>李云天</div>
        <div className="text-xs mt-1 font-mono" style={{ color: M.muted }}>138-0123-4567 · 北京</div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="px-3 py-1 text-xs font-bold font-mono" style={{ background: M.primaryFill, color: "#ffffff", borderRadius: "6px" }}>PRO会员</span>
          <span className="px-2 py-1 text-xs font-mono" style={{ background: M.primaryLight, color: M.primary, borderRadius: "6px", border: `1px solid ${M.primary}` }}>积分：2,840</span>
        </div>

        {/* 成就徽章 */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {badges.map(b => (
            <div key={b.name} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 flex items-center justify-center text-lg" style={{ background: M.primaryLight, borderRadius: "8px", border: `1px solid ${M.primary}` }}>{b.icon}</div>
              <span className="text-xs font-mono" style={{ color: M.muted }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        {/* 信息卡 */}
        <div className="overflow-hidden mb-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
          {/* Table header */}
          <div className="flex justify-between px-4 py-2" style={{ background: "#1e293b" }}>
            <span className="text-xs font-bold font-mono" style={{ color: "#ffffff" }}>字段</span>
            <span className="text-xs font-bold font-mono" style={{ color: "#ffffff" }}>值</span>
          </div>
          {[
            ["微信号", "liyuntian88"], ["所在城市", "北京"],
            ["会员等级", "PRO会员"], ["入会时间", "2025-03-15"],
            ["来源渠道", "公众号"], ["推荐人", "吴思远"],
          ].map(([k, v], i, arr) => (
            <div key={k} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${M.borderDim}` : "none" }}>
              <span className="text-sm font-mono" style={{ color: M.muted }}>{k}</span>
              <span className="text-sm font-bold font-mono" style={{ color: M.text }}>{v}</span>
            </div>
          ))}
        </div>

        {/* 订单记录 */}
        <div className="text-sm font-bold mb-3 tracking-widest font-mono" style={{ color: M.text }}>// 订单记录</div>
        <div className="overflow-hidden mb-4" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
          {orders.map((o, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < orders.length - 1 ? `1px solid ${M.borderDim}` : "none" }}>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: M.primaryLight, borderRadius: "8px", border: `1px solid ${M.primary}` }}>
                <Package size={14} style={{ color: M.primary }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-mono" style={{ color: M.text }}>{o.name}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: M.muted }}>{o.date}</div>
              </div>
              <div>
                <div className="text-sm font-bold font-mono" style={{ color: M.primary }}>{o.amount}</div>
                <div className="text-xs text-right font-mono" style={{ color: M.muted }}>{o.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 菜单 */}
        {[
          { label: "我的权益", icon: Gift,         sub: "查看PRO全部权益" },
          { label: "推荐记录", icon: Heart,         sub: "已推荐 8 人" },
          { label: "联系客服", icon: MessageCircle, sub: "在线服务" },
          { label: "系统设置", icon: Settings,      sub: "" },
        ].map(m => (
          <button key={m.label} className="w-full flex items-center gap-3 px-4 py-3.5 mb-2" style={{ background: M.surface, border: `1px solid ${M.border}`, borderRadius: "12px" }}>
            <m.icon size={18} style={{ color: M.primary }} />
            <div className="flex-1 text-left">
              <div className="text-sm font-bold font-mono" style={{ color: M.text }}>{m.label}</div>
              {m.sub && <div className="text-xs font-mono" style={{ color: M.muted }}>{m.sub}</div>}
            </div>
            <ChevronRight size={16} style={{ color: M.muted }} />
          </button>
        ))}

        <button className="w-full py-4 text-sm font-bold mt-2 mb-8 font-mono" style={{ background: "transparent", color: "#ff4444", border: "1px solid #ff4444", borderRadius: "8px" }}>
          退出登录
        </button>
      </div>
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
const tabs = [
  { id: "home",      label: "首页", icon: Home,        component: HomeTab },
  { id: "community", label: "社群", icon: Users,       component: CommunityTab },
  { id: "tasks",     label: "任务", icon: CheckSquare, component: TaskTab },
  { id: "earnings",  label: "收益", icon: TrendingUp,  component: EarningsTab },
  { id: "profile",   label: "我的", icon: User,        component: ProfileTab },
];

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState("home");
  const ActiveComponent = tabs.find(t => t.id === activeTab)!.component;

  return (
    <div className="flex items-center justify-center h-full py-6" style={{ background: "#f1f5f9" }}>
      {/* iPhone 16 Pro Max 外壳 */}
      <div className="relative flex-shrink-0" style={{ width: "393px", height: "852px", borderRadius: "54px", background: "#ffffff", border: "8px solid #dfe5d2", boxShadow: "0 30px 60px rgba(40,50,20,0.18), inset 0 0 0 1px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 rounded-full z-20" style={{ background: "#1e293b" }} />

        {/* Screen */}
        <div className="h-full flex flex-col" style={{ background: M.bg }}>
          <div className="flex-1 overflow-hidden">
            <ActiveComponent />
          </div>

          {/* Tab bar */}
          <div className="flex-shrink-0 pb-6 pt-2" style={{ background: M.surface, borderTop: `1px solid ${M.borderDim}` }}>
            <div className="flex">
              {tabs.map(t => {
                const isActive = activeTab === t.id;
                return (
                  <button key={t.id} className="flex-1 flex flex-col items-center gap-1 py-1.5 transition-all" onClick={() => setActiveTab(t.id)}>
                      <div className="w-8 h-8 flex items-center justify-center transition-all" style={{ background: isActive ? M.primaryLight : "transparent", borderRadius: "8px" }}>
                      <t.icon size={19} style={{ color: isActive ? M.primary : M.muted }} />
                    </div>
                    <span style={{ fontSize: "10px", color: isActive ? M.primary : M.muted, fontWeight: isActive ? 700 : 400, fontFamily: "monospace" }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
