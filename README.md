# Sistem Informasi Produksi dan Panen Kelapa Sawit

[![PHP Native MVC](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Sistem Informasi Manajemen Produksi, Panen Kelapa Sawit & Pendukung Keputusan (DSS) Hasil Kebun**  
> Diimplementasikan untuk **PT. Moies Perkebunan Sipare Pare** menggunakan arsitektur **PHP Native MVC**, **MySQL Normalized Database**, dan metodologi **Object-Oriented Analysis and Design (OOAD)**.

---

## 📋 Deskripsi Proyek

Perkebunan kelapa sawit membutuhkan pengawasan ketat terhadap tren hasil panen Tandan Buah Segar (TBS) dan brondolan agar potensi penurunan produksi di tiap blok kebun dapat terdeteksi secara dini. 

**Sistem Informasi Produksi dan Panen Kelapa Sawit PT. Moies Perkebunan Sipare Pare** dirancang sebagai solusi terpadu untuk memantau data operasional panen harian, menjadwalkan mandor dan pemanen, serta menyajikan analisis *Decision Support System (DSS)*. Sistem ini secara otomatis memberikan peringatan (*Warning Alert*) ketika terjadi penurunan persentase hasil panen yang signifikan pada suatu blok kebun, sekaligus menyediakan kanal komunikasi hirarki dari Manajer ke Mandor Lapangan untuk verifikasi penanganan masalah di lapangan.

---

## 🚀 Live Demo

Aplikasi ini dapat diakses secara langsung melalui tautan berikut:  
👉 **[https://sistem-informasi-produksi-dan-panen.vercel.app](https://sistem-informasi-produksi-dan-panen.vercel.app)**

### 📸 Tampilan Antarmuka Aplikasi

![Dashboard Overview](https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1200&auto=format&fit=crop)  
*Catatan: Anda dapat mengganti tautan gambar di atas dengan tangkapan layar (screenshot) asli dari dasbor aplikasi Anda.*

---

## ✨ Fitur Unggulan

- 🔐 **Role-Based Access Control (RBAC):** Hak akses berjenjang yang disesuaikan dengan wewenang operasional:
  - **Administrator:** Akses penuh kelola user, master data, transaksi panen, laporan, serta fitur ganti password admin.
  - **Manajer:** Akses dasbor eksekutif, analisis peringatan DSS, pemberian perintah/tugas ke Mandor, serta peninjauan laporan.
  - **Mandor Lapangan:** Akses dasbor ringkas, verifikasi pekerjaan lapangan (Selesai/Belum Selesai), serta penerimaan pesan instruksi.
- 📊 **Dashboard & KPI Stats Interaktif:** Menampilkan indikator statistik utama (Total Hasil Panen TBS, Brondolan, Blok Active) serta **Grafik Trend Produksi 7 Hari Terakhir** menggunakan Chart.js.
- ⚠️ **Decision Support System (DSS) Alert:** Algoritma deteksi otomatis penurunan hasil panen berbasis persentase selisih produksi antar-periode di setiap blok kebun.
- 📁 **Manajemen Data Lengkap (CRUD):**
  - Data User & Pengaturan Akses
  - Master Data Blok Kebun (Luas Ha & Lokasi Afdeling)
  - Data Petugas Panen & Mandor
  - Jadwal Panen Kebun
  - Pencatatan Transaksi Panen TBS & Brondolan
- 💬 **Sistem Komunikasi & Verifikasi Tugas:** Alur penugasan dari Manajer ke Mandor dengan status verifikasi pekerjaan real-time beserta catatan lapangan.
- 📈 **Laporan Produksi & Rekapitulasi:** Filter data berdasarkan rentang tanggal dengan perhitungan rekap total produksi harian.

---

## 🛠️ Teknologi yang Digunakan

### Backend & Database
- **PHP Native (MVC Pattern)** - Struktur pemisahan *Model*, *View*, dan *Controller* yang rapi.
- **PDO (PHP Data Objects)** - Koneksi database aman dengan *Prepared Statements* untuk mencegah SQL Injection.
- **MySQL Database** - Skema relasional yang ter-normalisasi berdasarkan analisis OOAD.

### Frontend & UI
- **HTML5 & CSS3 / Bootstrap 5 / Tailwind CSS** - Tata letak modern, bersih, dan responsif (*desktop & mobile friendly*).
- **Chart.js** - Visualisasi data statistik grafik hasil panen.
- **Lucide Icons** - Ikonografi antarmuka yang bersih dan konsisten.

---

## 📂 Struktur Folder Proyek

```text
db_kelapa_sawit/
├── config/
│   └── Database.php                 # Kelas Singleton Koneksi PDO MySQL
├── controllers/
│   ├── AuthController.php           # Autentikasi Login & Session
│   ├── UserController.php           # Pengelolaan User & Password Admin
│   ├── MessageTaskController.php    # Instruksi & Verifikasi Tugas Mandor
│   ├── DSSController.php            # Engine Deteksi Penurunan Hasil Panen
│   ├── PanenController.php          # Transaksi Hasil Panen TBS & Brondolan
│   └── ReportController.php         # Laporan Produksi Kebun
├── models/
│   ├── User.php                     # Entity Model User
│   ├── Message.php                  # Entity Model Pesan
│   ├── Task.php                     # Entity Model Tugas Mandor
│   ├── BlokKebun.php                # Entity Model Blok Kebun
│   ├── PetugasPanen.php             # Entity Model Petugas Panen
│   ├── Mandor.php                   # Entity Model Mandor
│   └── HasilPanen.php               # Entity Model Hasil Panen TBS
├── views/
│   ├── auth/
│   │   └── login.php                # Landing Page Login Utama
│   ├── dashboard/
│   │   ├── admin_dashboard.php      # Dasbor Utama Admin & Chart
│   │   ├── manager_dashboard.php    # Dasbor Eksekutif Manajer
│   │   └── mandor_dashboard.php     # Dasbor Ringkas Mandor
│   ├── users/
│   │   └── index.php                # Kelola User & Ganti Password
│   └── tasks/
│       └── index.php                # Komunikasi & Verifikasi Tugas
├── public/
│   └── index.php                    # Router Entry Point
└── db_kelapa_sawit.sql              # Script DDL Database & Seed Data
```

---

## ⚙️ Instalasi dan Menjalankan Proyek Secara Lokal

### Prasyarat
- Web Server Lokal (**XAMPP**, **Laragon**, atau **WampServer**).
- PHP versi **7.4** atau versi **8.x**.
- MySQL / MariaDB Server.

### Langkah-Langkah Setup
1. **Clone Repositori**
   ```bash
   git clone https://github.com/username/sistem-informasi-produksi-dan-panen.git
   cd sistem-informasi-produksi-dan-panen
   ```

2. **Pindahkan Folder Proyek**
   Pindahkan folder proyek ke dalam direktori server lokal Anda (misalnya `C:/xampp/htdocs/` atau `C:/laragon/www/`).

3. **Import Database MySQL**
   - Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
   - Buat database baru dengan nama `db_kelapa_sawit`.
   - Pilih database `db_kelapa_sawit`, lalu klik menu **Import**.
   - Pilih file `db_kelapa_sawit.sql` dari folder proyek, kemudian klik **Go / Kirim**.

4. **Konfigurasi Koneksi Database**
   Buka file `config/Database.php` dan sesuaikan kredensial MySQL Anda jika diperlukan:
   ```php
   private $host = "localhost";
   private $db_name = "db_kelapa_sawit";
   private $username = "root";
   private $password = "";
   ```

5. **Jalankan Aplikasi**
   Buka peramban (browser) Anda dan akses:
   ```text
   http://localhost/sistem-informasi-produksi-dan-panen/public/
   ```

---

## 👥 Akun Pengguna Demo

Gunakan kredensial berikut untuk mencoba fitur di tiap role pengguna pada halaman login:

| Role Pengguna | Username | Password | Hak Akses & Deskripsi |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin` | `admin123` | Full Control (CRUD Master Data, Transaksi, User, Ganti Password Admin) |
| 👔 **Manajer Kebun** | `manajer` | `manajer123` | Executive Dashboard, Evaluasi DSS, Kirim Perintah/Instruksi ke Mandor |
| 👷 **Mandor Lapangan**| `mandor` / `mandor1` | `mandor123` | Lapangan Dashboard, Verifikasi Tugas "Selesai" / "Belum Selesai" + Catatan |

---

## 🚀 Deployment di Vercel

Aplikasi ini di-deploy menggunakan platform **Vercel** untuk akses demonstrasi cepat. Pengkonfigurasian `vercel.json` disesuaikan untuk mengarahkan rute utama ke file entry point `public/index.php` atau build React SPA terintegrasi.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk kepentingan pembelajaran maupun pengembangan operasional.

---

## 🙏 Ucapan Terima Kasih

- Tim Manajemen & Operasional **PT. Moies Perkebunan Sipare Pare**.
- Komunitas Pengembang **PHP Native** & **Chart.js**.

***

*Copyright © 20246PT. Moies Perkebunan Sipare Pare — Sistem Informasi Produksi & Pendukung Keputusan Panen Kelapa Sawit.*
