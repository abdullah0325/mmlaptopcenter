import { AdminImageUpload } from "@/components/admin/image-upload";
import type { EssenceCard } from "./types";

export function EssenceCardsEditor({ cards, setCards }: {
  cards: EssenceCard[];
  setCards: React.Dispatch<React.SetStateAction<EssenceCard[]>>;
}) {
  return (
    <div className="rounded-xl border border-[#d8a928]/20 bg-white p-6">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-[#0a0a0a]">Cards</h2><button type="button" onClick={() => setCards([...cards, { title: "", description: "", image: "" }])} className="text-sm text-[#f6a45d] hover:underline">+ Add Card</button></div>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card, index) => <EssenceCardEditor key={index} card={card} index={index} cards={cards} setCards={setCards} />)}
      </div>
    </div>
  );
}

function EssenceCardEditor({ card, index, cards, setCards }: { card: EssenceCard; index: number; cards: EssenceCard[]; setCards: React.Dispatch<React.SetStateAction<EssenceCard[]>> }) {
  const update = (field: keyof EssenceCard, value: string) => {
    const next = [...cards];
    next[index][field] = value;
    setCards(next);
  };
  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-[#0a0a0a]">Card {index + 1}</h3>{cards.length > 1 && <button type="button" onClick={() => setCards(cards.filter((_, i) => i !== index))} className="text-xs text-red-600 hover:underline">Remove</button>}</div>
      <Field label="Title" value={card.title} onChange={(value) => update("title", value)} placeholder="Nourish Your Body" />
      <label className="block text-sm font-medium text-[#0a0a0a]">Description<textarea value={card.description} onChange={(e) => update("description", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" placeholder="Description..." /></label>
      <label className="block text-sm font-medium text-[#0a0a0a]">Image<AdminImageUpload label="" folder="mmlaptop/essence" usedIn="essence" value={card.image} onChange={(url) => update("image", url)} /></label>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" placeholder={placeholder} /></label>;
}
