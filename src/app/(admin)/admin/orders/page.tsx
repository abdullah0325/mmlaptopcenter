"use client";

import { OrdersTable } from "./_components/orders-table";
import { useOrders } from "./_components/use-orders";

export default function OrdersPage() {
  const state = useOrders();
  return <div className="p-4 md:p-8">
    <h1 className="mb-4 text-xl font-bold text-[#0a0a0a] md:mb-6 md:text-2xl">Orders</h1>
    <div className="mb-5 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
      <label className="text-xs font-semibold text-gray-600">Search<input value={state.search} onChange={(event) => state.setSearch(event.target.value)} placeholder="Order, customer, email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
      <Filter label="Order status" value={state.status} setValue={state.setStatus} options={["pending", "confirmed", "processing", "shipped", "completed", "cancelled"]} />
      <Filter label="Payment status" value={state.paymentStatus} setValue={state.setPaymentStatus} options={["pending", "verified", "failed", "refunded"]} />
    </div>
    {state.loading ? <p className="text-sm text-gray-500">Loading...</p> : state.orders.length === 0 ? <p className="text-sm text-gray-500">No matching orders</p> : <OrdersTable orders={state.orders} />}
  </div>;
}

function Filter({ label, value, setValue, options }: { label: string; value: string; setValue: (value: string) => void; options: string[] }) {
  return <label className="text-xs font-semibold text-gray-600">{label}<select value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">All</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
