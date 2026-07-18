import type { Certificate } from "./types";

export function CertificatesGrid({
  certificates, openModal, deleteCert,
}: {
  certificates: Certificate[];
  openModal: (cert: Certificate) => void;
  deleteCert: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((cert) => (
        <div key={cert.id} className="rounded-lg border border-[#d8a928]/20 bg-white p-4">
          <img src={cert.image} alt={cert.name} className="mb-2 h-20 w-auto object-contain" />
          <h3 className="font-medium text-[#0a0a0a]">{cert.name}</h3>
          <p className="text-xs text-[#5A5E55]">Order: {cert.order}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => openModal(cert)} className="text-xs text-[#d8a928] hover:underline">Edit</button>
            <button onClick={() => deleteCert(cert.id)} className="text-xs text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
