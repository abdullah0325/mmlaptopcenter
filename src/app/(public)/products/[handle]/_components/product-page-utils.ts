export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
};

export type MoneyValue = {
  amount: string;
  currencyCode: string;
};

export type PriceBlock = {
  hasDiscount: boolean;
  savedAmount: number;
  savedPct: number;
  displayPrice: MoneyValue;
  compareAt: number | null;
};

export function formatMoney(amount: string | number, currencyCode = "PKR") {
  const value = typeof amount === "number" ? amount : parseFloat(amount || "0");
  const formatted = value.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  });

  return currencyCode === "PKR" ? `Rs. ${formatted}` : `${formatted} ${currencyCode}`;
}

export function getFallbackReviewStats(seedText: string): ReviewStats {
  let seed = 0;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) % 10000;
  }

  const totalReviews = 24 + (seed % 73);
  const averageRating = 4.5 + (seed % 4) / 10;

  return {
    averageRating,
    totalReviews,
    distribution: {
      5: Math.round(totalReviews * 0.74),
      4: Math.round(totalReviews * 0.18),
      3: Math.round(totalReviews * 0.05),
      2: Math.round(totalReviews * 0.02),
      1: Math.max(0, totalReviews - Math.round(totalReviews * 0.99)),
    },
  };
}

export function buildWhatsAppOrderMessage({
  title,
  price,
  quantity,
  selectedOptions,
  url,
}: {
  title: string;
  price: string;
  quantity: number;
  selectedOptions?: string;
  url?: string;
}) {
  return [
    "Hi MM Laptop Center,",
    "",
    "I want to order this product:",
    `Product: ${title}`,
    `Price: ${price}`,
    `Quantity: ${quantity}`,
    selectedOptions ? `Options: ${selectedOptions}` : null,
    url ? `Product Link: ${url}` : null,
    "",
    "Please confirm availability and delivery details.",
  ]
    .filter(Boolean)
    .join("\n");
}
