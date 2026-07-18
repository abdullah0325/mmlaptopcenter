import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { statusColors } from "./status-colors";
import type { OrderListItem } from "./types";

export function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  return (
    <><div className="grid gap-3 md:hidden">{orders.map((order) => <MobileOrder key={order.id} order={order} />)}</div><div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              {["Order #", "Customer", "Payment", "Status", "Total", "Date", "Actions"].map((label) => (
                <th key={label} className="px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 md:px-4 md:py-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => <OrderRow key={order.id} order={order} />)}
          </tbody>
        </table>
      </div>
    </div></>
  );
}

function OrderRow({ order }: { order: OrderListItem }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2 text-sm font-medium md:px-4 md:py-3">{order.orderNumber}</td>
      <td className="px-2 py-2 text-xs md:px-4 md:py-3 md:text-sm">{order.customerName}</td>
      <td className="px-2 py-2 text-xs md:px-4 md:py-3"><div>{order.paymentMethod.replaceAll("_", " ")}</div><div className="text-gray-500">{order.paymentStatus}</div></td>
      <td className="px-2 py-2 md:px-4 md:py-3"><span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>{order.orderStatus}</span></td>
      <td className="px-2 py-2 text-right text-xs font-medium md:px-4 md:py-3 md:text-sm">Rs. {order.total.toLocaleString()}</td>
      <td className="px-2 py-2 text-right text-xs text-gray-500 md:px-4 md:py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
      <td className="px-2 py-2 text-right md:px-4 md:py-3">
        <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs text-[#d8a928] hover:underline md:text-sm">
          <FiEye className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">View</span>
        </Link>
      </td>
    </tr>
  );
}

function MobileOrder({ order }: { order: OrderListItem }) {
  return <Link href={`/admin/orders/${order.id}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{order.orderNumber}</p><p className="mt-1 text-sm text-gray-600">{order.customerName}</p></div><span className={`rounded-full px-2 py-1 text-xs ${statusColors[order.orderStatus] || "bg-gray-100"}`}>{order.orderStatus}</span></div><div className="mt-3 flex justify-between text-xs text-gray-500"><span>{order.paymentMethod.replaceAll("_", " ")} · {order.paymentStatus}</span><strong className="text-gray-900">PKR {order.total.toLocaleString()}</strong></div></Link>;
}
