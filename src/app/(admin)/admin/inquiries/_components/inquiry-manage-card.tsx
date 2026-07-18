import type { Inquiry } from "./types";

export function InquiryManageCard({
  inquiry, status, setStatus, adminNote, setAdminNote, saving, save,
}: {
  inquiry: Inquiry;
  status: string;
  setStatus: (value: string) => void;
  adminNote: string;
  setAdminNote: (value: string) => void;
  saving: boolean;
  save: () => Promise<void>;
}) {
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <h2 className="text-sm font-semibold text-[#0a0a0a]">Manage</h2>
      <div className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-[#0a0a0a]">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]"><option value="unread">Unread</option><option value="read">Read</option><option value="replied">Replied</option></select></label>
        <label className="block text-sm font-medium text-[#0a0a0a]">Admin note<textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" placeholder="Internal notes..." /></label>
        <button onClick={save} disabled={saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
        <div className="rounded-lg border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4"><p className="text-xs font-semibold text-[#0a0a0a]">Reply (optional)</p><p className="mt-1 text-xs text-[#5A5E55]">A built-in email reply workflow can be added next (SMTP/provider).</p><a className="mt-3 inline-flex text-sm font-semibold text-[#f6a45d] hover:underline" href={`mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(`Re: ${inquiry.subject}`)}`}>Reply via email -&gt;</a></div>
      </div>
    </div>
  );
}
