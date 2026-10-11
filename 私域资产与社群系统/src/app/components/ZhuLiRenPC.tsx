import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { S, useThemeSingleton } from "../theme";

type PanelId = "overview" | "tasks" | "team" | "projects";

const stats = [
  { label: "本月团队业绩", value: "¥128,600", detail: "+18.4% 较上月", icon: DollarSign },
  { label: "团队活跃成员", value: "86 人", detail: "68 人正在经营", icon: Users },
  { label: "进行中项目", value: "12 个", detail: "4 个待跟进", icon: Target },
  { label: "待处理任务", value: "7 项", detail: "今日需完成 3 项", icon: ClipboardList },
];

const tasks = [
  ["跟进 AI超级广告公司项目报名", "今天 18:00 前", "进行中"],
  ["审核团队成员入群申请", "还有 12 条", "待处理"],
  ["提交本周团队经营数据", "周五 18:00 前", "未开始"],
] as const;

const projects = [
  ["AI超级广告公司", "项目共创", "124 人参与", "经营中"],
  ["社群增长陪跑计划", "会员服务", "86 人关注", "报名中"],
  ["AI知识付费", "内容项目", "52 人参与", "经营中"],
] as const;

export default function ZhuLiRenPC() {
  useThemeSingleton();
  const [panel, setPanel] = useState<PanelId>("overview");

  return (
    <div className="min-h-full p-4 sm:p-6" style={{ background: S.bg }}>
      <div className="mx-auto max-w-[1320px] space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px]" style={{ color: S.muted }}>
              <span>主理人 PC</span>
              <ChevronRight size={12} />
              <span>经营工作台</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: S.text }}>主理人经营工作台</h1>
            <p className="mt-1 text-xs" style={{ color: S.muted }}>围绕团队、项目和经营任务，集中完成今日主理动作</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ color: S.textSec, background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <CalendarCheck size={14} /> 本周经营计划
            </button>
            <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ color: S.onPrimary, background: S.primary, borderRadius: S.radiusSm }}>
              <Plus size={14} /> 创建任务
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-xl border p-4" style={{ background: S.surface, borderColor: S.border }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: S.muted }}>{label}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: S.primaryLight, color: S.primary }}><Icon size={15} /></span>
              </div>
              <div className="mt-3 text-xl font-black" style={{ color: S.text }}>{value}</div>
              <div className="mt-1 text-[10px] font-bold" style={{ color: S.success }}>{detail}</div>
            </div>
          ))}
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <section className="rounded-xl border p-4 sm:p-5" style={{ background: S.surface, borderColor: S.border }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black" style={{ color: S.text }}>今日经营中心</h2>
                <p className="mt-1 text-[11px]" style={{ color: S.muted }}>主理人 PC 专属的任务和业务视图</p>
              </div>
              <div className="flex rounded-lg p-1" style={{ background: S.bg }}>
                {([["overview", "概览"], ["tasks", "任务"], ["team", "团队"], ["projects", "项目"]] as [PanelId, string][]).map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setPanel(id)} className="px-3 py-1.5 text-[11px] font-bold" style={{ color: panel === id ? S.primaryDark : S.muted, background: panel === id ? S.surface : "transparent", borderRadius: S.radiusSm }}>{label}</button>
                ))}
              </div>
            </div>
            {panel === "overview" && <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg p-4" style={{ background: S.primaryLight }}><MessageSquare size={17} style={{ color: S.primary }} /><div className="mt-3 text-sm font-bold" style={{ color: S.text }}>消息待办</div><div className="mt-1 text-[11px]" style={{ color: S.muted }}>11 条新消息等待处理</div></div><div className="rounded-lg p-4" style={{ background: S.accentLight }}><CheckCircle2 size={17} style={{ color: S.warning }} /><div className="mt-3 text-sm font-bold" style={{ color: S.text }}>经营进度</div><div className="mt-1 text-[11px]" style={{ color: S.muted }}>本周目标完成 68%</div></div><div className="rounded-lg p-4" style={{ background: "#eef1f7" }}><Bell size={17} style={{ color: "#5570a6" }} /><div className="mt-3 text-sm font-bold" style={{ color: S.text }}>服务提醒</div><div className="mt-1 text-[11px]" style={{ color: S.muted }}>3 位成员需要跟进</div></div></div>}
            {panel === "tasks" && <div className="mt-5 space-y-2">{tasks.map(([name, due, status]) => <button key={name} type="button" className="flex w-full items-center gap-3 rounded-lg border p-3 text-left" style={{ borderColor: S.border }}><span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: S.primaryLight, color: S.primary }}><ClipboardList size={14} /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold" style={{ color: S.text }}>{name}</span><span className="mt-1 block text-[10px]" style={{ color: S.muted }}>{due}</span></span><span className="text-[10px] font-bold" style={{ color: status === "进行中" ? S.primary : S.muted }}>{status}</span></button>)}</div>}
            {panel === "team" && <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border p-4" style={{ borderColor: S.border }}><div className="text-xs" style={{ color: S.muted }}>待跟进成员</div><div className="mt-2 text-2xl font-black" style={{ color: S.text }}>18</div><button type="button" className="mt-3 text-[11px] font-bold" style={{ color: S.primary }}>查看团队名单 <ChevronRight className="inline" size={12} /></button></div><div className="rounded-lg border p-4" style={{ borderColor: S.border }}><div className="text-xs" style={{ color: S.muted }}>本月新增成员</div><div className="mt-2 text-2xl font-black" style={{ color: S.text }}>24</div><button type="button" className="mt-3 text-[11px] font-bold" style={{ color: S.primary }}>查看增长明细 <ChevronRight className="inline" size={12} /></button></div></div>}
            {panel === "projects" && <div className="mt-5 space-y-2">{projects.map(([name, type, people, status]) => <button key={name} type="button" className="flex w-full items-center gap-3 rounded-lg border p-3 text-left" style={{ borderColor: S.border }}><span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: S.accentLight, color: S.warning }}><Target size={14} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold" style={{ color: S.text }}>{name}</span><span className="mt-1 block text-[10px]" style={{ color: S.muted }}>{type} · {people}</span></span><span className="text-[10px] font-bold" style={{ color: S.primary }}>{status}</span></button>)}</div>}
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border p-4" style={{ background: S.surface, borderColor: S.border }}><div className="flex items-center justify-between"><h2 className="text-sm font-black" style={{ color: S.text }}>主理人身份</h2><span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: S.primaryDark, background: S.primaryLight }}>D3 事业合伙人</span></div><div className="mt-4 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black" style={{ background: S.accentLight, color: S.warning }}>王</div><div><div className="text-sm font-bold" style={{ color: S.text }}>王总 · 创始人</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>主理人公社 · PC 工作台</div></div></div><button type="button" className="mt-4 w-full rounded-lg py-2 text-[11px] font-bold" style={{ color: S.primary, background: S.primaryLight }}>查看身份与权限</button></section>
            <section className="rounded-xl border p-4" style={{ background: S.surface, borderColor: S.border }}><h2 className="text-sm font-black" style={{ color: S.text }}>快捷入口</h2><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" className="rounded-lg p-3 text-left text-[11px] font-bold" style={{ background: S.bg, color: S.textSec }}>团队管理</button><button type="button" className="rounded-lg p-3 text-left text-[11px] font-bold" style={{ background: S.bg, color: S.textSec }}>经营报表</button><button type="button" className="rounded-lg p-3 text-left text-[11px] font-bold" style={{ background: S.bg, color: S.textSec }}>培训成长</button><button type="button" className="rounded-lg p-3 text-left text-[11px] font-bold" style={{ background: S.bg, color: S.textSec }}>收益结算</button></div></section>
          </aside>
        </div>
      </div>
    </div>
  );
}
