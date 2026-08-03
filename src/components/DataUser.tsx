import React, { useState } from 'react';
import { Plus, Edit2, Trash2, UserCheck, Key, Shield } from 'lucide-react';
import { User } from '../types';
import { Modal } from './Modal';

interface DataUserProps {
  users: User[];
  onAdd: (user: Omit<User, 'id'>) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const DataUser: React.FC<DataUserProps> = ({
  users,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manajer' | 'Mandor'>('Admin');

  const openAddModal = () => {
    setEditingUser(null);
    setUsername('');
    setNamaLengkap('');
    setRole('Admin');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setNamaLengkap(user.nama_lengkap);
    setRole(user.role);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !namaLengkap) return;

    if (editingUser) {
      onEdit({
        ...editingUser,
        username,
        nama_lengkap: namaLengkap,
        role,
      });
    } else {
      onAdd({
        username,
        nama_lengkap: namaLengkap,
        role,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Data User
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pengelolaan Akun Pengguna & Hak Akses Sistem (Admin, Manajer, Mandor)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Username</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">Role Hak Akses</th>
                <th className="py-3.5 px-6 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {users.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item.username}</span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {item.nama_lengkap}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                        item.role === 'Manajer'
                          ? 'bg-purple-100 text-purple-800'
                          : item.role === 'Mandor'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {item.role}
                    </span>
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
                          if (confirm(`Yakin ingin menghapus user ${item.username}?`)) {
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Data User' : 'Tambah User Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Administrator Utama"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role Hak Akses
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'Admin' | 'Manajer' | 'Mandor')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Manajer">Manajer</option>
              <option value="Mandor">Mandor</option>
            </select>
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
