"use client";

import { FiPlus } from "react-icons/fi";
import { HeroSlideForm } from "./_components/hero-slide-form";
import { HeroSlideTable } from "./_components/hero-slide-table";
import { useHeroSlides } from "./_components/use-hero-slides";

export default function HeroAdminPage() {
  const state = useHeroSlides();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-xl font-bold text-[#0a0a0a] md:text-2xl">Hero Slides</h1><p className="mt-1 text-sm text-[#5A5E55]">Manage homepage carousel slides</p></div>
        <button onClick={() => state.setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f]"><FiPlus className="h-4 w-4" />Add Slide</button>
      </div>
      {state.error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.showForm && <HeroSlideForm editingSlide={state.editingSlide} formValues={state.formValues} setFormValues={state.setFormValues} saving={state.saving} saveSlide={state.saveSlide} resetForm={state.resetForm} fetchSlides={state.fetchSlides} />}
      {state.loading ? <p className="text-sm text-gray-500">Loading...</p> : state.slides.length === 0 ? <p className="text-sm text-gray-500">No slides found. Add your first slide!</p> : <HeroSlideTable slides={state.slides} moveSlide={state.moveSlide} toggleActive={state.toggleActive} editSlide={state.editSlide} deleteSlide={state.deleteSlide} />}
    </div>
  );
}
