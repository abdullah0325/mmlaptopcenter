import type { BlogFormValues } from "./blog-form";

type Props = {
  values: BlogFormValues;
  setValues: React.Dispatch<React.SetStateAction<BlogFormValues>>;
  saving: boolean;
};

export function BlogSeoFields({ values, setValues, saving }: Props) {
  return (
    <>
      <div className="rounded-lg border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-3 md:p-4">
        <p className="text-xs font-semibold text-[#0a0a0a] md:text-sm">SEO</p>
        <div className="mt-2 grid gap-3 md:mt-3 md:gap-4 lg:grid-cols-2">
          <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">SEO Title<input value={values.seoTitle ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoTitle: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#d8a928] md:py-2 md:text-sm" /></label>
          <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">SEO Description<textarea value={values.seoDescription ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoDescription: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        </div>
      </div>
      <div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-lg bg-[#f6a45d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50 md:px-5 md:py-2.5 md:text-sm">{saving ? "Saving..." : "Save"}</button></div>
    </>
  );
}
