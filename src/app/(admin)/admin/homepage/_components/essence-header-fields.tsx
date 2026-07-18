export function EssenceHeaderFields({ title, subtitle, setTitle, setSubtitle }: {
  title: string;
  subtitle: string;
  setTitle: (value: string) => void;
  setSubtitle: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#0a0a0a]">Section Header</h2>
      <div className="grid gap-4">
        <Field label="Title" value={title} onChange={setTitle} placeholder="Experience the Essence" />
        <Field label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Elevate Your Culinary & Wellness Rituals" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" placeholder={placeholder} /></label>;
}
