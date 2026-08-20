/* Announcement.jsx — 消息助手 (09) */
function AnnouncementScreen({ nav }) {
  const [filter, setFilter] = React.useState("all");
  const [readAll, setReadAll] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const todos = [
    { icon: "card", title: "待确认权益", sub: "会员权益申请", count: "12 项待处理", tone: "purple", go: "benefits" },
    { icon: "members", title: "入群审批", sub: "新成员入群审核", count: "5 项待处理", tone: "blue", go: "groupQR" },
    { icon: "warn", title: "风险提醒", sub: "资质与售后跟进", count: "2 项待处理", tone: "pink", go: "ticket" },
  ];
  const messages = [
    { type: "finance", avatar: "rose", unread: 5, name: "Ava Lin", role: ["财务官", "amber"], time: "08:30", title: "昨日收益已到账，请核对", meta: "收益 · +18.6%", desc: "已为你标记 3 笔高利润订单，建议优先复盘毛利结构。", go: "points" },
    { type: "notice", avatar: "blue", unread: 1, name: "Mia Zhou", role: ["系统通知", "cyan"], time: "09:45", title: "今日日程安排已更新", meta: "经营 · 3项", desc: "上午处理招商授权，下午跟进 2 个供应链异常。", go: "home", hot: true },
    { type: "announcement", avatar: "gold", unread: 2, name: "平台公告", role: ["公告", "amber"], time: "10:05", title: "服务体系升级说明", meta: "升级 · 必读", desc: "主理人公社服务权益与学习路径已完成新版本调整。", go: "msgDetail" },
    { type: "notice", avatar: "teal", unread: 1, name: "课程通知", role: ["通知", "cyan"], time: "10:20", title: "高阶增长策略私享课开课", meta: "课程 · 今晚", desc: "今晚 20:00 开课，建议提前完成课前诊断与资料准备。", go: "training" },
    { type: "growth", avatar: "violet", unread: 6, name: "Dr. Chen", role: ["成长教练", "purple"], time: "10:50", title: "今日成长计划已生成", meta: "成长 · 2课题", desc: "今日建议完成一次商品复盘和一次成交话术录制。", go: "training" },
    { type: "todo", avatar: "pink", unread: 1, name: "Yuki Mai", role: ["选品官", "green"], time: "11:15", title: "请先完成供应商入驻申请", meta: "选品 · 3款", desc: "3 个热销品类已进入候选池，待供应商资质确认。", go: "ticket" },
    { type: "announcement", avatar: "orange", unread: 1, name: "活动公告", role: ["公告", "amber"], time: "11:40", title: "增长闭门私享会报名开启", meta: "活动 · 限额", desc: "华东增长班 A1 可优先报名，名额满后进入候补。", go: "invite" },
    { type: "growth", avatar: "green", unread: 4, name: "Leo Xu", role: ["天赋分析", "purple"], time: "12:20", title: "测一测，自己做什么更赚钱", meta: "策略 · 4条", desc: "基于你的社群数据，已生成新的优势定位建议。", go: "aiBooking" },
  ];
  const filters = [
    ["all", "全部"],
    ["todo", "待办"],
    ["notice", "通知"],
    ["announcement", "公告"],
    ["finance", "财务"],
    ["growth", "成长"],
  ];
  const visibleMessages = messages.filter((m) => {
    if (filter === "todo") return m.type === "todo" || m.action === "申请" || m.hot;
    if (filter === "notice") return m.type === "notice";
    if (filter === "announcement") return m.type === "announcement";
    if (filter === "finance") return m.type === "finance";
    if (filter === "growth") return m.type === "growth";
    return true;
  }).filter((m) => !query.trim() || `${m.name}${m.title}${m.desc}${m.meta}`.toLowerCase().includes(query.trim().toLowerCase()));
  const unreadTotal = readAll ? 0 : messages.reduce((sum, m) => sum + m.unread, 0);
  const openConversation = (message) => {
    localStorage.setItem("mrc_active_message", JSON.stringify(message));
    nav("msgDetail");
  };

  return (
    <div className="screen has-tabbar fade-in msg-screen">
      <AppHeader />

      <label className="wechat-search">
        <Icon name="search" size={15} color="#8f96a8" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索消息、课程或服务" />
        {query && <button type="button" aria-label="清除搜索" onClick={() => setQuery("")}>×</button>}
      </label>

      <section className="todo-quick-rail" aria-label="待办快捷入口">
        <button type="button" className="todo-quick-card service" onClick={() => openConversation({ name: "服务通知", avatar: "rose", time: "刚刚", title: "服务待办提醒", meta: "19 项待处理", desc: "待确认权益、入群审批和风险提醒已汇总，建议优先处理高优先级事项。", go: "benefits" })}>
          <span className="todo-quick-icon"><Icon name="bell" size={15} color="currentColor" /></span>
          <span className="todo-quick-copy"><strong>服务通知</strong><small>19 项待处理</small></span>
          <Icon name="chev" size={12} color="currentColor" />
        </button>
        {todos.map((todo) => (
          <button type="button" className={"todo-quick-card " + todo.tone} key={todo.title} onClick={() => nav(todo.go)}>
            <span className="todo-quick-icon"><Icon name={todo.icon} size={15} color="currentColor" /></span>
            <span className="todo-quick-copy"><strong>{todo.title}</strong><small>{todo.count}</small></span>
            <Icon name="chev" size={12} color="currentColor" />
          </button>
        ))}
      </section>

      <section className="msg-section msg-list-section">
        <div className="row-between msg-list-head">
          <div className="msg-unread-summary">{unreadTotal ? `${unreadTotal} 条未读消息` : "暂无未读消息"}</div>
          <button className="msg-text-btn" onClick={() => setReadAll(true)}>全部已读</button>
        </div>

        <div className="msg-filter-row">
          {filters.map(([k, label]) => (
            <button key={k} className={"msg-filter" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{label}</button>
          ))}
        </div>

        <div className="msg-list-card">
          {visibleMessages.map((m) => (
            <div className="msg-row" key={m.name} onClick={() => openConversation(m)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openConversation(m); }}>
              <div className="msg-avatar-wrap">
                <div className={"msg-portrait " + m.avatar}>
                  <span className="hair" />
                  <span className="face" />
                  <span className="body" />
                </div>
                {!readAll && <span className="msg-unread">{m.unread}</span>}
              </div>
              <div className="msg-row-main">
                <div className="msg-name-line">
                  <strong>{m.name}</strong>
                  <time>{m.time}</time>
                </div>
                <div className="msg-title-line">
                  <b>{m.title}</b>
                </div>
                <div className="msg-desc-line">
                  <span>{m.role[0]} · {m.meta} · {m.desc}</span>
                </div>
              </div>
            </div>
          ))}
          {!visibleMessages.length && <div className="msg-empty-state"><Icon name="search" size={24} color="#68728d" /><strong>未找到相关消息</strong><span>换个关键词或切换消息分类试试</span></div>}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { AnnouncementScreen });
