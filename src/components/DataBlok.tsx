import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { BlokKebun } from '../types';
import { Modal } from './Modal';

interface DataBlokProps {
  blokKebun: BlokKebun[];
  onAdd: (blok: Omit<BlokKebun, 'id'>) => void;
  onEdit: (blok: BlokKebun) => void;
  onDelete: (id: number) => void;
}

export const DataBlok: React.FC<DataBlokProps> = ({
  blokKebun,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlok, setEditingBlok] = useState<BlokKebun | null>(null);

  const [namaBlok, setNamaBlok] = useState('');
  const [luasHa, setLuasHa] = useState('');
  const [lokasi, setLokasi] = useState('');

  const openAddModal = () => {
    setEditingBlok(null);
    setNamaBlok('');
    setLuasHa('');
    setLokasi('');
    setIsModalOpen(true);
  };

  const openEditModal = (blok: BlokKebun) => {
    setEditingBlok(blok);
    setNamaBlok(blok.nama_blok);
    setLuasHa(blok.luas_ha.toString());
    setLokasi(blok.lokasi);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBlok || !luasHa || !lokasi) return;

    if (editingBlok) {
      onEdit({
        ...editingBlok,
        nama_blok: namaBlok,
        luas_ha: parseFloat(luasHa),
        lokasi: lokasi,
      });
    } else {
      onAdd({
        nama_blok: namaBlok,
        luas_ha: parseFloat(luasHa),
        lokasi: lokasi,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Data Blok Kebun
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pengelolaan Master Data Area & Blok Kebun Kelapa Sawit
          </p>
        </div>

        {/* GREEN ADD BUTTON EXACTLY MATCHING SCREENSHOT */}
        <button
          onClick={openAddModal}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Blok</span>
        </button>
      </div>

      {/* RESPONSIVE TABLE & CARD VIEW STRATEGY */}
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Nama Blok</th>
                <th className="py-3.5 px-6">Luas (Ha)</th>
                <th className="py-3.5 px-6">Lokasi</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {blokKebun.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data blok kebun.
                  </td>
                </tr>
              ) : (
                blokKebun.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                      <span>{item.nama_blok}</span>
                    </td>
                    <td className="py-3.5 px-6">{item.luas_ha}</td>
                    <td className="py-3.5 px-6 text-slate-700">{item.lokasi}</td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* YELLOW EDIT BUTTON WITH ENHANCED HIT TARGET */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs px-3.5 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[44px] min-w-[84px] justify-center"
                          title="Edit Blok"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* RED DELETE BUTTON WITH ENHANCED HIT TARGET */}
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus ${item.nama_blok}?`)) {
                              onDelete(item.id);
                            }
                          }}
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs px-3.5 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[44px] min-w-[84px] justify-center"
                          title="Hapus Blok"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST CARD VIEW */}
      <div className="block md:hidden space-y-4">
        {blokKebun.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-slate-400 font-medium">
            Belum ada data blok kebun.
          </div>
        ) : (
          blokKebun.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                    {item.nama_blok}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Luas Area</span>
                  <span className="text-slate-800 text-sm font-bold">{item.luas_ha} Ha</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Lokasi / Afdeling</span>
                  <span className="text-slate-800 text-sm font-bold">{item.lokasi}</span>
                </div>
              </div>
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
                    if (confirm(`Yakin ingin menghapus ${item.nama_blok}?`)) {
                      onDelete(item.id);
                    }
                  }}
                  className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ADD / EDIT BLOK */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlok ? 'Edit Data Blok Kebun' : 'Tambah Blok Kebun Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Blok
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Blok A1"
              value={namaBlok}
              onChange={(e) => setNamaBlok(e.target.value)}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Luas Area (Hektar / Ha)
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Contoh: 45"
              value={luasHa}
              onChange={(e) => setLuasHa(e.target.value)}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lokasi / Afdeling
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Afdeling 1"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
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
