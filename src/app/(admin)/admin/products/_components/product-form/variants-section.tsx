"use client";

import { AdminImageUpload } from "@/components/admin/image-upload";
import { AttributesFields } from "./attributes-fields";
import type { ProductFormValues, ProductVariantFormValue } from "./types";

const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/40";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`space-y-1 ${className}`}><span className="text-xs font-semibold text-gray-700">{label}</span>{children}</label>;
}

function inheritedVariant(product: ProductFormValues): ProductVariantFormValue {
  return {
    id: crypto.randomUUID(), name: product.title, description: product.description, price: product.price,
    compareAtPrice: product.compareAtPrice, sku: product.sku, stock: product.inventory, images: [...product.images],
    color: product.color, size: product.size, storage: product.storage, ram: product.ram, processor: product.processor,
    condition: product.condition, specifications: { ...product.specifications }, customAttributes: { ...product.customAttributes },
    active: true, isDefault: product.variants.length === 0,
  };
}

export function VariantsSection({ values, setValues }: { values: ProductFormValues; setValues: React.Dispatch<React.SetStateAction<ProductFormValues>> }) {
  const update = (id: string, patch: Partial<ProductVariantFormValue>) => setValues((current) => ({ ...current, variants: current.variants.map((variant) => variant.id === id ? { ...variant, ...patch } : variant) }));
  const remove = (id: string) => setValues((current) => ({ ...current, variants: current.variants.filter((variant) => variant.id !== id) }));
  const makeDefault = (id: string) => setValues((current) => ({ ...current, variants: current.variants.map((variant) => ({ ...variant, isDefault: variant.id === id })) }));
  return (
    <section className="space-y-4 rounded-xl border border-[#d8a928]/25 bg-[#fcf5e8]/40 p-4 lg:col-span-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-gray-950">Product Variations</h2><p className="text-xs text-gray-500">Add variations here before Additional Details. Each new variation starts with the main product values.</p></div><button type="button" onClick={() => setValues((current) => ({ ...current, variants: [...current.variants, inheritedVariant(current)] }))} className="rounded-lg bg-[#1a1308] px-4 py-2 text-sm font-bold text-white">Add Variation</button></div>
      {values.variants.length === 0 ? <div className="rounded-xl border border-dashed border-[#d8a928]/40 bg-white p-5 text-center text-sm text-gray-500">No variations added. The main product will be used as-is.</div> : <p className="text-xs font-semibold text-gray-600">{values.variants.length} saved variation{values.variants.length === 1 ? "" : "s"} shown below.</p>}
      {values.variants.map((variant, index) => (
        <details key={variant.id} open className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <summary className="cursor-pointer font-bold text-gray-900">{variant.name || `Variation ${index + 1}`} {variant.isDefault ? <span className="ml-2 text-xs text-orange-600">Default</span> : null}</summary>
          <div className="mt-4 space-y-4">
            <div><h3 className="text-sm font-bold text-gray-900">Basic Information</h3><p className="text-xs text-gray-500">Use the same product information flow for this variation.</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Variation Name"><input className={inputClass} placeholder="e.g. Silver / 16GB / 512GB" value={variant.name} onChange={(e) => update(variant.id, { name: e.target.value })} /></Field>
              <Field label="SKU"><input className={inputClass} placeholder="Variation SKU" value={variant.sku || ""} onChange={(e) => update(variant.id, { sku: e.target.value })} /></Field>
              <Field label="Price"><input className={inputClass} type="number" min={0} step="0.01" value={variant.price} onChange={(e) => update(variant.id, { price: Number(e.target.value) })} /></Field>
              <Field label="Compare at Price"><input className={inputClass} type="number" min={0} step="0.01" value={variant.compareAtPrice ?? ""} onChange={(e) => update(variant.id, { compareAtPrice: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Inventory"><input className={inputClass} type="number" min={0} value={variant.stock} onChange={(e) => update(variant.id, { stock: Number(e.target.value) })} /></Field>
              <Field label="Description" className="sm:col-span-2 lg:col-span-3"><textarea rows={3} className={inputClass} placeholder="Describe this variation" value={variant.description || ""} onChange={(e) => update(variant.id, { description: e.target.value })} /></Field>
            </div>
            <div className="border-t border-gray-100 pt-4"><h3 className="mb-3 text-sm font-bold text-gray-900">Variation Attributes</h3>
            <AttributesFields value={variant} onChange={(patch) => update(variant.id, patch)} />
            </div>
            <AdminImageUpload label="Variant Images" folder="mmlaptop/products/variants" usedIn="product variant" mode="multiple" values={variant.images} onChangeMany={(images) => update(variant.id, { images })} />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={variant.active} onChange={(e) => update(variant.id, { active: e.target.checked })} /> Active</label>
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="radio" name="defaultVariant" checked={variant.isDefault} onChange={() => makeDefault(variant.id)} /> Default variant</label>
              <button type="button" onClick={() => setValues((current) => ({ ...current, variants: [...current.variants, { ...variant, id: crypto.randomUUID(), name: `${variant.name} Copy`, isDefault: false }] }))} className="text-sm font-bold text-blue-700">Duplicate</button>
              <button type="button" onClick={() => remove(variant.id)} className="text-sm font-bold text-red-600">Delete</button>
            </div>
          </div>
        </details>
      ))}
    </section>
  );
}
