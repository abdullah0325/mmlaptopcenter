import { Briefcase, Gamepad2, Laptop } from "@esmate/shadcn/pkgs/lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const highlights = [
  {
    icon: Gamepad2,
    title: "Gaming Laptops",
    points: [
      "Latest NVIDIA RTX & AMD GPUs",
      "High-refresh rate displays up to 165Hz",
      "Advanced cooling for extended sessions",
      "RGB keyboards and premium audio",
    ],
  },
  {
    icon: Briefcase,
    title: "Business Laptops",
    points: [
      "Enterprise-grade security features",
      "All-day battery life for remote work",
      "Lightweight designs under 1.5kg",
      "Premium build with MIL-STD durability",
    ],
  },
  {
    icon: Laptop,
    title: "Accessories & More",
    points: [
      "Monitors, keyboards, and mice",
      "Laptop bags and protective sleeves",
      "USB-C hubs and docking stations",
      "Genuine warranty on all products",
    ],
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-white px-6 py-10 lg:px-4 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Why Choose MM Laptop Center"
          description="Your trusted destination for genuine laptops and tech accessories."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-[#d8a928]/20 bg-white p-8 shadow-lg transition-all hover:border-[#f6a45d]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-950">{item.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="font-bold text-[#d8a928]">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
