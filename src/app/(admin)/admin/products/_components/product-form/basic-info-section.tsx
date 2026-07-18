"use client";

import { AdminImageUpload } from "@/components/admin/image-upload";
import type { ProductSectionProps } from "./section-types";
import type { ProductFormValues } from "./types";

export function BasicInfoSection({
  values, setValues, parentCategories, subcategories, collectionSearch,
  setCollectionSearch, visibleCollections,
}: ProductSectionProps & {
  parentCategories: Array<{ id: string; name: string; parentId?: string | null }>;
  subcategories: Array<{ id: string; name: string; parentId?: string | null }>;
  collectionSearch: string;
  setCollectionSearch: React.Dispatch<React.SetStateAction<string>>;
  visibleCollections: Array<{ id: string; title: string }>;
  categories: Array<{ id: string; name: string; parentId?: string | null }>;
}) {
  return (
    <>
      <div className="space-y-4">
        <input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Product Title" required />
        <input value={values.handle} onChange={(e) => setValues((v) => ({ ...v, handle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Handle (auto-generated)" required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="number" min={0} step="0.01" value={values.price} onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Price" required />
          <input type="number" min={0} step="0.01" value={values.compareAtPrice ?? ""} onChange={(e) => setValues((v) => ({ ...v, compareAtPrice: e.target.value ? Number(e.target.value) : null }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Compare at Price" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="number" min={0} step="1" value={values.inventory} onChange={(e) => setValues((v) => ({ ...v, inventory: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Inventory Quantity" />
          <input value={values.sku ?? ""} onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SKU" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select value={values.categoryId} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value, subcategoryId: "" }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="">Select Category</option>
            {parentCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={values.subcategoryId} onChange={(e) => setValues((v) => ({ ...v, subcategoryId: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="">Select Subcategory</option>
            {subcategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <textarea value={values.description ?? ""} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} rows={4} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Product Description" />
        <textarea value={values.descriptionHtml ?? ""} onChange={(e) => setValues((v) => ({ ...v, descriptionHtml: e.target.value }))} rows={4} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="HTML Description (optional)" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={values.productType ?? ""} onChange={(e) => setValues((v) => ({ ...v, productType: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Product Type" />
          <input value={values.vendor ?? ""} onChange={(e) => setValues((v) => ({ ...v, vendor: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Vendor" />
        </div>
        <label className="block text-sm font-semibold text-gray-800">Product display order<input type="number" min={1} step={1} value={values.displayOrder} onChange={(e) => setValues((v) => ({ ...v, displayOrder: Math.max(1, Number(e.target.value)) }))} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="1 appears first, 2 appears second" /><span className="mt-1 block text-xs font-normal text-gray-500">Lower numbers appear first. Products with the same number use newest first.</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select value={values.status} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as ProductFormValues["status"] }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
          </select>
          <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800"><input type="checkbox" checked={values.availableForSale} onChange={(e) => setValues((v) => ({ ...v, availableForSale: e.target.checked }))} /> Available for sale</label>
        </div>
      </div>

      <div className="space-y-4">
        <AdminImageUpload label="Featured Image" folder="mmlaptop/products" usedIn="product" value={values.featuredImage} onChange={(url) => setValues((v) => ({ ...v, featuredImage: url }))} />
        <AdminImageUpload label="Product Images" folder="mmlaptop/products" usedIn="product" mode="multiple" values={values.images} onChangeMany={(urls) => setValues((v) => ({ ...v, images: urls }))} />
        <div className="rounded-xl border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4">
          <p className="mb-3 text-sm font-semibold text-[#0a0a0a]">Collections</p>
          <input value={collectionSearch} onChange={(e) => setCollectionSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Search collections..." />
          <div className="mt-3 max-h-40 space-y-2 overflow-auto">
            {visibleCollections.map((collection) => (
              <label key={collection.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/50">
                <input type="checkbox" checked={values.collectionIds.includes(collection.id)} onChange={(e) => setValues((v) => ({ ...v, collectionIds: e.target.checked ? [...v.collectionIds, collection.id] : v.collectionIds.filter((id) => id !== collection.id) }))} className="rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]" />
                <span className="text-sm text-[#0a0a0a]">{collection.title}</span>
              </label>
            ))}
          </div>
        </div>
        <input value={values.tags.join(", ")} onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Tags (comma-separated)" />
        <input value={values.seoTitle ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoTitle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SEO Title" />
        <textarea value={values.seoDescription ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoDescription: e.target.value }))} rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SEO Description" />
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4 transition-colors hover:bg-[#fcf5e8]">
          <input type="checkbox" checked={values.isFeatured} onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]" />
          <div><p className="text-sm font-medium text-[#0a0a0a]">Mark as Featured Product</p><p className="text-xs text-[#5A5E55]">Featured products appear on the homepage</p></div>
        </label>
      </div>
    </>
  );
}
