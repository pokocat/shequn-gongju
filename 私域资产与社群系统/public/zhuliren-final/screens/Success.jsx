/* Success.jsx — 开通成功 (04) */
function SuccessScreen({ nav }) {
  const steps = [
    { icon: "user", t: "已入会", d: "恭喜您成为主理人公社 PRO 会员" },
    { icon: "card", t: "已完成缴费", d: "支付成功，订单已确认" },
    { icon: "link", t: "已绑定关系链", d: "感谢您的信任，关系链绑定成功" },
    { icon: "aitext", t: "已自动分班", d: "AI 智能匹配完成，已为您分配班级" },
    { icon: "wechat", t: "已匹配服务微信", d: "专属服务老师已为您服务" },
  ];
  return (
    <div className="screen flush fade-in success-screen">
      <div className="success-wrap">
        <AppHeader pro={false} gem={false} />

        {/* hero */}
        <div className="card success-hero">
          <div className="success-hero-copy">
            <span className="tag purple success-pro">PRO 会员</span>
            <div className="title-grad success-title">开通成功</div>
            <div className="success-sub">欢迎加入主理人公社</div>
            <div className="success-note">您的主理人之旅已正式启航</div>
          </div>
          <div className="success-art"><CrystalCheck size={104} /></div>
        </div>

        <div className="card success-class">
          <div>
            <div className="success-class-label">班级已分配</div>
            <div className="success-class-name">华东增长班 A1</div>
          </div>
          <div className="success-teacher">
            <Avatar size={30} initial="林" hue={40} />
            <div>
              <div className="success-teacher-name">林老师</div>
              <div className="success-teacher-role">专属服务</div>
            </div>
          </div>
        </div>

        {/* timeline */}
        <div className="card success-timeline-card">
          <div className="timeline">
            {steps.map((s, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-rail">
                  <span className="tl-node" />
                  {i < steps.length - 1 && <span className="tl-line" />}
                </div>
                <div className="tl-icon">
                  {s.icon === "aitext"
                    ? <span className="tl-ai">AI</span>
                    : <Icon name={s.icon} size={22} color="#b88bff" />}
                </div>
                <div className="tl-copy">
                  <div className="tl-title">{s.t}</div>
                  <div className="tl-desc">{s.d}</div>
                </div>
                <div className="tl-done">已完成 <Icon name="shield" size={16} color="#5fd0e8" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* two ghost buttons */}
        <div className="two-col success-actions">
          <div className="card ghost-action" onClick={() => nav("member")}>
            <Icon name="card" size={24} color="#c9a6ff" />
            <div>
              <div className="ga-t">查看会员卡</div>
              <div className="ga-d">查看 PRO 会员权益</div>
            </div>
            <Icon name="chev" size={16} color="#5a6486" />
          </div>
          <div className="card ghost-action" onClick={() => nav("addWechat")}>
            <Icon name="wechat" size={24} color="#5fd9a8" />
            <div>
              <div className="ga-t">添加服务微信</div>
              <div className="ga-d">与专属老师建立联系</div>
            </div>
            <Icon name="chev" size={16} color="#5a6486" />
          </div>
        </div>

        {/* CTA */}
        <button className="cta-primary success-cta" onClick={() => nav("home")}>
          进入主理人公社
          <span className="arrow"><Icon name="arrow" size={17} color="#fff" /></span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { SuccessScreen });
