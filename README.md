# Next.js CRUD Dasar — Modul 1

Panduan lengkap membuat proyek dari awal hingga siap dijalankan.

> **Catatan:** Panduan ini menggunakan **Prisma 7** yang memiliki perubahan signifikan dibanding versi sebelumnya. Lihat bagian perbedaan di bawah.

---

## Prasyarat

- Node.js 18+
- Docker (untuk menjalankan MySQL via container) atau MySQL server lokal
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
npm install prisma @prisma/client @prisma/adapter-mariadb
```

> Prisma 7 memerlukan driver adapter. Untuk MySQL/MariaDB gunakan `@prisma/adapter-mariadb`.

---

## Langkah 3 — Jalankan MySQL via Docker

Buat file `docker-compose.yml` di root proyek:

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

Jalankan container:

```bash
docker compose up -d
```

---

## Langkah 4 — Inisialisasi Prisma

```bash
npx prisma init --datasource-provider mysql
```

---

## Langkah 5 — Konfigurasi Database

Edit file `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/stfq_students"
```

Edit file `prisma.config.ts` (dibuat otomatis oleh Prisma 7):

```ts
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

---

## Langkah 6 — Definisi Model

Edit `prisma/schema.prisma`:

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

> **Perubahan Prisma 7:** `url` tidak lagi ditulis di `schema.prisma`. Koneksi database dikonfigurasi di `prisma.config.ts`.

---

## Langkah 7 — Buat Tabel di Database

```bash
npx prisma migrate dev --name init
```

---

## Langkah 8 — Konfigurasi Prisma Client

Edit `lib/prisma.ts`:

```ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> **Perubahan Prisma 7:** `PrismaClient` harus menerima `adapter` — tidak bisa diinstansiasi tanpa argumen.

---

## Langkah 9 — Jalankan Dev Server

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
│   ├── generated/prisma/           ← Prisma Client (di-generate)
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
├── prisma.config.ts                ← Konfigurasi datasource (Prisma 7)
├── docker-compose.yml
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

| URL                    | Keterangan                 |
| ---------------------- | -------------------------- |
| `/`                    | Beranda                    |
| `/students`            | Daftar siswa + form tambah |
| `/students/:id/edit`   | Form edit siswa            |

---

## Perintah Berguna

```bash
npm run dev                          # Jalankan dev server
npx prisma migrate dev --name init   # Buat/update tabel
npx prisma generate                  # Generate ulang Prisma Client
npx prisma studio                    # GUI untuk melihat isi database
docker compose up -d                 # Jalankan MySQL container
docker compose down                  # Hentikan MySQL container
```
