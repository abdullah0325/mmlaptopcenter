"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "@esmate/shadcn/pkgs/lucide-react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";

type Msg = { role: "user" | "assistant"; content: string; html?: string };
type DraftOrder = {
  productId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  expectedField?: "name" | "phone" | "address";
};

export function ChatPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I am your MM Laptop Center AI assistant. Ask me about laptops, accessories, warranty support, or say 'I want to order'.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [draftOrder, setDraftOrder] = useState<DraftOrder>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (popupRef.current && !popupRef.current.contains(target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open, onClose]);

  const history = useMemo(
    () => messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

  async function placeOrder(order: Required<Omit<DraftOrder, "expectedField">>) {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: order.productId,
        quantity: 1,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessages((m) => [...m, { role: "assistant", content: data?.error || "Failed to place order." }]);
      return;
    }
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: `Order confirmed! Your order number is ${data.order.orderNumber}.`,
        html: `<h3>Order confirmed</h3><p>Your order number is <strong>${data.order.orderNumber}</strong>.</p>`,
      },
    ]);
    setDraftOrder({});
  }

  async function send(message: string) {
    const nextMsgs: Msg[] = [...messages, { role: "user", content: message }];
    setMessages(nextMsgs);
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, draftOrder }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data?.error || "Something went wrong." }]);
        return;
      }
      setDraftOrder(data.draftOrder || {});
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "How can I help you?", html: data.replyHtml },
      ]);

      if (data.action === "submit_order" && data.draftOrder?.productId && data.draftOrder?.customerName && data.draftOrder?.customerPhone && data.draftOrder?.customerAddress) {
        await placeOrder(data.draftOrder);
      }
    } finally {
      setTyping(false);
    }
  }

  return (
    <div
      ref={popupRef}
      className={`fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#d8a928]/20 bg-[#fcf5e8] shadow-2xl transition-all duration-300 ${
        open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between bg-[#f6a45d] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">MM Laptop Center AI Assistant</p>
          <p className="text-xs opacity-90">Sales + Support</p>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[420px] space-y-3 overflow-y-auto p-3">
        {messages.map((m, idx) => (
          <MessageBubble key={`${idx}-${m.role}`} role={m.role} text={m.content} html={m.html} />
        ))}
        {typing ? <MessageBubble role="assistant" text="Typing..." /> : null}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={send} disabled={typing} />
    </div>
  );
}

