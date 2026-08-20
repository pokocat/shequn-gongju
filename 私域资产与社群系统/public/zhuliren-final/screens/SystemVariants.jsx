/* SystemVariants.jsx — 三套系统方案切换预览 */
function SystemVariantsScreen({ nav }) {
  const [active, setActive] = React.useState("growth");

  const concepts = {
    growth: {
      eyebrow: "方案一",
      title: "增长操作系统",
      line: "把小程序和 PC 后台统一成一套增长运营驾驶舱。",
      tone: "growth",
      tags: ["今日待办", "增长洞察", "工单流转", "城市分站"],
      mobile: {
        hello: "早上好，林小北",
        lead: "你有 7 项待办，3 个重要提醒",
        hero: "会员增长进度",
        heroMeta: "本月新增 128 人 · 较上月 +32.6%",
        action: "查看增长建议",
        tiles: [
          ["新会员待跟进", "3", "receipt"],
          ["待处理工单", "2", "card"],
          ["课程待发布", "1", "calendar"],
          ["内容待推送", "1", "megaphone"],
        ],
        listTitle: "AI 增长洞察",
        list: ["深圳区域增长势头强劲", "建议补充高转化课程内容", "3 位会员已触达服务时效"],
      },
      pc: {
        nav: ["运营驾驶舱", "会员管理", "班级管理", "订单管理", "工单管理", "AI 洞察"],
        kpis: [
          ["新增会员", "128", "+45.3%"],
          ["活跃会员", "1,326", "+12.6%"],
          ["订单金额", "¥68,560", "+23.5%"],
          ["工单处理率", "92.1%", "+6.3%"],
        ],
        mainTitle: "会员增长趋势",
        sideTitle: "关系链图谱",
        tasks: ["会员问题 · 无法查看课程内容", "支付问题 · 订单状态未同步", "课程问题 · 直播入口异常"],
      },
    },
    network: {
      eyebrow: "方案二",
      title: "资源交换网络",
      line: "让推荐人、服务老师、区域主理人和资源价值流动起来。",
      tone: "network",
      tags: ["关系链", "资源对接", "收益变现", "服务交接"],
      mobile: {
        hello: "林晓晚",
        lead: "品牌主理人 · 年度会员",
        hero: "本月可变现状态",
        heroMeta: "预计收益 ¥28,560 · 已开启",
        action: "查看收益明细",
        tiles: [
          ["资源对接", "8", "handshake"],
          ["导师咨询", "11", "headset"],
          ["社群链接", "6", "members"],
          ["品牌曝光", "4", "sparkle"],
        ],
        listTitle: "我的关系链",
        list: ["推荐人周航已转介绍 2 位", "服务老师张雪待交接资源", "华东区主理人可协同活动"],
      },
      pc: {
        nav: ["工作台", "关系网络", "成员管理", "区域管理", "资源库", "服务交接"],
        kpis: [
          ["区域分支", "23", "+2"],
          ["收入", "¥126,560", "+12.6%"],
          ["订单数", "89", "+18"],
          ["转化率", "32.6%", "+4.2%"],
        ],
        mainTitle: "关系网络图",
        sideTitle: "服务交接队列",
        tasks: ["品牌定位咨询 · 张琦转陈墨", "商业计划书优化 · 周航转张琦", "供应链资源对接 · 陈墨转资源库"],
      },
    },
    mentor: {
      eyebrow: "方案三",
      title: "AI 陪跑中枢",
      line: "把 AI 诊断、每日任务和人工服务协同成一条成长路径。",
      tone: "mentor",
      tags: ["AI 诊断", "任务驱动", "服务协同", "自动化运营"],
      mobile: {
        hello: "你好，林小北",
        lead: "AI 健康成长分 86 · 良好",
        hero: "今日成长任务",
        heroMeta: "优化主页信息 · 预计获得 20 成长值",
        action: "开始今日任务",
        tiles: [
          ["AI 诊断", "86", "pulse"],
          ["今日任务", "4", "check"],
          ["服务提醒", "3", "bell"],
          ["会员升级", "1", "crown"],
        ],
        listTitle: "服务提醒",
        list: ["专属顾问 14:00 联系你", "品牌定位诊断报告已生成", "课程回放已学习 65%"],
      },
      pc: {
        nav: ["工作台", "AI 洞察", "服务工单", "公告管理", "退款审核", "任务自动化"],
        kpis: [
          ["活跃主理人", "2,428", "+8.2%"],
          ["AI 健康均值", "78.6", "+4.1"],
          ["任务完成率", "63.2%", "+6.3%"],
          ["工单解决率", "92.1%", "+3.7%"],
        ],
        mainTitle: "AI 洞察与服务工单",
        sideTitle: "任务自动化",
        tasks: ["课程问题 · 高优先级", "功能咨询 · 中优先级", "退款咨询 · 低优先级"],
      },
    },
  };

  const concept = concepts[active];

  return (
    <main className={"concept-page concept-" + concept.tone}>
      <section className="concept-topbar">
        <div className="concept-brand">
          <div className="concept-logo"><Icon name="gemlogo" size={24} /></div>
          <div>
            <strong>主理人公社</strong>
            <span>AI 时代主理人成长与资源变现平台</span>
          </div>
        </div>
        <div className="concept-tabs" role="tablist" aria-label="系统方案切换">
          {Object.entries(concepts).map(([key, item]) => (
            <button key={key} className={active === key ? "on" : ""} onClick={() => setActive(key)}>
              <small>{item.eyebrow}</small>
              <b>{item.title}</b>
            </button>
          ))}
        </div>
        <button className="concept-back" onClick={() => nav("home")}>
          <Icon name="phone" size={17} color="currentColor" /> 小程序页面
        </button>
      </section>

      <section className="concept-hero">
        <div>
          <span className="concept-eyebrow">{concept.eyebrow}</span>
          <h1>{concept.title}</h1>
          <p>{concept.line}</p>
        </div>
        <div className="concept-tags">
          {concept.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>

      <section className="concept-stage">
        <MobileConcept concept={concept} />
        <PcConcept concept={concept} />
      </section>
    </main>
  );
}

function MobileConcept({ concept }) {
  return (
    <div className="concept-mobile">
      <div className="concept-mobile-status">
        <span>9:41</span>
        <i />
      </div>
      <div className="concept-mobile-head">
        <div className="concept-avatar portrait portrait-shirley" />
        <div>
          <strong>{concept.mobile.hello}</strong>
          <span>{concept.mobile.lead}</span>
        </div>
        <button onClick={() => prototypeDialog({ title: "最新提醒", body: "3 个重要提醒：服务跟进、课程发布与工单处理。进入小程序可查看完整消息。" })}><Icon name="bell" size={16} color="#fff" /></button>
      </div>

      <div className="concept-mobile-hero">
        <div>
          <span>{concept.mobile.hero}</span>
          <strong>{concept.mobile.heroMeta}</strong>
        </div>
        <button onClick={() => prototypeToast(`${concept.mobile.action}已打开`)}>{concept.mobile.action}</button>
      </div>

      <div className="concept-mobile-grid">
        {concept.mobile.tiles.map(([label, value, icon]) => (
          <div key={label}>
            <Icon name={icon === "check" ? "shield" : icon} size={18} color="currentColor" />
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="concept-mobile-list">
        <div className="concept-card-title">{concept.mobile.listTitle}<span onClick={() => prototypeToast("已展示全部内容")}>查看全部</span></div>
        {concept.mobile.list.map((item, index) => (
          <div className="concept-row" key={item}>
            <i>{index + 1}</i>
            <p>{item}</p>
            <Icon name="chev" size={14} color="#6f7a98" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PcConcept({ concept }) {
  const [activeNav, setActiveNav] = React.useState(concept.pc.nav[0]);
  React.useEffect(() => setActiveNav(concept.pc.nav[0]), [concept]);
  return (
    <div className="concept-pc">
      <aside className="concept-sidebar">
        <div className="concept-pc-logo"><Icon name="gemlogo" size={18} />主理人公社</div>
        {concept.pc.nav.map((item, index) => (
          <button key={item} className={activeNav === item ? "on" : ""} onClick={() => { setActiveNav(item); prototypeToast(`已切换到${item}`); }}>
            <Icon name={["home", "members", "link", "folder", "card", "sparkle"][index] || "grid"} size={15} color="currentColor" />
            {item}
          </button>
        ))}
      </aside>

      <section className="concept-pc-main">
        <div className="concept-pc-head">
          <div>
            <h2>{concept.title}</h2>
            <span>数据更新时间：2025-05-20 09:30</span>
          </div>
          <div className="concept-search"><Icon name="search" size={15} color="#7f8aa8" />搜索成员 / 订单 / 班级 / 资源</div>
        </div>

        <div className="concept-kpis">
          {concept.pc.kpis.map(([label, value, delta]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <em>{delta}</em>
            </div>
          ))}
        </div>

        <div className="concept-pc-grid">
          <div className="concept-panel concept-chart">
            <div className="concept-card-title">{concept.pc.mainTitle}<span onClick={() => prototypeToast("趋势详情已展开")}>查看详情</span></div>
            <div className="concept-line-chart">
              <i style={{ height: "38%" }} />
              <i style={{ height: "50%" }} />
              <i style={{ height: "44%" }} />
              <i style={{ height: "66%" }} />
              <i style={{ height: "72%" }} />
              <i style={{ height: "84%" }} />
            </div>
          </div>
          <div className="concept-panel concept-map">
            <div className="concept-card-title">{concept.pc.sideTitle}<span onClick={() => prototypeToast("关系图谱已展开")}>展开</span></div>
            <div className="concept-node center">林小北</div>
            <div className="concept-node n1">推荐人</div>
            <div className="concept-node n2">服务老师</div>
            <div className="concept-node n3">资源库</div>
            <div className="concept-node n4">区域主理</div>
          </div>
          <div className="concept-panel concept-table">
            <div className="concept-card-title">今日待处理<span onClick={() => prototypeToast("已展示全部待处理事项")}>全部</span></div>
            {concept.pc.tasks.map((item, index) => (
              <div className="concept-table-row" key={item}>
                <span>#S2024052{index + 1}</span>
                <b>{item}</b>
                <em>{index === 0 ? "高" : index === 1 ? "中" : "低"}</em>
                <button onClick={() => prototypeToast(`工单 #S2024052${index + 1} 已进入处理队列`)}>处理</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SystemVariantsScreen });
