/* BenefitDetail.jsx — AI 诊断权益详情 (26) */
function BenefitDetailScreen({ nav }) {
  const details = [
    { icon: "doc", label: "权益内容", value: "基于社群与业务数据，输出增长、活跃、转化与服务诊断建议" },
    { icon: "calendar", label: "可使用次数", value: "每月 1 次，自然月重置" },
    { icon: "arrow", label: "使用方式", value: "提交需求 → 智能匹配 → 生成诊断报告" },
    { icon: "members", label: "适用人群", value: "PRO 会员及以上等级的班级负责人、主理人" },
  ];
  const steps = [
    { icon: "edit", title: "提交需求", desc: "填写社群与业务信息" },
    { icon: "aitext", title: "智能匹配", desc: "匹配服务老师与排期" },
    { icon: "chart", title: "获取报告", desc: "获得建议与落地方案" },
  ];
  return (
    <div className="screen flush fade-in benefit-detail-screen">
      <div className="benefit-detail-wrap">
        <AppHeader gem={false} />

        <section className="card benefit-detail-hero">
          <div className="benefit-detail-hero-copy">
            <span className="tag purple">PRO 专享</span>
            <h1 className="title-grad">AI 诊断权益</h1>
            <p>每月可预约专属商业诊断，获得增长与运营建议</p>
            <div className="benefit-detail-pills">
              <span><Icon name="calendar" size={13} color="#d18cff" />本月可预约</span>
              <span><Icon name="shield" size={13} color="#82a8ff" />优先服务</span>
              <span><Icon name="crown" size={13} color="#f29aff" />专属建议</span>
            </div>
          </div>
          <div className="benefit-detail-art"><AiGemHologram w={150} h={145} /></div>
        </section>

        <section className="card benefit-detail-card">
          <div className="benefit-detail-section-title"><span>权益详情</span><button type="button" onClick={() => prototypeDialog({ title: "权益使用规则", body: "每个自然月可提交 1 次 AI 诊断，预约后可补充材料；未开始服务前可联系老师调整排期。" })}>使用规则</button></div>
          <div className="benefit-detail-info">
            {details.map((item) => (
              <div className="benefit-detail-row" key={item.label}>
                <span className="benefit-detail-row-icon"><Icon name={item.icon} size={18} color="#d47cff" /></span>
                <strong>{item.label}</strong><p>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="benefit-detail-stats">
            <div><Icon name="star2" size={20} color="#c88cff" /><span>本月剩余</span><strong>1 次</strong><small>可用 1 / 已用 0</small></div>
            <div><Icon name="shield" size={20} color="#67e0b2" /><span>当前状态</span><strong className="green">可预约</strong><small>随时可提交需求</small></div>
            <div><Icon name="clock" size={20} color="#8ba8ff" /><span>最近记录</span><strong>暂无</strong><small>提交后显示记录</small></div>
          </div>
        </section>

        <section className="card benefit-detail-teacher">
          <div className="benefit-detail-section-title"><span>推荐搭配服务老师</span><button type="button" onClick={() => nav("addWechat")}>联系老师</button></div>
          <div className="benefit-detail-teacher-main">
            <Avatar size={52} initial="林" ring hue={40} />
            <div><strong>林老师 <span className="tag purple">专属服务</span></strong><p>企业增长顾问 · 社群运营专家</p><div><span>AI 诊断协同</span><span>增长策略</span><span>项目陪跑</span></div></div>
            <aside><Icon name="pulse" size={18} color="#d47cff" /><b>2 小时内响应</b><small>优先排期</small></aside>
          </div>
        </section>

        <section className="card benefit-detail-flow">
          <div className="benefit-detail-section-title"><span>使用流程</span></div>
          <div className="benefit-detail-step-grid">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div><i>{index + 1}</i><span><Icon name={step.icon} size={22} color="#d47cff" /></span><strong>{step.title}</strong><small>{step.desc}</small></div>
                {index < steps.length - 1 && <b className="benefit-detail-step-line" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        <div className="benefit-detail-actions">
          <button type="button" className="cta-primary" onClick={() => nav("aiBooking")}><Icon name="pulse" size={19} color="#fff" />立即使用权益</button>
          <button type="button" className="cta-ghost" onClick={() => nav("benefits")}><Icon name="gem" size={18} color="#e8c7ff" />返回全部权益</button>
        </div>
        <div className="benefit-detail-foot"><Icon name="shield" size={13} color="#68728d" />专业诊断 · 智能分析 · 数据安全</div>
      </div>
    </div>
  );
}

Object.assign(window, { BenefitDetailScreen });
