"use client";

import { useEffect, useState } from "react";
import { HeroSlide } from "@/types/hero";
import type { SlideFormValues } from "./types";

const emptyForm: SlideFormValues = {
  imageUrl: "", mobileImageUrl: "", imageAlt: "", eyebrow: "", title: "", titleHighlight: "",
  description: "", ctaPrimaryLabel: undefined, ctaPrimaryHref: undefined,
  ctaSecondaryLabel: undefined, ctaSecondaryHref: undefined, isActive: true,
};

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<SlideFormValues>(emptyForm);

  useEffect(() => { void fetchSlides(); }, []);

  async function fetchSlides() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/hero?active=false");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load slides");
        return;
      }
      if (data.slides) setSlides(data.slides);
    } catch {
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  }

  async function saveSlide() {
    setSaving(true); setError(null);
    try {
      const url = editingSlide ? `/api/admin/hero/${editingSlide.id}` : "/api/admin/hero";
      const res = await fetch(url, { method: editingSlide ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save slide");
      const data = await res.json();
      setSlides((items) => editingSlide ? items.map((s) => (s.id === editingSlide.id ? data.slide : s)) : [...items, data.slide]);
      resetForm();
    } catch (error: any) {
      setError(error.message || "Failed to save slide");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
      if (res.ok) setSlides((items) => items.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete slide:", error);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
      if (res.ok) setSlides((items) => items.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s)));
    } catch (error) {
      console.error("Failed to toggle slide:", error);
    }
  }

  async function moveSlide(id: string, direction: "up" | "down") {
    const currentIndex = slides.findIndex((s) => s.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || newIndex < 0 || newIndex >= slides.length) return;
    const newSlides = [...slides];
    [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
    const ordered = newSlides.map((slide, index) => ({ ...slide, order: index + 1 }));
    const res = await fetch("/api/admin/hero/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderedIds: ordered.map((s) => s.id) }) });
    if (res.ok) setSlides(ordered);
  }

  function editSlide(slide: HeroSlide) {
    setEditingSlide(slide);
    setFormValues({ imageUrl: slide.imageUrl, mobileImageUrl: slide.mobileImageUrl ?? "", imageAlt: slide.imageAlt, eyebrow: slide.eyebrow, title: slide.title, titleHighlight: slide.titleHighlight, description: slide.description, ctaPrimaryLabel: slide.ctaPrimaryLabel, ctaPrimaryHref: slide.ctaPrimaryHref, ctaSecondaryLabel: slide.ctaSecondaryLabel, ctaSecondaryHref: slide.ctaSecondaryHref, isActive: slide.isActive });
    setShowForm(true);
  }

  function resetForm() {
    setEditingSlide(null);
    setFormValues(emptyForm);
    setShowForm(false);
  }

  return { slides, loading, showForm, setShowForm, editingSlide, error, saving, formValues, setFormValues, fetchSlides, saveSlide, deleteSlide, toggleActive, moveSlide, editSlide, resetForm };
}
