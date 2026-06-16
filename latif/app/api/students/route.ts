import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { pool } from "../../../lib/db";

export async function GET() {
  const students = await prisma.student.findMany({ orderBy: { id: "asc" } });
  return Response.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, class: cls } = body;

  if (!name || !cls) {
    return Response.json(
      { error: "Name dan class wajib diisi" },
      { status: 400 },
    );
  }

  const [result]: any = await pool.execute(
    "INSERT INTO Student (name, class, createdAt) VALUES (?, ?, NOW())",
    [name, cls],
  );

  const student = await prisma.student.findUnique({
    where: { id: result.insertId },
  });
  return Response.json(student, { status: 201 });
}
