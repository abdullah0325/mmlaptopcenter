import type { CollectionFormValues } from "./collection-form";

type Props = {
  values: CollectionFormValues;
  setValues: React.Dispatch<React.SetStateAction<CollectionFormValues>>;
};

export function CollectionMainFields({ values, setValues }: Props) {
  return (
    <div className="space-y-4">
      <Field label="Title" value={values.title} onChange={(value) => setValues((v) => ({ ...v, title: value }))} required />
      <Field label="Handle" value={values.handle} onChange={(value) => setValues((v) => ({ ...v, handle: value }))} mono required />
      <label className="block text-sm font-medium text-[#0a0a0a]">
        Description (optional)
        <textarea value={values.description ?? ""} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} rows={6} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" checked={values.isFeatured ?? false} onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-[#f6a45d] focus:ring-[#d8a928]" />
        <span className="text-sm font-medium text-[#0a0a0a]">Featured Collection (show on homepage)</span>
      </label>
    </div>
  );
}

function Field({ label, value, onChange, mono, required }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-[#0a0a0a]">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928] ${mono ? "font-mono text-sm" : ""}`} />
    </label>
  );
}
