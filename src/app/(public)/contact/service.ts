
import { getPage as getPageFromDb } from "@/lib/storefront";
import { invariant } from "@esmate/utils";

export async function getPage(handle: string) {
  const page = await getPageFromDb(handle);
  invariant(page, "Page not found");
  return page;
}

