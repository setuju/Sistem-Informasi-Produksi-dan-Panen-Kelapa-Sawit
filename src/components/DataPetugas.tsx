import React, { useState } from 'react';
import { Plus, Edit2, Trash2, UserCheck } from 'lucide-react';
import { PetugasPanen } from '../types';
import { Modal } from './Modal';

interface DataPetugasProps {
  petugasPanen: PetugasPanen[];
  onAdd: (petugas: Omit<PetugasPanen, 'id'>) => void;
  onEdit: (petugas: PetugasPanen) => void;
  onDelete: (id: number) => void;
}

export const DataPetugas: React.FC<DataPetugasProps> = ({
  petugasPanen,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState<PetugasPanen | null>(null);

  const [namaPetugas, setNamaPetugas] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');

  const openAddModal = () => {
    setEditingPetugas(null);
    setNamaPetugas('');
    setAlamat('');
    setNoHp('');
    setIsModalOpen(true);
  };

  const openEditModal = (petugas: PetugasPanen) => {
    setEditingPetugas(petugas);
    setNamaPetugas(petugas.nama_petugas);
    setAlamat(petugas.alamat);
    setNoHp(petugas.no_hp);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPetugas || !alamat || !noHp) return;

    if (editingPetugas) {
      onEdit({
        ...editingPetugas,
        nama_petugas: namaPetugas,
        alamat: alamat,
        no_hp: noHp,
      });
    } else {
      onAdd({
        nama_petugas: namaPetugas,
        alamat: alamat,
        no_hp: noHp,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Data Petugas Panen
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola Pekerja & Tenaga Pemanen Lapangan Perkebunan
          </p>
        </div>

        {/* GREEN ADD BUTTON EXACTLY MATCHING SCREENSHOT */}
        <button
          onClick={openAddModal}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Petugas</span>
        </button>
      </div>

      {/* DATA TABLE MATCHING SCREENSHOT 4 EXACTLY */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Nama Petugas</th>
                <th className="py-3.5 px-6">Alamat</th>
                <th className="py-3.5 px-6">No. HP</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {petugasPanen.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data petugas panen.
                  </td>
                </tr>
              ) : (
                petugasPanen.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{item.nama_petugas}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700">{item.alamat}</td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-700">{item.no_hp}</td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* YELLOW EDIT BUTTON */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* RED DELETE BUTTON */}
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus ${item.nama_petugas}?`)) {
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD / EDIT PETUGAS */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPetugas ? 'Edit Data Petugas Panen' : 'Tambah Petugas Panen Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Petugas
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Andi Saputra"
              value={namaPetugas}
              onChange={(e) => setNamaPetugas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Domisili
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Indrapura"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Handphone / WhatsApp
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 081234567890"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
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
