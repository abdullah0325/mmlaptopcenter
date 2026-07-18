"use client";

import { useEffect, useState } from "react";
import { buildOrderConfirmationMessage, buildOrderDetailsMessage, formatPhoneForWhatsApp, isValidWhatsAppNumber, Order } from "@/lib/whatsapp";
import type { OrderDetail } from "./types";

export function useOrderDetail(id?: string) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ orderStatus: "pending", paymentStatus: "pending", trackingNumber: "", trackingUrl: "", notes: "" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function run() {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load order");
        if (cancelled) return;
        setOrder(data);
        setForm({ orderStatus: data.orderStatus ?? "pending", paymentStatus: data.paymentStatus ?? "pending", trackingNumber: data.trackingNumber ?? "", trackingUrl: data.trackingUrl ?? "", notes: data.notes ?? "" });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => { cancelled = true; };
  }, [id]);

  async function save() {
    if (!id) return;
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update order");
      setOrder((o) => (o ? { ...o, ...data } : o));
      if (data.emailWarning) setError(`Order updated, but ${data.emailWarning}`);
    } catch (e: any) {
      setError(e?.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  function openCustomerWhatsApp() {
    const phone = order?.customerPhone;
    if (!phone || !assertWhatsAppPhone(phone)) return;
    window.open(`https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodeURIComponent(buildOrderDetailsMessage(order as Order))}`, "_blank");
  }

  function sendOrderConfirmation() {
    const phone = order?.customerPhone;
    if (!phone || !assertWhatsAppPhone(phone)) return;
    setSendingWhatsApp(true); setWhatsAppSuccess(null);
    setTimeout(() => {
      window.open(`https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodeURIComponent(buildOrderConfirmationMessage(order as Order))}`, "_blank");
      setSendingWhatsApp(false);
      setWhatsAppSuccess("WhatsApp opened! Message ready to send.");
      setTimeout(() => setWhatsAppSuccess(null), 5000);
    }, 500);
  }

  function assertWhatsAppPhone(phone: string) {
    if (isValidWhatsAppNumber(phone)) return true;
    setError("Invalid phone number for WhatsApp");
    return false;
  }

  return { loading, saving, error, order, form, setForm, save, sendingWhatsApp, whatsAppSuccess, openCustomerWhatsApp, sendOrderConfirmation };
}
