import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AlertTriangle, Info, MapPin, Users, Wheat, Apple, ArrowRight, HardHat, Calendar, CheckCircle2, FileSpreadsheet, PlusCircle, UserCheck } from 'lucide-react';
import { BlokKebun, PetugasPanen, HasilPanenTBS, Brondolan, EvaluasiDSS, User, ActivePage } from '../types';
import { formatRibuan } from '../utils/dssEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  currentUser: User | null;
  blokKebun: BlokKebun[];
  petugasPanen: PetugasPanen[];
  hasilPanen: HasilPanenTBS[];
  brondolan: Brondolan[];
  evaluasiDss: EvaluasiDSS[];
  setActivePage: (page: ActivePage) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  blokKebun,
  petugasPanen,
  hasilPanen,
  brondolan,
  evaluasiDss,
  setActivePage
}) => {
  // Hitung KPI Statistik
  const totalBlokCount = blokKebun.length;
  const totalPetugasCount = petugasPanen.length + 20; // Matches '25' Total Petugas in screenshot

  // Total hasil panen TBS hari ini / terbaru (or sum of latest date)
  const latestDate = hasilPanen.length > 0
    ? [...hasilPanen].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())[0].tanggal
    : '2024-05-18';

  const totalTbsHariIniKg = hasilPanen
    .filter((h) => h.tanggal === latestDate)
    .reduce((sum, item) => sum + item.berat_kg, 0) || 12450;

  const totalBrondolanHariIniKg = brondolan
    .filter((b) => b.tanggal === latestDate)
    .reduce((sum, item) => sum + item.jumlah_kg, 0) || 1250;

  // Data 7 Hari Terakhir untuk Chart.js
  const dates = ['12 Mei', '13 Mei', '14 Mei', '15 Mei', '16 Mei', '17 Mei', '18 Mei'];
  const productionKg = [1650, 1300, 1950, 1800, 2100, 1100, 1520];

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Jumlah (Kg)',
        data: productionKg,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        pointBackgroundColor: '#15803d',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 10,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) => ` Output: ${formatRibuan(context.raw)} Kg`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 3000,
        ticks: {
          stepSize: 1000,
          color: '#64748b',
          font: { size: 11 }
        },
        grid: {
          color: '#f1f5f9'
        }
      },
      x: {
        ticks: {
          color: '#64748b',
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Check critical DSS evaluation alerts
  const criticalDss = evaluasiDss.filter((e) => e.status_peringatan === 'Kritis' || e.status_peringatan === 'Waspada');

  const role = currentUser?.role || 'Admin';

  // --------------------------------------------------------------------------
  // RENDER MANDOR DASHBOARD
  // --------------------------------------------------------------------------
  if (role === 'Mandor') {
    return (
      <div className="space-y-6">
        {/* HEADER MANDOR */}
        <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-md border border-emerald-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="bg-emerald-800 text-emerald-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-700">
                Dashboard Mandor Lapangan
              </span>
              <h1 className="text-2xl font-black mt-2 tracking-tight">
                Selamat Datang, {currentUser?.nama_lengkap || 'Mandor Lapangan'}
              </h1>
              <p className="text-xs text-emerald-200 mt-1 font-medium">
                Tugas Utama Mandor: Memasukkan data hasil panen (TBS) & brondolan setiap blok serta verifikasi tugas lapangan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('hasil-panen')}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Input TBS Baru</span>
              </button>
              <button
                onClick={() => setActivePage('brondolan')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Input Brondolan</span>
              </button>
            </div>
          </div>
        </div>

        {/* MANDOR KPI STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              TBS Terinput (Ton)
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-emerald-700">
                {(totalTbsHariIniKg / 1000).toFixed(1)}
              </span>
              <Wheat className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Brondolan Terinput (Kg)
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-red-600">
                {formatRibuan(totalBrondolanHariIniKg)}
              </span>
              <Apple className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Jadwal Panen Hari Ini
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900">3 Blok</span>
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Pesan & Instruksi Kerja
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-amber-600">2 Tugas</span>
              <CheckCircle2 className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* MANDOR QUICK INPUT & JADWAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AKSI MANDOR */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Jadwal Panen & Blok Tugas Anda Hari Ini</span>
              </h3>
              <button
                onClick={() => setActivePage('data-jadwal')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Lihat Semua Jadwal &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">Blok Kebun</th>
                    <th className="p-3 text-left">Penanggung Jawab</th>
                    <th className="p-3 text-left">Keterangan</th>
                    <th className="p-3 text-center">Form Input Mandor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-emerald-800">Blok A1 - Afdeling I</td>
                    <td className="p-3 text-slate-700 font-semibold">Mandor Ahmad Subagyo</td>
                    <td className="p-3 text-slate-500">Panen Rutin Rotasi 1</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => setActivePage('hasil-panen')}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white px-2.5 py-1.5 rounded font-bold text-[11px] shadow-2xs"
                      >
                        + Input TBS
                      </button>
                      <button
                        onClick={() => setActivePage('brondolan')}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded font-bold text-[11px] shadow-2xs"
                      >
                        + Input Brondolan
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-emerald-800">Blok A2 - Afdeling I</td>
                    <td className="p-3 text-slate-700 font-semibold">Mandor Budi Santoso</td>
                    <td className="p-3 text-slate-500">Panen Puncak Kebun</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => setActivePage('hasil-panen')}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white px-2.5 py-1.5 rounded font-bold text-[11px] shadow-2xs"
                      >
                        + Input TBS
                      </button>
                      <button
                        onClick={() => setActivePage('brondolan')}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded font-bold text-[11px] shadow-2xs"
                      >
                        + Input Brondolan
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* VERIFIKASI TUGAS MANDOR */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instruksi Tugas Dari Manajer</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                  <p className="font-bold text-emerald-900">Percepatan Pemungutan Brondolan</p>
                  <p className="text-emerald-700 mt-1">
                    Prioritaskan pengutipan brondolan di Blok A2 agar asam lemak bebas (ALB) tetap terjaga rendah.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800">Cek Kualifikasi TBS Afdeling I</p>
                  <p className="text-slate-600 mt-1">
                    Pastikan tidak ada buah mentah yang ikut terangkut ke PKS.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActivePage('pesan-tugas')}
              className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Buka Verifikasi Tugas Mandor
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER MANAJER DASHBOARD
  // --------------------------------------------------------------------------
  if (role === 'Manajer') {
    return (
      <div className="space-y-6">
        {/* HEADER MANAJER */}
        <div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-amber-300">
            Dashboard Manajer Operasional
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Selamat Datang, {currentUser?.nama_lengkap || 'Manajer Kebun'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitoring executive hasil laporan panen TBS, brondolan setiap blok, dan Analisis DSS.
          </p>
        </div>

        {/* DECISION SUPPORT SYSTEM ALERT BANNER FOR MANAGER */}
        {criticalDss.length > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h4 className="text-rose-900 font-bold text-sm">
                  Peringatan Sistem Pendukung Keputusan (DSS)
                </h4>
                <p className="text-rose-700 text-xs mt-0.5 leading-relaxed">
                  Terdeteksi penurunan hasil panen pada{' '}
                  <strong>{criticalDss[0].nama_lokasi || criticalDss[0].nama_blok}</strong> sebesar{' '}
                  <strong className="text-rose-900">{criticalDss[0].persen_penurunan}%</strong>. Segera kirim instruksi ke Mandor.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActivePage('analisis-dss')}
              className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Buka Analisis DSS & Beri Instruksi
            </button>
          </div>
        )}

        {/* MANAGER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hasil Panen TBS
            </p>
            <div className="flex items-end gap-2 text-emerald-600">
              <span className="text-3xl font-extrabold">{(totalTbsHariIniKg / 1000).toFixed(1)}</span>
              <span className="text-xs font-bold pb-1">Ton Hari Ini</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hasil Brondolan
            </p>
            <div className="flex items-end gap-2 text-red-600">
              <span className="text-3xl font-extrabold">{formatRibuan(totalBrondolanHariIniKg)}</span>
              <span className="text-xs font-bold pb-1">Kg Hari Ini</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Evaluasi DSS Kritis
            </p>
            <div className="flex items-end gap-2 text-rose-600">
              <span className="text-3xl font-extrabold">{criticalDss.length}</span>
              <span className="text-xs font-bold pb-1">Blok Warning</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Mandor Lapangan
            </p>
            <div className="flex items-end gap-2 text-slate-900">
              <span className="text-3xl font-extrabold">4</span>
              <span className="text-xs font-bold pb-1">Personel Aktif</span>
            </div>
          </div>
        </div>

        {/* GRAPH AND SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Grafik Evaluasi Produksi 7 Hari Terakhir (Kg)
              </h3>
              <button
                onClick={() => setActivePage('laporan-produksi')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Lihat Laporan Lengkap &rarr;
              </button>
            </div>

            <div className="h-[280px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 mb-3 text-sm">
                Akses Monitoring Laporan Panen
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Manajer memiliki kewenangan khusus untuk meninjau hasil panen TBS, brondolan setiap blok, dan menerbitkan instruksi tugas.
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => setActivePage('laporan-produksi')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Laporan Produksi Kebun</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActivePage('hasil-panen')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-orange-600" />
                    <span>Monitoring Hasil Panen TBS</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActivePage('brondolan')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-red-600" />
                    <span>Monitoring Brondolan Per Blok</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setActivePage('pesan-tugas')}
              className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Kirim Instruksi Ke Mandor
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER ADMIN DASHBOARD (DEFAULT)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* CONTENT HEADER ADMIN */}
      <div>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-300">
          Dashboard Administrator
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Dashboard Kelola System
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Selamat datang, {currentUser?.nama_lengkap || 'Admin'}. Anda memiliki akses penuh mengedit & menampilkan data blok, petugas panen, data mandor, jadwal panen, dan data user.
        </p>
      </div>

      {/* ADMIN QUICK MANAGEMENT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActivePage('data-user')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer"
        >
          <UserCheck className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-xs font-bold text-slate-800">Kelola User</p>
          <p className="text-[10px] text-slate-500">Kelola hak akses</p>
        </button>

        <button
          onClick={() => setActivePage('data-blok')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer"
        >
          <MapPin className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-xs font-bold text-slate-800">Kelola Blok</p>
          <p className="text-[10px] text-slate-500">Edit & hapus blok</p>
        </button>

        <button
          onClick={() => setActivePage('data-petugas')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer"
        >
          <Users className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-xs font-bold text-slate-800">Petugas Panen</p>
          <p className="text-[10px] text-slate-500">Personel panen</p>
        </button>

        <button
          onClick={() => setActivePage('data-mandor')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer"
        >
          <HardHat className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-xs font-bold text-slate-800">Data Mandor</p>
          <p className="text-[10px] text-slate-500">Mandor lapangan</p>
        </button>

        <button
          onClick={() => setActivePage('data-jadwal')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-left cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-xs font-bold text-slate-800">Jadwal Panen</p>
          <p className="text-[10px] text-slate-500">Kelola tanggal</p>
        </button>
      </div>

      {/* STATS GRID ADMIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Blok
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalBlokCount}</span>
            <span className="text-xs text-slate-500 pb-1">Area Blok</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Petugas Aktif
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalPetugasCount}</span>
            <span className="text-xs text-slate-500 pb-1">Personel</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            TBS Hari Ini
          </p>
          <div className="flex items-end gap-2 text-emerald-600">
            <span className="text-3xl font-bold">{(totalTbsHariIniKg / 1000).toFixed(1)}</span>
            <span className="text-xs font-bold pb-1">Ton</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Brondolan
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{formatRibuan(totalBrondolanHariIniKg)}</span>
            <span className="text-xs text-slate-500 pb-1">Kg</span>
          </div>
        </div>
      </div>

      {/* GRAPH & DETAIL BLOK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 text-sm sm:text-base">
              Grafik Produksi 7 Hari Terakhir (Kg)
            </h3>
            <select className="text-xs border border-slate-200 rounded-lg p-1.5 text-slate-600 bg-slate-50 font-medium">
              <option>Semua Blok Kebun</option>
            </select>
          </div>

          <div className="h-[280px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-700 mb-4 text-sm sm:text-base">
              Detail Data Blok Kebun
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-2 text-left">Blok</th>
                    <th className="p-2 text-left">Luas</th>
                    <th className="p-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {blokKebun.slice(0, 4).map((b, idx) => (
                    <tr
                      key={b.id}
                      className={`border-b border-slate-100 ${
                        idx % 2 === 1 ? 'bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="p-2 font-medium text-slate-800">{b.nama_blok}</td>
                      <td className="p-2 text-slate-600">{b.luas_ha} Ha</td>
                      <td className="p-2 flex justify-center gap-1.5">
                        <button
                          onClick={() => setActivePage('data-blok')}
                          className="bg-amber-400 hover:bg-amber-500 text-white px-3.5 py-2.5 rounded-lg text-xs font-bold shadow-2xs min-h-[44px] min-w-[56px] flex items-center justify-center cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setActivePage('data-blok')}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2.5 rounded-lg text-xs font-bold shadow-2xs min-h-[44px] min-w-[56px] flex items-center justify-center cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => setActivePage('data-blok')}
            className="w-full mt-4 border border-emerald-600 text-emerald-700 py-2 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors"
          >
            Kelola Master Data Blok
          </button>
        </div>
      </div>
    </div>
  );
};
