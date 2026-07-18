import { FiSave } from "react-icons/fi";
import type { Settings } from "./types";

export function SettingsForm({ settings, setSettings, saving, message, onSave }: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saving: boolean;
  message: string;
  onSave: () => Promise<void>;
}) {
  const set = (key: keyof Settings, value: string) => setSettings((s) => ({ ...s, [key]: value }));
  return (
    <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
      {message && <div className={`mb-4 rounded-lg p-3 text-sm ${message.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{message}</div>}
      <div className="space-y-4">
        <Input label="Company Name" value={settings.companyName} onChange={(value) => set("companyName", value)} />
        <Input label="Company Email" type="email" value={settings.companyEmail} onChange={(value) => set("companyEmail", value)} />
        <Input label="Company Phone" value={settings.companyPhone} onChange={(value) => set("companyPhone", value)} />
        <Input label="WhatsApp Number" value={settings.whatsappNumber} onChange={(value) => set("whatsappNumber", value)} />
        <Input label="Sales Email" type="email" value={settings.salesEmail} onChange={(value) => set("salesEmail", value)} />
        <label className="block text-sm font-medium text-gray-700">Office Address<textarea value={settings.officeAddress} onChange={(e) => set("officeAddress", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50"><FiSave className="h-4 w-4" />{saving ? "Saving..." : "Save Settings"}</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-gray-700">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></label>;
}
