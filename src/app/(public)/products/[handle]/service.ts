import { getProduct } from "@/lib/storefront";
import { invariant } from "@esmate/utils";
import { prisma } from "@/lib/prisma";

export async function getProductSingle(handle: string) {
  const product = await getProduct(handle);
  invariant(product, "product is not available");

  // Fetch extra product details from Prisma.
  const customData = await prisma.product.findUnique({
    where: { handle },
  }) as {
    details: Array<{ id: string; title: string; description: string; image?: string; videoUrl?: string }>;
  } | null;

  return {
    ...product,
    details: customData?.details || [],
  };
}

