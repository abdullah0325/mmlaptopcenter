import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return prisma.adminUser.findUnique({ where: { email: session.user.email } });
  } catch {
    return null;
  }
}

export async function getDashboardData() {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [productCount, collectionCount, orderCount, inquiryCount, lowStockProducts, recentOrders, recentInquiries, ordersLast7Days, ordersLast30Days] = await Promise.all([
    prisma.product.count(),
    prisma.collection.count(),
    prisma.order.count(),
    prisma.inquiry.count(),
    prisma.product.findMany({ where: { inventory: { lte: 5 } }, select: { id: true, title: true, inventory: true }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.groupBy({ by: ["createdAt"], where: { createdAt: { gte: sevenDaysAgo } }, _count: true }),
    prisma.order.aggregate({ where: { createdAt: { gte: thirtyDaysAgo } }, _sum: { total: true } }),
  ]);

  const stats = [
    { label: "Total Products", value: productCount, color: "#f6a45d" },
    { label: "Total Orders", value: orderCount, color: "#d8a928" },
    { label: "Total Inquiries", value: inquiryCount, color: "#5A5E55" },
    { label: "Collections", value: collectionCount, color: "#1E1F1C" },
  ];

  return { today, ordersLast7Days, ordersLast30Days, stats, lowStockProducts, recentOrders, recentInquiries };
}
