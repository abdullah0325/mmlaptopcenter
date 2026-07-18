import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { Collection } from "./types";

export function CollectionGrid({ collections, onDelete }: { collections: Collection[]; onDelete: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {collections.map((collection) => <CollectionCard key={collection.id} collection={collection} onDelete={onDelete} />)}
    </div>
  );
}

function CollectionCard({ collection, onDelete }: { collection: Collection; onDelete: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {collection.image ? (
        <img src={collection.image} alt={collection.title} className="h-28 w-full object-cover md:h-40" />
      ) : (
        <div className="flex h-28 w-full items-center justify-center bg-gray-200 md:h-40"><span className="text-xs text-gray-400">No image</span></div>
      )}
      <div className="p-3 md:p-4">
        <h3 className="text-sm font-semibold md:text-base">{collection.title}</h3>
        <p className="text-xs text-gray-500 md:text-sm">{collection.handle}</p>
        {collection.description && <p className="mt-1 line-clamp-2 text-xs text-gray-600 md:mt-2 md:text-sm">{collection.description}</p>}
        <div className="mt-2 flex gap-1.5 md:mt-3 md:gap-2">
          <Link href={`/admin/collections/${collection.id}/edit`} className="flex flex-1 items-center justify-center gap-1 rounded bg-gray-100 py-1 text-xs hover:bg-gray-200 md:text-sm">
            <FiEdit className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">Edit</span>
          </Link>
          <button onClick={() => onDelete(collection.id)} className="flex flex-1 items-center justify-center gap-1 rounded bg-red-50 py-1 text-xs text-red-600 hover:bg-red-100 md:text-sm">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
