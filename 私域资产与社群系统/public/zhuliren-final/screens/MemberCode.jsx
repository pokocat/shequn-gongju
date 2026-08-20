/* MemberCode.jsx — 出示会员码 (21) */
function MemberCodeScreen({ nav }) {
  const [seconds, setSeconds] = React.useState(47);
  const memberId = "HCS2024060520";
  const refreshCode = () => {
    setSeconds(60);
    prototypeToast("会员码已安全刷新");
  };
  React.useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value <= 1 ? 60 : value - 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const scenes = [
    { icon: "calendar", t: "活动签到", d: "线下活动快速签到\n记录参与信息" },
    { icon: "shield", t: "服务核验", d: "专属服务身份核验\n享受会员权益" },
    { icon: "members", t: "闭门会入场", d: "高端闭门活动入场\n专属通行凭证" },
  ];
  return (
    <div className="screen flush fade-in member-code-screen" style={{ paddingBottom: 0 }}>
      <div className="member-code-wrap" style={{ padding: "0 16px" }}>
        <div className="row-between member-code-head" style={{ padding: "2px 0 8px" }}>
          <div className="member-code-brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AppBackButton />
            <div className="app-logo" style={{ width: 30, height: 30, flex: "0 0 30px", borderRadius: 9 }}><Icon name="gemlogo" size={18} /></div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>主理人公社</span>
            <span className="badge-pro">PRO</span>
          </div>
          <WxCapsule />
        </div>

        {/* hero */}
        <div className="card member-code-hero" style={{ padding: "16px", overflow: "hidden", border: "1px solid rgba(90,140,255,.35)", background: "radial-gradient(120% 130% at 85% 0%, rgba(40,60,150,.4), rgba(12,14,28,.55) 60%)" }}>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="title-grad" style={{ fontSize: 34, fontWeight: 900 }}>会员码</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-200)", marginTop: 6 }}>用于线下活动签到、服务核验、权益识别</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <span className="pill-outline"><Icon name="crown" size={12} color="#c79bff" />专属身份</span>
                <span className="pill-outline"><Icon name="shield" size={12} color="#9af0fb" />安全加密</span>
              </div>
            </div>
            <div style={{ flex: "0 0 120px" }}><HeroGem w={128} h={116} icon="user" hue={250} /></div>
          </div>
        </div>

        {/* QR card */}
        <div className="card section-gap qr-card member-code-qr-card">
          <button type="button" className="qr-frame member-code-refresh" onClick={refreshCode} aria-label="刷新会员码">
            <QrCode size={210} />
          </button>
          <div className="row-between" style={{ marginTop: 12, padding: "0 4px" }}>
            <span style={{ fontSize: 12, color: "var(--ink-300)" }}>每60秒自动更新，请勿截图使用</span>
            <span style={{ fontSize: 12.5, color: "#c79bff", display: "flex", alignItems: "center", gap: 4 }}><Icon name="refresh" size={13} color="#c79bff" /><span className="num">{seconds}s</span></span>
          </div>
          {/* profile chip */}
          <div className="codeprofile member-code-profile" onClick={() => nav("member")} role="button" tabIndex={0} aria-label="查看会员卡" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") nav("member"); }}>
            <Avatar size={46} initial="S" hue={0} src="assets/member-shirley-avatar.png" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "Geist" }}>Shirley</span><span className="tag purple">PRO 会员</span></div>
              <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 3 }}>联合创始人 · 数字增长顾问</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <span style={{ fontSize: 11.5, color: "#c79bff", display: "flex", alignItems: "center", gap: 4 }}><Icon name="gem" size={12} color="#c9a6ff" />LV.3 精英会员</span>
                <button type="button" className="member-id-copy num" onClick={(event) => { event.stopPropagation(); prototypeCopy(memberId, "会员 ID"); }} aria-label="复制会员 ID" style={{ fontSize: 11.5, color: "var(--ink-300)", display: "flex", alignItems: "center", gap: 4 }}>ID: {memberId} <Icon name="copy" size={12} color="#9a8fc8" /></button>
              </div>
            </div>
            <Icon name="chev" size={16} color="#5a6486" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <span className="status-chip purple"><Icon name="gem" size={13} color="#d9b8ff" />PRO 会员</span>
            <span className="status-chip green"><Icon name="shield" size={13} color="#5fd9a8" />有效中</span>
            <span className="status-chip blue"><Icon name="calendar" size={13} color="#8aa6ff" />今日可用</span>
          </div>
        </div>

        {/* usage scenes */}
        <div className="card card-pad section-gap member-code-scenes">
          <div className="col-h" style={{ marginBottom: 12 }}>会员码使用场景</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {scenes.map((s) => (
              <div key={s.t} style={{ textAlign: "center" }}>
                <div className="scene-ico"><Icon name={s.icon} size={24} color="#b88bff" /></div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginTop: 8 }}>{s.t}</div>
                <div style={{ fontSize: 10.5, color: "var(--ink-300)", marginTop: 4, lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* action bar */}
      <div className="action-bar member-code-action" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={refreshCode}><Icon name="refresh" size={18} color="#fff" /> 刷新会员码</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("member")}><Icon name="card" size={17} color="#e0c8ff" /> 返回会员卡</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 会员码每60秒自动更新，保障身份安全</div>
    </div>
  );
}

Object.assign(window, { MemberCodeScreen });
