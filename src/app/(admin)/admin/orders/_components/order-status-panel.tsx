type OrderStatusForm = {
  orderStatus: string;
  paymentStatus: string;
  trackingNumber: string;
  trackingUrl: string;
  notes: string;
};

export function OrderStatusPanel({
  form, setForm, saving, save, paymentMethod, paymentProofUrl, transactionReference,
}: {
  form: OrderStatusForm;
  setForm: React.Dispatch<React.SetStateAction<OrderStatusForm>>;
  saving: boolean;
  save: () => Promise<void>;
  paymentMethod: string;
  paymentProofUrl?: string | null;
  transactionReference?: string | null;
}) {
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <h2 className="text-sm font-semibold text-[#0a0a0a]">Status</h2>
      <div className="mt-4 grid gap-4">
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm"><span className="text-gray-500">Payment method:</span> <strong className="capitalize text-gray-900">{paymentMethod.replaceAll("_", " ")}</strong></div>
        <Select label="Order status" value={form.orderStatus} onChange={(value) => setForm((f) => ({ ...f, orderStatus: value }))} options={["pending", "confirmed", "processing", "shipped", "completed", "cancelled"]} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{[["Confirm", "confirmed"], ["Process", "processing"], ["Ship", "shipped"], ["Complete", "completed"], ["Cancel", "cancelled"]].map(([label, status]) => <button key={status} type="button" onClick={() => setForm((form) => ({ ...form, orderStatus: status }))} className="rounded-lg border border-gray-300 px-2 py-2 text-xs font-semibold hover:bg-amber-50">{label}</button>)}</div>
        <Select label="Payment verification" value={form.paymentStatus} onChange={(value) => setForm((f) => ({ ...f, paymentStatus: value }))} options={["pending", "verified", "failed", "refunded"]} />
        <Input label="Tracking #" value={form.trackingNumber} onChange={(value) => setForm((f) => ({ ...f, trackingNumber: value }))} />
        <Input label="Tracking URL" value={form.trackingUrl} onChange={(value) => setForm((f) => ({ ...f, trackingUrl: value }))} />
        {paymentProofUrl ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm"><p className="font-semibold text-[#0a0a0a]">Transaction screenshot</p>{transactionReference ? <p className="mt-1 text-xs text-[#5A5E55]">Reference: {transactionReference}</p> : null}<a href={paymentProofUrl} target="_blank" rel="noreferrer"><img src={paymentProofUrl} alt="Customer transaction screenshot" className="mt-3 max-h-72 w-full rounded-lg object-contain" /></a></div> : null}
        <label className="block text-sm font-medium text-[#0a0a0a]">Notes<textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        <button onClick={save} disabled={saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]">{options.map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select></label>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>;
}
