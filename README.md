# Next.js CRUD Dasar — Modul 1

Panduan lengkap membuat proyek dari awal hingga siap dijalankan.

---

## Prasyarat

- Node.js 18+
- MySQL server berjalan di lokal
- npm atau npx tersedia

---

## Langkah 1 — Buat Proyek Next.js

```bash
npx create-next-app@latest januar --typescript --no-tailwind --no-eslint --no-src-dir --app --no-import-alias
cd januar
```

---

## Langkah 2 — Install Dependensi

```bash
npm install prisma @prisma/client mysql2
```

---

## Langkah 3 — Inisialisasi Prisma

```bash
npx prisma init --datasource-provider mysql
```

Perintah ini membuat:
- `prisma/schema.prisma` — definisi model database
- `.env` — konfigurasi koneksi database

---

## Langkah 4 — Konfigurasi Database

Edit file `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/stfq_students"
```

Sesuaikan `root`, `password`, dan nama database dengan konfigurasi MySQL kamu.

---

## Langkah 5 — Definisi Model

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Student {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  class     String   @db.VarChar(10)
  createdAt DateTime @default(now())
}
```

---

## Langkah 6 — Buat Tabel di Database

```bash
npx prisma migrate dev --name init
```

Perintah ini:
1. Membuat database jika belum ada
2. Menjalankan migrasi SQL
3. Menggenerate Prisma Client di `app/generated/prisma`

---

## Langkah 7 — Jalankan Dev Server

```bash
npm run dev
```

Buka browser: [http://localhost:3000](http://localhost:3000)

---

## Struktur Proyek

```
januar/
├── app/
│   ├── layout.tsx                  ← Root layout
│   ├── globals.css                 ← CSS manual
│   ├── page.tsx                    ← Halaman beranda
│   ├── students/
│   │   ├── page.tsx                ← Daftar + tambah siswa
│   │   └── [id]/edit/page.tsx      ← Edit siswa
│   └── api/students/
│       ├── route.ts                ← GET, POST
│       └── [id]/route.ts           ← GET, PUT, DELETE
├── lib/
│   ├── prisma.ts                   ← Prisma client (ORM)
│   └── db.ts                       ← mysql2 pool (raw SQL)
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

---

## Endpoint API

| Method | URL                  | Fungsi           |
| ------ | -------------------- | ---------------- |
| GET    | `/api/students`      | Ambil semua data |
| POST   | `/api/students`      | Tambah siswa     |
| GET    | `/api/students/:id`  | Ambil satu data  |
| PUT    | `/api/students/:id`  | Update siswa     |
| DELETE | `/api/students/:id`  | Hapus siswa      |

---

## Dua Cara Query Database

Proyek ini sengaja menampilkan dua pendekatan agar siswa bisa membandingkan:

| Operasi | Pendekatan    | File                        |
| ------- | ------------- | --------------------------- |
| GET     | Prisma ORM    | `api/students/route.ts`     |
| POST    | Raw SQL       | `api/students/route.ts`     |
| PUT     | Prisma ORM    | `api/students/[id]/route.ts`|
| DELETE  | Raw SQL       | `api/students/[id]/route.ts`|

### Prisma ORM (contoh)

```ts
const students = await prisma.student.findMany();
```

### Raw SQL (contoh)

```ts
await pool.execute("DELETE FROM Student WHERE id = ?", [id]);
```

---

## Halaman

| URL                    | Keterangan              |
| ---------------------- | ----------------------- |
| `/`                    | Beranda                 |
| `/students`            | Daftar siswa + form tambah |
| `/students/:id/edit`   | Form edit siswa         |

---

## Perintah Berguna

```bash
npm run dev                          # Jalankan dev server
npx prisma migrate dev --name init   # Buat/update tabel
npx prisma studio                    # GUI untuk melihat isi database
npx prisma generate                  # Generate ulang Prisma Client
```
