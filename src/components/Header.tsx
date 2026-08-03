import React from 'react';
import { LogOut, FileCode, Menu } from 'lucide-react';
import { User, ActivePage } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onToggleMobileSidebar?: () => void;
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
  setActivePage,
  onToggleMobileSidebar
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-40 shadow-xs">
      {/* LEFT: HAMBURGER (MOBILE/TABLET) + BREADCRUMB */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none transition-colors"
          title="Buka Navigasi System"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium truncate">
          <span className="hidden sm:inline">Main</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-bold text-emerald-800 truncate">
            {PAGE_TITLES[activePage] || 'Dashboard Overview'}
          </span>
        </div>
      </div>

      {/* RIGHT: ACTIONS & USER PROFILE */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={() => setActivePage('kode-ooad-sql')}
          className="hidden xl:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-semibold border border-emerald-200 transition-colors"
          title="Lihat Kode PHP Native MVC & database.sql"
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>Struktur PHP & SQL</span>
        </button>

        <div className="text-xs font-medium text-slate-500 hidden md:block border-l border-slate-200 pl-3">
          {currentDateFormatted}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
              {currentUser ? currentUser.nama_lengkap || currentUser.username : 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 capitalize">
              {currentUser?.role || 'Admin'}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
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

