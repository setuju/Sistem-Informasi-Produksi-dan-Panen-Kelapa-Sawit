import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Wheat } from 'lucide-react';
import { HasilPanenTBS, BlokKebun, PetugasPanen } from '../types';
import { Modal } from './Modal';
import { formatRibuan, formatTanggalIndo } from '../utils/dssEngine';

interface DataHasilPanenProps {
  hasilPanen: HasilPanenTBS[];
  blokKebun: BlokKebun[];
  petugasPanen: PetugasPanen[];
  onAdd: (data: Omit<HasilPanenTBS, 'id'>) => void;
  onEdit: (data: HasilPanenTBS) => void;
  onDelete: (id: number) => void;
}

export const DataHasilPanen: React.FC<DataHasilPanenProps> = ({
  hasilPanen,
  blokKebun,
  petugasPanen,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HasilPanenTBS | null>(null);

  const [tanggal, setTanggal] = useState('2024-05-18');
  const [blokId, setBlokId] = useState<number>(blokKebun[0]?.id || 1);
  const [petugasId, setPetugasId] = useState<number>(petugasPanen[0]?.id || 1);
  const [jumlahJanjang, setJumlahJanjang] = useState('120');
  const [beratKg, setBeratKg] = useState('1850');

  const openAddModal = () => {
    setEditingItem(null);
    setTanggal('2024-05-18');
    setBlokId(blokKebun[0]?.id || 1);
    setPetugasId(petugasPanen[0]?.id || 1);
    setJumlahJanjang('120');
    setBeratKg('1850');
    setIsModalOpen(true);
  };

  const openEditModal = (item: HasilPanenTBS) => {
    setEditingItem(item);
    setTanggal(item.tanggal);
    setBlokId(item.blok_id);
    setPetugasId(item.petugas_id);
    setJumlahJanjang(item.jumlah_janjang.toString());
    setBeratKg(item.berat_kg.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !blokId || !petugasId || !jumlahJanjang || !beratKg) return;

    if (editingItem) {
      onEdit({
        ...editingItem,
        tanggal,
        blok_id: Number(blokId),
        petugas_id: Number(petugasId),
        jumlah_janjang: parseInt(jumlahJanjang, 10),
        berat_kg: parseFloat(beratKg),
      });
    } else {
      onAdd({
        tanggal,
        blok_id: Number(blokId),
        petugas_id: Number(petugasId),
        jumlah_janjang: parseInt(jumlahJanjang, 10),
        berat_kg: parseFloat(beratKg),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Hasil Panen (TBS)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pencatatan Perolehan Tandan Buah Segar (Janjang & Tonase Berat Kg)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Tanggal</th>
                <th className="py-3.5 px-6">Blok</th>
                <th className="py-3.5 px-6">Petugas</th>
                <th className="py-3.5 px-6">Jumlah TBS (Janjang)</th>
                <th className="py-3.5 px-6">Berat (Kg)</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {hasilPanen.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada data hasil panen TBS.
                  </td>
                </tr>
              ) : (
                hasilPanen.map((item, index) => {
                  const blok = blokKebun.find((b) => b.id === item.blok_id);
                  const petugas = petugasPanen.find((p) => p.id === item.petugas_id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>{formatTanggalIndo(item.tanggal)}</span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-green-700">
                        {blok ? blok.nama_blok : `Blok ID ${item.blok_id}`}
                      </td>
                      <td className="py-3.5 px-6 text-slate-800">
                        {petugas ? petugas.nama_petugas : `Petugas ID ${item.petugas_id}`}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        {item.jumlah_janjang}
                      </td>
                      <td className="py-3.5 px-6 font-extrabold text-green-800">
                        {formatRibuan(item.berat_kg)}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('Yakin ingin menghapus data panen ini?')) {
                                onDelete(item.id);
                              }
                            }}
                            className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data Hasil Panen TBS' : 'Tambah Data Hasil Panen TBS'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Panen
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Blok Kebun
            </label>
            <select
              value={blokId}
              onChange={(e) => setBlokId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              {blokKebun.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama_blok} ({b.luas_ha} Ha - {b.lokasi})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Petugas Pemanen
            </label>
            <select
              value={petugasId}
              onChange={(e) => setPetugasId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              {petugasPanen.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_petugas} ({p.alamat})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah TBS (Janjang)
            </label>
            <input
              type="number"
              required
              placeholder="Contoh: 120"
              value={jumlahJanjang}
              onChange={(e) => setJumlahJanjang(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Berat Timbangan (Kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Contoh: 1850"
              value={beratKg}
              onChange={(e) => setBeratKg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded shadow"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
