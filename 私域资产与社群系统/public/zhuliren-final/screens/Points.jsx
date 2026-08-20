/* Points.jsx — 积分明细 (16) */
function PointsScreen({ nav }) {
  const items = [
    { icon: "calendar", t: "课程签到", d: "完成《AI增长实战》课程签到", date: "2025.05.22 09:15", v: "+120" },
    { icon: "doc", t: "完成作业", d: "提交《AI市场分析》作业", date: "2025.05.21 22:18", v: "+80" },
    { icon: "members", t: "邀请入会", d: "成功邀请好友加入主理人公社", date: "2025.05.21 18:36", v: "+300" },
    { icon: "chat", t: "社群发言", d: "在华东增长班 A1 群内发言", date: "2025.05.21 15:42", v: "+40" },
    { icon: "crown", t: "续费会员", d: "完成年费会员续费", date: "2025.05.20 14:07", v: "+500" },
  ];
  return (
    <div className="screen has-tabbar fade-in" style={{ paddingTop: 2 }}>
      <AppHeader pro={false} gem={false} />

      {/* hero */}
      <div className="card" style={{ padding: "14px 16px 0", overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="pill-outline"><Icon name="crown" size={13} color="#c79bff" />会员成长体系</span>
            <div className="title-grad" style={{ fontSize: 30, fontWeight: 900, margin: "10px 0 2px" }}>成长积分</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="num title-grad" style={{ fontSize: 40, fontWeight: 900 }}>12,890</span>
              <Icon name="gem" size={20} color="#c9a6ff" />
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-200)", marginTop: 6 }}>活跃、学习、共创都会累计成长值</div>
            <span className="pill-outline" style={{ marginTop: 10 }}><Icon name="refresh" size={12} color="#c79bff" />实时累计</span>
          </div>
          <div style={{ flex: "0 0 120px", marginTop: 10 }}><HeroGem w={128} h={120} icon="star2" /></div>
        </div>
        <div className="stat-3">
          <div><div className="s3-l">当前等级</div><div className="num title-grad s3-v">LV.3</div><div className="s3-d">精英会员</div></div>
          <div><div className="s3-l">距离升级</div><div className="num s3-v" style={{ color: "#fff" }}>1,110<span style={{ fontSize: 12, fontWeight: 400 }}> 积分</span></div><div className="s3-d">还需 1,110 积分升级</div></div>
          <div><div className="s3-l">本月新增</div><div className="num s3-v" style={{ color: "#9af0fb" }}>+ 1,560</div><div className="s3-d">较上月 <span style={{ color: "#5fd9a8" }}>↑35.2%</span></div></div>
        </div>
      </div>

      {/* detail timeline */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 6 }}>
          <div className="col-h" style={{ fontSize: 16 }}>积分明细</div>
          <div className="link-trail" onClick={() => prototypeToast("已显示全部积分记录")}>全部记录 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        <div className="timeline">
          {items.map((it, i) => (
            <div className="tl-item" key={i} style={{ paddingBottom: 10 }}>
              <div className="tl-rail"><span className="tl-node" />{i < items.length - 1 && <span className="tl-line" style={{ bottom: -16 }} />}</div>
              <div className="tl-icon"><Icon name={it.icon} size={20} color="#b88bff" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{it.t}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 2 }}>{it.d}</div>
                <div className="num" style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 3 }}>{it.date}</div>
              </div>
              <div className="num" style={{ fontSize: 17, fontWeight: 800, color: "#ff7ec2", display: "flex", alignItems: "center", gap: 4, alignSelf: "center" }}>{it.v} <Icon name="gem" size={14} color="#c9a6ff" /></div>
            </div>
          ))}
        </div>
      </div>

      {/* level benefits */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: "#fff" }}><Icon name="shield" size={16} color="#c79bff" />等级权益</div>
          <div className="link-trail" onClick={() => nav("benefits")}>权益对比 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        <div className="row-between">
          <div><div className="num title-grad" style={{ fontSize: 20, fontWeight: 900 }}>LV.3</div><div style={{ fontSize: 11.5, color: "var(--ink-300)" }}>精英会员</div></div>
          <div style={{ fontSize: 12, color: "var(--ink-300)" }}>还需 <span className="num">1,110</span> 积分升级</div>
          <div style={{ textAlign: "right" }}><div className="num" style={{ fontSize: 20, fontWeight: 900, color: "#8aa6ff" }}>LV.4</div><div style={{ fontSize: 11.5, color: "#8aa6ff" }}>核心会员</div></div>
        </div>
        <div className="prog-track" style={{ marginTop: 12, position: "relative" }}>
          <div className="prog-fill" style={{ width: "62%" }} /><span className="prog-knob" style={{ left: "62%" }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink-300)", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Icon name="sparkle" size={13} color="#c79bff" />升级后可享更多课程、资源与专属服务</div>
      </div>

      {/* CTAs */}
      <div className="two-col section-gap" style={{ alignItems: "stretch" }}>
        <button className="cta-ghost" style={{ height: 54, fontSize: 15 }} onClick={() => nav("benefits")}><Icon name="gem" size={17} color="#e0c8ff" /> 查看会员权益</button>
        <button className="cta-primary" style={{ height: 54, fontSize: 16 }} onClick={() => nav("invite")}><Icon name="sparkle" size={17} color="#fff" /> 去赚更多积分</button>
      </div>
    </div>
  );
}

Object.assign(window, { PointsScreen });
