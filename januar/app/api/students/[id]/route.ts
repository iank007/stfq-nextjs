// GET    /api/students/:id — ambil satu siswa
// PUT    /api/students/:id — update siswa (pakai Prisma ORM)
// DELETE /api/students/:id — hapus siswa (pakai raw SQL sebagai contoh)
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { pool } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id: Number(id) } });
  if (!student) return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
  return Response.json(student);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, class: cls } = body;

  if (!name || !cls) {
    return Response.json({ error: "Name dan class wajib diisi" }, { status: 400 });
  }

  const student = await prisma.student.update({
    where: { id: Number(id) },
    data: { name, class: cls },
  });
  return Response.json(student);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Contoh raw SQL query
  await pool.execute("DELETE FROM Student WHERE id = ?", [id]);
  return Response.json({ message: "Siswa dihapus" });
}
