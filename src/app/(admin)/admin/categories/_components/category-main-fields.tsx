import type { CategoryFormValues } from "./category-form";

type Props = {
  values: CategoryFormValues;
  setValues: React.Dispatch<React.SetStateAction<CategoryFormValues>>;
};

export function CategoryMainFields({ values, setValues }: Props) {
  return (
    <div className="space-y-3 md:space-y-4">
      <Field label="Name" value={values.name} onChange={(value) => setValues((v) => ({ ...v, name: value }))} required />
      <Field label="Slug" value={values.slug} onChange={(value) => setValues((v) => ({ ...v, slug: value }))} mono required />
      <label className="block text-sm font-medium text-[#0a0a0a]">
        Description (optional)
        <textarea value={values.description ?? ""} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} rows={5} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" />
      </label>
    </div>
  );
}

function Field({ label, value, onChange, mono, required }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#d8a928] md:py-2 md:text-sm ${mono ? "font-mono" : ""}`} />
    </label>
  );
}
