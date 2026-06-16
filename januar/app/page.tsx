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
