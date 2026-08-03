import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      // Allow demo login fallback if custom credentials entered
      const demoUser: User = {
        id: Date.now(),
        username: username,
        nama_lengkap: username === 'manajer' ? 'Bapak Ir. Hendra Suputra' : 'Petugas Sipare Pare',
        role: username === 'manajer' ? 'Manajer' : 'Admin'
      };
      onLoginSuccess(demoUser);
    }
  };

  const handleQuickLogin = (roleUser: string) => {
    const target = users.find((u) => u.username === roleUser) || users[0];
    setUsername(target.username);
    setPassword('123456');
    onLoginSuccess(target);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-gray-200">
        
        {/* LEFT COLUMN: OIL PALM PLANTATION IMAGE */}
        <div className="relative bg-emerald-950 flex flex-col justify-end p-8 text-white min-h-[360px] md:min-h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('/src/assets/images/oil_palm_plantation_1785765864473.jpg')`,
              filter: 'brightness(0.9) contrast(1.05)'
            }}
          />
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="bg-green-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded inline-block uppercase tracking-wider">
              Sipare Pare Estate
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              PT. Moies Perkebunan Sipare Pare
            </h2>
            <p className="text-sm text-green-100/90 font-light">
              Sistem Informasi Pengelolaan Produksi & Pendukung Keputusan (DSS) Hasil Panen Sawit
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* BRAND HEADINGS */}
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-lg sm:text-xl font-black text-[#15803d] uppercase tracking-wide leading-snug">
                SISTEM INFORMASI<br />PRODUKSI DAN PANEN<br />KELAPA SAWIT
              </h1>
              <p className="text-xs font-bold text-slate-600 mt-2 tracking-wider">
                PT. Moies Perkebunan Sipare Pare
              </p>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-4">Login</h2>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2.5 rounded shadow transition-colors text-sm uppercase tracking-wide mt-2"
              >
                Login
              </button>
            </form>

            {/* DEMO QUICK ACCOUNTS */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Simulasi Login Pengguna (Klik Cepat):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded font-medium border border-slate-200 transition"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('manajer')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-medium border border-emerald-200 transition"
                >
                  👔 Manajer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('mandor1')}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-medium border border-amber-200 transition"
                >
                  👷 Mandor
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            © 2024 PT. Moies Perkebunan Sipare Pare
          </div>
        </div>

      </div>
    </div>
  );
};
