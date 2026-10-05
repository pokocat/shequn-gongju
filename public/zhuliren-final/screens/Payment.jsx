/* Payment.jsx — 支付确认 (10) */
function PaymentScreen({ nav }) {
  const [pay, setPay] = React.useState("wechat");
  const [auto, setAuto] = React.useState(true);
  const methods = [
    { k: "wechat", t: "微信支付", c: "#1aad19", g: "微" },
    { k: "alipay", t: "支付宝支付", c: "#1296db", g: "支" },
    { k: "unionpay", t: "银联云闪付", c: "#e84b3c", g: "银" },
  ];

  return (
    <div className="screen has-tabbar fade-in">
      <AppHeader />

      {/* hero */}
      <div className="card result-hero">
        <div className="result-hero-text">
          <div className="eyebrow-zh" style={{ marginBottom: 6 }}><Icon name="lock" size={14} color="#c79bff" />安全加密支付</div>
          <div className="title-grad" style={{ fontSize: 38, letterSpacing: 2 }}>支付确认</div>
          <div style={{ fontSize: 14, color: "#cfc3ea", marginTop: 6, letterSpacing: 1 }}>安全便捷 · 快速开通</div>
        </div>
        <div className="result-hero-art"><CrystalCheck size={132} /></div>
      </div>

      {/* selected plan */}
      <div className="card card-pad section-gap">
        <div className="col-h" style={{ marginBottom: 10 }}>已选会员方案</div>
        <div className="plan-box">
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>PRO 年度会员</span>
              <span className="tag blue">赠送 AI 诊断</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-300)", marginTop: 6 }}>享受全部 PRO 会员权益</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-300)", marginTop: 3 }}>有效期 12 个月</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="price"><b>¥</b><span className="num pv">2999</span><i>/年</i></div>
            <div className="num" style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 3 }}>原价¥3588</div>
          </div>
        </div>
      </div>

      {/* order detail */}
      <div className="card card-pad section-gap">
        <div className="col-h" style={{ marginBottom: 12 }}>订单明细</div>
        <div className="od-row"><span>商品金额</span><span className="num">¥3588</span></div>
        <div className="od-row"><span style={{ display: "flex", alignItems: "center", gap: 8 }}>优惠活动 <span className="tag purple">限时8.3折</span></span><span className="num" style={{ color: "#ff9ee0" }}>-¥589</span></div>
        <div className="od-row"><span>AI 诊断服务（赠送）</span><span className="num">¥0</span></div>
        <hr className="hr" style={{ margin: "10px 0" }} />
        <div className="od-row total"><span>应付金额</span><span className="num pv" style={{ fontSize: 24 }}>¥2999</span></div>
      </div>

      {/* payment method */}
      <div className="card card-pad section-gap">
        <div className="col-h" style={{ marginBottom: 10 }}>支付方式</div>
        {methods.map((m) => (
          <div className={"pay-row" + (pay === m.k ? " sel" : "")} key={m.k} onClick={() => setPay(m.k)}>
            <span className="pay-logo" style={{ background: m.c }}>{m.g}</span>
            <span style={{ flex: 1, fontSize: 15, color: "#fff" }}>{m.t}</span>
            <span className="radio sm">{pay === m.k && <i />}</span>
          </div>
        ))}
      </div>

      {/* auto renew */}
      <div className="card card-pad section-gap" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 700, color: "#fff" }}><Icon name="shield" size={16} color="#c79bff" />自动续费说明</div>
          <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 5, lineHeight: 1.5 }}>到期前 24 小时自动为您续费，可随时在「会员中心」关闭</div>
        </div>
        <div className={"switch" + (auto ? " on" : "")} onClick={() => setAuto(!auto)}><i /></div>
      </div>
      <div className="reg-foot" style={{ justifyContent: "flex-start", marginLeft: 2 }}><Icon name="shield" size={13} color="#6f7a98" /> 开通即表示同意《自动续费服务协议》</div>

      <button className="cta-primary" style={{ marginTop: 14 }} onClick={() => prototypeDialog({ title: "确认支付", body: `将使用${methods.find((method) => method.k === pay)?.t || "当前方式"}支付 ¥2,999${auto ? "，并开启到期自动续费" : "，不启用自动续费"}。`, confirmText: "模拟支付", onConfirm: () => { prototypeToast("支付成功"); window.setTimeout(() => nav("success"), 350); } })}>
        确认支付 ¥2999
        <span className="arrow"><Icon name="arrow" size={17} color="#fff" /></span>
      </button>
    </div>
  );
}

Object.assign(window, { PaymentScreen });
