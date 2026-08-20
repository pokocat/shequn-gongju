(() => {
  function StatusBar() {
    return /* @__PURE__ */ React.createElement("div", { className: "statusbar" }, /* @__PURE__ */ React.createElement("span", { className: "time" }, "9:41"), /* @__PURE__ */ React.createElement("span", { className: "sb-right" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "12", viewBox: "0 0 18 12", fill: "#fff" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "8", width: "3", height: "4", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "5", y: "5", width: "3", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "10", y: "2.5", width: "3", height: "9.5", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "0", width: "3", height: "12", rx: "1" })), /* @__PURE__ */ React.createElement("svg", { width: "17", height: "12", viewBox: "0 0 17 12", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M8.5 2.5c2.6 0 5 1 6.8 2.7M8.5 6c1.6 0 3.1.6 4.2 1.7M3.5 5.2C4.9 3.8 6.6 3 8.5 3", stroke: "#fff", strokeWidth: "1.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "9.7", r: "1.3", fill: "#fff" })), /* @__PURE__ */ React.createElement("svg", { width: "26", height: "13", viewBox: "0 0 26 13", fill: "none" }, /* @__PURE__ */ React.createElement("rect", { x: "0.5", y: "0.5", width: "22", height: "12", rx: "3.5", stroke: "#fff", opacity: "0.5" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "19", height: "9", rx: "2", fill: "#fff" }), /* @__PURE__ */ React.createElement("rect", { x: "24", y: "4", width: "2", height: "5", rx: "1", fill: "#fff", opacity: "0.6" }))));
  }
  function WxCapsule({ showBack, onBack }) {
    return /* @__PURE__ */ React.createElement("div", { className: "wx-capsule" }, /* @__PURE__ */ React.createElement("div", { className: "dot-row" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { className: "circle" }));
  }
  function AppBackButton({ onBack = null }) {
    var _a;
    const navBack = onBack || typeof window !== "undefined" && ((_a = window.__MRC_NAV__) == null ? void 0 : _a.back);
    if (!navBack) return null;
    return /* @__PURE__ */ React.createElement("button", { className: "app-back", type: "button", onClick: navBack, "aria-label": "\u8FD4\u56DE\u4E0A\u4E00\u7EA7" }, /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 18, color: "#e8ddff" }));
  }
  function AppHeader({ pro = true, gem = true, capsule = true, scan = false, logo = true, logoSrc = null, big = false, back = null, showBack = "auto", sub = true }) {
    var _a, _b;
    const navBack = back || typeof window !== "undefined" && ((_a = window.__MRC_NAV__) == null ? void 0 : _a.back);
    const canBack = showBack === "auto" ? !!(typeof window !== "undefined" && ((_b = window.__MRC_NAV__) == null ? void 0 : _b.canBack)) : !!showBack;
    return /* @__PURE__ */ React.createElement("div", { className: "app-head" }, canBack && navBack && /* @__PURE__ */ React.createElement(AppBackButton, { onBack: navBack }), logo && /* @__PURE__ */ React.createElement("button", { type: "button", className: "app-logo app-home", onClick: () => window.dispatchEvent(new CustomEvent("mrc:go-home")), "aria-label": "\u8FD4\u56DE\u9996\u9875", title: "\u8FD4\u56DE\u9996\u9875" }, logoSrc ? /* @__PURE__ */ React.createElement("img", { src: logoSrc, alt: "\u4E3B\u7406\u4EBA\u516C\u793E" }) : /* @__PURE__ */ React.createElement(Icon, { name: "gemlogo", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "brand" }, /* @__PURE__ */ React.createElement("div", { className: "row1" }, /* @__PURE__ */ React.createElement("span", { className: "name" + (big ? " name-big" : "") }, "\u4E3B\u7406\u4EBA\u516C\u793E"), pro && /* @__PURE__ */ React.createElement("span", { className: "badge-pro" }, "PRO"), gem && /* @__PURE__ */ React.createElement("button", { type: "button", className: "gem-mini theme-cycle", onClick: () => window.dispatchEvent(new CustomEvent("mrc:theme-cycle")), "aria-label": "\u5207\u6362 UI \u98CE\u683C", title: "\u5207\u6362 UI \u98CE\u683C" }, /* @__PURE__ */ React.createElement(Icon, { name: "gem", size: 15, color: "#c9a6ff" }))), sub && /* @__PURE__ */ React.createElement("div", { className: "sub" }, "\u8FDE\u63A5\u4E3B\u7406\u4EBA \xB7 \u5171\u521B\u65B0\u5546\u4E1A")), scan ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "cap-btn" }, /* @__PURE__ */ React.createElement(Icon, { name: "scan", size: 20, color: "#cfd6ea" })), /* @__PURE__ */ React.createElement("div", { className: "cap-btn" }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 20, color: "#cfd6ea" }))) : capsule && /* @__PURE__ */ React.createElement(WxCapsule, null));
  }
  function QrCode({ size = 96 }) {
    const cells = 11;
    const seed = "1011010011100101101001011100110100101101110100101011010011100101101";
    const rows = [];
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const on = seed[(y * cells + x) % seed.length] === "1";
        const finder = x < 3 && y < 3 || x > cells - 4 && y < 3 || x < 3 && y > cells - 4;
        if (on || finder) rows.push(/* @__PURE__ */ React.createElement("rect", { key: x + "_" + y, x, y, width: "1", height: "1" }));
      }
    }
    return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: 6, borderRadius: 8 } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: `0 0 ${cells} ${cells}`, fill: "#0a0a12", shapeRendering: "crispEdges" }, rows, /* @__PURE__ */ React.createElement("g", { fill: "none", stroke: "#0a0a12", strokeWidth: "0.6" }, /* @__PURE__ */ React.createElement("rect", { x: "0.3", y: "0.3", width: "2.4", height: "2.4" }), /* @__PURE__ */ React.createElement("rect", { x: cells - 2.7, y: "0.3", width: "2.4", height: "2.4" }), /* @__PURE__ */ React.createElement("rect", { x: "0.3", y: cells - 2.7, width: "2.4", height: "2.4" }))));
  }
  const AVATAR_PHOTOS = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80"
  ];
  function avatarPhotoFor(initial = "", hue = 0) {
    const key = String(initial || "");
    const charSum = [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const index = Math.abs(Math.round((Number(hue) || 0) / 40) + charSum) % AVATAR_PHOTOS.length;
    return AVATAR_PHOTOS[index];
  }
  function Avatar({ size = 44, initial = "", ring = false, hue = 0, src = null }) {
    const photo = src || avatarPhotoFor(initial, hue);
    return /* @__PURE__ */ React.createElement("div", { className: "avatar photo-avatar" + (ring ? " ring" : ""), style: { width: size, height: size } }, /* @__PURE__ */ React.createElement("img", { src: photo, alt: initial ? `${initial} avatar` : "avatar", loading: "lazy" }));
  }
  function TabBar({ active = "home", communityLabel = "\u793E\u7FA4", communityDot = false, variant = "fab", onNav }) {
    const go = (k) => onNav && onNav(k);
    return /* @__PURE__ */ React.createElement("nav", { className: "tabbar" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab" + (active === "msg" ? " active" : ""), onClick: () => go("msg"), "aria-label": "\u6D88\u606F" }, /* @__PURE__ */ React.createElement(Icon, { name: "chat", size: 24 }), /* @__PURE__ */ React.createElement("span", null, "\u6D88\u606F"), /* @__PURE__ */ React.createElement("span", { className: "badge-num" }, "12")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab" + (active === "community" ? " active" : ""), onClick: () => go("community"), "aria-label": communityLabel }, /* @__PURE__ */ React.createElement(Icon, { name: communityLabel === "\u6210\u5458" ? "members" : "community", size: 24 }), /* @__PURE__ */ React.createElement("span", null, communityLabel), communityDot && /* @__PURE__ */ React.createElement("i", { className: "dot-new" })), variant === "member" ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab tab-member" + (active === "member" ? " active" : ""), onClick: () => go("memberhub"), "aria-label": "\u4F1A\u5458" }, /* @__PURE__ */ React.createElement(Icon, { name: "gem", size: 24 }), /* @__PURE__ */ React.createElement("span", null, "\u4F1A\u5458")) : /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab-fab", onClick: () => go("create"), "aria-label": "\u9884\u7EA6 AI \u8BCA\u65AD" }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 26 })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab" + (active === "home" ? " active" : ""), onClick: () => go("home"), "aria-label": "\u9996\u9875" }, /* @__PURE__ */ React.createElement(Icon, { name: "home", size: 24 }), /* @__PURE__ */ React.createElement("span", null, "\u9996\u9875")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tab" + (active === "me" ? " active" : ""), onClick: () => go("me"), "aria-label": "\u6211\u7684" }, /* @__PURE__ */ React.createElement(Icon, { name: "user", size: 24 }), /* @__PURE__ */ React.createElement("span", null, "\u6211\u7684")));
  }
  function Dots({ n = 3, on = 0 }) {
    return /* @__PURE__ */ React.createElement("div", { className: "dots" }, [...Array(n)].map((_, i) => /* @__PURE__ */ React.createElement("i", { key: i, className: i === on ? "on" : "" })));
  }
  function Icon({ name, size = 24, color = "currentColor", strokeWidth = 1.7 }) {
    const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
    const f = { fill: color };
    const paths = {
      phone: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "7", y: "3", width: "10", height: "18", rx: "2.5" }), /* @__PURE__ */ React.createElement("line", { x1: "11", y1: "18", x2: "13", y2: "18" })),
      user: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "8", r: "3.5" }), /* @__PURE__ */ React.createElement("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" })),
      pin: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 21c4-4.5 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 3 6.5 7 11Z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "2.5" })),
      link: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9.5 14.5l5-5" }), /* @__PURE__ */ React.createElement("path", { d: "M8 12l-2 2a3.5 3.5 0 0 0 5 5l2-2" }), /* @__PURE__ */ React.createElement("path", { d: "M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2" })),
      grid: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "6.5", height: "6.5", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13.5", y: "4", width: "6.5", height: "6.5", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "13.5", width: "6.5", height: "6.5", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13.5", y: "13.5", width: "6.5", height: "6.5", rx: "1.5" })),
      chev: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9 6l6 6-6 6" })),
      arrow: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" })),
      search: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "6.5" }), /* @__PURE__ */ React.createElement("path", { d: "M16 16l4 4" })),
      sparkle: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" })),
      info: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 11v5M12 8h.01" })),
      shield: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" }), /* @__PURE__ */ React.createElement("path", { d: "M9 12l2 2 4-4" })),
      crown: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z" })),
      scan: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16" })),
      more: /* @__PURE__ */ React.createElement("g", { ...f }, /* @__PURE__ */ React.createElement("circle", { cx: "5", cy: "12", r: "1.7" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.7" }), /* @__PURE__ */ React.createElement("circle", { cx: "19", cy: "12", r: "1.7" })),
      folder: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })),
      cap: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 9l9-4 9 4-9 4z" }), /* @__PURE__ */ React.createElement("path", { d: "M7 11v5c0 1 2.2 2 5 2s5-1 5-2v-5" })),
      lock: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "11", width: "14", height: "9", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M8 11V8a4 4 0 0 1 8 0v3" })),
      members: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "8", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" }), /* @__PURE__ */ React.createElement("path", { d: "M16 5.5a3 3 0 0 1 0 5.5M17 14.5c2.4.5 4 2.3 4 5.5" })),
      chart: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 19V5M4 19h16" }), /* @__PURE__ */ React.createElement("path", { d: "M8 16l3.5-4 3 2.5L20 8" })),
      bell: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }), /* @__PURE__ */ React.createElement("path", { d: "M10 19a2 2 0 0 0 4 0" })),
      megaphone: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 10v4l11 4V6zM4 10H3v4h1M15 8a4 4 0 0 1 0 8" })),
      calendar: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 9h16M9 3v4M15 3v4" })),
      star2: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 4l2.4 5 5.6.6-4.2 3.7 1.2 5.4L12 16l-5 2.7 1.2-5.4L4 9.6 9.6 9z" })),
      chat: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 5h16v11H8l-4 4z" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "10.5", r: "1", fill: color, stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "10.5", r: "1", fill: color, stroke: "none" })),
      home: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 11l8-7 8 7" }), /* @__PURE__ */ React.createElement("path", { d: "M6 10v10h12V10" })),
      community: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "9", r: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M7 19a5 5 0 0 1 10 0" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" })),
      plus: /* @__PURE__ */ React.createElement("g", { ...p, strokeWidth: "2.4" }, /* @__PURE__ */ React.createElement("path", { d: "M12 6v12M6 12h12" })),
      clock: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7v5l3.5 2" })),
      alarm: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "13", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M12 9v4l2.5 1.5M5 4L2 7M19 4l3 3M9 21l-1 2M15 21l1 2" })),
      refresh: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M20 11a8 8 0 0 0-14-4M4 5v3h3" }), /* @__PURE__ */ React.createElement("path", { d: "M4 13a8 8 0 0 0 14 4M20 19v-3h-3" })),
      edit: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M14 5l5 5M4 20l1-4L17 4l3 3L8 19z" })),
      target: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3.5" })),
      wechat: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9 4C5.1 4 2 6.7 2 10c0 1.9 1 3.5 2.6 4.6L4 17l2.7-1.3c.7.2 1.5.3 2.3.3M16 8c-3.3 0-6 2.2-6 5s2.7 5 6 5c.7 0 1.4-.1 2-.3L22 19l-.6-2c1-.8 1.6-2 1.6-3.2 0-2.8-2.7-5-6-5Z" })),
      award: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "9", r: "5" }), /* @__PURE__ */ React.createElement("path", { d: "M9 13.5L8 21l4-2 4 2-1-7.5" })),
      card: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "6", width: "18", height: "12", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 10h18M7 14h4" })),
      qr: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 14h2v2M20 14v6M14 20h6", strokeWidth: "1.6" })),
      gem: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 9l3-4h8l3 4-7 11z" }), /* @__PURE__ */ React.createElement("path", { d: "M5 9h14M9 5l-1 4 4 11 4-11-1-4" })),
      gemlogo: /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("path", { d: "M5 9l3-4h8l3 4-7 11z", fill: "url(#gl_g)", stroke: "#c9a6ff", strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("path", { d: "M5 9h14M9 5l-1 4 4 11 4-11-1-4", stroke: "#e9d4ff", strokeWidth: "1", fill: "none", opacity: "0.7" }), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "gl_g", x1: "0", y1: "0", x2: "1", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#a45cff" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#3a6bff" })))),
      contacts: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M8 16c0-2 1.8-3 4-3s4 1 4 3" })),
      warn: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 4l9 16H3z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10v4M12 17h.01" })),
      ribbon: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 4c0 5 2 8 7 8s7-3 7-8" })),
      headset: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 13a7 7 0 0 1 14 0" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "13", width: "4", height: "6", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "17", y: "13", width: "4", height: "6", rx: "1.5" }), /* @__PURE__ */ React.createElement("path", { d: "M19 19a3 3 0 0 1-3 3h-2" })),
      download: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 4v11M8 11l4 4 4-4" }), /* @__PURE__ */ React.createElement("path", { d: "M5 19h14" })),
      copy: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "8", y: "8", width: "12", height: "12", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 16V5a1 1 0 0 1 1-1h11" })),
      doc: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M6 3h8l4 4v14H6z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4M9 13h6M9 17h6" })),
      play: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M10 8.5l5 3.5-5 3.5z", fill: color, stroke: "none" })),
      handshake: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 12l4-4 5 3 5-3 4 4-5 6-4-3-4 3z" })),
      xcircle: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M9 9l6 6M15 9l-6 6" })),
      bookmark: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M6 4h12v16l-6-4-6 4z" })),
      funnel: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 5h16l-6 7v6l-4 2v-8z" })),
      pulse: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 12h4l2-6 4 12 2-6h6" })),
      book: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2z" })),
      cloud: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M7 17a4 4 0 0 1-.5-8 5 5 0 0 1 9.6 1.2A3.5 3.5 0 0 1 16 17z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 11v5M9.5 13.5L12 16l2.5-2.5" })),
      yrefund: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 9a8 8 0 0 1 14-2M19 5v3h-3" }), /* @__PURE__ */ React.createElement("path", { d: "M19 15a8 8 0 0 1-14 2M5 19v-3h3" }), /* @__PURE__ */ React.createElement("path", { d: "M12 9v6M9.5 10h5M9.5 12.5h5" })),
      receipt: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" }), /* @__PURE__ */ React.createElement("path", { d: "M8 8h8M8 12h8" })),
      grid9: /* @__PURE__ */ React.createElement("g", { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M9 4v16M15 4v16M4 9h16M4 15h16" }))
    };
    return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", style: { display: "block" } }, paths[name] || null);
  }
  Object.assign(window, { StatusBar, WxCapsule, AppBackButton, AppHeader, Avatar, TabBar, Dots, Icon, QrCode });
})();
