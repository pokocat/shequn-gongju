(() => {
  function MessageDetailScreen({ nav }) {
    const fallback = {
      name: "\u5E73\u53F0\u516C\u544A",
      avatar: "gold",
      time: "10:05",
      title: "\u670D\u52A1\u4F53\u7CFB\u5347\u7EA7\u8BF4\u660E",
      meta: "\u5347\u7EA7 \xB7 \u5FC5\u8BFB",
      desc: "\u4E3B\u7406\u4EBA\u516C\u793E\u670D\u52A1\u6743\u76CA\u4E0E\u5B66\u4E60\u8DEF\u5F84\u5DF2\u5B8C\u6210\u65B0\u7248\u672C\u8C03\u6574\u3002",
      go: "benefits"
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
      setSent((items) => [...items, { text, time: "\u521A\u521A" }]);
      setDraft("");
      window.setTimeout(() => prototypeToast("\u5DF2\u53D1\u9001\u7ED9\u670D\u52A1\u56E2\u961F"), 120);
    };
    const systemMessages = [
      { type: "time", text: "\u4ECA\u5929 " + active.time },
      { type: "incoming", text: `\u4F60\u597D Shirley\uFF0C${active.title}\u3002` },
      { type: "card", title: active.title, meta: active.meta, desc: active.desc },
      { type: "incoming", text: "\u76F8\u5173\u4FE1\u606F\u5DF2\u540C\u6B65\u5230\u4F60\u7684\u670D\u52A1\u4E2D\u5FC3\u3002\u9700\u8981\u6211\u7EE7\u7EED\u534F\u52A9\u65F6\uFF0C\u76F4\u63A5\u56DE\u590D\u8FD9\u6761\u6D88\u606F\u5373\u53EF\u3002" }
    ];
    const actionText = active.go === "training" ? "\u67E5\u770B\u8BFE\u7A0B" : active.go === "points" ? "\u67E5\u770B\u660E\u7EC6" : active.go === "ticket" ? "\u5904\u7406\u5F85\u529E" : active.go === "aiBooking" ? "\u67E5\u770B\u5EFA\u8BAE" : "\u67E5\u770B\u8BE6\u60C5";
    return /* @__PURE__ */ React.createElement("div", { className: "screen fade-in chat-detail-screen" }, /* @__PURE__ */ React.createElement("div", { className: "chat-detail-head" }, /* @__PURE__ */ React.createElement(AppBackButton, null), /* @__PURE__ */ React.createElement("div", { className: "msg-portrait chat-detail-avatar " + active.avatar }, /* @__PURE__ */ React.createElement("span", { className: "hair" }), /* @__PURE__ */ React.createElement("span", { className: "face" }), /* @__PURE__ */ React.createElement("span", { className: "body" })), /* @__PURE__ */ React.createElement("div", { className: "chat-detail-contact" }, /* @__PURE__ */ React.createElement("strong", null, active.name), /* @__PURE__ */ React.createElement("span", null, "\u670D\u52A1\u6D88\u606F \xB7 \u5728\u7EBF")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "chat-detail-more", "aria-label": "\u66F4\u591A\u4F1A\u8BDD\u64CD\u4F5C", onClick: () => prototypeDialog({ title: active.name, body: "\u5DF2\u5F00\u542F\u6D88\u606F\u63D0\u9192\u3002\u91CD\u8981\u670D\u52A1\u6D88\u606F\u4F1A\u4F18\u5148\u63A8\u9001\u5230\u6B64\u5BF9\u8BDD\u3002" }) }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 19, color: "#cbd0e5" }))), /* @__PURE__ */ React.createElement("div", { className: "chat-stream" }, systemMessages.map((message, index) => {
      if (message.type === "time") return /* @__PURE__ */ React.createElement("div", { className: "chat-time", key: index }, message.text);
      if (message.type === "card") {
        return /* @__PURE__ */ React.createElement("div", { className: "chat-line incoming", key: index }, /* @__PURE__ */ React.createElement("div", { className: "msg-portrait chat-bubble-avatar " + active.avatar }, /* @__PURE__ */ React.createElement("span", { className: "hair" }), /* @__PURE__ */ React.createElement("span", { className: "face" }), /* @__PURE__ */ React.createElement("span", { className: "body" })), /* @__PURE__ */ React.createElement("div", { className: "chat-push-card" }, /* @__PURE__ */ React.createElement("div", { className: "chat-push-kicker" }, /* @__PURE__ */ React.createElement(Icon, { name: "bell", size: 13, color: "#c79bff" }), " \u4E3B\u7406\u4EBA\u516C\u793E"), /* @__PURE__ */ React.createElement("strong", null, message.title), /* @__PURE__ */ React.createElement("span", null, message.meta), /* @__PURE__ */ React.createElement("p", null, message.desc), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => nav(active.go) }, actionText, /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 13, color: "#cfd6ea" }))));
      }
      return /* @__PURE__ */ React.createElement("div", { className: "chat-line incoming", key: index }, /* @__PURE__ */ React.createElement("div", { className: "msg-portrait chat-bubble-avatar " + active.avatar }, /* @__PURE__ */ React.createElement("span", { className: "hair" }), /* @__PURE__ */ React.createElement("span", { className: "face" }), /* @__PURE__ */ React.createElement("span", { className: "body" })), /* @__PURE__ */ React.createElement("div", { className: "chat-bubble" }, message.text));
    }), sent.map((message, index) => /* @__PURE__ */ React.createElement("div", { className: "chat-line outgoing", key: "sent-" + index }, /* @__PURE__ */ React.createElement("div", { className: "chat-bubble" }, message.text), /* @__PURE__ */ React.createElement(Avatar, { size: 30, initial: "S", hue: 0, src: "assets/member-shirley-avatar.png" }))), /* @__PURE__ */ React.createElement("div", { className: "chat-time" }, "\u6D88\u606F\u5DF2\u9001\u8FBE")), /* @__PURE__ */ React.createElement("div", { className: "chat-composer" }, /* @__PURE__ */ React.createElement("input", { value: draft, onChange: (event) => setDraft(event.target.value), onKeyDown: (event) => {
      if (event.key === "Enter") sendMessage();
    }, placeholder: "\u56DE\u590D\u670D\u52A1\u6D88\u606F" }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "chat-send" + (draft.trim() ? " ready" : ""), onClick: sendMessage, "aria-label": "\u53D1\u9001\u6D88\u606F" }, /* @__PURE__ */ React.createElement(Icon, { name: "arrow", size: 17, color: "#fff" }))));
  }
  Object.assign(window, { MessageDetailScreen });
})();
