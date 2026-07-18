"use client";

import { useState } from "react";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Input } from "@esmate/shadcn/components/ui/input";
import { Textarea } from "@esmate/shadcn/components/ui/textarea";
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  Clock,
} from "@esmate/shadcn/pkgs/lucide-react";
import { contact as trackContact, lead } from "@/lib/pixel";

const faqs = [
  {
    q: "What is your return policy?",
    a: "Returns are accepted within 7 days of delivery for unused and unopened products.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are delivered within 3 to 5 working days across Pakistan.",
  },
  {
    q: "Are your laptops authentic?",
    a: "Yes. We source directly and inspect every device to ensure genuine quality with full warranty.",
  },
  {
    q: "Do you offer warranty support?",
    a: "All our products come with official manufacturer warranty and our dedicated after-sales support.",
  },
  {
    q: "Can I place a bulk order?",
    a: "Yes, contact us for bulk orders. We offer special pricing for businesses and large quantities.",
  },
];

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject,
          message,
          type: "contact",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      // Track Lead event on successful form submission
      lead("contact form");

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-gray-50 text-[#0a0a0a]">
      {/* Hero Section - matching About page styling */}
      <section className="relative bg-[#fcf5e8] border-b border-[#d8a928]/35 py-20 lg:py-32 overflow-hidden">
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-[#d8a928]/25 blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-40 -mb-40 h-96 w-96 rounded-full bg-[#f6a45d]/20 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex rounded-full border border-[#d8a928]/50 bg-[#d8a928]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b57910]">
              Get in Touch
            </span>
            
            <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Contact MM Laptop Center
              <span className="block text-[#ea580c] mt-2">We're Here to Help</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 leading-relaxed">
              Questions about Premium laptops, bulk orders, or delivery? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            
            {/* Left Column: Contact Info */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
              <div>
                <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  Contact Information
                </span>
                <h2 className="font-serif mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Reach Out to Us
                </h2>
                <p className="mt-3 text-gray-600">
                  We're available 7 days a week. Drop by our showroom or get in touch online.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-[#f6a45d] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{process.env.NEXT_PUBLIC_COMPANY_ADDRESS} | All Pakistan delivery available</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-[#f6a45d] shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">{process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-[#f6a45d] shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">{process.env.NEXT_PUBLIC_COMPANY_EMAIL}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-[#f6a45d] shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Mon-Sat: 10:00 AM - 8:00 PM<br />Sunday: 12:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("WhatsApp contact page")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#f6a45d] px-5 py-3 text-sm font-semibold text-[#fcf5e8] transition hover:bg-[#d8861f]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-8 border border-[#d8a928]/20 shadow-lg">
                {submitted ? (
                  <div className="text-center py-12">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                      Message Sent Successfully
                    </h2>
                    <p className="text-gray-600">
                      We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">
                      Send us a Message
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                      />

                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                      />

                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone (optional)"
                      />

                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        required
                      />

                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Your message"
                        required
                      />

                      <Button
                        className="w-full bg-[#f6a45d] hover:bg-[#d8861f] text-[#fcf5e8]"
                        disabled={submitting}
                      >
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Find Us
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl mt-4">
              Our Showroom Location
            </h2>
          </div>
          <div className="rounded-3xl overflow-hidden border border-[#d8a928]/20 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10195.522294036124!2d71.83038763887566!3d34.16987912349857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d9366c957b52e9%3A0xc5d592ad458be7dc!2sSarderi%2C%20Pakistan!5e1!3m2!1sen!2s!4v1782963543400!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="MM Laptop Center Location"
            />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              FAQs
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Find answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid gap-4 md:max-w-3xl md:mx-auto">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[#d8a928]/30 bg-white p-6 transition hover:bg-[#fcf5e8]/60"
              >
<summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 transition group-open:rotate-180 text-[#f6a45d]" />
                </summary>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

