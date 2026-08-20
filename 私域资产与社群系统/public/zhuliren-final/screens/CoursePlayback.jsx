/* CoursePlayback.jsx — 课程回放 (17) */
function CoursePlaybackScreen({ nav }) {
  const [activeChapter, setActiveChapter] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const chapters = [
    { n: "第一讲", t: "定位与资源链接", dur: "45:28", st: "已观看 32:15", icon: "play", cur: true },
    { n: "第二讲", t: "社群增长引擎", dur: "48:16", st: "未观看", icon: "chart" },
    { n: "第三讲", t: "AI 诊断实战", dur: "52:40", st: "未观看", icon: "aitext" },
    { n: "第四讲", t: "会员运营策略", dur: "47:52", st: "未观看", icon: "members" },
  ];
  return (
    <div className="screen has-tabbar fade-in course-play-screen" style={{ paddingTop: 2 }}>
      <div className="row-between" style={{ padding: "2px 2px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AppBackButton />
          <div className="app-logo" style={{ width: 30, height: 30, flex: "0 0 30px", borderRadius: 9 }}><Icon name="gemlogo" size={18} /></div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>主理人公社</span>
          <span className="badge-pro">PRO</span>
        </div>
        <WxCapsule />
      </div>
      <div className="row-between" style={{ padding: "2px 2px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="title-grad" style={{ fontSize: 26, fontWeight: 900 }}>课程回放</span>
          <span className="pill-outline"><Icon name="shield" size={13} color="#c79bff" />支持回放</span>
        </div>
        <span className="pill-outline"><Icon name="crown" size={13} color="#ff7ee0" />专属课程</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-300)", padding: "0 2px 10px" }}>专属课程 · 无限次回看 · 学习记录同步</div>

      {/* video card */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className={"video-thumb" + (playing ? " is-playing" : "")} onClick={() => { setPlaying((value) => !value); prototypeToast(playing ? "已暂停播放" : "正在播放课程"); }} role="button" tabIndex="0">
          <span className="tag purple" style={{ position: "absolute", top: 12, left: 12, borderRadius: 999, padding: "5px 12px" }}>PRO 专属回放</span>
          <div className="video-play">{playing ? <span className="pause-symbol">Ⅱ</span> : <Icon name="chev" size={22} color="#fff" />}</div>
          <div className="video-cap">
            <div style={{ fontSize: 19, fontWeight: 800, color: "#fff" }}>主理人成长营 · 商业增长方法</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--ink-200)", marginTop: 6 }}>主讲老师：王思琪 · 共 8 讲 · 326 分钟</div>
          </div>
        </div>
        <div className="vstat-3">
          <div><CircPct pct={68} /><div><div className="vs-t">已观看</div><div className="vs-d">68% 完成度</div></div></div>
          <div><Icon name="clock" size={26} color="#b88bff" /><div><div className="vs-t">最近学习</div><div className="vs-d num">今天 21:30</div></div></div>
          <div><Icon name="refresh" size={26} color="#b88bff" /><div><div className="vs-t">可反复回看</div><div className="vs-d">不限次数</div></div></div>
        </div>
      </div>

      {/* chapters */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 8 }}>
          <div className="col-h" style={{ fontSize: 16 }}>课程章节</div>
          <div className="link-trail" onClick={() => prototypeToast("已显示全部 8 讲课程")}>全部 8 讲 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {chapters.map((c, i) => (
          <div className={"chap-row" + (activeChapter === i ? " cur" : "")} key={i} onClick={() => { setActiveChapter(i); setPlaying(true); prototypeToast(`开始播放：${c.n} ${c.t}`); }} role="button" tabIndex="0">
            <div className="chap-ico">{c.icon === "aitext" ? <span style={{ fontFamily: "Geist", fontWeight: 800, fontSize: 13, color: "#b88bff" }}>AI</span> : <Icon name={c.icon} size={20} color={c.icon === "play" ? "#c79bff" : "#b88bff"} />}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, color: "#fff" }}><span style={{ fontWeight: 700 }}>{c.n}</span>　{c.t}</div>
              <div className="num" style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>{c.dur} · {c.st}</div>
            </div>
            {activeChapter === i
              ? <div style={{ fontSize: 12, color: "#ff9ee0", whiteSpace: "nowrap" }}>上次观看 | <b>继续</b></div>
              : <div style={{ fontSize: 12.5, color: "var(--ink-300)", display: "flex", alignItems: "center", gap: 8 }}>未观看 <span className="play-circle"><Icon name="chev" size={13} color="#c79bff" /></span></div>}
          </div>
        ))}
      </div>

      {/* materials */}
      <div className="card card-pad section-gap">
        <div className="col-h" style={{ marginBottom: 10 }}>学习资料</div>
        <div className="two-col" style={{ gap: 10 }}>
          {[{ ic: "doc", t: "课堂笔记", d: "思维导图 · 核心要点", m: "PDF · 2.4MB", c: "#b88bff" }, { ic: "folder", t: "课件资料", d: "完整课件 · 案例模板", m: "PPTX · 18.7MB", c: "#7ea6ff" }].map((f) => (
            <div className="mat-tile" key={f.t} onClick={() => nav("courseware")}>
              <Icon name={f.ic} size={26} color={f.c} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{f.t}</div>
                <div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 3 }}>{f.d}</div>
                <div className="num" style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 2 }}>{f.m}</div>
              </div>
              <span className="dl-circle"><Icon name="download" size={15} color="#c79bff" /></span>
            </div>
          ))}
        </div>
      </div>

      {/* next course */}
      <div className="card card-pad section-gap" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: "0 0 56px" }}><CrystalMedallion size={56} glyph="" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12.5, color: "var(--ink-300)" }}>推荐下一课</span><span className="tag purple">为您推荐</span></div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 4 }}>流量变现实战策略</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>7 大流量模型 · 3 个真实案例复盘</div>
        </div>
        <button className="btn-soft" onClick={() => { setActiveChapter(1); setPlaying(true); prototypeToast("已切换到推荐课程"); }}>去学习</button>
      </div>

      {/* CTAs */}
      <div className="two-col section-gap" style={{ alignItems: "stretch" }}>
        <button className="cta-primary" style={{ height: 54, fontSize: 16 }} onClick={() => { setPlaying(true); prototypeToast("继续上次学习进度"); }}><Icon name="chev" size={16} color="#fff" /> 继续播放</button>
        <button className="cta-ghost" style={{ height: 54, fontSize: 15 }} onClick={() => nav("courseware")}><Icon name="download" size={17} color="#e0c8ff" /> 下载课件</button>
      </div>
    </div>
  );
}

function CircPct({ pct = 68 }) {
  const r = 13, c = 2 * Math.PI * r;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="3" />
      <circle cx="16" cy="16" r={r} fill="none" stroke="#a45cff" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 16 16)" style={{ filter: "drop-shadow(0 0 3px #a45cff)" }} />
      <text x="16" y="19" textAnchor="middle" fontSize="9" fontFamily="ui-monospace" fill="#fff">{pct}%</text>
    </svg>
  );
}

Object.assign(window, { CoursePlaybackScreen });
