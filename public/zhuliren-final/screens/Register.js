(() => {
  function RegisterScreen({ nav }) {
    const [phone, setPhone] = React.useState("");
    const [code, setCode] = React.useState("");
    const [agreed, setAgreed] = React.useState(true);
    const [sent, setSent] = React.useState(false);
    const [notice, setNotice] = React.useState("");
    const canStart = phone.length >= 6 && agreed;
    const sendCode = () => {
      if (!phone) {
        setNotice("\u8BF7\u5148\u8F93\u5165\u624B\u673A\u53F7");
        return;
      }
      setSent(true);
      setNotice("\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001");
    };
    const startLogin = () => {
      if (phone.length < 6) {
        setNotice("\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u540E\u7EE7\u7EED");
        return;
      }
      if (!agreed) {
        setNotice("\u8BF7\u5148\u9605\u8BFB\u5E76\u540C\u610F\u7528\u6237\u534F\u8BAE");
        return;
      }
      setNotice("");
      nav("success");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "screen flush fade-in login-screen" }, /* @__PURE__ */ React.createElement("div", { className: "login-bg" }), /* @__PURE__ */ React.createElement("div", { className: "login-top" }, /* @__PURE__ */ React.createElement(AppBackButton, null), /* @__PURE__ */ React.createElement("div", { className: "login-nav-title" }, "\u767B\u5F55"), /* @__PURE__ */ React.createElement(WxCapsule, null)), /* @__PURE__ */ React.createElement("div", { className: "login-main" }, /* @__PURE__ */ React.createElement("div", { className: "login-title-block" }, /* @__PURE__ */ React.createElement("div", { className: "login-kicker" }, "\u4E3B\u7406\u4EBA\u516C\u793E \xB7 OWNER PLAN"), /* @__PURE__ */ React.createElement("h1", null, "\u4E3B\u7406\u4EBA\u8BA1\u5212\u542F\u52A8"), /* @__PURE__ */ React.createElement("p", null, "\u6DF1\u77E5\u521B\u4E1A\u4E0D\u6613\uFF0C\u613F\u628A\u8D44\u6E90\u3001\u80FD\u529B\u4E0E\u6280\u672F\u6C89\u6DC0\u6210\u652F\u6301\uFF0C\u966A\u66F4\u591A\u4F18\u8D28\u4E3B\u7406\u4EBA\u6210\u957F\u8D77\u6765")), /* @__PURE__ */ React.createElement("div", { className: "login-form" }, /* @__PURE__ */ React.createElement("label", { className: "login-input" }, /* @__PURE__ */ React.createElement(Icon, { name: "phone", size: 19, color: "#8d96b7" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: phone,
        onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)),
        placeholder: "\u624B\u673A\u53F7",
        inputMode: "numeric"
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "login-input has-action" }, /* @__PURE__ */ React.createElement(Icon, { name: "chat", size: 19, color: "#8d96b7" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: code,
        onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
        placeholder: "\u9A8C\u8BC1\u7801",
        inputMode: "numeric"
      }
    ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "login-code-btn", onClick: sendCode }, sent ? "\u5DF2\u53D1\u9001" : "\u53D1\u9001\u9A8C\u8BC1\u7801")), /* @__PURE__ */ React.createElement("label", { className: "login-agree" }, /* @__PURE__ */ React.createElement("span", { className: "login-check" + (agreed ? " on" : ""), onClick: () => setAgreed(!agreed) }, agreed && /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 12, color: "#0a0d12" })), /* @__PURE__ */ React.createElement("span", null, "\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F\u4E3B\u7406\u4EBA\u516C\u793E\u300A\u7528\u6237\u534F\u8BAE\u300B\u548C\u300A\u9690\u79C1\u653F\u7B56\u300B")), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "login-start" + (!canStart ? " disabled" : ""),
        onClick: startLogin
      },
      "\u7ACB\u5373\u542F\u52A8"
    ), notice && /* @__PURE__ */ React.createElement("div", { className: "login-notice" }, notice)), /* @__PURE__ */ React.createElement("div", { className: "login-alt-row" }, /* @__PURE__ */ React.createElement("span", null, "\u5176\u4ED6\u65B9\u5F0F"), /* @__PURE__ */ React.createElement("button", { className: "login-mini-social", "aria-label": "\u5FAE\u4FE1\u767B\u5F55", onClick: () => {
      prototypeToast("\u5FAE\u4FE1\u6388\u6743\u6210\u529F");
      window.setTimeout(() => nav("success"), 350);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "wechat", size: 16, color: "#fff" }), "\u5FAE\u4FE1\u767B\u5F55")), /* @__PURE__ */ React.createElement("div", { className: "login-ref-card" }, /* @__PURE__ */ React.createElement(Avatar, { size: 40, initial: "\u5F20", hue: 36, ring: true }), /* @__PURE__ */ React.createElement("div", { className: "login-ref-info" }, /* @__PURE__ */ React.createElement("div", { className: "login-ref-name" }, /* @__PURE__ */ React.createElement("span", { className: "login-ref-tag" }, "\u63A8\u8350\u4EBA"), /* @__PURE__ */ React.createElement("strong", null, "Sarah\uFF08\u5F20\u7ECF\u7406\uFF09"), /* @__PURE__ */ React.createElement("button", { className: "icon-plain-button", type: "button", "aria-label": "\u590D\u5236\u63A8\u8350\u4EBA\u59D3\u540D", onClick: () => prototypeCopy("Sarah\uFF08\u5F20\u7ECF\u7406\uFF09", "\u63A8\u8350\u4EBA\u59D3\u540D") }, /* @__PURE__ */ React.createElement(Icon, { name: "copy", size: 14, color: "#76819f" }))), /* @__PURE__ */ React.createElement("div", { className: "login-ref-line" }, "\u5FAE\u4FE1\u53F7\uFF1ABOSS_SARAH", /* @__PURE__ */ React.createElement("button", { className: "icon-plain-button", type: "button", "aria-label": "\u590D\u5236\u63A8\u8350\u4EBA\u5FAE\u4FE1\u53F7", onClick: () => prototypeCopy("BOSS_SARAH", "\u63A8\u8350\u4EBA\u5FAE\u4FE1\u53F7") }, /* @__PURE__ */ React.createElement(Icon, { name: "copy", size: 13, color: "#66708b" }))), /* @__PURE__ */ React.createElement("div", { className: "login-ref-line" }, "\u624B\u673A\u53F7\uFF1A138 8888 8888", /* @__PURE__ */ React.createElement("button", { className: "login-call", type: "button", onClick: () => prototypeToast("\u6B63\u5728\u547C\u53EB 138 8888 8888") }, /* @__PURE__ */ React.createElement(Icon, { name: "phone", size: 12, color: "#0a0d12" }), "\u62E8\u6253")))), /* @__PURE__ */ React.createElement("div", { className: "login-flow-note" }, /* @__PURE__ */ React.createElement("div", { className: "tile-ico" }, /* @__PURE__ */ React.createElement(Icon, { name: "sparkle", size: 17, color: "#c9a6ff" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\u5148\u767B\u5F55\uFF0C\u540E\u5B8C\u5584\u8D44\u6599"), /* @__PURE__ */ React.createElement("span", null, "\u8FDB\u5165\u540E\u5F15\u5BFC\u5B8C\u6210\u6CE8\u518C\u3001\u5173\u7CFB\u94FE\u786E\u8BA4\u4E0E\u667A\u80FD\u5206\u914D")))));
  }
  Object.assign(window, { RegisterScreen });
})();
