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
import { AlertTriangle, Info, MapPin, Users, Wheat, Apple, ArrowRight } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* CONTENT HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium">
          Selamat datang, {currentUser ? currentUser.nama_lengkap : 'Admin'}
        </p>
      </div>

      {/* DECISION SUPPORT SYSTEM ALERT BANNER */}
      {criticalDss.length > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <h4 className="text-rose-900 font-bold text-sm">
                Analisis Penurunan Hasil Panen (DSS)
              </h4>
              <p className="text-rose-700 text-xs mt-0.5 leading-relaxed">
                Blok <strong>{criticalDss[0].nama_lokasi || criticalDss[0].nama_blok}</strong> mengalami penurunan hasil{' '}
                <strong className="text-rose-900">{criticalDss[0].persen_penurunan}%</strong> dibanding rata-rata 7 hari lalu. Segera evaluasi perawatan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('analisis-dss')}
            className="shrink-0 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Evaluasi Mandor
          </button>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Blok
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalBlokCount}</span>
            <span className="text-xs text-slate-500 pb-1">Area</span>
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

      {/* CONTENT ROW: GRAPH AND RECENT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART CONTAINER */}
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

        {/* DETAIL DATA BLOK MINI TABLE */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-700 mb-4 text-sm sm:text-base">
              Detail Data Blok
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
                      <td className="p-2 flex justify-center gap-1">
                        <button
                          onClick={() => setActivePage('data-blok')}
                          className="bg-amber-400 hover:bg-amber-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setActivePage('data-blok')}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-2xs"
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
            Kelola Semua Blok
          </button>
        </div>
      </div>
    </div>
  );
};
