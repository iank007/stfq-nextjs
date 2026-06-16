# januar — Next.js CRUD App (Modul 1)

Aplikasi CRUD sederhana untuk pembelajaran Next.js App Router.

## Setup

1. Copy `.env` dan sesuaikan `DATABASE_URL`
2. Jalankan `npx prisma migrate dev --name init` untuk membuat tabel
3. Jalankan `npm run dev`

## Struktur

```
app/
  page.tsx                  → Beranda
  students/
    page.tsx                → Daftar + Tambah siswa (Client Component)
    [id]/edit/page.tsx      → Edit siswa
  api/students/
    route.ts                → GET, POST  (GET pakai Prisma, POST pakai raw SQL)
    [id]/route.ts           → GET, PUT, DELETE (PUT pakai Prisma, DELETE pakai raw SQL)
lib/
  prisma.ts                 → Prisma client singleton (ORM)
  db.ts                     → mysql2 pool (raw SQL)
prisma/
  schema.prisma             → Model Student
```

## Commands

```bash
npm run dev                          # dev server
npx prisma migrate dev --name init   # buat/update tabel
npx prisma studio                    # GUI database
```
