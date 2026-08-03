import React, { useState } from 'react';
import { Database, Code, FileText, Check, Copy, Download } from 'lucide-react';

export const PhpMvcCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'ooad' | 'db_class' | 'model' | 'controller' | 'view'>('sql');
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ==============================================================================
-- DATABASE SYSTEM INFORMASI PRODUKSI DAN PANEN KELAPA SAWIT
-- Perusahaan: PT. Moies Perkebunan Sipare Pare
-- Metodologi: Object-Oriented Analysis and Design (OOAD) - Normalized Relational Schema
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`db_sawit_siparepare\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_sawit_siparepare\`;

-- 1. TABEL USERS
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('Admin', 'Manajer', 'Mandor') NOT NULL DEFAULT 'Admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL BLOK KEBUN
CREATE TABLE IF NOT EXISTS \`blok_kebun\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_blok\` VARCHAR(50) NOT NULL UNIQUE,
  \`luas_ha\` DECIMAL(8,2) NOT NULL,
  \`lokasi\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL PETUGAS PANEN
CREATE TABLE IF NOT EXISTS \`petugas_panen\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_petugas\` VARCHAR(100) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`no_hp\` VARCHAR(20) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL MANDOR
CREATE TABLE IF NOT EXISTS \`mandor\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_mandor\` VARCHAR(100) NOT NULL,
  \`wilayah\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(20) NOT NULL,
  \`status\` ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL JADWAL PANEN
CREATE TABLE IF NOT EXISTS \`jadwal_panen\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tanggal\` DATE NOT NULL,
  \`blok_id\` INT NOT NULL,
  \`mandor_id\` INT NOT NULL,
  \`keterangan\` VARCHAR(255) DEFAULT 'Panen Rutin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`blok_id\`) REFERENCES \`blok_kebun\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`mandor_id\`) REFERENCES \`mandor\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL HASIL PANEN TBS
CREATE TABLE IF NOT EXISTS \`hasil_panen_tbs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tanggal\` DATE NOT NULL,
  \`blok_id\` INT NOT NULL,
  \`petugas_id\` INT NOT NULL,
  \`jumlah_janjang\` INT NOT NULL,
  \`berat_kg\` DECIMAL(10,2) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`blok_id\`) REFERENCES \`blok_kebun\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`petugas_id\`) REFERENCES \`petugas_panen\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL BRONDOLAN
CREATE TABLE IF NOT EXISTS \`brondolan\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tanggal\` DATE NOT NULL,
  \`blok_id\` INT NOT NULL,
  \`jumlah_kg\` DECIMAL(10,2) NOT NULL,
  \`keterangan\` VARCHAR(255) DEFAULT 'Brondolan Panen',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`blok_id\`) REFERENCES \`blok_kebun\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const ooadClassDiagram = `<?php
/**
 * ==============================================================================
 * CLASS DIAGRAM OOAD (Object-Oriented Analysis and Design)
 * PT. Moies Perkebunan Sipare Pare - Sistem Informasi Panen Kelapa Sawit
 * ==============================================================================
 * 
 * +-----------------------+          +-----------------------+
 * |      Database         |          |       BlokKebun       |
 * +-----------------------+          +-----------------------+
 * | - host: string        |          | - id: int             |
 * | - db_name: string     |          | - namaBlok: string    |
 * | - conn: PDO           |          | - luasHa: float       |
 * +-----------------------+          | - lokasi: string      |
 * | + getConnection()     |          +-----------------------+
 * +-----------------------+          | + create() : bool     |
 *                                    | + readAll() : array   |
 * +-----------------------+          | + update() : bool     |
 * |     HasilPanenTBS     |          | + delete() : bool     |
 * +-----------------------+          +-----------------------+
 * | - id: int             |
 * | - tanggal: string     |          +-----------------------+
 * | - blokId: int         |          |     DSS_Engine        |
 * | - petugasId: int      |          +-----------------------+
 * | - jumlahJanjang: int  |          | + hitungPenurunan()   |
 * | - beratKg: float      |          | + deteksiAlert()      |
 * +-----------------------+          | + buatRekomendasi()   |
 * | + getHarvestByDate()  |          +-----------------------+
 * +-----------------------+
 */
`;

  const dbPhpCode = `<?php
/**
 * File: config/Database.php
 * Deskripsi: Class Singleton untuk Koneksi Database MySQL PDO Native
 */
class Database {
    private $host = "localhost";
    private $db_name = "db_sawit_siparepare";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Koneksi Database Gagal: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>`;

  const modelPhpCode = `<?php
/**
 * File: models/BlokModel.php
 * Deskripsi: Model OOAD untuk Pengelolaan Master Data Blok Kebun
 */
class BlokModel {
    private $conn;
    private $table_name = "blok_kebun";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllBlok() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertBlok($nama_blok, $luas_ha, $lokasi) {
        $query = "INSERT INTO " . $this->table_name . " (nama_blok, luas_ha, lokasi) VALUES (:nama, :luas, :lokasi)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nama", $nama_blok);
        $stmt->bindParam(":luas", $luas_ha);
        $stmt->bindParam(":lokasi", $lokasi);
        return $stmt->execute();
    }
}
?>`;

  const controllerPhpCode = `<?php
/**
 * File: controllers/DSSController.php
 * Deskripsi: Controller Analisis Penurunan Produksi (Decision Support System)
 */
require_once '../config/Database.php';
require_once '../models/HasilPanenModel.php';

class DSSController {
    private $db;
    private $hasilPanenModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->hasilPanenModel = new HasilPanenModel($this->db);
    }

    public function analisaPenurunanPanen($blok_id) {
        $data = $this->hasilPanenModel->getRiwayatPanenBlok($blok_id);
        if (count($data) < 2) return null;

        $sebelum = $data[1]['berat_kg'];
        $sekarang = $data[0]['berat_kg'];

        $selisih = $sebelum - $sekarang;
        $persenDrop = ($selisih / $sebelum) * 100;

        if ($persenDrop > 15) {
            return [
                'status' => 'WARNING_SIGNIFIKAN',
                'persen_penurunan' => round($persenDrop, 1),
                'rekomendasi' => 'Pemeriksaan segera oleh Mandor terkait pemupukan & kehadiran pemanen!'
            ];
        }
        return ['status' => 'NORMAL'];
    }
}
?>`;

  const viewPhpCode = `<!-- File: views/dashboard.php (PHP Native View Template) -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - PT. Moies Perkebunan Sipare Pare</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-100">
    <div class="flex">
        <!-- Sidebar Navigation -->
        <?php include 'partials/sidebar.php'; ?>

        <!-- Main Content Area -->
        <main class="flex-1 p-6">
            <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p class="text-sm text-gray-600 mb-6">Selamat datang, <?= $_SESSION['user_fullname']; ?></p>

            <!-- Cards KPI -->
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-green-600 text-white p-4 rounded-lg shadow">
                    <p class="text-sm">Blok Kebun</p>
                    <h2 class="text-3xl font-bold"><?= $totalBlok; ?></h2>
                    <span class="text-xs">Total Blok</span>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'sql': return sqlCode;
      case 'ooad': return ooadClassDiagram;
      case 'db_class': return dbPhpCode;
      case 'model': return modelPhpCode;
      case 'controller': return controllerPhpCode;
      case 'view': return viewPhpCode;
      default: return sqlCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const element = document.createElement('a');
    const file = new Blob([sqlCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'database_siparepare.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold">Struktur Kode & Arsitektur System (OOAD / PHP Native MVC / MySQL)</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs px-3 py-1.5 rounded transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin!' : 'Salin Kode'}
          </button>
          <button
            onClick={handleDownloadSql}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh database.sql
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-slate-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-green-600" />
          database.sql (MySQL DDL)
        </button>

        <button
          onClick={() => setActiveTab('ooad')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'ooad'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          OOAD Class Diagram
        </button>

        <button
          onClick={() => setActiveTab('db_class')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'db_class'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Database.php (PDO)
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'model'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          BlokModel.php (Model)
        </button>

        <button
          onClick={() => setActiveTab('controller')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'controller'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          DSSController.php (Controller)
        </button>

        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'view'
              ? 'border-green-600 text-green-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          DashboardView.php (View)
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-xs font-mono max-h-[500px]">
        <pre>{getActiveCode()}</pre>
      </div>
    </div>
  );
};
