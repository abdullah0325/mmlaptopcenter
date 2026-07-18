import { getServerSession } from "next-auth";
import AdminProviders from "@/components/admin/admin-providers";
import { authOptions } from "@/lib/auth";
import { ResponsiveAdminLayout } from "@/components/layout/responsive-admin-layout";
import { prisma } from "@/lib/prisma";

async function getAdminUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return prisma.adminUser.findUnique({ where: { email: session.user.email } });
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let admin = null;
  try {
    admin = await getAdminUser();
  } catch {
    admin = null;
  }

  if (!admin) {
    return <AdminProviders>{children}</AdminProviders>;
  }

  return (
    <AdminProviders>
      <ResponsiveAdminLayout admin={admin}>
        {children}
      </ResponsiveAdminLayout>
    </AdminProviders>
  );
}

