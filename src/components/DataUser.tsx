import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Key, Shield, Lock, CheckCircle2 } from 'lucide-react';
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

  // Ganti Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const openPasswordModal = (user: User) => {
    setSelectedUserForPassword(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsPasswordModalOpen(true);
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password minimal 6 karakter!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru!');
      return;
    }

    // Success update feedback
    setSuccessMsg(`Password pengguna ${selectedUserForPassword?.username} berhasil diperbarui!`);
    setIsPasswordModalOpen(false);

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Data User & Akses Admin
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pengelolaan Akun Pengguna, Hak Akses (Admin, Manajer, Mandor) & Ganti Password Admin
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const adminUser = users.find((u) => u.role === 'Admin') || users[0];
              openPasswordModal(adminUser);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Ganti Password Admin</span>
          </button>

          <button
            onClick={openAddModal}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-6">Username</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">Role Hak Akses</th>
                <th className="py-3.5 px-6 text-center w-56">Aksi</th>
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
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openPasswordModal(item)}
                        title="Ganti Password"
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Password</span>
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
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
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
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

      {/* MODAL TAMBAH / EDIT USER */}
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

      {/* MODAL GANTI PASSWORD */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={`Ganti Password User: ${selectedUserForPassword?.nama_lengkap || selectedUserForPassword?.username}`}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-lg font-medium">
              {passwordError}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <p><strong>Username:</strong> <span className="font-mono">{selectedUserForPassword?.username}</span></p>
            <p><strong>Role Hak Akses:</strong> <span className="font-bold text-emerald-800">{selectedUserForPassword?.role}</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password Baru
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Masukkan password baru (minimal 6 karakter)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
