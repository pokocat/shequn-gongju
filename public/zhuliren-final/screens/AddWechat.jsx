/* AddWechat.jsx — 添加服务微信 (19) */
function AddWechatScreen({ nav }) {
  const tags = [
    { icon: "members", text: "社群运营" },
    { icon: "book", text: "课程陪跑" },
    { icon: "sparkle", text: "AI诊断协同" },
  ];
  const steps = [
    { t: "添加老师微信", d: "长按识别上方二维码\n添加服务老师微信", icon: "user" },
    { t: "发送会员姓名", d: "向老师发送您的\n会员姓名与手机号", icon: "chat" },
    { t: "邀请进入班级群", d: "老师将邀请您加入\n专属班级交流群", icon: "members" },
  ];

  return (
    <div className="screen flush fade-in add-wechat-screen">
      <div className="add-wechat-wrap">
        <div className="row-between add-wechat-head">
          <div className="add-wechat-brand">
            <AppBackButton />
            <div className="app-logo"><img className="add-wechat-logo-image" src="assets/groupqr-reference-logo.png" alt="" /></div>
            <span>主理人公社</span>
          </div>
          <WxCapsule />
        </div>

        <section className="card add-wechat-hero">
          <div className="add-wechat-hero-copy">
            <div className="title-grad">专属服务已为您就位</div>
            <p>添加服务老师微信，开启入群、课程、<br/>诊断与日常陪跑</p>
            <div className="add-wechat-pills">
              <span className="pill-outline"><Icon name="crown" size={12} color="#d98cff" />专属服务</span>
              <span className="pill-outline"><Icon name="ribbon" size={12} color="#f2b6ff" />全程陪伴</span>
            </div>
          </div>
          <img className="add-wechat-hero-image" src="assets/addwechat-hero-wechat-crystal.png" alt="" />
        </section>

        <section className="card add-wechat-teacher-card">
          <div className="add-wechat-teacher-row">
            <img className="add-wechat-teacher-photo" src="assets/addwechat-teacher-portrait.png" alt="林老师" />
            <div className="add-wechat-teacher-info">
              <div className="add-wechat-teacher-title">
                <strong>林老师</strong>
                <span className="tag purple">华东增长班服务老师</span>
              </div>
              <div className="add-wechat-tags">
                {tags.map((tag) => (
                  <span className="tag purple" key={tag.text}><Icon name={tag.icon} size={11} color="#d9b8ff" />{tag.text}</span>
                ))}
              </div>
              <div className="add-wechat-meta">企业增长顾问 ｜ 社群运营专家 ｜ 5年服务经验</div>
              <div className="add-wechat-stats">服务学员 328+ ｜ 好评率 98%</div>
            </div>
          </div>

          <div className="add-wechat-qr-panel">
            <div className="add-wechat-qr-frame"><img src="assets/addwechat-reference-qr.png" alt="服务老师二维码" /></div>
            <div className="add-wechat-qr-tip"><Icon name="scan" size={14} color="#9a8fc8" />长按识别或保存二维码</div>
          </div>
        </section>

        <section className="card add-wechat-steps">
          <div className="row-between add-wechat-steps-head">
            <div><Icon name="shield" size={16} color="#d98cff" /><span>添加后如何入群</span></div>
            <em>三步即完成</em>
          </div>
          <div className="add-wechat-flow">
            {steps.map((step, index) => (
              <React.Fragment key={step.t}>
                <div className="add-wechat-flow-item">
                  <span className="add-wechat-flow-n">{index + 1}</span>
                  <div className="add-wechat-flow-ico"><Icon name={step.icon} size={23} color="#d98cff" /></div>
                  <strong>{step.t}</strong>
                  <small>{step.d}</small>
                </div>
                {index < 2 && <span className="add-wechat-flow-line" />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

      <div className="add-wechat-action">
        <button className="cta-primary" onClick={() => prototypeToast("二维码已保存到相册")}><Icon name="download" size={16} color="#fff" /> 保存二维码</button>
        <button className="cta-ghost" onClick={() => { navigator.clipboard?.writeText?.("LIN_GROWTH_PRO"); prototypeToast("老师微信号已复制"); }}><Icon name="copy" size={16} color="#f0d6ff" /> 复制老师微信号</button>
      </div>

      <div className="card add-wechat-response">
        <Icon name="shield" size={19} color="#d98cff" />
        <div><strong>已开通会员将优先获得服务响应</strong><span>专属老师 · 快速响应 · 全程陪伴 · 助力成长</span></div>
        <img src="assets/addwechat-footer-crystal.png" alt="" />
      </div>
    </div>
  );
}

Object.assign(window, { AddWechatScreen });
