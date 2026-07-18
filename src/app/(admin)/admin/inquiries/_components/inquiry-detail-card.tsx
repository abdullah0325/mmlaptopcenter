import type { Inquiry } from "./types";

export function InquiryDetailCard({ inquiry }: { inquiry: Inquiry }) {
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><div className="text-sm font-semibold text-[#0a0a0a]">{inquiry.name}</div><div className="text-sm text-[#5A5E55]">{inquiry.email}</div>{inquiry.phone ? <div className="text-sm text-[#5A5E55]">{inquiry.phone}</div> : null}</div>
        <span className="rounded-full bg-[#fcf5e8] px-3 py-1 text-xs font-semibold text-[#0a0a0a]">{inquiry.type}</span>
      </div>
      <h2 className="mt-6 text-base font-semibold text-[#0a0a0a]">{inquiry.subject}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5A5E55]">{inquiry.message}</p>
    </div>
  );
}
