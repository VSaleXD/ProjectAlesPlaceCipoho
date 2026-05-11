import React, { useState } from 'react';

const WA_NUMBER = '6281572155275';

const GUEST_OPTIONS = [
  '1–2 orang',
  '3–5 orang',
  '6–10 orang',
  'Grup (lebih dari 10)',
];

const RESTO_INFO = [
  { icon: '📍', text: 'Jl. Cipoho No.1, Ciamis, Jawa Barat' },
  { icon: '🕐', text: 'Senin – Jumat: 11:00 – 21:00 WIB' },
  { icon: '🕑', text: 'Sabtu – Minggu dan tanggal merah: 10:00 – 21:00 WIB' },
  { icon: '🅿️', text: 'Parkir tersedia untuk pelanggan' },
  { icon: '📞', text: '0815-7215-5275 (WhatsApp)' },
];

const INITIAL_FORM = {
  nama:    '',
  phone:   '',
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
    if (!formData.phone.trim())   e.phone   = 'Nomor HP wajib diisi untuk konfirmasi';
    if (!formData.tanggal)        e.tanggal = 'Pilih tanggal reservasi';
    if (!formData.jam.trim())     e.jam     = 'Isi jam kedatangan (mis. 19:30)';
    return e;
  };

  const buildMessage = () => {
    let msg =
      `Halo Ale's Place Cipoho, saya ${formData.nama} ingin reservasi ` +
      `untuk ${formData.jumlah} pada ${formData.tanggal} pukul ${formData.jam}.`;

    if (formData.phone) {
      msg += ` Nomor HP saya: ${formData.phone}.`;
    }
    if (formData.catatan.trim()) {
      msg += ` Catatan: ${formData.catatan.trim()}`;
    }
    return msg;
  };

  const handleSubmit = () => {
    // 1. Validasi
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. Buat pesan
    const message = buildMessage();
    setPreviewMsg(message);
    setIsSubmitting(true);

    // 3. Redirect ke WhatsApp setelah 800ms (beri waktu user lihat preview)
    setTimeout(() => {
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${WA_NUMBER}?text=${encodedMsg}`;
      window.open(url, '_blank');
      setIsSubmitting(false);
    }, 800);
  };

  // Tanggal minimum = hari ini
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={styles.hero}>
        <div style={styles.mascot}>🧑‍🍳</div>
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
            <label style={styles.label}>Nomor HP / WhatsApp</label>
            <input
              style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
              placeholder="Contoh: 08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              type="tel"
            />
            {errors.phone
              ? <span style={styles.errorMsg}>⚠️ {errors.phone}</span>
              : <span style={styles.hint}>Wajib diisi untuk konfirmasi</span>
            }
          </div>
        </div>

        <div style={styles.row}>
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
        </div>

        <div style={{ ...styles.formGroup, marginBottom: 14 }}>
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
              <span>💬</span>
              <span>Preview pesan WhatsApp</span>
            </div>
            <div style={styles.waBubble}>{previewMsg}</div>
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
          <span>📱</span>
          {isSubmitting ? 'Membuka WhatsApp...' : 'Konfirmasi Reservasi via WhatsApp'}
        </button>

        <div style={styles.infoBox}>
          <h4 style={styles.infoTitle}>ℹ️ Informasi Lokasi</h4>
          {RESTO_INFO.map((info, i) => (
            <div key={i} style={styles.infoRow}>
              <span style={{ fontSize: 16 }}>{info.icon}</span>
              <span style={styles.infoText}>{info.text}</span>
            </div>
          ))}
        </div>

        <div style={styles.mapBox}>
          <span style={{ fontSize: 36 }}>🗺️</span>
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
  mascot:    { fontSize: 56 },
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
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
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
};
