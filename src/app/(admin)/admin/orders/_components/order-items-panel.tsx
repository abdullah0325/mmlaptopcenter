import type { OrderDetail, OrderItem } from "./types";

export function OrderItemsPanel({ order }: { order: OrderDetail }) {
  const items = Array.isArray(order.items) ? order.items : [];
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <h2 className="text-sm font-semibold text-[#0a0a0a]">Items</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#d8a928]/20 text-[#5A5E55]"><th className="py-2 text-left">Product</th><th className="py-2 text-right">Qty</th><th className="py-2 text-right">Price</th><th className="py-2 text-right">Line total</th></tr></thead>
          <tbody>{items.map((item, index) => <ItemRow key={item.productId ?? index} item={item} />)}</tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <TotalRow label="Subtotal" value={order.subtotal} />
        <TotalRow label="Shipping" value={order.shippingCost} />
        <TotalRow label="Tax" value={order.tax} />
        {order.discount ? <TotalRow label="Discount" value={-order.discount} /> : null}
        <div className="flex justify-between text-base font-semibold"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <tr className="border-b border-[#d8a928]/10">
      <td className="py-3"><div className="font-medium text-[#0a0a0a]">{item.title ?? item.productTitle ?? "Item"}</div><div className="text-xs text-[#5A5E55]">{item.productId ?? ""}</div></td>
      <td className="py-3 text-right">{item.quantity ?? 1}</td>
      <td className="py-3 text-right">Rs. {Number(item.price ?? 0).toLocaleString()}</td>
      <td className="py-3 text-right font-medium">Rs. {Number((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</td>
    </tr>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between"><span className="text-[#5A5E55]">{label}</span><span>{value < 0 ? "- " : ""}Rs. {Math.abs(value).toLocaleString()}</span></div>;
}
