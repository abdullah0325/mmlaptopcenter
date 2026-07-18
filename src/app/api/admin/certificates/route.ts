import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const certificateSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  description: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  isVerifiedBy: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const certificates = await prisma.certificate.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ certificates });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = certificateSchema.parse(body);
    const certificate = await prisma.certificate.create({ data: validated });
    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}