/* BookingSuccess.jsx — 诊断预约成功 (25) */
function BookingSuccessScreen({ nav }) {
  const steps = [
    { t: "提交预约", s: "已提交", icon: "shield", done: true },
    { t: "智能匹配", s: "进行中", icon: "aitext", active: true },
    { t: "服务确认", s: "待确认", icon: "user" },
    { t: "生成报告", s: "待生成", icon: "doc" },
  ];
  const info = [
    { icon: "crown", l: "诊断类型", v: "AI 增长诊断" },
    { icon: "clock", l: "提交时间", v: "2025.05.22 20:30", mono: true },
    { icon: "pin", l: "预约城市", v: "杭州" },
    { icon: "target", l: "当前状态", v: "智能匹配中", hl: true },
    { icon: "clock", l: "预计反馈时间", v: "2025.05.24 前", mono: true },
  ];
  return (
    <div className="screen flush fade-in booking-success-screen" style={{ paddingBottom: 0 }}>
      <div className="booking-success-content" style={{ padding: "0 16px" }}>
        <div className="row-between booking-success-head" style={{ padding: "2px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AppBackButton />
            <div className="app-logo" style={{ width: 32, height: 32, flex: "0 0 32px", borderRadius: 9 }}><Icon name="gemlogo" size={19} /></div>
            <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>主理人公社</span><span className="badge-pro">PRO</span><span className="ai-badge">AI</span></div><div style={{ fontSize: 11, color: "var(--ink-300)" }}>连接主理人 · 共创新商业</div></div>
          </div>
          <WxCapsule />
        </div>

        {/* hero */}
        <div className="card result-hero booking-success-hero">
          <div className="result-hero-text">
            <div className="title-grad" style={{ fontSize: 36, letterSpacing: 2 }}>预约成功</div>
            <div style={{ fontSize: 13, color: "#cfc3ea", marginTop: 8, lineHeight: 1.6 }}>您的 AI 诊断需求已提交，<br/>我们将为您智能匹配排期与服务老师</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              <span className="pill-outline"><Icon name="crown" size={12} color="#c79bff" />PRO 专享</span>
              <span className="pill-outline"><Icon name="sparkle" size={12} color="#9af0fb" />智能匹配中</span>
              <span className="pill-outline"><Icon name="clock" size={12} color="#ff9ee0" />优先排期</span>
            </div>
          </div>
          <div className="result-hero-art"><CrystalCheck size={130} /></div>
        </div>

        {/* progress */}
        <div className="card card-pad section-gap booking-progress-card">
          <div className="row-between" style={{ marginBottom: 16 }}><div className="col-h" style={{ fontSize: 16 }}>预约进度</div><span className="link-trail" onClick={() => prototypeToast("进度已更新：智能匹配中")}>实时更新 <Icon name="refresh" size={13} color="#6f7a98" /></span></div>
          <div className="hprog">
            {steps.map((s, i) => (
              <React.Fragment key={s.t}>
                <div className="hprog-step">
                  <div className={"hprog-node" + (s.done ? " done" : s.active ? " active" : "")}>
                    {s.icon === "aitext" ? <span style={{ fontFamily: "Geist", fontWeight: 800, fontSize: 13 }}>AI</span> : <Icon name={s.icon} size={18} color={s.done || s.active ? "#fff" : "#7a85a8"} />}
                  </div>
                  <div className="hprog-t" style={{ color: s.done || s.active ? "#fff" : "var(--ink-300)" }}>{s.t}</div>
                  <div className="hprog-s" style={{ color: s.active ? "#c79bff" : "var(--ink-400)" }}>{s.s}</div>
                </div>
                {i < steps.length - 1 && <span className={"hprog-line" + (s.done ? " on" : "")} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="card card-pad section-gap booking-info-card">
          <div className="row-between" style={{ marginBottom: 8 }}><div className="col-h" style={{ fontSize: 16 }}>预约信息</div><button className="pill-outline" style={{ fontSize: 11 }} onClick={() => prototypeCopy("AI 增长诊断｜杭州｜2025.05.22 20:30｜智能匹配中", "预约信息")}><Icon name="copy" size={12} color="#c79bff" />复制信息</button></div>
          <div className="info-card">
            {info.map((r) => (
              <div className="ic-row" key={r.l}>
                <div className="ic-l"><Icon name={r.icon} size={15} color="#9a8fc8" /><span>{r.l}</span></div>
                <div className={"ic-v" + (r.mono ? " num" : "")} style={{ color: r.hl ? "#c79bff" : "#fff" }}>{r.hl && "✦ "}{r.v}{r.hl && " ✦"}</div>
              </div>
            ))}
          </div>
          <div className="reg-foot" style={{ justifyContent: "flex-start", marginTop: 10, marginLeft: 2 }}><Icon name="shield" size={13} color="#6f7a98" /> 我们将在 1 个工作日内为您确认服务老师与诊断时间</div>
        </div>

        {/* teacher */}
        <div className="card card-pad section-gap booking-teacher-card">
          <div className="row-between" style={{ marginBottom: 12 }}><div className="col-h">已为您推荐专属服务老师</div><span className="link-trail" onClick={() => prototypeDialog({ title: "调整服务老师", body: "可联系服务顾问说明行业、城市与沟通偏好，我们将在 1 个工作日内重新匹配。", confirmText: "联系顾问", onConfirm: () => nav("addWechat") })}>可调整老师 <Icon name="chev" size={13} color="#6f7a98" /></span></div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", gap: 12 }}>
              <Avatar size={56} initial="林" ring={true} hue={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>林老师</span><span className="tag purple">专属服务</span></div>
                <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>社群运营专家 · 企业增长顾问</div>
                <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}><span className="tag purple">AI 诊断协同</span><span className="tag purple">增长策略</span><span className="tag purple">项目陪跑</span></div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "0 0 96px", justifyContent: "center" }}>
              <div><div style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="pulse" size={14} color="#c79bff" /><span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>极速响应</span></div><div style={{ fontSize: 10.5, color: "var(--ink-300)", marginTop: 3 }}>2 小时内响应</div></div>
              <div><div style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="sparkle" size={14} color="#9af0fb" /><span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>专业保障</span></div><div style={{ fontSize: 10.5, color: "var(--ink-300)", marginTop: 3 }}>5 年服务经验</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => document.querySelector(".booking-info-card")?.scrollIntoView({ behavior: "smooth", block: "center" })}><Icon name="scan" size={18} color="#fff" /> 查看预约详情</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("ai")}><Icon name="sparkle" size={17} color="#e0c8ff" /> 返回 AI 诊断</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 感谢您的信任，我们将竭诚为您提供专业服务</div>
    </div>
  );
}

Object.assign(window, { BookingSuccessScreen });
