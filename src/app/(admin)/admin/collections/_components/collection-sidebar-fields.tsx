import { AdminImageUpload } from "@/components/admin/image-upload";
import type { CollectionFormValues } from "./collection-form";

type Props = {
  values: CollectionFormValues;
  setValues: React.Dispatch<React.SetStateAction<CollectionFormValues>>;
  productSearch: string;
  setProductSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Array<{ id: string; title: string; handle: string }>;
  saving: boolean;
};

export function CollectionSidebarFields(props: Props) {
  return (
    <div className="space-y-4">
      <AdminImageUpload label="Collection Image (optional)" folder="mmlaptop/collections" usedIn="collection" value={props.values.image} onChange={(url) => props.setValues((v) => ({ ...v, image: url }))} />
      <AssignProducts {...props} />
      <SeoFields values={props.values} setValues={props.setValues} />
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="submit" disabled={props.saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50">
          {props.saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

function AssignProducts({ values, setValues, productSearch, setProductSearch, filteredProducts }: Props) {
  return (
    <div className="rounded-lg border border-[#d8a928]/20 bg-[#fcf5e8]/60 p-4">
      <p className="text-sm font-semibold text-[#0a0a0a]">Assign Products</p>
      <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Search products..." />
      <div className="mt-3 max-h-40 space-y-2 overflow-auto">
        {filteredProducts.map((product) => (
          <label key={product.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.productHandles.includes(product.handle)} onChange={(e) => setValues((v) => ({ ...v, productHandles: e.target.checked ? [...v.productHandles, product.handle] : v.productHandles.filter((handle) => handle !== product.handle) }))} />
            {product.title}
          </label>
        ))}
      </div>
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
