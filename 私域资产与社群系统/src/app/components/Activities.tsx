import { useState } from "react";
import { getAvatar } from "./Avatar";
import {
  Plus, ChevronLeft, Search, Download, Bell, Calendar, MapPin,
  Users, Target, Copy, Settings, Eye, X, Check, ChevronRight,
  Megaphone, BookOpen, Coffee, Flame
} from "lucide-react";

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

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  "进行中":  { bg: S.accent,   color: S.text },
  "即将开始": { bg: "#1a1a1a", color: "#ffffff" },
  "已结束":  { bg: "#f0f0ec",  color: "#333333" },
};

const TYPE_BADGE: Record<string, { bg: string; color: string }> = {
  "限时活动": { bg: "#1a1a1a", color: S.accent },
  "常规课程": { bg: "#ffd600", color: S.text },
  "线下沙龙": { bg: S.accent,  color: S.text },
  "打卡挑战": { bg: "#f0f0ec", color: "#333333" },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  "限时活动": <Megaphone size={20} />,
  "常规课程": <BookOpen size={20} />,
  "线下沙龙": <Coffee size={20} />,
  "打卡挑战": <Flame size={20} />,
};

const BANNER_BG: Record<string, string> = {
  "限时活动": "#1a1a1a",
  "常规课程": "#ffd600",
  "线下沙龙": S.accent,
  "打卡挑战": "#f0f0ec",
};

const BANNER_TC: Record<string, string> = {
  "限时活动": S.accent,
  "常规课程": S.text,
  "线下沙龙": S.text,
  "打卡挑战": "#333333",
};

interface Activity {
  id: number;
  name: string;
  type: "限时活动" | "常规课程" | "线下沙龙" | "打卡挑战";
  status: "进行中" | "即将开始" | "已结束";
  dateRange: string;
  location: string;
  registered: number;
  capacity: number | null;
  targetUser: string;
  extra?: string;
}

const mockActivities: Activity[] = [
  { id: 1, name: "7月PRO会员特训营", type: "限时活动", status: "进行中", dateRange: "2026-07-01 ~ 2026-07-31", location: "线上", registered: 78, capacity: 100, targetUser: "PRO会员" },
  { id: 2, name: "北京城市分享会", type: "线下沙龙", status: "进行中", dateRange: "2026-07-10", location: "北京", registered: 45, capacity: 60, targetUser: "VIP+PRO" },
  { id: 3, name: "新手体验官7日打卡", type: "打卡挑战", status: "进行中", dateRange: "常规打卡", location: "线上", registered: 234, capacity: null, targetUser: "体验官", extra: "已参与234人" },
  { id: 4, name: "8月代理商培训大会", type: "常规课程", status: "即将开始", dateRange: "2026-08-01", location: "线上", registered: 12, capacity: 50, targetUser: "代理商" },
  { id: 5, name: "成都线下沙龙", type: "线下沙龙", status: "即将开始", dateRange: "2026-08-15", location: "成都", registered: 8, capacity: 30, targetUser: "VIP" },
  { id: 6, name: "6月打卡挑战", type: "打卡挑战", status: "已结束", dateRange: "2026-06-01 ~ 2026-06-30", location: "线上", registered: 189, capacity: null, targetUser: "体验官", extra: "完成率82% · 参与189人" },
  { id: 7, name: "5月线上特训营", type: "限时活动", status: "已结束", dateRange: "2026-05-01 ~ 2026-05-31", location: "线上", registered: 156, capacity: null, targetUser: "全部", extra: "转化率34% · 参与156人" },
];

interface Registrant {
  id: number;
  avatar: string;
  name: string;
  level: string;
  time: string;
  city: string;
  status: "已报名" | "已取消" | "已签到";
}

const mockRegistrants: Registrant[] = [
  { id: 1, avatar: "李", name: "李云天", level: "PRO", time: "2026-07-01 09:12", city: "北京", status: "已签到" },
  { id: 2, avatar: "张", name: "张晓红", level: "体验官", time: "2026-07-01 10:30", city: "上海", status: "已报名" },
  { id: 3, avatar: "王", name: "王建国", level: "VIP", time: "2026-07-02 14:23", city: "广州", status: "已报名" },
  { id: 4, avatar: "陈", name: "陈美玲", level: "PRO", time: "2026-07-02 16:45", city: "成都", status: "已取消" },
  { id: 5, avatar: "赵", name: "赵志远", level: "PRO", time: "2026-07-03 11:00", city: "深圳", status: "已签到" },
  { id: 6, avatar: "孙", name: "孙伟明", level: "VIP", time: "2026-07-03 08:20", city: "上海", status: "已报名" },
  { id: 7, avatar: "刘", name: "刘晓峰", level: "体验官", time: "2026-07-04 15:30", city: "北京", status: "已报名" },
  { id: 8, avatar: "吴", name: "吴思远", level: "PRO", time: "2026-07-04 19:00", city: "广州", status: "已签到" },
];

const REGISTRANT_STATUS: Record<string, { bg: string; color: string }> = {
  "已报名": { bg: "#1a1a1a",  color: "#ffffff" },
  "已取消": { bg: "#f0f0ec",  color: "#333333" },
  "已签到": { bg: S.accent,   color: S.text },
};

const TABS = ["全部活动", "进行中", "即将开始", "已结束"];

interface ModalState {
  step: number; name: string; type: string; dateStart: string; dateEnd: string;
  location: string; targetUser: string; capacity: string; intro: string;
  questionnaire: boolean; paid: boolean; channels: string[]; scheduledTime: string;
}

const DEFAULT_MODAL: ModalState = {
  step: 1, name: "", type: "限时活动", dateStart: "", dateEnd: "",
  location: "", targetUser: "全部", capacity: "", intro: "",
  questionnaire: false, paid: false, channels: [], scheduledTime: "",
};

export default function Activities() {
  const [tab, setTab] = useState("全部活动");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalState>(DEFAULT_MODAL);
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);
  const [selectedRegistrants, setSelectedRegistrants] = useState<number[]>([]);

  const filtered = mockActivities.filter(a => {
    const matchTab = tab === "全部活动" || a.status === tab;
    const matchSearch = a.name.includes(search) || a.location.includes(search) || a.targetUser.includes(search);
    return matchTab && matchSearch;
  });

  const statCards = [
    { label: "进行中活动数", value: "3", sub: "本月新增1个", bg: S.accent,   tc: S.text },
    { label: "本月参与人次", value: "557", sub: "较上月+23%", bg: "#1a1a1a",  tc: S.accent },
    { label: "平均转化率",  value: "28.4%", sub: "较上月+5.2%", bg: "#ffd600", tc: S.text },
    { label: "活动带来新会员", value: "89", sub: "本月累计", bg: "#f0f0ec",   tc: "#333333" },
  ];

  function openModal() { setModal(DEFAULT_MODAL); setShowModal(true); }
  function toggleChannel(ch: string) {
    setModal(m => ({ ...m, channels: m.channels.includes(ch) ? m.channels.filter(c => c !== ch) : [...m.channels, ch] }));
  }
  function toggleRegistrant(id: number) {
    setSelectedRegistrants(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  // Registrant list view
  if (viewActivity) {
    return (
      <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 16, background: S.bg, fontFamily: "monospace" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => { setViewActivity(null); setSelectedRegistrants([]); }}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: S.text, background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}
          >
            <ChevronLeft size={16} /> 返回活动列表
          </button>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: BANNER_BG[viewActivity.type], color: BANNER_TC[viewActivity.type], borderRadius: S.radiusSm }}>
            {TYPE_ICON[viewActivity.type]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: S.text, fontFamily: "monospace" }}>{viewActivity.name}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: S.radiusSm, fontWeight: 700, fontFamily: "monospace", background: STATUS_STYLES[viewActivity.status].bg, color: STATUS_STYLES[viewActivity.status].color }}>
                {viewActivity.status}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
              {[{ Icon: Calendar, val: viewActivity.dateRange }, { Icon: MapPin, val: viewActivity.location }, { Icon: Target, val: viewActivity.targetUser }].map(({ Icon, val }) => (
                <span key={val} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: S.muted, fontFamily: "monospace" }}>
                  <Icon size={11} /> {val}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{viewActivity.registered}</div>
            <div style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>已报名{viewActivity.capacity ? `/${viewActivity.capacity}` : ""}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <Search size={14} style={{ color: S.muted }} />
              <input placeholder="搜索报名者…" style={{ outline: "none", fontSize: 13, width: 128, color: S.text, background: "transparent", fontFamily: "monospace", border: "none" }} />
            </div>
            {selectedRegistrants.length > 0 && (
              <span style={{ fontSize: 11, padding: "4px 8px", background: S.accent, color: S.text, fontFamily: "monospace", fontWeight: 700, borderRadius: S.radiusSm }}>
                已选 {selectedRegistrants.length} 人
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, border: `1px solid ${S.border}`, color: S.text, background: S.surface, fontFamily: "monospace", cursor: "pointer" }}>
              <Download size={13} /> 批量导出
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, border: `1px solid ${S.border}`, color: S.text, background: S.surface, fontFamily: "monospace", cursor: "pointer" }}>
              <Bell size={13} /> 批量发通知
            </button>
          </div>
        </div>

        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", flex: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
            <thead>
              <tr style={{ background: "#1a1a1a" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", width: 40 }}>
                  <input type="checkbox" style={{ accentColor: S.accent }}
                    onChange={e => setSelectedRegistrants(e.target.checked ? mockRegistrants.map(r => r.id) : [])}
                    checked={selectedRegistrants.length === mockRegistrants.length} />
                </th>
                {["编号", "姓名", "会员等级", "报名时间", "城市", "状态", "操作"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#555555", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRegistrants.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < mockRegistrants.length - 1 ? `1px solid ${S.border}` : "none", background: i % 2 === 0 ? S.surface : "#fafaf8" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(204,255,0,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? S.surface : "#fafaf8")}>
                  <td style={{ padding: "12px 16px" }}>
                    <input type="checkbox" style={{ accentColor: S.accent }} checked={selectedRegistrants.includes(r.id)} onChange={() => toggleRegistrant(r.id)} />
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: S.muted, fontFamily: "monospace" }}>#{String(r.id).padStart(3, "0")}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={getAvatar(r.id - 1)} alt={r.name} style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: S.radiusSm, fontWeight: 700, fontFamily: "monospace", background: S.accent, color: S.text }}>{r.level}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: S.muted, fontFamily: "monospace" }}>{r.time}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: S.textSec, fontFamily: "monospace" }}>{r.city}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: S.radiusSm, fontWeight: 700, fontFamily: "monospace", background: REGISTRANT_STATUS[r.status].bg, color: REGISTRANT_STATUS[r.status].color }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ fontSize: 11, color: S.text, fontWeight: 700, fontFamily: "monospace", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>查看详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 16, background: S.bg, fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: S.text, fontFamily: "monospace" }}>活动运营</h2>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: S.muted, fontFamily: "monospace" }}>管理活动、课程、线下沙龙与打卡挑战</p>
        </div>
        <button onClick={openModal}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: S.radius, fontSize: 13, fontWeight: 700, color: S.accent, background: "#0d0d0d", border: "none", cursor: "pointer", fontFamily: "monospace" }}>
          <Plus size={15} /> 新建活动
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {statCards.map(c => (
          <div key={c.label} style={{ padding: 16, background: c.bg, border: `1px solid rgba(0,0,0,0.08)`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 10, marginBottom: 8, color: c.tc, fontFamily: "monospace", opacity: 0.75 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: c.tc, fontFamily: "monospace" }}>{c.value}</div>
            <div style={{ fontSize: 10, color: c.tc, fontFamily: "monospace", opacity: 0.75 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 4, background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "8px 16px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", border: "none",
                background: tab === t ? "#0d0d0d" : "transparent",
                color: tab === t ? S.accent : S.muted,
              }}>
              {t}
              {t !== "全部活动" && (
                <span style={{ marginLeft: 6, fontSize: 10, padding: "1px 5px", fontFamily: "monospace", fontWeight: 700, borderRadius: S.radiusSm, background: tab === t ? S.accent : "rgba(0,0,0,0.06)", color: tab === t ? S.text : S.muted }}>
                  {mockActivities.filter(a => a.status === t).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <Search size={14} style={{ color: S.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="搜索活动名称、地点、对象…" style={{ outline: "none", fontSize: 12, width: 176, color: S.text, background: "transparent", fontFamily: "monospace", border: "none" }} />
        </div>
      </div>

      {/* Activity grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, overflowY: "auto", flex: 1, paddingBottom: 8 }}>
        {filtered.map(a => {
          const pct = a.capacity ? Math.round((a.registered / a.capacity) * 100) : null;
          const bannerBg = BANNER_BG[a.type];
          const bannerTc = BANNER_TC[a.type];
          return (
            <div key={a.id} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              {/* Banner */}
              <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, background: bannerBg, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", color: bannerTc, borderRadius: S.radiusSm }}>
                  {TYPE_ICON[a.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: bannerTc, fontFamily: "monospace" }}>{a.name}</div>
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: S.radiusSm, fontWeight: 700, marginTop: 2, display: "inline-block", fontFamily: "monospace", background: "rgba(255,255,255,0.2)", color: bannerTc }}>
                    {a.type}
                  </span>
                </div>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: S.radiusSm, fontWeight: 700, fontFamily: "monospace", background: STATUS_STYLES[a.status].bg, color: STATUS_STYLES[a.status].color }}>
                  {a.status}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  {[{ Icon: Calendar, val: a.dateRange }, { Icon: MapPin, val: a.location }, { Icon: Target, val: a.targetUser }].map(({ Icon, val }) => (
                    <span key={val} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: S.muted, fontFamily: "monospace" }}>
                      <Icon size={12} /> {val}
                    </span>
                  ))}
                </div>

                {/* Progress or extra */}
                {a.capacity ? (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, color: S.muted, fontFamily: "monospace" }}>
                      <span>已报名 {a.registered}/{a.capacity}</span>
                      <span style={{ color: pct! >= 80 ? S.text : S.muted, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: "4px", overflow: "hidden", background: "rgba(0,0,0,0.08)" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct! >= 80 ? "#0d0d0d" : S.accent, borderRadius: "4px" }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={12} style={{ color: S.muted }} />
                      <span style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>{a.extra || `参与${a.registered}人`}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setViewActivity(a)}
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", background: S.accent, color: S.text, border: "none" }}>
                    <Eye size={12} /> 查看报名
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", color: S.text, border: `1px solid ${S.border}`, background: S.surface }}>
                    <Settings size={12} /> 管理
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", color: S.text, border: `1px solid ${S.border}`, background: S.surface }}>
                    <Copy size={12} /> 复制
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "span 2", paddingTop: 64, textAlign: "center", color: S.muted, fontFamily: "monospace" }}>
            暂无匹配活动
          </div>
        )}
      </div>

      {/* New Activity Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ width: 560, background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${S.border}`, background: "#0d0d0d", borderRadius: `${S.radiusLg} ${S.radiusLg} 0 0` }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, color: S.accent, fontFamily: "monospace" }}>新建活动</h3>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: S.mutedLight, fontFamily: "monospace" }}>步骤 {modal.step} / 3</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: 6, color: S.mutedLight, background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {/* Step indicator */}
            <div style={{ padding: "16px 24px 0", display: "flex", alignItems: "center", gap: 8 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "monospace", borderRadius: S.radiusSm, background: s <= modal.step ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: s <= modal.step ? S.accent : S.muted }}>
                    {s < modal.step ? <Check size={13} /> : s}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: s === modal.step ? S.text : S.mutedLight }}>
                    {["基本信息", "详情配置", "推送设置"][s - 1]}
                  </span>
                  {s < 3 && <ChevronRight size={14} style={{ color: S.mutedLight }} />}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {modal.step === 1 && (
                <>
                  <FieldRow label="活动名称">
                    <input value={modal.name} onChange={e => setModal(m => ({ ...m, name: e.target.value }))}
                      placeholder="请输入活动名称" style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                  </FieldRow>
                  <FieldRow label="活动类型">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["限时活动", "常规课程", "线下沙龙", "打卡挑战"].map(t => (
                        <button key={t} onClick={() => setModal(m => ({ ...m, type: t }))}
                          style={{ padding: "6px 14px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", background: modal.type === t ? "#0d0d0d" : "#f8f8f5", color: modal.type === t ? S.accent : S.textSec, border: `1px solid ${modal.type === t ? "#0d0d0d" : S.border}` }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </FieldRow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FieldRow label="开始日期">
                      <input type="date" value={modal.dateStart} onChange={e => setModal(m => ({ ...m, dateStart: e.target.value }))}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                    </FieldRow>
                    <FieldRow label="结束日期">
                      <input type="date" value={modal.dateEnd} onChange={e => setModal(m => ({ ...m, dateEnd: e.target.value }))}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                    </FieldRow>
                  </div>
                  <FieldRow label="地点">
                    <input value={modal.location} onChange={e => setModal(m => ({ ...m, location: e.target.value }))}
                      placeholder="线上 / 城市名称" style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                  </FieldRow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FieldRow label="目标用户">
                      <select value={modal.targetUser} onChange={e => setModal(m => ({ ...m, targetUser: e.target.value }))}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }}>
                        {["全部", "PRO会员", "VIP", "体验官", "代理商", "VIP+PRO"].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </FieldRow>
                    <FieldRow label="容量上限">
                      <input type="number" value={modal.capacity} onChange={e => setModal(m => ({ ...m, capacity: e.target.value }))}
                        placeholder="留空表示不限" style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                    </FieldRow>
                  </div>
                </>
              )}
              {modal.step === 2 && (
                <>
                  <FieldRow label="活动介绍">
                    <textarea value={modal.intro} onChange={e => setModal(m => ({ ...m, intro: e.target.value }))}
                      rows={4} placeholder="详细介绍活动内容、亮点、收益…"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", resize: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                  </FieldRow>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, background: "#f7f7f7" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>开启报名问卷</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: S.muted, fontFamily: "monospace" }}>报名时收集用户信息</div>
                    </div>
                    <Toggle value={modal.questionnaire} onChange={v => setModal(m => ({ ...m, questionnaire: v }))} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, background: "#f7f7f7" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>收费活动</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: S.muted, fontFamily: "monospace" }}>需要用户付费参与</div>
                    </div>
                    <Toggle value={modal.paid} onChange={v => setModal(m => ({ ...m, paid: v }))} />
                  </div>
                  <div style={{ border: `2px dashed ${S.borderMed}`, borderRadius: S.radiusSm, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "24px 0" }}>
                    <div style={{ fontSize: 13, color: S.muted, fontFamily: "monospace" }}>点击或拖拽上传活动海报</div>
                    <div style={{ fontSize: 11, color: S.mutedLight, fontFamily: "monospace" }}>支持 JPG / PNG，建议尺寸 1080×1920</div>
                    <button style={{ marginTop: 4, padding: "6px 16px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, border: "none", color: "#000", background: S.accent, fontFamily: "monospace", cursor: "pointer" }}>选择文件</button>
                  </div>
                </>
              )}
              {modal.step === 3 && (
                <>
                  <FieldRow label="推送渠道">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {["朋友圈", "群公告", "私信"].map(ch => (
                        <label key={ch} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: S.radiusSm, cursor: "pointer", border: `1px solid ${modal.channels.includes(ch) ? "rgba(204,255,0,0.4)" : S.border}`, background: modal.channels.includes(ch) ? S.accentLight : "#f8f8f5" }}>
                          <input type="checkbox" checked={modal.channels.includes(ch)} onChange={() => toggleChannel(ch)} style={{ accentColor: S.accent }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{ch}</span>
                          {modal.channels.includes(ch) && (
                            <span style={{ marginLeft: "auto", fontSize: 11, color: S.text, fontFamily: "monospace", fontWeight: 700 }}>已选</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </FieldRow>
                  <FieldRow label="定时发布">
                    <input type="datetime-local" value={modal.scheduledTime} onChange={e => setModal(m => ({ ...m, scheduledTime: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: S.radiusSm, fontSize: 13, outline: "none", border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", boxSizing: "border-box" }} />
                  </FieldRow>
                  <div style={{ padding: 12, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.3)`, background: S.accentLight }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>发布预览</div>
                    <div style={{ fontSize: 11, marginTop: 4, color: S.text, fontFamily: "monospace" }}>
                      活动「{modal.name || "（未命名）"}」将于
                      {modal.scheduledTime ? ` ${modal.scheduledTime} ` : "立即"}
                      通过 {modal.channels.length > 0 ? modal.channels.join("、") : "（未选渠道）"} 推送
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: `1px solid ${S.border}` }}>
              <button
                onClick={() => modal.step > 1 ? setModal(m => ({ ...m, step: m.step - 1 })) : setShowModal(false)}
                style={{ padding: "8px 16px", borderRadius: S.radiusSm, fontSize: 13, fontWeight: 700, border: `1px solid ${S.border}`, color: S.text, background: "#f7f7f7", fontFamily: "monospace", cursor: "pointer" }}>
                {modal.step > 1 ? "上一步" : "取消"}
              </button>
              <button
                onClick={() => modal.step < 3 ? setModal(m => ({ ...m, step: m.step + 1 })) : setShowModal(false)}
                style={{ padding: "8px 20px", borderRadius: S.radiusSm, fontSize: 13, fontWeight: 700, border: "none", background: "#0d0d0d", color: S.accent, fontFamily: "monospace", cursor: "pointer" }}>
                {modal.step < 3 ? "下一步" : "发布活动"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6, color: S.textSec, fontFamily: "monospace", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 40, height: 22, borderRadius: "11px", border: `1px solid ${value ? "rgba(204,255,0,0.5)" : S.border}`, position: "relative", cursor: "pointer", background: value ? S.accentLight : "rgba(0,0,0,0.06)", transition: "all 0.2s" }}>
      <div style={{
        position: "absolute", top: 3, width: 14, height: 14, background: value ? S.accent : S.mutedLight,
        transition: "left 0.15s", left: value ? "22px" : "2px", borderRadius: "50%",
      }} />
    </button>
  );
}
