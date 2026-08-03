import { HasilPanenTBS, BlokKebun, EvaluasiDSS, StatusPeringatanDSS } from '../types';

/**
 * Engine Decision Support System (DSS) untuk Analisis Penurunan Hasil Panen
 * PT. Moies Perkebunan Sipare Pare
 */
export function analyzeHarvestDrop(
  hasilPanen: HasilPanenTBS[],
  blokKebun: BlokKebun[]
): EvaluasiDSS[] {
  const evaluations: EvaluasiDSS[] = [];
  let evalId = 1;

  // Kelompokkan data panen berdasarkan blok & tanggal
  const blockDataMap = new Map<number, { tanggal: string; berat_kg: number }[]>();

  hasilPanen.forEach((item) => {
    if (!blockDataMap.has(item.blok_id)) {
      blockDataMap.set(item.blok_id, []);
    }
    const list = blockDataMap.get(item.blok_id)!;
    const existingDateIndex = list.findIndex((x) => x.tanggal === item.tanggal);
    if (existingDateIndex >= 0) {
      list[existingDateIndex].berat_kg += item.berat_kg;
    } else {
      list.push({ tanggal: item.tanggal, berat_kg: item.berat_kg });
    }
  });

  // Urutkan data setiap blok berdasarkan tanggal
  blockDataMap.forEach((records, blokId) => {
    records.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    const blok = blokKebun.find((b) => b.id === blokId);
    const namaBlok = blok ? blok.nama_blok : `Blok ID ${blokId}`;

    // Bandingkan setiap pasang data berturutan
    for (let i = 1; i < records.length; i++) {
      const prev = records[i - 1];
      const curr = records[i];

      if (prev.berat_kg > 0) {
        const dropKg = prev.berat_kg - curr.berat_kg;
        const percentDrop = (dropKg / prev.berat_kg) * 100;

        if (percentDrop > 10) {
          let status: StatusPeringatanDSS = 'Waspada';
          if (percentDrop >= 25) {
            status = 'Kritis';
          }

          let rekomendasi = '';
          if (status === 'Kritis') {
            rekomendasi = `Penurunan drastis ${percentDrop.toFixed(1)}% di ${namaBlok}. Tindakan Segera: (1) Periksa tingkat kematangan buah (potongan mentah/lewat matang), (2) Cek ketersediaan tenaga pemanen di lapangan, (3) Evaluasi jadwal pemupukan & rotasi titi panen.`;
          } else {
            rekomendasi = `Penurunan ${percentDrop.toFixed(1)}% di ${namaBlok}. Rekomendasi: Lakukan inspeksi kebersihan piringan pohon, pengutipan brondolan, dan pengecekan potensi hama UPDS.`;
          }

          evaluations.push({
            id: evalId++,
            tanggal_evaluasi: curr.tanggal,
            blok_id: blokId,
            nama_blok: namaBlok,
            hasil_sebelum_kg: prev.berat_kg,
            hasil_sekarang_kg: curr.berat_kg,
            persen_penurunan: parseFloat(percentDrop.toFixed(1)),
            status_peringatan: status,
            rekomendasi_tindakan: rekomendasi,
            catatan_manajer: status === 'Kritis' ? 'Peringatan: Mandor harap segera cek lapangan dan laporkan kondisi pemupukan!' : undefined,
            status_tindak_lanjut: 'Proses Evaluasi'
          });
        }
      }
    }
  });

  return evaluations.sort((a, b) => new Date(b.tanggal_evaluasi).getTime() - new Date(a.tanggal_evaluasi).getTime());
}

/**
 * Format mata uang Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format angka ribuan dengan titik (contoh: 12.450 Kg)
 */
export function formatRibuan(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format tanggal Indonesia (contoh: 18 Mei 2024 atau 18-05-2024)
 */
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}
