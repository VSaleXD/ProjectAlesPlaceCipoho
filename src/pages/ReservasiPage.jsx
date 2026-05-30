import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getManualWhatsAppLink } from '../utils/whatsapp';

const GUEST_OPTIONS = [
  '1–2 orang',
  '3–5 orang',
  '6–10 orang',
  'Grup (lebih dari 10)',
];

const INITIAL_FORM = {
  nama: '',
  telepon: '',
  tanggal: '',
  jam: '',
  jumlah: '1–2 orang',
  catatan: '',
};

export default function ReservasiPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Hapus error field yang baru diisi
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // Reset success msg saat form berubah
    setSuccessMsg('');
  };

  const validateForm = () => {
    const e = {};
    if (!formData.nama.trim()) e.nama = 'Nama lengkap wajib diisi';
    if (!formData.telepon.trim()) e.telepon = 'Nomor HP wajib diisi untuk konfirmasi';
    if (!formData.tanggal) e.tanggal = 'Pilih tanggal reservasi';
    if (!formData.jam.trim()) e.jam = 'Isi jam kedatangan (mis. 19:30)';
    return e;
  };

  const handleSubmit = async () => {
    // 1. Validasi
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Simpan ke Supabase
      const { error } = await supabase.from('reservations').insert([{
        nama: formData.nama,
        telepon: formData.telepon,
        tanggal: formData.tanggal,
        jam: formData.jam,
        jumlah: formData.jumlah,
        catatan: formData.catatan,
      }]);

      if (error) {
        throw error;
      }

      setSuccessMsg('Reservasi berhasil dikirim! Silakan tunggu konfirmasi dari kami melalui WhatsApp/Telepon.');
      // Simpan salinan data yang dikirim agar bisa dipakai untuk notifikasi
      const submitted = { ...formData };
      setFormData(INITIAL_FORM);

      // redirect ke WhatsApp ales (buka WhatsApp Web di tab baru)
      try {
        const adminPhone = '0815-1469-3030';
        const adminMessage = `Reservasi baru dari *${submitted.nama || '-'}*\n` +
          `Telepon: ${submitted.telepon || '-'}\n` +
          `Tanggal: ${submitted.tanggal || '-'}\n` +
          `Jam: ${submitted.jam || '-'}\n` +
          `Jumlah: ${submitted.jumlah || '-'}\n` +
          `Catatan: ${submitted.catatan || '-'}`;

        const link = getManualWhatsAppLink(adminPhone, adminMessage);
        // Buka WhatsApp Web/ app untuk mengirim pesan ke admin
        window.open(link, '_blank');
      } catch (err) {
        console.warn('Gagal membuka WhatsApp admin:', err);
      }

    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Gagal mengirim reservasi. ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tanggal minimum = hari ini
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservasi-page">
      <div style={styles.hero} className="reservasi-hero">
        <h2 style={styles.headerTitle}>Form Reservasi</h2>
        <p style={styles.heroDesc}>
          Isi data di bawah untuk memesan tempat
        </p>

      </div>

      <div style={styles.container} className="reservasi-container">
        <div style={styles.formSection} className="reservasi-formSection">
          <div style={styles.row} className="reservasi-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                style={{ ...styles.input, ...(errors.nama ? styles.inputError : {}) }}
                placeholder="Contoh: Andi Wijaya"
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
              />
              {errors.nama
                ? <span style={styles.errorMsg}>⚠️ {errors.nama}</span>
                : <span style={styles.hint}>Wajib diisi</span>
              }
            </div>
          </div>

          <div style={styles.row} className="reservasi-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Nomor HP / WhatsApp</label>
              <input
                style={{ ...styles.input, ...(errors.telepon ? styles.inputError : {}) }}
                placeholder="Contoh: 08xxxxxxxxxx"
                value={formData.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                type="tel"
              />
              {errors.telepon
                ? <span style={styles.errorMsg}>⚠️ {errors.telepon}</span>
                : <span style={styles.hint}>Wajib diisi untuk konfirmasi</span>
              }
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal</label>
              <input
                style={{ ...styles.input, ...(errors.tanggal ? styles.inputError : {}) }}
                type="date"
                min={today}
                value={formData.tanggal}
                onChange={(e) => handleChange('tanggal', e.target.value)}
              />
              {errors.tanggal
                ? <span style={styles.errorMsg}>⚠️ {errors.tanggal}</span>
                : <span style={styles.hint}>Minimal hari ini (H+0)</span>
              }
            </div>
          </div>

          <div style={styles.row} className="reservasi-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Jam Kedatangan</label>
              <input
                style={{ ...styles.input, ...(errors.jam ? styles.inputError : {}) }}
                placeholder="mis. 19:30"
                value={formData.jam}
                onChange={(e) => handleChange('jam', e.target.value)}
              />
              {errors.jam
                ? <span style={styles.errorMsg}>⚠️ {errors.jam}</span>
                : <span style={styles.hint}>Saran: datang 10 menit sebelum jam</span>
              }
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Jumlah Tamu</label>
              <select
                style={styles.input}
                value={formData.jumlah}
                onChange={(e) => handleChange('jumlah', e.target.value)}
              >
                {GUEST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span style={styles.hint}>Jika lebih dari 10, pilih "Grup"</span>
            </div>
          </div>

          <div style={{ ...styles.formGroup, marginBottom: 20 }} className="reservasi-notes">
            <label style={styles.label}>Catatan Tambahan (Opsional)</label>
            <textarea
              style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
              placeholder="Tambahkan permintaan khusus atau informasi lainnya..."
              value={formData.catatan}
              onChange={(e) => handleChange('catatan', e.target.value)}
            />
          </div>

          {successMsg && (
            <div style={{ padding: 16, background: '#effaf1', borderRadius: 12, border: '1px solid #cdeed4', color: '#1f7a36', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
              ✅ {successMsg}
            </div>
          )}

          {errors.submit && (
            <div style={{ padding: 16, background: '#fee', borderRadius: 12, border: '1px solid #fcc', color: '#c33', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
              ❌ {errors.submit}
            </div>
          )}

          <button
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.8 : 1,
              marginBottom: 0
            }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="reservasi-submitBtn"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Reservasi'}
          </button>
        </div>

        <div style={styles.infoSection} className="reservasi-infoSection">

          <div style={styles.infoBox} className="reservasi-infoBox">
            <h4 style={styles.infoTitle}>Informasi Operasional</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="reservasi-operationalGrid">
              <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#DA251C', textTransform: 'uppercase', marginBottom: '4px' }}>Senin – Jumat</div>
                <div style={{ fontSize: '13px', color: '#333' }}>11:00 – 21:00 WIB</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#DA251C', textTransform: 'uppercase', marginBottom: '4px' }}>Sabtu, Minggu & Libur</div>
                <div style={{ fontSize: '13px', color: '#333' }}>10:00 – 21:00 WIB</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#DA251C', textTransform: 'uppercase', marginBottom: '4px' }}>Kontak (WhatsApp)</div>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>0815-7215-5275</div>
            </div>
          </div>

          <div style={styles.mapBox} className="reservasi-mapBox">
            <iframe
              src="https://www.google.com/maps?q=Jl.+Gamelan+No.2,+Cikondang,+Kec.+Citamiang,+Kota+Sukabumi&output=embed"
              style={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Ale's Place"
            ></iframe>
            <div style={{ padding: '16px' }}>
              <p style={styles.mapTitle}>Lokasi strategis dekat pusat kota.</p>
              <p style={styles.mapSub}>Perumahan Cipoho Indah, Jl. Gamelan No.2, Cikondang, Kec. Citamiang, Kota Sukabumi, Jawa Barat 43142</p>
            </div>
          </div>
        </div>

      </div>

      <footer>2026. Ale's Place Cipoho. All rights reserved</footer>
    </div>
  );
}

const styles = {
  hero: {
    background: '#F5EBDD',
    padding: '32px 16px 72px',
    textAlign: 'center',
    color: '#100A09',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(24px, 5vw, 30px)',
    fontWeight: 700,
    color: '#100A09',
  },
  heroDesc: {
    color: '#666666',
    fontSize: 14,
    maxWidth: 420,
    margin: '0 auto',
    textAlign: 'center',
    lineHeight: 1.5,
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1040,
    margin: '-32px auto 32px',
    padding: '0 16px',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 5,
  },
  formSection: {
    flex: '1 1 500px',
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  },
  infoSection: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'static',
  },
  imageBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  },
  infoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginBottom: 14,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #F0E8E2',
    borderRadius: 10,
    background: '#FAF6F9',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#100A09',
    outline: 'none',
    transition: 'border 0.2s',
  },
  inputError: {
    borderColor: '#DA251C',
  },
  hint: {
    fontSize: 11,
    color: '#999',
  },
  errorMsg: {
    fontSize: 11,
    color: '#DA251C',
    fontWeight: 600,
  },

  waPreview: {
    background: '#075E54',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  waHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'white',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10,
  },
  headerIcon: { width: 16, height: 16, objectFit: 'cover', borderRadius: 999 },
  waBubble: {
    background: '#DCF8C6',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    color: '#100A09',
    lineHeight: 1.6,
  },

  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #DA251C, #8F1D1B)',
    color: 'white',
    border: 'none',
    padding: 16,
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
    marginBottom: 24,
  },
  buttonIcon: { width: 18, height: 18, objectFit: 'cover', borderRadius: 999 },

  infoBox: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  titleIcon: { width: 16, height: 16, objectFit: 'cover', borderRadius: 999, verticalAlign: 'text-bottom', marginRight: 6 },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  rowIcon: { width: 16, height: 16, objectFit: 'cover', borderRadius: 999, flexShrink: 0 },
  infoText: {
    fontSize: 13,
    color: '#444',
  },

  mapBox: {
    background: '#F0E8E2',
    borderRadius: 16,
    border: '1px solid #DA7F1C',
    textAlign: 'center',
    overflow: 'hidden',
  },
  mapIframe: {
    width: '100%',
    height: 220,
    border: 0,
    display: 'block',
  },
  mapTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: '#100A09',
  },
  mapSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
};
