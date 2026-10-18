import { ArrowLeft, Bell, Check, FileText, Headphones, Settings, ShoppingBag, Sparkles, Users, WalletCards } from "lucide-react";

type DetailKind = "conversation" | "system";

export type ZhuLiRenMessageDetailProps = {
  kind: DetailKind;
  title: string;
  preview: string;
  unread?: number;
  onBack: () => void;
};

export default function ZhuLiRenMessageDetail({ kind, title, preview, unread = 0, onBack }: ZhuLiRenMessageDetailProps) {
  return <div className="min-h-screen bg-[#f7f6f1]"><header className="flex items-center gap-3 px-5 pb-4 pt-[max(18px,env(safe-area-inset-top))]"><button aria-label="返回消息列表" onClick={onBack} className="rounded-full p-2 text-[#687568] hover:bg-[#ecefe8]"><ArrowLeft size={20} /></button><div><h1 className="text-[19px] font-semibold text-[#293129]">{title}</h1><p className="text-[11px] text-[#969b91]">{kind === "system" ? "系统通知" : "消息会话"}</p></div></header><main className="space-y-4 px-4 pb-8"><div className="rounded-3xl bg-[#3f6748] p-5 text-white"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-[13px] font-semibold">{kind === "system" ? <Bell size={18} /> : <img src={title.includes("项目群") ? "/principal-1-h5/assets/avatars/people/avatar-16.jpg" : "/principal-1-h5/assets/avatars/people/avatar-18.jpg"} alt="" className="h-full w-full object-cover" />}</span><div><div className="text-[14px] font-semibold">{title}</div><div className="mt-1 text-[10px] text-[#d4e3ce]">{unread > 0 ? `${unread} 条未读消息` : "已读"}</div></div></div></div><div className="space-y-3"><div className="text-center text-[10px] text-[#a1a69e]">今天 09:42</div><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9e8ff] text-[10px] text-[#315a9c]">{kind === "system" ? "系" : <img src={title.includes("项目群") ? "/principal-1-h5/assets/avatars/people/avatar-16.jpg" : "/principal-1-h5/assets/avatars/people/avatar-18.jpg"} alt="" className="h-full w-full object-cover" />}</span><div className="rounded-2xl rounded-tl-sm bg-white p-4 text-[12px] leading-6 text-[#555e54] shadow-sm">{preview}</div></div><div className="flex justify-end"><div className="rounded-2xl rounded-tr-sm bg-[#e8f0e5] p-4 text-[12px] leading-6 text-[#456c48]">收到，我会按照提醒继续完成下一步。</div></div></div><div className="rounded-2xl border border-[#e8e5dc] bg-white p-4 text-[11px] text-[#858e83]">本地演示会话：消息已读状态和后续动作由页面状态模拟。</div></main></div>;
}
