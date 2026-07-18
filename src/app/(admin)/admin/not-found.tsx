import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#fcf5e8] p-8">
      <div className="mx-auto max-w-xl rounded-xl border border-[#d8a928]/30 bg-white p-6">
        <h1 className="text-xl font-semibold text-[#0a0a0a]">Not found</h1>
        <p className="mt-2 text-sm text-[#5A5E55]">
          This admin page doesn’t exist.
        </p>
        <div className="mt-4">
          <Link
            href="/admin/dashboard"
            className="text-sm font-semibold text-[#f6a45d] hover:underline"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

