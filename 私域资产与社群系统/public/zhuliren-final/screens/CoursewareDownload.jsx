/* CoursewareDownload.jsx — 课件下载 (29) */
function CoursewareDownloadScreen({ nav }) {
  const [downloaded, setDownloaded] = React.useState(["课程讲义 PDF"]);
  const files = [
    { t: "课程讲义 PDF", d: "核心知识点与案例解析", size: "12.4MB", ext: "PDF", c: "#ff6fae" },
    { t: "运营清单", d: "社群运营关键动作清单", size: "3.8MB", ext: "XLS", c: "#3fbf6f" },
    { t: "实操模板", d: "可直接套用的实操模板合集", size: "8.6MB", ext: "DOC", c: "#5e8bff" },
    { t: "复盘表", d: "活动复盘与数据分析表", size: "2.1MB", ext: "CSV", c: "#b88bff" },
  ];
  return (
    <div className="screen flush fade-in courseware-screen" style={{ paddingBottom: 0 }}>
      <div className="courseware-wrap" style={{ padding: "0 16px" }}>
        <AppHeader pro={true} gem={false} />

        {/* hero */}
        <div className="card courseware-hero" style={{ padding: "16px", overflow: "hidden", border: "1px solid rgba(120,90,220,.4)", background: "radial-gradient(120% 130% at 85% 0%, rgba(70,45,150,.4), rgba(12,14,28,.55) 60%)" }}>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="title-grad" style={{ fontSize: 30, fontWeight: 900 }}>课件下载</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-200)", marginTop: 8 }}>课程资料、学习清单、实操模板统一领取</div>
              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                <span className="pill-outline"><Icon name="crown" size={12} color="#c79bff" />PRO 专属</span>
                <span className="pill-outline"><Icon name="refresh" size={12} color="#9af0fb" />资料同步</span>
                <span className="pill-outline"><Icon name="cloud" size={12} color="#ff9ee0" />支持离线</span>
              </div>
            </div>
            <div className="courseware-hero-art" style={{ flex: "0 0 116px" }}><HeroGem w={120} h={116} icon="doc" hue={250} /></div>
          </div>
        </div>

        {/* file list */}
        <div className="card card-pad section-gap courseware-files-card">
          <div className="row-between" style={{ marginBottom: 10 }}><div className="col-h" style={{ fontSize: 16 }}>本节课件资料</div><span className="link-trail" style={{ color: "#c79bff" }} onClick={() => { setDownloaded(files.map((file) => file.t)); prototypeToast("全部课件已下载"); }}><Icon name="download" size={13} color="#c79bff" /> 全部下载 <Icon name="chev" size={13} color="#c79bff" /></span></div>
          {files.map((f) => (
            <div className="file-row courseware-file" key={f.t} onClick={() => { setDownloaded((items) => items.includes(f.t) ? items : [...items, f.t]); prototypeToast(`${f.t} 已下载`); }} role="button" tabIndex="0">
              <span className="courseware-file-icon" style={{ "--file-color": f.c }}><Icon name="doc" size={24} color="var(--file-color)" /><b>{f.ext}</b></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{f.t}</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>{f.d}</div></div>
              <div className="num" style={{ fontSize: 12, color: "var(--ink-300)" }}>{f.size}</div>
              <div style={{ fontSize: 12, color: downloaded.includes(f.t) ? "#5fd9a8" : "#c79bff", whiteSpace: "nowrap" }}>{downloaded.includes(f.t) ? "已下载" : "未下载"}</div>
              <span className="dl-circle" style={{ width: 36, height: 36, flex: "0 0 36px" }}><Icon name="download" size={17} color="#c79bff" /></span>
            </div>
          ))}
          <div className="dl-stat">
            <div><CircPct pct={25} /><div><div className="vs-t">已下载数量</div><div className="vs-d num">1 项</div></div></div>
            <div><Icon name="clock" size={24} color="#b88bff" /><div><div className="vs-t">最近更新</div><div className="vs-d num">2025.05.22</div></div></div>
            <div><Icon name="cloud" size={24} color="#b88bff" /><div><div className="vs-t">可离线查看</div><div className="vs-d">支持</div></div></div>
          </div>
        </div>

        {/* learning record */}
        <div className="card card-pad section-gap courseware-study-card" style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => nav("coursePlay")} role="button" tabIndex="0">
          <span className="set-ico"><Icon name="book" size={22} color="#b88bff" /></span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>下载后可在学习记录中查看</div><div style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 4 }}>已下载资料将保存在"学习记录"，支持离线查看与多端同步。</div></div>
          <Icon name="chev" size={16} color="#5a6486" />
        </div>

        {/* recommend replay */}
        <div className="card card-pad section-gap courseware-replay-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><span className="col-h" style={{ fontSize: 14.5 }}>推荐搭配本节回放复习</span><span className="tag purple">PRO 专享</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: "0 0 48px" }}><CrystalMedallion size={48} glyph="" /></div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff" }}>第二讲 社群增长引擎</div><div className="num" style={{ fontSize: 11.5, color: "var(--ink-300)", marginTop: 3 }}>48 分钟 · 主讲：林老师</div></div>
            <button className="btn-soft" onClick={() => nav("coursePlay")}>去观看</button>
          </div>
        </div>
      </div>

      <div className="action-bar courseware-actions" style={{ display: "flex", gap: 12 }}>
        <button className="cta-primary" style={{ flex: 1, height: 54, fontSize: 16 }} onClick={() => { setDownloaded(files.map((file) => file.t)); prototypeToast("全部课件已下载"); }}><Icon name="download" size={18} color="#fff" /> 一键下载全部</button>
        <button className="cta-ghost" style={{ flex: 1, height: 54, fontSize: 15 }} onClick={() => nav("coursePlay")}><Icon name="play" size={17} color="#e0c8ff" /> 返回课程回放</button>
      </div>
      <div className="reg-foot courseware-foot" style={{ paddingBottom: 14, marginTop: 0 }}><Icon name="shield" size={13} color="#6f7a98" /> 资料仅限 PRO 会员使用，请勿外传或用于商业用途</div>
    </div>
  );
}

Object.assign(window, { CoursewareDownloadScreen });
