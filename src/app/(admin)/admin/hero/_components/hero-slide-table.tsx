import { FiArrowDown, FiArrowUp, FiEdit, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import { HeroSlide } from "@/types/hero";

export function HeroSlideTable({
  slides, moveSlide, toggleActive, editSlide, deleteSlide,
}: {
  slides: HeroSlide[];
  moveSlide: (id: string, direction: "up" | "down") => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  editSlide: (slide: HeroSlide) => void;
  deleteSlide: (id: string) => Promise<void>;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50"><tr>{["Image", "Content", "Status", "Actions"].map((label) => <th key={label} className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{slides.map((slide, index) => <HeroSlideRow key={slide.id} slide={slide} index={index} total={slides.length} moveSlide={moveSlide} toggleActive={toggleActive} editSlide={editSlide} deleteSlide={deleteSlide} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

function HeroSlideRow({ slide, index, total, moveSlide, toggleActive, editSlide, deleteSlide }: {
  slide: HeroSlide; index: number; total: number;
  moveSlide: (id: string, direction: "up" | "down") => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  editSlide: (slide: HeroSlide) => void; deleteSlide: (id: string) => Promise<void>;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {slide.imageUrl ? (
            <div>
              <img src={slide.imageUrl} alt={slide.imageAlt} className="h-16 w-24 rounded object-cover object-right" />
              <p className="mt-1 text-[10px] uppercase text-gray-400">Desktop</p>
            </div>
          ) : (
            <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">No Image</div>
          )}
          {slide.mobileImageUrl ? (
            <div>
              <img src={slide.mobileImageUrl} alt={slide.imageAlt} className="h-16 w-10 rounded object-cover object-right" />
              <p className="mt-1 text-[10px] uppercase text-gray-400">Mobile</p>
            </div>
          ) : null}
        </div>
      </td>
      <td className="px-4 py-3"><p className="font-medium text-[#0a0a0a]">{slide.title} {slide.titleHighlight}</p><p className="text-xs text-gray-500">{slide.eyebrow}</p><p className="mt-1 line-clamp-2 text-xs text-gray-600">{slide.description}</p></td>
      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${slide.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{slide.isActive ? "Active" : "Hidden"}</span></td>
      <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><IconButton disabled={index === 0} title="Move up" onClick={() => moveSlide(slide.id, "up")}><FiArrowUp /></IconButton><IconButton disabled={index === total - 1} title="Move down" onClick={() => moveSlide(slide.id, "down")}><FiArrowDown /></IconButton><IconButton title={slide.isActive ? "Hide" : "Show"} onClick={() => toggleActive(slide.id, slide.isActive)}>{slide.isActive ? <FiEyeOff /> : <FiEye />}</IconButton><IconButton title="Edit" onClick={() => editSlide(slide)}><FiEdit /></IconButton><IconButton title="Delete" onClick={() => deleteSlide(slide.id)} danger><FiTrash2 /></IconButton></div></td>
    </tr>
  );
}

function IconButton({ children, onClick, title, disabled, danger }: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean; danger?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className={`p-1 text-gray-400 disabled:opacity-30 ${danger ? "hover:text-red-500" : "hover:text-[#d8a928]"}`} title={title}>{children}</button>;
}
