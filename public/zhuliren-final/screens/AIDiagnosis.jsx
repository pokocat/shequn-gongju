/* AIDiagnosis.jsx — AI 诊断 (07) */
function AIDiagnosisScreen({ nav }) {
  const [tab, setTab] = React.useState("diag");
  const rings = [
    { v: 88, l: "活跃度", n: "优秀", c: "#a45cff" },
    { v: 82, l: "影响力", n: "良好", c: "#2e6bff" },
    { v: "76%", l: "续费概率", n: "良好", c: "#ff5ed8" },
    { v: 91, l: "服务力", n: "优秀", c: "#20c8df" },
  ];
  const issues = [
    { t: "互动频率偏低，影响社群活跃度", lv: "中等", cl: "amber" },
    { t: "内容输出不稳定，影响个人影响力", lv: "中等", cl: "amber" },
    { t: "潜在流失风险增加，需关注成员留存", lv: "高", cl: "red" },
    { t: "服务响应速度较慢，建议优化流程", lv: "低", cl: "green" },
  ];
  const advice = [
    { icon: "members", t: "提升互动频率", d: "建议每周至少发起 2 次主题互动", lv: "优先", cl: "pink" },
    { icon: "edit", t: "输出优质内容", d: "保持每周 1 篇深度内容输出", lv: "优先", cl: "pink" },
    { icon: "shield", t: "优化服务流程", d: "设置自动回复，缩短响应时间", lv: "建议", cl: "blue" },
  ];
  const records = [
    { date: "2025.05.20", type: "增长诊断", score: "A+", status: "报告已生成", color: "green" },
    { date: "2025.04.18", type: "活跃诊断", score: "A", status: "已完成", color: "blue" },
    { date: "2025.03.12", type: "转化诊断", score: "B+", status: "已完成", color: "purple" },
  ];

  return (
    <div className="screen has-tabbar fade-in">
      <AppHeader />
      <div className="topseg">
        <button type="button" className={"seg" + (tab === "diag" ? " active" : "")} aria-pressed={tab === "diag"} onClick={() => setTab("diag")}>AI 诊断</button>
        <button type="button" className={"seg" + (tab === "log" ? " active" : "")} aria-pressed={tab === "log"} onClick={() => setTab("log")}>诊断记录</button>
      </div>

      {tab === "diag" ? <>

      {/* hero */}
      <div className="card" style={{ padding: "16px 16px 14px" }}>
        <div className="eyebrow-zh" style={{ color: "#9af0fb" }}>「AI 智能诊断</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="title-grad" style={{ fontSize: 20, margin: "7px 0 7px", whiteSpace: "nowrap" }}>洞察问题 · 驱动增长</div>
            <p style={{ fontSize: 12, color: "var(--ink-200)", lineHeight: 1.55 }}>基于大数据与 AI 算法识别增长机会点，为您提供精准提升建议。</p>
          </div>
          <div style={{ flex: "0 0 108px", marginTop: -4 }}><AiGemHologram w={116} h={118} /></div>
        </div>
        <button className="ghost-pill" style={{ marginTop: 12 }} onClick={() => prototypeDialog({ title: "AI 诊断说明", body: "系统会结合社群活跃、内容转化、成员留存与服务响应数据生成建议；正式版需获得数据授权后运行。" })}>诊断说明 <Icon name="info" size={14} color="#dcd2ff" /></button>
      </div>

      {/* score */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 14 }}>
          <div className="col-h" style={{ fontSize: 16 }}>综合评分</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="num" style={{ fontSize: 11.5, color: "var(--ink-300)" }}>诊断时间：2025.05.20 10:30</span>
            <span className="link-trail" style={{ color: "#c9a6ff" }} onClick={() => nav("aiBooking")}>重新诊断 <Icon name="refresh" size={13} color="#c9a6ff" /></span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: "0 0 92px", textAlign: "center" }}>
            <div className="title-grad" style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>A+</div>
            <div style={{ fontSize: 13, color: "#c89bff", marginTop: 6 }}>优秀</div>
            <div style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 3 }}>超过 <span className="num">87%</span> 的主理人</div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
            {rings.map((r) => <MetricRing key={r.l} value={r.v} label={r.l} note={r.n} color={r.c} />)}
          </div>
        </div>
      </div>

      {/* issues */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: "#fff" }}>
            <Icon name="warn" size={16} color="#ff9ec2" />AI 问题识别
          </div>
          <div className="link-trail" onClick={() => prototypeDialog({ title: "问题识别详情", body: "主要风险集中在成员留存、内容输出稳定性与服务响应。建议先处理高风险留存问题，再按周执行内容与互动动作。" })}>查看详情 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {issues.map((it, i) => (
          <div className="issue-row" key={i}>
            <span className="issue-dot" />
            <span style={{ flex: 1, fontSize: 13.5, color: "var(--ink-100)" }}>{it.t}</span>
            <span className={"tag " + it.cl}>{it.lv}</span>
          </div>
        ))}
      </div>

      {/* advice */}
      <div className="card card-pad section-gap">
        <div className="row-between" style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: "#fff" }}>
            <Icon name="star2" size={16} color="#c79bff" />AI 建议动作
          </div>
          <div className="link-trail" onClick={() => prototypeDialog({ title: "全部建议", body: "本次共生成 8 条建议，当前展示优先级最高的 3 条。预约专属诊断后可获得完整建议与执行排期。", confirmText: "预约诊断", onConfirm: () => nav("aiBooking") })}>查看全部建议 <Icon name="chev" size={13} color="#6f7a98" /></div>
        </div>
        {advice.map((a, i) => (
          <div className="advice-row" key={i}>
            <div className="advice-ico"><Icon name={a.icon} size={20} color="#b88bff" /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{a.t}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>{a.d}</div>
            </div>
            <span className={"tag " + a.cl}>{a.lv}</span>
            <Icon name="chev" size={15} color="#5a6486" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="cta-primary section-gap" onClick={() => nav("aiBooking")}>
        预约专属诊断沟通
        <span className="arrow"><Icon name="arrow" size={17} color="#fff" /></span>
      </button>
      </> : (
        <div className="ai-record-view">
          <section className="card ai-record-summary">
            <div><span>累计诊断</span><strong className="num">3</strong><small>本年度</small></div>
            <div><span>平均评分</span><strong className="title-grad">A</strong><small>优于 82% 主理人</small></div>
            <div><span>已完成建议</span><strong className="num">16</strong><small>完成率 76%</small></div>
          </section>
          <section className="card ai-record-list">
            <div className="row-between"><div className="col-h">诊断记录</div><button type="button" className="btn-outline-sm" onClick={() => nav("aiBooking")}>新建诊断</button></div>
            {records.map((record) => (
              <button type="button" className="ai-record-row" key={record.date} onClick={() => prototypeDialog({ title: `${record.type}报告`, body: `${record.date} 完成，综合评分 ${record.score}。报告包含核心问题、优先动作与 30 天执行建议。`, confirmText: "查看当前报告", onConfirm: () => setTab("diag") })}>
                <span className="ai-record-grade title-grad">{record.score}</span>
                <span><strong>{record.type}</strong><small>{record.date} · AI 与服务老师联合诊断</small></span>
                <em className={"tag " + record.color}>{record.status}</em><Icon name="chev" size={16} color="#66708b" />
              </button>
            ))}
          </section>
          <section className="card ai-record-tip"><Icon name="shield" size={18} color="#8aa6ff" /><div><strong>诊断报告永久保留</strong><span>支持随时回看、复盘与对比不同阶段的变化</span></div></section>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AIDiagnosisScreen });
