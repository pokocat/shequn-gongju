/* RefundResult.jsx — 退款结果 (30) */
function RefundResultScreen({ nav }) {
  const steps = [
    { t: "提交申请", s: "已提交", date: "05.21 14:32", icon: "doc", done: true },
    { t: "平台审核", s: "审核中", date: "05.21 14:35", icon: "shield", active: true },
    { t: "退款处理", s: "待处理", icon: "card" },
    { t: "结果通知", s: "待通知", icon: "bell" },
  ];
  const info = [
    { icon: "doc", l: "订单编号", v: "TK2505160001", mono: true, copy: true },
    { icon: "card", l: "退款金额", v: "¥ 2,999.00", mono: true, hl: "#ff9ee0" },
    { icon: "clock", l: "申请时间", v: "2025.05.21 14:32", mono: true },
    { icon: "shield", l: "当前状态", v: "平台审核中", hl: "#c79bff" },
    { icon: "clock", l: "预计到账时间", v: "1-3 个工作日内", mono: true },
  ];
  return (
    <div className="screen flush fade-in" style={{ paddingBottom: 0 }}>
      <div style={{ padding: "0 16px" }}>
        <AppHeader pro={true} gem={false} />

        {/* hero */}
        <div className="card result-hero">
          <div className="result-hero-text">
            <span className="tag purple" style={{ borderRadius: 999, padding: "4px 11px" }}>退款结果</span>
            <div className="title-grad" style={{ fontSize: 32, letterSpacing: 1, marginTop: 8 }}>退款处理中</div>
            <div style={{ fontSize: 12.5, color: "#cfc3ea", marginTop: 8, lineHeight: 1.6 }}>您的退款申请已提交，平台正在审核，请留意消息通知</div>
            <span className="pill-outline" style={{ marginTop: 12 }}><Icon name="bell" size={12} color="#c79bff" />消息通知中</span>
          </div>
          <div className="result-hero-art"><HeroGem w={128} h={120} icon="yrefund" hue={300} /></div>
        </div>

        {/* progress */}
        <div className="card card-pad section-gap">
          <div className="row-between" style={{ marginBottom: 16 }}><div className="col-h" style={{ fontSize: 16 }}>处理进度</div><span className="link-trail" onClick={() => prototypeToast("退款进度已更新")}>实时更新 <Icon name="refresh" size={13} color="#6f7a98" /></span></div>
          <div className="hprog">
            {steps.map((s, i) => (
              <React.Fragment key={s.t}>
                <div className="hprog-step">
                  <div className={"hprog-node" + (s.done ? " done" : s.active ? " active pink" : "")}><Icon name={s.icon} size={18} color={s.done || s.active ? "#fff" : "#7a85a8"} /></div>
                  <div className="hprog-t" style={{ color: s.done || s.active ? "#fff" : "var(--ink-300)" }}>{s.t}</div>
                  <div className="hprog-s" style={{ color: s.active ? "#ff7ec2" : "var(--ink-400)" }}>{s.s}</div>
                  {s.date && <div className="num hprog-d">{s.date}</div>}
                </div>
                {i < steps.length - 1 && <span className={"hprog-line" + (s.done ? " on" : "")} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 10 }}>退款信息</div>
          <div className="info-card">
            {info.map((r) => (
              <div className="ic-row" key={r.l}>
                <div className="ic-l"><Icon name={r.icon} size={15} color="#9a8fc8" /><span>{r.l}</span></div>
                <div className={"ic-v" + (r.mono ? " num" : "")} style={{ color: r.hl || "#fff", display: "flex", alignItems: "center", gap: 5 }}>{r.v}{r.copy && <Icon name="copy" size={12} color="#9a8fc8" />}</div>
              </div>
            ))}
          </div>
        </div>

        {/* warning */}
        <div className="warn-box section-gap">
          <Icon name="warn" size={20} color="#ec5b6f" />
          <div style={{ fontSize: 12, color: "#f0a9b3", lineHeight: 1.6 }}><b style={{ color: "#ff9ec2" }}>温馨提示：</b>已使用的部分权益可能影响退款结果，最终结果以平台审核为准。</div>
        </div>

        {/* service */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 12 }}>专属服务支持</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar size={48} initial="林" ring={true} hue={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>林老师</span><span className="tag purple">专属服务</span></div>
              <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>社群运营专家 · 企业增长顾问</div>
              <div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="pulse" size={12} color="#c79bff" />2 小时内响应您的问题与进度咨询</div>
            </div>
            <button className="btn-soft" onClick={() => nav("addWechat")}><Icon name="chat" size={14} color="#e0d2ff" /> 联系老师</button>
          </div>
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => prototypeDialog({ title: "退款详情", body: "退款申请 RF20250522006 正在审核，预计 1–3 个工作日完成。审核结果将通过消息与短信同步。" })}><Icon name="doc" size={17} color="#fff" /> 查看退款详情</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("settings")}><Icon name="user" size={17} color="#e0c8ff" /> 返回会员中心</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 退款结果将通过站内信与短信通知，请保持关注</div>
    </div>
  );
}

Object.assign(window, { RefundResultScreen });
