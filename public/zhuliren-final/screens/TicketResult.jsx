/* TicketResult.jsx — 工单处理结果 (28) */
function TicketResultScreen({ nav }) {
  const steps = [
    { t: "提交工单", s: "已完成", date: "05.21 14:32", icon: "doc", done: true },
    { t: "平台受理", s: "已受理", date: "05.21 14:35", icon: "headset", active: true },
    { t: "分配老师", s: "处理中", icon: "user" },
    { t: "反馈结果", s: "待完成", icon: "chat" },
  ];
  const info = [
    { icon: "doc", l: "工单编号", v: "TK250521093512", mono: true, copy: true },
    { icon: "grid9", l: "问题类型", v: "课程内容咨询", chev: true },
    { icon: "clock", l: "提交时间", v: "2025.05.21 14:32", mono: true },
    { icon: "shield", l: "当前状态", v: "已分配老师处理中", hl: "#8aa6ff" },
    { icon: "calendar", l: "预计反馈时间", v: "2025.05.22 前", mono: true },
  ];
  const tips = [
    { icon: "folder", t: "可补充材料", d: "补充问题截图或说明\n有助于更快解决" },
    { icon: "chat", t: "可联系老师", d: "如有紧急情况可直接\n联系服务老师" },
    { icon: "bell", t: "留意消息通知", d: "处理进度与结果将\n通过消息通知您" },
  ];
  return (
    <div className="screen flush fade-in" style={{ paddingBottom: 0 }}>
      <div style={{ padding: "0 16px" }}>
        <AppHeader pro={true} gem={false} />

        {/* hero */}
        <div className="card result-hero">
          <div className="result-hero-text">
            <div className="title-grad" style={{ fontSize: 32, letterSpacing: 1 }}>工单已受理</div>
            <div style={{ fontSize: 12.5, color: "#cfc3ea", marginTop: 8, lineHeight: 1.6 }}>您的问题已进入服务流程，<br/>我们会尽快为您处理</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              <span className="pill-outline"><Icon name="clock" size={12} color="#c79bff" />处理中</span>
              <span className="pill-outline"><Icon name="shield" size={12} color="#9af0fb" />已分配</span>
              <span className="pill-outline"><Icon name="bell" size={12} color="#ff9ee0" />消息提醒</span>
            </div>
          </div>
          <div className="result-hero-art"><HeroGem w={128} h={120} icon="headset" /></div>
        </div>

        {/* progress */}
        <div className="card card-pad section-gap">
          <div className="row-between" style={{ marginBottom: 16 }}><div className="col-h" style={{ fontSize: 16 }}>处理进度</div><button type="button" className="msg-text-btn" onClick={() => prototypeToast("工单进度已更新")}>实时更新 <Icon name="refresh" size={12} color="#8a93ad" /></button></div>
          <div className="hprog">
            {steps.map((s, i) => (
              <React.Fragment key={s.t}>
                <div className="hprog-step">
                  <div className={"hprog-node" + (s.done ? " done" : s.active ? " active" : "")}><Icon name={s.icon} size={18} color={s.done || s.active ? "#fff" : "#7a85a8"} /></div>
                  <div className="hprog-t" style={{ color: s.done || s.active ? "#fff" : "var(--ink-300)" }}>{s.t}</div>
                  <div className="hprog-s" style={{ color: s.done ? "#5fd9a8" : s.active ? "#c79bff" : "var(--ink-400)" }}>{s.s}</div>
                  {s.date && <div className="num hprog-d">{s.date}</div>}
                </div>
                {i < steps.length - 1 && <span className={"hprog-line" + (s.done ? " on" : "")} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 10 }}>工单信息</div>
          <div className="info-card">
            {info.map((r) => (
              <div className="ic-row" key={r.l}>
                <div className="ic-l"><Icon name={r.icon} size={15} color="#9a8fc8" /><span>{r.l}</span></div>
                <div className={"ic-v" + (r.mono ? " num" : "")} style={{ color: r.hl || "#fff", display: "flex", alignItems: "center", gap: 5 }}>{r.v}{r.copy && <Icon name="copy" size={12} color="#9a8fc8" />}{r.chev && <Icon name="chev" size={13} color="#5a6486" />}</div>
              </div>
            ))}
          </div>
        </div>

        {/* assigned teacher */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 12 }}>为您分配的服务老师</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", gap: 12 }}>
              <Avatar size={52} initial="林" ring={true} hue={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>林老师</span><span className="tag purple">专属服务</span></div>
                <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>社群运营专家 · 企业增长顾问</div>
                <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="shield" size={12} color="#6f7a98" />已累计处理工单 328+</div>
              </div>
            </div>
            <div className="resp-box">
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="pulse" size={15} color="#c79bff" /><span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>2 小时内响应</span></div>
              <div style={{ fontSize: 10.5, color: "var(--ink-300)", marginTop: 6, lineHeight: 1.5 }}>工作日优先处理<br/>专属全程跟进</div>
            </div>
          </div>
        </div>

        {/* tips */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 12 }}>温馨提示</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {tips.map((t) => (
              <div className="tip-tile" key={t.t}>
                <Icon name={t.icon} size={20} color="#b88bff" />
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginTop: 6 }}>{t.t}</div>
                <div style={{ fontSize: 10, color: "var(--ink-300)", marginTop: 3, lineHeight: 1.4, whiteSpace: "pre-line" }}>{t.d}</div>
                <Icon name="chev" size={13} color="#5a6486" style={{ position: "absolute", right: 8, bottom: 8 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => prototypeDialog({ title: "工单详情", body: "工单 TK20250522018 已受理，问题类型：账号问题。林老师预计在 2 小时内首次响应。" })}><Icon name="doc" size={17} color="#fff" /> 查看工单详情</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("ticket")}><Icon name="headset" size={17} color="#e0c8ff" /> 返回服务中心</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 感谢您的信任，我们将竭诚为您服务</div>
    </div>
  );
}

Object.assign(window, { TicketResultScreen });
