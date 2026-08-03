import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  HardHat, 
  Calendar, 
  Wheat, 
  Apple, 
  FileSpreadsheet, 
  AlertTriangle, 
  Code2,
  UserCheck,
  MessageSquare,
  X
} from 'lucide-react';
import { ActivePage, User } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  dssAlertCount: number;
  currentUser?: User | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  dssAlertCount,
  currentUser,
  isOpen = false,
  onClose
}) => {
  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    if (onClose) onClose();
  };

  const navItemClass = (page: ActivePage) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
      activePage === page
        ? 'bg-emerald-800 text-white font-semibold shadow-xs'
        : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
    }`;

  const sidebarContent = (
    <aside className="w-64 bg-emerald-900 text-white flex flex-col h-full shrink-0 border-r border-emerald-800 select-none">
      {/* BRAND HEADER */}
      <div className="p-5 border-b border-emerald-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">
            PT. Moies<br />
            <span className="text-emerald-400">Sipare Pare</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1 font-semibold">
            Prod & Harvest System
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* GROUP 1: DATA MASTER */}
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase px-4 pb-2 tracking-wider">
            Data Master
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={navItemClass('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('data-user')}
              className={navItemClass('data-user')}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Data User</span>
            </button>

            <button
              onClick={() => handleNavClick('data-blok')}
              className={navItemClass('data-blok')}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Blok Kebun</span>
            </button>

            <button
              onClick={() => handleNavClick('data-petugas')}
              className={navItemClass('data-petugas')}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Petugas Panen</span>
            </button>

            <button
              onClick={() => handleNavClick('data-mandor')}
              className={navItemClass('data-mandor')}
            >
              <HardHat className="w-4 h-4 text-emerald-400" />
              <span>Mandor Lapangan</span>
            </button>

            <button
              onClick={() => handleNavClick('data-jadwal')}
              className={navItemClass('data-jadwal')}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Jadwal Panen</span>
            </button>
          </div>
        </div>

        {/* GROUP 2: TRANSAKSI */}
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase px-4 pb-2 tracking-wider">
            Transaksi & Tugas
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('hasil-panen')}
              className={navItemClass('hasil-panen')}
            >
              <Wheat className="w-4 h-4 text-emerald-400" />
              <span>Hasil Panen (TBS)</span>
            </button>

            <button
              onClick={() => handleNavClick('brondolan')}
              className={navItemClass('brondolan')}
            >
              <Apple className="w-4 h-4 text-emerald-400" />
              <span>Brondolan</span>
            </button>

            <button
              onClick={() => handleNavClick('pesan-tugas')}
              className={navItemClass('pesan-tugas')}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Pesan & Mandor</span>
            </button>
          </div>
        </div>

        {/* GROUP 3: LAPORAN & DSS */}
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase px-4 pb-2 tracking-wider">
            Laporan & DSS
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('laporan-produksi')}
              className={navItemClass('laporan-produksi')}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Laporan Produksi</span>
            </button>

            <button
              onClick={() => handleNavClick('analisis-dss')}
              className={navItemClass('analisis-dss')}
            >
              <div className="relative">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {dssAlertCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full animate-pulse">
                    {dssAlertCount}
                  </span>
                )}
              </div>
              <span className="flex-1 text-left">Analisis DSS</span>
            </button>

            <button
              onClick={() => handleNavClick('kode-ooad-sql')}
              className={navItemClass('kode-ooad-sql')}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>PHP MVC & SQL</span>
            </button>
          </div>
        </div>
      </nav>

      {/* USER FOOTER CARD */}
      <div className="p-4 border-t border-emerald-800">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800/80">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser ? (currentUser.username || 'AM').substring(0, 2).toUpperCase() : 'AM'}
          </div>
          <div className="text-xs min-w-0 flex-1">
            <p className="font-bold truncate text-white">
              {currentUser?.nama_lengkap || currentUser?.username || 'Admin Manager'}
            </p>
            <p className="opacity-60 text-[10px] capitalize">
              {currentUser?.role || 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* DESKTOP PERSISTENT SIDEBAR */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>

      {/* MOBILE & TABLET SLIDE-OVER DRAWER WITH BACKDROP */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer container */}
          <div className="relative z-10 h-full max-w-xs w-full shadow-2xl transition-transform ease-in-out duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

