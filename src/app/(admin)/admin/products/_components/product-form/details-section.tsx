"use client";

import { FaArrowDown, FaArrowUp, FaInfoCircle, FaPlus, FaTrash } from "react-icons/fa";
import { AdminImageUpload } from "@/components/admin/image-upload";
import type { SaveableSectionProps } from "./section-types";
import type { ProductDetail } from "./types";
import { generateId } from "./utils";

export function DetailsSection({
  values, setValues, mode, savingDetails, saveDetails,
}: SaveableSectionProps & { savingDetails: boolean; saveDetails: () => Promise<void> }) {
  const updateDetail = (id: string, field: keyof ProductDetail, value: string) => setValues((v) => ({ ...v, details: v.details.map((d) => (d.id === id ? { ...d, [field]: value } : d)) }));
  const removeDetail = (id: string) => setValues((v) => ({ ...v, details: v.details.filter((d) => d.id !== id) }));
  const moveDetail = (index: number, direction: -1 | 1) => {
    setValues((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.details.length) return current;
      const details = [...current.details];
      const [detail] = details.splice(index, 1);
      details.splice(nextIndex, 0, detail);
      return { ...current, details };
    });
  };

  return (
    <div className="col-span-1 rounded-xl border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4 lg:col-span-2 md:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6a45d]/10"><FaInfoCircle className="h-5 w-5 text-[#f6a45d]" /></div><div><h3 className="text-base font-semibold text-[#0a0a0a]">Additional Details</h3><p className="text-xs text-[#5A5E55]">Add extra information about your product</p></div></div>
        <button type="button" onClick={() => setValues((v) => ({ ...v, details: [...v.details, { id: generateId(), title: "", description: "", image: "", videoUrl: "" }] }))} className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#d8861f] hover:shadow-md"><FaPlus className="h-4 w-4" />Add Detail</button>
      </div>
      <div className="space-y-4">
        {values.details.map((detail, idx) => (
          <DetailCard
            key={detail.id}
            detail={detail}
            index={idx}
            total={values.details.length}
            updateDetail={updateDetail}
            removeDetail={removeDetail}
            moveDetail={moveDetail}
          />
        ))}
        {values.details.length === 0 && <EmptyDetails />}
      </div>
      {mode === "edit" && values.details.length > 0 && <SaveDetailsButton saving={savingDetails} onClick={saveDetails} />}
    </div>
  );
}

function DetailCard({
  detail,
  index,
  total,
  updateDetail,
  removeDetail,
  moveDetail,
}: {
  detail: ProductDetail;
  index: number;
  total: number;
  updateDetail: (id: string, field: keyof ProductDetail, value: string) => void;
  removeDetail: (id: string) => void;
  moveDetail: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute right-3 top-3 flex gap-1">
        <button type="button" onClick={() => moveDetail(index, -1)} disabled={index === 0} className="rounded-full border border-[#d8a928]/20 bg-[#fcf5e8] p-2 text-[#5A5E55] transition-colors hover:text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40"><FaArrowUp className="h-3 w-3" /></button>
        <button type="button" onClick={() => moveDetail(index, 1)} disabled={index === total - 1} className="rounded-full border border-[#d8a928]/20 bg-[#fcf5e8] p-2 text-[#5A5E55] transition-colors hover:text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40"><FaArrowDown className="h-3 w-3" /></button>
        <button type="button" onClick={() => removeDetail(detail.id)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"><FaTrash className="h-3 w-3" /></button>
      </div>
      <p className="mb-3 pr-28 text-xs font-medium text-[#5A5E55]">Detail {index + 1}</p>
      <div className="space-y-3">
        <Input label="Title" value={detail.title} onChange={(value) => updateDetail(detail.id, "title", value)} placeholder="e.g., Performance tuned for creators" />
        <label className="block text-xs text-[#5A5E55]">Rich Text Description<textarea value={detail.description} onChange={(e) => updateDetail(detail.id, "description", e.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm leading-6 transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" rows={5} placeholder="Add product story, bullet-style lines, warranty notes, specs, or usage details..." /></label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-xs text-[#5A5E55]">
            Image (optional)
            <AdminImageUpload
              label="Detail image"
              folder="mmlaptop/products/details"
              usedIn="product_detail"
              value={detail.image}
              onChange={(url) => {
                updateDetail(detail.id, "image", url);
                if (url) updateDetail(detail.id, "videoUrl", "");
              }}
            />
          </label>
          <div>
            <Input
              label="YouTube video URL (optional)"
              value={detail.videoUrl || ""}
              onChange={(value) => {
                updateDetail(detail.id, "videoUrl", value);
                if (value.trim()) updateDetail(detail.id, "image", "");
              }}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1.5 text-xs text-[#5A5E55]">Adding a video replaces the image for this detail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block text-xs text-[#5A5E55]">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder={placeholder} /></label>;
}

function EmptyDetails() {
  return <div className="py-8 text-center"><div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f6a45d]/10"><FaInfoCircle className="h-8 w-8 text-[#f6a45d]" /></div><p className="text-sm text-[#5A5E55]">No details added yet</p><p className="text-xs text-[#5A5E55]">Click &quot;Add Detail&quot; to create additional product information</p></div>;
}

function SaveDetailsButton({ saving, onClick }: { saving: boolean; onClick: () => Promise<void> }) {
  return <div className="mt-4 flex justify-end"><button type="button" onClick={onClick} disabled={saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#d8861f] hover:shadow-md disabled:opacity-50">{saving ? "Saving..." : "Save Details"}</button></div>;
}
