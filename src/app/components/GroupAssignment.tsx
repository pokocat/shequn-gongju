import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Zap, CheckCircle, ChevronRight, Users, AlertTriangle } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const pendingUsers = [
  { id: 1, name: "刘晓峰", phone: "138-9876-5432", identity: "PRO会员", city: "北京", source: "公众号", referrer: "吴思远" },
  { id: 2, name: "赵雨晴", phone: "139-8765-4321", identity: "体验官", city: "上海", source: "小红书", referrer: "—" },
  { id: 3, name: "孙伟明", phone: "152-7654-3210", identity: "PRO会员", city: "上海", source: "代理推荐", referrer: "林小燕" },
  { id: 4, name: "钱美艳", phone: "186-6543-2109", identity: "游客", city: "广州", source: "抖音", referrer: "—" },
  { id: 5, name: "周建军", phone: "135-5432-1098", identity: "代理", city: "深圳", source: "朋友圈", referrer: "李梦华" },
  { id: 6, name: "吴小燕", phone: "158-4321-0987", identity: "体验官", city: "北京", source: "转介绍", referrer: "吴思远" },
  { id: 7, name: "郑浩然", phone: "139-3210-9876", identity: "PRO会员", city: "成都", source: "官网", referrer: "—" },
  { id: 8, name: "陈小芳", phone: "133-2109-8765", identity: "游客", city: "杭州", source: "微博", referrer: "—" },
];

const availableGroups = [
  { id: 1, name: "北京PRO会员群01", city: "北京", type: "PRO会员", capacity: 487, max: 500, teacher: "吴思远", score: 96 },
  { id: 2, name: "北京体验官群01", city: "北京", type: "体验官", capacity: 123, max: 200, teacher: "吴思远", score: 88 },
  { id: 3, name: "北京PRO会员群02（备用）", city: "北京", type: "PRO会员", capacity: 12, max: 500, teacher: "待分配", score: 70 },
  { id: 4, name: "上海PRO会员群01", city: "上海", type: "PRO会员", capacity: 456, max: 500, teacher: "林小燕", score: 91 },
  { id: 5, name: "上海游客群01", city: "上海", type: "游客", capacity: 89, max: 200, teacher: "林小燕", score: 75 },
  { id: 6, name: "广州代理群01", city: "广州", type: "代理", capacity: 234, max: 300, teacher: "刘刚", score: 82 },
  { id: 7, name: "深圳代理群01", city: "深圳", type: "代理", capacity: 290, max: 300, teacher: "李梦华", score: 68 },
  { id: 8, name: "成都分站群01", city: "成都", type: "城市分站", capacity: 67, max: 200, teacher: "赵志远", score: 85 },
];

const assignedHistory = [
  { name: "张明辉", group: "上海PRO会员群01", time: "10分钟前", method: "AI推荐" },
  { name: "王丽娟", group: "北京体验官群01", time: "25分钟前", method: "人工调整" },
  { name: "李建国", group: "广州代理群01", time: "1小时前", method: "AI推荐" },
  { name: "陈晓燕", group: "深圳代理群01", time: "2小时前", method: "AI推荐" },
];

function getRecommendedGroup(user: (typeof pendingUsers)[0]) {
  return availableGroups
    .filter(g => g.city === user.city && (g.type === user.identity || (user.identity === "游客" && g.type === "游客")))
    .sort((a, b) => {
      const aPct = a.capacity / a.max;
      const bPct = b.capacity / b.max;
      if (aPct >= 0.98) return 1;
      if (bPct >= 0.98) return -1;
      return b.score - a.score;
    })
    .slice(0, 3);
}

export default function GroupAssignment({
 embedded = false }: { embedded?: boolean }) {
  useThemeSingleton();
const [selectedUser, setSelectedUser] = useState<number | null>(1);
  const [assignedGroupId, setAssignedGroupId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const user = pendingUsers.find(u => u.id === selectedUser);
  const recommendations = user ? getRecommendedGroup(user) : [];
  const filteredUsers = pendingUsers.filter(u => u.name.includes(search) || u.phone.includes(search) || u.city.includes(search));

  return (
    <div className={embedded ? "h-full flex flex-col gap-4" : "p-6 h-full flex flex-col gap-4"} style={{ background: S.bg, fontFamily: "monospace" }}>
      {!embedded && <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>群分配</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>根据用户属性智能推荐合适群组，支持人工调整</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5" style={{ background: "#fff8e1", color: "#b45309", borderRadius: S.radiusSm, fontFamily: "monospace", fontWeight: "bold" }}>
          <AlertTriangle size={12} /> 待分配 {pendingUsers.length} 人
        </div>
      </div>}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: pending users */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <Search size={12} style={{ color: S.muted }} />
            <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索待分配用户..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="text-xs px-1" style={{ color: S.muted, fontFamily: "monospace" }}>待分配用户 ({filteredUsers.length})</div>
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {filteredUsers.map(u => {
              const isSelected = selectedUser === u.id;
              return (
                <div
                  key={u.id}
                  className="p-3 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? "rgba(59,130,246,0.08)" : S.surface,
                    border: `1px solid ${isSelected ? S.borderMed : S.border}`,
                    borderLeft: isSelected ? `3px solid ${S.accent}` : `1px solid ${S.border}`,
                    borderRadius: S.radius,
                  }}
                  onClick={() => { setSelectedUser(u.id); setAssignedGroupId(null); }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#f1f5f9", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{u.name}</div>
                      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{u.city} · {u.identity}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: AI recommendation */}
        <div className="flex-1 flex flex-col gap-4">
          {user ? (
            <>
              {/* User info card */}
              <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={getAvatar(user.id - 1)} alt={user.name} style={{ width: 40, height: 40, borderRadius: S.radius, objectFit: "cover" }} />
                  <div>
                    <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{user.name}</div>
                    <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{user.phone}</div>
                  </div>
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                    {user.identity}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "城市", value: user.city },
                    { label: "来源渠道", value: user.source },
                    { label: "推荐人", value: user.referrer },
                  ].map(r => (
                    <div key={r.label} className="px-2.5 py-2" style={{ background: S.bg, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>
                      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{r.label}</div>
                      <div className="text-xs font-medium mt-0.5" style={{ color: S.textSec, fontFamily: "monospace" }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="p-4 flex-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 flex items-center justify-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}>
                    <Zap size={11} style={{ color: S.accent }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>AI 推荐群组</span>
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>根据城市、身份、群容量综合评分</span>
                </div>

                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((g, idx) => {
                      const pct = Math.round((g.capacity / g.max) * 100);
                      const isAssigned = assignedGroupId === g.id;
                      return (
                        <div
                          key={g.id}
                          className="p-3.5 transition-all"
                          style={{
                            background: isAssigned ? S.accentLight : "#f8f8f5",
                            border: isAssigned ? `1px solid ${S.borderMed}` : `1px solid ${S.border}`,
                            borderRadius: S.radius,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: idx === 0 ? "#1e293b" : "#f1f5f9", color: idx === 0 ? S.accent : S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{g.name}</span>
                                {idx === 0 && <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: "#f1f5f9", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>最佳推荐</span>}
                              </div>
                              <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: S.muted, fontFamily: "monospace" }}>
                                <span><Users size={10} className="inline mr-1" />{g.capacity}/{g.max}</span>
                                <span>服务老师：{g.teacher}</span>
                                <span style={{ color: S.text, fontWeight: "bold" }}>评分：{g.score}</span>
                              </div>
                              <div className="mt-2 h-1 overflow-hidden" style={{ background: S.border, borderRadius: "4px" }}>
                                <div className="h-full" style={{ width: `${pct}%`, background: pct >= 90 ? "#1e293b" : S.accent, borderRadius: "4px" }} />
                              </div>
                            </div>
                            {isAssigned ? (
                              <div className="flex items-center gap-1 text-xs px-2.5 py-1.5 flex-shrink-0 font-bold" style={{ background: "#f1f5f9", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                                <CheckCircle size={12} /> 已分配
                              </div>
                            ) : (
                              <button
                                className="px-2.5 py-1.5 text-xs flex-shrink-0 font-bold transition-all"
                                style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }}
                                onClick={() => setAssignedGroupId(g.id)}
                              >
                                分配
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8" style={{ color: S.muted }}>
                    <AlertTriangle size={24} className="mx-auto mb-2" />
                    <div className="text-sm" style={{ fontFamily: "monospace" }}>暂无匹配的群组</div>
                    <div className="text-xs mt-1" style={{ fontFamily: "monospace" }}>请手动选择或创建新群</div>
                  </div>
                )}

                {assignedGroupId && (
                  <div className="mt-4 flex items-center gap-2 p-3" style={{ background: S.accentMid, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <CheckCircle size={14} style={{ color: S.text }} />
                    <span className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>已成功分配至 {recommendations.find(g => g.id === assignedGroupId)?.name}，系统将向用户发送入群邀请</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="text-center" style={{ color: S.muted }}>
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <div className="text-sm" style={{ fontFamily: "monospace" }}>选择左侧待分配用户</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: recent assignments */}
        <div className="w-56 flex-shrink-0">
          <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusLg, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-sm font-bold mb-3" style={{ color: S.text, fontFamily: "monospace" }}>最近分配记录</div>
            <div className="space-y-3">
              {assignedHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ background: h.method === "AI推荐" ? "#1e293b" : "#3b82f6", borderRadius: "50%" }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: S.textSec, fontFamily: "monospace" }}>{h.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{h.group}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{h.time}</span>
                      <span className="px-1 py-0.5 text-xs font-bold" style={{ background: h.method === "AI推荐" ? "#1e293b" : "#3b82f6", color: h.method === "AI推荐" ? S.accent : "#ffffff", fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{h.method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs flex items-center justify-center gap-1 font-bold" style={{ background: S.bg, border: `1px solid rgba(0,0,0,0.10)`, color: S.muted, borderRadius: S.radius, fontFamily: "monospace" }}>
              查看全部 <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
