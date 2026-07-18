import { Button } from "@esmate/shadcn/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  CheckCircle,
  Award,
  Users,
} from "@esmate/shadcn/pkgs/lucide-react";

const highlights = [
  "20+ Years of industry leadership",
  "Hand-selected, tested inventory",
  "Specialists in Apple MacBooks & Gaming Laptops",
  "Official after-sales warranty support",
];

const values = [
  {
    icon: Award,
    title: "20-Year Legacy",
    description:
      "Since 2006, Mudassir Meer has built a reputation based on transparency. We don't just sell tech; we guide you to the perfect machine.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Verification",
    description:
      "We source directly and inspect every device. From keyboard response to battery health, we certify that what you see is what you get.",
  },
  {
    icon: Sparkles,
    title: "Premium Catalog",
    description:
      "We curate only high-performance Apple MacBooks, enterprise-grade business laptops, and authentic gaming gear that lasts.",
  },
  {
    icon: Headphones,
    title: "Human Support",
    description:
      "No robotic scripts. Our experienced support team helps you set up, upgrade, and troubleshoot your system post-purchase.",
  },
];

export function AboutPageContent() {
  return (
    <main className="bg-gray-50 text-[#0a0a0a]">
      <section className="relative overflow-hidden border-b border-[#d8a928]/35 bg-[#fcf5e8] py-20 text-[#0a0a0a] lg:py-32">
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-[#d8a928]/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-96 w-96 rounded-full bg-[#f6a45d]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <span className="inline-flex rounded-full border border-[#d8a928]/50 bg-[#d8a928]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b57910]">
                Our 20+ Year Legacy
              </span>

              <h1 className="font-serif text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Authentic Laptops & Accessories.
                <span className="mt-2 block text-[#ea580c]">Founded by Mudassir Meer.</span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
                For over two decades, we have been Pakistan's go-to destination for high-quality Apple MacBooks, performance laptops, and certified tech accessories.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  asChild
                  className="rounded-full bg-[#f6a45d] px-8 py-6 text-sm font-semibold text-black transition-all hover:bg-[#ffb06e]"
                >
                  <Link href="/products">Browse Laptops</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-gray-300 bg-white px-8 py-6 text-sm font-semibold text-gray-800 transition-all hover:bg-gray-50"
                >
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-[#d8a928] to-[#f6a45d] opacity-40 blur-md" />
              <div className="relative aspect-video overflow-hidden rounded-[28px] border border-[#d8a928]/35 bg-white shadow-xl lg:aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
                  alt="Premium workspace setups"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="space-y-8 lg:col-span-7">
              <div>
                <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  How We Started
                </span>
                <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  Twenty years ago, buying a laptop was a leap of faith.
                </h2>
              </div>

              <div className="space-y-6 text-base leading-relaxed text-gray-600 sm:text-lg">
                <p>
                  Back in the early 2000s, our founder, <strong className="font-semibold text-gray-900">Mudassir Meer</strong>, noticed a persistent problem in Pakistan's tech market: a lack of trust. Customers wanting high-end laptops or Apple MacBooks were often met with faked specifications, swapped batteries, and non-existent warranty support.
                </p>
                <p>
                  Determined to create a change, Mudassir set up a single repair and testing table with one core philosophy: <strong className="font-semibold text-gray-900">absolute authenticity</strong>. He believed that if you treat customers with honesty, explain spec sheets clearly, and supply only tested, genuine products, people would notice.
                </p>
                <p>
                  They did. Today, MM Laptop Center has grown into one of the most trusted tech hubs in the country. We specialize in curate-select new and pre-owned Apple MacBooks, elite business ultrabooks, powerful gaming setups, and genuine matching accessories.
                </p>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
                    <CheckCircle className="h-5 w-5 shrink-0 text-[#d8a928]" />
                    <span className="text-sm font-semibold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-[#d8a928] bg-[#fcf5e8] p-8 text-gray-950 shadow-xl">
                <div className="absolute right-0 top-0 h-16 w-16 rounded-tr-3xl border-r-2 border-t-2 border-[#d8a928]" />
                <h3 className="mb-4 font-serif text-2xl font-bold text-[#ea580c]">Our Commitment</h3>
                <blockquote className="mb-6 text-base leading-relaxed italic text-gray-700 sm:text-lg">
                  &ldquo;MM Laptop Center isn't just about selling boxes of electronics. We help software developers compile faster, students write their theses without battery anxiety, and gamers play with smooth frames. We stand behind every screw in every laptop we sell.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8a928] bg-[#f6a45d]/20 text-[#ea580c]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-950">Mudassir Meer</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#b57910]">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Our Collections
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Curated Tech Built for Performance
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              We select, audit, and showcase only premium hardware devices that match modern workloads.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-[#d8a928]/20 bg-white p-8 shadow-lg transition-all hover:border-[#f6a45d]">
              <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"
                  alt="Apple MacBooks"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-950 transition-colors group-hover:text-[#ea580c]">Apple MacBooks</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Specialized configurations of MacBook Air and Pro. Inspected for battery cycles, hardware thermals, and display perfection. Perfect for creative designers and programmers.
              </p>
            </div>

            <div className="group rounded-3xl border border-[#d8a928]/20 bg-white p-8 shadow-lg transition-all hover:border-[#f6a45d]">
              <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
                  alt="Premium Laptops"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-950 transition-colors group-hover:text-[#ea580c]">Premium Laptops</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                High-performance Windows machines from Dell, HP, Lenovo, and ASUS. Outfitted with NVMe SSDs and Intel Core / AMD Ryzen chipsets built for heavy productivity.
              </p>
            </div>

            <div className="group rounded-3xl border border-[#d8a928]/20 bg-white p-8 shadow-lg transition-all hover:border-[#f6a45d]">
              <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=600&q=80"
                  alt="Tech Accessories"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-950 transition-colors group-hover:text-[#ea580c]">Tech Accessories</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Genuine peripherals including mechanical keyboards, ergonomic mice, multi-port USB-C hubs, protective sleeves, and high-resolution monitors to complete your workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Why Choose Us
              </span>
              <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Four pillars of our business success
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
                We believe in building relationships that go beyond a simple transaction. Mudassir Meer's original goal of establishing trust is visible in the way we handle testing, packaging, and warranty claims.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="rounded-full border border-[#d8a928]/45 bg-black px-7 py-6 text-[#f6a45d] hover:bg-gray-900">
                  <Link href="/products">Shop the Catalog</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-gray-300 bg-white px-7 py-6 text-gray-800 hover:bg-gray-50">
                  <Link href="/contact">Visit Our Showroom</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-[#d8a928]/25 bg-white p-6 shadow-md transition-all duration-300 hover:border-[#f6a45d]">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="mt-4 font-serif text-base font-bold text-gray-950">{item.title}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
