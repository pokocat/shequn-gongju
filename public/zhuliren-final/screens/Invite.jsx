/* Invite.jsx — 邀请推荐 (14) */
function InviteScreen({ nav }) {
  const records = [
    { name: "Jessica", role: "联合创始人", date: "2025.05.20 10:30", st: "已开通", sub: "获得成长值 +380", hue: 0, ok: true },
    { name: "Victoria", role: "创始人", date: "2025.05.18 20:15", st: "已开通", sub: "获得成长值 +380", hue: 80, ok: true },
    { name: "Amy", role: "区域管理员", date: "2025.05.15 09:45", st: "待开通", sub: "已注册", hue: 160, ok: false },
  ];
  const posterFeat = [
    { ic: "shield", t: "专属身份标识", d: "展示您的专属身份与邀请码" },
    { ic: "wechat", t: "多渠道分享", d: "支持微信、朋友圈、海报下载" },
    { ic: "user", t: "好友快速入会", d: "一键跳转注册，转化更高" },
  ];
  return (
    <div className="screen has-tabbar fade-in invite-screen" style={{ paddingTop: 2 }}>
      <AppHeader />

      {/* hero */}
      <div className="card" style={{ padding: "16px 16px 14px", border: "1px solid rgba(120,90,220,.4)", background: "radial-gradient(120% 130% at 85% 0%, rgba(70,45,150,.4), rgba(12,14,28,.55) 60%)" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#fff" }}>邀请好友 · <span className="title-grad">共创增长</span></div>
            <div style={{ fontSize: 12.5, color: "var(--ink-200)", marginTop: 8, lineHeight: 1.6 }}>邀请好友加入主理人公社<br/>一起链接资源 · 共创价值</div>
            <button className="ghost-pill" style={{ marginTop: 12 }} onClick={() => nav("invitePoster")}>查看邀请规则 <Icon name="arrow" size={15} color="#dcd2ff" /></button>
          </div>
          <div style={{ flex: "0 0 116px", marginTop: 8 }}><Trophy size={92} /></div>
        </div>
      </div>

      {/* stats */}
      <div className="card section-gap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 6px" }}>
        {[["本月邀请人数", "18", "人", "+6 较上月"], ["成功开通人数", "9", "人", "+4 较上月"], ["预计收益", "¥2,870", "", "+¥980 较上月"]].map((s, i) => (
          <div key={i} style={{ textAlign: "center", position: "relative" }}>
            {i > 0 && <span style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1, background: "rgba(140,120,220,.16)" }} />}
            <div style={{ fontSize: 12, color: "var(--ink-300)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{s[0]}{i === 2 && <Icon name="info" size={12} color="#6f7a98" />}</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 800, color: i === 2 ? "#ff7ec2" : "#fff", marginTop: 6 }}>{s[1]}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--ink-300)" }}>{s[2] && " " + s[2]}</span></div>
            <div className="num" style={{ fontSize: 11, color: "#5fd9a8", marginTop: 4 }}>{s[3]}</div>
          </div>
        ))}
      </div>

      {/* invite code */}
      <div className="card card-pad section-gap">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-300)", display: "flex", alignItems: "center", gap: 5 }}>我的邀请码 <Icon name="info" size={12} color="#6f7a98" /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
              <span className="num" style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>HCS88888</span>
              <span className="copy-pill">复制</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-300)" }}>好友注册并开通，您可获得成长值与收益</div>
          </div>
          <div style={{ textAlign: "center" }}><QrCode size={84} /><div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 5 }}>扫码注册</div></div>
        </div>
      </div>

      {/* poster */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 4 }}>
          <div><div className="col-h">专属邀请海报</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>您的专属邀请海报，分享更高效</div></div>
          <button className="btn-sm" onClick={() => nav("invitePoster")}>查看示例</button>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <div className="poster-mini">
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>主理人公社</div>
            <div style={{ fontSize: 7.5, color: "var(--ink-200)", marginTop: 2 }}>邀请主理人·共创新商业</div>
            <div style={{ fontSize: 8.5, color: "#c9a6ff", marginTop: 14, lineHeight: 1.5 }}>链接·学习<br/>资源·共创</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, marginTop: 10 }}><QrCode size={34} /><div style={{ fontSize: 6.5, color: "var(--ink-200)" }}>邀请码：<br/>HCS88888</div></div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
            {posterFeat.map((f) => (
              <div key={f.t} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="feat-ico"><Icon name={f.ic} size={16} color="#c79bff" /></span>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{f.t}</div><div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 2 }}>{f.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <hr className="hr" style={{ margin: "14px 0 4px" }} />
        <div className="row-between" style={{ margin: "8px 0" }}>
          <div className="col-h" style={{ fontSize: 14 }}>最近邀请记录</div>
          <div className="link-trail" onClick={() => prototypeDialog({ title: "邀请记录", body: "本月已邀请 32 人，其中 24 人完成激活，8 人待激活。已累计获得 2,560 成长积分。" })}>全部记录 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {records.map((r, i) => (
          <div className="inv-row" key={i}>
            <Avatar size={36} initial={r.name[0]} hue={r.hue} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{r.name}</span><span className="tag purple">{r.role}</span></div>
              <div className="num" style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 3 }}>{r.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: r.ok ? "#5fd9a8" : "#8aa6ff" }}>{r.st}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-400)", marginTop: 2 }}>{r.sub}</div>
            </div>
            <Icon name="chev" size={15} color="#5a6486" />
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="two-col section-gap" style={{ alignItems: "stretch" }}>
        <button className="cta-primary" style={{ height: 54, fontSize: 16 }} onClick={() => nav("invitePoster")}><Icon name="chart" size={17} color="#fff" /> 生成海报</button>
        <button className="cta-ghost" style={{ height: 54, fontSize: 15 }} onClick={() => prototypeDialog({ title: "微信分享", body: "分享内容将包含您的专属邀请码，好友开通后自动计入邀请奖励。", confirmText: "模拟分享", onConfirm: () => prototypeToast("分享面板已唤起") })}><Icon name="wechat" size={17} color="#5fd9a8" /> 微信分享</button>
      </div>
    </div>
  );
}

Object.assign(window, { InviteScreen });
