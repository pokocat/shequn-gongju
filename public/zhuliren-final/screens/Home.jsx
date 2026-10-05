/* Home.jsx — 首页 (02/05) */
function HomeScreen({ nav }) {
  return (
    <div className="screen has-tabbar fade-in home-screen">
      <AppHeader sub={false} />

      {/* ---- hero insight banner ---- */}
      <div className="card home-hero-card home-reference-hero">
        <div className="eyebrow-zh"><Icon name="sparkle" size={15} color="#709a12" />今日 AI 增长洞察</div>
        <div className="home-hero-main">
          <div className="home-hero-copy">
            <div className="title-grad home-hero-title">内容驱动增长</div>
            <p>
              高质量内容能带来 <span className="num" style={{ color: "#6b9800" }}>3.2</span> 倍的转化提升，优先输出解决方案型内容，建立信任护城河。
            </p>
          </div>
          <div className="home-hero-art home-reference-hero-art"><AiCubeChart w={164} h={142} /></div>
        </div>
        <button className="ghost-pill home-hero-btn" onClick={() => nav("ai")}>
          查看完整分析 <Icon name="arrow" size={15} color="#628a10" />
        </button>
        <div className="home-hero-dots"><Dots n={3} on={0} /></div>
      </div>

      {/* ---- growth progress ---- */}
      <div className="card card-pad section-gap home-growth-card">
        <div className="row-between">
          <div className="home-section-title">会员成长进度</div>
          <div className="link-trail" onClick={() => nav("points")}>成长值明细 <Icon name="chev" size={14} color="#6f7a98" /></div>
        </div>
        <div className="home-growth-main">
          <div className="home-growth-medallion"><CrystalMedallion size={86} glyph="H" /></div>
          <div className="home-growth-info">
            <div className="home-level-row">
              <span className="num title-grad">LV.3</span>
              <span>区域管理员</span>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width: "64%" }} /></div>
            <div className="row-between home-growth-meta">
              <div>成长值 <span className="num">12,890</span> / 20,000</div>
              <div>距升级还差<br/><span className="num">7,110</span> 成长值</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- quick grid 2x2 ---- */}
      <div className="quick-grid section-gap">
        <QuickCard kind="community" title="班级社群" desc="进入我的班级" icon={<Icon name="members" size={30} color="#749c17" strokeWidth={1.35} />} onClick={() => nav("community")} />
        <QuickCard kind="training" title="培训服务" desc="专属课程与服务" icon={<Icon name="cap" size={31} color="#749c17" strokeWidth={1.35} />} onClick={() => nav("training")} />
        <QuickCard kind="diagnosis" title="AI 诊断" desc="智能商业诊断" icon={<AiChip />} onClick={() => nav("ai")} />
        <QuickCard kind="announcement" title="公告中心" desc="最新通知与公告" icon={<Icon name="megaphone" size={31} color="#749c17" strokeWidth={1.35} />} onClick={() => nav("announce")} />
      </div>

      {/* ---- two columns: course / reminder ---- */}
      <div className="two-col section-gap home-service-grid">
        <div className="card card-pad home-course-card">
          <div className="row-between"><div className="col-h">近期课程</div><div className="link-trail" onClick={() => nav("training")}>查看全部 <Icon name="chev" size={13} color="#6f7a98" /></div></div>
          <div className="mini-course home-course-main">
            <div className="home-course-thumb">
              <img src="assets/addwechat-teacher-portrait.png" alt="林老师" />
            </div>
            <div className="home-course-copy">
              <div className="home-course-title">
                <span className="tag pink" style={{ verticalAlign: "middle", marginRight: 4 }}><i className="live-dot" />直播中</span>
                高阶增长策略私享课
              </div>
              <div className="home-course-meta">林老师 · 增长专家</div>
              <div className="num home-course-time">05.22（周四）20:00</div>
            </div>
          </div>
          <hr className="hr home-card-hr" />
          <div className="row-between home-card-action">
            <div>距离开始 <span className="num">06:18:30</span></div>
            <button className="btn-sm" onClick={() => nav("coursePlay")}>去学习</button>
          </div>
        </div>

        <div className="card card-pad home-reminder-card">
          <div className="row-between"><div className="col-h">服务提醒</div><div className="link-trail" onClick={() => nav("announce")}>全部提醒 <Icon name="chev" size={13} color="#6f7a98" /></div></div>
          <div className="home-reminder-main">
            <div className="home-reminder-copy">
              <div className="home-reminder-title">专属服务顾问待跟进</div>
              <div className="home-reminder-desc">林老师已为您准备定制化方案，建议 24 小时内预约沟通</div>
            </div>
            <div className="home-reminder-art">
              <Icon name="alarm" size={26} color="#749c17" />
              <span />
            </div>
          </div>
          <button className="btn-grad-full home-reminder-btn" onClick={() => nav("aiBooking")}>立即预约</button>
        </div>
      </div>

      {/* ---- invite banner ---- */}
      <div className="card section-gap home-invite-card">
        <Trophy size={44} />
        <div className="home-invite-copy">
          <div>邀请好友 · 共创价值</div>
          <span>邀请 1 位好友可得 <b className="num">288</b> 成长值</span>
        </div>
        <button className="invite-btn" onClick={() => nav("invite")}>立即邀请 <Icon name="arrow" size={14} color="#fff" /></button>
      </div>
    </div>
  );
}

function QuickCard({ title, desc, icon, onClick, kind = "" }) {
  return (
    <div className={"card quick-card quick-card-" + kind} onClick={onClick}>
      <div>
        <div className="quick-title">{title}</div>
        <div className="quick-desc">{desc}</div>
      </div>
      <div className="qc-right">{icon}<Icon name="chev" size={15} color="#5a6486" /></div>
    </div>
  );
}

function AiChip() {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
      background: "#efffd1", border: "1px solid #cce990", color: "#5f8b08",
      fontFamily: "Geist", fontWeight: 800, fontSize: 13 }}>AI</div>
  );
}

Object.assign(window, { HomeScreen });
