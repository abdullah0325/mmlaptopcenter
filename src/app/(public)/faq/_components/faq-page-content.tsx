"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Laptop, ShieldCheck, Truck } from "@esmate/shadcn/pkgs/lucide-react";

const infoCards = [
  {
    icon: <Laptop className="h-5 w-5" />,
    title: "Premium laptops",
    text: "Curated Apple MacBooks, business laptops, and gaming machines chosen for performance and reliability.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Verified quality",
    text: "Every device is checked for battery health, hardware condition, and overall usability before it reaches you.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Delivery & support",
    text: "Fast delivery across Pakistan, with responsive support for setup, troubleshooting, and warranty questions.",
  },
];

const faqItems = [
  {
    question: "What types of laptops do you sell?",
    answer:
      "We stock Apple MacBooks, business laptops, gaming laptops, and premium accessories from trusted brands such as Dell, HP, Lenovo, ASUS, and Apple.",
  },
  {
    question: "Are your devices tested before sale?",
    answer:
      "Yes. Each laptop is inspected for battery health, keyboard responsiveness, display quality, ports, and charging performance before listing.",
  },
  {
    question: "Do you offer warranty support?",
    answer:
      "We provide warranty-backed support for eligible products and help with after-sales questions related to setup, repairs, and replacement concerns.",
  },
  {
    question: "Can I buy a used or refurbished laptop?",
    answer:
      "Yes. We offer carefully inspected pre-owned and refurbished devices that are cleaned, tested, and priced transparently.",
  },
  {
    question: "Do you deliver across Pakistan?",
    answer:
      "Yes. We ship to customers across Pakistan and also assist with pickup and delivery coordination where available.",
  },
  {
    question: "Do you help with choosing the right laptop?",
    answer:
      "Absolutely. Our team can guide you based on your work, study, creative needs, gaming preferences, and budget.",
  },
  {
    question: "Do you sell accessories too?",
    answer:
      "Yes. We also stock chargers, bags, mice, keyboards, USB-C hubs, and other laptop accessories to complete your setup.",
  },
  {
    question: "How can I contact support after purchase?",
    answer:
      "You can reach our support team through the contact page or by calling the store directly for purchase assistance and device support.",
  },
];

export function FaqPageContent() {
  return (
    <div className="bg-background">
      <section className="px-6 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Clear, practical answers about our laptops, warranty support, delivery, and buying guidance.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {infoCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-gray-200 bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-4xl divide-y divide-border">
          {faqItems.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="m-2 rounded-2xl border border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-start justify-between py-6 text-left"
      >
        <span className="pl-4 text-base font-semibold text-foreground">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="mr-4 h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-8 pb-6 text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
