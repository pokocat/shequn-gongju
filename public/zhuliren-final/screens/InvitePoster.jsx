/* InvitePoster.jsx — 邀请海报详情 (27) */
function InvitePosterScreen({ nav }) {
  const feats = [
    { icon: "shield", t: "优质资源共享", d: "精选课程 · 行业资源 · 项目对接" },
    { icon: "ribbon", t: "专属陪跑支持", d: "服务老师 1 对 1 · 社群深度陪伴" },
    { icon: "sparkle", t: "AI 智能加速", d: "诊断建议 · 运营优化 · 增长提效" },
  ];
  const rules = [
    { icon: "award", t: "邀请奖励说明", d: "好友开通 PRO 会员成功后，您可获得相应积分与权益奖励" },
    { icon: "link", t: "关系绑定规则", d: "好友通过您的海报注册并开通后，系统将自动绑定关系链" },
    { icon: "crown", t: "推荐后可获得权益", d: "积分奖励、专属课程券、AI 诊断券、优先服务等多重权益" },
  ];
  return (
    <div className="screen flush fade-in" style={{ paddingBottom: 0 }}>
      <div style={{ padding: "0 16px" }}>
        <div className="row-between" style={{ padding: "2px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AppBackButton />
            <div className="app-logo" style={{ width: 30, height: 30, flex: "0 0 30px", borderRadius: 9 }}><Icon name="gemlogo" size={18} /></div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>主理人公社</span>
            <span className="badge-pro">PRO</span>
          </div>
          <WxCapsule />
        </div>
        <div className="row-between" style={{ padding: "2px 0 10px" }}>
          <span className="title-grad" style={{ fontSize: 25, fontWeight: 900 }}>邀请海报详情</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="pill-outline"><Icon name="qr" size={12} color="#c79bff" />专属邀请码</span>
            <span className="pill-outline" style={{ borderColor: "rgba(255,94,216,.4)" }}><Icon name="award" size={12} color="#ff9ee0" />邀请有礼</span>
          </div>
        </div>

        {/* poster */}
        <div className="card poster-big">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="app-logo" style={{ width: 30, height: 30, flex: "0 0 30px", borderRadius: 9 }}><Icon name="gemlogo" size={18} /></div>
            <div><div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>主理人公社</div><div style={{ fontSize: 10, color: "var(--ink-300)" }}>连接资源 · 共创商业</div></div>
          </div>
          <div className="title-grad" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.25, marginTop: 16 }}>连接优秀主理人<br/>共创新商业未来</div>
          <div style={{ fontSize: 12, color: "var(--ink-200)", marginTop: 10 }}>邀请好友加入主理人公社 PRO 会员计划</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginTop: 14 }}>
            <div className="poster-feats">
              {feats.map((f) => (
                <div key={f.t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span className="feat-ico" style={{ width: 26, height: 26, flex: "0 0 26px" }}><Icon name={f.icon} size={14} color="#c79bff" /></span>
                  <div><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{f.t}</div><div style={{ fontSize: 9.5, color: "var(--ink-300)", marginTop: 2 }}>{f.d}</div></div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}><QrCode size={80} /><div style={{ fontSize: 10, color: "var(--ink-200)", marginTop: 6 }}>长按识别<br/>加入社群</div></div>
          </div>
        </div>

        {/* rules */}
        <div className="card card-pad section-gap">
          {rules.map((r, i) => (
            <div className="rule-row" key={r.t}>
              <span className="rule-ico"><Icon name={r.icon} size={20} color="#b88bff" /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{r.t}</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4, lineHeight: 1.5 }}>{r.d}</div></div>
              <Icon name="chev" size={16} color="#5a6486" />
            </div>
          ))}
        </div>

        {/* stats */}
        <div className="card section-gap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 6px" }}>
          {[["user", "已邀请人数", "32", "人", "较上月 ↑12 人"], ["card", "本月收益", "2,560", "积分", "较上月 ↑ 860"], ["clock", "待激活邀请", "8", "人", "去提醒好友激活"]].map((s, i) => (
            <div key={i} style={{ textAlign: "center", position: "relative", padding: "0 4px" }}>
              {i > 0 && <span style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1, background: "rgba(140,120,220,.16)" }} />}
              <Icon name={s[0]} size={20} color="#b88bff" />
              <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 5 }}>{s[1]}</div>
              <div className="num" style={{ fontSize: 21, fontWeight: 800, color: "#fff", marginTop: 4 }}>{s[2]}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--ink-300)" }}> {s[3]}</span></div>
              <div className="num" style={{ fontSize: 10, color: i === 2 ? "#8aa6ff" : "#5fd9a8", marginTop: 4 }}>{s[4]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-bar" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => prototypeToast("邀请海报已保存到相册")}><Icon name="download" size={18} color="#fff" /> 保存邀请海报</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => prototypeDialog({ title: "分享给微信好友", body: "将发送专属邀请海报与关系链邀请码，好友注册后会自动绑定推荐关系。", confirmText: "模拟分享", onConfirm: () => prototypeToast("分享面板已唤起") })}><Icon name="wechat" size={17} color="#5fd9a8" /> 分享给微信好友</button>
      </div>
      <div className="reg-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 好友注册并开通后，系统自动绑定关系链 <span style={{ color: "#c79bff" }}>查看规则 ›</span></div>
    </div>
  );
}

Object.assign(window, { InvitePosterScreen });
