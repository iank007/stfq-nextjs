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
