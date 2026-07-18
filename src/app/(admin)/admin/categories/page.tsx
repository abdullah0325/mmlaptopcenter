"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#d8a928] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#b8923f]"
        >
          <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-3 md:p-4">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-20 md:h-32 object-cover rounded mb-2 md:mb-3"
                />
              )}
              <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
              <p className="text-xs md:text-sm text-gray-500">{category.slug}</p>
              <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-3">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs md:text-sm hover:bg-gray-200"
                >
                  <FiEdit className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">Edit</span>
                </Link>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="flex-1 flex items-center justify-center gap-1 rounded bg-red-50 px-2 py-1 text-xs md:text-sm text-red-600 hover:bg-red-100"
                >
                  <FiTrash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

