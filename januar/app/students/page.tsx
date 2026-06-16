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
