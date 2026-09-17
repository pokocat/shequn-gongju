import { useEffect, useRef, useState } from "react";

type ZhuLiRenAppProps = {
  onOpenWeb: () => void;
  onOpenPc: () => void;
  onOpenMobile: () => void;
};

/**
 * The mini-program is intentionally hosted from static bundles in `public/`.
 * Keeping their DOM/CSS/interaction together preserves each source
 * pixel-for-pixel while the parent app still owns global view switching.
 *
 * 三个源刻意都留着，因为它们回答的是不同的问题：
 *  · **实现** `/member-app/`     —— 线上代码导出的 147 屏前端页面（HTML/CSS/JS）。
 *                                 **设计修改的工作台**：它本身就是前端代码，所见即所得地改；
 *                                 定稿后再同步到小程序源码仓库。
 *  · **实时** `:8091`            —— 小程序源码（ai-univ/主理人）构建的 H5 运行版，
 *                                 用来核对设计落到真实源码后的运行效果（Taro 转换有渲染差异，
 *                                 不追求与实现像素一致）；
 *  · **原型** `/zhuliren-final/` —— 已定稿的设计原型（64 屏，可交互），是设计意图的事实源。
 * 三个源的整机展示统一为 430×932 手机壳规格——切源时只有内容变，机器不变。
 * 默认落在实现：设计迭代发生在这里。
 */
const SOURCES = [
  {
    id: "impl" as const,
    label: "实现",
    title: "主理人公社小程序 · 前端设计（线上代码导出）",
    src: "/member-app/shell.html?embed=1",
    hint: "前端代码 · 直接修改 · 147 屏",
  },
  {
    id: "live" as const,
    label: "实时",
    title: "主理人公社小程序 · 实时 H5（源码构建）",
    src: "http://localhost:8091/",
    hint: "ai-univ 源码构建 · 核对运行效果",
  },
  {
    id: "proto" as const,
    label: "原型",
    title: "主理人公社小程序 · 设计原型",
    src: "/zhuliren-final/index.html?screen=home&embed=1&version=20260814c",
    hint: "已定稿的可交互原型",
  },
];

/** 与「实现」shell.html 同款手机壳：固定 430×932（设计稿画布），整机等比缩放适配宿主 tab。
 *  宽度不能跟着视口变——一变，rem 适配的 H5 就不再是「所见即设计稿」。 */
function PhoneFrame({ src, title }: { src: string; title: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.max(0.2, Math.min(1, (r.height - 8) / 932, (r.width - 8) / 430)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        style={{
          width: 430,
          height: 932,
          flex: "0 0 auto",
          transformOrigin: "center center",
          transform: `scale(${scale})`,
          borderRadius: 46,
          overflow: "hidden",
          background: "#FFF7EC",
          boxShadow:
            "0 0 0 9px #fff, 0 0 0 10px rgba(25,33,16,.12), 0 28px 72px rgba(35,45,20,.18)",
        }}
      >
        <iframe title={title} src={src} className="block h-full w-full border-0" />
      </div>
    </div>
  );
}

export default function ZhuLiRenApp({ onOpenWeb, onOpenPc, onOpenMobile }: ZhuLiRenAppProps) {
  const [sourceId, setSourceId] = useState<"live" | "impl" | "proto">("impl");
  const source = SOURCES.find(s => s.id === sourceId) ?? SOURCES[0];

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#f4f6ee] pt-[52px] pb-3">
      <nav aria-label="系统视图切换" className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 overflow-hidden rounded-full border border-[#d8e5c5] bg-white shadow-[0_6px_18px_rgba(45,61,29,0.10)]">
        <button type="button" onClick={onOpenWeb} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">WEB</button>
        <button type="button" onClick={onOpenPc} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">PC</button>
        <button type="button" onClick={onOpenMobile} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">会员APP</button>
        <span className="bg-[#b9ff3d] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-black">主理人</span>
      </nav>

      {/* 原型 / 实现 / 实时：右上角，与中间的视图切换分开——它切的是「同一个产品的哪一份稿」，不是切视图 */}
      <div className="absolute right-3 top-2 z-10 flex items-center gap-2">
        <span className="hidden max-w-[240px] truncate text-[10px] text-[#79826f] lg:inline" title={source.hint}>{source.hint}</span>
        <div role="group" aria-label="页面来源" className="flex overflow-hidden rounded-full border border-[#d8e5c5] bg-white shadow-[0_6px_18px_rgba(45,61,29,0.10)]">
          {SOURCES.map(s => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === sourceId}
              onClick={() => setSourceId(s.id)}
              className={
                "px-3 py-2 font-mono text-[11px] font-bold tracking-wide transition-colors " +
                (s.id === sourceId ? "bg-[#b9ff3d] text-black" : "text-[#6b7562] hover:bg-[#f6faee]")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 实时源：外层手机壳与「实现」同规格（430×932·圆角46·白边+投影），等比缩放居中。
          实现/原型内部自带同规格 shell，直接铺满。key 绑 sourceId：切换重建，避免内部路由残留。 */}
      {source.id === "live" ? (
        <PhoneFrame title={source.title} src={source.src} />
      ) : (
        <iframe
          key={source.id}
          title={source.title}
          src={source.src}
          className="block h-full w-full border-0"
        />
      )}
    </div>
  );
}
