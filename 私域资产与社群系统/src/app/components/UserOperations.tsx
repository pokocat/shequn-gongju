import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Phone, MessageCircle, ShoppingCart, Users, FileText, Star, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react";

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

const users = [
  { id: 1, name: "李云天", phone: "138-0123-4567", wechat: "liyuntian88", identity: "PRO会员", city: "北京", source: "公众号", referrer: "吴思远", group: "北京PRO会员群01", teacher: "吴思远", memberSince: "2025-03-15", tags: ["高价值", "活跃"], orders: [{ no: "ORD2025031501", product: "PRO会员年卡", amount: 2980, status: "已完成", date: "2025-03-15" }, { no: "ORD2026030101", product: "续费PRO年卡", amount: 2480, status: "已完成", date: "2026-03-01" }], tickets: [{ no: "TK2026070501", type: "功能咨询", status: "已解决", date: "2026-07-01" }], timeline: [{ action: "续费PRO会员", time: "2026-03-01", type: "order" }, { action: "提交工单：功能咨询", time: "2026-07-01", type: "ticket" }, { action: "服务老师回访", time: "2026-07-03", type: "visit" }] },
  { id: 2, name: "张晓红", phone: "139-0123-4568", wechat: "zhangxiaohong_sh", identity: "体验官", city: "上海", source: "小红书", referrer: "—", group: "上海游客群01", teacher: "林小燕", memberSince: "2026-06-20", tags: ["潜力用户"], orders: [{ no: "ORD2026062001", product: "体验营", amount: 980, status: "已完成", date: "2026-06-20" }], tickets: [], timeline: [{ action: "购买体验营", time: "2026-06-20", type: "order" }, { action: "加入上海游客群01", time: "2026-06-21", type: "group" }] },
  { id: 3, name: "王建国", phone: "158-0123-4569", wechat: "wangjg2023", identity: "代理", city: "广州", source: "代理推荐", referrer: "刘刚", group: "广州代理群01", teacher: "刘刚", memberSince: "2025-08-10", tags: ["代理", "退款风险"], orders: [{ no: "ORD2025081001", product: "代理授权费", amount: 4800, status: "退款中", date: "2025-08-10" }], tickets: [{ no: "TK2026070502", type: "退款跟进", status: "进行中", date: "2026-07-04" }], timeline: [{ action: "购买代理授权", time: "2025-08-10", type: "order" }, { action: "申请退款", time: "2026-07-03", type: "refund" }, { action: "提交工单：退款跟进", time: "2026-07-04", type: "ticket" }] },
  { id: 4, name: "陈美玲", phone: "137-0123-4570", wechat: "chenmeiling_cd", identity: "游客", city: "成都", source: "抖音", referrer: "—", group: "—", teacher: "待分配", memberSince: "2026-07-01", tags: ["待分配"], orders: [], tickets: [], timeline: [{ action: "注册账号", time: "2026-07-01", type: "register" }] },
];

const tabItems = ["基本信息", "订单记录", "群组信息", "工单记录", "操作日志"];

const statusBadge: Record<string, { bg: string; color: string }> = {
  "已完成": { bg: S.accent, color: "#000" },
  "退款中": { bg: "#1a1a1a", color: S.accent },
  "进行中": { bg: "#f0f0f0", color: "#333333" },
  "已解决": { bg: S.accent, color: "#000" },
};

export default function UserOperations() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState(0);

  const filtered = users.filter(u => u.name.includes(search) || u.phone.includes(search) || u.city.includes(search));
  const user = users.find(u => u.id === selectedId)!;

  return (
    <div className="p-6 h-full flex gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* User list */}
      <div className="w-60 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
          <Search size={12} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索用户..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{filtered.length} 名用户</div>
        <div className="flex-1 overflow-auto space-y-2">
          {filtered.map(u => (
            <div
              key={u.id}
              className="p-3 cursor-pointer transition-all"
              style={{
                background: selectedId === u.id ? S.accentMid : S.surface,
                border: `1px solid ${selectedId === u.id ? S.accent : S.border}`,
                borderLeft: selectedId === u.id ? `3px solid ${S.accent}` : `1px solid ${S.border}`,
                borderRadius: S.radius,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onClick={() => { setSelectedId(u.id); setActiveTab(0); }}
            >
              <div className="flex items-center gap-2">
                <img src={getAvatar(u.id - 1)} alt={u.name} style={{ width: 32, height: 32, borderRadius: S.radiusSm, objectFit: "cover", flexShrink: 0 }} />
                <div className="min-w-0">
                  <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{u.name}</div>
                  <div className="text-xs truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{u.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: selectedId === u.id ? "#1a1a1a" : "#f0f0ec", color: selectedId === u.id ? S.accent : S.textSec, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{u.identity}</span>
                {u.tags.includes("退款风险") && <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: "#f5f5f5", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>风险</span>}
                {u.tags.includes("待分配") && <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: "#fff8e1", color: "#b45309", fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>待分配</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main user detail */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* User header */}
        <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-start gap-4">
            <img src={getAvatar(user.id - 1)} alt={user.name} style={{ width: 56, height: 56, borderRadius: S.radius, objectFit: "cover", flexShrink: 0 }} />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{user.name}</span>
                <span className="px-2 py-0.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{user.identity}</span>
                {user.tags.includes("高价值") && <Star size={14} style={{ color: S.text }} />}
                {user.tags.includes("退款风险") && <AlertTriangle size={14} style={{ color: "#1a1a1a" }} />}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                <span><Phone size={11} className="inline mr-1" />{user.phone}</span>
                <span><MessageCircle size={11} className="inline mr-1" />{user.wechat}</span>
                <span>{user.city} · 入会 {user.memberSince}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#f0f0ec", color: S.text, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }}>发提醒</button>
              <button className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", border: "none", borderRadius: S.radius, fontFamily: "monospace" }}>分配群</button>
              <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
                <Plus size={12} className="inline mr-1" />建工单
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {[
              { label: "订单数", value: user.orders.length, icon: ShoppingCart },
              { label: "总消费", value: `¥${user.orders.reduce((s, o) => s + o.amount, 0).toLocaleString()}`, icon: null },
              { label: "所在群", value: user.group === "—" ? "未入群" : "已入群", icon: Users },
              { label: "工单数", value: user.tickets.length, icon: FileText },
              { label: "服务老师", value: user.teacher, icon: null },
            ].map((s, i) => (
              <div key={i} className="px-3 py-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{s.label}</div>
                <div className="text-sm font-bold mt-0.5" style={{ color: S.textSec, fontFamily: "monospace" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          {tabItems.map((t, i) => (
            <button
              key={i}
              className="flex-1 py-2.5 text-xs transition-all font-bold"
              style={{
                background: activeTab === i ? "#1a1a1a" : "transparent",
                color: activeTab === i ? S.accent : S.muted,
                borderBottom: activeTab === i ? `2px solid ${S.accent}` : `2px solid transparent`,
                borderRadius: 0,
                fontFamily: "monospace",
              }}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 p-4 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          {activeTab === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>基本资料</div>
                {[["姓名", user.name], ["手机号", user.phone], ["微信号", user.wechat], ["所在城市", user.city], ["用户身份", user.identity], ["入会时间", user.memberSince]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                    <span className="text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>服务信息</div>
                {[["来源渠道", user.source], ["推荐人", user.referrer], ["所在群", user.group], ["服务老师", user.teacher]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                    <span className="text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
                <div className="text-xs font-bold mt-4 mb-2" style={{ color: S.text, fontFamily: "monospace" }}>用户标签</div>
                <div className="flex flex-wrap gap-1.5">
                  {user.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs font-bold" style={{ background: "#f0f0ec", color: S.text, borderRadius: S.radiusSm, border: `1px solid ${S.border}`, fontFamily: "monospace" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-3">
              {user.orders.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>暂无订单记录</div>
              ) : user.orders.map(o => {
                const badge = statusBadge[o.status] ?? { bg: "#f0f0ec", color: "#555" };
                return (
                  <div key={o.no} className="flex items-center gap-4 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <ShoppingCart size={16} style={{ color: S.text }} />
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{o.product}</div>
                      <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{o.no} · {o.date}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>¥{o.amount.toLocaleString()}</div>
                    <span className="px-2 py-0.5 text-xs font-bold" style={{ background: badge.bg, color: badge.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{o.status}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 2 && (
            <div>
              {user.group === "—" ? (
                <div className="text-center py-8">
                  <Users size={24} className="mx-auto mb-2" style={{ color: S.muted }} />
                  <div className="text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>用户尚未分配群组</div>
                  <button className="mt-3 px-4 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>立即分配群组</button>
                </div>
              ) : (
                <div className="p-4" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                  <div className="flex items-center gap-3">
                    <Users size={18} style={{ color: S.text }} />
                    <div>
                      <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{user.group}</div>
                      <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>服务老师：{user.teacher}</div>
                    </div>
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>已入群</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-3">
              {user.tickets.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>暂无工单记录</div>
              ) : user.tickets.map(t => {
                const badge = statusBadge[t.status] ?? { bg: "#f0f0ec", color: "#555" };
                return (
                  <div key={t.no} className="flex items-center gap-4 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <FileText size={16} style={{ color: S.text }} />
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{t.type}</div>
                      <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{t.no} · {t.date}</div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold" style={{ background: badge.bg, color: badge.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{t.status}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 4 && (
            <div className="relative pl-4">
              <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: S.border }} />
              {user.timeline.map((e, i) => (
                <div key={i} className="relative flex items-start gap-3 mb-4">
                  <div className="absolute -left-3 w-2.5 h-2.5 flex-shrink-0 mt-0.5" style={{ background: S.accent, borderRadius: "50%", border: "2px solid #1a1a1a" }} />
                  <div className="ml-2">
                    <div className="text-xs font-bold" style={{ color: S.textSec, fontFamily: "monospace" }}>{e.action}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: S.muted, fontFamily: "monospace" }}>
                      <Clock size={10} />{e.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
