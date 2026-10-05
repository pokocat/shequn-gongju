/* Register.jsx — 登录注册入口 (01) */
function RegisterScreen({ nav }) {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [agreed, setAgreed] = React.useState(true);
  const [sent, setSent] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const canStart = phone.length >= 6 && agreed;
  const sendCode = () => {
    if (!phone) {
      setNotice("请先输入手机号");
      return;
    }
    setSent(true);
    setNotice("验证码已发送");
  };
  const startLogin = () => {
    if (phone.length < 6) {
      setNotice("请输入手机号后继续");
      return;
    }
    if (!agreed) {
      setNotice("请先阅读并同意用户协议");
      return;
    }
    setNotice("");
    nav("success");
  };

  return (
    <div className="screen flush fade-in login-screen">
      <div className="login-bg" />

      <div className="login-top">
        <AppBackButton />
        <div className="login-nav-title">登录</div>
        <WxCapsule />
      </div>

      <div className="login-main">
        <div className="login-title-block">
          <div className="login-kicker">主理人公社 · OWNER PLAN</div>
          <h1>主理人计划启动</h1>
          <p>深知创业不易，愿把资源、能力与技术沉淀成支持，陪更多优质主理人成长起来</p>
        </div>

        <div className="login-form">
          <label className="login-input">
            <Icon name="phone" size={19} color="#8d96b7" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="手机号"
              inputMode="numeric"
            />
          </label>

          <label className="login-input has-action">
            <Icon name="chat" size={19} color="#8d96b7" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="验证码"
              inputMode="numeric"
            />
            <button type="button" className="login-code-btn" onClick={sendCode}>
              {sent ? "已发送" : "发送验证码"}
            </button>
          </label>

          <label className="login-agree">
            <span className={"login-check" + (agreed ? " on" : "")} onClick={() => setAgreed(!agreed)}>
              {agreed && <Icon name="shield" size={12} color="#0a0d12" />}
            </span>
            <span>我已阅读并同意主理人公社《用户协议》和《隐私政策》</span>
          </label>

          <button
            className={"login-start" + (!canStart ? " disabled" : "")}
            onClick={startLogin}
          >
            立即启动
          </button>
          {notice && <div className="login-notice">{notice}</div>}
        </div>

        <div className="login-alt-row">
          <span>其他方式</span>
          <button className="login-mini-social" aria-label="微信登录" onClick={() => { prototypeToast("微信授权成功"); window.setTimeout(() => nav("success"), 350); }}>
            <Icon name="wechat" size={16} color="#fff" />
            微信登录
          </button>
        </div>

        <div className="login-ref-card">
          <Avatar size={40} initial="张" hue={36} ring />
          <div className="login-ref-info">
            <div className="login-ref-name">
              <span className="login-ref-tag">推荐人</span>
              <strong>Sarah（张经理）</strong>
              <button className="icon-plain-button" type="button" aria-label="复制推荐人姓名" onClick={() => prototypeCopy("Sarah（张经理）", "推荐人姓名")}><Icon name="copy" size={14} color="#76819f" /></button>
            </div>
            <div className="login-ref-line">
              微信号：BOSS_SARAH
              <button className="icon-plain-button" type="button" aria-label="复制推荐人微信号" onClick={() => prototypeCopy("BOSS_SARAH", "推荐人微信号")}><Icon name="copy" size={13} color="#66708b" /></button>
            </div>
            <div className="login-ref-line">
              手机号：138 8888 8888
              <button className="login-call" type="button" onClick={() => prototypeToast("正在呼叫 138 8888 8888")}><Icon name="phone" size={12} color="#0a0d12" />拨打</button>
            </div>
          </div>
        </div>

        <div className="login-flow-note">
          <div className="tile-ico"><Icon name="sparkle" size={17} color="#c9a6ff" /></div>
          <div>
            <strong>先登录，后完善资料</strong>
            <span>进入后引导完成注册、关系链确认与智能分配</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegRow({ icon, title, desc, trail, chev }) {
  return (
    <div className="card field-row section-gap">
      <div className="field-ico"><Icon name={icon} size={26} /></div>
      <div className="field-main">
        <div className="ttl">{title}</div>
        <div className="desc">{desc}</div>
      </div>
      <div className="field-trail">{trail} {chev && <Icon name="chev" size={16} color="#5a6486" />}</div>
    </div>
  );
}

Object.assign(window, { RegisterScreen });
