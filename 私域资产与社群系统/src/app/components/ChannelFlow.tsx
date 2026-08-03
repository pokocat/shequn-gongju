import { useState } from "react";
import { Plus, X, ArrowRight, Zap, Settings, ChevronRight, Link, Search, Filter, RefreshCw } from "lucide-react";

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

// ─── 模拟数据 ─────────────────────────────────────────────────
const channels = [
  { id: 1, platform: "微信小店", emoji: "🛍️", name: "蜂乐玛官方小店", accountId: "fenglema_shop",
    boundPersonal: "fengle_bj_01", boundWecom: "蜂乐玛企微-吴思远",
    monthlyTraffic: 1240, conversionRate: "8.3%", status: "已绑定",
    ruleDesc: "购买后→按城市匹配→对应PRO群（同步企微）", lastSync: "07-05 09:12" },
  { id: 2, platform: "抖音", emoji: "🎵", name: "@fenglema_official", accountId: "fenglema_douyin",
    boundPersonal: "fengle_sh_01", boundWecom: "蜂乐玛企微-林小燕",
    monthlyTraffic: 3680, conversionRate: "4.7%", status: "已绑定",
    ruleDesc: "评论区引流→加个人微信→体验官群（不同步企微）", lastSync: "07-05 08:00" },
  { id: 3, platform: "小红书", emoji: "📕", name: "fenglema_life", accountId: "fenglema_xhs",
    boundPersonal: "fengle_sz_01", boundWecom: "—",
    monthlyTraffic: 920, conversionRate: "6.2%", status: "已绑定",
    ruleDesc: "笔记评论→加微信→游客群→后续转PRO", lastSync: "07-04 22:30" },
  { id: 4, platform: "公众号", emoji: "📢", name: "蜂乐玛官方", accountId: "gh_fenglema",
    boundPersonal: "fengle_bj_01", boundWecom: "全员企微群",
    monthlyTraffic: 2100, conversionRate: "12.4%", status: "已绑定",
    ruleDesc: "关注后欢迎语→按城市分配→游客群", lastSync: "07-05 10:00" },
  { id: 5, platform: "视频号", emoji: "🎬", name: "蜂乐玛视频", accountId: "fenglema_channels",
    boundPersonal: "fengle_bj_01", boundWecom: "蜂乐玛企微-吴思远",
    monthlyTraffic: 560, conversionRate: "5.8%", status: "已绑定",
    ruleDesc: "直播间下单→自动添加微信→PRO群（同步企微）", lastSync: "07-05 11:00" },
  { id: 6, platform: "知乎", emoji: "🔵", name: "蜂乐玛创始人", accountId: "fenglema_zhihu",
    boundPersonal: "fengle_bj_01", boundWecom: "—",
    monthlyTraffic: 340, conversionRate: "9.1%", status: "待配置",
    ruleDesc: "暂未配置分配规则", lastSync: "—" },
  { id: 7, platform: "小红书", emoji: "📕", name: "fenglema_pro", accountId: "fenglema_pro_xhs",
    boundPersonal: "fengle_hz_01", boundWecom: "—",
    monthlyTraffic: 210, conversionRate: "7.4%", status: "已绑定",
    ruleDesc: "PRO干货笔记→加微信→PRO会员群", lastSync: "07-03 16:00" },
];

const assignRules = [
  { id: 1, name: "抖音购买PRO会员", trigger: "来源：抖音 + 订单金额 ≥ 2980元",
    wechat: "按城市匹配对应个人微信", group: "对应城市 PRO 会员群", wecom: "同步企业微信", priority: 1, active: true },
  { id: 2, name: "小红书引流体验营", trigger: "来源：小红书 + 标签含「体验营」",
    wechat: "fengle_sz_01", group: "深圳体验官群01", wecom: "不同步企微", priority: 2, active: true },
  { id: 3, name: "公众号新关注用户", trigger: "来源：公众号关注 + 无历史订单",
    wechat: "按城市匹配个人微信", group: "对应城市游客群", wecom: "不同步企微", priority: 3, active: true },
  { id: 4, name: "视频号直播间购买", trigger: "来源：视频号直播 + 任意购买",
    wechat: "fengle_bj_01", group: "北京PRO会员群01", wecom: "同步企业微信", priority: 4, active: true },
  { id: 5, name: "微信小店代理授权", trigger: "来源：微信小店 + 商品类型=代理",
    wechat: "按城市匹配对应微信", group: "对应城市代理群", wecom: "同步企业微信", priority: 5, active: true },
  { id: 6, name: "知乎专栏引流", trigger: "来源：知乎 + 填写意向表单",
    wechat: "fengle_bj_01", group: "北京游客群01", wecom: "不同步企微", priority: 6, active: false },
];

const trafficLog = [
  { time: "07-05 14:23", user: "李云天", phone: "138****4567", source: "抖音", sourceDetail: "视频《私域运营秘诀》评论区",
    assignedWeChat: "fengle_bj_01", assignedGroup: "北京PRO会员群01", wecomSync: true, ruleHit: "抖音购买PRO会员" },
  { time: "07-05 13:45", user: "张晓红", phone: "139****4568", source: "小红书", sourceDetail: "fenglema_life 笔记《健康分享》",
    assignedWeChat: "fengle_sh_01", assignedGroup: "上海游客群01", wecomSync: false, ruleHit: "小红书引流体验营" },
  { time: "07-05 11:20", user: "王建国", phone: "158****4569", source: "微信小店", sourceDetail: "代理授权套餐下单",
    assignedWeChat: "fengle_gz_01", assignedGroup: "广州代理群01", wecomSync: true, ruleHit: "微信小店代理授权" },
  { time: "07-05 10:00", user: "陈美玲", phone: "137****4570", source: "公众号", sourceDetail: "蜂乐玛官方 · 关注引流",
    assignedWeChat: "fengle_cd_01", assignedGroup: "成都分站群01", wecomSync: false, ruleHit: "公众号新关注用户" },
  { time: "07-04 18:30", user: "赵志远", phone: "186****4571", source: "视频号", sourceDetail: "直播回放《7月城市合伙人》",
    assignedWeChat: "fengle_sz_01", assignedGroup: "深圳代理群01", wecomSync: true, ruleHit: "视频号直播间购买" },
  { time: "07-04 16:00", user: "孙伟明", phone: "152****4572", source: "小红书", sourceDetail: "fenglema_pro 笔记《PRO干货》",
    assignedWeChat: "fengle_hz_01", assignedGroup: "杭州会员群01", wecomSync: false, ruleHit: "小红书引流体验营" },
  { time: "07-04 14:12", user: "刘晓峰", phone: "138****5432", source: "抖音", sourceDetail: "视频《社群运营》点击橱窗",
    assignedWeChat: "fengle_bj_01", assignedGroup: "北京体验官群01", wecomSync: true, ruleHit: "抖音购买PRO会员" },
  { time: "07-04 09:30", user: "赵雨晴", phone: "139****4321", source: "公众号", sourceDetail: "蜂乐玛官方 · 文章引流",
    assignedWeChat: "fengle_sh_01", assignedGroup: "上海游客群01", wecomSync: false, ruleHit: "公众号新关注用户" },
];

// ─── 渠道绑定 Tab ─────────────────────────────────────────────
function ChannelsTab() {
  const [selected, setSelected] = useState<number | null>(null);
  const detail = channels.find(c => c.id === selected);

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      <div className="flex-1 flex flex-col gap-3">
        {/* Header stats */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {[
            { label: "已绑定渠道", value: channels.filter(c => c.status === "已绑定").length },
            { label: "待配置", value: channels.filter(c => c.status === "待配置").length },
            { label: "本月总流量", value: channels.reduce((s, c) => s + c.monthlyTraffic, 0).toLocaleString() },
            { label: "平均转化率", value: "6.8%" },
          ].map(s => (
            <div key={s.label} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ color: S.muted, fontSize: 11, fontFamily: "monospace" }}>{s.label}</div>
              <div style={{ color: S.text, fontSize: 22, fontWeight: 700, marginTop: 4, fontFamily: "monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Channel cards */}
        <div className="grid grid-cols-2 gap-3 overflow-auto flex-1 content-start pb-2">
          {channels.map(c => {
            const isSelected = selected === c.id;
            const isBound = c.status === "已绑定";
            return (
              <div
                key={c.id}
                style={{
                  background: isSelected ? S.accentLight : S.surface,
                  border: `1px solid ${isSelected ? "rgba(204,255,0,0.4)" : S.border}`,
                  borderRadius: S.radius,
                  padding: 16,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.15s",
                }}
                onClick={() => setSelected(isSelected ? null : c.id)}
              >
                {/* 平台 + 状态 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div style={{ width: 36, height: 36, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: "#f7f7f7" }}>
                      {c.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: 11, fontWeight: 700, color: S.muted, fontFamily: "monospace", textTransform: "uppercase" }}>{c.platform}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                          padding: "1px 6px", borderRadius: S.radiusSm,
                          background: isBound ? S.accent : "#ffd600",
                          color: isBound ? "#000" : "#000",
                        }}>{c.status}</span>
                      </div>
                      <div style={{ fontSize: 12, marginTop: 2, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{c.name}</div>
                    </div>
                  </div>
                </div>

                {/* 数据 */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{c.monthlyTraffic.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>月流量</div>
                  </div>
                  <div style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{c.conversionRate}</div>
                    <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>转化率</div>
                  </div>
                </div>

                {/* 绑定信息 */}
                <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { label: "个人微信：", value: c.boundPersonal },
                    { label: "企业微信：", value: c.boundWecom },
                    { label: "分配规则：", value: c.ruleDesc },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", gap: 6, fontSize: 11, fontFamily: "monospace" }}>
                      <span style={{ color: S.muted, flexShrink: 0 }}>{row.label}</span>
                      <span style={{ color: S.textSec }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <span style={{ fontSize: 10, color: S.mutedLight, fontFamily: "monospace" }}>同步 {c.lastSync}</span>
                  <button
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "4px 10px", borderRadius: S.radiusSm, border: `1px solid ${S.border}`, background: "#f7f7f7", color: S.text, fontFamily: "monospace", cursor: "pointer" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <Settings size={11} /> 配置规则
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {detail && (
        <div style={{ width: 288, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${S.border}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>渠道详情</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} style={{ color: S.muted }} /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", padding: "16px 0", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, background: "#f7f7f7" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{detail.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{detail.name}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2, fontFamily: "monospace" }}>{detail.platform} · {detail.accountId}</div>
              <span style={{
                marginTop: 8, display: "inline-block", padding: "2px 10px", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                background: detail.status === "已绑定" ? S.accent : "#ffd600",
                color: "#000",
              }}>{detail.status}</span>
            </div>

            {/* Flow diagram */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: S.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>流量分配路径</div>
              {[
                { label: "流量来源", value: `${detail.platform} · ${detail.name}` },
                { label: "绑定个人微信", value: detail.boundPersonal },
                { label: "绑定企业微信", value: detail.boundWecom },
              ].map((r, i, arr) => (
                <div key={r.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, background: "#f7f7f7" }}>
                    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", color: S.accent, fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "monospace", borderRadius: S.radiusSm }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>{r.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{r.value}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}><ArrowRight size={14} style={{ color: S.mutedLight, transform: "rotate(90deg)" }} /></div>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}><ArrowRight size={14} style={{ color: S.mutedLight, transform: "rotate(90deg)" }} /></div>
              <div style={{ padding: "8px 12px", border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radiusSm, background: S.accentLight }}>
                <div style={{ fontSize: 10, color: S.text, fontFamily: "monospace" }}>分配规则</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: S.text, fontFamily: "monospace", marginTop: 2 }}>{detail.ruleDesc}</div>
              </div>
            </div>

            {[["本月流量", detail.monthlyTraffic.toLocaleString()], ["转化率", detail.conversionRate], ["最近同步", detail.lastSync]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: `1px solid ${S.border}` }}>
                <span style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: S.text, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${S.border}` }}>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: S.radiusSm, border: "none", background: "#0d0d0d", color: S.accent, fontSize: 12, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}>编辑绑定配置</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button style={{ padding: "7px 0", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 600, border: `1px solid ${S.border}`, background: "#f7f7f7", color: S.text, fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <RefreshCw size={11} />手动同步
              </button>
              <button style={{ padding: "7px 0", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 600, border: "none", background: S.accent, color: "#000", fontFamily: "monospace", cursor: "pointer" }}>查看流量</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 分配规则 Tab ─────────────────────────────────────────────
function RulesTab() {
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="flex-1 overflow-auto space-y-3">
      <div className="flex items-center justify-between flex-shrink-0">
        <div style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>已配置 {assignRules.length} 条规则，按优先级顺序执行</div>
        <button
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: S.radiusSm, border: "none", background: "#0d0d0d", color: S.accent, fontSize: 12, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}
          onClick={() => setShowNew(!showNew)}
        >
          <Plus size={13} /> 新增规则
        </button>
      </div>

      {/* New rule form */}
      {showNew && (
        <div style={{ padding: 16, border: `2px dashed ${S.borderMed}`, borderRadius: S.radius, background: "#f7f7f7" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: S.text, fontFamily: "monospace" }}>新增分配规则</div>
          <div className="grid grid-cols-2 gap-3">
            {[["规则名称","如：抖音体验营购买"],["触发条件","来源 + 标签/金额"],["绑定个人微信","选择微信号"],["分配到群组","选择群组"],["企业微信同步","同步/不同步"]].map(([l, p]) => (
              <div key={l}>
                <label style={{ display: "block", fontSize: 11, marginBottom: 4, color: S.muted, fontFamily: "monospace" }}>{l}</label>
                <input style={{ width: "100%", padding: "8px 10px", borderRadius: S.radiusSm, border: `1px solid rgba(0,0,0,0.12)`, background: "#fff", color: S.text, fontSize: 12, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} placeholder={p} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <button style={{ padding: "7px 14px", borderRadius: S.radiusSm, fontSize: 12, border: `1px solid ${S.border}`, background: "#fff", color: S.text, fontFamily: "monospace", cursor: "pointer" }} onClick={() => setShowNew(false)}>取消</button>
            <button style={{ padding: "7px 16px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, border: "none", background: "#0d0d0d", color: S.accent, fontFamily: "monospace", cursor: "pointer" }}>保存规则</button>
          </div>
        </div>
      )}

      {assignRules.map((rule) => (
        <div key={rule.id} style={{ padding: 16, border: `1px solid ${S.border}`, borderRadius: S.radius, background: S.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-start gap-4">
            <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "monospace", flexShrink: 0, marginTop: 2, background: rule.active ? "#0d0d0d" : "rgba(0,0,0,0.08)", color: rule.active ? S.accent : S.muted, borderRadius: S.radiusSm }}>
              {rule.priority}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: 13, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{rule.name}</span>
                <span style={{ padding: "2px 8px", borderRadius: S.radiusSm, fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: rule.active ? S.accent : "#f0f0ec", color: rule.active ? "#000" : "#555" }}>
                  {rule.active ? "已启用" : "已停用"}
                </span>
              </div>

              {/* Flow */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "触发条件", value: rule.trigger, bg: "#ffd600", tc: S.text },
                  { label: "→ 个人微信", value: rule.wechat, bg: S.accentLight, tc: S.text },
                  { label: "→ 分配群组", value: rule.group, bg: "#f0f0ec", tc: "#333333" },
                  { label: "→ 企业微信", value: rule.wecom, bg: rule.wecom === "同步企业微信" ? "#0d0d0d" : "#f0f0ec", tc: rule.wecom === "同步企业微信" ? S.accent : "#666666" },
                ].map(step => (
                  <div key={step.label} style={{ padding: "6px 10px", borderRadius: S.radiusSm, background: step.bg, border: `1px solid ${S.border}` }}>
                    <div style={{ color: step.tc, fontSize: 10, opacity: 0.7, fontFamily: "monospace" }}>{step.label}</div>
                    <div style={{ color: step.tc, fontWeight: 600, fontSize: 11, fontFamily: "monospace" }}>{step.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button style={{ padding: "5px 10px", borderRadius: S.radiusSm, fontSize: 11, border: `1px solid ${S.border}`, background: "#f7f7f7", color: S.muted, fontFamily: "monospace", cursor: "pointer" }}>编辑</button>
              <button style={{ padding: "5px 10px", borderRadius: S.radiusSm, fontSize: 11, fontWeight: 700, border: "none", fontFamily: "monospace", cursor: "pointer", background: rule.active ? "#0d0d0d" : S.accent, color: rule.active ? S.accent : "#000" }}>
                {rule.active ? "停用" : "启用"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 流量日志 Tab ─────────────────────────────────────────────
function TrafficLogTab() {
  const sourcePlatform: Record<string, string> = { "抖音": "🎵", "小红书": "📕", "微信小店": "🛍️", "公众号": "📢", "视频号": "🎬" };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", flexShrink: 0, borderBottom: `1px solid ${S.border}`, background: "#f7f7f7", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} style={{ color: S.text }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>实时流量分配日志</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1px solid rgba(0,0,0,0.12)`, borderRadius: S.radiusSm, background: "#fff" }}>
            <Search size={12} style={{ color: S.muted }} />
            <input style={{ background: "transparent", outline: "none", fontSize: 12, width: 128, color: S.text, fontFamily: "monospace" }} placeholder="搜索用户、渠道..." />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: S.radiusSm, fontSize: 12, border: `1px solid ${S.border}`, background: "#fff", color: S.muted, fontFamily: "monospace", cursor: "pointer" }}>
            <Filter size={12} /> 筛选
          </button>
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", fontSize: 11, fontWeight: 700, flexShrink: 0, background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555555", fontFamily: "monospace", textTransform: "uppercase" }}>
        {([["时间",80],["用户",90],["手机",110],["来源渠道",220],["分配个人微信",140],["分配群组",160],["企微同步",80],["命中规则",160]] as [string,number][]).map(([l,w]) => (
          <div key={l} style={{ flexShrink: 0, width: w }}>{l}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {trafficLog.map((log, idx) => (
          <div key={idx}
            style={{ display: "flex", alignItems: "center", padding: "12px 16px", fontSize: 12, fontFamily: "monospace", borderBottom: `1px solid ${S.border}`, background: idx % 2 === 0 ? "#fff" : "#fafaf8", cursor: "default" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(204,255,0,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafaf8")}>
            <div style={{ flexShrink: 0, width: 80, color: S.muted }}>{log.time}</div>
            <div style={{ flexShrink: 0, width: 90, fontWeight: 600, color: S.text }}>{log.user}</div>
            <div style={{ flexShrink: 0, width: 110, color: S.muted }}>{log.phone}</div>
            <div style={{ flexShrink: 0, width: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{sourcePlatform[log.source] || "🌐"}</span>
                <div>
                  <span style={{ fontWeight: 600, color: S.textSec }}>{log.source}</span>
                  <div style={{ color: S.mutedLight, fontSize: 10 }}>{log.sourceDetail}</div>
                </div>
              </div>
            </div>
            <div style={{ flexShrink: 0, width: 140, color: S.text, fontWeight: 600 }}>{log.assignedWeChat}</div>
            <div style={{ flexShrink: 0, width: 160, color: S.textSec }}>{log.assignedGroup}</div>
            <div style={{ flexShrink: 0, width: 80 }}>
              <span style={{ padding: "2px 6px", borderRadius: S.radiusSm, fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: log.wecomSync ? "#0d0d0d" : "#f0f0ec", color: log.wecomSync ? S.accent : "#555" }}>
                {log.wecomSync ? "已同步" : "未同步"}
              </span>
            </div>
            <div style={{ flexShrink: 0, width: 160 }}>
              <span style={{ padding: "2px 8px", borderRadius: S.radiusSm, fontSize: 10, fontFamily: "monospace", background: S.accentLight, color: S.text, fontWeight: 600, border: `1px solid rgba(204,255,0,0.3)` }}>{log.ruleHit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px", flexShrink: 0, borderTop: `1px solid ${S.border}`, background: "#f7f7f7", borderRadius: `0 0 ${S.radius} ${S.radius}` }}>
        <span style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>共 {trafficLog.length} 条记录（今日）</span>
      </div>
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
const tabs = ["渠道绑定", "分配规则", "流量日志"];

export default function ChannelFlow() {
  const [activeTab, setActiveTab] = useState("渠道绑定");

  return (
    <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 16, background: S.bg, fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, color: S.text, fontFamily: "monospace", fontSize: 16 }}>渠道流量与分配</h2>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: S.muted, fontFamily: "monospace" }}>
            绑定各媒体渠道账号（微信小店/抖音/小红书等），配置用户从不同渠道进来后的自动分配规则
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, padding: "6px 12px", flexShrink: 0, border: `1px solid rgba(204,255,0,0.4)`, borderRadius: S.radiusSm, background: S.accentLight, color: S.text, fontFamily: "monospace", fontWeight: 700 }}>
          <div style={{ width: 8, height: 8, background: S.accent, borderRadius: "50%" }} />
          实时同步中
        </div>
      </div>

      {/* 架构说明 */}
      <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 16, flexShrink: 0, border: `1px solid ${S.border}`, borderRadius: S.radius, background: S.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <Link size={16} style={{ color: S.text, marginTop: 1, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>渠道流量分配流程</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11 }}>
            {["媒体账号发布内容", "用户点击/购买/关注", "系统识别来源渠道", "匹配分配规则", "分配到对应个人微信", "加入对应微信群", "同步企业微信（可选）"].map((s, i, arr) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ padding: "4px 8px", background: "#0d0d0d", color: S.accent, fontFamily: "monospace", fontSize: 10, fontWeight: 600, borderRadius: S.radiusSm }}>{s}</span>
                {i < arr.length - 1 && <ArrowRight size={12} style={{ color: S.muted }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0, width: "fit-content", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: 4 }}>
        {tabs.map(t => (
          <button
            key={t}
            style={{
              padding: "8px 20px", borderRadius: S.radiusSm, fontSize: 12, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", border: "none",
              background: activeTab === t ? "#0d0d0d" : "transparent",
              color: activeTab === t ? S.accent : S.muted,
            }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "渠道绑定" && <ChannelsTab />}
      {activeTab === "分配规则" && <RulesTab />}
      {activeTab === "流量日志" && <TrafficLogTab />}
    </div>
  );
}
