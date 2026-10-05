/* Subscribe.jsx — 会员订阅 (02) */
function SubscribeScreen({ nav }) {
  const [plan, setPlan] = React.useState("year");
  const rows = ["资源权益", "课程优先", "闭门活动", "社群诊断", "专属服务微信", "永久会员档案"];
  const rowIcons = ["gem", "book", "calendar", "members", "wechat", "contacts"];

  return (
    <div className="screen has-tabbar fade-in" style={{ paddingTop: 2 }}>
      <div className="row-between" style={{ padding: "2px 2px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AppBackButton />
          <div style={{ fontSize: 23, fontWeight: 800, color: "#fff" }}>主理人公社</div>
        </div>
        <WxCapsule />
      </div>
      <div className="topseg">
        <button type="button" className="seg active" aria-pressed="true" disabled>会员订阅</button>
        <button type="button" className="seg" onClick={() => nav("points")}>成长积分</button>
      </div>

      {/* plan hero with comparison table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="sub-hero">
          <div className="sub-hero-glow" />
          <div style={{ position: "relative", zIndex: 2, padding: "30px 18px 16px" }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: .5 }}>AI 驱动 · 资源链接 · 共同成长</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-200)", textAlign: "center", marginTop: 8 }}>主理人公社 PRO 会员计划</div>
            <div style={{ fontSize: 13, color: "#d7caf2", textAlign: "center", marginTop: 64, letterSpacing: 1 }}>连接优质资源，放大商业影响力</div>
          </div>
        </div>
        {/* comparison */}
        <div className="cmp">
          <div className="cmp-head">
            <div className="cmp-c1">权益对比</div>
            <div className="cmp-c2">普通会员</div>
            <div className="cmp-c3">PRO 会员</div>
          </div>
          {rows.map((r, i) => (
            <div className="cmp-row" key={r}>
              <div className="cmp-c1"><Icon name={rowIcons[i]} size={16} color="#9a8fc8" /> {r}</div>
              <div className="cmp-c2"><Icon name="xcircle" size={16} color="#5a6486" /></div>
              <div className="cmp-c3"><Icon name="shield" size={16} color="#d59bff" /></div>
            </div>
          ))}
        </div>
      </div>

      {/* plan options */}
      <div className={"plan-row section-gap" + (plan === "month" ? " sel" : "")} onClick={() => setPlan("month")}>
        <span className="radio">{plan === "month" && <i />}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>月度会员</div>
          <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 3 }}>按月自动续费，可随时取消</div>
        </div>
        <div className="price"><b>¥</b><span className="num pv">299</span><i>/月</i></div>
      </div>
      <div className={"plan-row section-gap" + (plan === "year" ? " sel" : "")} onClick={() => setPlan("year")}>
        <span className="radio">{plan === "year" && <i />}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>年度会员</span>
            <span className="gift-pill">赠送 AI 诊断</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 3 }}>按年自动续费，可随时取消</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="price"><b>¥</b><span className="num pv">2999</span><i>/年</i></div>
          <div className="num" style={{ fontSize: 11.5, color: "#f0c25a", marginTop: 2 }}>省¥589</div>
        </div>
      </div>

      <button className="cta-primary" style={{ marginTop: 18 }} onClick={() => nav("payment")}>
        立即开通 PRO 会员
        <span className="arrow"><Icon name="arrow" size={17} color="#fff" /></span>
      </button>
      <div className="reg-foot"><Icon name="shield" size={13} color="#6f7a98" /> 开通即表示同意《自动续费服务协议》，可随时在会员中心取消</div>
    </div>
  );
}

Object.assign(window, { SubscribeScreen });
