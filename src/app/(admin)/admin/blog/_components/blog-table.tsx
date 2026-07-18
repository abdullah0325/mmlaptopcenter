import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { BlogPost } from "./types";

export function BlogTable({ posts, onDelete }: { posts: BlogPost[]; onDelete: (id: string) => void }) {
  return (
    <div className="-mx-4 overflow-hidden rounded-lg bg-white shadow md:mx-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50">
            <tr>{["Title", "Handle", "Status", "Date", "Actions"].map((label) => <th key={label} className="px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 md:px-4 md:py-3">{label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => <BlogRow key={post.id} post={post} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogRow({ post, onDelete }: { post: BlogPost; onDelete: (id: string) => void }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2 text-sm font-medium md:px-4 md:py-3">{post.title}</td>
      <td className="px-2 py-2 text-xs text-gray-500 md:px-4 md:py-3">{post.slug}</td>
      <td className="px-2 py-2 md:px-4 md:py-3"><span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{post.status}</span></td>
      <td className="px-2 py-2 text-xs text-gray-500 md:px-4 md:py-3">{new Date(post.createdAt).toLocaleDateString()}</td>
      <td className="px-2 py-2 text-right md:px-4 md:py-3">
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/blog/${post.id}/edit`} className="p-1 text-gray-400 hover:text-[#d8a928]"><FiEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Link>
          <button onClick={() => onDelete(post.id)} className="p-1 text-gray-400 hover:text-red-500"><FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
        </div>
      </td>
    </tr>
  );
}
