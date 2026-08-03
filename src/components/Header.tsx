import React from 'react';
import { LogOut, FileCode } from 'lucide-react';
import { User, ActivePage } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const PAGE_TITLES: Record<ActivePage, string> = {
  dashboard: 'Dashboard Overview',
  'data-user': 'Pengelolaan User',
  'data-blok': 'Data Blok Kebun',
  'data-petugas': 'Data Petugas Panen',
  'data-mandor': 'Data Mandor Lapangan',
  'data-jadwal': 'Jadwal Panen',
  'hasil-panen': 'Hasil Panen (TBS)',
  brondolan: 'Data Brondolan',
  'pesan-tugas': 'Pesan & Verifikasi Tugas Mandor',
  'laporan-produksi': 'Laporan Produksi',
  'analisis-dss': 'Analisis Keputusan (DSS)',
  'kode-ooad-sql': 'Kode PHP Native MVC & database.sql',
  login: 'Login Sistem'
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activePage,
  setActivePage
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-40">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
        <span>Main</span>
        <span>/</span>
        <span className="font-semibold text-emerald-700">
          {PAGE_TITLES[activePage] || 'Dashboard Overview'}
        </span>
      </div>

      {/* ACTIONS & USER PROFILE */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={() => setActivePage('kode-ooad-sql')}
          className="hidden lg:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-semibold border border-emerald-200 transition-colors"
          title="Lihat Kode PHP Native MVC & database.sql"
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>Struktur SQL & PHP MVC</span>
        </button>

        <div className="text-xs font-medium text-slate-500 hidden sm:block border-l border-slate-200 pl-4">
          {currentDateFormatted}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800">
              {currentUser ? currentUser.nama_lengkap || currentUser.username : 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 capitalize">
              {currentUser?.role || 'Admin'}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition-colors"
            title="Keluar dari Sistem"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

