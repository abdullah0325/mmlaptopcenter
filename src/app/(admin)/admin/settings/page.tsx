"use client";

import { SettingsForm } from "./_components/settings-form";
import { useSettings } from "./_components/use-settings";

export default function SettingsPage() {
  const state = useSettings();
  if (state.loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-[#0a0a0a]">Settings</h1>
      <SettingsForm settings={state.settings} setSettings={state.setSettings} saving={state.saving} message={state.message} onSave={state.handleSave} />
    </div>
  );
}
