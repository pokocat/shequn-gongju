/* Review.jsx — 服务评价 (24) */
function ReviewScreen({ nav }) {
  const [rating, setRating] = React.useState(5);
  const [tags, setTags] = React.useState(["很专业"]);
  const [revisit, setRevisit] = React.useState("愿意");
  const [comment, setComment] = React.useState("");
  const tagList = [["响应及时", "pulse"], ["很专业", "gem"], ["资源有帮助", "folder"], ["诊断清晰", "aitext"], ["还想继续沟通", "chat"]];
  const toggleTag = (t) => setTags((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);
  return (
    <div className="screen flush fade-in" style={{ paddingBottom: 0 }}>
      <div style={{ padding: "0 16px" }}>
        <AppHeader />

        {/* hero */}
        <div className="card result-hero">
          <div className="result-hero-text">
            <div className="title-grad" style={{ fontSize: 32, letterSpacing: 1 }}>服务已完成</div>
            <div style={{ fontSize: 12.5, color: "#cfc3ea", marginTop: 8, lineHeight: 1.6 }}>为本次服务体验打个分，<br/>帮助我们持续优化陪跑与支持</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <span className="pill-outline"><Icon name="ribbon" size={12} color="#c79bff" />真实反馈</span>
              <span className="pill-outline"><Icon name="shield" size={12} color="#9af0fb" />持续优化</span>
            </div>
          </div>
          <div className="result-hero-art"><CrystalCheck size={128} /></div>
        </div>

        {/* service info */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 12 }}>服务信息</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid rgba(140,120,220,.12)" }}>
            <Avatar size={52} initial="林" ring={true} hue={40} />
            <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>林老师</span><span className="tag purple">专属服务</span></div><div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 4 }}>企业增长顾问 · 社群运营专家</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 12 }}>
            {[["calendar", "服务类型", "AI 诊断陪跑"], ["clock", "服务时间", "2025.05.21 20:00"], ["members", "班级归属", "华东增长班 A1"]].map((s) => (
              <div key={s[1]}><div style={{ fontSize: 11.5, color: "var(--ink-300)", display: "flex", alignItems: "center", gap: 5 }}><Icon name={s[0]} size={14} color="#9a8fc8" />{s[1]}</div><div className="num" style={{ fontSize: 12.5, color: "#fff", fontWeight: 600, marginTop: 5 }}>{s[2]}</div></div>
            ))}
          </div>
        </div>

        {/* rating */}
        <div className="card card-pad section-gap">
          <div className="row-between" style={{ marginBottom: 14 }}><div><span className="col-h">整体评价</span> <span style={{ fontSize: 12, color: "var(--ink-300)" }}>(点击星星打分)</span></div><span style={{ fontSize: 13, fontWeight: 700, color: "#ff9ee0" }}>非常满意</span></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} on={n <= rating} onClick={() => setRating(n)} />)}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-200)", marginTop: 12 }}><span className="num">{rating}</span> 分 · 非常满意</div>
        </div>

        {/* review text */}
        <div className="card card-pad section-gap">
          <div style={{ marginBottom: 10 }}><span className="col-h">评价内容</span> <span style={{ fontSize: 12, color: "var(--ink-300)" }}>(选填)</span></div>
          <textarea className="textarea-box interactive-textarea" value={comment} maxLength="200" onChange={(event) => setComment(event.target.value)} placeholder="请分享您的服务体验、收获与建议..." />
          <div style={{ textAlign: "right", marginTop: 8 }}><span className="num" style={{ fontSize: 12, color: "var(--ink-400)" }}>{comment.length}/200</span></div>
        </div>

        {/* tags */}
        <div className="card card-pad section-gap">
          <div style={{ marginBottom: 12 }}><span className="col-h">评价标签</span> <span style={{ fontSize: 12, color: "var(--ink-300)" }}>(可多选)</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {tagList.map(([t, ic]) => (
              <div className={"review-tag" + (tags.includes(t) ? " sel" : "")} key={t} onClick={() => toggleTag(t)}>
                {ic === "aitext" ? <span style={{ fontFamily: "Geist", fontWeight: 800, fontSize: 12 }}>AI</span> : <Icon name={ic} size={14} color={tags.includes(t) ? "#d9b8ff" : "#9a8fc8"} />}{t}
              </div>
            ))}
          </div>
          <hr className="hr" style={{ margin: "16px 0" }} />
          <div className="row-between">
            <div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>是否愿意被回访</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>我们会根据您的反馈持续改进服务质量</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className={"willing" + (revisit === "愿意" ? " sel" : "")} onClick={() => setRevisit("愿意")}>愿意 {revisit === "愿意" && <Icon name="shield" size={13} color="#d9b8ff" />}</div>
              <div className={"willing" + (revisit === "暂不愿意" ? " sel" : "")} onClick={() => setRevisit("暂不愿意")}>暂不愿意</div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => { prototypeToast("感谢您的评价"); window.setTimeout(() => nav("home"), 350); }}><Icon name="edit" size={17} color="#fff" /> 提交评价</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("home")}><Icon name="xcircle" size={17} color="#e0c8ff" /> 暂不评价</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="ribbon" size={13} color="#6f7a98" /> 优质反馈将帮助我们匹配更合适的服务资源</div>
    </div>
  );
}

function Star({ on, onClick }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" onClick={onClick} style={{ cursor: "pointer" }}>
      <defs>
        <linearGradient id={"star_g" + (on ? "1" : "0")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={on ? "#c87bff" : "#2a2c40"} /><stop offset="100%" stopColor={on ? "#6b6bff" : "#1a1c2c"} />
        </linearGradient>
      </defs>
      <path d="M24 4l6 12.5 13.5 1.5-10 9.2 2.7 13.3L24 37.5 11.8 43.8l2.7-13.3-10-9.2L18 19.5z"
        fill={`url(#star_g${on ? "1" : "0"})`} stroke={on ? "#e0b0ff" : "#3a3c52"} strokeWidth="1.6" strokeLinejoin="round"
        style={on ? { filter: "drop-shadow(0 0 8px rgba(170,90,240,.7))" } : null} />
    </svg>
  );
}

Object.assign(window, { ReviewScreen });
