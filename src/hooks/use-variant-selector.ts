import { useState, useMemo, useEffect } from "react";

interface Product {
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
  options: { name: string; values: string[] }[];
}

type OptionValue = {
  value: string;
  selected: boolean;
  disabled: boolean;
};

type Option = {
  name: string;
  values: OptionValue[];
};

function getInitialSelections(product: Product, defaultVariantId: string): Record<string, string> {
  const initial: Record<string, string> = {};
  const defaultVariant = product.variants.nodes.find((variant) => variant.id === defaultVariantId);
  for (const option of defaultVariant?.selectedOptions || []) {
    initial[option.name] = option.value;
  }
  return initial;
}

export function useVariantSelector(product: Product, defaultVariantId: string) {
  const initialSelections = useMemo(() => getInitialSelections(product, defaultVariantId), [defaultVariantId, product]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(initialSelections);

  useEffect(() => {
    setSelectedValues(initialSelections);
  }, [initialSelections]);

  const options: Option[] = useMemo(() => {
    const getAvailableValues = (optionName: string): Set<string> => {
      const optionIndex = product.options.findIndex((opt) => opt.name === optionName);
      const priorSelections = product.options
        .slice(0, optionIndex)
        .map((opt) => ({ name: opt.name, value: selectedValues[opt.name] }))
        .filter((sel) => sel.value);

      const matchingVariants = product.variants.nodes.filter((variant) =>
        priorSelections.every((sel) =>
          variant.selectedOptions.some((vo) => vo.name === sel.name && vo.value === sel.value),
        ),
      );

      return new Set(
        matchingVariants.flatMap((v) => 
          v.selectedOptions.filter((so) => so.name === optionName).map((so) => so.value)
        ),
      );
    };

    return product.options.map((option, index) => ({
      name: option.name,
      values: option.values.map((value) => {
        const availableValues = getAvailableValues(option.name);
        return {
          value,
          selected: selectedValues[option.name] === value,
          disabled: index > 0 && availableValues.size > 0 && !availableValues.has(value),
        };
      }),
    }));
  }, [selectedValues, product]);

  const variantId = useMemo(() => {
    const chosenOptions = Object.entries(selectedValues);
    if (!chosenOptions.length) return defaultVariantId;

    const variant = product.variants.nodes.find(
      (v) => v.availableForSale && v.selectedOptions.length > 0 && chosenOptions.every(([name, value]) => v.selectedOptions.some((option) => option.name === name && option.value === value)),
    );
    return variant?.id || defaultVariantId;
  }, [defaultVariantId, selectedValues, product]);

  const selectOption = (name: string, value: string) => {
    const optionIndex = product.options.findIndex((opt) => opt.name === name);
    const newSelections = { ...selectedValues, [name]: value };
    if (!value) delete newSelections[name];
    
    product.options.slice(optionIndex + 1).forEach((opt) => delete newSelections[opt.name]);

    setSelectedValues(newSelections);
  };

  const selectVariant = (id: string) => {
    const variant = product.variants.nodes.find((item) => item.id === id && item.availableForSale);
    if (!variant) return;
    setSelectedValues(Object.fromEntries(variant.selectedOptions.map((option) => [option.name, option.value])));
  };

  return { variantId: variantId || defaultVariantId, options, selectOption, selectVariant };
}
