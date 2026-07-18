import { AdminImageUpload } from "@/components/admin/image-upload";
import type { BlogFormValues } from "./blog-form";

type Props = {
  values: BlogFormValues;
  setValues: React.Dispatch<React.SetStateAction<BlogFormValues>>;
  categories: Array<{ id: string; name: string; parentId?: string | null }>;
};

export function BlogMainFields({ values, setValues, categories }: Props) {
  return (
    <>
      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <Field label="Title" value={values.title} onChange={(value) => setValues((v) => ({ ...v, title: value }))} required />
        <Field label="Slug" value={values.slug} onChange={(value) => setValues((v) => ({ ...v, slug: value }))} mono required />
      </div>
      <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
        <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">Status<select value={values.status} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as any }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#d8a928] md:py-2 md:text-sm"><option value="draft">draft</option><option value="published">published</option></select></label>
        <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm lg:col-span-2">Category<select value={values.categoryId ?? ""} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs md:py-2 md:text-sm"><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" id="isFeatured" checked={values.isFeatured ?? false} onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-[#f6a45d] focus:ring-[#d8a928]" /><span className="text-sm font-medium text-[#0a0a0a]">Featured Blog (show on homepage)</span></label>
      <AdminImageUpload label="Featured Image" folder="mmlaptop/blogs" usedIn="blog" value={values.featuredImage} onChange={(url) => setValues((v) => ({ ...v, featuredImage: url }))} />
    </>
  );
}

function Field({ label, value, onChange, mono, required }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean; required?: boolean }) {
  return <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">{label}<input value={value} onChange={(e) => onChange(e.target.value)} required={required} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#d8a928] md:py-2 md:text-sm ${mono ? "font-mono" : ""}`} /></label>;
}
