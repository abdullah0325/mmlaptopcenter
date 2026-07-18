"use client";

import { EssenceCardsEditor } from "./_components/essence-cards-editor";
import { EssenceHeaderFields } from "./_components/essence-header-fields";
import { useEssenceSection } from "./_components/use-essence-section";

export default function HomepageSectionPage() {
  const state = useEssenceSection();
  if (state.loading) return <div className="p-8 text-sm text-[#5A5E55]">Loading...</div>;

  return (
    <div className="max-w-4xl p-8">
      <h1 className="mb-2 text-2xl font-bold text-[#0a0a0a]">Homepage Section Management</h1>
      <p className="mb-6 text-sm text-[#5A5E55]">Manage the &quot;Experience the Essence&quot; section content.</p>
      {state.saved && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Saved successfully!</div>}
      <form onSubmit={state.onSubmit} className="space-y-6">
        <EssenceHeaderFields title={state.title} subtitle={state.subtitle} setTitle={state.setTitle} setSubtitle={state.setSubtitle} />
        <EssenceCardsEditor cards={state.essenceCards} setCards={state.setEssenceCards} />
        <div className="flex justify-end"><button type="submit" disabled={state.saving} className="rounded-lg bg-[#f6a45d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d8861f] disabled:opacity-50">{state.saving ? "Saving..." : "Save"}</button></div>
      </form>
    </div>
  );
}
