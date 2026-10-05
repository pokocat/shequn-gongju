/* Benefits.jsx — 全部权益 (22) */
function BenefitsScreen({ nav }) {
  const allBenefits = [
    { icon: "folder", title: "资源库", desc: "优质资源无限访问", status: "可立即使用", tone: "green", accent: "#8b7cff", to: "courseware" },
    { icon: "cap", title: "专属课程", desc: "PRO 专享课程体系", status: "可立即使用", tone: "green", accent: "#ff73e2", to: "training" },
    { icon: "lock", title: "闭门会", desc: "高质量闭门交流会", status: "本月可预约", tone: "blue", accent: "#c79bff", to: "community" },
    { icon: "ai", title: "AI 诊断", desc: "AI 智能商业诊断", status: "可立即使用", tone: "green", accent: "#ff7ee0", to: "benefitDetail" },
    { icon: "members", title: "城市活动", desc: "线下沙龙优先参与", status: "优先预约", tone: "blue", accent: "#ff7ec2", to: "community" },
    { icon: "wechat", title: "服务老师微信", desc: "专属服务老师陪跑", status: "可立即使用", tone: "green", accent: "#b88bff", to: "addWechat" },
    { icon: "chart", title: "收益分级", desc: "收益分级与分佣", status: "可立即使用", tone: "green", accent: "#a992ff", to: "invite" },
    { icon: "contacts", title: "永久会员档案", desc: "专属成长档案记录", status: "可长期保留", tone: "blue", accent: "#8aa6ff", to: "member" },
  ];

  const steps = [
    { title: "选择权益", desc: "浏览并选择您需要的权益", icon: "doc" },
    { title: "预约或使用", desc: "根据提示完成预约或直接使用", icon: "calendar" },
    { title: "享受专属服务", desc: "获取资源、课程与陪跑支持", icon: "award" },
  ];

  return (
    <div className="screen flush fade-in benefits-screen benefits-reference-screen">
      <div className="benefits-wrap">
        <AppHeader />

        <section className="card benefits-hero">
          <div className="benefits-hero-main">
            <div className="benefits-hero-copy">
              <span className="tag purple benefits-pro-tag">PRO 专享</span>
              <div className="title-grad benefits-title">PRO 专属权益</div>
              <div className="benefits-sub">连接资源、提升能力、获得陪跑与增长支持</div>
            </div>
            <div className="benefits-hero-art" aria-hidden="true">
              <HeroGem w={172} h={154} icon="crown" />
            </div>
          </div>

          <div className="benefits-stat-panel">
            <div className="benefits-stat-cell">
              <span className="benefits-stat-icon"><Icon name="gem" size={24} color="#d9b8ff" /></span>
              <div>
                <div className="benefits-stat-label">可用权益数</div>
                <div className="benefits-stat-value">18 <span>项</span></div>
                <div className="benefits-stat-note">全部可用</div>
              </div>
            </div>
            <div className="benefits-stat-cell">
              <span className="benefits-stat-icon"><Icon name="calendar" size={23} color="#d9b8ff" /></span>
              <div>
                <div className="benefits-stat-label">本月已使用</div>
                <div className="benefits-stat-value">6 <span>项</span></div>
                <div className="benefits-stat-note">累计已省 ¥3,560</div>
              </div>
            </div>
            <div className="benefits-stat-cell">
              <span className="benefits-stat-icon"><Icon name="shield" size={24} color="#e5ccff" /></span>
              <div>
                <div className="benefits-stat-label">会员等级</div>
                <div className="benefits-stat-value title-grad">LV.3</div>
                <div className="benefits-stat-note">精英会员</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card benefits-all-card">
          <div className="row-between benefits-all-head">
            <div className="benefits-head-title">
              <span className="col-h">全部权益</span>
              <span className="tag purple">持续更新</span>
            </div>
            <button className="benefits-text-link" type="button" onClick={() => prototypeDialog({ title: "权益对比", body: "当前为 PRO 会员：已解锁 18 项权益，相比基础会员新增 AI 诊断、闭门会、专属课程、服务陪跑与收益分级。" })}>对比权益 <Icon name="chev" size={15} color="#aeb6cb" /></button>
          </div>

          <div className="ben-grid">
            {allBenefits.map((item) => (
              <button
                className="ben-tile"
                key={item.title}
                type="button"
                onClick={() => item.to ? nav(item.to) : prototypeToast(`${item.title}即将开放`)}
                style={{ "--benefit-accent": item.accent }}
              >
                <span className="ben-ico">
                  {item.icon === "ai"
                    ? <span className="ben-ai">AI</span>
                    : <Icon name={item.icon} size={30} color="var(--benefit-accent)" />}
                </span>
                <span className="ben-title">{item.title}</span>
                <span className="ben-desc">{item.desc}</span>
                <span className={"ben-st " + item.tone}><Icon name="shield" size={13} />{item.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card benefits-rec-card">
          <div className="row-between benefits-compact-head">
            <div className="benefits-head-title">
              <span className="col-h">本周推荐权益</span>
              <span className="tag amber">优先体验</span>
            </div>
            <button className="benefits-text-link" type="button" onClick={() => nav("training")}>更多推荐 <Icon name="chev" size={15} color="#aeb6cb" /></button>
          </div>

          <div className="two-col benefits-rec-grid">
            <button className="rec-card" type="button" onClick={() => nav("benefitDetail")}>
              <CrystalMedallion size={66} glyph="" />
              <div className="benefits-rec-copy">
                <div className="benefits-rec-title">流量变现实战策略</div>
                <div className="benefits-rec-desc">7 大流量模型 · 3 个真实案例</div>
                <div className="benefits-rec-tags">
                  <span className="tag purple">本周上新</span>
                  <span className="tag pink">限时优先体验</span>
                </div>
              </div>
            </button>
            <button className="rec-card" type="button" onClick={() => prototypeDialog({ title: "私享圆桌会", body: "本周六 20:00 线上举行，面向 PRO 会员开放 30 个席位。确认后将进入班群预约。", confirmText: "去预约", onConfirm: () => nav("community") })}>
              <CrystalMedallion size={66} glyph="" hue="blue" />
              <div className="benefits-rec-copy">
                <div className="benefits-rec-title">私享圆桌会</div>
                <div className="benefits-rec-desc">与优秀主理人深度链接</div>
                <div className="benefits-rec-tags">
                  <span className="tag blue">本周六 20:00</span>
                  <span className="tag purple">优先预约</span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="card benefits-use-card">
          <div className="col-h benefits-use-title">如何使用权益</div>
          <div className="step3 benefits-step3">
            {steps.map((step, i) => (
              <React.Fragment key={step.title}>
                <div className="step-item">
                  <div className="benefits-step-top">
                    <span className="step-n">{i + 1}</span>
                    <div className="benefits-step-title">{step.title}</div>
                  </div>
                  <div className="benefits-step-body">
                    <span className="benefits-step-icon"><Icon name={step.icon} size={22} color="#d77cff" /></span>
                    <div className="benefits-step-desc">{step.desc}</div>
                  </div>
                </div>
                {i < steps.length - 1 && <span className="step-dash" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        <div className="benefits-action-bar">
          <button className="cta-primary" type="button" onClick={() => nav("benefitDetail")}><Icon name="gem" size={24} color="#fff" />立即使用权益</button>
          <button className="cta-ghost" type="button" onClick={() => nav("member")}><Icon name="card" size={22} color="#f29bff" />返回会员卡</button>
        </div>

        <div className="reg-foot benefits-foot"><Icon name="shield" size={15} color="#6f7a98" />权益仅限 PRO 会员使用，部分权益需预约后使用</div>
      </div>
    </div>
  );
}

Object.assign(window, { BenefitsScreen });
