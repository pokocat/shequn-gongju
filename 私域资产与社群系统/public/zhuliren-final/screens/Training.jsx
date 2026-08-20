/* Training.jsx — 培训服务 (08) */
function TrainingScreen({ nav }) {
  const [tab, setTab] = React.useState("course");
  const courses = [
    { thumb: "增长方法论\n实战训练营", tg: [["训练营", "purple"], ["进阶", "blue"]], title: "增长方法论实战训练营",
      meta: ["6节课程 · 3周训练 · 社群陪跑", "开课时间：05.28 - 06.17"], action: "去学习", status: "已报名", hue: 20 },
    { thumb: "AI赋能商业\n实战课", tg: [["直播课", "pink"], ["实战", "cyan"]], title: "AI 赋能商业实战课",
      meta: ["2小时直播 · 案例拆解 · 实操演练", "上课时间：05.30（周五）20:00"], action: "去学习", status: "已预约", hue: 120, ai: true },
    { thumb: "品牌定位与\n价值突围", tg: [["录播课", "amber"], ["基础", "blue"]], title: "品牌定位与价值突围课",
      meta: ["5节录播 · 反复观看 · 附赠资料"], progress: 60, action: "继续学习", status: "学习中", hue: 220 },
  ];
  const camps = [
    { title: "增长方法论实战训练营", period: "05.28 - 06.17", progress: "已报名", count: "126 人同行", color: "purple" },
    { title: "AI 商业落地 21 天营", period: "06.08 - 06.28", progress: "可报名", count: "限额 80 人", color: "blue" },
    { title: "主理人品牌定位营", period: "06.20 - 07.10", progress: "即将开放", count: "预约提醒", color: "amber" },
  ];

  return (
    <div className="screen has-tabbar fade-in training-screen">
      <AppHeader />
      <div className="topseg">
        <button type="button" className={"seg" + (tab === "course" ? " active" : "")} aria-pressed={tab === "course"} onClick={() => setTab("course")}>课程服务</button>
        <button type="button" className={"seg" + (tab === "camp" ? " active" : "")} aria-pressed={tab === "camp"} onClick={() => setTab("camp")}>训练营</button>
      </div>

      {tab === "course" ? <>

      {/* hero */}
      <div className="card" style={{ padding: "16px 16px 14px" }}>
        <div className="eyebrow-zh"><Icon name="sparkle" size={14} color="#c79bff" />系统学习 · 实战落地</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="title-grad" style={{ fontSize: 20, margin: "7px 0 7px", whiteSpace: "nowrap" }}>升级认知 · 突破增长</div>
            <p style={{ fontSize: 12, color: "var(--ink-200)", lineHeight: 1.55 }}>精选课程与训练营，助力主理人系统成长与商业突破</p>
          </div>
          <div style={{ flex: "0 0 112px", marginTop: -6 }}><GradStack w={120} h={112} /></div>
        </div>
        <button className="ghost-pill" style={{ marginTop: 12 }} onClick={() => prototypeDialog({ title: "PRO 学习路径", body: "建议顺序：品牌定位 → 社群增长 → AI 赋能 → 流量变现。每阶段均包含课程、实操任务与服务老师复盘。", confirmText: "开始学习", onConfirm: () => nav("coursePlay") })}>查看学习路径 <Icon name="arrow" size={15} color="#dcd2ff" /></button>
      </div>

      {/* featured live */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <div className="col-h" style={{ fontSize: 16 }}>精选直播课</div>
          <div className="link-trail" onClick={() => prototypeToast("已展示全部直播课程")}>查看更多 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="live-thumb">
            <span className="tag pink live-badge"><i className="live-dot" />直播中</span>
            <div className="lt-title">高阶增长策略<br/>私享课</div>
            <div className="lt-play"><Icon name="chev" size={12} color="#fff" /> 直播中</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>高阶增长策略私享课</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-300)", marginTop: 6 }}>林老师 · 增长专家</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--ink-300)", marginTop: 3 }}>05.22（周四）20:00 - 21:30</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <div className="ava-stack">{[0, 50, 100, 150].map((h, i) => <Avatar key={i} size={22} hue={h} />)}</div>
              <span style={{ fontSize: 12, color: "var(--ink-300)" }}><span className="num">128</span> 人已预约</span>
              <button className="btn-grad-pill" style={{ marginLeft: "auto" }} onClick={() => nav("coursePlay")}>进入直播</button>
            </div>
          </div>
        </div>
      </div>

      {/* recommended */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 4 }}>
          <div className="col-h" style={{ fontSize: 16 }}>课程推荐</div>
          <div className="link-trail" onClick={() => prototypeToast("已展示全部课程")}>全部课程 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {courses.map((c, i) => (
          <div className="course-row" key={i} onClick={() => nav("coursePlay")} style={{ cursor: "pointer" }}>
            <div className="course-thumb" style={{ background: `linear-gradient(150deg, hsl(${260 + c.hue % 60} 50% 28%), hsl(${230} 60% 16%))` }}>
              {c.ai ? <span style={{ fontFamily: "Geist", fontWeight: 800, fontSize: 22, color: "#9fd0ff" }}>AI</span> : <span className="ct-text">{c.thumb}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{c.title}</span>
                {c.tg.map(([t, cl]) => <span key={t} className={"tag " + cl}>{t}</span>)}
              </div>
              {c.meta.map((m, j) => <div key={j} className="num" style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>{m}</div>)}
              {c.progress && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-300)" }}>学习进度：</span>
                  <div className="prog-track" style={{ flex: 1, height: 5 }}><div className="prog-fill" style={{ width: c.progress + "%" }} /></div>
                  <span className="num" style={{ fontSize: 11.5, color: "#c9a6ff" }}>{c.progress}%</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, alignSelf: "flex-start" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c89bff" }}>{c.action}</div>
              <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 8 }}>{c.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* service reminder */}
      <div className="card card-pad section-gap" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="svc-ico"><Icon name="chat" size={22} color="#c79bff" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>服务提醒</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4, lineHeight: 1.5 }}>专属服务老师林老师已为您准备学习规划方案<br/>建议 24 小时内预约沟通</div>
        </div>
        <button className="btn-soft" onClick={() => nav("addWechat")}>立即预约</button>
      </div>

      {/* exclusive service banner */}
      <div className="card section-gap" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "linear-gradient(110deg, rgba(60,40,140,.4), rgba(30,40,120,.3))", borderColor: "rgba(150,110,255,.3)" }}>
        <Icon name="crown" size={26} color="#ff7ee0" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>专属服务 · 助力成长</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-200)", marginTop: 4 }}>一对一咨询 · 企业诊断 · 定制化方案</div>
        </div>
        <button className="invite-btn" onClick={() => nav("addWechat")}>预约服务 <Icon name="arrow" size={14} color="#fff" /></button>
      </div>
      </> : (
        <div className="training-camp-view">
          <section className="card training-camp-hero">
            <div><span className="tag purple">PRO 陪跑</span><h1 className="title-grad">训练营计划</h1><p>用明确任务、同伴共学和老师复盘，把知识变成可执行的增长动作。</p></div>
            <GradStack w={116} h={108} />
          </section>
          <section className="card training-camp-list">
            <div className="row-between"><div className="col-h">可参与训练营</div><span className="tag green">3 个计划</span></div>
            {camps.map((camp, index) => (
              <button type="button" className="training-camp-row" key={camp.title} onClick={() => index === 0 ? nav("coursePlay") : prototypeDialog({ title: camp.title, body: `${camp.period} 开营，包含每日任务、直播答疑、同伴共学和阶段复盘。`, confirmText: index === 1 ? "模拟报名" : "预约提醒", onConfirm: () => prototypeToast(index === 1 ? "报名席位已锁定" : "开营提醒已开启") })}>
                <span className="training-camp-index">0{index + 1}</span><span><strong>{camp.title}</strong><small>{camp.period} · {camp.count}</small></span><em className={"tag " + camp.color}>{camp.progress}</em><Icon name="chev" size={16} color="#66708b" />
              </button>
            ))}
          </section>
          <section className="card training-camp-plan">
            <div className="col-h">本周训练进度</div><div><span>课程学习</span><b><i style={{ width: "75%" }} /></b><em>3 / 4</em></div><div><span>实操作业</span><b><i style={{ width: "50%" }} /></b><em>2 / 4</em></div><div><span>班群互动</span><b><i style={{ width: "90%" }} /></b><em>9 / 10</em></div>
          </section>
          <button type="button" className="cta-primary" onClick={() => nav("coursePlay")}>继续本周训练 <Icon name="arrow" size={17} color="#fff" /></button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TrainingScreen });
