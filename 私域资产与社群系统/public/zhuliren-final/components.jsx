/* ============================================================
   components.jsx — shared chrome + icon set
   ============================================================ */

function prototypeToast(message, tone = "success") {
  window.dispatchEvent(new CustomEvent("mrc:toast", { detail: { message, tone } }));
}

function prototypeDialog({ title, body, confirmText = "知道了", onConfirm = null }) {
  window.dispatchEvent(new CustomEvent("mrc:dialog", {
    detail: { title, body, confirmText, onConfirm },
  }));
}

async function prototypeCopy(text, label = "内容") {
  try {
    await navigator.clipboard.writeText(text);
    prototypeToast(`${label}已复制`);
  } catch (error) {
    prototypeDialog({ title: "复制内容", body: text, confirmText: "关闭" });
  }
}

function PrototypeActionHub() {
  const [toast, setToast] = React.useState(null);
  const [dialog, setDialog] = React.useState(null);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    const showToast = (event) => {
      window.clearTimeout(timerRef.current);
      setToast(event.detail);
      timerRef.current = window.setTimeout(() => setToast(null), 1800);
    };
    const showDialog = (event) => setDialog(event.detail);
    window.addEventListener("mrc:toast", showToast);
    window.addEventListener("mrc:dialog", showDialog);
    return () => {
      window.clearTimeout(timerRef.current);
      window.removeEventListener("mrc:toast", showToast);
      window.removeEventListener("mrc:dialog", showDialog);
    };
  }, []);

  const confirmDialog = () => {
    const action = dialog?.onConfirm;
    setDialog(null);
    if (typeof action === "function") action();
  };

  return (
    <>
      {toast && <div className={"prototype-toast " + (toast.tone || "success")} role="status">{toast.message}</div>}
      {dialog && (
        <div className="prototype-dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>
          <div className="prototype-dialog" role="dialog" aria-modal="true" aria-labelledby="prototype-dialog-title" onClick={(event) => event.stopPropagation()}>
            <div className="prototype-dialog-icon"><Icon name="sparkle" size={21} color="#f0c1ff" /></div>
            <div id="prototype-dialog-title" className="prototype-dialog-title">{dialog.title}</div>
            <div className="prototype-dialog-body">{dialog.body}</div>
            <button type="button" className="prototype-dialog-button" onClick={confirmDialog}>{dialog.confirmText}</button>
          </div>
        </div>
      )}
    </>
  );
}

// ---- iOS status bar ----
function StatusBar() {
  return (
    <div className="statusbar">
      <span className="time">9:41</span>
      <span className="sb-right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M8.5 2.5c2.6 0 5 1 6.8 2.7M8.5 6c1.6 0 3.1.6 4.2 1.7M3.5 5.2C4.9 3.8 6.6 3 8.5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8.5" cy="9.7" r="1.3" fill="#fff"/></svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#fff" opacity="0.5"/><rect x="2" y="2" width="19" height="9" rx="2" fill="#fff"/><rect x="24" y="4" width="2" height="5" rx="1" fill="#fff" opacity="0.6"/></svg>
      </span>
    </div>
  );
}

// ---- WeChat capsule (··· | ⊙) ----
function WxCapsule({ showBack, onBack }) {
  return (
    <div className="wx-capsule">
      <div className="dot-row"><i/><i/><i/></div>
      <div className="divider" />
      <div className="circle" />
    </div>
  );
}

function AppBackButton({ onBack = null }) {
  const navBack = onBack || (typeof window !== "undefined" && window.__MRC_NAV__?.back);
  if (!navBack) return null;
  return (
    <button className="app-back" type="button" onClick={navBack} aria-label="返回上一级">
      <Icon name="chev" size={18} color="#e8ddff" />
    </button>
  );
}

// ---- App header: back · logo · brand · (pro) · capsule ----
function AppHeader({ pro = true, gem = false, capsule = true, scan = false, logo = true, logoSrc = null, big = false, back = null, showBack = "auto", sub = true }) {
  const navBack = back || (typeof window !== "undefined" && window.__MRC_NAV__?.back);
  const canBack = showBack === "auto"
    ? !!(typeof window !== "undefined" && window.__MRC_NAV__?.canBack)
    : !!showBack;
  return (
    <div className="app-head">
      {canBack && navBack && <AppBackButton onBack={navBack} />}
      {logo && <button type="button" className="app-logo app-home" onClick={() => window.dispatchEvent(new CustomEvent("mrc:go-home"))} aria-label="返回首页" title="返回首页">{logoSrc ? <img src={logoSrc} alt="主理人公社" /> : <Icon name="sparkle" size={21} color="#101509" />}</button>}
      <div className="brand">
        <div className="row1">
          <span className={"name" + (big ? " name-big" : "")}>主理人公社</span>
          {pro && <span className="badge-pro">PRO</span>}
          {gem && <button type="button" className="gem-mini theme-cycle" onClick={() => window.dispatchEvent(new CustomEvent("mrc:theme-cycle"))} aria-label="当前为白底黄绿主题" title="白底黄绿主题"><Icon name="sparkle" size={14} color="#709a12" /></button>}
        </div>
        {sub && <div className="sub">连接主理人 · 共创新商业</div>}
      </div>
      {scan
        ? <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="cap-btn"><Icon name="scan" size={20} color="#cfd6ea" /></div>
            <div className="cap-btn"><Icon name="more" size={20} color="#cfd6ea" /></div>
          </div>
        : capsule && <WxCapsule />}
    </div>
  );
}

// ---- faux QR code ----
function QrCode({ size = 96 }) {
  const cells = 11;
  const seed = "1011010011100101101001011100110100101101110100101011010011100101101";
  const rows = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const on = seed[(y * cells + x) % seed.length] === "1";
      const finder = (x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4);
      if (on || finder) rows.push(<rect key={x + "_" + y} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <div style={{ background: "#fff", padding: 6, borderRadius: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} fill="#0a0a12" shapeRendering="crispEdges">
        {rows}
        <g fill="none" stroke="#0a0a12" strokeWidth="0.6">
          <rect x="0.3" y="0.3" width="2.4" height="2.4" /><rect x={cells - 2.7} y="0.3" width="2.4" height="2.4" /><rect x="0.3" y={cells - 2.7} width="2.4" height="2.4" />
        </g>
      </svg>
    </div>
  );
}

// ---- photo avatar ----
const AVATAR_PHOTOS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80",
];

function avatarPhotoFor(initial = "", hue = 0) {
  const key = String(initial || "");
  const charSum = [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const index = Math.abs(Math.round((Number(hue) || 0) / 40) + charSum) % AVATAR_PHOTOS.length;
  return AVATAR_PHOTOS[index];
}

function Avatar({ size = 44, initial = "", ring = false, hue = 0, src = null }) {
  const photo = src || avatarPhotoFor(initial, hue);
  return (
    <div className={"avatar photo-avatar" + (ring ? " ring" : "")} style={{ width: size, height: size }}>
      <img src={photo} alt={initial ? `${initial} avatar` : "avatar"} loading="lazy" />
    </div>
  );
}

// ---- bottom tab bar ----
function TabBar({ active = "home", communityLabel = "社群", communityDot = false, variant = "fab", onNav }) {
  const go = (k) => onNav && onNav(k);
  return (
    <nav className="tabbar">
      <button type="button" className={"tab" + (active === "msg" ? " active" : "")} onClick={() => go("msg")} aria-label="消息">
        <Icon name="chat" size={24} />
        <span>消息</span>
        <span className="badge-num">12</span>
      </button>
      <button type="button" className={"tab" + (active === "community" ? " active" : "")} onClick={() => go("community")} aria-label={communityLabel}>
        <Icon name={communityLabel === "成员" ? "members" : "community"} size={24} />
        <span>{communityLabel}</span>
        {communityDot && <i className="dot-new" />}
      </button>
      {variant === "member"
        ? <button type="button" className={"tab tab-member" + (active === "member" ? " active" : "")} onClick={() => go("memberhub")} aria-label="会员">
            <Icon name="gem" size={24} />
            <span>会员</span>
          </button>
        : <button type="button" className="tab-fab" onClick={() => go("create")} aria-label="预约 AI 诊断"><Icon name="plus" size={26} /></button>}
      <button type="button" className={"tab" + (active === "home" ? " active" : "")} onClick={() => go("home")} aria-label="首页">
        <Icon name="home" size={24} />
        <span>首页</span>
      </button>
      <button type="button" className={"tab" + (active === "me" ? " active" : "")} onClick={() => go("me")} aria-label="我的">
        <Icon name="user" size={24} />
        <span>我的</span>
      </button>
    </nav>
  );
}

// ---- carousel dots ----
function Dots({ n = 3, on = 0 }) {
  return <div className="dots">{[...Array(n)].map((_, i) => <i key={i} className={i === on ? "on" : ""} />)}</div>;
}

// ============================================================
//  Icon set — 1.6 stroke, 24×24, rounded
// ============================================================
function Icon({ name, size = 24, color = "currentColor", strokeWidth = 1.7 }) {
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const f = { fill: color };
  const paths = {
    phone: <g {...p}><rect x="7" y="3" width="10" height="18" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></g>,
    user: <g {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></g>,
    pin: <g {...p}><path d="M12 21c4-4.5 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 3 6.5 7 11Z"/><circle cx="12" cy="10" r="2.5"/></g>,
    link: <g {...p}><path d="M9.5 14.5l5-5"/><path d="M8 12l-2 2a3.5 3.5 0 0 0 5 5l2-2"/><path d="M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2"/></g>,
    grid: <g {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></g>,
    chev: <g {...p}><path d="M9 6l6 6-6 6"/></g>,
    arrow: <g {...p}><path d="M5 12h14M13 6l6 6-6 6"/></g>,
    search: <g {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></g>,
    sparkle: <g {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></g>,
    info: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>,
    shield: <g {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></g>,
    crown: <g {...p}><path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z"/></g>,
    scan: <g {...p}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/></g>,
    more: <g {...f}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></g>,
    folder: <g {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></g>,
    cap: <g {...p}><path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v5c0 1 2.2 2 5 2s5-1 5-2v-5"/></g>,
    lock: <g {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>,
    members: <g {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 14.5c2.4.5 4 2.3 4 5.5"/></g>,
    chart: <g {...p}><path d="M4 19V5M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/></g>,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></g>,
    megaphone: <g {...p}><path d="M4 10v4l11 4V6zM4 10H3v4h1M15 8a4 4 0 0 1 0 8"/></g>,
    calendar: <g {...p}><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M9 3v4M15 3v4"/></g>,
    star2: <g {...p}><path d="M12 4l2.4 5 5.6.6-4.2 3.7 1.2 5.4L12 16l-5 2.7 1.2-5.4L4 9.6 9.6 9z"/></g>,
    chat: <g {...p}><path d="M4 5h16v11H8l-4 4z"/><circle cx="9" cy="10.5" r="1" fill={color} stroke="none"/><circle cx="15" cy="10.5" r="1" fill={color} stroke="none"/></g>,
    home: <g {...p}><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/></g>,
    community: <g {...p}><circle cx="12" cy="9" r="2.5"/><path d="M7 19a5 5 0 0 1 10 0"/><circle cx="12" cy="12" r="9"/></g>,
    plus: <g {...p} strokeWidth="2.4"><path d="M12 6v12M6 12h12"/></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></g>,
    alarm: <g {...p}><circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5M5 4L2 7M19 4l3 3M9 21l-1 2M15 21l1 2"/></g>,
    refresh: <g {...p}><path d="M20 11a8 8 0 0 0-14-4M4 5v3h3"/><path d="M4 13a8 8 0 0 0 14 4M20 19v-3h-3"/></g>,
    edit: <g {...p}><path d="M14 5l5 5M4 20l1-4L17 4l3 3L8 19z"/></g>,
    target: <g {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></g>,
    wechat: <g {...p}><path d="M9 4C5.1 4 2 6.7 2 10c0 1.9 1 3.5 2.6 4.6L4 17l2.7-1.3c.7.2 1.5.3 2.3.3M16 8c-3.3 0-6 2.2-6 5s2.7 5 6 5c.7 0 1.4-.1 2-.3L22 19l-.6-2c1-.8 1.6-2 1.6-3.2 0-2.8-2.7-5-6-5Z"/></g>,
    award: <g {...p}><circle cx="12" cy="9" r="5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/></g>,
    card: <g {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h4"/></g>,
    qr: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2M20 14v6M14 20h6" strokeWidth="1.6"/></g>,
    gem: <g {...p}><path d="M5 9l3-4h8l3 4-7 11z"/><path d="M5 9h14M9 5l-1 4 4 11 4-11-1-4"/></g>,
    gemlogo: <g><path d="M5 9l3-4h8l3 4-7 11z" fill="url(#gl_g)" stroke="#c9a6ff" strokeWidth="1.2"/><path d="M5 9h14M9 5l-1 4 4 11 4-11-1-4" stroke="#e9d4ff" strokeWidth="1" fill="none" opacity="0.7"/><defs><linearGradient id="gl_g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a45cff"/><stop offset="100%" stopColor="#3a6bff"/></linearGradient></defs></g>,
    contacts: <g {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 16c0-2 1.8-3 4-3s4 1 4 3"/></g>,
    warn: <g {...p}><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></g>,
    ribbon: <g {...p}><path d="M5 4c0 5 2 8 7 8s7-3 7-8"/></g>,
    headset: <g {...p}><path d="M5 13a7 7 0 0 1 14 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19a3 3 0 0 1-3 3h-2"/></g>,
    download: <g {...p}><path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/></g>,
    copy: <g {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/></g>,
    doc: <g {...p}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></g>,
    play: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill={color} stroke="none"/></g>,
    handshake: <g {...p}><path d="M3 12l4-4 5 3 5-3 4 4-5 6-4-3-4 3z"/></g>,
    xcircle: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></g>,
    bookmark: <g {...p}><path d="M6 4h12v16l-6-4-6 4z"/></g>,
    funnel: <g {...p}><path d="M4 5h16l-6 7v6l-4 2v-8z"/></g>,
    pulse: <g {...p}><path d="M3 12h4l2-6 4 12 2-6h6"/></g>,
    book: <g {...p}><path d="M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2z"/></g>,
    cloud: <g {...p}><path d="M7 17a4 4 0 0 1-.5-8 5 5 0 0 1 9.6 1.2A3.5 3.5 0 0 1 16 17z"/><path d="M12 11v5M9.5 13.5L12 16l2.5-2.5"/></g>,
    yrefund: <g {...p}><path d="M5 9a8 8 0 0 1 14-2M19 5v3h-3"/><path d="M19 15a8 8 0 0 1-14 2M5 19v-3h3"/><path d="M12 9v6M9.5 10h5M9.5 12.5h5"/></g>,
    receipt: <g {...p}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M8 8h8M8 12h8"/></g>,
    grid9: <g {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16M15 4v16M4 9h16M4 15h16"/></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>{paths[name] || null}</svg>;
}

Object.assign(window, { StatusBar, WxCapsule, AppBackButton, AppHeader, Avatar, TabBar, Dots, Icon, QrCode });
