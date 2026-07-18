import { redirect } from "next/navigation";
import { DashboardHeader } from "./_components/dashboard-header";
import { LowStockAlerts } from "./_components/low-stock-alerts";
import { RecentInquiriesWidget } from "./_components/recent-inquiries-widget";
import { RecentOrdersWidget } from "./_components/recent-orders-widget";
import { StatsCards } from "./_components/stats-cards";
import { getAdminUser, getDashboardData } from "./service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#fcf5e8] px-3 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />
        <StatsCards stats={data.stats} />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
          <RecentOrdersWidget orders={data.recentOrders} />
          <RecentInquiriesWidget inquiries={data.recentInquiries} />
        </div>
        <LowStockAlerts products={data.lowStockProducts} />
      </div>
    </main>
  );
}
