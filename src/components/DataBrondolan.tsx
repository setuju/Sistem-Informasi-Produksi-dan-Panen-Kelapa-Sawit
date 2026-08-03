import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Apple } from 'lucide-react';
import { Brondolan, BlokKebun, User } from '../types';
import { Modal } from './Modal';
import { formatRibuan, formatTanggalIndo } from '../utils/dssEngine';

interface DataBrondolanProps {
  brondolanList: Brondolan[];
  blokKebun: BlokKebun[];
  currentUser?: User | null;
  onAdd: (data: Omit<Brondolan, 'id'>) => void;
  onEdit: (data: Brondolan) => void;
  onDelete: (id: number) => void;
}

export const DataBrondolan: React.FC<DataBrondolanProps> = ({
  brondolanList,
  blokKebun,
  currentUser,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const isManajer = currentUser?.role === 'Manajer';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Brondolan | null>(null);

  const [tanggal, setTanggal] = useState('2024-05-18');
  const [blokId, setBlokId] = useState<number>(blokKebun[0]?.id || 1);
  const [jumlahKg, setJumlahKg] = useState('150');
  const [keterangan, setKeterangan] = useState('Brondolan Panen');

  const openAddModal = () => {
    setEditingItem(null);
    setTanggal('2024-05-18');
    setBlokId(blokKebun[0]?.id || 1);
    setJumlahKg('150');
    setKeterangan('Brondolan Panen');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Brondolan) => {
    setEditingItem(item);
    setTanggal(item.tanggal);
    setBlokId(item.blok_id);
    setJumlahKg(item.jumlah_kg.toString());
    setKeterangan(item.keterangan);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !blokId || !jumlahKg) return;

    if (editingItem) {
      onEdit({
        ...editingItem,
        tanggal,
        blok_id: Number(blokId),
        jumlah_kg: parseFloat(jumlahKg),
        keterangan,
      });
    } else {
      onAdd({
        tanggal,
        blok_id: Number(blokId),
        jumlah_kg: parseFloat(jumlahKg),
        keterangan,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Brondolan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pencatatan Hasil Kutipan Buah Lepas / Brondolan Per Kebun
          </p>
        </div>

        {!isManajer ? (
          <button
            onClick={openAddModal}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Brondolan</span>
          </button>
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-lg font-bold">
            Mode Lihat / Monitoring (Manajer)
          </div>
        )}
      </div>

      {/* RESPONSIVE TABLE & CARD VIEW STRATEGY */}
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Tanggal</th>
                <th className="py-3.5 px-6">Blok</th>
                <th className="py-3.5 px-6">Jumlah (Kg)</th>
                <th className="py-3.5 px-6">Keterangan</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {brondolanList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data brondolan.
                  </td>
                </tr>
              ) : (
                brondolanList.map((item, index) => {
                  const blok = blokKebun.find((b) => b.id === item.blok_id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                        <Apple className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{formatTanggalIndo(item.tanggal)}</span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-green-700">
                        {blok ? blok.nama_blok : `Blok ID ${item.blok_id}`}
                      </td>
                      <td className="py-3.5 px-6 font-extrabold text-red-700">
                        {formatRibuan(item.jumlah_kg)}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">{item.keterangan}</td>
                      <td className="py-3.5 px-6 text-center">
                        {!isManajer ? (
                          <div className="flex items-center justify-center gap-2">
                            {/* YELLOW EDIT BUTTON WITH ENHANCED HIT TARGET */}
                            <button
                              onClick={() => openEditModal(item)}
                              className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs px-3.5 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[44px] min-w-[84px] justify-center"
                              title="Edit Brondolan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* RED DELETE BUTTON WITH ENHANCED HIT TARGET */}
                            <button
                              onClick={() => {
                                if (confirm('Yakin ingin menghapus data brondolan ini?')) {
                                  onDelete(item.id);
                                }
                              }}
                              className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs px-3.5 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[44px] min-w-[84px] justify-center"
                              title="Hapus Brondolan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">Read-Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST CARD VIEW */}
      <div className="block md:hidden space-y-4">
        {brondolanList.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-slate-400 font-medium">
            Belum ada data brondolan.
          </div>
        ) : (
          brondolanList.map((item, index) => {
            const blok = blokKebun.find((b) => b.id === item.blok_id);

            return (
              <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                      <Apple className="w-4 h-4 text-red-600 shrink-0" />
                      {formatTanggalIndo(item.tanggal)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Blok Kebun</span>
                    <span className="text-green-700 text-sm font-bold">{blok ? blok.nama_blok : `Blok ID ${item.blok_id}`}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Jumlah Berat</span>
                    <span className="text-red-700 text-sm font-extrabold">{formatRibuan(item.jumlah_kg)} Kg</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Keterangan</span>
                    <span className="text-slate-600 text-sm font-semibold">{item.keterangan}</span>
                  </div>
                </div>
                {!isManajer && (
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Yakin ingin menghapus data brondolan ini?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data Brondolan' : 'Tambah Data Brondolan Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Panen / Kutipan
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Blok Kebun
            </label>
            <select
              value={blokId}
              onChange={(e) => setBlokId(Number(e.target.value))}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
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
              Jumlah Kutipan Brondolan (Kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Contoh: 150"
              value={jumlahKg}
              onChange={(e) => setJumlahKg(e.target.value)}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Brondolan Panen"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 border border-gray-300 text-slate-700 text-sm sm:text-xs font-semibold rounded-lg sm:rounded hover:bg-slate-50 min-h-[44px] sm:min-h-0 flex items-center justify-center cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm sm:text-xs font-bold rounded-lg sm:rounded shadow min-h-[44px] sm:min-h-0 flex items-center justify-center cursor-pointer transition"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
