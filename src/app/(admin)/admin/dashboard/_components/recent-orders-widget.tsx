import Link from "next/link";

export function RecentOrdersWidget({ orders }: { orders: any[] }) {
  return (
    <Panel title="Recent Orders" href="/admin/orders">
      {orders.length === 0 ? <p className="text-sm text-[#5A5E55]">No orders yet</p> : (
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[#d8a928]/20">{["Order #", "Customer", "Status", "Total"].map((h) => <th key={h} className="pb-2 text-left text-xs font-medium uppercase tracking-wide text-[#5A5E55]">{h}</th>)}</tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-[#d8a928]/10"><td className="py-3 text-sm font-medium">{order.orderNumber}</td><td className="py-3 text-sm text-[#5A5E55]">{order.customerName}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span></td><td className="py-3 text-right text-sm font-medium">Rs. {order.total.toLocaleString()}</td></tr>)}</tbody></table></div>
      )}
    </Panel>
  );
}

export function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[#d8a928]/20 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"><div className="mb-3 flex items-center justify-between sm:mb-4"><h2 className="text-base font-semibold text-[#0a0a0a] sm:text-lg">{title}</h2><Link href={href} className="text-xs text-[#f6a45d] hover:underline sm:text-sm">View all</Link></div>{children}</div>;
}

function statusClass(status: string) {
  if (status === "delivered") return "bg-green-100 text-green-700";
  if (status === "shipped") return "bg-blue-100 text-blue-700";
  if (status === "processing") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}
