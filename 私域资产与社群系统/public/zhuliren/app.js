const isEmbedded = new URLSearchParams(window.location.search).get("embed") === "1";

if (isEmbedded) {
  document.body.classList.add("is-embedded");
}

const viewButtons = document.querySelectorAll("[data-view]");
const viewPanels = {
  mini: document.querySelector("#mini-view"),
  admin: document.querySelector("#admin-view"),
};

function setView(nextView) {
  document.body.dataset.activeView = nextView;
  viewButtons.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === nextView);
  });
  Object.entries(viewPanels).forEach(([key, panel]) => {
    panel.classList.toggle("is-active", key === nextView);
  });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isEmbedded && button.dataset.view === "admin") {
      window.top.location.assign("/?view=pc");
      return;
    }
    setView(button.dataset.view);
  });
});

const screenButtons = document.querySelectorAll("[data-screen]");
const screenPanels = document.querySelectorAll("[data-screen-panel]");

function setScreen(nextScreen) {
  document.body.dataset.activeScreen = nextScreen;
  screenButtons.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.screen === nextScreen);
  });
  screenPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.screenPanel === nextScreen);
  });
}

screenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setScreen(button.dataset.screen);
  });
});

document.querySelectorAll("[data-next-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    setScreen(button.dataset.nextScreen);
  });
});

const adminTitles = {
  overview: "运营总览",
  members: "会员管理",
  relations: "关系链树",
  classes: "分班与教务",
  ai: "AI军师",
  content: "信息发布",
  orders: "订单权益",
  wechat: "微信联动",
};

const adminButtons = document.querySelectorAll("[data-admin]");
const adminTitle = document.querySelector("#admin-title");

adminButtons.forEach((button) => {
  button.addEventListener("click", () => {
    adminButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    adminTitle.textContent = adminTitles[button.dataset.admin] || "运营总览";
  });
});

setView("mini");
setScreen("login");
