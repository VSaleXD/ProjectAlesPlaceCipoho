import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getManualWhatsAppLink } from '../utils/whatsapp';
import { useOutletConfig } from '../utils/outletConfig';

// TABLE_INVENTORY no longer hardcoded

const INITIAL_FORM = {
  nama: '',
  telepon: '',
  tanggal: '',
  jam: '',
  jumlah: '',
  meja_id: '',
  catatan: '',
};

export default function ReservasiPage() {
  const config = useOutletConfig();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [checkingTables, setCheckingTables] = useState(false);
  const [tableInventory, setTableInventory] = useState([]);

  React.useEffect(() => {
    async function fetchInventory() {
      const { data, error } = await supabase.from('meja').select('*');
      if (data) setTableInventory(data);
    }
    fetchInventory();
  }, []);

  React.useEffect(() => {
    async function checkAvailability() {
      if (!formData.tanggal || !formData.jam || !formData.jumlah) {
        setAvailableTables([]);
        return;
      }

      setCheckingTables(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('meja_id, status')
          .eq('tanggal', formData.tanggal)
          .eq('jam', formData.jam);

        if (error) throw error;

        // Hitung meja yang sudah dipesan (asumsi status !== Ditolak / Dibatalkan jika ada)
        const bookedCounts = {};
        if (data) {
          data.forEach(res => {
            if (res.meja_id && res.status !== 'Ditolak' && res.status !== 'Dibatalkan') {
              bookedCounts[res.meja_id] = (bookedCounts[res.meja_id] || 0) + 1;
            }
          });
        }

        const guests = parseInt(formData.jumlah, 10);

        // Filter meja yang sisa unit > 0 dan kapasitas memadai
        const available = tableInventory.map(table => {
          const booked = bookedCounts[table.id] || 0;
          return {
            ...table,
            sisa_unit: table.jumlah_unit - booked
          };
        }).filter(table => table.sisa_unit > 0 && table.kapasitas_maksimal >= guests);

        setAvailableTables(available);

        // Auto-reset meja_id jika meja yang dipilih sebelumnya sudah tidak tersedia
        if (formData.meja_id) {
          const isStillAvailable = available.some(t => t.id === parseInt(formData.meja_id, 10));
          if (!isStillAvailable) {
            setFormData(prev => ({ ...prev, meja_id: '' }));
          }
        }
      } catch (err) {
        console.error('Error checking tables:', err);
      } finally {
        setCheckingTables(false);
      }
    }

    // Debounce sedikit agar tidak terlalu sering memanggil API saat mengetik jam/jumlah
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.tanggal, formData.jam, formData.jumlah, tableInventory]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccessMsg('');

    // Real-time validation
    const newErrors = { ...errors };

    if (field === 'jumlah') {
      if (value !== '' && parseInt(value, 10) < 1) {
        newErrors.jumlah = 'Minimal tamu adalah 1 orang';
      } else {
        delete newErrors.jumlah;
      }
    } else if (field === 'jam') {
      if (value.trim()) {
        const jamArr = value.split(':');
        if (jamArr.length === 2) {
          const h = parseInt(jamArr[0], 10);
          const m = parseInt(jamArr[1], 10);
          if (h > 21 || (h === 21 && m > 0)) {
            newErrors.jam = 'Reservasi maksimal pukul 21:00';
          } else {
            delete newErrors.jam;
          }
        } else {
          delete newErrors.jam;
        }
      } else {
        delete newErrors.jam;
      }
    } else {
      if (newErrors[field]) {
        delete newErrors[field];
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const e = {};
    if (!formData.nama.trim()) e.nama = 'Nama lengkap wajib diisi';
    if (!formData.telepon.trim()) e.telepon = 'Nomor HP wajib diisi untuk konfirmasi';
    if (!formData.tanggal) e.tanggal = 'Pilih tanggal reservasi';

    if (!formData.jam.trim()) {
      e.jam = 'Isi jam kedatangan (mis. 19:30)';
    } else {
      const jamArr = formData.jam.split(':');
      if (jamArr.length === 2) {
        const h = parseInt(jamArr[0], 10);
        const m = parseInt(jamArr[1], 10);
        if (h > 21 || (h === 21 && m > 0)) {
          e.jam = 'Reservasi maksimal pukul 21:00';
        }
      }
    }

    if (!formData.jumlah || parseInt(formData.jumlah, 10) < 1) {
      e.jumlah = 'Minimal tamu adalah 1 orang';
    }

    if (!formData.meja_id) e.meja_id = 'Pilih kategori meja yang tersedia';
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
        jumlah: formData.jumlah.toString(),
        meja_id: parseInt(formData.meja_id, 10),
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
        const adminPhone = config.phone || '0815-7215-5275';
        const selectedTable = tableInventory.find(t => t.id === parseInt(submitted.meja_id, 10));
        const tableInfo = selectedTable ? `${selectedTable.kategori} (Max ${selectedTable.kapasitas_maksimal} org)` : '-';

        const adminMessage = `Reservasi baru dari *${submitted.nama || '-'}*\n` +
          `Telepon: ${submitted.telepon || '-'}\n` +
          `Tanggal: ${submitted.tanggal || '-'}\n` +
          `Jam: ${submitted.jam || '-'}\n` +
          `Jumlah: ${submitted.jumlah || '-'} orang\n` +
          `Kategori Meja: ${tableInfo}\n` +
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
              <input
                style={{ ...styles.input, ...(errors.jumlah ? styles.inputError : {}) }}
                type="number"
                min="1"
                placeholder="Contoh: 2"
                value={formData.jumlah}
                onChange={(e) => handleChange('jumlah', e.target.value)}
              />
              {errors.jumlah
                ? <span style={styles.errorMsg}>⚠️ {errors.jumlah}</span>
                : <span style={styles.hint}>Masukkan angka (mis. 2)</span>
              }
            </div>
          </div>

          <div style={styles.row} className="reservasi-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Kategori Meja</label>
              <select
                style={{ ...styles.input, ...(errors.meja_id ? styles.inputError : {}) }}
                value={formData.meja_id}
                onChange={(e) => handleChange('meja_id', e.target.value)}
                disabled={!formData.tanggal || !formData.jam || !formData.jumlah || checkingTables}
              >
                <option value="">
                  {(!formData.tanggal || !formData.jam || !formData.jumlah)
                    ? "Isi Tanggal, Jam & Tamu dahulu"
                    : checkingTables
                      ? "Mengecek ketersediaan..."
                      : availableTables.length === 0
                        ? "Meja penuh/tidak cukup"
                        : "Pilih meja tersedia"}
                </option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.kategori} (Max: {table.kapasitas_maksimal} org) - Sisa: {table.sisa_unit}
                  </option>
                ))}
              </select>
              {errors.meja_id
                ? <span style={styles.errorMsg}>⚠️ {errors.meja_id}</span>
                : <span style={styles.hint}>Sistem memfilter otomatis yang tersedia</span>
              }
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
                <div style={{ fontSize: '13px', color: '#333' }}>{config.operationalHours?.weekdays || '11:00 – 21:00 WIB'}</div>
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#DA251C', textTransform: 'uppercase', marginBottom: '4px' }}>Sabtu, Minggu & Libur</div>
                <div style={{ fontSize: '13px', color: '#333' }}>{config.operationalHours?.weekends || '10:00 – 21:00 WIB'}</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#DA251C', textTransform: 'uppercase', marginBottom: '4px' }}>Kontak (WhatsApp)</div>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 600 }}>{config.phone || '0815-7215-5275'}</div>
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
              <p style={styles.mapTitle}>Lokasi Ale's Place Cipoho</p>
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
    position: 'relative',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 800,
    color: '#100A09',
    marginBottom: 12,
  },
  heroDesc: {
    color: '#666666',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
    lineHeight: 1.6,
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
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
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
    padding: 24,
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
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
