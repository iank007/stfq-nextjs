import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.student.count();
  return Response.json({ ok: true, studentCount: count });
}
