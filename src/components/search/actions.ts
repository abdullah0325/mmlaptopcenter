'use server';

import { searchProducts as searchProductsInDb } from "@/lib/storefront";

export async function searchProducts(query: string) {
  if (!query) return [];

  try {
    return await searchProductsInDb(query);
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}
