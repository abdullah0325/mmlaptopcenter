export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type CategoryItem = { id: string; name: string; parentId?: string | null };
export type CollectionItem = { id: string; title: string };

export type ProductDetail = {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
};

export type ProductAttributes = {
  color?: string;
  size?: string;
  storage?: string;
  ram?: string;
  processor?: string;
  condition?: string;
  specifications: Record<string, string>;
  customAttributes: Record<string, string>;
};

export type ProductVariantFormValue = ProductAttributes & {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  stock: number;
  images: string[];
  active: boolean;
  isDefault: boolean;
};

export type ProductFormValues = ProductAttributes & {
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  inventory: number;
  availableForSale: boolean;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
  featuredImage?: string;
  productType?: string;
  categoryId?: string;
  subcategoryId?: string;
  vendor?: string;
  tags: string[];
  collectionIds: string[];
  isFeatured: boolean;
  displayOrder: number;
  details: ProductDetail[];
  variants: ProductVariantFormValue[];
};
