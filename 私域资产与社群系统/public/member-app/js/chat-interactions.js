/* 聊天页交互增强（仅作用于公开预览的静态聊天页）
 * A. 富卡片操作闭环：点击卡片 / CTA 打开居中详情弹窗，主按钮跳转对应小程序页面
 * B. 输入栏状态反馈：输入框聚焦、语音切换的静态反馈；表情/加号仅 Toast 提示
 * C. 消息阅读与定位：进入即定位最新消息、回到底部悬浮钮、新消息已读态
 * 注意：全部为演示效果，不会真正发送消息或联网。
 */
(function () {
  "use strict";

  /* 各聊天页卡片按钮 → 对应小程序页面（无映射则为 null，仅 Toast 引导） */
  var NAV_MAP = {
    "chat--成长教练": { "查看计划": "tasks", "开始复盘": "diagnosis" },
    "chat--课程顾问": { "进入直播间": "course", "添加到日历": null },
    "chat--社群运营": { "查看群详情": "group", "数据周报": null },
    "chat--财务官": { "核对明细": "earnings", "去提现": "earnings" },
    "chat--班班": { "去提交": "course", "查看要求": "course" },
    "chat--服务导师": { "查看报告": "diagnosis", "预约解读": "diagnosis-booking" },
    "chat--专属顾问": { "确认名额": "booking-result", "查看详情": null }
  };

  function init() {
    var screen = document.querySelector(".chat-screen");
    var flow = document.querySelector(".chat-flow");
    var dock = document.querySelector(".chat-dock");
    if (!screen || !flow || !dock) return;

    var field = dock.querySelector(".chat-field");
    if (!field) return;
    field.dataset.mode = "text";
    field.dataset.empty = "1";
    field.setAttribute("role", "textbox");
    field.setAttribute("tabindex", "0");
    if (!field.getAttribute("aria-label")) field.setAttribute("aria-label", "发送消息");

    var slug = "";
    try {
      slug = decodeURIComponent(location.pathname.split("/").pop().replace(/\.html$/, ""));
    } catch (e) {
      slug = location.pathname.split("/").pop().replace(/\.html$/, "");
    }
    var pageMap = NAV_MAP[slug] || {};

    /* ---------- 工具函数 ---------- */
    function make(tag, cls, text) {
      var el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text != null) el.textContent = text;
      return el;
    }

    /* ---------- Toast ---------- */
    var toast = make("div", "chat-toast");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    screen.appendChild(toast);
    var toastTimer = null;
    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove("is-show");
      }, 1900);
    }

    /* ---------- 居中详情弹窗（富卡片操作闭环） ---------- */
    var mask = make("div", "chat-sheet-mask");
    var sheet = make("div", "chat-sheet");
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", "卡片详情");
    var head = make("div", "chat-sheet-head");
    var titleEl = make("span", "chat-sheet-title");
    var closeBtn = make("button", "chat-sheet-close", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "关闭弹窗");
    head.appendChild(titleEl);
    head.appendChild(closeBtn);
    sheet.appendChild(head);
    var bodyEl = make("div", "chat-sheet-body");
    sheet.appendChild(bodyEl);
    var actions = make("div", "chat-sheet-actions");
    var priBtn = make("button", "chat-sheet-btn chat-sheet-btn--pri", "知道了");
    var ghostBtn = make("button", "chat-sheet-btn chat-sheet-btn--ghost", "关闭");
    priBtn.type = "button";
    ghostBtn.type = "button";
    actions.appendChild(priBtn);
    actions.appendChild(ghostBtn);
    sheet.appendChild(actions);
    screen.appendChild(mask);
    screen.appendChild(sheet);

    var currentTarget = null;

    function openSheet(card, ctaLabel) {
      var cardTitle = card.querySelector(".chat-card-t");
      titleEl.textContent = cardTitle ? cardTitle.textContent.trim() : "详情";
      bodyEl.innerHTML = "";
      var hasRow = false;
      card.querySelectorAll(".chat-kv").forEach(function (row) {
        var l = row.querySelector(".chat-kv-l");
        var v = row.querySelector(".chat-kv-v");
        var r = make("div", "chat-sheet-row");
        r.appendChild(make("span", "chat-sheet-row-l", l ? l.textContent.trim() : ""));
        r.appendChild(make("span", "chat-sheet-row-v", v ? v.textContent.trim() : ""));
        bodyEl.appendChild(r);
        hasRow = true;
      });
      if (!hasRow) {
        bodyEl.appendChild(make("div", "chat-sheet-note", "详情内容以正式小程序展示为准。"));
      } else {
        bodyEl.appendChild(make("div", "chat-sheet-note", "点击下方按钮可跳转到对应的小程序页面。"));
      }
      var label = ctaLabel || "知道了";
      priBtn.textContent = label;
      currentTarget = ctaLabel && pageMap.hasOwnProperty(ctaLabel) ? pageMap[ctaLabel] : null;
      mask.classList.add("is-open");
      sheet.classList.add("is-open");
    }
    function closeSheet() {
      mask.classList.remove("is-open");
      sheet.classList.remove("is-open");
      currentTarget = null;
    }
    closeBtn.addEventListener("click", closeSheet);
    ghostBtn.addEventListener("click", closeSheet);
    mask.addEventListener("click", closeSheet);
    priBtn.addEventListener("click", function () {
      var target = currentTarget;
      var label = priBtn.textContent;
      if (target) {
        location.href = target + ".html" + location.search;
        return;
      }
      showToast("演示引导：接下来将进入「" + label + "」流程");
      closeSheet();
    });

    var cards = screen.querySelectorAll(".chat-card");
    cards.forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.addEventListener("click", function (e) {
        if (e.target.closest(".chat-cta")) return; // CTA 单独带按钮文案打开
        openSheet(card, "");
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSheet(card, "");
        }
      });
    });
    screen.addEventListener("click", function (e) {
      var cta = e.target && e.target.closest ? e.target.closest(".chat-cta") : null;
      if (!cta) return;
      var card = cta.closest(".chat-card");
      if (card) openSheet(card, cta.textContent.trim());
    });

    /* ---------- 回到底部 / 已读态 / 滚动定位 ---------- */
    var jump = make("button", "chat-jump", "回到底部");
    jump.type = "button";
    jump.setAttribute("aria-label", "回到最新消息");
    screen.appendChild(jump);

    function atBottom() {
      return flow.scrollHeight - flow.scrollTop - flow.clientHeight < 18;
    }
    /* 首次进入先保留「以下是新消息」红色分隔，短延迟后再标记已读 */
    var settled = false;
    function markRead() {
      var n = flow.querySelector(".chat-new");
      if (n && !n.classList.contains("is-read")) n.classList.add("is-read");
    }
    function updateJump() {
      if (atBottom()) {
        jump.classList.remove("is-show");
        if (settled) markRead();
      } else {
        jump.classList.add("is-show");
      }
    }
    setTimeout(function () {
      settled = true;
      if (atBottom()) markRead();
    }, 1600);
    jump.addEventListener("click", function () {
      flow.scrollTo({ top: flow.scrollHeight, behavior: "smooth" });
      updateJump();
      markRead();
    });
    flow.addEventListener("scroll", updateJump);

    /* ---------- 输入栏静态反馈 ---------- */
    function setVoiceMode(on) {
      if (on) {
        field.dataset.mode = "voice";
        field.textContent = "按住 说话";
        field.classList.add("is-voice");
        field.setAttribute("aria-label", "按住说话发送语音");
      } else {
        field.dataset.mode = "text";
        field.textContent = "";
        field.appendChild(make("span", "wx-text", "发送消息…"));
        field.classList.remove("is-voice");
        field.dataset.empty = "1";
        field.setAttribute("aria-label", "发送消息");
      }
    }

    field.addEventListener("click", function () {
      if (field.dataset.mode === "voice") return;
      field.classList.add("is-focus");
      setTimeout(function () { field.classList.remove("is-focus"); }, 260);
    });
    field.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (field.dataset.mode === "voice") return;
        showToast("演示预览：消息仅作展示，不会真正发送");
      }
    });
    field.addEventListener("pointerdown", function () {
      if (field.dataset.mode === "voice") field.textContent = "松开 结束";
    });
    field.addEventListener("pointerup", function () {
      if (field.dataset.mode === "voice") {
        field.textContent = "按住 说话";
        showToast("演示环境：语音消息不会真正发送");
      }
    });

    /* 底部工具：依次为 语音 / 表情 / 加号 */
    var tools = dock.querySelectorAll(".wxc-icon");
    function bindTool(el, handler, label) {
      if (!el) return;
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", label);
      el.style.cursor = "pointer";
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        handler();
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
    }
    bindTool(tools[0], function () {
      setVoiceMode(field.dataset.mode !== "voice");
      if (field.dataset.mode === "voice") showToast("点击输入条按住说话（演示）");
    }, "切换语音输入");
    bindTool(tools[1], function () { showToast("演示环境：暂不支持表情面板"); }, "表情");
    bindTool(tools[2], function () { showToast("演示环境：暂不支持更多功能"); }, "更多功能");

    /* Esc 关闭弹窗 */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSheet();
    });

    /* 进入页面即定位到最新消息 */
    flow.scrollTop = flow.scrollHeight;
    updateJump();
    window.addEventListener("load", function () {
      flow.scrollTop = flow.scrollHeight;
      updateJump();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();