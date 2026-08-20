(() => {
  function SystemVariantsScreen({ nav }) {
    const [active, setActive] = React.useState("growth");
    const concepts = {
      growth: {
        eyebrow: "\u65B9\u6848\u4E00",
        title: "\u589E\u957F\u64CD\u4F5C\u7CFB\u7EDF",
        line: "\u628A\u5C0F\u7A0B\u5E8F\u548C PC \u540E\u53F0\u7EDF\u4E00\u6210\u4E00\u5957\u589E\u957F\u8FD0\u8425\u9A7E\u9A76\u8231\u3002",
        tone: "growth",
        tags: ["\u4ECA\u65E5\u5F85\u529E", "\u589E\u957F\u6D1E\u5BDF", "\u5DE5\u5355\u6D41\u8F6C", "\u57CE\u5E02\u5206\u7AD9"],
        mobile: {
          hello: "\u65E9\u4E0A\u597D\uFF0C\u6797\u5C0F\u5317",
          lead: "\u4F60\u6709 7 \u9879\u5F85\u529E\uFF0C3 \u4E2A\u91CD\u8981\u63D0\u9192",
          hero: "\u4F1A\u5458\u589E\u957F\u8FDB\u5EA6",
          heroMeta: "\u672C\u6708\u65B0\u589E 128 \u4EBA \xB7 \u8F83\u4E0A\u6708 +32.6%",
          action: "\u67E5\u770B\u589E\u957F\u5EFA\u8BAE",
          tiles: [
            ["\u65B0\u4F1A\u5458\u5F85\u8DDF\u8FDB", "3", "receipt"],
            ["\u5F85\u5904\u7406\u5DE5\u5355", "2", "card"],
            ["\u8BFE\u7A0B\u5F85\u53D1\u5E03", "1", "calendar"],
            ["\u5185\u5BB9\u5F85\u63A8\u9001", "1", "megaphone"]
          ],
          listTitle: "AI \u589E\u957F\u6D1E\u5BDF",
          list: ["\u6DF1\u5733\u533A\u57DF\u589E\u957F\u52BF\u5934\u5F3A\u52B2", "\u5EFA\u8BAE\u8865\u5145\u9AD8\u8F6C\u5316\u8BFE\u7A0B\u5185\u5BB9", "3 \u4F4D\u4F1A\u5458\u5DF2\u89E6\u8FBE\u670D\u52A1\u65F6\u6548"]
        },
        pc: {
          nav: ["\u8FD0\u8425\u9A7E\u9A76\u8231", "\u4F1A\u5458\u7BA1\u7406", "\u73ED\u7EA7\u7BA1\u7406", "\u8BA2\u5355\u7BA1\u7406", "\u5DE5\u5355\u7BA1\u7406", "AI \u6D1E\u5BDF"],
          kpis: [
            ["\u65B0\u589E\u4F1A\u5458", "128", "+45.3%"],
            ["\u6D3B\u8DC3\u4F1A\u5458", "1,326", "+12.6%"],
            ["\u8BA2\u5355\u91D1\u989D", "\xA568,560", "+23.5%"],
            ["\u5DE5\u5355\u5904\u7406\u7387", "92.1%", "+6.3%"]
          ],
          mainTitle: "\u4F1A\u5458\u589E\u957F\u8D8B\u52BF",
          sideTitle: "\u5173\u7CFB\u94FE\u56FE\u8C31",
          tasks: ["\u4F1A\u5458\u95EE\u9898 \xB7 \u65E0\u6CD5\u67E5\u770B\u8BFE\u7A0B\u5185\u5BB9", "\u652F\u4ED8\u95EE\u9898 \xB7 \u8BA2\u5355\u72B6\u6001\u672A\u540C\u6B65", "\u8BFE\u7A0B\u95EE\u9898 \xB7 \u76F4\u64AD\u5165\u53E3\u5F02\u5E38"]
        }
      },
      network: {
        eyebrow: "\u65B9\u6848\u4E8C",
        title: "\u8D44\u6E90\u4EA4\u6362\u7F51\u7EDC",
        line: "\u8BA9\u63A8\u8350\u4EBA\u3001\u670D\u52A1\u8001\u5E08\u3001\u533A\u57DF\u4E3B\u7406\u4EBA\u548C\u8D44\u6E90\u4EF7\u503C\u6D41\u52A8\u8D77\u6765\u3002",
        tone: "network",
        tags: ["\u5173\u7CFB\u94FE", "\u8D44\u6E90\u5BF9\u63A5", "\u6536\u76CA\u53D8\u73B0", "\u670D\u52A1\u4EA4\u63A5"],
        mobile: {
          hello: "\u6797\u6653\u665A",
          lead: "\u54C1\u724C\u4E3B\u7406\u4EBA \xB7 \u5E74\u5EA6\u4F1A\u5458",
          hero: "\u672C\u6708\u53EF\u53D8\u73B0\u72B6\u6001",
          heroMeta: "\u9884\u8BA1\u6536\u76CA \xA528,560 \xB7 \u5DF2\u5F00\u542F",
          action: "\u67E5\u770B\u6536\u76CA\u660E\u7EC6",
          tiles: [
            ["\u8D44\u6E90\u5BF9\u63A5", "8", "handshake"],
            ["\u5BFC\u5E08\u54A8\u8BE2", "11", "headset"],
            ["\u793E\u7FA4\u94FE\u63A5", "6", "members"],
            ["\u54C1\u724C\u66DD\u5149", "4", "sparkle"]
          ],
          listTitle: "\u6211\u7684\u5173\u7CFB\u94FE",
          list: ["\u63A8\u8350\u4EBA\u5468\u822A\u5DF2\u8F6C\u4ECB\u7ECD 2 \u4F4D", "\u670D\u52A1\u8001\u5E08\u5F20\u96EA\u5F85\u4EA4\u63A5\u8D44\u6E90", "\u534E\u4E1C\u533A\u4E3B\u7406\u4EBA\u53EF\u534F\u540C\u6D3B\u52A8"]
        },
        pc: {
          nav: ["\u5DE5\u4F5C\u53F0", "\u5173\u7CFB\u7F51\u7EDC", "\u6210\u5458\u7BA1\u7406", "\u533A\u57DF\u7BA1\u7406", "\u8D44\u6E90\u5E93", "\u670D\u52A1\u4EA4\u63A5"],
          kpis: [
            ["\u533A\u57DF\u5206\u652F", "23", "+2"],
            ["\u6536\u5165", "\xA5126,560", "+12.6%"],
            ["\u8BA2\u5355\u6570", "89", "+18"],
            ["\u8F6C\u5316\u7387", "32.6%", "+4.2%"]
          ],
          mainTitle: "\u5173\u7CFB\u7F51\u7EDC\u56FE",
          sideTitle: "\u670D\u52A1\u4EA4\u63A5\u961F\u5217",
          tasks: ["\u54C1\u724C\u5B9A\u4F4D\u54A8\u8BE2 \xB7 \u5F20\u7426\u8F6C\u9648\u58A8", "\u5546\u4E1A\u8BA1\u5212\u4E66\u4F18\u5316 \xB7 \u5468\u822A\u8F6C\u5F20\u7426", "\u4F9B\u5E94\u94FE\u8D44\u6E90\u5BF9\u63A5 \xB7 \u9648\u58A8\u8F6C\u8D44\u6E90\u5E93"]
        }
      },
      mentor: {
        eyebrow: "\u65B9\u6848\u4E09",
        title: "AI \u966A\u8DD1\u4E2D\u67A2",
        line: "\u628A AI \u8BCA\u65AD\u3001\u6BCF\u65E5\u4EFB\u52A1\u548C\u4EBA\u5DE5\u670D\u52A1\u534F\u540C\u6210\u4E00\u6761\u6210\u957F\u8DEF\u5F84\u3002",
        tone: "mentor",
        tags: ["AI \u8BCA\u65AD", "\u4EFB\u52A1\u9A71\u52A8", "\u670D\u52A1\u534F\u540C", "\u81EA\u52A8\u5316\u8FD0\u8425"],
        mobile: {
          hello: "\u4F60\u597D\uFF0C\u6797\u5C0F\u5317",
          lead: "AI \u5065\u5EB7\u6210\u957F\u5206 86 \xB7 \u826F\u597D",
          hero: "\u4ECA\u65E5\u6210\u957F\u4EFB\u52A1",
          heroMeta: "\u4F18\u5316\u4E3B\u9875\u4FE1\u606F \xB7 \u9884\u8BA1\u83B7\u5F97 20 \u6210\u957F\u503C",
          action: "\u5F00\u59CB\u4ECA\u65E5\u4EFB\u52A1",
          tiles: [
            ["AI \u8BCA\u65AD", "86", "pulse"],
            ["\u4ECA\u65E5\u4EFB\u52A1", "4", "check"],
            ["\u670D\u52A1\u63D0\u9192", "3", "bell"],
            ["\u4F1A\u5458\u5347\u7EA7", "1", "crown"]
          ],
          listTitle: "\u670D\u52A1\u63D0\u9192",
          list: ["\u4E13\u5C5E\u987E\u95EE 14:00 \u8054\u7CFB\u4F60", "\u54C1\u724C\u5B9A\u4F4D\u8BCA\u65AD\u62A5\u544A\u5DF2\u751F\u6210", "\u8BFE\u7A0B\u56DE\u653E\u5DF2\u5B66\u4E60 65%"]
        },
        pc: {
          nav: ["\u5DE5\u4F5C\u53F0", "AI \u6D1E\u5BDF", "\u670D\u52A1\u5DE5\u5355", "\u516C\u544A\u7BA1\u7406", "\u9000\u6B3E\u5BA1\u6838", "\u4EFB\u52A1\u81EA\u52A8\u5316"],
          kpis: [
            ["\u6D3B\u8DC3\u4E3B\u7406\u4EBA", "2,428", "+8.2%"],
            ["AI \u5065\u5EB7\u5747\u503C", "78.6", "+4.1"],
            ["\u4EFB\u52A1\u5B8C\u6210\u7387", "63.2%", "+6.3%"],
            ["\u5DE5\u5355\u89E3\u51B3\u7387", "92.1%", "+3.7%"]
          ],
          mainTitle: "AI \u6D1E\u5BDF\u4E0E\u670D\u52A1\u5DE5\u5355",
          sideTitle: "\u4EFB\u52A1\u81EA\u52A8\u5316",
          tasks: ["\u8BFE\u7A0B\u95EE\u9898 \xB7 \u9AD8\u4F18\u5148\u7EA7", "\u529F\u80FD\u54A8\u8BE2 \xB7 \u4E2D\u4F18\u5148\u7EA7", "\u9000\u6B3E\u54A8\u8BE2 \xB7 \u4F4E\u4F18\u5148\u7EA7"]
        }
      }
    };
    const concept = concepts[active];
    return /* @__PURE__ */ React.createElement("main", { className: "concept-page concept-" + concept.tone }, /* @__PURE__ */ React.createElement("section", { className: "concept-topbar" }, /* @__PURE__ */ React.createElement("div", { className: "concept-brand" }, /* @__PURE__ */ React.createElement("div", { className: "concept-logo" }, /* @__PURE__ */ React.createElement(Icon, { name: "gemlogo", size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\u4E3B\u7406\u4EBA\u516C\u793E"), /* @__PURE__ */ React.createElement("span", null, "AI \u65F6\u4EE3\u4E3B\u7406\u4EBA\u6210\u957F\u4E0E\u8D44\u6E90\u53D8\u73B0\u5E73\u53F0"))), /* @__PURE__ */ React.createElement("div", { className: "concept-tabs", role: "tablist", "aria-label": "\u7CFB\u7EDF\u65B9\u6848\u5207\u6362" }, Object.entries(concepts).map(([key, item]) => /* @__PURE__ */ React.createElement("button", { key, className: active === key ? "on" : "", onClick: () => setActive(key) }, /* @__PURE__ */ React.createElement("small", null, item.eyebrow), /* @__PURE__ */ React.createElement("b", null, item.title)))), /* @__PURE__ */ React.createElement("button", { className: "concept-back", onClick: () => nav("home") }, /* @__PURE__ */ React.createElement(Icon, { name: "phone", size: 17, color: "currentColor" }), " \u5C0F\u7A0B\u5E8F\u9875\u9762")), /* @__PURE__ */ React.createElement("section", { className: "concept-hero" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "concept-eyebrow" }, concept.eyebrow), /* @__PURE__ */ React.createElement("h1", null, concept.title), /* @__PURE__ */ React.createElement("p", null, concept.line)), /* @__PURE__ */ React.createElement("div", { className: "concept-tags" }, concept.tags.map((tag) => /* @__PURE__ */ React.createElement("span", { key: tag }, tag)))), /* @__PURE__ */ React.createElement("section", { className: "concept-stage" }, /* @__PURE__ */ React.createElement(MobileConcept, { concept }), /* @__PURE__ */ React.createElement(PcConcept, { concept })));
  }
  function MobileConcept({ concept }) {
    return /* @__PURE__ */ React.createElement("div", { className: "concept-mobile" }, /* @__PURE__ */ React.createElement("div", { className: "concept-mobile-status" }, /* @__PURE__ */ React.createElement("span", null, "9:41"), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("div", { className: "concept-mobile-head" }, /* @__PURE__ */ React.createElement("div", { className: "concept-avatar portrait portrait-shirley" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, concept.mobile.hello), /* @__PURE__ */ React.createElement("span", null, concept.mobile.lead)), /* @__PURE__ */ React.createElement("button", { onClick: () => prototypeDialog({ title: "\u6700\u65B0\u63D0\u9192", body: "3 \u4E2A\u91CD\u8981\u63D0\u9192\uFF1A\u670D\u52A1\u8DDF\u8FDB\u3001\u8BFE\u7A0B\u53D1\u5E03\u4E0E\u5DE5\u5355\u5904\u7406\u3002\u8FDB\u5165\u5C0F\u7A0B\u5E8F\u53EF\u67E5\u770B\u5B8C\u6574\u6D88\u606F\u3002" }) }, /* @__PURE__ */ React.createElement(Icon, { name: "bell", size: 16, color: "#fff" }))), /* @__PURE__ */ React.createElement("div", { className: "concept-mobile-hero" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, concept.mobile.hero), /* @__PURE__ */ React.createElement("strong", null, concept.mobile.heroMeta)), /* @__PURE__ */ React.createElement("button", { onClick: () => prototypeToast(`${concept.mobile.action}\u5DF2\u6253\u5F00`) }, concept.mobile.action)), /* @__PURE__ */ React.createElement("div", { className: "concept-mobile-grid" }, concept.mobile.tiles.map(([label, value, icon]) => /* @__PURE__ */ React.createElement("div", { key: label }, /* @__PURE__ */ React.createElement(Icon, { name: icon === "check" ? "shield" : icon, size: 18, color: "currentColor" }), /* @__PURE__ */ React.createElement("b", null, value), /* @__PURE__ */ React.createElement("span", null, label)))), /* @__PURE__ */ React.createElement("div", { className: "concept-mobile-list" }, /* @__PURE__ */ React.createElement("div", { className: "concept-card-title" }, concept.mobile.listTitle, /* @__PURE__ */ React.createElement("span", { onClick: () => prototypeToast("\u5DF2\u5C55\u793A\u5168\u90E8\u5185\u5BB9") }, "\u67E5\u770B\u5168\u90E8")), concept.mobile.list.map((item, index) => /* @__PURE__ */ React.createElement("div", { className: "concept-row", key: item }, /* @__PURE__ */ React.createElement("i", null, index + 1), /* @__PURE__ */ React.createElement("p", null, item), /* @__PURE__ */ React.createElement(Icon, { name: "chev", size: 14, color: "#6f7a98" })))));
  }
  function PcConcept({ concept }) {
    const [activeNav, setActiveNav] = React.useState(concept.pc.nav[0]);
    React.useEffect(() => setActiveNav(concept.pc.nav[0]), [concept]);
    return /* @__PURE__ */ React.createElement("div", { className: "concept-pc" }, /* @__PURE__ */ React.createElement("aside", { className: "concept-sidebar" }, /* @__PURE__ */ React.createElement("div", { className: "concept-pc-logo" }, /* @__PURE__ */ React.createElement(Icon, { name: "gemlogo", size: 18 }), "\u4E3B\u7406\u4EBA\u516C\u793E"), concept.pc.nav.map((item, index) => /* @__PURE__ */ React.createElement("button", { key: item, className: activeNav === item ? "on" : "", onClick: () => {
      setActiveNav(item);
      prototypeToast(`\u5DF2\u5207\u6362\u5230${item}`);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: ["home", "members", "link", "folder", "card", "sparkle"][index] || "grid", size: 15, color: "currentColor" }), item))), /* @__PURE__ */ React.createElement("section", { className: "concept-pc-main" }, /* @__PURE__ */ React.createElement("div", { className: "concept-pc-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, concept.title), /* @__PURE__ */ React.createElement("span", null, "\u6570\u636E\u66F4\u65B0\u65F6\u95F4\uFF1A2025-05-20 09:30")), /* @__PURE__ */ React.createElement("div", { className: "concept-search" }, /* @__PURE__ */ React.createElement(Icon, { name: "search", size: 15, color: "#7f8aa8" }), "\u641C\u7D22\u6210\u5458 / \u8BA2\u5355 / \u73ED\u7EA7 / \u8D44\u6E90")), /* @__PURE__ */ React.createElement("div", { className: "concept-kpis" }, concept.pc.kpis.map(([label, value, delta]) => /* @__PURE__ */ React.createElement("div", { key: label }, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement("strong", null, value), /* @__PURE__ */ React.createElement("em", null, delta)))), /* @__PURE__ */ React.createElement("div", { className: "concept-pc-grid" }, /* @__PURE__ */ React.createElement("div", { className: "concept-panel concept-chart" }, /* @__PURE__ */ React.createElement("div", { className: "concept-card-title" }, concept.pc.mainTitle, /* @__PURE__ */ React.createElement("span", { onClick: () => prototypeToast("\u8D8B\u52BF\u8BE6\u60C5\u5DF2\u5C55\u5F00") }, "\u67E5\u770B\u8BE6\u60C5")), /* @__PURE__ */ React.createElement("div", { className: "concept-line-chart" }, /* @__PURE__ */ React.createElement("i", { style: { height: "38%" } }), /* @__PURE__ */ React.createElement("i", { style: { height: "50%" } }), /* @__PURE__ */ React.createElement("i", { style: { height: "44%" } }), /* @__PURE__ */ React.createElement("i", { style: { height: "66%" } }), /* @__PURE__ */ React.createElement("i", { style: { height: "72%" } }), /* @__PURE__ */ React.createElement("i", { style: { height: "84%" } }))), /* @__PURE__ */ React.createElement("div", { className: "concept-panel concept-map" }, /* @__PURE__ */ React.createElement("div", { className: "concept-card-title" }, concept.pc.sideTitle, /* @__PURE__ */ React.createElement("span", { onClick: () => prototypeToast("\u5173\u7CFB\u56FE\u8C31\u5DF2\u5C55\u5F00") }, "\u5C55\u5F00")), /* @__PURE__ */ React.createElement("div", { className: "concept-node center" }, "\u6797\u5C0F\u5317"), /* @__PURE__ */ React.createElement("div", { className: "concept-node n1" }, "\u63A8\u8350\u4EBA"), /* @__PURE__ */ React.createElement("div", { className: "concept-node n2" }, "\u670D\u52A1\u8001\u5E08"), /* @__PURE__ */ React.createElement("div", { className: "concept-node n3" }, "\u8D44\u6E90\u5E93"), /* @__PURE__ */ React.createElement("div", { className: "concept-node n4" }, "\u533A\u57DF\u4E3B\u7406")), /* @__PURE__ */ React.createElement("div", { className: "concept-panel concept-table" }, /* @__PURE__ */ React.createElement("div", { className: "concept-card-title" }, "\u4ECA\u65E5\u5F85\u5904\u7406", /* @__PURE__ */ React.createElement("span", { onClick: () => prototypeToast("\u5DF2\u5C55\u793A\u5168\u90E8\u5F85\u5904\u7406\u4E8B\u9879") }, "\u5168\u90E8")), concept.pc.tasks.map((item, index) => /* @__PURE__ */ React.createElement("div", { className: "concept-table-row", key: item }, /* @__PURE__ */ React.createElement("span", null, "#S2024052", index + 1), /* @__PURE__ */ React.createElement("b", null, item), /* @__PURE__ */ React.createElement("em", null, index === 0 ? "\u9AD8" : index === 1 ? "\u4E2D" : "\u4F4E"), /* @__PURE__ */ React.createElement("button", { onClick: () => prototypeToast(`\u5DE5\u5355 #S2024052${index + 1} \u5DF2\u8FDB\u5165\u5904\u7406\u961F\u5217`) }, "\u5904\u7406")))))));
  }
  Object.assign(window, { SystemVariantsScreen });
})();
