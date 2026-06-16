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
