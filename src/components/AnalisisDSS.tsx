import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowDownRight, Send, Lightbulb } from 'lucide-react';
import { EvaluasiDSS, Mandor, BlokKebun } from '../types';
import { formatRibuan, formatTanggalIndo } from '../utils/dssEngine';

interface AnalisisDSSProps {
  evaluasiDss: EvaluasiDSS[];
  mandorList: Mandor[];
  blokKebun: BlokKebun[];
  onUpdateNote: (id: number, note: string) => void;
  onUpdateStatus: (id: number, status: 'Selesai' | 'Proses Evaluasi') => void;
}

export const AnalisisDSS: React.FC<AnalisisDSSProps> = ({
  evaluasiDss,
  mandorList,
  onUpdateNote,
  onUpdateStatus,
}) => {
  const [activeNotes, setActiveNotes] = useState<{ [id: number]: string }>({});

  const handleSendNote = (id: number) => {
    const noteText = activeNotes[id];
    if (noteText) {
      onUpdateNote(id, noteText);
      alert('Catatan & Instruksi Manajer berhasil dikirimkan ke Mandor!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span>Analisis Pendukung Keputusan (DSS) - Penurunan Hasil Panen</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Deteksi Otomatis Selisih Produksi TBS antar Tanggal Sesi Panen & Evaluasi Rekomendasi Manajer
        </p>
      </div>

      {evaluasiDss.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl border border-gray-200 shadow-sm space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Seluruh Hasil Panen dalam Kondisi Normal & Stabil
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sistem tidak mendeteksi adanya penurunan hasil panen lebih dari 10% pada blok manapun.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluasiDss.map((item) => {
            const isKritis = item.status_peringatan === 'Kritis';
            const isCompleted = item.status_tindak_lanjut === 'Selesai';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border p-5 transition ${
                  isKritis
                    ? 'border-red-300 bg-red-50/20'
                    : 'border-amber-300 bg-amber-50/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider ${
                        isKritis ? 'bg-red-600' : 'bg-amber-500'
                      }`}
                    >
                      Peringatan {item.status_peringatan}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.nama_lokasi || item.nama_blok}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tanggal Evaluasi: {formatTanggalIndo(item.tanggal_evaluasi)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {item.status_tindak_lanjut || 'Proses Evaluasi'}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateStatus(
                          item.id,
                          isCompleted ? 'Proses Evaluasi' : 'Selesai'
                        )
                      }
                      className="text-xs font-semibold px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded transition"
                    >
                      {isCompleted ? 'Tandai Perlu Evaluasi' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>

                {/* METRICS COMPARISON */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Hasil Sesi Sebelumnya
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {formatRibuan(item.hasil_sebelum_kg)} Kg
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Hasil Sesi Ini
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {formatRibuan(item.hasil_sekarang_kg)} Kg
                    </span>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <span className="text-[11px] font-semibold text-red-600 block flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
                      Penurunan Produksi
                    </span>
                    <span className="text-base font-extrabold text-red-700">
                      -{item.persen_penurunan}% ({formatRibuan(item.hasil_sebelum_kg - item.hasil_sekarang_kg)} Kg)
                    </span>
                  </div>
                </div>

                {/* AUTOMATED RECOMMENDATION & MANAGER INSTRUCTION */}
                <div className="space-y-3">
                  <div className="bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                    <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">
                        Rekomendasi Diagnostik Sistem (DSS AI):
                      </span>
                      <p className="leading-relaxed">{item.rekomendasi_tindakan}</p>
                    </div>
                  </div>

                  {/* MANAGER INSTRUCTION INPUT FORM */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Instruksi Manajer Kepada Mandor Kebun:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ketik instruksi perbaikan untuk mandor..."
                        value={
                          activeNotes[item.id] !== undefined
                            ? activeNotes[item.id]
                            : item.catatan_manajer || ''
                        }
                        onChange={(e) =>
                          setActiveNotes({
                            ...activeNotes,
                            [item.id]: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-600 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendNote(item.id)}
                        className="bg-[#15803d] hover:bg-[#166534] text-white text-xs px-3.5 py-1.5 rounded font-bold transition flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Instruksi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
