/* MemberCard.jsx — 数字会员卡 (03) */
function MemberCardScreen({ nav }) {
  const profile = {
    name: "Shirley",
    role: "联合创始人",
    area: "华东大区 · 杭州",
    group: "A 班 · 128人",
    id: "HCS PRO 2024 060520",
    joined: "2024.06.05",
    level: "PRO 会员",
    expires: "2025.06.05",
    daysLeft: "剩余 365 天",
    points: "12,890",
  };

  const info = [
    { icon: "pin", label: "所在区域", value: profile.area },
    { icon: "members", label: "所属班级", value: profile.group },
    { icon: "contacts", label: "会员 ID", value: profile.id, mono: true },
    { icon: "calendar", label: "加入时间", value: profile.joined, mono: true },
    { icon: "crown", label: "会员等级", value: profile.level },
  ];

  const chain = [
    { name: "Victoria", role: "联合创始人", label: "推荐人", tone: "rose" },
    { name: "Amy", role: "区域管理员", label: "区域管理员", tone: "violet" },
    { name: "Jessica", role: "服务老师", label: "服务老师", tone: "gold" },
  ];

  const benefits = [
    { icon: "folder", color: "#759cff", title: "资源库", desc: "优质资源无限访问" },
    { icon: "cap", color: "#ff6fd8", title: "专属课程", desc: "PRO 专享课程体系" },
    { icon: "lock", color: "#8fb7ff", title: "闭门会", desc: "高质量闭门交流会" },
    { icon: "members", color: "#ff78d2", title: "会员活动", desc: "线下沙龙优先参与" },
    { icon: "aitext", color: "#8da6ff", title: "AI 诊断", desc: "AI 智能商业诊断" },
    { icon: "chart", color: "#9d8cff", title: "收益分级", desc: "收益分级与分佣" },
  ];

  return (
    <div className="screen flush fade-in member-screen">
      <div className="member-wrap">
        <AppHeader />

        <section className="member-hero-card">
          <div className="member-card-glow" />
          <div className="member-card-top">
            <div className="member-card-label"><Icon name="shield" size={15} color="#8da6ff" />数字会员卡</div>
            <div className="member-pro-badge">PRO</div>
          </div>

          <div className="member-card-body">
            <div className="member-card-left">
              <div className="member-profile">
                <div className="portrait portrait-shirley" />
                <div>
                  <div className="member-name-row">
                    <span className="member-name">{profile.name}</span>
                    <Icon name="shield" size={16} color="#8d74ff" />
                  </div>
                  <span className="member-role-pill">{profile.role}</span>
                </div>
              </div>

              <div className="member-info-list">
                {info.map((item) => (
                  <div className="member-info-row" key={item.label}>
                    <Icon name={item.icon} size={15} color="#a89bd3" />
                    <span>{item.label}</span>
                    <strong className={item.mono ? "num" : ""}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="member-card-right">
              <div className="member-h-emblem">
                <CrystalMedallion size={96} glyph="H" />
              </div>
              <div className="member-qr-box">
                <QrCode size={68} />
                <div className="member-qr-label">会员码 <Icon name="refresh" size={12} color="#cda9ff" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="card member-chain-card">
          <div className="member-section-title"><Icon name="link" size={17} color="#ea63ff" />我的关系链</div>
          <div className="member-chain-row">
            {chain.map((person, index) => (
              <React.Fragment key={person.name}>
                <div className="member-chain-person">
                  <div className="member-chain-label">{person.label}</div>
                  <div className={"portrait portrait-small portrait-" + person.tone} />
                  <div className="member-chain-name">{person.name}</div>
                  <div className="member-chain-role">{person.role}</div>
                </div>
                {index < chain.length - 1 && <div className="member-chain-arrow"><Icon name="chev" size={16} color="#6e779e" /></div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="card member-benefits-card">
          <div className="row-between member-benefit-head">
            <div className="member-section-title"><Icon name="crown" size={18} color="#a86bff" />会员权益中心</div>
            <div className="link-trail" onClick={() => nav("benefits")}>PRO 专属权益 <Icon name="chev" size={13} color="#7b83a6" /></div>
          </div>
          <div className="member-benefit-grid">
            {benefits.map((item) => (
              <button className="member-benefit-tile" key={item.title} onClick={() => nav(item.title === "AI 诊断" ? "ai" : "benefits")}>
                <div className="member-benefit-icon" style={{ color: item.color }}>
                  {item.icon === "aitext" ? <span>AI</span> : <Icon name={item.icon} size={23} color={item.color} />}
                </div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
                <Icon name="chev" size={14} color="#767f9c" />
              </button>
            ))}
          </div>
        </section>

        <section className="card member-points-card">
          <div className="member-validity">
            <div>
              <span className="member-muted">会员有效期</span>
              <div className="member-expire"><span className="num">{profile.expires}</span><em>到期</em><b>{profile.daysLeft}</b></div>
            </div>
            <div>
              <span className="member-muted">成长积分</span>
              <div className="member-points-row"><span className="num">{profile.points}</span><button onClick={() => nav("points")}>积分明细</button></div>
            </div>
          </div>
          <div className="member-progress">
            <span className="member-progress-fill" />
            <span className="member-progress-dot" />
          </div>
          <div className="member-levels"><strong>LV.3</strong><span><b>LV.4</b> 还需 1,110 升级</span></div>
        </section>
      </div>

      <div className="action-bar member-action-bar">
        <button className="cta-primary" onClick={() => nav("memberCode")}>
          <Icon name="qr" size={20} color="#fff" /> 出示会员码
        </button>
        <button className="cta-ghost" onClick={() => nav("benefits")}>
          <Icon name="gem" size={18} color="#e0c8ff" /> 查看全部权益
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MemberCardScreen });
