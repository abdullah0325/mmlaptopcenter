import type { ProductFormValues } from "./types";

export type ProductSectionProps = {
  values: ProductFormValues;
  setValues: React.Dispatch<React.SetStateAction<ProductFormValues>>;
};

export type SaveableSectionProps = ProductSectionProps & {
  mode: "create" | "edit";
};
