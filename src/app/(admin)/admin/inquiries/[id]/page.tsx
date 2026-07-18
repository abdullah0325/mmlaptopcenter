"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { InquiryDetailCard } from "../_components/inquiry-detail-card";
import { InquiryManageCard } from "../_components/inquiry-manage-card";
import { useInquiryDetail } from "../_components/use-inquiry-detail";

export default function InquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const state = useInquiryDetail(params?.id);

  if (state.loading) return <div className="p-8 text-sm text-[#5A5E55]">Loading...</div>;
  if (state.error) return <ErrorView error={state.error} />;
  if (!state.inquiry) return null;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[#0a0a0a]">Inquiry</h1><p className="mt-1 text-sm text-[#5A5E55]">Received {new Date(state.inquiry.createdAt).toLocaleString()}</p></div>
        <Link href="/admin/inquiries" className="rounded-lg border border-[#d8a928]/25 bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]">Back</Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2"><InquiryDetailCard inquiry={state.inquiry} /></div>
        <div className="space-y-6"><InquiryManageCard inquiry={state.inquiry} status={state.status} setStatus={state.setStatus} adminNote={state.adminNote} setAdminNote={state.setAdminNote} saving={state.saving} save={state.save} /></div>
      </div>
    </div>
  );
}

function ErrorView({ error }: { error: string }) {
  return <div className="p-8"><div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div><Link href="/admin/inquiries" className="text-sm font-semibold text-[#f6a45d] hover:underline">Back to inquiries</Link></div>;
}
