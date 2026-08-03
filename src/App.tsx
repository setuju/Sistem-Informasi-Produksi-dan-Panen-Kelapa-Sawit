import React, { useState, useMemo } from 'react';
import { 
  User, 
  BlokKebun, 
  PetugasPanen, 
  Mandor, 
  JadwalPanen, 
  HasilPanenTBS, 
  Brondolan, 
  Message,
  Task,
  ActivePage 
} from './types';
import { 
  initialUsers, 
  initialBlokKebun, 
  initialPetugasPanen, 
  initialMandor, 
  initialJadwalPanen, 
  initialHasilPanenTBS, 
  initialBrondolan,
  initialMessages,
  initialTasks
} from './data/initialData';
import { analyzeHarvestDrop } from './utils/dssEngine';

import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DataUser } from './components/DataUser';
import { DataBlok } from './components/DataBlok';
import { DataPetugas } from './components/DataPetugas';
import { DataMandor } from './components/DataMandor';
import { DataJadwal } from './components/DataJadwal';
import { DataHasilPanen } from './components/DataHasilPanen';
import { DataBrondolan } from './components/DataBrondolan';
import { LaporanProduksi } from './components/LaporanProduksi';
import { AnalisisDSS } from './components/AnalisisDSS';
import { PesanDanTugas } from './components/PesanDanTugas';
import { PhpMvcCodeViewer } from './components/PhpMvcCodeViewer';

export default function App() {
  // State Autentikasi Pengguna (Default: unauthenticated / Landing Page Login)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State Data Master & Transaksi
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [blokKebun, setBlokKebun] = useState<BlokKebun[]>(initialBlokKebun);
  const [petugasPanen, setPetugasPanen] = useState<PetugasPanen[]>(initialPetugasPanen);
  const [mandorList, setMandorList] = useState<Mandor[]>(initialMandor);
  const [jadwalPanen, setJadwalPanen] = useState<JadwalPanen[]>(initialJadwalPanen);
  const [hasilPanen, setHasilPanen] = useState<HasilPanenTBS[]>(initialHasilPanenTBS);
  const [brondolanList, setBrondolanList] = useState<Brondolan[]>(initialBrondolan);

  // State Pesan & Tugas Mandor
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Custom Manager DSS Note Overrides
  const [dssManagerNotes, setDssManagerNotes] = useState<{ [id: number]: string }>({});
  const [dssStatusOverrides, setDssStatusOverrides] = useState<{ [id: number]: 'Selesai' | 'Proses Evaluasi' }>({});

  // Kalkulasi DSS Analisis Penurunan Panen secara otomatis
  const evaluasiDss = useMemo(() => {
    const rawList = analyzeHarvestDrop(hasilPanen, blokKebun);
    return rawList.map((item) => ({
      ...item,
      catatan_manajer: dssManagerNotes[item.id] !== undefined ? dssManagerNotes[item.id] : item.catatan_manajer,
      status_tindak_lanjut: dssStatusOverrides[item.id] !== undefined ? dssStatusOverrides[item.id] : item.status_tindak_lanjut,
    }));
  }, [hasilPanen, blokKebun, dssManagerNotes, dssStatusOverrides]);

  const criticalDssCount = evaluasiDss.filter(
    (e) => (e.status_peringatan === 'Kritis' || e.status_peringatan === 'Waspada') && e.status_tindak_lanjut !== 'Selesai'
  ).length;

  // Handlers Messages & Tasks
  const handleSendMessage = (msg: Omit<Message, 'id' | 'created_at'>) => {
    const newMsg: Message = {
      ...msg,
      id: Date.now(),
      created_at: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };
    setMessages([newMsg, ...messages]);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'created_at' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTaskStatus = (taskId: number, status: 'pending' | 'done', notes?: string) => {
    setTasks(tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          notes: notes !== undefined ? notes : t.notes,
          verified_at: status === 'done' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  // Handlers CRUD Users
  const handleAddUser = (user: Omit<User, 'id'>) => {
    setUsers([...users, { ...user, id: Date.now() }]);
  };
  const handleEditUser = (user: User) => {
    setUsers(users.map((u) => (u.id === user.id ? user : u)));
  };
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Handlers CRUD Blok
  const handleAddBlok = (blok: Omit<BlokKebun, 'id'>) => {
    setBlokKebun([...blokKebun, { ...blok, id: Date.now() }]);
  };
  const handleEditBlok = (blok: BlokKebun) => {
    setBlokKebun(blokKebun.map((b) => (b.id === blok.id ? blok : b)));
  };
  const handleDeleteBlok = (id: number) => {
    setBlokKebun(blokKebun.filter((b) => b.id !== id));
  };

  // Handlers CRUD Petugas
  const handleAddPetugas = (petugas: Omit<PetugasPanen, 'id'>) => {
    setPetugasPanen([...petugasPanen, { ...petugas, id: Date.now() }]);
  };
  const handleEditPetugas = (petugas: PetugasPanen) => {
    setPetugasPanen(petugasPanen.map((p) => (p.id === petugas.id ? petugas : p)));
  };
  const handleDeletePetugas = (id: number) => {
    setPetugasPanen(petugasPanen.filter((p) => p.id !== id));
  };

  // Handlers CRUD Mandor
  const handleAddMandor = (mandor: Omit<Mandor, 'id'>) => {
    setMandorList([...mandorList, { ...mandor, id: Date.now() }]);
  };
  const handleEditMandor = (mandor: Mandor) => {
    setMandorList(mandorList.map((m) => (m.id === mandor.id ? mandor : m)));
  };
  const handleDeleteMandor = (id: number) => {
    setMandorList(mandorList.filter((m) => m.id !== id));
  };

  // Handlers CRUD Jadwal
  const handleAddJadwal = (jadwal: Omit<JadwalPanen, 'id'>) => {
    setJadwalPanen([...jadwalPanen, { ...jadwal, id: Date.now() }]);
  };
  const handleEditJadwal = (jadwal: JadwalPanen) => {
    setJadwalPanen(jadwalPanen.map((j) => (j.id === jadwal.id ? jadwal : j)));
  };
  const handleDeleteJadwal = (id: number) => {
    setJadwalPanen(jadwalPanen.filter((j) => j.id !== id));
  };

  // Handlers CRUD Hasil Panen TBS
  const handleAddHasilPanen = (data: Omit<HasilPanenTBS, 'id'>) => {
    setHasilPanen([...hasilPanen, { ...data, id: Date.now() }]);
  };
  const handleEditHasilPanen = (data: HasilPanenTBS) => {
    setHasilPanen(hasilPanen.map((h) => (h.id === data.id ? data : h)));
  };
  const handleDeleteHasilPanen = (id: number) => {
    setHasilPanen(hasilPanen.filter((h) => h.id !== id));
  };

  // Handlers CRUD Brondolan
  const handleAddBrondolan = (data: Omit<Brondolan, 'id'>) => {
    setBrondolanList([...brondolanList, { ...data, id: Date.now() }]);
  };
  const handleEditBrondolan = (data: Brondolan) => {
    setBrondolanList(brondolanList.map((b) => (b.id === data.id ? data : b)));
  };
  const handleDeleteBrondolan = (id: number) => {
    setBrondolanList(brondolanList.filter((b) => b.id !== id));
  };

  // DSS Update Handlers
  const handleUpdateDssNote = (id: number, note: string) => {
    setDssManagerNotes((prev) => ({ ...prev, [id]: note }));
  };
  const handleUpdateDssStatus = (id: number, status: 'Selesai' | 'Proses Evaluasi') => {
    setDssStatusOverrides((prev) => ({ ...prev, [id]: status }));
  };

  // Show Login Page if unauthenticated
  if (!currentUser || activePage === 'login') {
    return (
      <Login
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActivePage('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* HEADER UTAMA */}
      <Header
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setActivePage('login');
        }}
        activePage={activePage}
        setActivePage={setActivePage}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* MAIN CONTAINER (SIDEBAR + CONTENT) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR NAVIGASI (DESKTOP + MOBILE DRAWER) */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          dssAlertCount={criticalDssCount}
          currentUser={currentUser}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* CONTENT AREA UTAMA */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activePage === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              blokKebun={blokKebun}
              petugasPanen={petugasPanen}
              hasilPanen={hasilPanen}
              brondolan={brondolanList}
              evaluasiDss={evaluasiDss}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'data-user' && (
            <DataUser
              users={users}
              onAdd={handleAddUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}

          {activePage === 'data-blok' && (
            <DataBlok
              blokKebun={blokKebun}
              onAdd={handleAddBlok}
              onEdit={handleEditBlok}
              onDelete={handleDeleteBlok}
            />
          )}

          {activePage === 'data-petugas' && (
            <DataPetugas
              petugasPanen={petugasPanen}
              onAdd={handleAddPetugas}
              onEdit={handleEditPetugas}
              onDelete={handleDeletePetugas}
            />
          )}

          {activePage === 'data-mandor' && (
            <DataMandor
              mandorList={mandorList}
              onAdd={handleAddMandor}
              onEdit={handleEditMandor}
              onDelete={handleDeleteMandor}
            />
          )}

          {activePage === 'data-jadwal' && (
            <DataJadwal
              jadwalPanen={jadwalPanen}
              blokKebun={blokKebun}
              mandorList={mandorList}
              onAdd={handleAddJadwal}
              onEdit={handleEditJadwal}
              onDelete={handleDeleteJadwal}
            />
          )}

          {activePage === 'hasil-panen' && (
            <DataHasilPanen
              hasilPanen={hasilPanen}
              blokKebun={blokKebun}
              petugasPanen={petugasPanen}
              onAdd={handleAddHasilPanen}
              onEdit={handleEditHasilPanen}
              onDelete={handleDeleteHasilPanen}
            />
          )}

          {activePage === 'brondolan' && (
            <DataBrondolan
              brondolanList={brondolanList}
              blokKebun={blokKebun}
              onAdd={handleAddBrondolan}
              onEdit={handleEditBrondolan}
              onDelete={handleDeleteBrondolan}
            />
          )}

          {activePage === 'pesan-tugas' && (
            <PesanDanTugas
              currentUser={currentUser}
              users={users}
              messages={messages}
              tasks={tasks}
              onSendMessage={handleSendMessage}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activePage === 'laporan-produksi' && (
            <LaporanProduksi
              hasilPanen={hasilPanen}
              brondolanList={brondolanList}
            />
          )}

          {activePage === 'analisis-dss' && (
            <AnalisisDSS
              evaluasiDss={evaluasiDss}
              mandorList={mandorList}
              blokKebun={blokKebun}
              onUpdateNote={handleUpdateDssNote}
              onUpdateStatus={handleUpdateDssStatus}
            />
          )}

          {activePage === 'kode-ooad-sql' && <PhpMvcCodeViewer />}
        </main>
      </div>
    </div>
  );
}
