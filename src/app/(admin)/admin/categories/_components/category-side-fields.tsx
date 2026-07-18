import { AdminImageUpload } from "@/components/admin/image-upload";
import type { CategoryFormValues } from "./category-form";

type Props = {
  values: CategoryFormValues;
  setValues: React.Dispatch<React.SetStateAction<CategoryFormValues>>;
  parentOptions: Array<{ id: string; name: string; parentId?: string | null }>;
  saving: boolean;
};

export function CategorySideFields({ values, setValues, parentOptions, saving }: Props) {
  return (
    <div className="space-y-4">
      <AdminImageUpload label="Category Image" folder="mmlaptop/categories" usedIn="category" value={values.image} onChange={(url) => setValues((v) => ({ ...v, image: url }))} />
      <label className="block text-sm font-medium text-[#0a0a0a]">Parent Category (optional)<select value={values.parentId ?? ""} onChange={(e) => setValues((v) => ({ ...v, parentId: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="">None (Main category)</option>{parentOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#0a0a0a]">Order Number<input type="number" value={values.order} onChange={(e) => setValues((v) => ({ ...v, order: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        <label className="flex items-center gap-2 pt-6 text-sm text-[#0a0a0a]"><input type="checkbox" checked={values.featured} onChange={(e) => setValues((v) => ({ ...v, featured: e.target.checked }))} />Featured</label>
      </div>
      <SeoFields values={values} setValues={setValues} />
      <div className="flex items-center justify-end gap-3 pt-2"><button type="submit" disabled={saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50">{saving ? "Saving..." : "Save"}</button></div>
    </div>
  );
}

function SeoFields({ values, setValues }: Pick<Props, "values" | "setValues">) {
  return (
    <div className="rounded-lg border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4">
      <p className="text-sm font-semibold text-[#0a0a0a]">SEO</p>
      <div className="mt-3 space-y-3">
        <label className="block text-sm font-medium text-[#0a0a0a]">SEO Title (optional)<input value={values.seoTitle ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoTitle: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        <label className="block text-sm font-medium text-[#0a0a0a]">SEO Description (optional)<textarea value={values.seoDescription ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoDescription: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
      </div>
    </div>
  );
}
