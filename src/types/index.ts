/**
 * @file index.ts
 * @description Master Types & OOAD Class Specification for PT. Moies Perkebunan Sipare Pare
 * 
 * ==============================================================================
 * CLASS DIAGRAM OOAD (Object-Oriented Analysis and Design)
 * ==============================================================================
 * 
 *  +-----------------------+          +-----------------------+
 *  |         User          |          |       BlokKebun       |
 *  +-----------------------+          +-----------------------+
 *  | - id: int             |          | - id: int             |
 *  | - username: string    |          | - namaBlok: string    |
 *  | - password: string    |          | - luasHa: number      |
 *  | - namaLengkap: string |          | - lokasi: string      |
 *  | - role: string        |          +-----------------------+
 *  +-----------------------+          | + getDetails()        |
 *  | + authenticate()      |          +-----------+-----------+
 *  +-----------------------+                      |
 *                                                 | 1..*
 *  +-----------------------+          +-----------+-----------+
 *  |     PetugasPanen      |          |      JadwalPanen      |
 *  +-----------------------+          +-----------------------+
 *  | - id: int             |          | - id: int             |
 *  | - namaPetugas: string |          | - tanggal: string     |
 *  | - alamat: string      |          | - blokId: int         |
 *  | - noHp: string        |          | - mandorId: int       |
 *  +-----------------------+          | - keterangan: string  |
 *  | + getInfo()           |          +-----------------------+
 *  +-----------+-----------+                      |
 *              |                                  |
 *              | 1..*                             | 1..*
 *  +-----------+-----------+          +-----------+-----------+
 *  |     HasilPanenTBS     |          |        Mandor         |
 *  +-----------------------+          +-----------------------+
 *  | - id: int             |          | - id: int             |
 *  | - tanggal: string     |          | - namaMandor: string  |
 *  | - blokId: int         |          | - wilayah: string     |
 *  | - petugasId: int      |          | - noHp: string        |
 *  | - jumlahJanjang: int  |          | - status: string      |
 *  | - beratKg: number     |          +-----------------------+
 *  +-----------------------+          | + assignSchedule()    |
 *  | + hitungTotalBerat()  |          +-----------------------+
 *  +-----------+-----------+
 *              |
 *              | (Digunakan oleh Engine DSS)
 *              v
 *  +-----------------------------------+
 *  |       DSS_EvaluasiPenurunan       |
 *  +-----------------------------------+
 *  | - id: int                         |
 *  | - blokId: int                     |
 *  | - hasilSebelumKg: number          |
 *  | - hasilSekarangKg: number         |
 *  | - persenPenurunan: number         |
 *  | - statusPeringatan: string        |
 *  | - rekomendasiTindakan: string     |
 *  | - catatanManajer: string          |
 *  +-----------------------------------+
 *  | + hitungPenurunanPersen()         |
 *  | + deteksiPeringatanSignifikan()   |
 *  +-----------------------------------+
 * 
 * ==============================================================================
 */

export type UserRole = 'Admin' | 'Manajer' | 'Mandor';

export interface User {
  id: number;
  username: string;
  password?: string;
  nama_lengkap: string;
  role: UserRole;
  created_at?: string;
}

export interface BlokKebun {
  id: number;
  nama_blok: string;
  luas_ha: number;
  lokasi: string;
  created_at?: string;
}

export interface PetugasPanen {
  id: number;
  nama_petugas: string;
  alamat: string;
  no_hp: string;
  created_at?: string;
}

export interface Mandor {
  id: number;
  nama_mandor: string;
  wilayah: string;
  no_hp: string;
  status: 'Aktif' | 'Non-Aktif';
  created_at?: string;
}

export interface JadwalPanen {
  id: number;
  tanggal: string; // YYYY-MM-DD
  blok_id: number;
  mandor_id: number;
  keterangan: string;
  // Hydrated attributes for display
  nama_blok?: string;
  nama_mandor?: string;
}

export interface HasilPanenTBS {
  id: number;
  tanggal: string; // YYYY-MM-DD
  blok_id: number;
  petugas_id: number;
  jumlah_janjang: number;
  berat_kg: number;
  harga_per_kg?: number;
  // Hydrated attributes for display
  nama_blok?: string;
  nama_petugas?: string;
}

export interface Brondolan {
  id: number;
  tanggal: string; // YYYY-MM-DD
  blok_id: number;
  jumlah_kg: number;
  keterangan: string;
  // Hydrated attributes
  nama_blok?: string;
}

export type StatusPeringatanDSS = 'Normal' | 'Waspada' | 'Kritis';
export type StatusTindakLanjutDSS = 'Belum Diperiksa' | 'Proses Evaluasi' | 'Selesai';

export interface EvaluasiDSS {
  id: number;
  tanggal_evaluasi: string;
  blok_id: number;
  nama_blok: string;
  hasil_sebelum_kg: number;
  hasil_sekarang_kg: number;
  persen_penurunan: number;
  status_peringatan: StatusPeringatanDSS;
  rekomendasi_tindakan: string;
  catatan_manajer?: string;
  status_tindak_lanjut: StatusTindakLanjutDSS;
  created_at?: string;
}

export interface LaporanProduksiHarian {
  tanggal: string;
  total_tbs_kg: number;
  total_janjang: number;
  total_brondolan_kg: number;
}

export type ActivePage = 
  | 'login'
  | 'dashboard'
  | 'data-user'
  | 'data-blok'
  | 'data-petugas'
  | 'data-mandor'
  | 'data-jadwal'
  | 'hasil-panen'
  | 'brondolan'
  | 'laporan-produksi'
  | 'analisis-dss'
  | 'kode-ooad-sql';
