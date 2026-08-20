/* app.jsx — phone shell + screen router */
const { useState, useEffect } = React;

const SCREENS = {
  systems:        { comp: "SystemVariantsScreen", full: true },
  register:       { comp: "RegisterScreen" },
  success:        { comp: "SuccessScreen" },
  home:           { comp: "HomeScreen",        tabbar: "fab", active: "home", community: "成员" },
  member:         { comp: "MemberCardScreen" },
  training:       { comp: "TrainingScreen",    tabbar: "fab", active: "home", community: "社群", dot: true },
  ai:             { comp: "AIDiagnosisScreen", tabbar: "fab", active: "home", community: "社群" },
  announce:       { comp: "AnnouncementScreen",tabbar: "fab", active: "msg",  community: "社群" },
  subscribe:      { comp: "SubscribeScreen",   tabbar: "member", active: "member" },
  payment:        { comp: "PaymentScreen",     tabbar: "member", active: "member" },
  renewal:        { comp: "RenewalScreen",     tabbar: "member", active: "member" },
  points:         { comp: "PointsScreen",      tabbar: "member", active: "member" },
  coursePlay:     { comp: "CoursePlaybackScreen", tabbar: "member", active: "member" },
  invite:         { comp: "InviteScreen",      tabbar: "member", active: "member" },
  community:      { comp: "CommunityScreen",   tabbar: "fab", active: "community", community: "社群" },
  settings:       { comp: "SettingsScreen",    tabbar: "fab", active: "me",  community: "社群" },
  ticket:         { comp: "TicketScreen",      tabbar: "fab", active: "me",  community: "社群" },
  msgDetail:      { comp: "MessageDetailScreen" },
  memberCode:     { comp: "MemberCodeScreen" },
  benefits:       { comp: "BenefitsScreen" },
  benefitDetail:  { comp: "BenefitDetailScreen" },
  aiBooking:      { comp: "AIBookingScreen" },
  bookingSuccess: { comp: "BookingSuccessScreen" },
  addWechat:      { comp: "AddWechatScreen" },
  groupQR:        { comp: "GroupQRScreen" },
  refund:         { comp: "RefundScreen" },
  refundResult:   { comp: "RefundResultScreen" },
  ticketResult:   { comp: "TicketResultScreen" },
  invitePoster:   { comp: "InvitePosterScreen" },
  review:         { comp: "ReviewScreen" },
  courseware:     { comp: "CoursewareDownloadScreen" },
  accountSecurity:{ comp: "AccountSecurityScreen" },
  notifications:  { comp: "NotificationSettingsScreen" },
  privacy:        { comp: "PrivacySettingsScreen" },
  orders:         { comp: "OrderHistoryScreen" },
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
  orders: "settings",
};

const NAV_GROUPS = [
  { g: "系统方案", items: [["systems", "00 三套系统方案"]] },
  { g: "入会开通", items: [["register", "01 注册入会"], ["subscribe", "02 会员订阅"], ["payment", "10 支付确认"], ["success", "04 开通成功"]] },
  { g: "首页 / 会员", items: [["home", "05 首页"], ["member", "03 会员卡"], ["memberCode", "21 出示会员码"], ["benefits", "22 全部权益"], ["benefitDetail", "26 权益详情"], ["points", "16 积分明细"], ["renewal", "12 续费提醒"], ["settings", "11 设置中心"]] },
  { g: "社群 / 消息", items: [["community", "06 班级社群"], ["groupQR", "20 入群二维码"], ["addWechat", "19 添加服务微信"], ["announce", "09 公告中心"], ["msgDetail", "13 消息详情"], ["invite", "14 邀请推荐"], ["invitePoster", "27 邀请海报"]] },
  { g: "课程 / AI 诊断", items: [["training", "08 培训服务"], ["coursePlay", "17 课程回放"], ["courseware", "29 课件下载"], ["ai", "07 AI 诊断"], ["aiBooking", "23 AI 诊断预约"], ["bookingSuccess", "25 预约成功"]] },
  { g: "服务 / 售后", items: [["ticket", "15 服务工单"], ["ticketResult", "28 工单结果"], ["review", "24 服务评价"], ["refund", "18 退款申请"], ["refundResult", "30 退款结果"], ["orders", "31 订单记录"]] },
  { g: "账号设置", items: [["accountSecurity", "32 账号与安全"], ["notifications", "33 通知提醒"], ["privacy", "34 隐私设置"]] },
];

function FloatingNav({ current, onPick, theme, onThemeChange, enabled = false }) {
  const [open, setOpen] = React.useState(false);
  if (!enabled) return null;
  return (
    <div className="fnav">
      {open && (
        <div className="fnav-panel">
          <div className="fnav-head">跳转到页面<button type="button" className="fnav-close" onClick={() => setOpen(false)} aria-label="关闭页面导航">×</button></div>
          <div className="fnav-scroll">
            <div className="fnav-theme">
              <div className="fnav-grp-t">视觉版本</div>
              <div className="fnav-theme-options">
                <button type="button" className={"fnav-theme-option" + (theme === "neon" ? " on" : "")} aria-pressed={theme === "neon"} onClick={() => onThemeChange("neon")}><Icon name="sparkle" size={13} color="currentColor" />紫色霓虹</button>
                <button type="button" className={"fnav-theme-option" + (theme === "dossier" ? " on" : "")} aria-pressed={theme === "dossier"} onClick={() => onThemeChange("dossier")}><Icon name="shield" size={13} color="currentColor" />军师档案</button>
              </div>
            </div>
            {NAV_GROUPS.map((grp) => (
              <div key={grp.g} className="fnav-grp">
                <div className="fnav-grp-t">{grp.g}</div>
                <div className="fnav-list">
                  {grp.items.map(([k, label]) => (
                    <button type="button" key={k} className={"fnav-item" + (current === k ? " on" : "")} aria-current={current === k ? "page" : undefined} onClick={() => { onPick(k); setOpen(false); }}>{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className={"fnav-fab" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-label="页面导航">
        {open ? <Icon name="more" size={22} color="#fff" /> : <Icon name="grid9" size={22} color="#fff" />}
      </button>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("screen") && SCREENS[params.get("screen")]) return params.get("screen");
    if (!localStorage.getItem("mrc_system_variants_seen")) return "systems";
    return localStorage.getItem("mrc_screen") || "systems";
  });
  const [theme, setTheme] = useState("lime");
  const prototypeMode = new URLSearchParams(window.location.search).get("prototype") === "1";
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
    setScreen(next);
    syncUrl(next, mode);
    document.querySelector(".viewport")?.scrollTo(0, 0);
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
      const requested = new URLSearchParams(window.location.search).get("screen");
      const next = normalizeScreen(requested) || "home";
      setScreen(next);
      document.querySelector(".viewport")?.scrollTo(0, 0);
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
    document.documentElement.setAttribute("data-ui-theme", "lime");
    localStorage.setItem("mrc_ui_theme", theme);
  }, [theme]);
  useEffect(() => {
    const cycleTheme = () => setTheme("lime");
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
    back: goBack,
  };

  if (def.full) {
    return (
      <>
        {Comp ? <Comp nav={nav} back={goBack} canBack={window.__MRC_NAV__.canBack} /> : <div style={{ padding: 40, color: "#fff" }}>Loading…</div>}
        <PrototypeActionHub />
      </>
    );
  }

  return (
    <div className="phone">
      <StatusBar />
      <div className="viewport" key={screen}>
        {Comp ? <Comp nav={nav} back={goBack} canBack={window.__MRC_NAV__.canBack} /> : <div style={{ padding: 40, color: "#fff" }}>Loading…</div>}
      </div>
      {def.tabbar && (
        <TabBar active={def.active} communityLabel={def.community || "社群"} communityDot={def.dot} variant={def.tabbar} onNav={nav} />
      )}
      <FloatingNav current={screen} onPick={nav} theme={theme} onThemeChange={setTheme} enabled={prototypeMode} />
      <PrototypeActionHub />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
