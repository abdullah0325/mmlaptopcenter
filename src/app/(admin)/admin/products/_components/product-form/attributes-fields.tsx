"use client";

import type { ProductAttributes } from "./types";

const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/40";

export function AttributesFields({ value, onChange }: { value: ProductAttributes; onChange: (patch: Partial<ProductAttributes>) => void }) {
  const fields: Array<[keyof ProductAttributes, string]> = [
    ["color", "Color"], ["size", "Size"], ["storage", "Storage"], ["ram", "RAM"],
    ["processor", "Processor"], ["condition", "Condition"],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="space-y-1"><span className="text-xs font-semibold text-gray-700">{label}</span><input className={inputClass} value={(value[key] as string) || ""} onChange={(event) => onChange({ [key]: event.target.value })} /></label>
      ))}
    </div>
  );
}
