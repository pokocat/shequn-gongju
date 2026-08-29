import { useState } from "react";
import {
  Check, X, ChevronRight, Clock, AlertTriangle, FileText,
  CreditCard, UserCheck, UserPlus, ArrowRightLeft, Shield,
  MessageSquare, RotateCcw, Package, Building2, Layers, Zap,
} from "lucide-react";
import { useApprovals } from "../App";
import { useApprovalWriteback } from "../approvals/useApprovalWriteback";
import {
  FLOW_TEMPLATES, approvalStatusMeta,
  createApproval, advanceNode, rejectApproval,
  type Approval, type ApprovalType, type ApprovalStatus, type FlowTemplate,
} from "../data/approvalTypes";

const S = {
  bg: "#fafafa",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.06)",
  borderMed: "rgba(0,0,0,0.12)",
  accent: "#ccff00",
  accentLight: "rgba(204,255,0,0.08)",
  text: "#111111",
  textSec: "#444444",
  muted: "#888888",
  mutedLight: "#bbbbbb",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

// 图标映射：字符串 → lucide 组件
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  UserPlus, Building2, Layers, Package, ArrowRightLeft, CreditCard, Shield, RotateCcw,
};

// 类型颜色配置
const TYPE_COLOR: Record<ApprovalType, { bg: string; color: string }> = {
  invite_register:   { bg: "#1a1a1a",  color: S.accent },
  saas_onboard:      { bg: "#1a1a1a",  color: "#ffffff" },
  platform_onboard:  { bg: "#ffd600",  color: "#000000" },
  subscription_open: { bg: S.accent,   color: "#000000" },
  tool_handover:     { bg: "#ffd600",  color: "#000000" },
  settlement:        { bg: S.accent,   color: "#000000" },
  permission_change:  { bg: "#f0f0ec",  color: "#333333" },
  refund:            { bg: "#1a1a1a",  color: S.accent },
};

export default function ApprovalCenter() {
  const { approvals, setApprovals } = useApprovals();
  // 审批终审通过后自动回写业务数据
  useApprovalWriteback();

  const [selectedType, setSelectedType] = useState<string>("全部审批");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [bottomTab, setBottomTab] = useState<"pending" | "history">("pending");
  const [toast, setToast] = useState("");

  // 当前操作角色（演示态，真实场景从登录态获取）
  const ROLE_OPTIONS = [
    "超级生态运营",
    "生态负责人",
    "超级生态财务",
    "SaaS 负责人",
    "邀请人",
  ];
  const [currentRole, setCurrentRole] = useState("超级生态运营");

  // 权限收敛：当前角色必须匹配当前节点的 approverRole 才能审批
  function canApprove(a: Approval): boolean {
    if (a.status !== "pending" && a.status !== "in_progress") return false;
    const node = FLOW_TEMPLATES[a.type].nodes[a.currentNodeIndex];
    return node.approverRole === currentRole;
  }

  // 按类型统计
  const allTypes = Object.keys(FLOW_TEMPLATES) as ApprovalType[];
  const typeCounts: { type: string; count: number }[] = [
    { type: "全部审批", count: approvals.length },
    ...allTypes.map((t) => ({
      type: FLOW_TEMPLATES[t].name,
      count: approvals.filter((a) => a.type === t).length,
    })),
  ];

  const pendingCount = approvals.filter(
    (a) => a.status === "pending" || a.status === "in_progress"
  ).length;

  const filtered = approvals.filter((a) => {
    const matchType =
      selectedType === "全部审批" || FLOW_TEMPLATES[a.type].name === selectedType;
    const matchTab =
      bottomTab === "history"
        ? a.status === "approved" || a.status === "rejected"
        : a.status === "pending" || a.status === "in_progress";
    return matchType && matchTab;
  });

  const selected = approvals.find((a) => a.id === selectedId) ?? null;

  function handleApprove(id: string) {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return advanceNode(a, currentRole, comment || undefined);
      })
    );
    setComment("");
    const ap = approvals.find((a) => a.id === id);
    if (ap) {
      const template = FLOW_TEMPLATES[ap.type];
      const isFinal = ap.currentNodeIndex >= template.nodes.length - 1;
      setToast(isFinal ? "终审通过，已自动执行业务回写" : `已通过「${template.nodes[ap.currentNodeIndex].nodeName}」，流转至下一节点`);
      setTimeout(() => setToast(""), 2500);
    }
  }

  function handleReject(id: string) {
    if (!comment.trim()) {
      setToast("请填写拒绝原因");
      setTimeout(() => setToast(""), 2000);
      return;
    }
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? rejectApproval(a, currentRole, comment) : a))
    );
    setComment("");
    setToast("已拒绝该申请");
    setTimeout(() => setToast(""), 2000);
  }

  return (
    <div className="h-full flex flex-col" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-base" style={{ color: S.text, fontFamily: "monospace" }}>审批中心</h2>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>
              {pendingCount} 待处理
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radiusSm }}>
            <span className="text-[10px] font-mono" style={{ color: S.muted }}>当前角色</span>
            <select
              value={currentRole}
              onChange={(e) => { setCurrentRole(e.target.value); setSelectedId(null); }}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer"
              style={{ color: S.text, fontFamily: "monospace" }}
            >
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 animate-pulse" style={{ background: S.accent, borderRadius: "50%" }} />
            <span className="text-xs font-mono" style={{ color: S.muted }}>多级流程引擎</span>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, border: `1px solid ${S.accent}` }}>
          {toast}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-0.5 p-3 overflow-y-auto" style={{ background: "#f7f7f7", borderRight: `1px solid rgba(0,0,0,0.08)` }}>
          <div className="text-xs font-bold px-2 py-1 mb-1" style={{ color: S.muted, fontFamily: "monospace" }}>审批类型</div>
          {typeCounts.map((tc) => {
            const active = selectedType === tc.type;
            const typeKey = allTypes.find((t) => FLOW_TEMPLATES[t].name === tc.type);
            const IconComp = typeKey ? ICON_MAP[FLOW_TEMPLATES[typeKey].icon] : UserCheck;
            return (
              <button key={tc.type}
                onClick={() => { setSelectedType(tc.type); setSelectedId(null); }}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-left transition-colors"
                style={active
                  ? { background: S.accentLight, color: S.text, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.4)` }
                  : { color: S.muted, background: "transparent", borderRadius: S.radiusSm, border: "1px solid transparent" }}>
                <div className="flex items-center gap-2">
                  <IconComp size={14} style={{ color: active ? S.text : S.muted }} />
                  <span style={{ fontFamily: "monospace" }}>{tc.type}</span>
                </div>
                {tc.count > 0 ? (
                  <span className="text-xs px-1.5 py-0.5 font-bold" style={{ background: active ? S.accent : "rgba(0,0,0,0.06)", color: active ? "#000" : S.muted, borderRadius: S.radiusSm }}>
                    {tc.count}
                  </span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5" style={{ background: "rgba(0,0,0,0.04)", color: S.mutedLight, borderRadius: S.radiusSm }}>0</span>
                )}
              </button>
            );
          })}

          <div className="my-2" style={{ borderTop: `1px solid ${S.border}` }} />

          <button onClick={() => setBottomTab("pending")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
            style={bottomTab === "pending"
              ? { background: S.accentLight, color: S.text, borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.4)` }
              : { color: S.muted, borderRadius: S.radiusSm, border: "1px solid transparent" }}>
            <Clock size={14} /> <span style={{ fontFamily: "monospace" }}>待处理</span>
            {pendingCount > 0 && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5" style={{ background: S.accent, color: "#000", borderRadius: 3 }}>{pendingCount}</span>}
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
                  <div className="text-sm font-mono">暂无{bottomTab === "history" ? "历史" : "待处理"}审批</div>
                </div>
              )}
              {filtered.map((a) => {
                const template = FLOW_TEMPLATES[a.type];
                const statusCfg = approvalStatusMeta[a.status];
                const typeCfg = TYPE_COLOR[a.type];
                const TypeIcon = ICON_MAP[template.icon];
                const currentNode = template.nodes[a.currentNodeIndex];
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
                        <span className="text-xs px-1.5 py-0.5 font-bold" style={{ background: statusCfg.bg, color: statusCfg.color, borderRadius: S.radiusSm }}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs px-1.5 py-0.5 flex items-center gap-1 font-bold" style={{ background: typeCfg.bg, color: typeCfg.color, borderRadius: S.radiusSm }}>
                        <TypeIcon size={11} /> {template.name}
                      </span>
                      <span className="text-xs font-mono" style={{ color: S.muted }}>{a.submitter}</span>
                      <span className="text-xs" style={{ color: S.mutedLight }}>·</span>
                      <span className="text-xs font-mono" style={{ color: S.mutedLight }}>{a.createdAt}</span>
                    </div>
                    {/* 当前节点指示 */}
                    {(a.status === "pending" || a.status === "in_progress") && currentNode && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "#0d0d0d", color: S.accent, borderRadius: 3 }}>
                          第{a.currentNodeIndex + 1}/{template.nodes.length}级
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: S.textSec }}>{currentNode.nodeName}</span>
                        <span className="text-[10px]" style={{ color: S.muted }}>·{currentNode.approverRole}</span>
                      </div>
                    )}
                    <p className="text-xs line-clamp-1 font-mono" style={{ color: S.muted }}>{a.description}</p>
                    {a.status === "pending" || a.status === "in_progress" ? (
                      <div className="flex gap-2 mt-2.5" onClick={(e) => e.stopPropagation()}>
                        {canApprove(a) ? (
                          <button onClick={() => handleApprove(a.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold"
                            style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>
                            <Check size={11} /> 同意
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold" style={{ background: "#f5f5f5", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>
                            <Shield size={11} /> 无权审批
                          </span>
                        )}
                        <button onClick={() => setSelectedId(a.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold"
                          style={{ color: S.text, border: `1px solid ${S.border}`, background: "transparent", borderRadius: S.radiusSm }}>
                          详情 <ChevronRight size={11} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <DetailPanel
              approval={selected}
              comment={comment}
              setComment={setComment}
              canApprove={canApprove(selected)}
              onApprove={() => handleApprove(selected.id)}
              onReject={() => handleReject(selected.id)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 详情面板（含多级流程节点进度条） ──────────────────────
function DetailPanel({
  approval: a, comment, setComment, canApprove, onApprove, onReject, onClose,
}: {
  approval: Approval;
  comment: string;
  setComment: (v: string) => void;
  canApprove: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  const template = FLOW_TEMPLATES[a.type];
  const statusCfg = approvalStatusMeta[a.status];
  const typeCfg = TYPE_COLOR[a.type];
  const TypeIcon = ICON_MAP[template.icon];
  const currentNode = template.nodes[a.currentNodeIndex];
  const isPending = a.status === "pending" || a.status === "in_progress";

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: S.surface }}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10" style={{ background: "#0d0d0d", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: S.accent, fontFamily: "monospace" }}>审批详情</span>
          <span className="text-xs px-1.5 py-0.5 font-bold" style={{ background: statusCfg.bg, color: statusCfg.color, borderRadius: S.radiusSm }}>
            {statusCfg.label}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5" style={{ color: S.accent }}>
          <X size={16} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Info card */}
        <div className="p-4" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: typeCfg.bg, color: typeCfg.color, borderRadius: S.radiusSm }}>
              <TypeIcon size={16} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: S.text, fontFamily: "monospace" }}>{a.title}</div>
              <div className="text-xs mt-0.5 flex items-center gap-2 font-mono" style={{ color: S.muted }}>
                <span>{a.submitter}</span><span>·</span><span>{a.createdAt}提交</span>
                {a.urgent && <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#ff6b35", color: "#fff", borderRadius: 3 }}>紧急</span>}
              </div>
            </div>
          </div>
          <p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>{a.description}</p>
        </div>

        {/* 多级流程节点进度条 */}
        <FlowProgressBar template={template} currentIndex={a.currentNodeIndex} status={a.status} />

        {/* Detail fields */}
        {Object.keys(a.detail).length > 0 && (
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: S.muted, fontFamily: "monospace" }}>详细信息</div>
            <div className="overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="flex items-center justify-between px-4 py-2" style={{ background: "#f5f5f5" }}>
                <span className="text-xs font-bold" style={{ color: "#555555", fontFamily: "monospace" }}>字段</span>
                <span className="text-xs font-bold" style={{ color: "#555555", fontFamily: "monospace" }}>值</span>
              </div>
              {Object.entries(a.detail).map(([k, v], i, arr) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderBottom: i < arr.length - 1 ? `1px solid ${S.border}` : "none", background: i % 2 === 0 ? S.surface : "#fafaf8" }}>
                  <span className="text-xs font-mono" style={{ color: S.muted }}>{k}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 审批表单 */}
        {isPending ? (
          <div className="p-4" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: S.text, fontFamily: "monospace" }}>
              <MessageSquare size={13} /> 审批意见
              {currentNode && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5" style={{ background: "#0d0d0d", color: S.accent, borderRadius: 3 }}>
                  当前节点：{currentNode.nodeName}
                </span>
              )}
            </div>
            {canApprove ? (
              <>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="请输入审批意见（拒绝时必填）…"
                  className="w-full px-3 py-2 text-xs outline-none resize-none mb-3 font-mono"
                  style={{ border: `1px solid rgba(0,0,0,0.12)`, color: S.text, background: "#f7f7f7", borderRadius: S.radiusSm }}
                />
                <div className="flex gap-2">
                  <button onClick={onApprove}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold"
                    style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                    <Check size={14} />
                    {a.currentNodeIndex >= template.nodes.length - 1 ? "终审通过" : "同意并流转"}
                  </button>
                  <button onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold"
                    style={{ background: "#f5f5f5", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                    <X size={14} /> 拒绝
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 flex items-center gap-2 text-xs font-bold font-mono" style={{ color: S.muted, background: "#f5f5f5", borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>
                <Shield size={14} />
                <span>无权审批此节点 · 需「{currentNode?.approverRole ?? "—"}」角色</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 flex items-center gap-3"
            style={{ background: a.status === "approved" ? S.accentLight : "#f5f5f5", border: `1px solid ${a.status === "approved" ? "rgba(204,255,0,0.4)" : S.border}`, borderRadius: S.radius }}>
            {a.status === "approved" ? <Check size={16} style={{ color: "#0d0d0d" }} /> : <X size={16} style={{ color: S.text }} />}
            <div>
              <div className="text-xs font-bold font-mono" style={{ color: S.text }}>
                {a.status === "approved" ? "审批已通过" : "审批已拒绝"}
              </div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>
                {a.status === "approved" ? "该申请已被批准，相关操作已自动执行" : "该申请已被拒绝"}
              </div>
            </div>
          </div>
        )}

        {/* 审批历史时间线 */}
        <div>
          <div className="text-xs font-bold mb-3" style={{ color: S.muted, fontFamily: "monospace" }}>审批流转</div>
          <div className="flex flex-col gap-0 relative">
            <div className="absolute left-3.5 top-4 bottom-4 w-px" style={{ background: S.border }} />
            {a.history.map((h, i) => {
              const isLast = i === a.history.length - 1;
              const isReject = h.action === "reject";
              return (
                <div key={i} className="flex items-start gap-3 pb-4 relative">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold"
                    style={isReject
                      ? { background: "#1a1a1a", color: "#ff6b6b", borderRadius: S.radiusSm }
                      : h.action === "approve"
                        ? { background: S.accent, color: "#000", borderRadius: S.radiusSm }
                        : h.action === "submit"
                          ? { background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }
                          : { background: S.surface, border: `2px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>
                    {h.action === "submit" ? i + 1 : h.action === "approve" ? <Check size={12} /> : h.action === "reject" ? <X size={12} /> : <ChevronRight size={12} />}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono" style={{ color: S.text }}>{h.actor}</span>
                      <span className="text-xs" style={{ color: S.mutedLight }}>·</span>
                      <span className="text-xs font-mono" style={{ color: S.mutedLight }}>{h.time}</span>
                    </div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>
                      <span style={{ color: isReject ? "#ff6b6b" : S.textSec }}>[{h.nodeName}]</span> {h.action === "submit" ? "提交申请" : h.action === "approve" ? "同意" : h.action === "reject" ? "拒绝" : h.comment || "流转"}
                    </div>
                    {h.comment && h.action !== "flow" && (
                      <div className="mt-1 px-2 py-1.5 text-xs font-mono" style={{ background: "#f7f7f7", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        "{h.comment}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 多级流程节点进度条 ─────────────────────────────────────
function FlowProgressBar({
  template, currentIndex, status,
}: {
  template: FlowTemplate;
  currentIndex: number;
  status: ApprovalStatus;
}) {
  const nodes = template.nodes;
  const isDone = status === "approved" || status === "rejected";

  return (
    <div className="p-4" style={{ background: "#0d0d0d", borderRadius: S.radius, border: `1px solid rgba(255,255,255,0.08)` }}>
      <div className="flex items-center gap-2 mb-3">
        <Zap size={13} style={{ color: S.accent }} />
        <span className="text-xs font-bold font-mono" style={{ color: S.accent }}>流程节点</span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
          {isDone ? "已结束" : `第${currentIndex + 1}/${nodes.length}级`}
        </span>
      </div>
      <div className="flex items-center">
        {nodes.map((node, i) => {
          const isCompleted = isDone || i < currentIndex;
          const isCurrent = !isDone && i === currentIndex;
          const isFuture = !isDone && i > currentIndex;
          const isRejected = status === "rejected" && i === currentIndex;

          return (
            <div key={node.nodeKey} className="flex items-center flex-1" style={{ flexShrink: 0 }}>
              {/* 节点圆圈 */}
              <div className="flex flex-col items-center gap-1.5" style={{ flexShrink: 0 }}>
                <div className="flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: isCompleted ? S.accent : isCurrent ? "#fff" : isRejected ? "#ff6b6b" : "rgba(255,255,255,0.08)",
                    color: isCompleted ? "#000" : isCurrent ? "#0d0d0d" : isRejected ? "#fff" : "rgba(255,255,255,0.3)",
                    border: isCurrent ? `2px solid ${S.accent}` : "none",
                    boxShadow: isCurrent ? `0 0 0 4px rgba(204,255,0,0.2)` : "none",
                    animation: isCurrent ? "pulse 2s ease-in-out infinite" : "none",
                  }}>
                  {isCompleted ? <Check size={14} /> : isRejected ? <X size={14} /> : i + 1}
                </div>
                <div className="text-[10px] font-mono text-center" style={{
                  color: isCompleted ? S.accent : isCurrent ? "#fff" : "rgba(255,255,255,0.35)",
                  fontWeight: isCurrent || isCompleted ? 700 : 400,
                  maxWidth: 80,
                  lineHeight: 1.3,
                }}>
                  {node.nodeName}
                </div>
                <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{node.approverRole}</div>
              </div>
              {/* 连线 */}
              {i < nodes.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-6" style={{
                  background: isCompleted ? S.accent : "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                  minWidth: 20,
                }} />
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(204,255,0,0.3); } 50% { box-shadow: 0 0 0 6px rgba(204,255,0,0.1); } }`}</style>
    </div>
  );
}
