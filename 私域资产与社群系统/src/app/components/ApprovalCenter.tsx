import { useState } from "react";
import {
  Check, X, ChevronRight, Clock, AlertTriangle, FileText,
  CreditCard, UserCheck, UserPlus, ArrowRightLeft, Shield,
  MessageSquare, RotateCcw
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

type ApprovalStatus = "待审批" | "已同意" | "已拒绝" | "审批中";
type ApprovalType = "退款申请" | "账号交接" | "新账号申请" | "提现审批" | "权限变更";

const STATUS_CONFIG: Record<ApprovalStatus, { bg: string; color: string }> = {
  "待审批": { bg: "#ffd600",  color: "#000000" },
  "已同意": { bg: S.accent,   color: "#000000" },
  "已拒绝": { bg: "#1a1a1a",  color: S.accent },
  "审批中": { bg: "#1a1a1a",  color: "#ffffff" },
};

const TYPE_CONFIG: Record<ApprovalType, { bg: string; color: string; icon: React.ReactNode }> = {
  "退款申请": { bg: "#1a1a1a",  color: S.accent, icon: <CreditCard size={14} /> },
  "账号交接": { bg: "#ffd600",  color: "#000000", icon: <ArrowRightLeft size={14} /> },
  "新账号申请": { bg: "#1a1a1a", color: "#ffffff", icon: <UserPlus size={14} /> },
  "提现审批": { bg: S.accent,   color: "#000000", icon: <FileText size={14} /> },
  "权限变更": { bg: "#f0f0ec",  color: "#333333", icon: <Shield size={14} /> },
};

interface Approval {
  id: number;
  type: ApprovalType;
  title: string;
  submitter: string;
  time: string;
  urgent: boolean;
  description: string;
  status: ApprovalStatus;
  detail: Record<string, string>;
  history: { actor: string; action: string; time: string; comment?: string }[];
}

const mockApprovals: Approval[] = [
  {
    id: 1, type: "退款申请", title: "申请退款 ¥4800", submitter: "王建国", time: "2天前",
    urgent: true, status: "待审批",
    description: "已使用服务30天，因个人原因申请全额退款，高风险客诉",
    detail: { "订单编号": "ORD2026070503", "产品": "代理授权费", "金额": "¥4800", "已使用天数": "30天", "退款原因": "个人原因", "风险等级": "高" },
    history: [
      { actor: "系统", action: "提交申请", time: "2026-07-04 14:23" },
      { actor: "系统", action: "自动分配给审批人", time: "2026-07-04 14:23" },
    ],
  },
  {
    id: 2, type: "账号交接", title: "fengle_cd_01 账号交接", submitter: "赵志远（离职）",
    time: "1天前", urgent: false, status: "待审批",
    description: "赵志远离职，名下微信号 fengle_cd_01 需交接至待分配状态",
    detail: { "微信号": "fengle_cd_01", "原持有人": "赵志远", "交接至": "待分配", "原因": "离职", "所属城市": "成都", "粉丝数": "342" },
    history: [{ actor: "HR系统", action: "触发离职流程", time: "2026-07-05 09:00" }],
  },
  {
    id: 3, type: "新账号申请", title: "申请新增 fengle_bj_03", submitter: "吴思远",
    time: "今天", urgent: false, status: "待审批",
    description: "申请新增微信号 fengle_bj_03，用于北京PRO会员业务扩展",
    detail: { "申请账号": "fengle_bj_03", "用途": "北京PRO扩展", "所属城市": "北京", "预计粉丝量": "500+", "申请人": "吴思远", "部门": "北京运营组" },
    history: [{ actor: "吴思远", action: "提交申请", time: "2026-07-06 09:30" }],
  },
  {
    id: 4, type: "提现审批", title: "申请提现 ¥3200", submitter: "李梦华",
    time: "今天", urgent: false, status: "待审批",
    description: "申请将 ¥3200 佣金提现至支付宝账户",
    detail: { "提现金额": "¥3200", "提现渠道": "支付宝", "账户": "limenghua@example.com", "可提余额": "¥5680", "本月已提": "¥2000", "申请人": "李梦华" },
    history: [{ actor: "李梦华", action: "提交提现申请", time: "2026-07-06 10:15" }],
  },
  {
    id: 5, type: "退款申请", title: "申请退款 ¥980", submitter: "张晓红",
    time: "3小时前", urgent: false, status: "待审批",
    description: "体验营报名费退款，原因：课程内容不符合预期",
    detail: { "订单编号": "ORD2026070502", "产品": "体验营报名费", "金额": "¥980", "退款原因": "课程不符合预期", "已上课次数": "2/8", "风险等级": "低" },
    history: [{ actor: "张晓红", action: "提交申请", time: "2026-07-06 07:00" }],
  },
  {
    id: 6, type: "权限变更", title: "申请给陈明添加「群分配」权限", submitter: "杭州区域负责人",
    time: "5小时前", urgent: false, status: "待审批",
    description: "申请为陈明添加「群分配」编辑权限，用于杭州区域运营管理",
    detail: { "目标用户": "陈明", "申请权限": "群分配（编辑）", "原有权限": "群分配（只读）", "申请原因": "杭州区域运营需要", "所属区域": "杭州", "申请人": "杭州区域负责人" },
    history: [{ actor: "杭州区域负责人", action: "提交申请", time: "2026-07-06 05:30" }],
  },
  {
    id: 7, type: "提现审批", title: "申请提现 ¥1800", submitter: "赵志远",
    time: "今天", urgent: false, status: "审批中",
    description: "申请将 ¥1800 佣金提现至绑定银行卡",
    detail: { "提现金额": "¥1800", "提现渠道": "银行卡", "账户": "尾号 6789", "可提余额": "¥3200", "本月已提": "¥0", "申请人": "赵志远" },
    history: [
      { actor: "赵志远", action: "提交申请", time: "2026-07-06 08:00" },
      { actor: "财务主管", action: "开始审批", time: "2026-07-06 09:00" },
    ],
  },
  {
    id: 8, type: "账号交接", title: "fengle_xa_01 账号交接", submitter: "孙浩（离职）",
    time: "2天前", urgent: false, status: "已同意",
    description: "孙浩离职，微信号 fengle_xa_01 已成功交接至待分配",
    detail: { "微信号": "fengle_xa_01", "原持有人": "孙浩", "交接至": "待分配", "原因": "离职", "所属城市": "西安", "粉丝数": "218" },
    history: [
      { actor: "HR系统", action: "触发离职流程", time: "2026-07-04 10:00" },
      { actor: "系统管理员", action: "同意交接", time: "2026-07-04 11:30", comment: "已确认账号信息，执行交接" },
    ],
  },
  {
    id: 9, type: "新账号申请", title: "申请新增企业微信账号", submitter: "林小燕",
    time: "今天", urgent: false, status: "待审批",
    description: "申请新增企业微信账号，用于上海业务扩展",
    detail: { "账号类型": "企业微信", "用途": "上海业务扩展", "所属城市": "上海", "申请人": "林小燕", "部门": "上海运营组", "预计上线": "2026-08-01" },
    history: [{ actor: "林小燕", action: "提交申请", time: "2026-07-06 11:00" }],
  },
];

const TYPE_COUNTS: { type: string; count: number }[] = [
  { type: "全部审批", count: 18 },
  { type: "退款申请", count: 5 },
  { type: "账号交接", count: 3 },
  { type: "新账号申请", count: 4 },
  { type: "提现审批", count: 6 },
  { type: "权限变更", count: 0 },
];

export default function ApprovalCenter() {
  const [selectedType, setSelectedType] = useState("全部审批");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [approvalStates, setApprovalStates] = useState<Record<number, ApprovalStatus>>({});
  const [bottomTab, setBottomTab] = useState<"pending" | "history">("pending");

  const pendingCount = mockApprovals.filter(a => (approvalStates[a.id] || a.status) === "待审批").length;

  const filtered = mockApprovals.filter(a => {
    const matchType = selectedType === "全部审批" || a.type === selectedType;
    const matchTab = bottomTab === "history"
      ? ["已同意", "已拒绝"].includes(approvalStates[a.id] || a.status)
      : !["已同意", "已拒绝"].includes(approvalStates[a.id] || a.status);
    return matchType && matchTab;
  });

  const selected = mockApprovals.find(a => a.id === selectedId) ?? null;
  const selectedStatus = selected ? (approvalStates[selected.id] || selected.status) : null;

  function handleApprove(id: number) { setApprovalStates(s => ({ ...s, [id]: "已同意" })); setComment(""); }
  function handleReject(id: number) { setApprovalStates(s => ({ ...s, [id]: "已拒绝" })); setComment(""); }

  return (
    <div className="h-full flex flex-col" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-base" style={{ color: S.text, fontFamily: "monospace" }}>审批中心</h2>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold"
              style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>
              {pendingCount} 待处理
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 animate-pulse" style={{ background: S.accent, borderRadius: "50%" }} />
          <span className="text-xs font-mono" style={{ color: S.muted }}>实时同步</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — white with soft borders */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-0.5 p-3 overflow-y-auto" style={{ background: "#f7f7f7", borderRight: `1px solid rgba(0,0,0,0.08)` }}>
          <div className="text-xs font-bold px-2 py-1 mb-1" style={{ color: S.muted, fontFamily: "monospace" }}>审批类型</div>
          {TYPE_COUNTS.map(tc => {
            const isAll = tc.type === "全部审批";
            const active = selectedType === tc.type;
            return (
              <button key={tc.type}
                onClick={() => { setSelectedType(tc.type); setSelectedId(null); }}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-left transition-colors"
                style={active
                  ? { background: S.accentLight, color: S.text, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.4)` }
                  : { color: S.muted, background: "transparent", borderRadius: S.radiusSm, border: "1px solid transparent" }}>
                <div className="flex items-center gap-2">
                  {!isAll && TYPE_CONFIG[tc.type as ApprovalType] && (
                    <span style={{ color: active ? S.text : S.muted }}>{TYPE_CONFIG[tc.type as ApprovalType].icon}</span>
                  )}
                  {isAll && <UserCheck size={14} style={{ color: active ? S.text : S.muted }} />}
                  <span style={{ fontFamily: "monospace" }}>{tc.type}</span>
                </div>
                {tc.count > 0 ? (
                  <span className="text-xs px-1.5 py-0.5 font-bold"
                    style={{ background: active ? S.accent : "rgba(0,0,0,0.06)", color: active ? "#000" : S.muted, borderRadius: S.radiusSm }}>
                    {tc.count}
                  </span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5"
                    style={{ background: "rgba(0,0,0,0.04)", color: S.mutedLight, borderRadius: S.radiusSm }}>0</span>
                )}
              </button>
            );
          })}

          <div className="my-2" style={{ borderTop: `1px solid ${S.border}` }} />

          {/* Bottom tabs in sidebar */}
          <button onClick={() => setBottomTab("pending")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
            style={bottomTab === "pending"
              ? { background: S.accentLight, color: S.text, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.4)` }
              : { color: S.muted, borderRadius: S.radiusSm, border: "1px solid transparent" }}>
            <Clock size={14} /> <span style={{ fontFamily: "monospace" }}>待处理</span>
          </button>
          <button onClick={() => setBottomTab("history")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
            style={bottomTab === "history"
              ? { background: S.accentLight, color: S.text, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.4)` }
              : { color: S.muted, borderRadius: S.radiusSm, border: "1px solid transparent" }}>
            <RotateCcw size={14} /> <span style={{ fontFamily: "monospace" }}>审批历史</span>
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Approval list */}
          <div className="flex flex-col overflow-y-auto" style={{ width: selected ? "42%" : "100%", borderRight: selected ? `1px solid ${S.border}` : "none" }}>
            <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
              <span className="text-xs font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>
                {bottomTab === "history" ? "审批历史" : "待处理"} [{filtered.length}]
              </span>
            </div>
            <div className="flex flex-col gap-0">
              {filtered.length === 0 && (
                <div className="py-16 text-center" style={{ color: S.muted }}>
                  <div className="text-3xl mb-2 opacity-20">--</div>
                  <div className="text-sm font-mono">暂无待审批项目</div>
                </div>
              )}
              {filtered.map((a, i) => {
                const status = approvalStates[a.id] || a.status;
                const typeCfg = TYPE_CONFIG[a.type];
                const statusCfg = STATUS_CONFIG[status];
                const isSelected = selectedId === a.id;
                return (
                  <div key={a.id}
                    onClick={() => setSelectedId(isSelected ? null : a.id)}
                    className="px-4 py-3.5 cursor-pointer transition-all"
                    style={{
                      background: isSelected ? S.accentLight : S.surface,
                      borderBottom: `1px solid ${S.border}`,
                      borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent",
                    }}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {a.urgent && <AlertTriangle size={13} className="flex-shrink-0" style={{ color: "#ff6b35" }} />}
                        <span className="text-sm font-bold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{a.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        <span className="text-xs px-1.5 py-0.5 font-bold"
                          style={{ background: statusCfg.bg, color: statusCfg.color, borderRadius: S.radiusSm }}>
                          {status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs px-1.5 py-0.5 flex items-center gap-1 font-bold"
                        style={{ background: typeCfg.bg, color: typeCfg.color, borderRadius: S.radiusSm }}>
                        {typeCfg.icon} {a.type}
                      </span>
                      <span className="text-xs font-mono" style={{ color: S.muted }}>{a.submitter}</span>
                      <span className="text-xs" style={{ color: S.mutedLight }}>·</span>
                      <span className="text-xs font-mono" style={{ color: S.mutedLight }}>{a.time}</span>
                    </div>
                    <p className="text-xs line-clamp-1 font-mono" style={{ color: S.muted }}>{a.description}</p>
                    {status === "待审批" && (
                      <div className="flex gap-2 mt-2.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleApprove(a.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold"
                          style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>
                          <Check size={11} /> 同意
                        </button>
                        <button onClick={() => handleReject(a.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold"
                          style={{ background: "#f5f5f5", color: S.accent, borderRadius: S.radiusSm }}>
                          <X size={11} /> 拒绝
                        </button>
                        <button onClick={() => setSelectedId(a.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold"
                          style={{ color: S.text, border: `1px solid ${S.border}`, background: "transparent", borderRadius: S.radiusSm }}>
                          详情 <ChevronRight size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: S.surface }}>
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10"
                style={{ background: "#0d0d0d", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: S.accent, fontFamily: "monospace" }}>审批详情</span>
                  <span className="text-xs px-1.5 py-0.5 font-bold"
                    style={{ background: STATUS_CONFIG[selectedStatus!].bg, color: STATUS_CONFIG[selectedStatus!].color, borderRadius: S.radiusSm }}>
                    {selectedStatus}
                  </span>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-1.5" style={{ color: S.accent }}>
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Info card */}
                <div className="p-4" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 flex items-center justify-center"
                      style={{ background: TYPE_CONFIG[selected.type].bg, color: TYPE_CONFIG[selected.type].color, borderRadius: S.radiusSm }}>
                      {TYPE_CONFIG[selected.type].icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: S.text, fontFamily: "monospace" }}>{selected.title}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-2 font-mono" style={{ color: S.muted }}>
                        <span>{selected.submitter}</span><span>·</span><span>{selected.time}提交</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>{selected.description}</p>
                </div>

                {/* Detail fields */}
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>详细信息</div>
                  <div className="overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <div className="flex items-center justify-between px-4 py-2" style={{ background: "#f5f5f5", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                      <span className="text-xs font-bold" style={{ color: "#555555", fontFamily: "monospace" }}>字段</span>
                      <span className="text-xs font-bold" style={{ color: "#555555", fontFamily: "monospace" }}>值</span>
                    </div>
                    {Object.entries(selected.detail).map(([k, v], i, arr) => (
                      <div key={k} className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${S.border}` : "none", background: i % 2 === 0 ? S.surface : "#fafaf8" }}>
                        <span className="text-xs font-mono" style={{ color: S.muted }}>{k}</span>
                        <span className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related records */}
                {selected.type === "退款申请" && (
                  <div>
                    <div className="text-xs font-bold mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>相关订单</div>
                    <div className="p-3 flex items-center gap-3" style={{ background: "#fff8e6", border: `1px solid rgba(255,214,0,0.3)`, borderRadius: S.radiusSm }}>
                      <CreditCard size={16} style={{ color: "#0d0d0d" }} />
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: "#0d0d0d" }}>历史消费记录</div>
                        <div className="text-xs mt-0.5 font-mono" style={{ color: S.textSec }}>
                          共1笔订单 · 总额 {selected.detail["金额"]} · 首次购买于30天前
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selected.type === "账号交接" && (
                  <div>
                    <div className="text-xs font-bold mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>账号信息</div>
                    <div className="p-3 flex items-center gap-3" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                      <ArrowRightLeft size={16} style={{ color: "#0d0d0d" }} />
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: "#0d0d0d" }}>微信号 {selected.detail["微信号"]}</div>
                        <div className="text-xs mt-0.5 font-mono" style={{ color: S.textSec }}>
                          现有粉丝 {selected.detail["粉丝数"]} · 所属城市 {selected.detail["所属城市"]}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval form */}
                {selectedStatus === "待审批" || selectedStatus === "审批中" ? (
                  <div className="p-4" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: S.text, fontFamily: "monospace" }}>
                      <MessageSquare size={13} /> 审批意见
                    </div>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={3}
                      placeholder="请输入审批意见（可选）…"
                      className="w-full px-3 py-2 text-xs outline-none resize-none mb-3 font-mono"
                      style={{ border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", borderRadius: S.radiusSm }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(selected.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold"
                        style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                        <Check size={14} /> 同意
                      </button>
                      <button onClick={() => handleReject(selected.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold"
                        style={{ background: "#f5f5f5", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                        <X size={14} /> 拒绝
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-3"
                    style={{ background: STATUS_CONFIG[selectedStatus!].bg === S.accent ? S.accentLight : "#f5f5f5", border: `1px solid ${STATUS_CONFIG[selectedStatus!].bg === S.accent ? "rgba(204,255,0,0.4)" : S.border}`, borderRadius: S.radius }}>
                    {selectedStatus === "已同意"
                      ? <Check size={16} style={{ color: "#0d0d0d" }} />
                      : <X size={16} style={{ color: S.text }} />}
                    <div>
                      <div className="text-xs font-bold font-mono" style={{ color: S.text }}>
                        {selectedStatus === "已同意" ? "审批已通过" : "审批已拒绝"}
                      </div>
                      <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>
                        {selectedStatus === "已同意" ? "该申请已被批准，相关操作已执行" : "该申请已被拒绝"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval history timeline */}
                <div>
                  <div className="text-xs font-bold mb-3" style={{ color: S.muted, fontFamily: "monospace" }}>审批流转</div>
                  <div className="flex flex-col gap-0 relative">
                    <div className="absolute left-3.5 top-4 bottom-4 w-px" style={{ background: S.border }} />
                    {[
                      ...selected.history,
                      ...(approvalStates[selected.id] ? [{
                        actor: "当前审批人",
                        action: approvalStates[selected.id] === "已同意" ? "同意申请" : "拒绝申请",
                        time: "刚刚",
                        comment: comment || undefined,
                      }] : []),
                    ].map((h, i, arr) => (
                      <div key={i} className="flex items-start gap-3 pb-4 relative">
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold"
                          style={i === arr.length - 1
                            ? { background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }
                            : { background: S.surface, border: `2px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono" style={{ color: S.text }}>{h.actor}</span>
                            <span className="text-xs" style={{ color: S.mutedLight }}>·</span>
                            <span className="text-xs font-mono" style={{ color: S.mutedLight }}>{h.time}</span>
                          </div>
                          <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>{h.action}</div>
                          {h.comment && (
                            <div className="mt-1 px-2 py-1.5 text-xs font-mono" style={{ background: "#f7f7f7", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                              "{h.comment}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
