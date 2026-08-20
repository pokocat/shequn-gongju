/* Renewal.jsx — 续费提醒 (12) */
function RenewalScreen({ nav }) {
  const cd = [["12", "天"], ["04", "时"], ["38", "分"], ["56", "秒"]];
  const keep = [
    { icon: "folder", t: "资源库访问", d: "无限次" },
    { icon: "cap", t: "专属课程", d: "全部解锁" },
    { icon: "lock", t: "闭门会", d: "优先参与" },
    { icon: "aitext", t: "AI 诊断", d: "每月 1 次" },
    { icon: "headset", t: "专属服务", d: "持续陪伴" },
    { icon: "contacts", t: "会员档案", d: "永久保留" },
  ];
  return (
    <div className="screen has-tabbar fade-in">
      <AppHeader />

      {/* hero */}
      <div className="card" style={{ padding: "16px 16px 18px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-300)" }}>会员即将到期</div>
            <div className="title-grad" style={{ fontSize: 25, margin: "6px 0 6px", whiteSpace: "nowrap" }}>及时续费 · 不断成长</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-200)" }}>持续享受优质资源与专属服务</div>
          </div>
          <div style={{ flex: "0 0 120px", marginTop: -4 }}><HeroGem w={128} h={120} icon="crown" /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11.5, color: "var(--ink-300)" }}>到期时间</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 2 }}>2025.06.05</div>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-300)", margin: "10px 0 6px" }}>剩余时间</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {cd.map(([n, u], i) => (
            <React.Fragment key={u}>
              <span className="cd-box num">{n}</span>
              <span style={{ fontSize: 12, color: "var(--ink-300)" }}>{u}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* current plan */}
      <div className="card card-pad section-gap">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="col-h">当前会员方案</span><span className="mcard-pro" style={{ fontSize: 10, padding: "2px 8px" }}>PRO</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <CrystalMedallion size={62} glyph="H" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>PRO 年度会员</span>
              <span className="tag blue">赠送 AI 诊断</span>
              <div className="price" style={{ marginLeft: "auto" }}><b>¥</b><span className="num pv">2999</span><i>/年</i></div>
            </div>
            <div className="row-between" style={{ marginTop: 8 }}>
              <div className="num" style={{ fontSize: 12, color: "var(--ink-300)" }}>有效期至 2025.06.05</div>
              <div className="num" style={{ fontSize: 12, color: "var(--ink-400)" }}>原价¥3588</div>
            </div>
            <div className="row-between" style={{ marginTop: 4 }}>
              <div className="num" style={{ fontSize: 12, color: "var(--ink-300)" }}>开通时间 2024.06.05</div>
              <div className="link-trail" onClick={() => nav("member")}>查看会员卡 <Icon name="chev" size={13} color="#6f7a98" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI renewal advice */}
      <div className="card card-pad section-gap">
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <Icon name="sparkle" size={15} color="#c79bff" /><span className="col-h">AI 续费建议</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-300)", marginBottom: 10 }}>基于您的成长数据和活跃度分析</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="advice-box">
            <div className="ai-circle">AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>建议续费年度会员</span>
                <span className="tag amber">性价比最优</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 6, lineHeight: 1.55 }}>可为您节省 ¥589，继续享受完整权益<br/>预计带来 <span className="num" style={{ color: "#9af0fb" }}>2.8x</span> 的成长效率提升</div>
            </div>
          </div>
        </div>
      </div>

      {/* keep enjoying */}
      <div className="card card-pad section-gap">
        <div className="col-h" style={{ marginBottom: 12 }}>续费后您将继续享受</div>
        <div className="keep-grid">
          {keep.map((k) => (
            <div className="keep-tile" key={k.t}>
              <div className="keep-ico">{k.icon === "aitext" ? <span style={{ fontFamily: "Geist", fontWeight: 800, fontSize: 13, color: "#b88bff" }}>AI</span> : <Icon name={k.icon} size={22} color="#b88bff" />}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginTop: 6 }}>{k.t}</div>
              <div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 2 }}>{k.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* gift banner */}
      <div className="card section-gap" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "linear-gradient(110deg, rgba(60,40,140,.4), rgba(30,40,120,.3))", borderColor: "rgba(150,110,255,.3)" }}>
        <Icon name="award" size={30} color="#ff7ee0" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>续费专属福利</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-200)", marginTop: 3 }}>续费即赠 价值 ¥299 的《AI 商业诊断报告》</div>
        </div>
        <div className="link-trail" style={{ color: "#ff9ee0" }} onClick={() => prototypeDialog({ title: "续费赠礼", body: "活动期内完成年度续费，可获赠 1 次 AI 专属诊断与 500 成长积分。赠礼将在支付成功后自动到账。" })}>限时赠送 <Icon name="chev" size={13} color="#ff9ee0" /></div>
      </div>

      {/* CTAs */}
      <div className="two-col section-gap" style={{ alignItems: "stretch" }}>
        <button className="cta-primary" style={{ height: 54, fontSize: 16, position: "relative" }} onClick={() => nav("payment")}>
          <span className="grow-pill">继续成长</span>立即续费
        </button>
        <button className="cta-ghost" style={{ height: 54, fontSize: 15 }} onClick={() => nav("benefits")}>
          <Icon name="crown" size={17} color="#e0c8ff" /> 查看升级方案 <Icon name="chev" size={14} color="#c9a6ff" />
        </button>
      </div>
      <div className="reg-foot"><Icon name="shield" size={13} color="#6f7a98" /> 续费后有效期将自动延长，可随时在「会员中心」管理</div>
    </div>
  );
}

Object.assign(window, { RenewalScreen });
