"use client";

import { useEffect, useState } from "react";
import type { Settings } from "./types";

const emptySettings: Settings = { companyName: "", companyEmail: "", companyPhone: "", officeAddress: "", whatsappNumber: "", salesEmail: "" };

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) { setMessage("Settings saved successfully!"); setTimeout(() => setMessage(""), 3000); }
    } catch {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return { settings, setSettings, loading, saving, message, handleSave };
}
