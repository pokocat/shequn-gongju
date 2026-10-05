/* GroupQR.jsx — 入群二维码 (20) */
function GroupQRScreen({ nav }) {
  const gain = [
    { icon: "bell", t: "课程通知", d: "第一时间获取\n课程与活动信息" },
    { icon: "chat", t: "社群答疑", d: "老师在线解答\n解决学习难题" },
    { icon: "link", t: "资源链接", d: "优质资料共享\n拓展商业资源" },
  ];
  return (
    <div className="screen flush fade-in group-qr-screen">
      <div className="group-qr-content">
        <div className="row-between group-qr-head">
          <div className="group-qr-brand">
            <AppBackButton />
            <div className="app-logo"><img className="group-qr-logo-image" src="assets/groupqr-reference-logo.png" alt="" /></div>
            <span>主理人公社</span>
          </div>
          <WxCapsule />
        </div>

        <div className="card group-qr-hero">
          <div className="group-qr-hero-copy">
              <div className="title-grad">已为您分配班级</div>
              <p>扫描二维码进入专属班级群，<br/>和同频主理人一起成长</p>
              <div className="group-qr-pills">
                <span className="pill-outline"><Icon name="crown" size={12} color="#e989ff" />专属社群</span>
                <span className="pill-outline"><Icon name="shield" size={12} color="#8fb9ff" />高质量成长</span>
              </div>
          </div>
          <div className="group-qr-hero-art">
            <img className="group-qr-a1-image" src="assets/groupqr-a1-crystal.png" alt="" />
          </div>
        </div>

        <div className="card card-pad section-gap group-qr-info">
          <div className="row-between group-qr-section-head">
            <div><Icon name="shield" size={16} color="#d98cff" /><span className="col-h">班级信息</span></div>
            <span className="status-chip green">已锁定席位 <Icon name="shield" size={11} color="#5fd9a8" /></span>
          </div>

          <div className="info-card group-qr-class-card">
            <div className="group-qr-class-title">
              <span>华东增长班 A1</span><span className="tag purple">PRO 专属</span>
            </div>
            <div className="ic-row"><div className="ic-l"><Icon name="calendar" size={15} color="#c5b7dc" /><span>开班时间</span></div><div className="ic-v num">2025.05.22 20:00</div></div>
            <div className="ic-row"><div className="ic-l"><Icon name="user" size={15} color="#c5b7dc" /><span>班级人数</span></div><div className="ic-v num">128 人</div></div>
            <div className="ic-row group-qr-teacher-row">
              <div className="ic-l"><Icon name="user" size={15} color="#c5b7dc" /><span>服务老师</span></div>
              <div className="group-qr-teacher"><Avatar size={34} initial="林" hue={40} /><div><div><span>林老师</span><span className="tag purple">专属服务</span></div><small>社群运营专家</small></div></div>
            </div>
          </div>

          <div className="qr-card group-qr-code-card">
            <div className="group-qr-label"><span>◆</span> 群二维码 <span>◆</span></div>
            <div className="qr-frame"><img className="group-qr-reference-qr" src="assets/groupqr-reference-qr.png" alt="群二维码" /></div>
            <div className="group-qr-tip"><Icon name="scan" size={14} color="#9a8fc8" />长按识别二维码加入班级群</div>
          </div>

          <div className="group-qr-gains">
            <div className="group-qr-gains-title"><Icon name="award" size={16} color="#e989ff" /><span className="col-h">群内可获得</span></div>
            <div className="group-qr-gain-list">
            {gain.map((g) => (
              <div className="gain-tile" key={g.t}>
                <Icon name={g.icon} size={24} color="#b88bff" />
                <div><strong>{g.t}</strong><span>{g.d}</span></div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar group-qr-actions">
        <button className="cta-primary" onClick={() => prototypeToast("群二维码已保存到相册")}><Icon name="download" size={14} color="#fff" /> 保存群二维码</button>
        <button className="cta-ghost" onClick={() => nav("addWechat")}><Icon name="headset" size={14} color="#e0c8ff" /> 联系服务老师</button>
      </div>
      <div className="reg-foot group-qr-foot"><Icon name="shield" size={11} color="#6f7a98" /> 二维码如失效，可联系服务老师重新获取</div>
    </div>
  );
}

Object.assign(window, { GroupQRScreen });
