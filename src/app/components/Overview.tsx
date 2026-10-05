import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Leaf,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { S, useThemeSingleton } from "../theme";
import { useProjectContext } from "../App";
import { PROJECT_WORK_MODE_META } from "../data/projectWorkModes";

interface OverviewProps {
  onNavigate?: (module: string) => void;
}

type WorkItem = {
  id: number;
  member: string;
  tag: string;
  task: string;
  status: "已通过" | "待添加" | "待入群" | "再次跟进";
  tone: "green" | "orange" | "blue";
  targetModule: string;
};

const relationshipQueue: WorkItem[] = [
  { id: 1, member: "林晓月", tag: "PRO会员", task: "服务官个微", status: "待添加", tone: "orange", targetModule: "users" },
  { id: 2, member: "周明远", tag: "体验官", task: "会员服务群", status: "待入群", tone: "blue", targetModule: "users" },
  { id: 3, member: "陈美玲", tag: "PRO会员", task: "服务官个微", status: "已通过", tone: "green", targetModule: "users" },
  { id: 4, member: "赵一然", tag: "进阶班", task: "班主任企微", status: "再次跟进", tone: "orange", targetModule: "users" },
];

const serviceTrend = [42, 56, 49, 68, 61, 74, 82];
const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "今天"];

const initialTodos = [
  { id: 1, text: "跟进 18 位待添加会员", time: "09:30", done: false, targetModule: "users" },
  { id: 2, text: "复核 AI 手机同步结果", time: "11:00", done: false, targetModule: "users" },
  { id: 3, text: "审核 3 条退款申请", time: "14:00", done: false, targetModule: "orders" },
  { id: 4, text: "完成今日服务交接", time: "16:30", done: false, targetModule: "cs" },
];

function MiniTrend() {
  const max = Math.max(...serviceTrend);
  const points = serviceTrend.map((value, index) => `${(index / (serviceTrend.length - 1)) * 100},${100 - (value / max) * 78}`).join(" ");
  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 154, overflow: "visible" }}>
        <defs>
          <linearGradient id="service-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={S.primary} stopOpacity="0.22" />
            <stop offset="100%" stopColor={S.primary} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,100 ${points} 100,100`} fill="url(#service-area)" stroke="none" />
        <polyline points={points} fill="none" stroke={S.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {serviceTrend.map((value, index) => <circle key={value + index} cx={(index / (serviceTrend.length - 1)) * 100} cy={100 - (value / max) * 78} r="1.8" fill={S.surface} stroke={S.primary} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="flex justify-between" style={{ color: S.muted, fontSize: 10 }}>
        {weekdays.map(day => <span key={day}>{day}</span>)}
      </div>
    </div>
  );
}

export default function Overview({ onNavigate }: OverviewProps = {}) {
  useThemeSingleton();
  const { project, projectWorkMode } = useProjectContext();
  const [todos, setTodos] = useState(initialTodos);
  const [toast, setToast] = useState("");
  const [showAllQueue, setShowAllQueue] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const navigate = (module: string) => onNavigate ? onNavigate(module) : notify("暂未配置跳转目标");
  const toggleTodo = (id: number) => {
    setTodos(current => current.map(item => item.id === id ? { ...item, done: !item.done } : item));
    const item = todos.find(todo => todo.id === id);
    if (item && !item.done) notify(`已完成：${item.text}`);
  };
  const completedTodos = todos.filter(item => item.done).length;
  const visibleQueue = showAllQueue ? relationshipQueue : relationshipQueue.slice(0, 3);
  const modeMeta = PROJECT_WORK_MODE_META[projectWorkMode];

  const metrics = [
    { label: "项目会员", value: "1,284", detail: "本月新增 86 位", icon: Users, color: S.primary, module: "users" },
    { label: "待处理关系任务", value: "86", detail: "较昨日减少 12 条", icon: MessageCircle, color: "#e89550", module: "users" },
    { label: "人工服务完成率", value: "92.6%", detail: "较上周提升 4.8%", icon: ShieldCheck, color: "#5889a6", module: "cs" },
    { label: "AI 最近同步", value: "刚刚", detail: "3 台设备运行正常", icon: Bot, color: S.primary, module: "users" },
  ];

  return (
    <div className="relative min-h-full p-6 xl:p-8" style={{ background: S.bg, color: S.text }}>
      {toast && <div className="fixed right-6 top-5 z-50 flex items-center gap-2 px-4 py-3 text-sm font-semibold" style={{ background: S.text, color: S.surface, borderRadius: 14, boxShadow: S.shadow }}>{toast}</div>}
      <div className="mx-auto max-w-[1440px] space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold" style={{ color: S.primary }}><Leaf size={14} /> 主理人公社 · 总运营工作台</div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: S.text }}>今天，先把会员服务做好。</h1>
            <p className="mt-1 text-sm" style={{ color: S.muted }}>聚焦关系任务、人工服务和 AI 同步结果，所有动作都有记录。</p>
          </div>
          <div className="flex items-center gap-2 rounded-full px-3 py-2 text-xs" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, boxShadow: "0 4px 14px rgba(39,88,68,.05)" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: S.primary }} />
            <span style={{ color: S.muted }}>{project}</span>
            <span style={{ color: S.borderMed }}>·</span>
            <span style={{ color: S.textSec }}>{modeMeta.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map(metric => {
            const Icon = metric.icon;
            return <button key={metric.label} onClick={() => navigate(metric.module)} className="group rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5" style={{ background: S.surface, border: `1px solid ${S.border}`, boxShadow: "0 8px 24px rgba(39,88,68,.05)" }}>
              <div className="flex items-start justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${metric.color}18`, color: metric.color }}><Icon size={18} /></span><ArrowUpRight size={15} className="opacity-0 transition-opacity group-hover:opacity-100" style={{ color: S.muted }} /></div>
              <div className="mt-5 text-xs" style={{ color: S.muted }}>{metric.label}</div>
              <div className="mt-1 text-2xl font-semibold" style={{ color: S.text }}>{metric.value}</div>
              <div className="mt-1 text-xs" style={{ color: metric.color }}>{metric.detail}</div>
            </button>;
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.45fr_.9fr]">
          <section className="rounded-2xl p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(39,88,68,.05)" }}>
            <div className="mb-4 flex items-center justify-between"><div><div className="flex items-center gap-2 text-base font-semibold"><Sparkles size={16} style={{ color: S.primary }} />会员关系待办</div><div className="mt-1 text-xs" style={{ color: S.muted }}>需要人工服务的会员，客观结果由 AI 或外部系统同步</div></div><button onClick={() => navigate("users")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: S.primary }}>查看全部 <ChevronRight size={14} /></button></div>
            <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${S.border}` }}>
              <div className="grid grid-cols-[1.3fr_1.1fr_1fr_.8fr] gap-3 px-4 py-3 text-[11px] font-semibold" style={{ color: S.muted, background: S.bg }}><span>会员</span><span>服务任务</span><span>状态</span><span>下一步</span></div>
              {visibleQueue.map(item => <button key={item.id} onClick={() => navigate(item.targetModule)} className="grid w-full grid-cols-[1.3fr_1.1fr_1fr_.8fr] items-center gap-3 px-4 py-3 text-left text-xs transition-colors hover:bg-black/[.02]" style={{ color: S.text, borderTop: `1px solid ${S.border}` }}><span><strong className="font-semibold">{item.member}</strong><span className="ml-2 rounded-full px-2 py-0.5 text-[10px]" style={{ background: S.primaryLight, color: S.primaryDark }}>{item.tag}</span></span><span style={{ color: S.textSec }}>{item.task}</span><span><span className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ background: item.tone === "green" ? S.successBg : item.tone === "blue" ? "#edf5fa" : S.warningBg, color: item.tone === "green" ? S.success : item.tone === "blue" ? "#5889a6" : S.warning }}>{item.status}</span></span><span className="flex items-center gap-1" style={{ color: S.muted }}>{item.status === "已通过" ? "已完成" : "去处理"}<ChevronRight size={13} /></span></button>)}
            </div>
            <button onClick={() => setShowAllQueue(value => !value)} className="mt-3 text-xs font-semibold" style={{ color: S.primary }}>{showAllQueue ? "收起待办" : "展开更多待办"}</button>
          </section>

          <section className="rounded-2xl p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, boxShadow: "0 12px 30px rgba(39,88,68,.05)" }}>
            <div className="flex items-start justify-between"><div><div className="text-base font-semibold">服务趋势</div><div className="mt-1 text-xs" style={{ color: S.muted }}>近 7 日人工服务完成量</div></div><div className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: S.successBg, color: S.success }}>持续上升</div></div>
            <div className="mt-6"><MiniTrend /></div>
            <div className="mt-4 flex items-center justify-between rounded-xl px-3 py-3" style={{ background: S.primaryLight }}><div><div className="text-xs" style={{ color: S.muted }}>今日已完成</div><div className="mt-1 text-xl font-semibold" style={{ color: S.primaryDark }}>82 <span className="text-xs font-normal">项任务</span></div></div><CheckCircle2 size={25} style={{ color: S.primary }} /></div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr_.9fr]">
          <section className="rounded-2xl p-5" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-base font-semibold"><CheckCircle2 size={16} style={{ color: S.primary }} />今日工作清单</div><span className="text-xs" style={{ color: S.muted }}>{completedTodos}/{todos.length} 已完成</span></div><div>{todos.map(item => <div key={item.id} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${S.border}`, opacity: item.done ? .55 : 1 }}><button onClick={() => toggleTodo(item.id)} className="flex h-5 w-5 items-center justify-center rounded-md" style={{ background: item.done ? S.primary : "transparent", border: `1px solid ${item.done ? S.primary : S.borderMed}`, color: S.surface }}>{item.done && <Check size={13} />}</button><button onClick={() => navigate(item.targetModule)} className="flex-1 text-left text-xs" style={{ color: S.textSec, textDecoration: item.done ? "line-through" : "none" }}>{item.text}</button><span className="flex items-center gap-1 text-[10px]" style={{ color: S.muted }}><Clock3 size={12} />{item.time}</span></div>)}</div></section>
          <section className="rounded-2xl p-5" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-base font-semibold"><Bot size={16} style={{ color: S.primary }} />AI 手机同步</div><button onClick={() => notify("正在刷新 AI 同步数据")} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: S.primaryLight, color: S.primaryDark }}><RefreshCw size={12} />刷新</button></div><div className="rounded-xl p-4" style={{ background: S.bg }}><div className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: S.success }} />同步正常</div><div className="mt-2 text-xs leading-5" style={{ color: S.muted }}>最近一次更新刚刚完成，已核验 1284 位会员的关系数据。</div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><div className="text-lg font-semibold" style={{ color: S.text }}>1,284</div><div className="text-[10px]" style={{ color: S.muted }}>已核验</div></div><div><div className="text-lg font-semibold" style={{ color: S.primary }}>1,198</div><div className="text-[10px]" style={{ color: S.muted }}>已通过</div></div><div><div className="text-lg font-semibold" style={{ color: S.warning }}>86</div><div className="text-[10px]" style={{ color: S.muted }}>待跟进</div></div></div></div></section>
          <section className="rounded-2xl p-5" style={{ background: S.primaryLight, border: `1px solid ${S.primaryMid}` }}><div className="mb-3 flex items-center gap-2 text-base font-semibold" style={{ color: S.primaryDark }}><AlertTriangle size={16} />运营提醒</div><div className="space-y-3 text-xs leading-5" style={{ color: S.textSec }}><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: S.warning }} />18 位会员超过 3 天未完成首次服务</div><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: S.primary }} />任务执行模式已对普通工作人员生效</div><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: S.primary }} />人工操作和客观结果持续分开记录</div></div><button onClick={() => navigate("reports")} className="mt-5 flex items-center gap-1 text-xs font-semibold" style={{ color: S.primaryDark }}>查看运营报告 <ChevronRight size={13} /></button></section>
        </div>
      </div>
    </div>
  );
}
