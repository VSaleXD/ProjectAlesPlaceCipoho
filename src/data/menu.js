/**
 * UTILS - Ale's Place Cipoho
 */

/**
 * formatRupiah — Konversi integer ke format mata uang Rupiah Indonesia
 * @param {number} angka - Nilai harga dalam integer
 * @returns {string} Format: "Rp47.000"
 */
export const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
