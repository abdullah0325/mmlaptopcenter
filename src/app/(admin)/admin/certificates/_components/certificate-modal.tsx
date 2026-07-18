import { AdminImageUpload } from "@/components/admin/image-upload";
import type { Certificate, CertificateFormData } from "./types";

export function CertificateModal({
  editingCert, formData, setFormData, onSubmit, onClose,
}: {
  editingCert: Certificate | null;
  formData: CertificateFormData;
  setFormData: React.Dispatch<React.SetStateAction<CertificateFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-[#0a0a0a]">{editingCert ? "Edit Certificate" : "Add Certificate"}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(value) => setFormData((f) => ({ ...f, name: value }))} required />
          <label className="block text-sm font-medium text-[#0a0a0a]">Image<AdminImageUpload label="" folder="mmlaptop/certificates" usedIn="certificate" value={formData.image} onChange={(url) => setFormData((f) => ({ ...f, image: url }))} /></label>
          <label className="block text-sm font-medium text-[#0a0a0a]">Description<textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#d8a928]" /></label>
          <Input label="Order" type="number" value={String(formData.order)} onChange={(value) => setFormData((f) => ({ ...f, order: parseInt(value) }))} />
          <Check label="Active" checked={formData.isActive} onChange={(value) => setFormData((f) => ({ ...f, isActive: value }))} />
          <Check label="Verified By (show in first card)" checked={formData.isVerifiedBy} onChange={(value) => setFormData((f) => ({ ...f, isVerifiedBy: value }))} />
          <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button><button type="submit" className="rounded-lg bg-[#f6a45d] px-4 py-2 text-sm text-white">Save</button></div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#d8a928]" /></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" /><span className="text-sm">{label}</span></label>;
}
