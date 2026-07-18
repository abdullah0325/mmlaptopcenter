
import { getAllCollections } from "@/lib/storefront";
import { invariant } from "@esmate/utils";

export async function getCollectionList(cursor?: string) {
  const collections = await getAllCollections(cursor);
  invariant(collections, "collections are not available");
  return collections;
}

