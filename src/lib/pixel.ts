export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const META_CURRENCY = "PKR" as const;

export type MetaContent = {
  id: string;
  quantity: number;
  item_price: number;
  variant?: string;
};

export type MetaEventParameters = {
  content_ids?: string[];
  contents?: MetaContent[];
  content_name?: string;
  content_category?: string;
  content_type?: "product";
  value?: number;
  currency?: typeof META_CURRENCY;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  contact_method?: string;
};

type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Contact"
  | "Lead";

type MetaPixelFunction = (
  command: "track",
  event: MetaStandardEvent,
  parameters?: MetaEventParameters,
) => void;

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
  }
}

function track(event: MetaStandardEvent, parameters?: MetaEventParameters): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  try {
    window.fbq("track", event, parameters);
  } catch {
    // Tracking must never interrupt shopping when Meta is blocked or unavailable.
  }
}

export const pageView = (): void => track("PageView");
export const viewContent = (parameters: MetaEventParameters): void =>
  track("ViewContent", parameters);
export const search = (searchString: string): void =>
  track("Search", { search_string: searchString });
export const addToCart = (parameters: MetaEventParameters): void =>
  track("AddToCart", parameters);
export const initiateCheckout = (parameters: MetaEventParameters): void =>
  track("InitiateCheckout", parameters);
export const addPaymentInfo = (parameters: MetaEventParameters): void =>
  track("AddPaymentInfo", parameters);
export const purchase = (parameters: MetaEventParameters): void =>
  track("Purchase", parameters);
export const contact = (contactMethod = "WhatsApp"): void =>
  track("Contact", { contact_method: contactMethod });
export const lead = (contactMethod = "contact_form"): void =>
  track("Lead", { contact_method: contactMethod });

