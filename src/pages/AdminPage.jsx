import React, { useEffect, useState } from 'react';
import { menuData, formatRupiah } from '../data/menu';

const API_URL = 'http://localhost:3001/api/reservasi';

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Gagal fetch data');
      const data = await response.json();
      setReservations(data);
      setError('');
    } catch (err) {
      setError('Gagal terhubung ke backend. Pastikan server berjalan di http://localhost:3001');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Hapus reservasi ini?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal hapus');
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Gagal menghapus reservasi');
    }
  };

  return (
    <div className="section" style={{ maxWidth: 960 }}>
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
                  <td style={{ padding: '10px 6px', width: 60 }}>{m.emoji}</td>
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

        {error && (
          <div style={{ padding: 12, background: '#fee', borderRadius: 8, border: '1px solid #fcc', marginBottom: 16, color: '#c33' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 12, textAlign: 'center', color: '#666' }}>Memuat...</div>
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
