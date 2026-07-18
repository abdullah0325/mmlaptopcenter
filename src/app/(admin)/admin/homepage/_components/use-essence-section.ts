"use client";

import { useEffect, useState } from "react";
import type { EssenceCard } from "./types";

export function useEssenceSection() {
  const [essenceCards, setEssenceCards] = useState<EssenceCard[]>([{ title: "", description: "", image: "" }, { title: "", description: "", image: "" }]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { void fetchSection(); }, []);

  async function fetchSection() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage-sections?key=essence");
      const data = await res.json();
      if (data.sections?.length > 0) {
        const section = data.sections[0];
        setTitle(section.title || "");
        setSubtitle(section.subtitle || "");
        if (Array.isArray(section.content) && section.content.length > 0) setEssenceCards(section.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/homepage-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: "essence", title, subtitle, content: essenceCards, isActive: true, order: 1 }),
      });
      if (res.ok) setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return { essenceCards, setEssenceCards, title, setTitle, subtitle, setSubtitle, saving, saved, loading, onSubmit };
}
