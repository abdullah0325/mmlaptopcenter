import type { ProductFormValues } from "./types";

export async function loadProductExtras(
  productId: string,
  setValues: React.Dispatch<React.SetStateAction<ProductFormValues>>,
) {
  await loadExtra(productId, "details", (data) => {
    if (data.details) setValues((v) => ({ ...v, details: data.details }));
  });
}

export async function saveProductExtra(
  productId: string | undefined,
  name: "details",
  value: unknown,
  setSaving: (saving: boolean) => void,
  setError: (error: string | null) => void,
) {
  if (!productId) return;
  setSaving(true);
  setError(null);
  try {
    const res = await fetch(`/api/admin/products/${productId}/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [name]: value }),
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error((await res.json()).error || `Failed to save ${name}`);
    alert(`${name[0].toUpperCase()}${name.slice(1)} saved successfully!`);
  } catch (err: any) {
    setError(err.message || `Failed to save ${name}`);
  } finally {
    setSaving(false);
  }
}

async function loadExtra(productId: string, name: string, onData: (data: any) => void) {
  try {
    const res = await fetch(`/api/admin/products/${productId}/${name}`, { next: { revalidate: 0 } });
    onData(await res.json());
  } catch (error) {
    console.error(`Failed to load ${name}:`, error);
  }
}
