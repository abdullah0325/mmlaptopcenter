"use client";

import { useEffect, useState } from "react";
import type { Certificate, CertificateFormData } from "./types";

const emptyForm: CertificateFormData = { name: "", image: "", description: "", order: 0, isActive: true, isVerifiedBy: false };

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>(emptyForm);

  useEffect(() => { void fetchCertificates(); }, []);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.certificates) setCertificates(data.certificates);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCert(id: string) {
    if (!confirm("Delete this certificate?")) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      if (res.ok) setCertificates((items) => items.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  function openModal(cert?: Certificate) {
    setEditingCert(cert ?? null);
    setFormData(cert ? {
      name: cert.name, image: cert.image, description: cert.description || "",
      order: cert.order, isActive: cert.isActive, isVerifiedBy: cert.isVerifiedBy || false,
    } : { ...emptyForm, order: certificates.length });
    setShowModal(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(editingCert ? `/api/admin/certificates/${editingCert.id}` : "/api/admin/certificates", {
        method: editingCert ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        void fetchCertificates();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  }

  return { certificates, loading, showModal, setShowModal, editingCert, formData, setFormData, openModal, onSubmit, deleteCert };
}
