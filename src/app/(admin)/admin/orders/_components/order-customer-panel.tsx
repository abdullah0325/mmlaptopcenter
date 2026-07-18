import { FaWhatsapp } from "react-icons/fa";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import type { OrderDetail } from "./types";

export function OrderCustomerPanel({
  order, sendingWhatsApp, openCustomerWhatsApp, sendOrderConfirmation,
}: {
  order: OrderDetail;
  sendingWhatsApp: boolean;
  openCustomerWhatsApp: () => void;
  sendOrderConfirmation: () => void;
}) {
  const address = order.customerAddress ?? {};
  const hasValidWhatsApp = order.customerPhone && isValidWhatsAppNumber(order.customerPhone);
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-[#0a0a0a]">Customer</h2>
      <div className="mt-3 space-y-1 text-sm text-[#5A5E55]">
        <div className="font-medium text-[#0a0a0a]">{order.customerName}</div>
        <div>{order.customerEmail}</div>
        {order.customerPhone ? <PhoneLine phone={order.customerPhone} valid={!!hasValidWhatsApp} /> : <div className="text-xs text-red-500">No phone number provided</div>}
      </div>
      {hasValidWhatsApp && <WhatsAppButtons sending={sendingWhatsApp} onChat={openCustomerWhatsApp} onConfirm={sendOrderConfirmation} />}
      <h3 className="mt-4 text-sm font-semibold text-[#0a0a0a]">Address</h3>
      <div className="mt-2 text-sm text-[#5A5E55]">{[address.line1, address.line2, address.city, address.state, address.pincode, address.country].filter(Boolean).join(", ")}</div>
    </div>
  );
}

function PhoneLine({ phone, valid }: { phone: string; valid: boolean }) {
  return <div className="flex items-center gap-2"><span>{phone}</span>{valid && <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">WhatsApp Available</span>}</div>;
}

function WhatsAppButtons({ sending, onChat, onConfirm }: { sending: boolean; onChat: () => void; onConfirm: () => void }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button onClick={onChat} className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#25D366] px-2 py-2 text-[11px] font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white sm:px-3 sm:text-xs"><FaWhatsapp className="h-3.5 w-3.5 shrink-0" /><span>WhatsApp Chat</span></button>
      <button onClick={onConfirm} disabled={sending} className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-[#25D366] px-2 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#128C7E] disabled:opacity-50 sm:px-3 sm:text-xs"><FaWhatsapp className="h-3.5 w-3.5 shrink-0" /><span>{sending ? "Opening..." : "Send Confirmation"}</span></button>
    </div>
  );
}
