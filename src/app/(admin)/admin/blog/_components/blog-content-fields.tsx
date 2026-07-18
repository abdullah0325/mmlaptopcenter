import type { BlogFormValues } from "./blog-form";

type Props = {
  values: BlogFormValues;
  setValues: React.Dispatch<React.SetStateAction<BlogFormValues>>;
};

export function BlogContentFields({ values, setValues }: Props) {
  return (
    <>
      <TextArea label="Excerpt" rows={2} value={values.excerpt ?? ""} onChange={(value) => setValues((v) => ({ ...v, excerpt: value }))} />
      <TextArea label="Content" rows={6} value={values.content ?? ""} onChange={(value) => setValues((v) => ({ ...v, content: value }))} />
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block text-sm font-medium text-[#0a0a0a]">Tags (comma-separated)<input value={values.tags.join(", ")} onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        <label className="block text-sm font-medium text-[#0a0a0a]">Author<input value={values.author ?? ""} onChange={(e) => setValues((v) => ({ ...v, author: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
      </div>
    </>
  );
}

function TextArea({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) {
  return <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>;
}
