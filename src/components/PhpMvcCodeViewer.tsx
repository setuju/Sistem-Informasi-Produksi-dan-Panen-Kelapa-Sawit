import React, { useState } from 'react';
import { Database, Code, FileText, Check, Copy, Download, FolderTree } from 'lucide-react';

export const PhpMvcCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'folder' | 'sql' | 'ooad' | 'db_class' | 'model' | 'controller' | 'view'>('sql');
  const [copied, setCopied] = useState(false);

  const folderStructure = `==============================================================================
STRUKTUR FOLDER NATIVE PHP MVC (PT. MOIES PERKEBUNAN SIPARE PARE)
==============================================================================
db_kelapa_sawit/
├── config/
│   └── Database.php                 <-- Class Singleton PDO Connection
├── controllers/
│   ├── AuthController.php           <-- Autentikasi Login (password_verify)
│   ├── UserController.php           <-- Pengelolaan User & Role (Admin only)
│   ├── MessageTaskController.php    <-- Instruksi & Verifikasi Tugas Mandor
│   ├── DSSController.php            <-- Engine Deteksi Penurunan Hasil (DSS)
│   ├── PanenController.php          <-- Transaksi Hasil Panen TBS & Brondolan
│   └── ReportController.php         <-- Laporan Produksi & Export PDF/Excel
├── models/
│   ├── User.php                     <-- Entity Model User
│   ├── Message.php                  <-- Entity Model Message (Pesan)
│   ├── Task.php                     <-- Entity Model Task (Pekerjaan Mandor)
│   ├── BlokKebun.php                <-- Entity Model Blok Kebun
│   ├── PetugasPanen.php             <-- Entity Model Petugas
│   ├── Mandor.php                   <-- Entity Model Mandor Lapangan
│   └── HasilPanen.php               <-- Entity Model Hasil Panen & Brondolan
├── views/
│   ├── auth/
│   │   └── login.php                <-- Halaman Login Estetik dengan Background Sawit
│   ├── dashboard/
│   │   ├── admin_dashboard.php      <-- Full DSS Chart + KPI Stats Cards
│   │   ├── manager_dashboard.php    <-- Dashboard Manajer & Alert DSS
│   │   └── mandor_dashboard.php     <-- Dashboard Ringkas & Daftar Tugas Mandor
│   ├── users/
│   │   └── index.php                <-- Kelola User & Ganti Password Default
│   ├── tasks/
│   │   ├── index.php                <-- Halaman Instruksi & Verifikasi Mandor
│   │   └── verify_modal.php         <-- Modal Verifikasi Selesai / Belum Selesai
│   └── partials/
│       ├── header.php               <-- Breadcrumb & Profile Header
│       ├── sidebar.php              <-- Navigation Bar Emerald Green
│       └── footer.php               <-- Copyright & System Version
├── public/
│   ├── index.php                    <-- Entry point / Router App
│   └── assets/
│       ├── css/style.css
│       └── js/chart.js
└── db_kelapa_sawit.sql              <-- DDL Script Database & Initial Seed Data`;

  const sqlCode = `-- ==============================================================================
-- DATABASE SYSTEM INFORMASI PRODUKSI DAN PANEN KELAPA SAWIT
-- Perusahaan: PT. Moies Perkebunan Sipare Pare
-- Metodologi: Object-Oriented Analysis and Design (OOAD) - Normalized Relational Schema
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`db_kelapa_sawit\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_kelapa_sawit\`;

-- 1. TABEL USERS (Authentication & Role Based Access)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('Admin', 'Manajer', 'Mandor') NOT NULL DEFAULT 'Admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL MESSAGES (Komunikasi Antar User Admin/Manager/Mandor)
CREATE TABLE IF NOT EXISTS \`messages\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`sender_id\` INT NOT NULL,
  \`receiver_id\` INT NOT NULL,
  \`message_text\` TEXT NOT NULL,
  \`is_read\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL TASKS (Instruksi & Verifikasi Pekerjaan Mandor)
CREATE TABLE IF NOT EXISTS \`tasks\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`manager_id\` INT NOT NULL,
  \`mandor_id\` INT NOT NULL,
  \`task_description\` TEXT NOT NULL,
  \`blok_name\` VARCHAR(50) DEFAULT NULL,
  \`status\` ENUM('pending', 'done') NOT NULL DEFAULT 'pending',
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`verified_at\` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`mandor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL BLOK KEBUN
CREATE TABLE IF NOT EXISTS \`blok_kebun\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_blok\` VARCHAR(50) NOT NULL UNIQUE,
  \`luas_ha\` DECIMAL(8,2) NOT NULL,
  \`lokasi\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL PETUGAS PANEN
CREATE TABLE IF NOT EXISTS \`petugas_panen\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_petugas\` VARCHAR(100) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`no_hp\` VARCHAR(20) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL MANDOR LAPANGAN
CREATE TABLE IF NOT EXISTS \`mandor\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_mandor\` VARCHAR(100) NOT NULL,
  \`wilayah\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(20) NOT NULL,
  \`status\` ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL JADWAL PANEN
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

-- 8. TABEL HASIL PANEN TBS
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

-- 9. TABEL BRONDOLAN
CREATE TABLE IF NOT EXISTS \`brondolan\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tanggal\` DATE NOT NULL,
  \`blok_id\` INT NOT NULL,
  \`jumlah_kg\` DECIMAL(10,2) NOT NULL,
  \`keterangan\` VARCHAR(255) DEFAULT 'Brondolan Panen',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`blok_id\`) REFERENCES \`blok_kebun\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
-- INITIAL SEED DATA (Default Hashed Passwords for PHP password_verify)
-- admin -> admin123  |  manajer -> manajer123  |  mandor1 -> mandor123
-- ==============================================================================
INSERT INTO \`users\` (\`id\`, \`username\`, \`password_hash\`, \`nama_lengkap\`, \`role\`) VALUES
(1, 'admin', '$2y$10$0b1B1fM6L18A8LwV5R3B3.5tJqV4GqV4GqV4GqV4GqV4GqV4GqV4G', 'Administrator Utama', 'Admin'),
(2, 'manajer', '$2y$10$0b1B1fM6L18A8LwV5R3B3.5tJqV4GqV4GqV4GqV4GqV4GqV4GqV4G', 'Bapak Ir. Hendra Suputra', 'Manajer'),
(3, 'mandor1', '$2y$10$0b1B1fM6L18A8LwV5R3B3.5tJqV4GqV4GqV4GqV4GqV4GqV4GqV4G', 'Rahmat Hidayat', 'Mandor'),
(4, 'mandor2', '$2y$10$0b1B1fM6L18A8LwV5R3B3.5tJqV4GqV4GqV4GqV4GqV4GqV4GqV4G', 'Irwan Saputra', 'Mandor')
ON DUPLICATE KEY UPDATE \`username\`=\`username\`;

INSERT INTO \`blok_kebun\` (\`id\`, \`nama_blok\`, \`luas_ha\`, \`lokasi\`) VALUES
(1, 'Blok A1', 45.00, 'Afdeling 1'),
(2, 'Blok A2', 40.00, 'Afdeling 1'),
(3, 'Blok B1', 50.00, 'Afdeling 2'),
(4, 'Blok B2', 55.00, 'Afdeling 2');

INSERT INTO \`tasks\` (\`id\`, \`manager_id\`, \`mandor_id\`, \`task_description\`, \`blok_name\`, \`status\`, \`notes\`, \`created_at\`) VALUES
(1, 2, 3, 'Evaluasi & pembersihan piringan pohon sawit di Blok A2 pasca penurunan hasil panen.', 'Blok A2', 'pending', '', NOW());
`;

  const ooadClassDiagram = `<?php
/**
 * ==============================================================================
 * CLASS DIAGRAM OOAD (Object-Oriented Analysis and Design)
 * PT. Moies Perkebunan Sipare Pare - Sistem Informasi Panen Kelapa Sawit
 * ==============================================================================
 * 
 * +-----------------------+          +-----------------------+
 * |       Database        |          |         User          |
 * +-----------------------+          +-----------------------+
 * | - host: string        |          | - id: int             |
 * | - db_name: string     |          | - username: string    |
 * | - conn: PDO           |          | - passwordHash: string|
 * +-----------------------+          | - role: Enum          |
 * | + getConnection()     |          +-----------------------+
 * +-----------------------+          | + authenticate()      |
 *                                    | + changePassword()    |
 * +-----------------------+          +-----------+-----------+
 * |         Task          |                      |
 * +-----------------------+                      | 1..*
 * | - id: int             |          +-----------+-----------+
 * | - managerId: int      |          |        Message        |
 * | - mandorId: int       |          +-----------------------+
 * | - taskDesc: string    |          | - id: int             |
 * | - status: string      |          | - senderId: int       |
 * | - verifiedAt: string  |          | - receiverId: int     |
 * +-----------------------+          | - messageText: string |
 * | + verifyDone()        |          +-----------------------+
 * | + addNotes()          |          | + send()              |
 * +-----------------------+          +-----------------------+
 */
`;

  const dbPhpCode = `<?php
/**
 * File: config/Database.php
 * Deskripsi: Class Singleton untuk Koneksi Database MySQL PDO Native
 */
class Database {
    private $host = "localhost";
    private $db_name = "db_kelapa_sawit";
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
 * File: models/Task.php
 * Deskripsi: Model OOAD untuk Pengelolaan Perintah & Verifikasi Tugas Mandor
 */
class Task {
    private $conn;
    private $table_name = "tasks";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTasksForMandor($mandor_id) {
        $query = "SELECT t.*, u.nama_lengkap AS manager_name 
                  FROM " . $this->table_name . " t
                  JOIN users u ON t.manager_id = u.id
                  WHERE t.mandor_id = :mandor_id
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":mandor_id", $mandor_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateVerificationStatus($task_id, $status, $notes) {
        $query = "UPDATE " . $this->table_name . "
                  SET status = :status, notes = :notes, verified_at = NOW()
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":notes", $notes);
        $stmt->bindParam(":id", $task_id);
        return $stmt->execute();
    }
}
?>`;

  const controllerPhpCode = `<?php
/**
 * File: controllers/MessageTaskController.php
 * Deskripsi: Controller Pengelolaan Pesan & Verifikasi Mandor
 */
require_once '../config/Database.php';
require_once '../models/Task.php';

class MessageTaskController {
    private $db;
    private $taskModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->taskModel = new Task($this->db);
    }

    public function handleMandorVerification() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'verify_task') {
            $task_id = $_POST['task_id'];
            $status = $_POST['status']; // 'done' or 'pending'
            $notes = $_POST['notes'] ?? '';

            if ($this->taskModel->updateVerificationStatus($task_id, $status, $notes)) {
                header("Location: ../views/tasks/index.php?status=success");
                exit();
            }
        }
    }
}
?>`;

  const viewPhpCode = `<!-- File: views/dashboard/admin_dashboard.php (PHP Native View Template) -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - PT. Moies Perkebunan Sipare Pare</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-slate-50 font-sans text-slate-900">
    <div class="flex h-screen">
        <!-- Sidebar Navigation -->
        <?php include '../partials/sidebar.php'; ?>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto">
            <?php include '../partials/header.php'; ?>

            <div class="p-8 space-y-6">
                <!-- DSS Alert Banner -->
                <?php if (!empty($dssAlerts)): ?>
                <div class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex justify-between items-center">
                    <div>
                        <h4 class="text-rose-900 font-bold text-sm">Analisis Penurunan Hasil Panen (DSS)</h4>
                        <p class="text-rose-700 text-xs">Blok <?= $dssAlerts[0]['nama_blok']; ?> mengalami penurunan hasil <?= $dssAlerts[0]['persen']; ?>%.</p>
                    </div>
                    <a href="../tasks/index.php" class="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded">Evaluasi Mandor</a>
                </div>
                <?php endif; ?>

                <!-- KPI Stats Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <p class="text-xs font-bold text-slate-400 uppercase">Total Blok</p>
                        <h2 class="text-3xl font-bold"><?= $totalBlok; ?> Area</h2>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'folder': return folderStructure;
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
    element.download = 'db_kelapa_sawit.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-emerald-950 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold">Kode Arsitektur Native PHP MVC & db_kelapa_sawit.sql</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin!' : 'Salin Kode'}
          </button>
          <button
            onClick={handleDownloadSql}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh db_kelapa_sawit.sql
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('folder')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'folder'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderTree className="w-4 h-4 text-emerald-600" />
          Struktur Folder Project
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          db_kelapa_sawit.sql
        </button>

        <button
          onClick={() => setActiveTab('ooad')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'ooad'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          OOAD Class Diagram
        </button>

        <button
          onClick={() => setActiveTab('db_class')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'db_class'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Database.php (PDO)
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'model'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Task.php (Model)
        </button>

        <button
          onClick={() => setActiveTab('controller')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'controller'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          MessageTaskController.php
        </button>

        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeTab === 'view'
              ? 'border-emerald-700 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          admin_dashboard.php (View)
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-xs font-mono max-h-[500px]">
        <pre>{getActiveCode()}</pre>
      </div>
    </div>
  );
};
