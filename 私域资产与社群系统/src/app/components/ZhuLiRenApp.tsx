type ZhuLiRenAppProps = {
  onOpenWeb: () => void;
  onOpenPc: () => void;
  onOpenMobile: () => void;
};

/**
 * The mini-program is intentionally hosted from the reference prototype.
 * Keeping its DOM/CSS/interaction together preserves the approved prototype
 * pixel-for-pixel while the parent app still owns global view switching.
 */
export default function ZhuLiRenApp({ onOpenWeb, onOpenPc, onOpenMobile }: ZhuLiRenAppProps) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#f4f6ee] pt-[52px] pb-3">
      <nav aria-label="系统视图切换" className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 overflow-hidden rounded-full border border-[#d8e5c5] bg-white shadow-[0_6px_18px_rgba(45,61,29,0.10)]">
        <button type="button" onClick={onOpenWeb} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">WEB</button>
        <button type="button" onClick={onOpenPc} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">PC</button>
        <button type="button" onClick={onOpenMobile} className="border-r border-[#e7eddc] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-[#6b7562] hover:bg-[#f6faee]">会员APP</button>
        <span className="bg-[#b9ff3d] px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-black">主理人</span>
      </nav>
      <iframe
        title="主理人公社小程序"
        src="/zhuliren-final/index.html?screen=home&embed=1&version=20260814c"
        className="block h-full w-full border-0"
      />
    </div>
  );
}
