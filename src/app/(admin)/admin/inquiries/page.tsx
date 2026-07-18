"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    unread: "bg-blue-100 text-blue-700",
    read: "bg-yellow-100 text-yellow-700",
    replied: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a] mb-4 md:mb-6">Inquiries</h1>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-gray-500 text-sm">No inquiries yet</p>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg shadow p-3 md:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm md:text-base">{inquiry.name}</h3>
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${
                        statusColors[inquiry.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">{inquiry.email}</p>
                  <p className="mt-1 font-medium text-sm">{inquiry.subject}</p>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600 line-clamp-2">
                    {inquiry.message}
                  </p>
                  <p className="mt-1 md:mt-2 text-xs text-gray-400">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="flex items-center gap-1 text-xs md:text-sm text-[#d8a928] hover:underline shrink-0"
                >
                  <FiEye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

