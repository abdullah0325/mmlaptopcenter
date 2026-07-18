import { FiLock, FiSave } from "react-icons/fi";

export function Message({ message }: { message: string }) {
  if (!message) return null;
  const isError = message.includes("Failed") || message.includes("don't");
  return <div className={`mb-4 rounded-lg p-3 text-sm ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{message}</div>;
}

export function AccountPanel({ name, setName, email, saving, onSave }: {
  name: string; setName: (value: string) => void; email: string; saving: boolean; onSave: () => Promise<void>;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Account Information</h2>
      <div className="space-y-4">
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Email" type="email" value={email} disabled />
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50"><FiSave className="h-4 w-4" />{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  );
}

export function PasswordPanel(props: {
  currentPassword: string; setCurrentPassword: (value: string) => void;
  newPassword: string; setNewPassword: (value: string) => void;
  confirmPassword: string; setConfirmPassword: (value: string) => void;
  saving: boolean; onChangePassword: () => Promise<void>;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><FiLock className="h-5 w-5" />Change Password</h2>
      <div className="space-y-4">
        <Input label="Current Password" type="password" value={props.currentPassword} onChange={props.setCurrentPassword} />
        <Input label="New Password" type="password" value={props.newPassword} onChange={props.setNewPassword} />
        <Input label="Confirm New Password" type="password" value={props.confirmPassword} onChange={props.setConfirmPassword} />
        <button onClick={props.onChangePassword} disabled={props.saving || !props.currentPassword || !props.newPassword} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"><FiLock className="h-4 w-4" />{props.saving ? "Changing..." : "Change Password"}</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", disabled }: { label: string; value: string; onChange?: (value: string) => void; type?: string; disabled?: boolean }) {
  return <label className="block text-sm font-medium text-gray-700">{label}<input type={type} value={value} disabled={disabled} onChange={(e) => onChange?.(e.target.value)} className={`mt-1 w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928] ${disabled ? "border-gray-200 bg-gray-50 text-gray-500" : "border-gray-300"}`} /></label>;
}
