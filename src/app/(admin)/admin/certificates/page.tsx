"use client";

import { CertificateModal } from "./_components/certificate-modal";
import { CertificatesGrid } from "./_components/certificates-grid";
import { useCertificates } from "./_components/use-certificates";

export default function CertificatesPage() {
  const state = useCertificates();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h1 className="text-xl font-bold text-[#0a0a0a] md:text-2xl">Certificates</h1>
        <button onClick={() => state.openModal()} className="flex items-center gap-1.5 rounded-lg bg-[#d8a928] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8923f] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">Add Certificate</button>
      </div>
      {state.loading ? <div className="text-sm text-[#5A5E55]">Loading...</div> : <CertificatesGrid certificates={state.certificates} openModal={state.openModal} deleteCert={state.deleteCert} />}
      {state.showModal && <CertificateModal editingCert={state.editingCert} formData={state.formData} setFormData={state.setFormData} onSubmit={state.onSubmit} onClose={() => state.setShowModal(false)} />}
    </div>
  );
}
