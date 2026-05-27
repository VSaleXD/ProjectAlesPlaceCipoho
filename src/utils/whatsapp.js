/**
 * Utilitas untuk mengirim notifikasi WhatsApp kepada pelanggan
 */

/**
 * Format nomor telepon ke format internasional standar (mis. 628xxxx)
 * @param {string} phone - Nomor telepon masukan
 * @returns {string} Nomor telepon terformat
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Hapus semua karakter selain angka
  let clean = phone.replace(/\D/g, '');
  
  // Jika diawali dengan '0', ganti dengan '62'
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  }
  
  // Jika belum diawali '62', tambahkan '62' di depannya
  if (!clean.startsWith('62') && clean.length > 0) {
    clean = '62' + clean;
  }
  
  return clean;
};

/**
 * Membuat pesan reservasi berdasarkan jenis status
 * @param {object} reservation - Objek reservasi pelanggan
 * @param {string} type - 'dikonfirmasi' atau 'dibatalkan'
 * @returns {string} Isi teks pesan
 */
export const getReservationMessage = (reservation, type) => {
  const { nama, tanggal, jam, jumlah, catatan } = reservation;
  
  // Format tanggal agar lebih rapi (mis. YYYY-MM-DD menjadi format bahasa Indonesia jika diinginkan,
  // namun kita pertahankan tanggal asli dari DB atau format sederhana dahulu)
  
  if (type === 'dikonfirmasi') {
    return `Halo *${nama}*,

Reservasi meja Anda di *Ale's Place Cipoho* telah *DIKONFIRMASI*! 🎉

Berikut detail reservasi Anda:
- *Nama:* ${nama}
- *Tanggal:* ${tanggal}
- *Jam Kedatangan:* ${jam} WIB
- *Jumlah Tamu:* ${jumlah}
${catatan ? `- *Catatan:* "${catatan}"\n` : ''}
Kami menantikan kedatangan Anda. Mohon datang tepat waktu (disarankan 10 menit sebelum jam kedatangan). Jika ada perubahan atau pembatalan, silakan hubungi kami kembali melalui nomor ini.

Terima kasih dan sampai jumpa!
_*Ale's Place Cipoho*_`;
  } else if (type === 'dibatalkan') {
    return `Halo *${nama}*,

Mohon maaf, reservasi meja Anda di *Ale's Place Cipoho* untuk tanggal *${tanggal}* jam *${jam}* terpaksa kami *BATALKAN* karena adanya kendala operasional atau keterbatasan tempat pada waktu tersebut.

Kami sangat meminta maaf atas ketidaknyamanan ini. Kami berharap dapat melayani Anda di lain kesempatan. Silakan lakukan reservasi kembali untuk hari lainnya melalui website kami.

Terima kasih atas pengertian Anda.
_*Ale's Place Cipoho*_`;
  }
  
  return '';
};

/**
 * Mengirim pesan WhatsApp via Fonnte API Gateway
 * @param {object} reservation - Objek reservasi pelanggan
 * @param {string} type - 'dikonfirmasi' atau 'dibatalkan'
 * @returns {Promise<{success: boolean, reason?: string, error?: string, message?: string, phone?: string}>}
 */
export const sendWhatsAppNotification = async (reservation, type) => {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  const phone = formatPhoneNumber(reservation.telepon);
  const message = getReservationMessage(reservation, type);
  
  if (!token || token.trim() === '') {
    return {
      success: false,
      reason: 'NO_TOKEN',
      message,
      phone
    };
  }
  
  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
        countryCode: '62',
      })
    });
    
    const data = await response.json();
    
    if (data.status === true) {
      return { success: true, data };
    } else {
      return {
        success: false,
        reason: 'API_ERROR',
        error: data.reason || 'Tolak kirim dari API Fonnte',
        message,
        phone
      };
    }
  } catch (err) {
    return {
      success: false,
      reason: 'NETWORK_ERROR',
      error: err.message,
      message,
      phone
    };
  }
};

/**
 * Mendapatkan tautan kirim pesan WhatsApp manual via web/app
 * @param {string} phone - Nomor telepon tujuan
 * @param {string} message - Pesan yang dikirim
 * @returns {string} URL WhatsApp Send
 */
export const getManualWhatsAppLink = (phone, message) => {
  const cleanPhone = formatPhoneNumber(phone);
  return `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}`;
};
