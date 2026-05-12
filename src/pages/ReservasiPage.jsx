import React, { useState } from 'react';
import { ICON_PHOTOS } from '../data/photos';

const API_URL = 'http://localhost:3001/api/reservasi';

const GUEST_OPTIONS = [
  '1–2 orang',
  '3–5 orang',
  '6–10 orang',
  'Grup (lebih dari 10)',
];

const RESTO_INFO = [
  { text: 'Perumahan Cipoho Indah, Jl. Gamelan No.2, Cikondang, Kec. Citamiang, Kota Sukabumi, Jawa Barat 43142' },
  { text: 'Senin – Jumat: 11:00 – 21:00 WIB' },
  { text: 'Sabtu – Minggu dan tanggal merah: 10:00 – 21:00 WIB' },
  {  text: '0815-7215-5275 (WhatsApp)' },
];

const INITIAL_FORM = {
  nama:    '',
  email:   '',
  telepon: '',
  tanggal: '',
  jam:     '',
  jumlah:  '1–2 orang',
  catatan: '',
};

export default function ReservasiPage() {
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState({});
  const [previewMsg,   setPreviewMsg]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Hapus error field yang baru diisi
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // Reset preview saat form berubah
    setPreviewMsg('');
  };

  const validateForm = () => {
    const e = {};
    if (!formData.nama.trim())    e.nama    = 'Nama lengkap wajib diisi';
    if (!formData.email.trim())   e.email   = 'Email wajib diisi';
    if (!formData.telepon.trim()) e.telepon = 'Nomor HP wajib diisi untuk konfirmasi';
    if (!formData.tanggal)        e.tanggal = 'Pilih tanggal reservasi';
    if (!formData.jam.trim())     e.jam     = 'Isi jam kedatangan (mis. 19:30)';
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
      // 2. POST ke backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          telepon: formData.telepon,
          tanggal: formData.tanggal,
          jam: formData.jam,
          jumlah: formData.jumlah,
          catatan: formData.catatan,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim reservasi');
      }

      const data = await response.json();

      if (data.success) {
        // 3. Buka WhatsApp dengan link dari response
        setPreviewMsg(data.message || 'Reservasi berhasil! Membuka WhatsApp...');
        setTimeout(() => {
          if (data.waURL) {
            window.open(data.waURL, '_blank');
          }
          // Reset form
          setFormData(INITIAL_FORM);
          setPreviewMsg('');
        }, 800);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Gagal mengirim reservasi. Pastikan backend berjalan di http://localhost:3001' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tanggal minimum = hari ini
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Form Reservasi</h2>
        <p style={styles.heroDesc}>
          Isi data berikut. Kami akan mengarahkan Anda ke WhatsApp setelah konfirmasi.
        </p>
      </div>

      <div style={styles.formWrap}>

        <div style={styles.row}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              placeholder="Contoh: andi@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email
              ? <span style={styles.errorMsg}>⚠️ {errors.email}</span>
              : <span style={styles.hint}>Wajib diisi</span>
            }
          </div>
        </div>

        <div style={styles.row}>
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

        <div style={styles.row}>
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

        <div style={{ ...styles.formGroup, marginBottom: 20 }}>
          <label style={styles.label}>Catatan Tambahan (Opsional)</label>
          <textarea
            style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
            placeholder="Tambahkan permintaan khusus atau informasi lainnya..."
            value={formData.catatan}
            onChange={(e) => handleChange('catatan', e.target.value)}
          />
        </div>

        {previewMsg && (
          <div style={styles.waPreview}>
            <div style={styles.waHeader}>
              <span>Preview pesan WhatsApp</span>
            </div>
            <div style={styles.waBubble}>{previewMsg}</div>
          </div>
        )}

        {errors.submit && (
          <div style={{ ...styles.waPreview, background: '#DA251C', marginBottom: 16 }}>
            <div style={styles.errorMsg}>❌ {errors.submit}</div>
          </div>
        )}

        <button
          style={{
            ...styles.submitBtn,
            opacity: isSubmitting ? 0.8 : 1,
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Membuka WhatsApp...' : 'Konfirmasi Reservasi via WhatsApp'}
        </button>

        <div style={styles.infoBox}>
          <h4 style={styles.infoTitle}> Informasi Lokasi</h4>
          {RESTO_INFO.map((info, i) => (
            <div key={i} style={styles.infoRow}>
              <span style={styles.infoText}>{info.text}</span>
            </div>
          ))}
        </div>

        <div style={styles.mapBox}>
          <img src={ICON_PHOTOS.location} alt="Peta lokasi" style={styles.mapIcon} />
          <p style={styles.mapTitle}>Lokasi strategis dekat pusat kota.</p>
          <p style={styles.mapSub}>Datang 10–15 menit sebelum waktu reservasi. Parkir tersedia.</p>
        </div>

      </div>

      <footer>2026. Ale's Place Cipoho. All rights reserved</footer>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #DA251C, #8F1D1B)',
    padding: '40px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    color: 'white',
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    maxWidth: 340,
    lineHeight: 1.5,
  },

  formWrap: {
    padding: '24px 20px',
    maxWidth: 680,
    margin: '0 auto',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    background: '#FAF6F9',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(218,127,28,0.3)',
    marginBottom: 20,
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
    borderRadius: 12,
    height: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: '1px solid #DA7F1C',
    textAlign: 'center',
    padding: '0 24px',
    marginBottom: 8,
  },
  mapTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: '#100A09',
  },
  mapSub: {
    fontSize: 12,
    color: '#666',
  },
  mapIcon: { width: 38, height: 38, objectFit: 'cover', borderRadius: 12 },
};
