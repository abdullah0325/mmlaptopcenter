"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { BlogTable } from "./_components/blog-table";
import { useBlogPosts } from "./_components/use-blog-posts";

export default function BlogPage() {
  const { posts, loading, deletePost } = useBlogPosts();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">Blog Posts</h1>
        <Link
          href="/admin/blog/add"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#d8a928] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#b8923f]"
        >
          <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add Post</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No blog posts yet</p>
      ) : (
        <BlogTable posts={posts} onDelete={deletePost} />
      )}
    </div>
  );
}

