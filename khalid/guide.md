# Guide: Rebuild Aplikasi Data Siswa (Next.js CRUD)

Panduan membangun ulang aplikasi CRUD sederhana dengan Next.js App Router, Prisma ORM, dan MySQL.

---

## 1. Init Project

```bash
npx create-next-app@latest . --typescript --no-tailwind --no-eslint --src-dir=false --app --import-alias="@/*"
```

**Coba:**
```bash
npm run dev
```
Buka `http://localhost:3000` → halaman default Next.js muncul (dengan logo dan link).

---

## 2. Install Dependencies

```bash
npm install prisma @prisma/client @prisma/adapter-mariadb mysql2
```

**Coba:**
```bash
npx prisma --version
```
Harus muncul versi Prisma, contoh: `prisma: 7.x.x`.

---

## 3. Setup Database (Docker)

Buat `docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: stfq_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: stfq_students
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
docker compose up -d
```

**Coba:**
```bash
docker ps
```
Harus ada container `stfq_mysql` dengan status `Up`. Atau test koneksi langsung:
```bash
docker exec -it stfq_mysql mysql -uroot -ppassword -e "SHOW DATABASES;"
```
Database `stfq_students` harus muncul di list.

---

## 4. Environment

Buat `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/stfq_students"
```

---

## 5. Prisma Setup

### `prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../app/generated/prisma"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "mysql"
}

model Student {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  class     String   @db.VarChar(10)
  createdAt DateTime @default(now())
}
```

### `prisma.config.ts` (root)

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

Generate client dan buat tabel:

```bash
npx prisma migrate dev --name init
```

**Coba:**
```bash
npx prisma studio
```
Buka `http://localhost:5555` → tabel `Student` muncul di sidebar (masih kosong). Atau verifikasi lewat MySQL:
```bash
docker exec -it stfq_mysql mysql -uroot -ppassword stfq_students -e "SHOW TABLES;"
```
Harus muncul tabel `Student` dan `_prisma_migrations`.

---

## 6. Lib Files

### `lib/prisma.ts` — Prisma singleton

```typescript
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### `lib/db.ts` — Raw SQL pool (mysql2)

```typescript
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
```

**Coba:**

Buat file sementara `app/api/test/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.student.count();
  return Response.json({ ok: true, studentCount: count });
}
```

```bash
curl http://localhost:3000/api/test
```

Respons yang benar:
```json
{ "ok": true, "studentCount": 0 }
```

Kalau error, cek pesan di terminal dev server — biasanya `DATABASE_URL` salah atau Docker belum jalan. Setelah berhasil, hapus file `app/api/test/route.ts`.

---

## 7. API Routes

### `app/api/students/route.ts`

```typescript
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { pool } from "@/lib/db";

export async function GET() {
  const students = await prisma.student.findMany({ orderBy: { id: "asc" } });
  return Response.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, class: cls } = body;

  if (!name || !cls) {
    return Response.json({ error: "Name dan class wajib diisi" }, { status: 400 });
  }

  const [result]: any = await pool.execute(
    "INSERT INTO Student (name, class, createdAt) VALUES (?, ?, NOW())",
    [name, cls]
  );

  const student = await prisma.student.findUnique({ where: { id: result.insertId } });
  return Response.json(student, { status: 201 });
}
```

### `app/api/students/[id]/route.ts`

```typescript
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
  await pool.execute("DELETE FROM Student WHERE id = ?", [id]);
  return Response.json({ message: "Siswa dihapus" });
}
```

**Coba:**

Jalankan dev server dulu:
```bash
npm run dev
```

Test API dengan curl:
```bash
# GET semua siswa (harusnya array kosong [])
curl http://localhost:3000/api/students

# POST tambah siswa baru
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmad","class":"A"}'

# GET lagi — sekarang harus ada 1 data
curl http://localhost:3000/api/students

# GET by ID
curl http://localhost:3000/api/students/1

# PUT update
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmad Updated","class":"B"}'

# DELETE
curl -X DELETE http://localhost:3000/api/students/1
```

---

## 8. Pages

### `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Siswa",
  description: "Aplikasi CRUD sederhana - Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
```

### `app/page.tsx`

```typescript
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Aplikasi Data Siswa</h1>
      <p>Aplikasi CRUD sederhana menggunakan Next.js App Router.</p>
      <br />
      <Link href="/students">Lihat Data Siswa →</Link>
    </div>
  );
}
```

**Coba:** Buka `http://localhost:3000` → judul dan link "Lihat Data Siswa →" muncul (belum ada styling, tampilan plain).

### `app/students/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Student = {
  id: number;
  name: string;
  class: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [error, setError] = useState("");

  async function loadStudents() {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, class: cls }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    setName("");
    setCls("");
    loadStudents();
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    loadStudents();
  }

  return (
    <div>
      <div className="nav">
        <Link href="/">← Beranda</Link>
      </div>

      <h1>Data Siswa</h1>
      <br />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan={4}>Belum ada data siswa.</td>
            </tr>
          )}
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td className="actions">
                <Link href={`/students/${s.id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button className="danger" onClick={() => handleDelete(s.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <h2>Tambah Siswa</h2>
      <br />

      <form onSubmit={handleSubmit}>
        <label>Nama</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Ahmad"
        />
        <label>Kelas</label>
        <input
          type="text"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          placeholder="Contoh: A"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
```

**Coba:** Buka `http://localhost:3000/students` → tabel muncul dengan pesan "Belum ada data siswa.", form tambah di bawahnya. Coba isi form dan klik Simpan — data langsung muncul di tabel tanpa reload.

### `app/students/[id]/edit/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setCls(data.class);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, class: cls }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    router.push("/students");
  }

  if (loading) return <p>Memuat...</p>;

  return (
    <div>
      <div className="nav">
        <Link href="/students">← Kembali</Link>
      </div>

      <h1>Edit Siswa</h1>
      <br />

      <form onSubmit={handleSubmit}>
        <label>Nama</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Kelas</label>
        <input
          type="text"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
}
```

**Coba:** Dari halaman `/students`, klik tombol Edit pada salah satu siswa → form edit terbuka dengan data yang sudah terisi. Ubah nama/kelas, klik Simpan Perubahan → otomatis redirect kembali ke `/students` dengan data yang sudah terupdate.

---

## 9. Styling

### `app/globals.css`

Ganti seluruh isi `globals.css` bawaan Next.js dengan:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  font-size: 15px;
  color: #222;
  background: #f9f9f9;
  padding: 24px;
}

h1 { margin-bottom: 16px; }

a { color: #0070f3; text-decoration: none; }
a:hover { text-decoration: underline; }

table { border-collapse: collapse; width: 100%; background: #fff; }
th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
th { background: #f0f0f0; }

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
}

label { font-weight: bold; font-size: 13px; }
input { padding: 7px 10px; border: 1px solid #ccc; font-size: 14px; width: 100%; }
button { padding: 8px 16px; cursor: pointer; font-size: 14px; border: 1px solid #ccc; background: #fff; }
button[type="submit"] { background: #0070f3; color: #fff; border-color: #0070f3; }
button.danger { color: #c00; border-color: #c00; }

.error { color: #c00; font-size: 13px; }
.nav { margin-bottom: 20px; }
.actions { display: flex; gap: 8px; }
```

**Coba:** Refresh semua halaman — tampilan sekarang rapi dengan tabel berborders, form berkotak, tombol biru untuk submit, tombol merah untuk hapus.

---

## File Structure Summary

```
.
├── docker-compose.yml
├── .env
├── prisma/
│   └── schema.prisma
├── prisma.config.ts
├── lib/
│   ├── prisma.ts
│   └── db.ts
└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── globals.css
    ├── students/
    │   ├── page.tsx
    │   └── [id]/edit/page.tsx
    └── api/students/
        ├── route.ts
        └── [id]/route.ts
```
