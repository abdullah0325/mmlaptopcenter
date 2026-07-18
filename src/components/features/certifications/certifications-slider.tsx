"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  name: string;
  image: string;
  isVerifiedBy: boolean;
}

interface CertificationsSliderProps {
  initialData?: Certificate[];
}

export function CertificationsSlider({ initialData }: CertificationsSliderProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [verifiedByCerts, setVerifiedByCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const verified = initialData.filter(c => c.isVerifiedBy);
      const others = initialData.filter(c => !c.isVerifiedBy);
      setVerifiedByCerts(verified);
      setCertificates(others);
    }
  }, [initialData]);

  const staticCerts = [
    { name: "Authorized Dealer", image: "https://placehold.co/120x120?text=Authorized" },
    { name: "Genuine Products", image: "https://placehold.co/120x120?text=Genuine" },
    { name: "Warranty Support", image: "https://placehold.co/120x120?text=Warranty" },
    { name: "Secure Checkout", image: "https://placehold.co/120x120?text=Secure" },
  ];

  const displayVerified = verifiedByCerts.length > 0 ? verifiedByCerts : [];
  const displayCerts = certificates.length > 0 ? certificates : staticCerts;

  return (
    <section className="bg-[#fcf5e8] py-16">
      <div className="mx-auto mb-10 max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold text-[#0a0a0a] sm:text-4xl">
          Our Trusted Quality Certifications
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-[#5A5E55]">
          Certified for quality and authenticity. MM Laptop Center delivers genuine laptops with full manufacturer warranty.
        </p>
      </div>

      {displayVerified.length > 0 && (
        <div className="mx-auto mb-10 max-w-4xl px-6">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-[#0a0a0a] mb-6">Verified By</h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {displayVerified.map((cert, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      sizes="64px"
                      className="object-contain p-2"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#5A5E55]">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#fcf5e8] to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#fcf5e8] to-transparent" />

        <motion.div
          className="flex w-max gap-14"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {[...displayCerts, ...displayCerts].map((cert, index) => (
            <div
              key={index}
              className="flex min-w-[140px] flex-col items-center gap-3 opacity-70 transition hover:opacity-100"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white shadow-sm">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                />
              </div>

              <span className="text-sm font-medium text-[#5A5E55]">
                {cert.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}