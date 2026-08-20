/* Settings.jsx — 我的：会员资料 + 我的社群 + 设置服务 */
function SettingsScreen({ nav }) {
  const members = [
    { name: "Shirley", src: "assets/member-shirley-avatar.png", me: true },
    { name: "Amy", src: "assets/member-amy-avatar.png" },
    { name: "Jessica", src: "assets/member-jessica-avatar.png" },
    { name: "Victoria", src: "assets/member-victoria-avatar.png" },
  ];
  const settings = [
    { icon: "shield", label: "账号与安全", to: "accountSecurity", color: "#709a12" },
    { icon: "bell", label: "通知提醒", to: "notifications", color: "#709a12" },
    { icon: "receipt", label: "订单记录", to: "orders", color: "#709a12" },
    { icon: "info", label: "帮助反馈", to: "ticket", color: "#709a12" },
  ];

  return (
    <div className="screen has-tabbar fade-in settings-screen my-community-screen" style={{ paddingTop: 2 }}>
      <AppHeader />

      <section className="card my-profile-card">
        <div className="my-profile-main">
          <Avatar size={58} initial="S" src="assets/member-shirley-avatar.png" ring={true} />
          <div className="my-profile-copy">
            <div className="my-profile-name">Shirley <Icon name="shield" size={15} color="#709a12" /></div>
            <span className="my-role">联合创始人</span>
            <div className="my-profile-meta"><Icon name="crown" size={13} color="#709a12" /> PRO 精英会员 · 有效期至 2025.06.05</div>
          </div>
          <img className="my-profile-a1-icon" src="assets/groupqr-a1-crystal.png" alt="A1 班级晶体" />
        </div>
        <div className="my-profile-stats">
          <button type="button" onClick={() => nav("points")}><strong className="num">12,890</strong><span>成长积分</span></button>
          <button type="button" onClick={() => nav("benefits")}><strong>18 项</strong><span>可用权益</span></button>
          <button type="button" onClick={() => nav("member")}><strong>LV.3</strong><span>会员等级</span></button>
        </div>
        <div className="my-class-actions my-profile-actions">
          <button type="button" className="my-class-enter" onClick={() => nav("community")}><Icon name="chat" size={17} color="#fff" /><span className="my-action-copy"><strong>进入班级</strong><b>华东增长班 A1</b></span><Icon name="arrow" size={14} color="#fff" /></button>
          <button type="button" className="my-class-service" onClick={() => nav("addWechat")}><Avatar size={24} initial="林" src="assets/addwechat-teacher-portrait.png" /><span className="my-action-copy"><strong>服务老师</strong><b>LIN_GROWTH_PRO</b></span></button>
        </div>
      </section>

      <section className="card my-relationship-card section-gap">
        <div className="my-card-head"><div><Icon name="link" size={17} color="#709a12" /> 班级关系链</div><button type="button" onClick={() => nav("community")}>全部成员 <Icon name="chev" size={13} color="#8a9580" /></button></div>
        <div className="my-member-row">
          {members.map((member) => <div key={member.name} className="my-member"><Avatar size={35} initial={member.name[0]} src={member.src} ring={member.me} /><span>{member.name}</span>{member.me && <em>我</em>}</div>)}
          <button type="button" className="my-member-more" onClick={() => nav("community")}><Icon name="more" size={17} color="#a8a0cb" /><span>更多</span></button>
        </div>
      </section>

      <section className="card my-today-card section-gap">
        <div className="my-card-head"><div><Icon name="star2" size={17} color="#709a12" /> 今日成长任务</div><button type="button" onClick={() => nav("training")}>查看任务 <Icon name="chev" size={13} color="#8a9580" /></button></div>
        <button type="button" className="my-task-row" onClick={() => nav("coursePlay")}><span><Icon name="star2" size={15} color="#709a12" /></span><div><strong>学习《社群增长方法论》第 2 课</strong><small>课程学习 · 30 分钟</small></div><em>进行中</em></button>
        <button type="button" className="my-task-row" onClick={() => prototypeToast("今日打卡已完成")}><span><Icon name="edit" size={15} color="#709a12" /></span><div><strong>完成今日打卡</strong><small>每日成长 · 1/1 次</small></div><em className="done">已完成</em></button>
      </section>

      <section className="my-settings-grid section-gap">
        {settings.map((item) => <button type="button" className="card my-setting-item" key={item.label} onClick={() => nav(item.to)}><Icon name={item.icon} size={19} color={item.color} /><span>{item.label}</span><Icon name="chev" size={12} color="#707a9d" /></button>)}
      </section>

      <section className="card my-service-card section-gap">
        <Avatar size={34} initial="林" src="assets/addwechat-teacher-portrait.png" />
        <div><strong>林老师 · 专属服务老师</strong><span>社群运营、课程陪跑与 AI 诊断协同</span></div>
        <button type="button" onClick={() => nav("addWechat")}>联系</button>
      </section>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
