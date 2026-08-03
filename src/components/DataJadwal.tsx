import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { JadwalPanen, BlokKebun, Mandor } from '../types';
import { Modal } from './Modal';
import { formatTanggalIndo } from '../utils/dssEngine';

interface DataJadwalProps {
  jadwalPanen: JadwalPanen[];
  blokKebun: BlokKebun[];
  mandorList: Mandor[];
  onAdd: (jadwal: Omit<JadwalPanen, 'id'>) => void;
  onEdit: (jadwal: JadwalPanen) => void;
  onDelete: (id: number) => void;
}

export const DataJadwal: React.FC<DataJadwalProps> = ({
  jadwalPanen,
  blokKebun,
  mandorList,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalPanen | null>(null);

  const [tanggal, setTanggal] = useState('2024-05-18');
  const [blokId, setBlokId] = useState<number>(blokKebun[0]?.id || 1);
  const [mandorId, setMandorId] = useState<number>(mandorList[0]?.id || 1);
  const [keterangan, setKeterangan] = useState('Panen Rutin');

  const openAddModal = () => {
    setEditingJadwal(null);
    setTanggal('2024-05-18');
    setBlokId(blokKebun[0]?.id || 1);
    setMandorId(mandorList[0]?.id || 1);
    setKeterangan('Panen Rutin');
    setIsModalOpen(true);
  };

  const openEditModal = (jadwal: JadwalPanen) => {
    setEditingJadwal(jadwal);
    setTanggal(jadwal.tanggal);
    setBlokId(jadwal.blok_id);
    setMandorId(jadwal.mandor_id);
    setKeterangan(jadwal.keterangan);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !blokId || !mandorId) return;

    if (editingJadwal) {
      onEdit({
        ...editingJadwal,
        tanggal,
        blok_id: Number(blokId),
        mandor_id: Number(mandorId),
        keterangan,
      });
    } else {
      onAdd({
        tanggal,
        blok_id: Number(blokId),
        mandor_id: Number(mandorId),
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
            Jadwal Panen
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Penetapan Penjadwalan Sesi Panen Blok Kebun & Penugasan Mandor
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
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
                <th className="py-3.5 px-6">Mandor</th>
                <th className="py-3.5 px-6">Keterangan</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {jadwalPanen.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data jadwal panen.
                  </td>
                </tr>
              ) : (
                jadwalPanen.map((item, index) => {
                  const blok = blokKebun.find((b) => b.id === item.blok_id);
                  const mandor = mandorList.find((m) => m.id === item.mandor_id);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{formatTanggalIndo(item.tanggal)}</span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-green-700">
                        {blok ? blok.nama_blok : `Blok ID ${item.blok_id}`}
                      </td>
                      <td className="py-3.5 px-6 text-slate-800 font-medium">
                        {mandor ? mandor.nama_mandor : `Mandor ID ${item.mandor_id}`}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">{item.keterangan}</td>
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
                              if (confirm('Yakin ingin menghapus jadwal panen ini?')) {
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
        title={editingJadwal ? 'Edit Jadwal Panen' : 'Tambah Jadwal Panen Baru'}
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
              Pilih Mandor Penanggung Jawab
            </label>
            <select
              value={mandorId}
              onChange={(e) => setMandorId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              {mandorList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama_mandor} ({m.wilayah})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Panen Rutin"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
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
