(() => {
  function AIBookingScreen({ nav }) {
    const [target, setTarget] = React.useState("\u4E3B\u7406\u4EBA\u672C\u4EBA");
    const [city, setCity] = React.useState("\u676D\u5DDE");
    const [direction, setDirection] = React.useState("\u79C1\u57DF\u793E\u7FA4\u8FD0\u8425");
    const [members, setMembers] = React.useState("100-500 \u4EBA");
    const [problem, setProblem] = React.useState("");
    const [goal, setGoal] = React.useState("");
    const [types, setTypes] = React.useState(["\u589E\u957F\u8BCA\u65AD", "\u6D3B\u8DC3\u8BCA\u65AD"]);
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
      { t: "\u589E\u957F\u8BCA\u65AD", icon: "chart" },
      { t: "\u6D3B\u8DC3\u8BCA\u65AD", icon: "pulse" },
      { t: "\u8F6C\u5316\u8BCA\u65AD", icon: "funnel" },
      { t: "\u670D\u52A1\u8BCA\u65AD", icon: "headset" }
    ];
    const selectRows = [
      { key: "target", icon: "members", label: "\u8BCA\u65AD\u5BF9\u8C61", value: target, options: ["\u4E3B\u7406\u4EBA\u672C\u4EBA", "\u73ED\u7EA7\u8D1F\u8D23\u4EBA", "\u8FD0\u8425\u56E2\u961F"], set: setTarget },
      { key: "city", icon: "pin", label: "\u6240\u5728\u57CE\u5E02", value: city, options: ["\u676D\u5DDE", "\u4E0A\u6D77", "\u6DF1\u5733", "\u5317\u4EAC", "\u5E7F\u5DDE"], set: setCity },
      { key: "direction", icon: "bookmark", label: "\u793E\u7FA4\u65B9\u5411", value: direction, options: ["\u79C1\u57DF\u793E\u7FA4\u8FD0\u8425", "\u77E5\u8BC6\u4ED8\u8D39", "\u57CE\u5E02\u6D3B\u52A8", "\u4F01\u4E1A\u670D\u52A1"], set: setDirection },
      { key: "members", icon: "user", label: "\u5F53\u524D\u4F1A\u5458\u6570", value: members, options: ["100 \u4EBA\u4EE5\u4E0B", "100-500 \u4EBA", "500-1000 \u4EBA", "1000 \u4EBA\u4EE5\u4E0A"], set: setMembers }
    ];
    const uploadRows = {
      intro: { title: "\u793E\u7FA4\u4ECB\u7ECD\u8D44\u6599", done: "\u5DF2\u4E0A\u4F20\uFF1A\u793E\u7FA4\u4ECB\u7ECD\u8D44\u6599.pdf", empty: "\u652F\u6301 PDF / PPT / \u56FE\u7247" },
      data: { title: "\u8FD0\u8425\u6570\u636E\u622A\u56FE", done: "\u5DF2\u4E0A\u4F20\uFF1A\u8FD0\u8425\u6570\u636E\u622A\u56FE.png", empty: "\u652F\u6301 JPG / PNG \u56FE\u7247" }
    };
    const openSelect = (row) => setPicker({ kind: "select", ...row });
    const chooseOption = (value) => {
      picker.set(value);
      setPicker(null);
      showToast(`\u5DF2\u9009\u62E9 ${value}`);
    };
    const toggleType = (name) => {
      setTypes((prev) => {
        if (prev.includes(name)) {
          if (prev.length === 1) {
            showToast("\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u8BCA\u65AD\u7C7B\u578B");
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
      showToast(value ? "\u6750\u6599\u5DF2\u6DFB\u52A0" : "\u5DF2\u79FB\u9664\u6750\u6599");
    };
    const submit = () => {
      const nextErrors = {
        problem: !problem.trim(),
        goal: !goal.trim(),
        types: types.length === 0
      };
      setErrors(nextErrors);
      if (Object.values(nextErrors).some(Boolean)) {
        showToast("\u8BF7\u8865\u5145\u5FC5\u586B\u4FE1\u606F");
        return;
      }
      showToast("\u9884\u7EA6\u5DF2\u63D0\u4EA4\uFF0C\u6B63\u5728\u8FDB\u5165\u8FDB\u5EA6\u9875");
      window.setTimeout(() => nav("bookingSuccess"), 450);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "screen flush fade-in ai-booking-screen" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-head" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-brand" }, /* @__PURE__ */ React.createElement(AppBackButton, null), /* @__PURE__ */ React.createElement("div", { className: "app-logo" }, /* @__PURE__ */ React.createElement(Icon, { name: "gemlogo", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "brand-copy" }, /* @__PURE__ */ React.createElement("div", { className: "brand-row" }, /* @__PURE__ */ React.createElement("span", null, "\u4E3B\u7406\u4EBA\u516C\u793E"), /* @__PURE__ */ React.createElement("span", { className: "badge-pro" }, "PRO"), /* @__PURE__ */ React.createElement("span", { className: "ai-badge" }, "AI")))), /* @__PURE__ */ React.createElement(WxCapsule, null)), /* @__PURE__ */ React.createElement("section", { className: "ai-booking-hero card" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-hero-copy" }, /* @__PURE__ */ React.createElement("div", { className: "title-grad" }, "AI \u8BCA\u65AD\u9884\u7EA6"), /* @__PURE__ */ React.createElement("p", null, "\u63D0\u4EA4\u793E\u7FA4\u4FE1\u606F\uFF0C\u83B7\u53D6\u589E\u957F\u3001\u6D3B\u8DC3\u3001\u8F6C\u5316\u4E0E\u670D\u52A1\u8BCA\u65AD\u5EFA\u8BAE"), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-pills" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "members", size: 11 }), "\u667A\u80FD\u5339\u914D"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 11 }), "\u4F18\u5148\u6392\u671F"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "sparkle", size: 11 }), "\u4E13\u5C5E\u5EFA\u8BAE"))), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-art" }, /* @__PURE__ */ React.createElement(AiGemHologram, { w: 128, h: 116 }))), /* @__PURE__ */ React.createElement("section", { className: "ai-booking-card card" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-title" }, /* @__PURE__ */ React.createElement("span", null, "\u8BCA\u65AD\u4FE1\u606F"), /* @__PURE__ */ React.createElement("em", null, "* \u4E3A\u5FC5\u586B\u9879")), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-form" }, selectRows.map((row) => /* @__PURE__ */ React.createElement("button", { className: "ai-booking-row", type: "button", key: row.label, onClick: () => openSelect(row) }, /* @__PURE__ */ React.createElement("span", { className: "ai-booking-row-label" }, /* @__PURE__ */ React.createElement(Icon, { name: row.icon, size: 15, color: "#d977ff" }), row.label, /* @__PURE__ */ React.createElement("i", null, "*")), /* @__PURE__ */ React.createElement("span", { className: "ai-booking-row-value" }, row.value, /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 13, color: "#9a8fc8" })))), /* @__PURE__ */ React.createElement("label", { className: "ai-booking-textrow" + (errors.problem ? " invalid" : "") }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "info", size: 15, color: "#d977ff" }), "\u6838\u5FC3\u95EE\u9898 ", /* @__PURE__ */ React.createElement("i", null, "*")), /* @__PURE__ */ React.createElement("textarea", { value: problem, onChange: (e) => updateText("problem", e.target.value), maxLength: "80", placeholder: "\u8BF7\u7B80\u8981\u63CF\u8FF0\u5F53\u524D\u9762\u4E34\u7684\u95EE\u9898" }), /* @__PURE__ */ React.createElement("b", null, problem.length, "/80")), /* @__PURE__ */ React.createElement("label", { className: "ai-booking-textrow" + (errors.goal ? " invalid" : "") }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "target", size: 15, color: "#d977ff" }), "\u671F\u671B\u76EE\u6807 ", /* @__PURE__ */ React.createElement("i", null, "*")), /* @__PURE__ */ React.createElement("textarea", { value: goal, onChange: (e) => updateText("goal", e.target.value), maxLength: "80", placeholder: "\u8BF7\u63CF\u8FF0\u5E0C\u671B\u901A\u8FC7\u8BCA\u65AD\u8FBE\u6210\u7684\u76EE\u6807" }), /* @__PURE__ */ React.createElement("b", null, goal.length, "/80")))), /* @__PURE__ */ React.createElement("section", { className: "ai-booking-card card" + (errors.types ? " invalid-card" : "") }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-title" }, /* @__PURE__ */ React.createElement("span", null, "\u8BCA\u65AD\u7C7B\u578B ", /* @__PURE__ */ React.createElement("i", null, "*")), /* @__PURE__ */ React.createElement("em", null, types.length, " \u9879\u5DF2\u9009")), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-types" }, typeItems.map((item) => {
      const active = types.includes(item.t);
      return /* @__PURE__ */ React.createElement("button", { className: "ai-booking-type" + (active ? " active" : ""), type: "button", key: item.t, onClick: () => toggleType(item.t) }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 22, color: active ? "#f08cff" : "#7ea0ff" }), /* @__PURE__ */ React.createElement("span", null, item.t), active && /* @__PURE__ */ React.createElement("i", null, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 10, color: "#fff" })));
    }))), /* @__PURE__ */ React.createElement("section", { className: "ai-booking-card card" }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-title" }, /* @__PURE__ */ React.createElement("span", null, "\u4E0A\u4F20\u8865\u5145\u6750\u6599"), /* @__PURE__ */ React.createElement("em", null, "\u9009\u586B")), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-upload-grid" }, /* @__PURE__ */ React.createElement("button", { className: "ai-booking-upload" + (uploads.intro ? " uploaded" : ""), type: "button", onClick: () => openUpload("intro") }, /* @__PURE__ */ React.createElement(Icon, { name: "doc", size: 22, color: "#ef83ff" }), /* @__PURE__ */ React.createElement("span", null, "\u793E\u7FA4\u4ECB\u7ECD\u8D44\u6599"), /* @__PURE__ */ React.createElement("small", null, uploads.intro ? uploadRows.intro.done : uploadRows.intro.empty), /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement(Icon, { name: uploads.intro ? "shield" : "cloud", size: 16, color: "#fff" }))), /* @__PURE__ */ React.createElement("button", { className: "ai-booking-upload" + (uploads.data ? " uploaded" : ""), type: "button", onClick: () => openUpload("data") }, /* @__PURE__ */ React.createElement(Icon, { name: "chart", size: 22, color: "#86a6ff" }), /* @__PURE__ */ React.createElement("span", null, "\u8FD0\u8425\u6570\u636E\u622A\u56FE"), /* @__PURE__ */ React.createElement("small", null, uploads.data ? uploadRows.data.done : uploadRows.data.empty), /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement(Icon, { name: uploads.data ? "shield" : "cloud", size: 16, color: "#fff" }))))), /* @__PURE__ */ React.createElement("section", { className: "ai-booking-member card" }, /* @__PURE__ */ React.createElement(Icon, { name: "award", size: 32, color: "#f08cff" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "PRO\u4F1A\u5458\u6BCF\u6708\u53EF\u4EAB\u4E13\u5C5E AI \u8BCA\u65AD\u670D\u52A1"), /* @__PURE__ */ React.createElement("span", null, "\u4E13\u4E1A\u5206\u6790\u56E2\u961F\u4E3A\u60A8\u63D0\u4F9B\u5B9A\u5236\u5316\u589E\u957F\u65B9\u6848")), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => nav("benefitDetail") }, "\u67E5\u770B\u6743\u76CA")), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-actions" }, /* @__PURE__ */ React.createElement("button", { className: "cta-primary", type: "button", onClick: submit }, /* @__PURE__ */ React.createElement(Icon, { name: "arrow", size: 16, color: "#fff" }), "\u63D0\u4EA4\u9884\u7EA6"), /* @__PURE__ */ React.createElement("button", { className: "cta-ghost", type: "button", onClick: () => nav("addWechat") }, /* @__PURE__ */ React.createElement(Icon, { name: "headset", size: 16, color: "#ffd2ff" }), "\u54A8\u8BE2\u670D\u52A1\u8001\u5E08")), /* @__PURE__ */ React.createElement("div", { className: "ai-booking-foot" }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 12, color: "#6f7a98" }), "\u63D0\u4EA4\u540E 1 \u4E2A\u5DE5\u4F5C\u65E5\u5185\u5B89\u6392\u4E13\u5C5E\u670D\u52A1\u8001\u5E08\u5BF9\u63A5")), picker && /* @__PURE__ */ React.createElement("div", { className: "ai-booking-overlay", onClick: () => setPicker(null) }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-sheet", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "ai-booking-sheet-head" }, /* @__PURE__ */ React.createElement("strong", null, picker.kind === "select" ? `\u9009\u62E9${picker.label}` : picker.title), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setPicker(null) }, "\u5B8C\u6210")), picker.kind === "select" ? /* @__PURE__ */ React.createElement("div", { className: "ai-booking-options" }, picker.options.map((item) => /* @__PURE__ */ React.createElement("button", { className: item === picker.value ? "active" : "", type: "button", key: item, onClick: () => chooseOption(item) }, /* @__PURE__ */ React.createElement("span", null, item), item === picker.value && /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 14, color: "#5df0bb" })))) : /* @__PURE__ */ React.createElement("div", { className: "ai-booking-options" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setUpload(picker.key, true) }, /* @__PURE__ */ React.createElement("span", null, "\u6A21\u62DF\u4E0A\u4F20\u6750\u6599"), /* @__PURE__ */ React.createElement(Icon, { name: "cloud", size: 14, color: "#d977ff" })), picker.uploaded && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setUpload(picker.key, false) }, /* @__PURE__ */ React.createElement("span", null, "\u79FB\u9664\u5DF2\u4E0A\u4F20\u6750\u6599"), /* @__PURE__ */ React.createElement(Icon, { name: "xcircle", size: 14, color: "#ff8aba" }))))), toast && /* @__PURE__ */ React.createElement("div", { className: "ai-booking-toast" }, toast));
  }
  Object.assign(window, { AIBookingScreen });
})();
