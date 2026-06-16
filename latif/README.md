This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

steps :

## Langkah 1 — Buat Proyek Next.js

1.npx create-next-app@latest . --typescript --no-tailwind --no-eslint --no-src-dir --app --no-import-alias

    note:pakai titik karena supaya gak bikin folder baru

## Langkah 2 — Install Dependensi

```bash
npm install prisma @prisma/client @prisma/adapter-mariadb
```

> Prisma 7 memerlukan driver adapter. Untuk MySQL/MariaDB gunakan `@prisma/adapter-mariadb`.

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
