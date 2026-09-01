import { useState } from "react";
import { getAvatar } from "./Avatar";
import { Search, Plus, X, Tag, Users, TrendingUp, Star, Zap, ChevronRight, CheckSquare, Download } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const TAGS = [
  { name: "高价值客户", count: 124 },
  { name: "PRO会员",    count: 1023 },
  { name: "体验官",     count: 387 },
  { name: "代理商",     count: 134 },
  { name: "沉默用户",   count: 218 },
  { name: "流失风险",   count: 67 },
  { name: "高影响力",   count: 89 },
  { name: "新用户",     count: 156 },
  { name: "城市合伙人", count: 28 },
  { name: "潜在升级",   count: 203 },
];

const MOCK_USERS = [
  {
    id: 1, name: "张明远", avatar: "张", phone: "138****2341", city: "北京", level: "PRO会员",
    tags: ["PRO会员", "高价值客户", "高影响力"], spend: "¥12,840", lastActive: "1小时前",
    rfm: "冠军客户", influence: 96,
  },
  {
    id: 2, name: "李晓燕", avatar: "李", phone: "139****5678", city: "上海", level: "代理商",
    tags: ["代理商", "高价值客户", "城市合伙人"], spend: "¥28,400", lastActive: "3小时前",
    rfm: "忠实客户", influence: 88,
  },
  {
    id: 3, name: "王建国", avatar: "王", phone: "135****9012", city: "广州", level: "体验官",
    tags: ["体验官", "潜在升级"], spend: "¥3,200", lastActive: "昨天",
    rfm: "潜力客户", influence: 54,
  },
  {
    id: 4, name: "陈美玲", avatar: "陈", phone: "136****3456", city: "深圳", level: "PRO会员",
    tags: ["PRO会员", "新用户"], spend: "¥1,680", lastActive: "2天前",
    rfm: "新兴客户", influence: 41,
  },
  {
    id: 5, name: "刘志远", avatar: "刘", phone: "137****7890", city: "成都", level: "体验官",
    tags: ["体验官", "沉默用户"], spend: "¥890", lastActive: "18天前",
    rfm: "休眠客户", influence: 22,
  },
  {
    id: 6, name: "赵丽华", avatar: "赵", phone: "186****1234", city: "杭州", level: "普通用户",
    tags: ["流失风险", "沉默用户"], spend: "¥320", lastActive: "35天前",
    rfm: "流失风险", influence: 12,
  },
  {
    id: 7, name: "孙雨晴", avatar: "孙", phone: "188****5678", city: "北京", level: "代理商",
    tags: ["代理商", "高价值客户"], spend: "¥19,200", lastActive: "5小时前",
    rfm: "冠军客户", influence: 91,
  },
  {
    id: 8, name: "周国强", avatar: "周", phone: "150****9012", city: "上海", level: "PRO会员",
    tags: ["PRO会员", "高影响力", "潜在升级"], spend: "¥7,640", lastActive: "30分钟前",
    rfm: "忠实客户", influence: 79,
  },
];

const RFM_SEGMENTS = [
  { name: "冠军客户", desc: "高频购买、最近活跃、高消费", count: 89, r: 5, f: 5, m: 5, action: "给予专属特权" },
  { name: "忠实客户", desc: "高频购买、较高消费", count: 156, r: 4, f: 4, m: 4, action: "提供升级激励" },
  { name: "潜力客户", desc: "最近活跃但购买频次一般", count: 203, r: 4, f: 2, m: 3, action: "增加触达频次" },
  { name: "新兴客户", desc: "最近加入，低消费", count: 134, r: 5, f: 1, m: 1, action: "加强新手引导" },
  { name: "流失风险", desc: "曾经活跃，近期沉默", count: 67, r: 2, f: 3, m: 3, action: "发起召回活动" },
  { name: "已流失",   desc: "长期未活跃、低消费", count: 45, r: 1, f: 1, m: 1, action: "低成本唤醒尝试" },
  { name: "休眠客户", desc: "历史消费尚可但长期不活跃", count: 218, r: 1, f: 2, m: 2, action: "定向专属优惠" },
];

const rfmStyle = (name: string): { bg: string; color: string } => {
  if (name === "冠军客户" || name === "忠实客户") return { bg: S.accent, color: "#ffffff" };
  if (name === "流失风险" || name === "已流失")   return { bg: "#1e293b", color: S.accent };
  if (name === "潜力客户")                         return { bg: "#3b82f6", color: "#ffffff" };
  return { bg: "#f1f5f9", color: "#475569" };
};

const TOTAL_USERS = 1623;

function TagBadge({ name }: { name: string }) {
  const idx = TAGS.findIndex(t => t.name === name);
  const useDark = idx % 2 === 0;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold font-mono"
      style={{ background: useDark ? "#1e293b" : S.accent, color: useDark ? S.accent : "#ffffff", borderRadius: S.radiusSm }}>
      {name}
    </span>
  );
}

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="h-1.5 w-4"
          style={{ background: i < value ? S.accent : "rgba(0,0,0,0.08)", borderRadius: "2px" }} />
      ))}
    </div>
  );
}

export default function UserSegment() {
  useThemeSingleton();
const [activeView, setActiveView] = useState<"用户列表" | "RFM分层" | "标签分析">("用户列表");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [rfmFilter, setRfmFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredUsers = MOCK_USERS.filter(u => {
    const matchSearch = !search || u.name.includes(search) || u.phone.includes(search) || u.city.includes(search);
    const matchTag = selectedTags.length === 0 || selectedTags.some(t => u.tags.includes(t));
    const matchRfm = !rfmFilter || u.rfm === rfmFilter;
    return matchSearch && matchTag && matchRfm;
  });

  const toggleTag = (name: string) => {
    setSelectedTags(prev => prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]);
    setRfmFilter(null);
  };

  const toggleUser = (id: number) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedUsers.length === filteredUsers.length) setSelectedUsers([]);
    else setSelectedUsers(filteredUsers.map(u => u.id));
  };

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: "monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: S.text }}>用户画像与标签</h1>
          <p className="text-xs mt-0.5" style={{ color: S.muted }}>精细化用户分层，提升运营效率</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: S.muted }}>已选 {selectedUsers.length} 人</span>
              {["批量打标签", "批量发消息", "批量分配群", "导出名单"].map(action => (
                <button key={action} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors"
                  style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>
                  {action === "导出名单" && <Download size={12} />}
                  {action}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1 p-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            {(["用户列表", "RFM分层", "标签分析"] as const).map(tab => (
              <button key={tab} onClick={() => { setActiveView(tab); setSelectedUsers([]); }}
                className="px-4 py-1.5 text-sm font-bold transition-all"
                style={{ background: activeView === tab ? "#1e293b" : "transparent", color: activeView === tab ? S.accent : S.muted, borderRadius: S.radiusSm }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 用户列表 view */}
      {activeView === "用户列表" && (
        <div className="flex gap-4">
          {/* Tag Sidebar */}
          <div className="flex-shrink-0 w-60 p-4 space-y-2" style={{ background: "#f1f5f9", border: `1px solid rgba(0,0,0,0.08)`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag size={14} style={{ color: S.text }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>标签库</span>
              </div>
              <button className="w-6 h-6 flex items-center justify-center font-bold" style={{ color: S.onPrimary, background: S.accent, borderRadius: S.radiusSm }}>
                <Plus size={14} />
              </button>
            </div>

            <button onClick={() => { setSelectedTags([]); setRfmFilter(null); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
              style={{
                background: selectedTags.length === 0 && !rfmFilter ? S.accentLight : "transparent",
                color: selectedTags.length === 0 && !rfmFilter ? S.text : S.textSec,
                borderRadius: S.radiusSm,
                border: selectedTags.length === 0 && !rfmFilter ? `1px solid rgba(204,255,0,0.4)` : "1px solid transparent",
              }}>
              <div className="flex items-center gap-2">
                <Users size={13} />
                全部用户
              </div>
              <span className="text-xs font-bold" style={{ color: S.muted }}>{TOTAL_USERS}</span>
            </button>

            <div className="h-px my-2" style={{ background: S.border }} />

            <div className="space-y-1">
              {TAGS.map((tag, idx) => (
                <button key={tag.name} onClick={() => toggleTag(tag.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
                  style={{
                    background: selectedTags.includes(tag.name) ? S.accentLight : "transparent",
                    color: S.textSec,
                    borderRadius: S.radiusSm,
                    border: selectedTags.includes(tag.name) ? `1px solid rgba(204,255,0,0.4)` : "1px solid transparent",
                  }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2" style={{ background: selectedTags.includes(tag.name) ? S.accent : S.mutedLight, borderRadius: "50%" }} />
                    <span className="text-xs">{tag.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: S.mutedLight }}>{tag.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-3">
            {/* Search & filters */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: S.muted }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="搜索姓名、手机号、城市..."
                  className="w-full pl-9 pr-4 py-2 text-sm outline-none"
                  style={{ background: "#f1f5f9", border: `1px solid rgba(15,23,42,0.12)`, color: S.text, borderRadius: S.radiusSm }} />
              </div>
              {(selectedTags.length > 0 || rfmFilter) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold"
                      style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
                      {tag}
                      <button onClick={() => toggleTag(tag)}><X size={10} /></button>
                    </span>
                  ))}
                  {rfmFilter && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold"
                      style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>
                      {rfmFilter}
                      <button onClick={() => setRfmFilter(null)}><X size={10} /></button>
                    </span>
                  )}
                  <button onClick={() => { setSelectedTags([]); setRfmFilter(null); }}
                    className="text-xs" style={{ color: S.muted }}>清除全部</button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#1e293b" }}>
                    <th className="px-4 py-3 w-10" style={{ borderRadius: `${S.radius} 0 0 0` }}>
                      <button onClick={toggleAll} className="flex items-center justify-center">
                        <CheckSquare size={14} style={{ color: selectedUsers.length > 0 ? S.accent : S.mutedLight }} />
                      </button>
                    </th>
                    {["用户", "手机号", "城市", "等级", "标签", "总消费", "最近活跃", "RFM层级", "影响力"].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold" style={{ color: "#475569" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr key={user.id} style={{ borderTop: `1px solid ${S.border}`, background: i % 2 === 0 ? "#ffffff" : "#fafaf8" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(204,255,0,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#fafaf8")}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                          className="rounded" style={{ accentColor: S.accent }} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <img src={getAvatar(user.id - 1)} alt={user.name} style={{ width: 32, height: 32, borderRadius: S.radiusSm, objectFit: "cover" }} />
                          <span className="text-sm font-bold" style={{ color: S.text }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm" style={{ color: S.muted }}>{user.phone}</td>
                      <td className="px-3 py-3 text-sm" style={{ color: S.textSec }}>{user.city}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 font-bold"
                          style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>{user.level}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.tags.slice(0, 2).map(tag => <TagBadge key={tag} name={tag} />)}
                          {user.tags.length > 2 && (
                            <span className="text-[10px]" style={{ color: S.muted }}>+{user.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm font-bold" style={{ color: S.text }}>{user.spend}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: S.muted }}>{user.lastActive}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 font-bold"
                          style={{
                            background: rfmStyle(user.rfm).bg,
                            color: rfmStyle(user.rfm).color,
                            borderRadius: S.radiusSm,
                          }}>
                          {user.rfm}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-16" style={{ background: "rgba(0,0,0,0.08)", borderRadius: "2px" }}>
                            <div className="h-full" style={{ width: `${user.influence}%`, background: user.influence >= 80 ? S.accent : user.influence >= 50 ? "#1e293b" : S.mutedLight, borderRadius: "2px" }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: S.textSec }}>{user.influence}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-sm" style={{ color: S.muted }}>
                        暂无符合条件的用户
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RFM分层 view */}
      {activeView === "RFM分层" && (
        <div className="space-y-5">
          <div className="p-4 flex items-start gap-3" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
            <Zap size={16} style={{ color: "#1e293b", marginTop: 2 }} />
            <div>
              <div className="text-sm font-bold mb-1" style={{ color: S.text }}>RFM模型说明</div>
              <div className="text-xs" style={{ color: S.textSec }}>
                RFM模型通过三个维度评估用户价值：<strong>R (Recency)</strong> 最近购买时间、<strong>F (Frequency)</strong> 购买频次、<strong>M (Monetary)</strong> 消费金额。点击卡片可筛选对应层级的用户列表。
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {RFM_SEGMENTS.map(seg => {
              const st = rfmStyle(seg.name);
              return (
                <div key={seg.name}
                  className="p-5 cursor-pointer transition-all"
                  style={{
                    background: S.surface,
                    border: `1px solid ${rfmFilter === seg.name ? "rgba(204,255,0,0.5)" : S.border}`,
                    borderRadius: S.radius,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(204,255,0,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = S.surface)}
                  onClick={() => { setRfmFilter(rfmFilter === seg.name ? null : seg.name); setActiveView("用户列表"); }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold px-2.5 py-1"
                      style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm }}>{seg.name}</span>
                    <span className="text-lg font-bold" style={{ color: S.text }}>{seg.count}</span>
                  </div>
                  <div className="text-xs mb-4 font-mono" style={{ color: S.muted }}>{seg.desc}</div>
                  <div className="space-y-2">
                    {[
                      { label: "R (最近)", value: seg.r },
                      { label: "F (频次)", value: seg.f },
                      { label: "M (消费)", value: seg.m },
                    ].map(dim => (
                      <div key={dim.label}>
                        <div className="flex items-center justify-between text-[10px] mb-1 font-mono" style={{ color: S.muted }}>
                          <span>{dim.label}</span>
                          <span>{dim.value}/5</span>
                        </div>
                        <ScoreBar value={dim.value} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: S.border }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 font-bold" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm }}>
                        {seg.action}
                      </span>
                      <ChevronRight size={14} style={{ color: S.mutedLight }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 标签分析 view */}
      {activeView === "标签分析" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {TAGS.map((tag, idx) => {
              const pct = Math.round((tag.count / TOTAL_USERS) * 100);
              const useDark = idx % 2 === 0;
              return (
                <div key={tag.name} className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3" style={{ background: useDark ? "#1e293b" : S.accent, borderRadius: "50%" }} />
                    <span className="text-sm font-bold" style={{ color: S.text }}>{tag.name}</span>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: S.text }}>{tag.count}</div>
                      <div className="text-xs font-mono" style={{ color: S.muted }}>占全部用户 {pct}%</div>
                    </div>
                    <TrendingUp size={20} style={{ color: useDark ? "#1e293b" : S.accent, opacity: 0.8 }} />
                  </div>
                  <div className="h-2 mb-3" style={{ background: "rgba(15,23,42,0.06)", borderRadius: "4px" }}>
                    <div className="h-full" style={{ width: `${pct}%`, background: useDark ? "#1e293b" : S.accent, borderRadius: "4px" }} />
                  </div>
                  <button
                    onClick={() => { toggleTag(tag.name); setActiveView("用户列表"); }}
                    className="w-full py-1.5 text-xs font-bold transition-colors"
                    style={{ background: useDark ? "#1e293b" : S.accent, color: useDark ? S.accent : "#ffffff", borderRadius: S.radiusSm }}>
                    查看用户
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
