import { Panel } from "./recent-orders-widget";

export function RecentInquiriesWidget({ inquiries }: { inquiries: any[] }) {
  return (
    <Panel title="Recent Inquiries" href="/admin/inquiries">
      {inquiries.length === 0 ? <p className="text-sm text-[#5A5E55]">No inquiries yet</p> : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => <div key={inquiry.id} className="flex items-start justify-between border-b border-[#d8a928]/10 pb-3 last:border-0"><div><p className="text-sm font-medium">{inquiry.name}</p><p className="text-sm text-[#5A5E55]">{inquiry.subject}</p></div><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(inquiry.status)}`}>{inquiry.status}</span></div>)}
        </div>
      )}
    </Panel>
  );
}

function statusClass(status: string) {
  if (status === "unread") return "bg-blue-100 text-blue-700";
  if (status === "read") return "bg-yellow-100 text-yellow-700";
  if (status === "replied") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}
