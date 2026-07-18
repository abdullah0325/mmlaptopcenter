export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash";

export type CheckoutDetails = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

export const COD_LIMIT = 50_000;
export const JAZZCASH_LIMIT = 10_000;

export const bankAccount = {
  bank: "HBL",
  title: "Mudassir Meer",
  iban: "PK66HABB0005057900704603",
  number: "05057900704603",
};

export const jazzCashAccount = { title: "Mudassir Meer", number: "03048928282" };
