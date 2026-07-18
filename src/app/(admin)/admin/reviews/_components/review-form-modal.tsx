import type { Review, ReviewFormData } from "./types";

export function ReviewFormModal({ editingReview, formData, setFormData, onSubmit, onClose }: {
  editingReview: Review | null;
  formData: ReviewFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReviewFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-[#0a0a0a]">{editingReview ? "Edit Review" : "Add Manual Review"}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4">
            <Input label="Author Name *" value={formData.authorName} onChange={(value) => setFormData((f) => ({ ...f, authorName: value }))} required />
            <Input label="Author Email" type="email" value={formData.authorEmail} onChange={(value) => setFormData((f) => ({ ...f, authorEmail: value }))} />
            <Input label="Rating (1-5) *" type="number" value={String(formData.rating)} onChange={(value) => setFormData((f) => ({ ...f, rating: parseInt(value) }))} required />
            <TextArea label="Content *" value={formData.content} onChange={(value) => setFormData((f) => ({ ...f, content: value }))} rows={4} required />
            <Input label="Product Handle" value={formData.productHandle} onChange={(value) => setFormData((f) => ({ ...f, productHandle: value }))} placeholder="e.g., gaming gear-resin" />
            <div className="flex flex-wrap gap-4"><Check label="Featured (show on homepage)" checked={formData.isFeatured} onChange={(value) => setFormData((f) => ({ ...f, isFeatured: value }))} /><Check label="Verified Purchase" checked={formData.isVerifiedPurchase} onChange={(value) => setFormData((f) => ({ ...f, isVerifiedPurchase: value }))} /></div>
            <label className="block text-sm font-medium text-[#0a0a0a]">Status<select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as Review["status"] }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#d8a928]"><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
            <TextArea label="Admin Note" value={formData.adminNote} onChange={(value) => setFormData((f) => ({ ...f, adminNote: value }))} rows={2} placeholder="Internal note for admin reference..." />
          </div>
          <div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button><button type="submit" className="rounded-lg bg-[#f6a45d] px-4 py-2 text-sm text-white hover:bg-[#d8861f]">Save Review</button></div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input type={type} min={type === "number" ? "1" : undefined} max={type === "number" ? "5" : undefined} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#d8a928]" /></label>;
}

function TextArea({ label, value, onChange, rows, required, placeholder }: { label: string; value: string; onChange: (value: string) => void; rows: number; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} required={required} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#d8a928]" /></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" /><span className="text-sm">{label}</span></label>;
}
