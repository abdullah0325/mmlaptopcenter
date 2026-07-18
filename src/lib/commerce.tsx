"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { initiateCheckout } from "@/lib/pixel";

type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

type ProductData = {
  id: string;
  handle: string;
  title: string;
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      price: MoneyV2;
      compareAtPrice: MoneyV2 | null;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      image: {
        id: string;
      } | null;
    }>;
  };
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText: string | null;
    }>;
  };
};

type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MoneyV2;
  };
  merchandise: {
    id: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    product: {
      id?: string;
      handle: string;
      title: string;
    };
    price: MoneyV2;
  };
};

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  linesAdd: (
    lines: Array<{
      merchandiseId: string;
      quantity: number;
      title?: string;
      price?: { amount: string; currencyCode: string };
      imageUrl?: string;
    }>,
  ) => Promise<void>;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  registerProduct: (product: ProductData) => void;
  registerSimpleProduct: (product: SimpleProductData) => void;
};

type CartLineContextValue = {
  line: CartLine;
  removeLine: (lineId: string) => void;
};

const CART_STORAGE_KEY = "mmlaptop-cart";

const CartContext = createContext<CartContextValue | null>(null);
const CartLineContext = createContext<CartLineContextValue | null>(null);

function formatAmount(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateLineTotal(price: MoneyV2, quantity: number): MoneyV2 {
  return {
    amount: (Number(price.amount) * quantity).toFixed(2),
    currencyCode: price.currencyCode,
  };
}

export function Money({
  data,
  className,
}: {
  data: MoneyV2 | null | undefined;
  className?: string;
}) {
  if (!data) {
    return null;
  }

  return <span className={className}>{formatAmount(Number(data.amount), data.currencyCode)}</span>;
}

type SimpleProductData = {
  handle: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText: string | null } | null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [productRegistry, setProductRegistry] = useState<Record<string, ProductData>>({});
  const [simpleProductRegistry, setSimpleProductRegistry] = useState<Record<string, SimpleProductData>>({});

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CartLine[];
      if (Array.isArray(parsed)) {
        setLines(parsed);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const registerProduct = useCallback((product: ProductData) => {
    setProductRegistry((current) => ({
      ...current,
      [product.handle]: product,
    }));
  }, []);

  const registerSimpleProduct = useCallback((product: SimpleProductData) => {
    setSimpleProductRegistry((current) => ({
      ...current,
      [product.handle]: product,
    }));
  }, []);

  const linesAdd: CartContextValue["linesAdd"] = async (incomingLines) => {
    setLines((current) => {
      const nextLines = [...current];

      for (const incomingLine of incomingLines) {
        const product = Object.values(productRegistry).find((registeredProduct) =>
          registeredProduct.variants.nodes.some(
            (variant) => variant.id === incomingLine.merchandiseId,
          ),
        );

        const variant = product?.variants.nodes.find(
          (candidate) => candidate.id === incomingLine.merchandiseId,
        );

        const simpleProduct = Object.values(simpleProductRegistry).find(
          (sp) => sp.handle === incomingLine.merchandiseId,
        );

        if (!product && !variant && !simpleProduct && !incomingLine.title) {
          toast.error("This product is not ready for cart storage yet.");
          continue;
        }

        let image = null;
        let price = { amount: "0", currencyCode: "PKR" };
        let title = "";

        if (incomingLine.title) {
          title = incomingLine.title;
          price = incomingLine.price || { amount: "0", currencyCode: "PKR" };
          if (incomingLine.imageUrl) {
            image = { url: incomingLine.imageUrl, altText: title };
          }
        } else if (product && variant) {
          const currentImageId = variant.image?.id;
          image =
            product.images.nodes.find((candidate) => candidate.id === currentImageId) ??
            product.images.nodes[0] ??
            null;
          price = variant.price;
          title = product.title;
        } else if (simpleProduct) {
          image = simpleProduct.image || null;
          price = simpleProduct.price;
          title = simpleProduct.title;
        }

        const effectiveId = product && variant ? incomingLine.merchandiseId : `${incomingLine.merchandiseId}-simple`;

        const existingLine = nextLines.find(
          (line) => line.merchandise.id === effectiveId,
        );

        if (existingLine) {
          existingLine.quantity += incomingLine.quantity;
          existingLine.cost.totalAmount = calculateLineTotal(
            existingLine.merchandise.price,
            existingLine.quantity,
          );
          continue;
        }

        nextLines.push({
          id: effectiveId,
          quantity: incomingLine.quantity,
          cost: {
            totalAmount: calculateLineTotal(price, incomingLine.quantity),
          },
          merchandise: {
            id: effectiveId,
            image: image
              ? {
                  url: image.url,
                  altText: image.altText,
                }
              : null,
            selectedOptions: variant?.selectedOptions || [],
            product: {
              id: product?.id || incomingLine.merchandiseId,
              handle: product?.handle || simpleProduct?.handle || incomingLine.merchandiseId,
              title: title,
            },
            price: price,
          },
        });
      }

      return nextLines;
    });
  };

  const removeLine = (lineId: string) => {
    setLines((current) => current.filter((line) => line.id !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.id !== lineId));
      return;
    }
    setLines((current) =>
      current.map((line) => {
        if (line.id === lineId) {
          const newQuantity = quantity;
          const pricePerUnit = {
            amount: (Number(line.cost.totalAmount.amount) / line.quantity).toFixed(2),
            currencyCode: line.cost.totalAmount.currencyCode,
          };
          return {
            ...line,
            quantity: newQuantity,
            cost: {
              totalAmount: {
                amount: (Number(pricePerUnit.amount) * newQuantity).toFixed(2),
                currencyCode: pricePerUnit.currencyCode,
              },
            },
          };
        }
        return line;
      }),
    );
  };

  const clear = () => {
    setLines([]);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
      linesAdd,
      removeLine,
      updateQuantity,
      clear,
      registerProduct,
      registerSimpleProduct,
    }),
    [lines, productRegistry, simpleProductRegistry],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function ProductProvider({
  data,
  children,
}: {
  data: ProductData;
  children: ReactNode;
}) {
  const { registerProduct } = useCart();

  useEffect(() => {
    registerProduct(data);
  }, [data, registerProduct]);

  return <>{children}</>;
}

export function CartLineProvider({
  line,
  children,
}: {
  line: CartLine;
  children: ReactNode;
}) {
  const { removeLine } = useCart();
  return (
    <CartLineContext.Provider value={{ line, removeLine }}>
      {children}
    </CartLineContext.Provider>
  );
}

function useCartLine() {
  const context = useContext(CartLineContext);
  if (!context) {
    throw new Error("Cart line components must be used within CartLineProvider");
  }

  return context;
}

export function CartLineQuantity() {
  const { line } = useCartLine();
  return <>{line.quantity}</>;
}

export function CartLineQuantityAdjustButton({
  adjust,
  className,
  children,
}: {
  adjust: "remove";
  className?: string;
  children: ReactNode;
}) {
  const { line, removeLine } = useCartLine();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (adjust === "remove") {
          removeLine(line.id);
        }
      }}
    >
      {children}
    </button>
  );
}

export function CartCost({ amountType }: { amountType: "subtotal" }) {
  const { lines } = useCart();
  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  );

  if (amountType !== "subtotal") {
    return null;
  }

  return (
    <Money
      data={{
        amount: subtotal.toFixed(2),
        currencyCode: lines[0]?.cost.totalAmount.currencyCode ?? "PKR",
      }}
    />
  );
}

export function CartCheckoutButton({
  children,
  className,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const cart = useCart();

  const startCheckout = () => {
    initiateCheckout({
      content_ids: cart.lines.map((line) => line.merchandise.product.id || line.merchandise.id.replace(/-simple$/, "")),
      contents: cart.lines.map((line) => ({
        id: line.merchandise.product.id || line.merchandise.id.replace(/-simple$/, ""),
        quantity: line.quantity,
        item_price: Number(line.merchandise.price.amount),
        variant: line.merchandise.selectedOptions.map((option) => `${option.name}: ${option.value}`).join(", ") || undefined,
      })),
      content_type: "product",
      value: cart.lines.reduce((sum, line) => sum + Number(line.cost.totalAmount.amount), 0),
      currency: "PKR",
      num_items: cart.totalQuantity,
    });
    router.push("/checkout");
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={className}
      onClick={startCheckout}
    >
      {children}
    </button>
  );
}
