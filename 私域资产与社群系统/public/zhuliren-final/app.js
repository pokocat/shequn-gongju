(() => {
  const { useState, useEffect } = React;
  const SCREENS = {
    systems: { comp: "SystemVariantsScreen", full: true },
    register: { comp: "RegisterScreen" },
    success: { comp: "SuccessScreen" },
    home: { comp: "HomeScreen", tabbar: "fab", active: "home", community: "\u6210\u5458" },
    member: { comp: "MemberCardScreen" },
    training: { comp: "TrainingScreen", tabbar: "fab", active: "home", community: "\u793E\u7FA4", dot: true },
    ai: { comp: "AIDiagnosisScreen", tabbar: "fab", active: "home", community: "\u793E\u7FA4" },
    announce: { comp: "AnnouncementScreen", tabbar: "fab", active: "msg", community: "\u793E\u7FA4" },
    subscribe: { comp: "SubscribeScreen", tabbar: "member", active: "member" },
    payment: { comp: "PaymentScreen", tabbar: "member", active: "member" },
    renewal: { comp: "RenewalScreen", tabbar: "member", active: "member" },
    points: { comp: "PointsScreen", tabbar: "member", active: "member" },
    coursePlay: { comp: "CoursePlaybackScreen", tabbar: "member", active: "member" },
    invite: { comp: "InviteScreen", tabbar: "member", active: "member" },
    community: { comp: "CommunityScreen", tabbar: "fab", active: "community", community: "\u793E\u7FA4" },
    settings: { comp: "SettingsScreen", tabbar: "fab", active: "me", community: "\u793E\u7FA4" },
    ticket: { comp: "TicketScreen", tabbar: "fab", active: "me", community: "\u793E\u7FA4" },
    msgDetail: { comp: "MessageDetailScreen" },
    memberCode: { comp: "MemberCodeScreen" },
    benefits: { comp: "BenefitsScreen" },
    benefitDetail: { comp: "BenefitDetailScreen" },
    aiBooking: { comp: "AIBookingScreen" },
    bookingSuccess: { comp: "BookingSuccessScreen" },
    addWechat: { comp: "AddWechatScreen" },
    groupQR: { comp: "GroupQRScreen" },
    refund: { comp: "RefundScreen" },
    refundResult: { comp: "RefundResultScreen" },
    ticketResult: { comp: "TicketResultScreen" },
    invitePoster: { comp: "InvitePosterScreen" },
    review: { comp: "ReviewScreen" },
    courseware: { comp: "CoursewareDownloadScreen" },
    accountSecurity: { comp: "AccountSecurityScreen" },
    notifications: { comp: "NotificationSettingsScreen" },
    privacy: { comp: "PrivacySettingsScreen" },
    orders: { comp: "OrderHistoryScreen" }
  };
  const PARENT_SCREENS = {
    register: "systems",
    success: "home",
    home: "systems",
    member: "home",
    payment: "subscribe",
    subscribe: "member",
    renewal: "member",
    points: "member",
    invite: "member",
    invitePoster: "invite",
    memberCode: "member",
    benefits: "member",
    benefitDetail: "benefits",
    training: "home",
    coursePlay: "training",
    courseware: "coursePlay",
    ai: "home",
    aiBooking: "benefitDetail",
    bookingSuccess: "aiBooking",
    community: "home",
    groupQR: "community",
    addWechat: "community",
    announce: "home",
    msgDetail: "announce",
    settings: "home",
    ticket: "settings",
    ticketResult: "ticket",
    review: "ticketResult",
    refund: "settings",
    refundResult: "refund",
    accountSecurity: "settings",
    notifications: "settings",
    privacy: "settings",
    orders: "settings"
  };
  const NAV_GROUPS = [
    { g: "\u7CFB\u7EDF\u65B9\u6848", items: [["systems", "00 \u4E09\u5957\u7CFB\u7EDF\u65B9\u6848"]] },
    { g: "\u5165\u4F1A\u5F00\u901A", items: [["register", "01 \u6CE8\u518C\u5165\u4F1A"], ["subscribe", "02 \u4F1A\u5458\u8BA2\u9605"], ["payment", "10 \u652F\u4ED8\u786E\u8BA4"], ["success", "04 \u5F00\u901A\u6210\u529F"]] },
    { g: "\u9996\u9875 / \u4F1A\u5458", items: [["home", "05 \u9996\u9875"], ["member", "03 \u4F1A\u5458\u5361"], ["memberCode", "21 \u51FA\u793A\u4F1A\u5458\u7801"], ["benefits", "22 \u5168\u90E8\u6743\u76CA"], ["benefitDetail", "26 \u6743\u76CA\u8BE6\u60C5"], ["points", "16 \u79EF\u5206\u660E\u7EC6"], ["renewal", "12 \u7EED\u8D39\u63D0\u9192"], ["settings", "11 \u8BBE\u7F6E\u4E2D\u5FC3"]] },
    { g: "\u793E\u7FA4 / \u6D88\u606F", items: [["community", "06 \u73ED\u7EA7\u793E\u7FA4"], ["groupQR", "20 \u5165\u7FA4\u4E8C\u7EF4\u7801"], ["addWechat", "19 \u6DFB\u52A0\u670D\u52A1\u5FAE\u4FE1"], ["announce", "09 \u516C\u544A\u4E2D\u5FC3"], ["msgDetail", "13 \u6D88\u606F\u8BE6\u60C5"], ["invite", "14 \u9080\u8BF7\u63A8\u8350"], ["invitePoster", "27 \u9080\u8BF7\u6D77\u62A5"]] },
    { g: "\u8BFE\u7A0B / AI \u8BCA\u65AD", items: [["training", "08 \u57F9\u8BAD\u670D\u52A1"], ["coursePlay", "17 \u8BFE\u7A0B\u56DE\u653E"], ["courseware", "29 \u8BFE\u4EF6\u4E0B\u8F7D"], ["ai", "07 AI \u8BCA\u65AD"], ["aiBooking", "23 AI \u8BCA\u65AD\u9884\u7EA6"], ["bookingSuccess", "25 \u9884\u7EA6\u6210\u529F"]] },
    { g: "\u670D\u52A1 / \u552E\u540E", items: [["ticket", "15 \u670D\u52A1\u5DE5\u5355"], ["ticketResult", "28 \u5DE5\u5355\u7ED3\u679C"], ["review", "24 \u670D\u52A1\u8BC4\u4EF7"], ["refund", "18 \u9000\u6B3E\u7533\u8BF7"], ["refundResult", "30 \u9000\u6B3E\u7ED3\u679C"], ["orders", "31 \u8BA2\u5355\u8BB0\u5F55"]] },
    { g: "\u8D26\u53F7\u8BBE\u7F6E", items: [["accountSecurity", "32 \u8D26\u53F7\u4E0E\u5B89\u5168"], ["notifications", "33 \u901A\u77E5\u63D0\u9192"], ["privacy", "34 \u9690\u79C1\u8BBE\u7F6E"]] }
  ];
  function FloatingNav({ current, onPick, theme, onThemeChange }) {
    const [open, setOpen] = React.useState(false);
    return /* @__PURE__ */ React.createElement("div", { className: "fnav" }, open && /* @__PURE__ */ React.createElement("div", { className: "fnav-panel" }, /* @__PURE__ */ React.createElement("div", { className: "fnav-head" }, "\u8DF3\u8F6C\u5230\u9875\u9762", /* @__PURE__ */ React.createElement("button", { type: "button", className: "fnav-close", onClick: () => setOpen(false), "aria-label": "\u5173\u95ED\u9875\u9762\u5BFC\u822A" }, "\xD7")), /* @__PURE__ */ React.createElement("div", { className: "fnav-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "fnav-theme" }, /* @__PURE__ */ React.createElement("div", { className: "fnav-grp-t" }, "\u89C6\u89C9\u7248\u672C"), /* @__PURE__ */ React.createElement("div", { className: "fnav-theme-options" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "fnav-theme-option" + (theme === "neon" ? " on" : ""), "aria-pressed": theme === "neon", onClick: () => onThemeChange("neon") }, /* @__PURE__ */ React.createElement(Icon, { name: "sparkle", size: 13, color: "currentColor" }), "\u7D2B\u8272\u9713\u8679"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "fnav-theme-option" + (theme === "dossier" ? " on" : ""), "aria-pressed": theme === "dossier", onClick: () => onThemeChange("dossier") }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 13, color: "currentColor" }), "\u519B\u5E08\u6863\u6848"))), NAV_GROUPS.map((grp) => /* @__PURE__ */ React.createElement("div", { key: grp.g, className: "fnav-grp" }, /* @__PURE__ */ React.createElement("div", { className: "fnav-grp-t" }, grp.g), /* @__PURE__ */ React.createElement("div", { className: "fnav-list" }, grp.items.map(([k, label]) => /* @__PURE__ */ React.createElement("button", { type: "button", key: k, className: "fnav-item" + (current === k ? " on" : ""), "aria-current": current === k ? "page" : void 0, onClick: () => {
      onPick(k);
      setOpen(false);
    } }, label))))))), /* @__PURE__ */ React.createElement("button", { className: "fnav-fab" + (open ? " open" : ""), onClick: () => setOpen(!open), "aria-label": "\u9875\u9762\u5BFC\u822A" }, open ? /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 22, color: "#fff" }) : /* @__PURE__ */ React.createElement(Icon, { name: "grid9", size: 22, color: "#fff" })));
  }
  function App() {
    const [screen, setScreen] = useState(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("screen") && SCREENS[params.get("screen")]) return params.get("screen");
      if (!localStorage.getItem("mrc_system_variants_seen")) return "systems";
      return localStorage.getItem("mrc_screen") || "systems";
    });
    const [theme, setTheme] = useState(() => localStorage.getItem("mrc_ui_theme") === "dossier" ? "dossier" : "neon");
    const historyRef = React.useRef([]);
    const normalizeScreen = (s) => {
      if (s === "create") return "aiBooking";
      if (s === "me") return "settings";
      if (s === "msg") return "announce";
      if (s === "memberhub") return "member";
      return SCREENS[s] ? s : null;
    };
    const syncUrl = (next, mode = "push") => {
      const url = new URL(window.location.href);
      url.searchParams.set("screen", next);
      window.history[mode === "replace" ? "replaceState" : "pushState"]({ screen: next }, "", url);
    };
    const goToScreen = (next, mode = "push") => {
      var _a;
      setScreen(next);
      syncUrl(next, mode);
      (_a = document.querySelector(".viewport")) == null ? void 0 : _a.scrollTo(0, 0);
    };
    const nav = (s) => {
      const next = normalizeScreen(s);
      if (!next || next === screen) return;
      historyRef.current = [...historyRef.current, screen].slice(-16);
      goToScreen(next, "push");
    };
    const goBack = () => {
      const previous = historyRef.current.pop() || PARENT_SCREENS[screen] || "home";
      const next = normalizeScreen(previous) || "home";
      if (next === screen) return;
      goToScreen(next, "replace");
    };
    useEffect(() => {
      const handlePopState = () => {
        var _a;
        const requested = new URLSearchParams(window.location.search).get("screen");
        const next = normalizeScreen(requested) || "home";
        setScreen(next);
        (_a = document.querySelector(".viewport")) == null ? void 0 : _a.scrollTo(0, 0);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }, []);
    useEffect(() => {
      localStorage.setItem("mrc_screen", screen);
      if (screen === "systems") localStorage.setItem("mrc_system_variants_seen", "1");
      const requested = new URLSearchParams(window.location.search).get("screen");
      if (requested !== screen) syncUrl(screen, "replace");
    }, [screen]);
    useEffect(() => {
      if (theme === "dossier") document.documentElement.setAttribute("data-ui-theme", "dossier");
      else document.documentElement.removeAttribute("data-ui-theme");
      localStorage.setItem("mrc_ui_theme", theme);
    }, [theme]);
    useEffect(() => {
      const cycleTheme = () => setTheme((value) => value === "neon" ? "dossier" : "neon");
      window.addEventListener("mrc:theme-cycle", cycleTheme);
      return () => window.removeEventListener("mrc:theme-cycle", cycleTheme);
    }, []);
    useEffect(() => {
      const goHome = () => nav("home");
      window.addEventListener("mrc:go-home", goHome);
      return () => window.removeEventListener("mrc:go-home", goHome);
    }, [screen]);
    const def = SCREENS[screen] || SCREENS.home;
    const Comp = window[def.comp];
    const canGoBack = screen !== "systems" && screen !== "home";
    window.__MRC_NAV__ = {
      current: screen,
      canBack: canGoBack,
      back: goBack
    };
    if (def.full) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, Comp ? /* @__PURE__ */ React.createElement(Comp, { nav, back: goBack, canBack: window.__MRC_NAV__.canBack }) : /* @__PURE__ */ React.createElement("div", { style: { padding: 40, color: "#fff" } }, "Loading\u2026"), /* @__PURE__ */ React.createElement(PrototypeActionHub, null));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "phone" }, /* @__PURE__ */ React.createElement(StatusBar, null), /* @__PURE__ */ React.createElement("div", { className: "viewport", key: screen }, Comp ? /* @__PURE__ */ React.createElement(Comp, { nav, back: goBack, canBack: window.__MRC_NAV__.canBack }) : /* @__PURE__ */ React.createElement("div", { style: { padding: 40, color: "#fff" } }, "Loading\u2026")), def.tabbar && /* @__PURE__ */ React.createElement(TabBar, { active: def.active, communityLabel: def.community || "\u793E\u7FA4", communityDot: def.dot, variant: def.tabbar, onNav: nav }), /* @__PURE__ */ React.createElement(FloatingNav, { current: screen, onPick: nav, theme, onThemeChange: setTheme }), /* @__PURE__ */ React.createElement(PrototypeActionHub, null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
