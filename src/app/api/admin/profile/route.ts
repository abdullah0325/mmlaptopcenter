import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: admin.email },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!adminUser) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ admin: adminUser });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const body = await request.json();
    const adminUser = await prisma.adminUser.update({
      where: { email: admin.email },
      data: { name: body.name },
    });
    return NextResponse.json(adminUser);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}