import React, { useEffect, useMemo, useState } from 'react';
import { formatRupiah } from '../data/menu';
import { addMenu, deleteMenu, fetchMenu } from '../lib/menuApi';

const API_URL = 'http://localhost:3001/api/reservasi';

const initialMenuForm = {
  nama: '',
  harga: '',
  kategori: '',
  deskripsi: '',
  bestseller: false,
};

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [reservationError, setReservationError] = useState('');
  const [menuError, setMenuError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [menuForm, setMenuForm] = useState(initialMenuForm);

  useEffect(() => {
    fetchReservations();
    fetchMenuItems();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Gagal fetch data');
      const data = await response.json();
      setReservations(data);
      setReservationError('');
    } catch (err) {
      setReservationError('Gagal terhubung ke backend. Pastikan server berjalan di http://localhost:3001');
      console.error(err);
    } finally {
      setLoadingReservations(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const data = await fetchMenu({ allowFallback: false });
      setMenuItems(data);
      setMenuError('');
    } catch (err) {
      setMenuError('Gagal memuat menu. Pastikan server berjalan di http://localhost:3001');
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  const menuCategories = useMemo(() => {
    const categories = new Set();
    menuItems.forEach((item) => {
      if (item.kategori) categories.add(item.kategori);
    });
    return Array.from(categories);
  }, [menuItems]);

  const handleMenuFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddMenu = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!menuForm.nama.trim() || !menuForm.harga || !menuForm.kategori.trim() || !menuForm.deskripsi.trim()) {
      setSubmitError('Lengkapi nama, harga, kategori, dan deskripsi menu.');
      return;
    }

    try {
      const response = await addMenu({
        ...menuForm,
        harga: Number(menuForm.harga),
      });

      if (response?.menu) {
        setMenuItems((prev) => [...prev, response.menu]);
      } else {
        await fetchMenuItems();
      }

      setMenuForm(initialMenuForm);
      setSubmitSuccess('Menu berhasil ditambahkan ke database.');
    } catch (error) {
      setSubmitError(error.message || 'Gagal menambahkan menu.');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Hapus menu ini?')) return;

    try {
      await deleteMenu(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message || 'Gagal menghapus menu');
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Hapus reservasi ini?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal hapus');
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Gagal menghapus reservasi');
    }
  };

  return (
    <div className="section" style={{ maxWidth: 1040 }}>
      <h2 className="section-title">Admin Dashboard</h2>
      <p className="section-sub">Ringkasan data menu dan reservasi dari backend</p>
      <p style={{ fontSize: 12, color: '#DA251C', textAlign: 'center', marginBottom: 20 }}>
        🔒 Halaman ini disembunyikan. Akses hanya lewat URL: <strong>#/admin</strong>
      </p>

      <section style={{ marginTop: 18 }}>
        <h3 style={{ marginBottom: 10 }}>Daftar Menu ({menuData.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '8px 6px' }}>Nama</th>
                <th style={{ padding: '8px 6px' }}>Kategori</th>
                <th style={{ padding: '8px 6px' }}>Harga</th>
              </tr>
            </thead>
            <tbody>
              {menuData.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: '10px 6px' }}>{m.nama}</td>
                  <td style={{ padding: '10px 6px' }}>{m.kategori}</td>
                  <td style={{ padding: '10px 6px', fontWeight: 700 }}>{formatRupiah(m.harga)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Reservasi ({reservations.length})</h3>
          <button
            onClick={fetchReservations}
            className="btn-primary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            🔄 Refresh
          </button>
        </div>

        {reservationError && (
          <div style={styles.errorBox}>
            {reservationError}
          </div>
        )}

        {loadingReservations ? (
          <div style={styles.loading}>Memuat reservasi...</div>
        ) : reservations.length === 0 ? (
          <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
            Belum ada reservasi.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {reservations.map((r) => (
              <div key={r.id} style={{ padding: 14, background: '#fff', borderRadius: 8, border: '1px solid #eee', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.nama}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
                    📧 {r.email} • 📱 {r.telepon}
                  </div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
                    📅 {r.tanggal} · 🕐 {r.jam} · 👥 {r.jumlah}
                  </div>
                  {r.catatan && (
                    <div style={{ color: '#666', fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>
                      💬 {r.catatan}
                    </div>
                  )}
                  <div style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
                    {new Date(r.timestamp).toLocaleString('id-ID')}
                  </div>
                </div>
                <button
                  onClick={() => deleteReservation(r.id)}
                  style={{
                    background: '#DA251C',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ✕ Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  card: {
    padding: 18,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'start',
    marginBottom: 16,
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
  },
  cardSub: {
    margin: '6px 0 0',
    color: '#666',
    fontSize: 13,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
  },
  checkboxWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#444',
  },
  formActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  submitBtn: {
    fontSize: 13,
    padding: '9px 14px',
  },
  resetBtn: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '9px 14px',
    cursor: 'pointer',
  },
  errorBox: {
    padding: 12,
    background: '#fee',
    borderRadius: 8,
    border: '1px solid #fcc',
    marginBottom: 16,
    color: '#c33',
  },
  successBox: {
    padding: 12,
    background: '#effaf1',
    borderRadius: 8,
    border: '1px solid #cdeed4',
    marginBottom: 16,
    color: '#1f7a36',
  },
  loading: {
    padding: 12,
    textAlign: 'center',
    color: '#666',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '8px 6px',
  },
  row: {
    borderBottom: '1px solid #fafafa',
  },
  td: {
    padding: '10px 6px',
  },
  deleteBtn: {
    background: '#DA251C',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
};