/* Refund.jsx — 退款申请 (18) */
function RefundScreen({ nav }) {
  const [reason, setReason] = React.useState("误购");
  const [detail, setDetail] = React.useState("");
  const reasons = [["误购", "card"], ["时间冲突", "clock"], ["服务未使用", "folder"], ["其他原因", "more"]];
  return (
    <div className="screen flush fade-in" style={{ paddingBottom: 0 }}>
      <div style={{ padding: "0 16px" }}>
        <AppHeader pro={true} gem={false} />

        {/* hero */}
        <div className="card result-hero">
          <div className="result-hero-text">
            <div className="title-grad" style={{ fontSize: 34, letterSpacing: 2 }}>退款申请</div>
            <div style={{ fontSize: 13, color: "#cfc3ea", marginTop: 8 }}>提交原因后由平台快速审核处理</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <span className="pill-outline"><Icon name="pulse" size={12} color="#c79bff" />极速审核</span>
              <span className="pill-outline"><Icon name="shield" size={12} color="#9af0fb" />保障权益</span>
            </div>
          </div>
          <div className="result-hero-art"><HeroGem w={130} h={120} icon="yrefund" /></div>
        </div>

        {/* order info */}
        <div className="card card-pad section-gap">
          <div className="row-between" style={{ marginBottom: 12 }}><div className="col-h">订单信息</div><span className="status-chip green" style={{ flex: "none", padding: "4px 10px" }}>已开通</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <CrystalMedallion size={42} glyph="" />
            <div><div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>PRO 年度会员</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>享专属课程、资源与服务</div></div>
          </div>
          <div className="info-card">
            <div className="ic-row"><div className="ic-l"><span>会员方案</span></div><div className="ic-v">PRO 年度会员</div></div>
            <div className="ic-row"><div className="ic-l"><span>支付金额</span></div><div className="ic-v num" style={{ color: "#ff9ee0" }}>¥ 2,999.00</div></div>
            <div className="ic-row"><div className="ic-l"><span>开通时间</span></div><div className="ic-v num">2025.05.16 10:23</div></div>
            <div className="ic-row"><div className="ic-l"><span>订单编号</span></div><div className="ic-v num" style={{ display: "flex", alignItems: "center", gap: 5 }}>TK2505160001 <Icon name="copy" size={12} color="#9a8fc8" /></div></div>
          </div>
        </div>

        {/* reason */}
        <div className="card card-pad section-gap">
          <div style={{ marginBottom: 12 }}><span className="col-h">退款原因</span> <span style={{ fontSize: 12, color: "#ff9ec2" }}>(必填)</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {reasons.map(([r, ic]) => (
              <div className={"dtype" + (reason === r ? " sel" : "")} key={r} onClick={() => setReason(r)} style={{ minHeight: 72 }}>
                <Icon name={ic} size={22} color={reason === r ? "#d9b8ff" : "#9a8fc8"} />
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div style={{ margin: "14px 0 8px" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>补充说明</span> <span style={{ fontSize: 12, color: "var(--ink-300)" }}>(选填)</span></div>
          <textarea className="textarea-box interactive-textarea" value={detail} maxLength="200" onChange={(event) => setDetail(event.target.value)} placeholder="请详细描述您的退款原因，我们将为您加速处理..." />
          <div style={{ textAlign: "right", marginTop: 8 }}><span className="num" style={{ fontSize: 12, color: "var(--ink-400)" }}>{detail.length}/200</span></div>
        </div>

        {/* refund flow */}
        <div className="card card-pad section-gap">
          <div className="col-h" style={{ marginBottom: 16 }}>退款流程</div>
          <div className="flow3">
            {[["提交申请", "提交退款申请", "edit"], ["平台审核", "1-2 个工作日内审核", "shield"], ["结果通知", "短信/站内信通知", "bell"]].map(([t, d, ic], i) => (
              <React.Fragment key={t}>
                <div className="flow-item">
                  <div className="flow-ico" style={{ marginBottom: 8 }}><Icon name={ic} size={22} color="#c79bff" /></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t}</div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-300)", marginTop: 4 }}>{d}</div>
                </div>
                {i < 2 && <span className="flow-line" style={{ marginTop: 22 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* warning */}
        <div className="warn-box section-gap">
          <Icon name="warn" size={20} color="#ec5b6f" />
          <div style={{ fontSize: 12, color: "#f0a9b3", lineHeight: 1.6 }}><b style={{ color: "#ff9ec2" }}>温馨提示：</b>已使用的部分权益（如课程、资料等）将可能影响退款结果，请如实填写原因以便加快审核。</div>
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => prototypeDialog({ title: "确认提交退款", body: `退款原因：${reason}${detail.trim() ? `；补充说明：${detail.trim()}` : ""}。提交后平台将在 1-2 个工作日内审核。`, confirmText: "确认提交", onConfirm: () => nav("refundResult") })}><Icon name="edit" size={17} color="#fff" /> 提交退款申请</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("addWechat")}><Icon name="headset" size={17} color="#e0c8ff" /> 联系专属服务</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="lock" size={13} color="#6f7a98" /> 您的信息将严格保密，仅用于退款审核流程</div>
    </div>
  );
}

Object.assign(window, { RefundScreen });
