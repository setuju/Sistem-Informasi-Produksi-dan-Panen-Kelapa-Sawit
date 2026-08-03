import { User, BlokKebun, PetugasPanen, Mandor, JadwalPanen, HasilPanenTBS, Brondolan, Message, Task } from '../types';

export const initialUsers: User[] = [
  { id: 1, username: 'admin', nama_lengkap: 'Administrator Utama', role: 'Admin' },
  { id: 2, username: 'manajer', nama_lengkap: 'Bapak Ir. Hendra Suputra', role: 'Manajer' },
  { id: 3, username: 'mandor1', nama_lengkap: 'Rahmat Hidayat', role: 'Mandor' },
  { id: 4, username: 'mandor2', nama_lengkap: 'Irwan Saputra', role: 'Mandor' }
];

export const initialBlokKebun: BlokKebun[] = [
  { id: 1, nama_blok: 'Blok A1', luas_ha: 45, lokasi: 'Afdeling 1' },
  { id: 2, nama_blok: 'Blok A2', luas_ha: 40, lokasi: 'Afdeling 1' },
  { id: 3, nama_blok: 'Blok B1', luas_ha: 50, lokasi: 'Afdeling 2' },
  { id: 4, nama_blok: 'Blok B2', luas_ha: 55, lokasi: 'Afdeling 2' },
  { id: 5, nama_blok: 'Blok C1', luas_ha: 60, lokasi: 'Afdeling 3' },
  { id: 6, nama_blok: 'Blok C2', luas_ha: 48, lokasi: 'Afdeling 3' },
  { id: 7, nama_blok: 'Blok D1', luas_ha: 52, lokasi: 'Afdeling 4' },
  { id: 8, nama_blok: 'Blok D2', luas_ha: 42, lokasi: 'Afdeling 4' }
];

export const initialPetugasPanen: PetugasPanen[] = [
  { id: 1, nama_petugas: 'Andi Saputra', alamat: 'Indrapura', no_hp: '081234567890' },
  { id: 2, nama_petugas: 'Budi Setiawan', alamat: 'Sei Suka', no_hp: '081265432109' },
  { id: 3, nama_petugas: 'Citra Lestari', alamat: 'Lima Puluh', no_hp: '082176543210' },
  { id: 4, nama_petugas: 'Dedi Kurniawan', alamat: 'Air Putih', no_hp: '081298765432' },
  { id: 5, nama_petugas: 'Eka Pratama', alamat: 'Lima Puluh Pesisir', no_hp: '082233445568' }
];

export const initialMandor: Mandor[] = [
  { id: 1, nama_mandor: 'Rahmat Hidayat', wilayah: 'Afdeling 1 & 3', no_hp: '081370001122', status: 'Aktif' },
  { id: 2, nama_mandor: 'Irwan Saputra', wilayah: 'Afdeling 2 & 4', no_hp: '081370003344', status: 'Aktif' },
  { id: 3, nama_mandor: 'Slamet Supriadi', wilayah: 'Afdeling 3', no_hp: '081370005566', status: 'Aktif' }
];

export const initialJadwalPanen: JadwalPanen[] = [
  { id: 1, tanggal: '2024-05-18', blok_id: 1, mandor_id: 1, keterangan: 'Panen Rutin' },
  { id: 2, tanggal: '2024-05-19', blok_id: 2, mandor_id: 1, keterangan: 'Panen Rutin' },
  { id: 3, tanggal: '2024-05-19', blok_id: 3, mandor_id: 2, keterangan: 'Panen Rutin' },
  { id: 4, tanggal: '2024-05-20', blok_id: 4, mandor_id: 2, keterangan: 'Panen Rutin' },
  { id: 5, tanggal: '2024-05-20', blok_id: 5, mandor_id: 1, keterangan: 'Panen Rutin' }
];

export const initialHasilPanenTBS: HasilPanenTBS[] = [
  { id: 1, tanggal: '2024-05-18', blok_id: 1, petugas_id: 1, jumlah_janjang: 120, berat_kg: 1850 },
  { id: 2, tanggal: '2024-05-18', blok_id: 1, petugas_id: 2, jumlah_janjang: 95, berat_kg: 1420 },
  { id: 3, tanggal: '2024-05-18', blok_id: 2, petugas_id: 3, jumlah_janjang: 110, berat_kg: 1700 },
  { id: 4, tanggal: '2024-05-19', blok_id: 3, petugas_id: 4, jumlah_janjang: 130, berat_kg: 2000 },
  { id: 5, tanggal: '2024-05-19', blok_id: 4, petugas_id: 5, jumlah_janjang: 100, berat_kg: 1480 },
  { id: 6, tanggal: '2024-05-20', blok_id: 5, petugas_id: 1, jumlah_janjang: 115, berat_kg: 1650 },
  // Historical entries to populate 7-day trend chart & DSS calculations
  { id: 7, tanggal: '2024-05-12', blok_id: 1, petugas_id: 1, jumlah_janjang: 110, berat_kg: 1650 },
  { id: 8, tanggal: '2024-05-13', blok_id: 2, petugas_id: 2, jumlah_janjang: 90, berat_kg: 1300 },
  { id: 9, tanggal: '2024-05-14', blok_id: 3, petugas_id: 3, jumlah_janjang: 125, berat_kg: 1950 },
  { id: 10, tanggal: '2024-05-15', blok_id: 4, petugas_id: 4, jumlah_janjang: 118, berat_kg: 1800 },
  { id: 11, tanggal: '2024-05-16', blok_id: 1, petugas_id: 5, jumlah_janjang: 135, berat_kg: 2100 },
  { id: 12, tanggal: '2024-05-17', blok_id: 2, petugas_id: 1, jumlah_janjang: 75, berat_kg: 1100 }
];

export const initialBrondolan: Brondolan[] = [
  { id: 1, tanggal: '2024-05-18', blok_id: 1, jumlah_kg: 150, keterangan: 'Brondolan Panen' },
  { id: 2, tanggal: '2024-05-18', blok_id: 2, jumlah_kg: 120, keterangan: 'Brondolan Panen' },
  { id: 3, tanggal: '2024-05-19', blok_id: 3, jumlah_kg: 200, keterangan: 'Brondolan Panen' },
  { id: 4, tanggal: '2024-05-19', blok_id: 4, jumlah_kg: 180, keterangan: 'Brondolan Panen' },
  { id: 5, tanggal: '2024-05-20', blok_id: 5, jumlah_kg: 160, keterangan: 'Brondolan Panen' }
];

export const initialMessages: Message[] = [
  {
    id: 1,
    sender_id: 1, // Admin
    sender_name: 'Administrator Utama',
    sender_role: 'Admin',
    receiver_id: 2, // Manager
    receiver_name: 'Bapak Ir. Hendra Suputra',
    receiver_role: 'Manajer',
    message_text: 'Pak Manajer, tolong cek laporan evaluasi DSS di Blok A2 karena terjadi penurunan tonase.',
    is_read: true,
    created_at: '2024-05-18 08:30'
  },
  {
    id: 2,
    sender_id: 2, // Manager
    sender_name: 'Bapak Ir. Hendra Suputra',
    sender_role: 'Manajer',
    receiver_id: 3, // Mandor
    receiver_name: 'Rahmat Hidayat',
    receiver_role: 'Mandor',
    message_text: 'Instruksi: Cek kebersihan piringan dan pemupukan di Blok A2 hari ini.',
    is_read: false,
    created_at: '2024-05-18 09:15'
  }
];

export const initialTasks: Task[] = [
  {
    id: 1,
    manager_id: 2,
    manager_name: 'Bapak Ir. Hendra Suputra',
    mandor_id: 3,
    mandor_name: 'Rahmat Hidayat',
    task_description: 'Evaluasi & pembersihan piringan pohon sawit di Blok A2 pasca penurunan hasil panen.',
    blok_name: 'Blok A2',
    status: 'pending',
    notes: '',
    created_at: '2024-05-18 09:20'
  },
  {
    id: 2,
    manager_id: 2,
    manager_name: 'Bapak Ir. Hendra Suputra',
    mandor_id: 3,
    mandor_name: 'Rahmat Hidayat',
    task_description: 'Pemeriksaan ancak panen rutin Afdeling 1.',
    blok_name: 'Blok A1',
    status: 'done',
    notes: 'Ancak panen sudah bersih dan tertata sesuai standar.',
    created_at: '2024-05-17 07:45',
    verified_at: '2024-05-17 16:30'
  }
];
