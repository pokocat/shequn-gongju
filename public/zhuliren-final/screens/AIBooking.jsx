/* AIBooking.jsx — AI 诊断预约 (23) */
function AIBookingScreen({ nav }) {
  const [target, setTarget] = React.useState("主理人本人");
  const [city, setCity] = React.useState("杭州");
  const [direction, setDirection] = React.useState("私域社群运营");
  const [members, setMembers] = React.useState("100-500 人");
  const [problem, setProblem] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [types, setTypes] = React.useState(["增长诊断", "活跃诊断"]);
  const [uploads, setUploads] = React.useState({ intro: false, data: false });
  const [picker, setPicker] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState("");
  const toastRef = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(toastRef.current), []);

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(toastRef.current);
    toastRef.current = window.setTimeout(() => setToast(""), 1600);
  };

  const updateText = (key, value) => {
    if (key === "problem") setProblem(value);
    if (key === "goal") setGoal(value);
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const typeItems = [
    { t: "增长诊断", icon: "chart" },
    { t: "活跃诊断", icon: "pulse" },
    { t: "转化诊断", icon: "funnel" },
    { t: "服务诊断", icon: "headset" },
  ];
  const selectRows = [
    { key: "target", icon: "members", label: "诊断对象", value: target, options: ["主理人本人", "班级负责人", "运营团队"], set: setTarget },
    { key: "city", icon: "pin", label: "所在城市", value: city, options: ["杭州", "上海", "深圳", "北京", "广州"], set: setCity },
    { key: "direction", icon: "bookmark", label: "社群方向", value: direction, options: ["私域社群运营", "知识付费", "城市活动", "企业服务"], set: setDirection },
    { key: "members", icon: "user", label: "当前会员数", value: members, options: ["100 人以下", "100-500 人", "500-1000 人", "1000 人以上"], set: setMembers },
  ];
  const uploadRows = {
    intro: { title: "社群介绍资料", done: "已上传：社群介绍资料.pdf", empty: "支持 PDF / PPT / 图片" },
    data: { title: "运营数据截图", done: "已上传：运营数据截图.png", empty: "支持 JPG / PNG 图片" },
  };

  const openSelect = (row) => setPicker({ kind: "select", ...row });
  const chooseOption = (value) => {
    picker.set(value);
    setPicker(null);
    showToast(`已选择 ${value}`);
  };
  const toggleType = (name) => {
    setTypes((prev) => {
      if (prev.includes(name)) {
        if (prev.length === 1) {
          showToast("至少选择一种诊断类型");
          return prev;
        }
        return prev.filter((it) => it !== name);
      }
      return [...prev, name];
    });
    setErrors((prev) => ({ ...prev, types: false }));
  };
  const openUpload = (key) => setPicker({ kind: "upload", key, ...uploadRows[key], uploaded: uploads[key] });
  const setUpload = (key, value) => {
    setUploads((prev) => ({ ...prev, [key]: value }));
    setPicker(null);
    showToast(value ? "材料已添加" : "已移除材料");
  };
  const submit = () => {
    const nextErrors = {
      problem: !problem.trim(),
      goal: !goal.trim(),
      types: types.length === 0,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      showToast("请补充必填信息");
      return;
    }
    showToast("预约已提交，正在进入进度页");
    window.setTimeout(() => nav("bookingSuccess"), 450);
  };

  return (
    <div className="screen flush fade-in ai-booking-screen">
      <div className="ai-booking-wrap">
        <div className="ai-booking-head">
          <div className="ai-booking-brand">
            <AppBackButton />
            <div className="app-logo"><Icon name="gemlogo" size={18} /></div>
            <div className="brand-copy">
              <div className="brand-row"><span>主理人公社</span><span className="badge-pro">PRO</span><span className="ai-badge">AI</span></div>
            </div>
          </div>
          <WxCapsule />
        </div>

        <section className="ai-booking-hero card">
          <div className="ai-booking-hero-copy">
            <div className="title-grad">AI 诊断预约</div>
            <p>提交社群信息，获取增长、活跃、转化与服务诊断建议</p>
            <div className="ai-booking-pills">
              <span><Icon name="members" size={11} />智能匹配</span>
              <span><Icon name="clock" size={11} />优先排期</span>
              <span><Icon name="sparkle" size={11} />专属建议</span>
            </div>
          </div>
          <div className="ai-booking-art"><AiGemHologram w={128} h={116} /></div>
        </section>

        <section className="ai-booking-card card">
          <div className="ai-booking-title"><span>诊断信息</span><em>* 为必填项</em></div>
          <div className="ai-booking-form">
            {selectRows.map((row) => (
              <button className="ai-booking-row" type="button" key={row.label} onClick={() => openSelect(row)}>
                <span className="ai-booking-row-label"><Icon name={row.icon} size={15} color="#d977ff" />{row.label}<i>*</i></span>
                <span className="ai-booking-row-value">{row.value}<Icon name="chev" size={13} color="#9a8fc8" /></span>
              </button>
            ))}
            <label className={"ai-booking-textrow" + (errors.problem ? " invalid" : "")}>
              <span><Icon name="info" size={15} color="#d977ff" />核心问题 <i>*</i></span>
              <textarea value={problem} onChange={(e) => updateText("problem", e.target.value)} maxLength="80" placeholder="请简要描述当前面临的问题" />
              <b>{problem.length}/80</b>
            </label>
            <label className={"ai-booking-textrow" + (errors.goal ? " invalid" : "")}>
              <span><Icon name="target" size={15} color="#d977ff" />期望目标 <i>*</i></span>
              <textarea value={goal} onChange={(e) => updateText("goal", e.target.value)} maxLength="80" placeholder="请描述希望通过诊断达成的目标" />
              <b>{goal.length}/80</b>
            </label>
          </div>
        </section>

        <section className={"ai-booking-card card" + (errors.types ? " invalid-card" : "")}>
          <div className="ai-booking-title"><span>诊断类型 <i>*</i></span><em>{types.length} 项已选</em></div>
          <div className="ai-booking-types">
            {typeItems.map((item) => {
              const active = types.includes(item.t);
              return (
                <button className={"ai-booking-type" + (active ? " active" : "")} type="button" key={item.t} onClick={() => toggleType(item.t)}>
                  <Icon name={item.icon} size={22} color={active ? "#f08cff" : "#7ea0ff"} />
                  <span>{item.t}</span>
                  {active && <i><Icon name="shield" size={10} color="#fff" /></i>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="ai-booking-card card">
          <div className="ai-booking-title"><span>上传补充材料</span><em>选填</em></div>
          <div className="ai-booking-upload-grid">
            <button className={"ai-booking-upload" + (uploads.intro ? " uploaded" : "")} type="button" onClick={() => openUpload("intro")}>
              <Icon name="doc" size={22} color="#ef83ff" />
              <span>社群介绍资料</span>
              <small>{uploads.intro ? uploadRows.intro.done : uploadRows.intro.empty}</small>
              <b><Icon name={uploads.intro ? "shield" : "cloud"} size={16} color="#fff" /></b>
            </button>
            <button className={"ai-booking-upload" + (uploads.data ? " uploaded" : "")} type="button" onClick={() => openUpload("data")}>
              <Icon name="chart" size={22} color="#86a6ff" />
              <span>运营数据截图</span>
              <small>{uploads.data ? uploadRows.data.done : uploadRows.data.empty}</small>
              <b><Icon name={uploads.data ? "shield" : "cloud"} size={16} color="#fff" /></b>
            </button>
          </div>
        </section>

        <section className="ai-booking-member card">
          <Icon name="award" size={32} color="#f08cff" />
          <div><strong>PRO会员每月可享专属 AI 诊断服务</strong><span>专业分析团队为您提供定制化增长方案</span></div>
          <button type="button" onClick={() => nav("benefitDetail")}>查看权益</button>
        </section>

        <div className="ai-booking-actions">
          <button className="cta-primary" type="button" onClick={submit}><Icon name="arrow" size={16} color="#fff" />提交预约</button>
          <button className="cta-ghost" type="button" onClick={() => nav("addWechat")}><Icon name="headset" size={16} color="#ffd2ff" />咨询服务老师</button>
        </div>
        <div className="ai-booking-foot"><Icon name="shield" size={12} color="#6f7a98" />提交后 1 个工作日内安排专属服务老师对接</div>
      </div>

      {picker && (
        <div className="ai-booking-overlay" onClick={() => setPicker(null)}>
          <div className="ai-booking-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ai-booking-sheet-head">
              <strong>{picker.kind === "select" ? `选择${picker.label}` : picker.title}</strong>
              <button type="button" onClick={() => setPicker(null)}>完成</button>
            </div>
            {picker.kind === "select" ? (
              <div className="ai-booking-options">
                {picker.options.map((item) => (
                  <button className={item === picker.value ? "active" : ""} type="button" key={item} onClick={() => chooseOption(item)}>
                    <span>{item}</span>
                    {item === picker.value && <Icon name="shield" size={14} color="#5df0bb" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="ai-booking-options">
                <button type="button" onClick={() => setUpload(picker.key, true)}><span>模拟上传材料</span><Icon name="cloud" size={14} color="#d977ff" /></button>
                {picker.uploaded && <button type="button" onClick={() => setUpload(picker.key, false)}><span>移除已上传材料</span><Icon name="xcircle" size={14} color="#ff8aba" /></button>}
              </div>
            )}
          </div>
        </div>
      )}
      {toast && <div className="ai-booking-toast">{toast}</div>}
    </div>
  );
}

Object.assign(window, { AIBookingScreen });
