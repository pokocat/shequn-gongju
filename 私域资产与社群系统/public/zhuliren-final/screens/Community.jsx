/* Community.jsx — 班级社群 (06) */
function CommunityScreen({ nav }) {
  const [tab, setTab] = React.useState("mine");
  const [squareFilter, setSquareFilter] = React.useState("全部动态");
  const members = [
    { name: "Shirley", tone: "violet", me: "我" },
    { name: "Amy", tone: "rose" },
    { name: "Cindy", tone: "blue" },
    { name: "Jessica", tone: "gold" },
    { name: "Diana", tone: "teal" },
  ];
  const MemberPortrait = ({ tone = "violet", small = false, ring = false }) => (
    <div className={(small ? "community-portrait small " : "community-portrait ") + (ring ? "ring " : "") + "msg-portrait " + tone}>
      <span className="hair"></span>
      <span className="face"></span>
      <span className="body"></span>
    </div>
  );
  const tasks = [
    { icon: "star2", t: "学习《社群增长方法论》第2课", d: "课程学习 · 30 分钟", st: "进行中", c: "#ff9ee0" },
    { icon: "edit", t: "完成今日打卡", d: "每日成长 · 1/1 次", st: "已完成", c: "#5fd9a8", done: true },
    { icon: "chat", t: "参与班群话题讨论", d: "互动交流 · +10 积分", st: "待完成", c: "#8aa6ff", chev: true },
  ];
  const squarePosts = [
    { group: "华东增长班 A1", topic: "私域转化 SOP", name: "Mia Zhou", tone: "rose", time: "09:42", hot: "26 条讨论", text: "刚跑完一轮朋友圈种草，成交率从 3.8% 提到 7.1%，关键是把成交话术拆成 3 段。", tags: ["经验复盘", "可借鉴"], action: "收藏精华" },
    { group: "主理人资源互助群", topic: "供应链对接", name: "Leo Xu", tone: "blue", time: "10:18", hot: "12 人想要", text: "有做轻食代工的靠谱工厂资源，适合小批量测试，起订量比常规渠道低很多。", tags: ["资源同步", "待对接"], action: "发起对接" },
    { group: "AI 增长实战群", topic: "内容选题", name: "Ava Lin", tone: "teal", time: "11:06", hot: "8 条精华", text: "今天测了 5 个短视频标题，带具体收益场景的点击率最高，建议先从用户痛点反推标题。", tags: ["AI增长", "精华"], action: "生成选题" },
  ];
  return (
    <div className="screen has-tabbar fade-in community-screen" style={{ paddingTop: 2 }}>
      <AppHeader />
      <div className="topseg">
        <button type="button" className={"seg" + (tab === "mine" ? " active" : "")} aria-pressed={tab === "mine"} onClick={() => setTab("mine")}>我的社群</button>
        <button type="button" className={"seg" + (tab === "square" ? " active" : "")} aria-pressed={tab === "square"} onClick={() => setTab("square")}>社群广场</button>
      </div>

      {tab === "square" ? (
        <div className="community-square">
          <div className="card square-hero">
            <div>
              <span className="tag purple"><Icon name="chat" size={11} color="#d9b8ff" />微信群同步</span>
              <div className="square-title">跨群聊天广场</div>
              <div className="square-desc">同步各班群高价值聊天，沉淀资源、人脉与增长经验。</div>
            </div>
            <div className="square-stats">
              <div><b>8</b><span>同步群</span></div>
              <div><b>42</b><span>今日精华</span></div>
              <div><b>19</b><span>待回应</span></div>
            </div>
          </div>

          <div className="square-tools">
            {["全部动态", "精华聊天", "资源对接", "待回复"].map((item) => (
              <button type="button" className={"square-chip" + (squareFilter === item ? " active" : "")} key={item} onClick={() => setSquareFilter(item)}>{item}</button>
            ))}
          </div>

          <div className="square-insight">
            <Icon name="aitext" size={14} color="#9af0fb" />
            <div><b>AI 已提炼 6 条可复用经验</b><span>建议优先跟进 2 个资源需求、1 个服务问题</span></div>
            <button onClick={() => prototypeDialog({ title: "AI 精华提炼", body: "已识别：朋友圈转化话术、轻食供应链资源、短视频选题方法。建议先收藏 2 条经验并对接 1 个资源。" })}>查看</button>
          </div>

          <div className="card card-pad square-feed">
            <div className="row-between square-feed-head">
              <div className="col-h">群聊精选</div>
              <div className="link-trail" onClick={() => prototypeToast("群聊动态已同步")}>2 分钟前同步 <Icon name="refresh" size={12} color="#6f7a98" /></div>
            </div>
            {squarePosts.map((p) => (
              <div className="square-post" key={p.name + p.time}>
                <MemberPortrait tone={p.tone} small />
                <div className="square-post-main">
                  <div className="square-post-top">
                    <span className="square-name">{p.name}</span>
                    <span className="square-group">{p.group}</span>
                    <span className="square-time">{p.time}</span>
                  </div>
                  <div className="square-topic"># {p.topic} <span>{p.hot}</span></div>
                  <div className="square-text">{p.text}</div>
                  <div className="square-foot">
                    <div className="square-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                    <button onClick={() => prototypeToast(`${p.action}成功`)}>{p.action}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card square-advice">
            <div><Icon name="aitext" size={15} color="#9af0fb" /> AI 可继续优化</div>
            <span>自动提炼精华、识别资源机会、提醒服务老师跟进。</span>
          </div>
        </div>
      ) : (
      <>
      {/* class hero */}
      <div className="card class-hero">
        <span className="tag purple" style={{ borderRadius: 999 }}><Icon name="grid" size={12} color="#c9a6ff" />我的班级</span>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="title-grad" style={{ fontSize: 28, fontWeight: 900 }}>华东增长班 A1</span>
              <span className="tag purple" style={{ borderRadius: 999 }}><Icon name="shield" size={12} color="#c9a6ff" />已加入班群</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-200)", marginTop: 6 }}>链接资源 · 共同成长 · 放大影响力</div>
          </div>
          <div style={{ flex: "0 0 96px", marginTop: -6 }}><CrystalMedallion size={100} glyph="A1" /></div>
        </div>
        <div className="ch-box" style={{ marginTop: 12 }}>
          <div className="ch-line"><Icon name="members" size={15} color="#9a8fc8" /> 班级人数</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>128 人</div>
        </div>
        <div className="two-col" style={{ marginTop: 8, gap: 8 }}>
          <div className="ch-box" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="grid" size={14} color="#9a8fc8" /><MemberPortrait tone="rose" small />
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Victoria</div><div style={{ fontSize: 11, color: "var(--ink-300)" }}>联合创始人</div></div>
          </div>
          <div className="ch-box" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MemberPortrait tone="green" small />
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>服务老师</div><div style={{ fontSize: 11, color: "var(--ink-300)" }}>社群运营专家</div></div>
          </div>
        </div>
        <div className="ch-box" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="members" size={15} color="#9a8fc8" />
          <div style={{ flex: 1 }}><span style={{ fontSize: 13, color: "var(--ink-200)" }}>班群状态 </span><span style={{ fontSize: 13, color: "#5fd9a8", fontWeight: 700 }}>已加入班群</span><div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 2 }}>活跃度：92% · 今日在线 68 人</div></div>
          <Icon name="chev" size={16} color="#5a6486" />
        </div>
      </div>

      {/* dual action */}
      <div className="two-col section-gap" style={{ alignItems: "stretch" }}>
        <div className="big-action grad" onClick={() => nav("groupQR")}>
          <Icon name="chat" size={24} color="#fff" />
          <div><div className="ba-t">进入班群</div><div className="ba-d">与同学一起交流成长</div></div>
          <Icon name="arrow" size={16} color="#fff" style={{ position: "absolute", right: 14, top: 14 }} />
        </div>
        <div className="big-action ghost" onClick={() => nav("addWechat")}>
          <Icon name="wechat" size={24} color="#5fd9a8" />
          <div><div className="ba-t">添加服务微信</div><div className="ba-d">获取专属服务支持</div></div>
          <Icon name="arrow" size={16} color="#c9a6ff" style={{ position: "absolute", right: 14, top: 14 }} />
        </div>
      </div>

      {/* members */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <div className="col-h" style={{ fontSize: 15 }}>班级成员 <span className="num" style={{ color: "var(--ink-300)", fontWeight: 400 }}>(128)</span></div>
          <div className="link-trail" onClick={() => prototypeDialog({ title: "班级成员", body: "华东增长班 A1 共 128 人，包含品牌、电商、内容、咨询与本地生活等行业主理人。" })}>查看全部成员 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {members.map((m) => (
            <div key={m.name} style={{ textAlign: "center" }}>
              <MemberPortrait tone={m.tone} ring={m.me === "我"} />
              <div style={{ fontSize: 11.5, color: "#fff", marginTop: 5 }}>{m.name}</div>
              {m.me && <div className="me-pill">{m.me}</div>}
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <div className="more-disc"><Icon name="more" size={20} color="#9a8fc8" /></div>
            <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 5 }}>更多同学</div>
          </div>
        </div>
      </div>

      {/* tasks */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 6 }}>
          <div className="col-h" style={{ fontSize: 15 }}>今日班级任务</div>
          <div className="link-trail" onClick={() => prototypeDialog({ title: "今日班级任务", body: "今日共 3 项任务：课程学习、成长打卡与班群讨论。完成后预计获得 30 成长值。" })}>查看全部任务 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {tasks.map((t, i) => (
          <div className="task-row" key={i}>
            <div className="task-ico"><Icon name={t.icon} size={18} color="#b88bff" /></div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{t.t}</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>{t.d}</div></div>
            <div style={{ fontSize: 12.5, color: t.c, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>{t.st}{t.done && <Icon name="shield" size={14} color={t.c} />}{t.chev && <Icon name="chev" size={14} color={t.c} />}</div>
          </div>
        ))}
      </div>

      {/* activity */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 10 }}>
          <div className="col-h" style={{ fontSize: 15 }}>近期班级活动</div>
          <div className="link-trail" onClick={() => prototypeToast("已展示全部班级活动")}>查看全部活动 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="act-thumb"><span className="tag pink" style={{ position: "absolute", left: 6, bottom: 6, fontSize: 9, padding: "2px 6px" }}>即将开始</span><span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>高阶增长<br/>闭门私享会</span></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>高阶增长闭门私享会</div>
            <div className="num" style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 5 }}>2025.05.16（周五）14:00-17:30</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>上海市 · 浦东新区 · 张江科学会堂 3F</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div className="ava-stack">{["rose", "blue", "teal"].map((tone) => <MemberPortrait key={tone} tone={tone} small />)}</div>
              <span style={{ fontSize: 11.5, color: "var(--ink-300)" }}>已有 <span className="num">86</span> 人报名</span>
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 10.5, color: "var(--ink-300)" }}>距开始</div>
            <div className="num" style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: "3px 0 8px" }}>02 天 04 时</div>
            <button className="btn-outline-sm" onClick={() => prototypeDialog({ title: "高阶增长闭门私享会", body: "2025.05.16 14:00，上海张江科学会堂 3F。当前已有 86 人报名，PRO 会员可优先锁定席位。", confirmText: "预约席位", onConfirm: () => prototypeToast("已提交活动预约") })}>查看详情</button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

Object.assign(window, { CommunityScreen });
