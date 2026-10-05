/* SettingsDetails.jsx — 设置中心子页面 */
function SettingsDetailHeader({ title, subtitle, icon }) {
  return (
    <>
      <AppHeader />
      <section className="card settings-detail-hero">
        <span className="settings-detail-hero-icon"><Icon name={icon} size={25} color="#e1c4ff" /></span>
        <div><h1>{title}</h1><p>{subtitle}</p></div>
      </section>
    </>
  );
}

function SettingToggleRow({ icon, title, desc, value, onChange }) {
  return (
    <div className="settings-control-row">
      <span className="set-ico"><Icon name={icon} size={20} color="#b996ff" /></span>
      <div className="settings-control-copy"><strong>{title}</strong><span>{desc}</span></div>
      <button type="button" className={"switch" + (value ? " on" : "")} aria-pressed={value} onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function AccountSecurityScreen({ nav }) {
  const [devices, setDevices] = React.useState(["iPhone 16 Pro Max · 当前设备", "MacBook Pro · 杭州"]);
  const removeDevice = (device) => {
    if (device.includes("当前设备")) return prototypeToast("当前设备不能移除", "error");
    setDevices((items) => items.filter((item) => item !== device));
    prototypeToast("设备已退出登录");
  };
  return (
    <div className="screen fade-in settings-detail-screen">
      <SettingsDetailHeader title="账号与安全" subtitle="管理登录方式、绑定信息与常用设备" icon="shield" />
      <section className="card settings-detail-card">
        <button type="button" className="settings-link-row" onClick={() => prototypeCopy("13888888888", "绑定手机号")}><Icon name="phone" size={20} color="#b996ff" /><span><strong>绑定手机号</strong><small>138 **** 8888</small></span><Icon name="chev" size={16} color="#66708b" /></button>
        <button type="button" className="settings-link-row" onClick={() => prototypeDialog({ title: "修改登录密码", body: "验证码将发送到绑定手机号 138 **** 8888。原型中不会真实发送短信。", confirmText: "模拟验证", onConfirm: () => prototypeToast("身份验证完成") })}><Icon name="lock" size={20} color="#b996ff" /><span><strong>登录密码</strong><small>建议每 90 天更新一次</small></span><Icon name="chev" size={16} color="#66708b" /></button>
        <button type="button" className="settings-link-row" onClick={() => nav("addWechat")}><Icon name="wechat" size={20} color="#5fd9a8" /><span><strong>微信账号</strong><small>已绑定当前微信</small></span><span className="tag green">已绑定</span></button>
      </section>
      <section className="card settings-detail-card">
        <div className="settings-detail-title">登录设备</div>
        {devices.map((device) => <div className="settings-device-row" key={device}><Icon name="phone" size={19} color="#91a7ff" /><span>{device}</span><button type="button" onClick={() => removeDevice(device)}>{device.includes("当前设备") ? "当前" : "退出"}</button></div>)}
      </section>
      <button type="button" className="cta-ghost settings-detail-action" onClick={() => prototypeDialog({ title: "注销账号", body: "注销会清除会员资料、权益记录和关系链信息。原型不会执行真实注销。", confirmText: "我知道了" })}>注销账号</button>
    </div>
  );
}

function NotificationSettingsScreen() {
  const [values, setValues] = React.useState({ service: true, course: true, activity: true, system: false, quiet: true });
  const set = (key) => (value) => setValues((state) => ({ ...state, [key]: value }));
  return (
    <div className="screen fade-in settings-detail-screen">
      <SettingsDetailHeader title="通知提醒" subtitle="按重要程度管理消息、课程与活动提醒" icon="bell" />
      <section className="card settings-detail-card">
        <SettingToggleRow icon="chat" title="服务消息" desc="服务老师回复、工单与诊断进度" value={values.service} onChange={set("service")} />
        <SettingToggleRow icon="cap" title="课程提醒" desc="直播开课、回放与学习任务" value={values.course} onChange={set("course")} />
        <SettingToggleRow icon="calendar" title="活动提醒" desc="闭门会、沙龙与班级活动" value={values.activity} onChange={set("activity")} />
        <SettingToggleRow icon="megaphone" title="系统公告" desc="产品更新与权益调整" value={values.system} onChange={set("system")} />
      </section>
      <section className="card settings-detail-card"><SettingToggleRow icon="clock" title="夜间免打扰" desc="22:00 - 次日 08:00 仅保留紧急服务消息" value={values.quiet} onChange={set("quiet")} /></section>
      <button type="button" className="cta-primary settings-detail-action" onClick={() => prototypeToast("通知设置已保存")}>保存设置</button>
    </div>
  );
}

function PrivacySettingsScreen() {
  const [values, setValues] = React.useState({ profile: true, activity: false, ai: true, recommend: true });
  const set = (key) => (value) => setValues((state) => ({ ...state, [key]: value }));
  return (
    <div className="screen fade-in settings-detail-screen">
      <SettingsDetailHeader title="隐私设置" subtitle="控制资料展示、数据授权与个性化服务" icon="lock" />
      <section className="card settings-detail-card">
        <SettingToggleRow icon="contacts" title="展示会员档案" desc="允许同班成员查看公开身份信息" value={values.profile} onChange={set("profile")} />
        <SettingToggleRow icon="calendar" title="展示活动记录" desc="在会员档案中显示参与过的活动" value={values.activity} onChange={set("activity")} />
        <SettingToggleRow icon="aitext" title="AI 诊断数据授权" desc="使用社群与运营数据生成诊断建议" value={values.ai} onChange={set("ai")} />
        <SettingToggleRow icon="sparkle" title="个性化推荐" desc="根据学习和权益使用记录推荐内容" value={values.recommend} onChange={set("recommend")} />
      </section>
      <section className="card settings-detail-card">
        <button type="button" className="settings-link-row" onClick={() => prototypeDialog({ title: "个人信息清单", body: "当前保存：手机号、会员档案、订单记录、学习进度、服务记录与诊断授权。" })}><Icon name="doc" size={20} color="#b996ff" /><span><strong>个人信息清单</strong><small>查看平台保存的数据类型</small></span><Icon name="chev" size={16} color="#66708b" /></button>
        <button type="button" className="settings-link-row" onClick={() => prototypeToast("缓存已清理") }><Icon name="refresh" size={20} color="#b996ff" /><span><strong>清理本地缓存</strong><small>当前占用 18.6 MB</small></span><Icon name="chev" size={16} color="#66708b" /></button>
      </section>
      <button type="button" className="cta-primary settings-detail-action" onClick={() => prototypeToast("隐私设置已保存")}>保存设置</button>
    </div>
  );
}

function OrderHistoryScreen({ nav }) {
  const orders = [
    { id: "TK2505160001", title: "PRO 年度会员", price: "¥2,999.00", time: "2025.05.16 10:23", status: "已支付" },
    { id: "TK2406050028", title: "主理人成长训练营", price: "¥699.00", time: "2024.06.05 19:48", status: "已完成" },
  ];
  return (
    <div className="screen fade-in settings-detail-screen">
      <SettingsDetailHeader title="发票与订单" subtitle="查看支付凭证、申请发票与管理售后" icon="receipt" />
      <section className="settings-order-list">
        {orders.map((order, index) => (
          <article className="card settings-order-card" key={order.id}>
            <div className="row-between"><span className="tag green">{order.status}</span><button type="button" className="icon-plain-button" onClick={() => prototypeCopy(order.id, "订单编号")}><Icon name="copy" size={14} color="#8992ac" /></button></div>
            <h2>{order.title}</h2><p>{order.time}</p>
            <div className="settings-order-foot"><strong className="num">{order.price}</strong><button type="button" onClick={() => prototypeDialog({ title: "电子发票", body: `${order.title}可申请增值税电子普通发票，开票信息确认后将在 1 个工作日内发送。`, confirmText: "模拟申请", onConfirm: () => prototypeToast("发票申请已提交") })}>申请发票</button>{index === 0 && <button type="button" onClick={() => nav("refund")}>申请售后</button>}</div>
          </article>
        ))}
      </section>
      <div className="settings-detail-tip"><Icon name="shield" size={14} color="#7180a0" />订单与支付记录仅本人可见</div>
    </div>
  );
}

Object.assign(window, { AccountSecurityScreen, NotificationSettingsScreen, PrivacySettingsScreen, OrderHistoryScreen });
