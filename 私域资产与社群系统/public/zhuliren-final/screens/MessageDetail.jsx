/* MessageDetail.jsx — 微信式消息对话 (13) */
function MessageDetailScreen({ nav }) {
  const fallback = {
    name: "平台公告",
    avatar: "gold",
    time: "10:05",
    title: "服务体系升级说明",
    meta: "升级 · 必读",
    desc: "主理人公社服务权益与学习路径已完成新版本调整。",
    go: "benefits",
  };
  let active = fallback;
  try {
    active = { ...fallback, ...JSON.parse(localStorage.getItem("mrc_active_message") || "{}") };
  } catch (error) {
    active = fallback;
  }
  const [draft, setDraft] = React.useState("");
  const [sent, setSent] = React.useState([]);
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setSent((items) => [...items, { text, time: "刚刚" }]);
    setDraft("");
    window.setTimeout(() => prototypeToast("已发送给服务团队"), 120);
  };
  const systemMessages = [
    { type: "time", text: "今天 " + active.time },
    { type: "incoming", text: `你好 Shirley，${active.title}。` },
    { type: "card", title: active.title, meta: active.meta, desc: active.desc },
    { type: "incoming", text: "相关信息已同步到你的服务中心。需要我继续协助时，直接回复这条消息即可。" },
  ];
  const actionText = active.go === "training" ? "查看课程" : active.go === "points" ? "查看明细" : active.go === "ticket" ? "处理待办" : active.go === "aiBooking" ? "查看建议" : "查看详情";

  return (
    <div className="screen fade-in chat-detail-screen">
      <div className="chat-detail-head">
        <AppBackButton />
        <div className={"msg-portrait chat-detail-avatar " + active.avatar}>
          <span className="hair" /><span className="face" /><span className="body" />
        </div>
        <div className="chat-detail-contact"><strong>{active.name}</strong><span>服务消息 · 在线</span></div>
        <button type="button" className="chat-detail-more" aria-label="更多会话操作" onClick={() => prototypeDialog({ title: active.name, body: "已开启消息提醒。重要服务消息会优先推送到此对话。" })}><Icon name="more" size={19} color="#cbd0e5" /></button>
      </div>

      <div className="chat-stream">
        {systemMessages.map((message, index) => {
          if (message.type === "time") return <div className="chat-time" key={index}>{message.text}</div>;
          if (message.type === "card") {
            return (
              <div className="chat-line incoming" key={index}>
                <div className={"msg-portrait chat-bubble-avatar " + active.avatar}><span className="hair" /><span className="face" /><span className="body" /></div>
                <div className="chat-push-card">
                  <div className="chat-push-kicker"><Icon name="bell" size={13} color="#c79bff" /> 主理人公社</div>
                  <strong>{message.title}</strong>
                  <span>{message.meta}</span>
                  <p>{message.desc}</p>
                  <button type="button" onClick={() => nav(active.go)}>{actionText}<Icon name="chev" size={13} color="#cfd6ea" /></button>
                </div>
              </div>
            );
          }
          return (
            <div className="chat-line incoming" key={index}>
              <div className={"msg-portrait chat-bubble-avatar " + active.avatar}><span className="hair" /><span className="face" /><span className="body" /></div>
              <div className="chat-bubble">{message.text}</div>
            </div>
          );
        })}
        {sent.map((message, index) => (
          <div className="chat-line outgoing" key={"sent-" + index}>
            <div className="chat-bubble">{message.text}</div>
            <Avatar size={30} initial="S" hue={0} src="assets/member-shirley-avatar.png" />
          </div>
        ))}
        <div className="chat-time">消息已送达</div>
      </div>

      <div className="chat-composer">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="回复服务消息" />
        <button type="button" className={"chat-send" + (draft.trim() ? " ready" : "")} onClick={sendMessage} aria-label="发送消息"><Icon name="arrow" size={17} color="#fff" /></button>
      </div>
    </div>
  );
}

Object.assign(window, { MessageDetailScreen });
