/* Ticket.jsx — 服务工单 (15) */
function TicketScreen({ nav }) {
  const [type, setType] = React.useState("账号问题");
  const [description, setDescription] = React.useState("");
  const [uploads, setUploads] = React.useState(0);
  const types = [
    ["账号问题", "contacts"], ["会员权益", "crown"], ["课程培训", "cap"], ["社群相关", "members"], ["技术故障", "phone"],
    ["支付问题", "card"], ["活动相关", "calendar"], ["资源申请", "folder"], ["合作咨询", "handshake"], ["其他问题", "more"],
  ];
  return (
    <div className="screen has-tabbar fade-in" style={{ paddingTop: 2 }}>
      <AppHeader />
      <div className="subbar">
        <button className="icon-plain-button" type="button" aria-label="返回设置中心" onClick={() => window.__MRC_NAV__?.back()}><Icon name="chev" size={20} color="#cfd6ea" style={{ transform: "rotate(180deg)" }} /></button>
        <span className="subbar-title">服务工单</span>
        <button className="pill-outline" type="button" onClick={() => nav("ticketResult")}><Icon name="doc" size={13} color="#c79bff" />工单记录</button>
      </div>

      {/* hero */}
      <div className="card" style={{ padding: "16px 16px 14px", overflow: "hidden", border: "1px solid rgba(120,90,220,.4)", background: "radial-gradient(120% 130% at 85% 0%, rgba(70,45,150,.4), rgba(12,14,28,.55) 60%)" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow-zh"><Icon name="shield" size={14} color="#c79bff" />专属服务支持</div>
            <div className="title-grad" style={{ fontSize: 25, margin: "7px 0", whiteSpace: "nowrap" }}>快速响应 · 专业服务</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-200)", lineHeight: 1.6 }}>我们随时为您提供帮助<br/>确保您的体验顺畅无忧</div>
          </div>
          <div style={{ flex: "0 0 124px", marginTop: -2 }}><HeroGem w={130} h={118} icon="headset" /></div>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
          {[["members", "专属服务团队"], ["download", "高效响应跟进"], ["shield", "隐私安全保障"]].map(([ic, t]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name={ic} size={15} color="#b88bff" /><span style={{ fontSize: 11.5, color: "var(--ink-200)" }}>{t}</span></div>
          ))}
        </div>
      </div>

      {/* problem type */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 12 }}><div className="col-h" style={{ fontSize: 15 }}>问题类型</div><span className="req">必填</span></div>
        <div className="type-grid">
          {types.map(([t, ic]) => (
            <div className={"type-chip" + (type === t ? " sel" : "")} key={t} onClick={() => setType(t)}>
              {type === t && <span className="chip-check"><Icon name="shield" size={11} color="#fff" /></span>}
              <Icon name={ic} size={22} color={type === t ? "#d9b8ff" : "#9a8fc8"} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* describe */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 10 }}><div className="col-h" style={{ fontSize: 15 }}>描述问题</div><span className="req">必填</span></div>
        <textarea className="textarea-box interactive-textarea" value={description} maxLength="500" onChange={(event) => setDescription(event.target.value)} placeholder="请详细描述您遇到的问题，提供相关截图或说明（可上传图片）" />
        <div className="row-between" style={{ marginTop: 10 }}>
          <button className="btn-outline-sm" style={{ height: 32 }} onClick={() => { setUploads((count) => Math.min(5, count + 1)); prototypeToast(uploads >= 4 ? "已达到 5 张上限" : "已添加一张模拟截图"); }}><Icon name="grid" size={14} color="#c79bff" /> 上传图片（{uploads}/5）</button>
          <span className="num" style={{ fontSize: 12, color: "var(--ink-400)" }}>{description.length}/500</span>
        </div>
        {uploads > 0 && <div className="mock-upload-list">{Array.from({ length: uploads }).map((_, index) => <span key={index}>截图 {index + 1}<button type="button" aria-label={`删除截图 ${index + 1}`} onClick={() => setUploads((count) => Math.max(0, count - 1))}>×</button></span>)}</div>}
      </div>

      {/* matched teacher */}
      <div className="card card-pad section-gap">
        <div style={{ fontSize: 13.5, color: "var(--ink-200)", marginBottom: 10 }}>已匹配服务老师</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={44} initial="林" hue={40} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>林老师</span><span className="tag purple">专属服务</span></div>
            <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>社群运营专家 ｜ 企业增长顾问</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--ink-300)" }}>预计响应时间</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginTop: 2 }}><span className="num" style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>2</span><span style={{ fontSize: 12, color: "var(--ink-200)" }}>小时内</span></div>
          </div>
          <Icon name="clock" size={34} color="#7ea6ff" />
        </div>
      </div>

      {/* AI recognise */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#fff" }}><Icon name="sparkle" size={14} color="#c79bff" />AI 智能识别</div>
          <button className="pill-outline" style={{ fontSize: 11 }} onClick={() => prototypeDialog({ title: "AI 识别结果", body: `根据当前问题类型与描述，系统识别为：${type}。补充截图与复现步骤可提高匹配准确率。` })}><Icon name="shield" size={12} color="#9af0fb" />AI 已识别 <Icon name="chev" size={12} color="#9af0fb" /></button>
        </div>
        <span className="tag purple" style={{ fontSize: 12, padding: "5px 10px" }}>识别类型：账号问题 - 登录异常</span>
        <div style={{ fontSize: 12, color: "var(--ink-300)", marginTop: 8 }}>可能原因：密码错误、设备验证、账号安全策略等</div>
      </div>

      <button className="cta-primary" style={{ marginTop: 14 }} onClick={() => description.trim() ? nav("ticketResult") : prototypeToast("请先填写问题描述", "error")}>
        提交工单
        <span className="arrow"><Icon name="arrow" size={17} color="#fff" /></span>
      </button>
      <div className="reg-foot"><Icon name="shield" size={13} color="#6f7a98" /> 提交即表示同意《服务协议》与《隐私政策》</div>
    </div>
  );
}

Object.assign(window, { TicketScreen });
