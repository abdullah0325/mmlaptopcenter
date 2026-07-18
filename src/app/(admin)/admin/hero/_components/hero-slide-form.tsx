"use client";

import { HeroSlide } from "@/types/hero";
import type { SlideFormValues } from "./types";

type Props = {
  editingSlide: HeroSlide | null;
  formValues: SlideFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<SlideFormValues>>;
  saving: boolean;
  saveSlide: () => Promise<void>;
  resetForm: () => void;
  fetchSlides: () => Promise<void>;
};

export function HeroSlideForm({ editingSlide, formValues, setFormValues, saving, saveSlide, resetForm, fetchSlides }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">{editingSlide ? "Edit Slide" : "Add New Slide"}</h2>
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">x</button>
        </div>
        <div className="space-y-4">
          <ImageField
            editingSlide={editingSlide}
            formValues={formValues}
            setFormValues={setFormValues}
            fetchSlides={fetchSlides}
            field="imageUrl"
            label="Desktop / Laptop Hero Image"
            hint="Used on landscape, tablet, laptop, and desktop screens."
          />
          <ImageField
            editingSlide={editingSlide}
            formValues={formValues}
            setFormValues={setFormValues}
            fetchSlides={fetchSlides}
            field="mobileImageUrl"
            label="Mobile Hero Image"
            hint="Used on vertical mobile screens. Leave empty to use the desktop image."
          />
          <Input value={formValues.imageAlt} onChange={(value) => setFormValues((v) => ({ ...v, imageAlt: value }))} placeholder="Image Alt Text" />
          <Input value={formValues.eyebrow} onChange={(value) => setFormValues((v) => ({ ...v, eyebrow: value }))} placeholder="Eyebrow Text (e.g., Your Trusted Tech Destination)" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input value={formValues.title} onChange={(value) => setFormValues((v) => ({ ...v, title: value }))} placeholder="Title (e.g., Premium Laptops)" />
            <Input value={formValues.titleHighlight} onChange={(value) => setFormValues((v) => ({ ...v, titleHighlight: value }))} placeholder="Title Highlight (e.g., & Tech)" />
          </div>
          <textarea value={formValues.description} onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))} rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Description" />
          <CtaFields title="Primary CTA" label={formValues.ctaPrimaryLabel} href={formValues.ctaPrimaryHref} setLabel={(value) => setFormValues((v) => ({ ...v, ctaPrimaryLabel: value }))} setHref={(value) => setFormValues((v) => ({ ...v, ctaPrimaryHref: value }))} />
          <CtaFields title="Secondary CTA" label={formValues.ctaSecondaryLabel} href={formValues.ctaSecondaryHref} setLabel={(value) => setFormValues((v) => ({ ...v, ctaSecondaryLabel: value }))} setHref={(value) => setFormValues((v) => ({ ...v, ctaSecondaryHref: value }))} />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d8a928]/20 p-4 transition-colors hover:bg-[#fcf5e8]"><input type="checkbox" checked={formValues.isActive} onChange={(e) => setFormValues((v) => ({ ...v, isActive: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]" /><div><p className="text-sm font-medium text-[#0a0a0a]">Active</p><p className="text-xs text-[#5A5E55]">Visible on homepage</p></div></label>
          <div className="flex justify-end gap-3 pt-4"><button onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-gray-50">Cancel</button><button onClick={saveSlide} disabled={saving || !formValues.imageUrl || !formValues.title} className="rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50">{saving ? "Saving..." : editingSlide ? "Update" : "Create"}</button></div>
        </div>
      </div>
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value?: string; onChange: (value: string) => void; placeholder: string }) {
  return <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder={placeholder} />;
}

function CtaFields({ title, label, href, setLabel, setHref }: { title: string; label?: string; href?: string; setLabel: (value: string) => void; setHref: (value: string) => void }) {
  return <div className="border-t border-[#d8a928]/20 pt-4"><p className="mb-3 text-sm font-medium text-[#0a0a0a]">{title}</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input value={label} onChange={setLabel} placeholder="Label (e.g., Shop Now)" /><Input value={href} onChange={setHref} placeholder="URL (e.g., /products)" /></div></div>;
}

function ImageField({
  editingSlide,
  formValues,
  setFormValues,
  fetchSlides,
  field,
  label,
  hint,
}: Pick<Props, "editingSlide" | "formValues" | "setFormValues" | "fetchSlides"> & {
  field: "imageUrl" | "mobileImageUrl";
  label: string;
  hint: string;
}) {
  const value = formValues[field] ?? "";

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">{label}</label>
      <div className="flex items-start gap-3">
        <Input value={value} onChange={(nextValue) => setFormValues((v) => ({ ...v, [field]: nextValue }))} placeholder="https://example.com/image.jpg" />
        <label className="cursor-pointer rounded-lg border border-[#d8a928]/25 bg-white px-3 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]">Upload<input type="file" accept="image/*" onChange={(e) => uploadImage(e, editingSlide, setFormValues, fetchSlides, field)} className="hidden" /></label>
      </div>
      <p className="mt-1 text-xs text-[#5A5E55]">{hint}</p>
      {value && <img src={value} alt={`${label} preview`} className="mt-2 h-24 w-32 rounded border border-gray-200 object-cover object-right" />}
    </div>
  );
}

async function uploadImage(
  e: React.ChangeEvent<HTMLInputElement>,
  editingSlide: HeroSlide | null,
  setFormValues: Props["setFormValues"],
  fetchSlides: () => Promise<void>,
  field: "imageUrl" | "mobileImageUrl",
) {
  const file = e.target.files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("imageField", field);
  if (editingSlide) formData.append("slideId", editingSlide.id);
  const res = await fetch("/api/admin/hero/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (res.ok && data.url) {
    setFormValues((v) => ({ ...v, [field]: data.url }));
    if (editingSlide) await fetchSlides();
  }
}
