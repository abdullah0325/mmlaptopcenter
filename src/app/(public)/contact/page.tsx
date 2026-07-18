import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact MM Laptop Center | Premium Laptops Support",
  description:
    "Contact MM Laptop Center for inquiries about Premium laptops products, bulk orders, and delivery across Pakistan.",
  keywords: [
    "MM Laptop Center contact",
    "Premium laptops",
    "laptops Pakistan",
    "bulk salt supplier",
    "customer support",
  ],
  openGraph: {
    title: "Contact MM Laptop Center",
    description:
      "Have questions about our Premium laptops products? Get in touch with MM Laptop Center.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

