import { useState } from "react";

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
 * 两个源刻意都留着，因为它们回答的是不同的问题：
 *  · **原型** `/zhuliren-final/` —— 已定稿的设计原型（64 屏，可交互），是设计意图的事实源；
 *  · **实现** `/member-app/`     —— 会员小程序**线上代码**（WXML/WXSS）导出的 147 屏静态页，
 *                                 由小程序仓库 `apps/member-app/tools/design-export` 生成。
 * 只留一个就没法「对着看差在哪」，而这个仓库存在的理由正是对比与追溯。
 * 默认落在实现：原型多数人已经看过，需要核对的是它到底做成了什么样。
 */
const SOURCES = [
  {
    id: "impl" as const,
    label: "实现",
    title: "会员小程序 · 线上实现",
    src: "/member-app/shell.html?embed=1",
    hint: "线上代码导出 · 147 屏",
  },
  {
    id: "proto" as const,
    label: "原型",
    title: "主理人公社小程序 · 设计原型",
    src: "/zhuliren-final/index.html?screen=home&embed=1&version=20260814c",
    hint: "已定稿的可交互原型",
  },
];

export default function ZhuLiRenApp({ onOpenWeb, onOpenPc, onOpenMobile }: ZhuLiRenAppProps) {
  const [sourceId, setSourceId] = useState<"impl" | "proto">("impl");
  const source = SOURCES.find(s => s.id === sourceId) ?? SOURCES[0];

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#f4f6ee] pt-[52px] pb-3">
      <nav aria-label="系统视图切换" className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 overflow-hidden rounded-full border border-[#d8e5c5] bg-white shadow-[0_6px_18px_rgba(45,61,29,0.10)]">
        <button type="button" onClick={onOpenWeb} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">WEB</button>
        <button type="button" onClick={onOpenPc} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">PC</button>
        <button type="button" onClick={onOpenMobile} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">会员APP</button>
        <span className="bg-[#b9ff3d] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-black">主理人</span>
      </nav>

      {/* 原型 / 实现：右上角，与中间的视图切换分开——它切的是「同一个产品的哪一份稿」，不是切视图 */}
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

      {/* key 绑 sourceId：切换时重建 iframe，避免复用同一个文档导致上一份的滚动位置与内部路由残留 */}
      <iframe
        key={source.id}
        title={source.title}
        src={source.src}
        className="block h-full w-full border-0"
      />
    </div>
  );
}
