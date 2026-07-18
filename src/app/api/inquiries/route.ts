import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  type: z.string().default("contact"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = inquirySchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: {
        ...input,
        status: "unread",
      },
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to submit message" },
      { status: 400 },
    );
  }
}

