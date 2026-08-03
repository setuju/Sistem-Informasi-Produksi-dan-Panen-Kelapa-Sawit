import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import plantationImg from '../assets/images/oil_palm_plantation_1785765864473.jpg';

interface LoginProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputUser = username.trim().toLowerCase();
    
    // Check in existing user list
    let foundUser = users.find(
      (u) => u.username.toLowerCase() === inputUser
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
      return;
    }

    // Fallback role resolution for standard user prompt usernames
    if (inputUser === 'admin') {
      foundUser = { id: 1, username: 'admin', nama_lengkap: 'Administrator Utama', role: 'Admin' };
    } else if (inputUser === 'manajer') {
      foundUser = { id: 2, username: 'manajer', nama_lengkap: 'Bapak Ir. Hendra Suputra', role: 'Manajer' };
    } else if (inputUser === 'mandor' || inputUser === 'mandor1') {
      foundUser = { id: 3, username: 'mandor1', nama_lengkap: 'Rahmat Hidayat', role: 'Mandor' };
    }

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      // Default fallback
      const demoUser: User = {
        id: Date.now(),
        username: username,
        nama_lengkap: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'Admin'
      };
      onLoginSuccess(demoUser);
    }
  };

  const handleQuickLogin = (roleKey: 'admin' | 'manajer' | 'mandor') => {
    if (roleKey === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      const target = users.find((u) => u.role === 'Admin') || { id: 1, username: 'admin', nama_lengkap: 'Administrator Utama', role: 'Admin' };
      onLoginSuccess(target as User);
    } else if (roleKey === 'manajer') {
      setUsername('manajer');
      setPassword('manajer123');
      const target = users.find((u) => u.role === 'Manajer') || { id: 2, username: 'manajer', nama_lengkap: 'Bapak Ir. Hendra Suputra', role: 'Manajer' };
      onLoginSuccess(target as User);
    } else if (roleKey === 'mandor') {
      setUsername('mandor');
      setPassword('mandor123');
      const target = users.find((u) => u.role === 'Mandor') || { id: 3, username: 'mandor1', nama_lengkap: 'Rahmat Hidayat', role: 'Mandor' };
      onLoginSuccess(target as User);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        
        {/* LEFT COLUMN: OIL PALM PLANTATION IMAGE */}
        <div className="relative bg-emerald-950 flex flex-col justify-end p-8 text-white min-h-[360px] md:min-h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('${plantationImg}')`,
              filter: 'brightness(0.9) contrast(1.05)'
            }}
          />
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md inline-block uppercase tracking-wider">
              Sipare Pare Estate
            </span>
            <h2 className="text-2xl font-black text-white leading-tight">
              PT. Moies Perkebunan Sipare Pare
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
              Sistem Informasi Pengelolaan Produksi & Pendukung Keputusan (DSS) Hasil Panen Sawit
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* BRAND HEADINGS */}
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-lg sm:text-xl font-black text-emerald-800 uppercase tracking-wide leading-snug">
                SISTEM INFORMASI<br />PRODUKSI DAN PANEN<br />KELAPA SAWIT
              </h1>
              <p className="text-xs font-bold text-slate-500 mt-2 tracking-wider">
                PT. Moies Perkebunan Sipare Pare
              </p>
            </div>

            <h2 className="text-base font-bold text-slate-800 mb-4">Akses Sistem (3 Role)</h2>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-lg">
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
                    placeholder="Masukkan username (admin, manajer, mandor)"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors text-sm uppercase tracking-wide mt-2"
              >
                Login Sistem
              </button>
            </form>

            {/* DEMO QUICK ACCOUNTS */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Simulasi Login Pengguna (Klik Cepat Role):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs py-2 px-1 rounded-lg font-bold border border-slate-200 text-center transition-colors"
                >
                  👑 Admin<br />
                  <span className="text-[10px] text-slate-500 font-normal">admin123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('manajer')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs py-2 px-1 rounded-lg font-bold border border-emerald-200 text-center transition-colors"
                >
                  👔 Manajer<br />
                  <span className="text-[10px] text-emerald-700 font-normal">manajer123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('mandor')}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs py-2 px-1 rounded-lg font-bold border border-amber-200 text-center transition-colors"
                >
                  👷 Mandor<br />
                  <span className="text-[10px] text-amber-700 font-normal">mandor123</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            © 2024 PT. Moies Perkebunan Sipare Pare
          </div>
        </div>

      </div>
    </div>
  );
};
