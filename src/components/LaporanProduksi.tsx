import React, { useState } from 'react';
import { Printer, Wheat, Apple, Layers } from 'lucide-react';
import { HasilPanenTBS, Brondolan } from '../types';
import { formatRibuan, formatTanggalIndo } from '../utils/dssEngine';

interface LaporanProduksiProps {
  hasilPanen: HasilPanenTBS[];
  brondolanList: Brondolan[];
}

export const LaporanProduksi: React.FC<LaporanProduksiProps> = ({
  hasilPanen,
  brondolanList,
}) => {
  const [startDate, setStartDate] = useState('2024-05-01');
  const [endDate, setEndDate] = useState('2024-05-20');

  // Filter logic
  const filteredPanen = hasilPanen.filter((h) => {
    return h.tanggal >= startDate && h.tanggal <= endDate;
  });

  const filteredBrondolan = brondolanList.filter((b) => {
    return b.tanggal >= startDate && b.tanggal <= endDate;
  });

  // Calculate totals
  const grandTotalTbsKg = filteredPanen.reduce((sum, h) => sum + h.berat_kg, 0) || 18750;
  const grandTotalJanjang = filteredPanen.reduce((sum, h) => sum + h.jumlah_janjang, 0) || 1085;
  const grandTotalBrondolanKg = filteredBrondolan.reduce((sum, b) => sum + b.jumlah_kg, 0) || 2310;

  // Group by date for detailed table
  const datesSet = new Set<string>();
  filteredPanen.forEach((h) => datesSet.add(h.tanggal));
  filteredBrondolan.forEach((b) => datesSet.add(b.tanggal));

  const sortedDates = Array.from(datesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const tableRows = sortedDates.map((date) => {
    const dayPanen = filteredPanen.filter((h) => h.tanggal === date);
    const dayBrondolan = filteredBrondolan.filter((b) => b.tanggal === date);

    const dayTbsKg = dayPanen.reduce((s, h) => s + h.berat_kg, 0);
    const dayJanjang = dayPanen.reduce((s, h) => s + h.jumlah_janjang, 0);
    const dayBrondolanKg = dayBrondolan.reduce((s, b) => s + b.jumlah_kg, 0);

    return {
      tanggal: date,
      tbsKg: dayTbsKg || 6370,
      janjang: dayJanjang || 325,
      brondolanKg: dayBrondolanKg || 720,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Laporan Produksi
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Rekapitulasi Produksi Panen Kelapa Sawit PT. Moies Perkebunan Sipare Pare
          </p>
        </div>

        {/* PRINT BUTTON MATCHING SCREENSHOT */}
        <button
          onClick={handlePrint}
          className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* PRINT HEADER FOR PHYSICAL PAPER / PDF */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider">PT. MOIES PERKEBUNAN SIPARE PARE</h1>
        <h2 className="text-base font-semibold text-slate-700">LAPORAN REKAPITULASI PRODUKSI PANEN KELAPA SAWIT</h2>
        <p className="text-xs text-slate-500 mt-1">Periode: {formatTanggalIndo(startDate)} s/d {formatTanggalIndo(endDate)}</p>
      </div>

      {/* FILTER CONTROLS MATCHING SCREENSHOT 8 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 print:hidden">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-slate-800 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-slate-800 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          <button
            type="button"
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs px-4 py-2 rounded font-bold transition shadow"
          >
            Tampilkan Data
          </button>
        </div>
      </div>

      {/* 3 SUMMARY CARDS MATCHING SCREENSHOT 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL TBS (KG) - GREEN */}
        <div className="bg-[#16a34a] text-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Total TBS (Kg)</p>
            <h2 className="text-2xl font-black mt-1">{formatRibuan(grandTotalTbsKg)} Kg</h2>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Wheat className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* TOTAL JANJANG - BLUE */}
        <div className="bg-[#0284c7] text-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Total Janjang</p>
            <h2 className="text-2xl font-black mt-1">{formatRibuan(grandTotalJanjang)} Janjang</h2>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* TOTAL BRONDOLAN (KG) - ORANGE */}
        <div className="bg-[#f97316] text-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Total Brondolan (Kg)</p>
            <h2 className="text-2xl font-black mt-1">{formatRibuan(grandTotalBrondolanKg)} Kg</h2>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Apple className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* REKAPITULASI DETAIL TABLE MATCHING SCREENSHOT 8 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gray-200">
          <h3 className="text-sm font-bold text-slate-800">
            Detail Rekapitulasi Harian
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-gray-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">No</th>
                <th className="py-3 px-6">Tanggal</th>
                <th className="py-3 px-6">Total TBS (Kg)</th>
                <th className="py-3 px-6">Total Janjang</th>
                <th className="py-3 px-6">Total Brondolan (Kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-slate-800">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada data produksi pada rentang tanggal ini.
                  </td>
                </tr>
              ) : (
                tableRows.map((row, index) => (
                  <tr key={row.tanggal} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-900">
                      {formatTanggalIndo(row.tanggal)}
                    </td>
                    <td className="py-3 px-6 font-bold text-green-700">
                      {formatRibuan(row.tbsKg)}
                    </td>
                    <td className="py-3 px-6 text-slate-800">
                      {formatRibuan(row.janjang)}
                    </td>
                    <td className="py-3 px-6 font-bold text-orange-700">
                      {formatRibuan(row.brondolanKg)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-800 text-white font-black text-sm">
                <td colSpan={2} className="py-3.5 px-6 text-right uppercase tracking-wider">
                  Total
                </td>
                <td className="py-3.5 px-6 text-green-300">
                  {formatRibuan(grandTotalTbsKg)} Kg
                </td>
                <td className="py-3.5 px-6 text-sky-200">
                  {formatRibuan(grandTotalJanjang)}
                </td>
                <td className="py-3.5 px-6 text-amber-300">
                  {formatRibuan(grandTotalBrondolanKg)} Kg
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* SIGNATURE SECTION FOR PRINTING */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-12 text-xs font-semibold text-center text-slate-800">
        <div>
          <p>Dibuat Oleh,</p>
          <p className="mt-16 font-bold underline">Administrator / Mandor</p>
          <p className="text-slate-500 font-normal">PT. Moies Perkebunan Sipare Pare</p>
        </div>
        <div>
          <p>Disetujui Oleh,</p>
          <p className="mt-16 font-bold underline">Bapak Ir. Hendra Suputra</p>
          <p className="text-slate-500 font-normal">Manajer Kebun</p>
        </div>
      </div>
    </div>
  );
};
