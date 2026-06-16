# Modul Pembelajaran 1 Hari

# Next.js CRUD Dasar (App Router)

## Informasi Kelas

**Durasi:** 1 Hari

**Waktu:** 09.00 - 15.00

**Istirahat:** 11.00 - 13.00

**Target Peserta:** Pemula yang sudah mengenal HTML, CSS, dan JavaScript Dasar.

**Target Akhir:**

Peserta mampu membuat aplikasi CRUD sederhana menggunakan Next.js App Router dan API Routes.

---

# Jadwal Pembelajaran

| Waktu         | Materi                      |
| ------------- | --------------------------- |
| 09.00 - 09.20 | Gambaran Besar Fullstack    |
| 09.20 - 09.50 | Mengenal Next.js App Router |
| 09.50 - 10.20 | API Route Dasar             |
| 10.20 - 11.00 | Menampilkan Data dari API   |
| 11.00 - 13.00 | Istirahat                   |
| 13.00 - 13.40 | Create Data                 |
| 13.40 - 14.10 | Update Data                 |
| 14.10 - 14.40 | Delete Data                 |
| 14.40 - 15.00 | Mini Assessment             |

---

# Sesi 1 — Gambaran Besar Fullstack

## Tujuan

Memahami hubungan antara Frontend, API, dan Database.

## Materi

Alur aplikasi web:

```text
Frontend
↓
API
↓
Database
```

Contoh proses tambah siswa:

```text
Form Tambah Siswa
↓
POST /api/students
↓
Database / JSON
↓
Data Tersimpan
```

## Latihan

Diskusikan:

* Apa yang terjadi saat tombol "Simpan" ditekan?
* Bagaimana data berpindah dari browser ke database?

## Quiz

1. Apa fungsi Frontend?
2. Apa fungsi API?
3. Apa fungsi Database?
4. Ketika pengguna mengisi form dan klik simpan, data dikirim ke mana terlebih dahulu?

---

# Sesi 2 — Mengenal Next.js App Router

## Tujuan

Memahami struktur folder Next.js App Router.

## Materi

Struktur project:

```text
app/
├── page.jsx
├── students/
│   └── page.jsx
└── api/
    └── students/
        └── route.js
```

Penjelasan:

```text
page.jsx  → Halaman Website

route.js → API Endpoint
```

Contoh URL:

```text
app/page.jsx
↓
localhost:3000

app/students/page.jsx
↓
localhost:3000/students
```

## Latihan

Buat halaman:

```text
app/students/page.jsx
```

Isi:

```jsx
export default function StudentsPage() {
  return <h1>Data Siswa</h1>;
}
```

## Quiz

1. Apa fungsi `page.jsx`?
2. Apa fungsi `route.js`?
3. URL apa yang dihasilkan dari `app/students/page.jsx`?

---

# Sesi 3 — API Route Dasar

## Tujuan

Memahami cara membuat API menggunakan Next.js.

## Materi

Contoh API GET:

```jsx
export async function GET() {
  return Response.json([
    {
      id: 1,
      name: "Ahmad",
      class: "A"
    }
  ]);
}
```

Lokasi file:

```text
app/api/students/route.js
```

Akses melalui:

```text
http://localhost:3000/api/students
```

## Latihan

Buat endpoint:

```text
GET /api/students
```

Output:

```json
[
  {
    "id": 1,
    "name": "Ali",
    "class": "A"
  }
]
```

## Quiz

1. Method HTTP untuk mengambil data?
2. Method HTTP untuk menambah data?
3. Apa format data yang biasanya dikirim API?

---

# Sesi 4 — Menampilkan Data dari API

## Tujuan

Menampilkan data API ke halaman web.

## Materi

Client Component:

```jsx
"use client";
```

Mengambil data:

```jsx
useEffect(() => {
  fetch("/api/students");
}, []);
```

State:

```jsx
const [students, setStudents] = useState([]);
```

Menampilkan tabel:

```jsx
<table>
```

## Latihan

Tampilkan data siswa dalam tabel:

| ID | Nama | Kelas |
| -- | ---- | ----- |

## Quiz

1. Apa fungsi `useState`?
2. Apa fungsi `useEffect`?
3. Mengapa frontend perlu memanggil API?

---

# Sesi 5 — Create Data

## Tujuan

Menambahkan data baru.

## Materi

Form Input:

```jsx
<input />
```

Submit Form:

```jsx
fetch("/api/students", {
  method: "POST"
});
```

## Latihan

Buat form:

* Nama
* Kelas

Ketika submit:

* Data tersimpan
* Daftar siswa otomatis bertambah

## Quiz

1. Method HTTP untuk membuat data?
2. Apa fungsi event submit?
3. Mengapa validasi diperlukan?

---

# Sesi 6 — Update Data

## Tujuan

Mengubah data yang sudah ada.

## Materi

Halaman edit:

```text
/students/1/edit
```

Method:

```text
PUT
```

Alur:

```text
Ambil Data
↓
Isi Form
↓
Edit
↓
Kirim PUT
```

## Latihan

Ubah nama siswa yang sudah ada.

## Quiz

1. Method untuk update data?
2. Mengapa ID diperlukan?
3. Apa perbedaan POST dan PUT?

---

# Sesi 7 — Delete Data

## Tujuan

Menghapus data.

## Materi

Method:

```text
DELETE
```

Contoh:

```jsx
fetch("/api/students/1", {
  method: "DELETE"
});
```

## Latihan

Tambahkan tombol hapus pada setiap siswa.

## Quiz

1. Method untuk menghapus data?
2. Mengapa perlu konfirmasi sebelum menghapus?
3. Apa yang harus dilakukan setelah data berhasil dihapus?

---

# Mini Assessment

## Studi Kasus

Buat aplikasi:

# Data Siswa

Struktur data:

```json
{
  "id": 1,
  "name": "Ahmad",
  "class": "A"
}
```

## Fitur Wajib

### Create

Tambah siswa baru.

### Read

Tampilkan daftar siswa.

### Update

Edit data siswa.

### Delete

Hapus data siswa.

### Validasi

* Name wajib diisi
* Class wajib diisi

---

# Rubrik Penilaian

| Komponen   | Nilai |
| ---------- | ----: |
| GET API    |    15 |
| POST API   |    20 |
| PUT API    |    20 |
| DELETE API |    20 |
| Tabel Data |    10 |
| Form Input |    10 |
| Validasi   |     5 |
| Total      |   100 |

---

# Target Kompetensi

Setelah mengikuti pelatihan ini, peserta mampu:

* Memahami alur kerja aplikasi Fullstack.
* Menggunakan Next.js App Router.
* Membuat API Routes.
* Menggunakan useState dan useEffect.
* Mengambil data menggunakan Fetch API.
* Membuat CRUD sederhana.
* Mengerjakan ujian CRUD Next.js tingkat dasar secara mandiri.
