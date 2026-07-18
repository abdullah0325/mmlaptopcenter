"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "./types";

export function useInquiryDetail(id?: string) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState("unread");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function run() {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/admin/inquiries/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load inquiry");
        if (cancelled) return;
        setInquiry(data); setStatus(data.status ?? "unread"); setAdminNote(data.adminNote ?? "");
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load inquiry");
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
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, adminNote }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update inquiry");
      setInquiry(data);
    } catch (e: any) {
      setError(e?.message || "Failed to update inquiry");
    } finally {
      setSaving(false);
    }
  }

  return { loading, saving, error, inquiry, status, setStatus, adminNote, setAdminNote, save };
}
