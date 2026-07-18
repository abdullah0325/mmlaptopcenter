"use client";

import { useEffect, useState } from "react";
import type { Collection } from "./types";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchCollections();
  }, []);

  async function fetchCollections() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections");
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCollection(id: string) {
    if (!confirm("Delete this collection?")) return;
    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      if (res.ok) setCollections((items) => items.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  return { collections, loading, deleteCollection };
}
