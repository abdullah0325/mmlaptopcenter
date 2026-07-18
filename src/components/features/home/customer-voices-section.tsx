import Testimonials from "@/components/features/home/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";

export function CustomerVoicesSection() {
  return (
    <section className="bg-gray-100 px-6 py-10 lg:px-4 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Customer Voices"
          title="What Our Customers Say"
          description="Trusted by buyers who value performance, reliability, and support."
        />
        <div className="mt-10">
          <Testimonials />
        </div>
      </div>
    </section>
  );
}
