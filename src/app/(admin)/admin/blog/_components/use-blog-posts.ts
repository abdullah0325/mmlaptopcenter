"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "./types";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.blogs) setPosts(data.blogs);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) setPosts((items) => items.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  return { posts, loading, deletePost };
}
