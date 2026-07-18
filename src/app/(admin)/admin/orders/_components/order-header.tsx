import Link from "next/link";
import type { OrderDetail } from "./types";

export function OrderHeader({ order }: { order: OrderDetail }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Order {order.orderNumber}</h1>
        <p className="mt-1 text-sm text-[#5A5E55]">Placed {new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <Link href="/admin/orders" className="rounded-lg border border-[#d8a928]/25 bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]">
        Back
      </Link>
    </div>
  );
}
