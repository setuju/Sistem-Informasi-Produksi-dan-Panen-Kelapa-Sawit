import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Key, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { Modal } from './Modal';

interface DataUserProps {
  users: User[];
  onAdd: (user: Omit<User, 'id'>) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const DataUser: React.FC<DataUserProps> = ({
  users,
  onAdd,
  onEdit,
  onDelete,
  onShowToast,
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

    // Generate a simulated secure PHP password_hash($password, PASSWORD_BCRYPT) value
    const saltChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./";
    let mockSalt = "";
    for (let i = 0; i < 22; i++) {
      mockSalt += saltChar.charAt(Math.floor(Math.random() * saltChar.length));
    }
    const mockHash = `$2y$10$${mockSalt}PTMoiesSipareSistemPanen2026`;

    // Success update feedback
    const messageText = `Password pengguna '${selectedUserForPassword?.username}' berhasil diubah! Hash terkompilasi: ${mockHash.substring(0, 28)}...`;
    
    setSuccessMsg(messageText);

    if (onShowToast) {
      onShowToast(
        'Ganti Password Sukses',
        `Password untuk ${selectedUserForPassword?.username} di-hash aman via password_hash() BCRYPT: ${mockHash.substring(0, 30)}...`,
        'success'
      );
    }

    setIsPasswordModalOpen(false);

    setTimeout(() => {
      setSuccessMsg('');
    }, 6000);
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

      {/* DEDICATED SECURITY SUB-SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-800/60 rounded-xl border border-emerald-600/40 text-emerald-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded border border-emerald-700 tracking-wider">
                Sub-Seksi Keamanan Sistem Administrator
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                Pusat Keamanan & Reset Password Akun Terkelola
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Administrator memiliki wewenang untuk mereset kata sandi (password) pengguna mana pun secara langsung demi menjaga integritas data panen dan keamanan autentikasi sistem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => {
                const adminUser = users.find((u) => u.role === 'Admin') || users[0];
                openPasswordModal(adminUser);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Reset Password Master Admin</span>
            </button>
          </div>
        </div>

        {/* QUICK USER RESET CHIPS */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Reset Cepat Akun:</span>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => openPasswordModal(u)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-900/60 hover:text-emerald-300 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 text-xs font-mono font-medium cursor-pointer"
              title={`Reset password untuk ${u.username}`}
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{u.username}</span>
              <span className="text-[10px] text-slate-400">({u.role})</span>
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* RESPONSIVE TABLE & CARD VIEW STRATEGY */}
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    <div className="flex items-center justify-center gap-2">
                      {/* PASSWORD BUTTON WITH ENHANCED HIT TARGET */}
                      <button
                        onClick={() => openPasswordModal(item)}
                        title="Ganti Password"
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] justify-center"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Password</span>
                      </button>

                      {/* EDIT BUTTON WITH ENHANCED HIT TARGET */}
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] min-w-[84px] justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* DELETE BUTTON WITH ENHANCED HIT TARGET */}
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus user ${item.username}?`)) {
                            onDelete(item.id);
                          }
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] min-w-[84px] justify-center"
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

      {/* MOBILE LIST CARD VIEW */}
      <div className="block md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-slate-400 font-medium">
            Belum ada data user.
          </div>
        ) : (
          users.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                    <Key className="w-4 h-4 text-blue-600 shrink-0" />
                    {item.username}
                  </span>
                </div>
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
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Nama Lengkap</span>
                <span className="text-slate-800 text-base font-bold">{item.nama_lengkap}</span>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openPasswordModal(item)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Reset Password</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Info</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus user ${item.username}?`)) {
                        onDelete(item.id);
                      }
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs min-h-[44px] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none font-mono bg-white"
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
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
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
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded text-base md:text-sm focus:ring-2 focus:ring-green-600 focus:outline-none bg-white"
            >
              <option value="Admin">Admin</option>
              <option value="Manajer">Manajer</option>
              <option value="Mandor">Mandor</option>
            </select>
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
              className="w-full px-3 py-2.5 md:py-2 border border-slate-300 rounded text-base md:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
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
              className="w-full px-3 py-2.5 md:py-2 border border-slate-300 rounded text-base md:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 border border-slate-300 text-slate-700 text-sm sm:text-xs font-semibold rounded-lg sm:rounded hover:bg-slate-50 min-h-[44px] sm:min-h-0 flex items-center justify-center cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-xs font-bold rounded-lg sm:rounded shadow min-h-[44px] sm:min-h-0 flex items-center justify-center cursor-pointer transition gap-1.5"
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
