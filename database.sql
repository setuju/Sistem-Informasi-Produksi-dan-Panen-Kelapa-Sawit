-- ==============================================================================
-- DATABASE SYSTEM INFORMASI PRODUKSI DAN PANEN KELAPA SAWIT
-- Perusahaan: PT. Moies Perkebunan Sipare Pare
-- Metodologi: Object-Oriented Analysis and Design (OOAD) - Normalized Relational Schema
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `db_sawit_siparepare` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_sawit_siparepare`;

-- 1. TABEL USERS (Pengguna Sistem & Otentikasi)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `role` ENUM('Admin', 'Manajer', 'Mandor') NOT NULL DEFAULT 'Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Users
INSERT INTO `users` (`username`, `password`, `nama_lengkap`, `role`) VALUES
('admin', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8vP3jO5mJ6M5xU0Wz.7B9wX0c', 'Administrator Utama', 'Admin'),
('manajer', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8vP3jO5mJ6M5xU0Wz.7B9wX0c', 'Bapak Ir. Hendra Suputra', 'Manajer'),
('mandor_rahmat', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8vP3jO5mJ6M5xU0Wz.7B9wX0c', 'Rahmat Hidayat', 'Mandor');

-- 2. TABEL BLOK KEBUN (Master Data Blok Area Perkebunan)
CREATE TABLE IF NOT EXISTS `blok_kebun` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_blok` VARCHAR(50) NOT NULL UNIQUE,
  `luas_ha` DECIMAL(8,2) NOT NULL,
  `lokasi` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Blok Kebun
INSERT INTO `blok_kebun` (`nama_blok`, `luas_ha`, `lokasi`) VALUES
('Blok A1', 45.00, 'Afdeling 1'),
('Blok A2', 40.00, 'Afdeling 1'),
('Blok B1', 50.00, 'Afdeling 2'),
('Blok B2', 55.00, 'Afdeling 2'),
('Blok C1', 60.00, 'Afdeling 3'),
('Blok C2', 48.00, 'Afdeling 3'),
('Blok D1', 52.00, 'Afdeling 4'),
('Blok D2', 42.00, 'Afdeling 4');

-- 3. TABEL PETUGAS PANEN (Master Data Pekerja Panen)
CREATE TABLE IF NOT EXISTS `petugas_panen` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_petugas` VARCHAR(100) NOT NULL,
  `alamat` TEXT NOT NULL,
  `no_hp` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Petugas Panen
INSERT INTO `petugas_panen` (`nama_petugas`, `alamat`, `no_hp`) VALUES
('Andi Saputra', 'Indrapura', '081234567890'),
('Budi Setiawan', 'Sei Suka', '081265432109'),
('Citra Lestari', 'Lima Puluh', '082176543210'),
('Dedi Kurniawan', 'Air Putih', '081298765432'),
('Eka Pratama', 'Lima Puluh Pesisir', '082233445568');

-- 4. TABEL MANDOR (Master Data Mandor Lapangan)
CREATE TABLE IF NOT EXISTS `mandor` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_mandor` VARCHAR(100) NOT NULL,
  `wilayah` VARCHAR(100) NOT NULL,
  `no_hp` VARCHAR(20) NOT NULL,
  `status` ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Mandor
INSERT INTO `mandor` (`nama_mandor`, `wilayah`, `no_hp`, `status`) VALUES
('Rahmat Hidayat', 'Afdeling 1 & 3', '081370001122', 'Aktif'),
('Irwan Saputra', 'Afdeling 2 & 4', '081370003344', 'Aktif'),
('Slamet Supriadi', 'Afdeling 3', '081370005566', 'Aktif');

-- 5. TABEL JADWAL PANEN (Penjadwalan Panen Harian Per Blok)
CREATE TABLE IF NOT EXISTS `jadwal_panen` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `blok_id` INT NOT NULL,
  `mandor_id` INT NOT NULL,
  `keterangan` VARCHAR(255) DEFAULT 'Panen Rutin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`blok_id`) REFERENCES `blok_kebun`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`mandor_id`) REFERENCES `mandor`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Jadwal Panen
INSERT INTO `jadwal_panen` (`tanggal`, `blok_id`, `mandor_id`, `keterangan`) VALUES
('2024-05-18', 1, 1, 'Panen Rutin'),
('2024-05-19', 2, 1, 'Panen Rutin'),
('2024-05-19', 3, 2, 'Panen Rutin'),
('2024-05-20', 4, 2, 'Panen Rutin'),
('2024-05-20', 5, 1, 'Panen Rutin');

-- 6. TABEL HASIL PANEN TBS (Pencatatan Tandan Buah Segar)
CREATE TABLE IF NOT EXISTS `hasil_panen_tbs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `blok_id` INT NOT NULL,
  `petugas_id` INT NOT NULL,
  `jumlah_janjang` INT NOT NULL,
  `berat_kg` DECIMAL(10,2) NOT NULL,
  `harga_per_kg` DECIMAL(10,2) DEFAULT 2400.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`blok_id`) REFERENCES `blok_kebun`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`petugas_id`) REFERENCES `petugas_panen`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Hasil Panen TBS
INSERT INTO `hasil_panen_tbs` (`tanggal`, `blok_id`, `petugas_id`, `jumlah_janjang`, `berat_kg`) VALUES
('2024-05-18', 1, 1, 120, 1850.00),
('2024-05-18', 1, 2, 95, 1420.00),
('2024-05-18', 2, 3, 110, 1700.00),
('2024-05-19', 3, 4, 130, 2000.00),
('2024-05-19', 4, 5, 100, 1480.00),
('2024-05-20', 5, 1, 115, 1650.00);

-- 7. TABEL BRONDOLAN (Pencatatan Buah Lepas / Brondolan)
CREATE TABLE IF NOT EXISTS `brondolan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `blok_id` INT NOT NULL,
  `jumlah_kg` DECIMAL(10,2) NOT NULL,
  `keterangan` VARCHAR(255) DEFAULT 'Brondolan Panen',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`blok_id`) REFERENCES `blok_kebun`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Brondolan
INSERT INTO `brondolan` (`tanggal`, `blok_id`, `jumlah_kg`, `keterangan`) VALUES
('2024-05-18', 1, 150.00, 'Brondolan Panen'),
('2024-05-18', 2, 120.00, 'Brondolan Panen'),
('2024-05-19', 3, 200.00, 'Brondolan Panen'),
('2024-05-19', 4, 180.00, 'Brondolan Panen'),
('2024-05-20', 5, 160.00, 'Brondolan Panen');

-- 8. TABEL EVALUASI DSS (Decision Support System - Analisis Penurunan Panen)
CREATE TABLE IF NOT EXISTS `evaluasi_dss` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal_evaluasi` DATE NOT NULL,
  `blok_id` INT NOT NULL,
  `hasil_sebelum_kg` DECIMAL(10,2) NOT NULL,
  `hasil_sekarang_kg` DECIMAL(10,2) NOT NULL,
  `persen_penurunan` DECIMAL(5,2) NOT NULL,
  `status_peringatan` ENUM('Normal', 'Waspada', 'Kritis') NOT NULL DEFAULT 'Waspada',
  `rekomendasi_tindakan` TEXT NOT NULL,
  `catatan_manajer` TEXT NULL,
  `status_tindak_lanjut` ENUM('Belum Diperiksa', 'Proses Evaluasi', 'Selesai') DEFAULT 'Belum Diperiksa',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`blok_id`) REFERENCES `blok_kebun`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- VIEW UNTUK REKAPITULASI LAPORAN PRODUKSI HARIAN
CREATE OR REPLACE VIEW `v_laporan_produksi` AS
SELECT 
  tbs.tanggal,
  SUM(tbs.berat_kg) AS total_tbs_kg,
  SUM(tbs.jumlah_janjang) AS total_janjang,
  COALESCE(SUM(b.jumlah_kg), 0) AS total_brondolan_kg
FROM `hasil_panen_tbs` tbs
LEFT JOIN `brondolan` b ON tbs.tanggal = b.tanggal AND tbs.blok_id = b.blok_id
GROUP BY tbs.tanggal
ORDER BY tbs.tanggal DESC;
