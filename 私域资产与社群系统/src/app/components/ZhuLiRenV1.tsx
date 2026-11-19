import { useEffect, useRef } from "react";

export default function ZhuLiRenV1({ preview }: { preview: { x: number; y: number; scale: number } }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const sendPreview = () => frame.current?.contentWindow?.postMessage({ type: "principal-preview-transform", ...preview }, window.location.origin);
  useEffect(() => { sendPreview(); }, [preview]);
  return (
    <div className="h-screen w-full overflow-hidden bg-[#fff7ec]">
      <iframe
        ref={frame}
        onLoad={sendPreview}
        title="主理人1旧版会员小程序预览"
        src="/principal-1-h5/shell.html?screen=index"
        className="block h-full w-full border-0"
      />
    </div>
  );
}
