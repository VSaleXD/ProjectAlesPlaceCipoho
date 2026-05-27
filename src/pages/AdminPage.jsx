import React, { useEffect, useMemo, useState } from 'react';
import { formatRupiah } from '../data/menu';
import { ICON_PHOTOS } from '../data/photos';
import { supabase } from '../supabaseClient';
import { sendWhatsAppNotification, getManualWhatsAppLink } from '../utils/whatsapp';

const initialMenuForm = {
  nama: '',
  harga: '',
  kategori: '',
  deskripsi: '',
  bestseller: false,
  image_url: '',
};

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationError, setReservationError] = useState('');

  // WhatsApp Notification State
  const [waModal, setWaModal] = useState(null); // { phone, message, link, nama, status, errorInfo }
  const [waToast, setWaToast] = useState({ show: false, message: '', type: 'success' });

  // Add Menu State
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [menuForm, setMenuForm] = useState(initialMenuForm);

  // Edit Menu State
  const [editingMenu, setEditingMenu] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    fetchReservations();
    fetchMenuItems();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setReservations(data || []);
      setReservationError('');
    } catch (err) {
      setReservationError('Gagal memuat reservasi dari Supabase.');
      console.error(err);
    } finally {
      setLoadingReservations(false);
    }
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from('menu').select('*').order('id', { ascending: true });
    if (!error && data) {
      setMenuItems(data);
    }
  };

  // Add Menu Handlers
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
      const { data, error } = await supabase.from('menu').insert([{
        nama: menuForm.nama,
        harga: Number(menuForm.harga),
        kategori: menuForm.kategori,
        deskripsi: menuForm.deskripsi,
        bestseller: Boolean(menuForm.bestseller),
        image_url: menuForm.image_url || null,
      }]).select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMenuItems((prev) => [...prev, data[0]]);
      }

      setMenuForm(initialMenuForm);
      setSubmitSuccess('Menu berhasil ditambahkan ke database.');
    } catch (error) {
      setSubmitError(error.message || 'Gagal menambahkan menu.');
    }
  };

  // Edit Menu Handlers
  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditingMenu((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateMenu = async (event) => {
    event.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!editingMenu.nama.trim() || !editingMenu.harga || !editingMenu.kategori.trim() || !editingMenu.deskripsi.trim()) {
      setEditError('Lengkapi semua field yang diperlukan.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu')
        .update({
          nama: editingMenu.nama,
          harga: Number(editingMenu.harga),
          kategori: editingMenu.kategori,
          deskripsi: editingMenu.deskripsi,
          bestseller: Boolean(editingMenu.bestseller),
          image_url: editingMenu.image_url || null,
        })
        .eq('id', editingMenu.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMenuItems((prev) => prev.map((item) => (item.id === editingMenu.id ? data[0] : item)));
        setEditSuccess('Menu berhasil diperbarui.');
        setTimeout(() => {
          setEditingMenu(null);
          setEditSuccess('');
        }, 1500);
      }
    } catch (error) {
      setEditError(error.message || 'Gagal memperbarui menu.');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Hapus menu ini?')) return;

    try {
      const { error } = await supabase.from('menu').delete().eq('id', id);
      if (error) throw error;
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message || 'Gagal menghapus menu');
    }
  };

  // Reservation Handlers
  const showWaToast = (message, type = 'success') => {
    setWaToast({ show: true, message, type });
    setTimeout(() => {
      setWaToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const updateReservationStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state immediately
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));

      // Find the updated reservation
      const reservation = reservations.find((r) => r.id === id);
      if (reservation && (newStatus === 'dikonfirmasi' || newStatus === 'dibatalkan')) {
        const res = await sendWhatsAppNotification(reservation, newStatus);
        if (res.success) {
          showWaToast(`Notifikasi WhatsApp otomatis terkirim ke ${reservation.nama}!`, 'success');
        } else {
          if (res.reason === 'NO_TOKEN') {
            setWaModal({
              phone: res.phone,
              message: res.message,
              link: getManualWhatsAppLink(res.phone, res.message),
              nama: reservation.nama,
              status: newStatus
            });
          } else {
            console.error('WA API Error:', res.error);
            showWaToast(`Gagal kirim otomatis: ${res.error || 'Kendala API'}. Mengalihkan ke manual...`, 'error');
            setTimeout(() => {
              setWaModal({
                phone: res.phone,
                message: res.message,
                link: getManualWhatsAppLink(res.phone, res.message),
                nama: reservation.nama,
                status: newStatus,
                errorInfo: res.error
              });
            }, 1200);
          }
        }
      }
    } catch (err) {
      alert('Gagal mengubah status reservasi: ' + err.message);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Hapus reservasi ini?')) return;
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Gagal menghapus reservasi');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'dikonfirmasi': return '#1f7a36'; // Hijau
      case 'dibatalkan': return '#DA251C'; // Merah
      default: return '#DA7F1C'; // Kuning/Oranye (menunggu)
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'dikonfirmasi': return '#effaf1';
      case 'dibatalkan': return '#FFF4F4';
      default: return '#FFFBF0';
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Admin Dashboard</h2>
        <p style={styles.headerSub}>Kelola menu dan reservasi dengan mudah</p>
      </div>

      <div className="section" style={{ maxWidth: 1040, paddingTop: 0, paddingBottom: 40, marginTop: -40, position: 'relative', zIndex: 5 }}>

        {/* Toast Notification */}
        {waToast.show && (
          <div style={{
            position: 'fixed',
            top: 24,
            right: 24,
            background: waToast.type === 'success' ? '#1f7a36' : '#DA251C',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600,
            fontSize: 14,
            animation: 'slideIn 0.3s ease-out forwards',
          }}>
            {waToast.type === 'success' ? '✅' : '⚠️'} {waToast.message}
          </div>
        )}

      {/* Tambah Menu Section */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>Tambah Menu Baru</h3>
            <p style={styles.cardSub}>Tambahkan item menu baru ke dalam database.</p>
          </div>
        </div>

        {submitError && <div style={styles.errorBox}>{submitError}</div>}
        {submitSuccess && <div style={styles.successBox}>{submitSuccess}</div>}

        <form onSubmit={handleAddMenu} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              name="nama"
              placeholder="Nama Menu"
              value={menuForm.nama}
              onChange={handleMenuFormChange}
            />
            <input
              style={styles.input}
              name="harga"
              type="number"
              placeholder="Harga (contoh: 25000)"
              value={menuForm.harga}
              onChange={handleMenuFormChange}
            />
            <input
              style={styles.input}
              name="kategori"
              placeholder="Kategori (contoh: Ramen)"
              value={menuForm.kategori}
              onChange={handleMenuFormChange}
            />
            <input
              style={styles.input}
              name="image_url"
              placeholder="Path lokal, contoh: /gambarHomepage/Logo.jpeg"
              value={menuForm.image_url || ''}
              onChange={handleMenuFormChange}
            />
          </div>
          <textarea
            style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
            name="deskripsi"
            placeholder="Deskripsi Menu..."
            value={menuForm.deskripsi}
            onChange={handleMenuFormChange}
          />
          <div style={styles.formActions}>
            <label style={styles.checkboxWrap}>
              <input
                type="checkbox"
                name="bestseller"
                checked={menuForm.bestseller}
                onChange={handleMenuFormChange}
              />
              Tandai sebagai Best Seller
            </label>
            <div style={{ flex: 1 }}></div>
            <button type="button" onClick={() => setMenuForm(initialMenuForm)} style={styles.resetBtn}>Reset</button>
            <button type="submit" className="btn-primary" style={styles.submitBtn}>Simpan Menu</button>
          </div>
        </form>
      </section>

      {/* Daftar Menu Section */}
      <section style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 10 }}>Daftar Menu ({menuItems.length})</h3>
        <div style={{ maxHeight: 400, overflowY: 'auto', overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', background: '#fafafa' }}>
                <th style={{ padding: '12px 16px', background: '#fafafa' }}>Nama</th>
                <th style={{ padding: '12px 16px', background: '#fafafa' }}>Kategori</th>
                <th style={{ padding: '12px 16px', background: '#fafafa' }}>Harga</th>
                <th style={{ padding: '12px 16px', background: '#fafafa' }}>Best Seller</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', background: '#fafafa' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.nama}</td>
                  <td style={{ padding: '12px 16px' }}>{m.kategori}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#DA251C' }}>{formatRupiah(m.harga)}</td>
                  <td style={{ padding: '12px 16px' }}>{m.bestseller ? '⭐ Ya' : '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => setEditingMenu(m)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDeleteMenu(m.id)} style={styles.deleteBtn}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reservasi Section */}
      <section style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Reservasi ({reservations.length})</h3>
          <button
            onClick={fetchReservations}
            className="btn-primary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            <img src={ICON_PHOTOS.refresh} alt="" style={styles.buttonIcon} /> Refresh
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
          <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #eee', textAlign: 'center', color: '#666' }}>
            Belum ada reservasi masuk.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid #eee' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', background: '#fafafa' }}>
                  <th style={{ padding: '12px 16px' }}>Tamu</th>
                  <th style={{ padding: '12px 16px' }}>Waktu & Detail</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const status = r.status || 'menunggu';
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.nama}</div>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          {r.telepon}<br />{r.email}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.tanggal} · {r.jam}</div>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          Jumlah: {r.jumlah}
                        </div>
                        {r.catatan && (
                          <div style={{ color: '#888', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                            "{r.catatan}"
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                        <select
                          value={status}
                          onChange={(e) => updateReservationStatus(r.id, e.target.value)}
                          style={{
                            ...styles.statusSelect,
                            color: getStatusColor(status),
                            background: getStatusBg(status),
                            borderColor: getStatusColor(status),
                          }}
                        >
                          <option value="menunggu">Menunggu</option>
                          <option value="dikonfirmasi">Dikonfirmasi</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                        <button onClick={() => deleteReservation(r.id)} style={styles.deleteBtn}>Hapus</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Menu Modal Pop-up */}
      {editingMenu && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Edit Menu</h3>
              <button onClick={() => { setEditingMenu(null); setEditError(''); setEditSuccess(''); }} style={styles.closeBtn}>×</button>
            </div>

            {editError && <div style={styles.errorBox}>{editError}</div>}
            {editSuccess && <div style={styles.successBox}>{editSuccess}</div>}

            <form onSubmit={handleUpdateMenu} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                style={styles.input}
                name="nama"
                placeholder="Nama Menu"
                value={editingMenu.nama}
                onChange={handleEditChange}
              />
              <input
                style={styles.input}
                name="harga"
                type="number"
                placeholder="Harga"
                value={editingMenu.harga}
                onChange={handleEditChange}
              />
              <input
                style={styles.input}
                name="kategori"
                placeholder="Kategori"
                value={editingMenu.kategori}
                onChange={handleEditChange}
              />
              <input
                style={styles.input}
                name="image_url"
                placeholder="URL Gambar (Opsional)"
                value={editingMenu.image_url || ''}
                onChange={handleEditChange}
              />
              <textarea
                style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
                name="deskripsi"
                placeholder="Deskripsi Menu..."
                value={editingMenu.deskripsi}
                onChange={handleEditChange}
              />
              <label style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={editingMenu.bestseller}
                  onChange={handleEditChange}
                />
                Tandai sebagai Best Seller
              </label>

              <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setEditingMenu(null); setEditError(''); setEditSuccess(''); }} style={styles.resetBtn}>Batal</button>
                <button type="submit" className="btn-primary" style={styles.submitBtn}>Update Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal WhatsApp Manual Fallback */}
      {waModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, maxWidth: 540}}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 Kirim Notifikasi WhatsApp
              </h3>
              <button onClick={() => setWaModal(null)} style={styles.closeBtn}>×</button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              {waModal.errorInfo ? (
                <div style={{...styles.errorBox, marginBottom: 12}}>
                  <strong>Gagal Kirim Otomatis:</strong> {waModal.errorInfo}
                </div>
              ) : (
                <div style={{ padding: '12px 16px', background: '#effaf1', borderRadius: 10, color: '#1f7a36', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                  ℹ️ Token WhatsApp API (Fonnte) belum diatur di file .env. Anda dapat mengirim notifikasi secara manual via WhatsApp Web dengan satu klik di bawah ini.
                </div>
              )}
              
              <p style={{ margin: '0 0 10px 0', fontSize: 14, color: '#333' }}>
                Mengirim notifikasi status <strong>{waModal.status === 'dikonfirmasi' ? 'Dikonfirmasi' : 'Dibatalkan'}</strong> ke pelanggan <strong>{waModal.nama}</strong> ({waModal.phone}):
              </p>
              
              <div style={{
                background: '#e5ddd5',
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                padding: '16px',
                borderRadius: 12,
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                marginBottom: 16
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '7.5px',
                  padding: '8px 10px',
                  maxWidth: '85%',
                  fontSize: '13px',
                  boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                  fontFamily: 'sans-serif',
                  textAlign: 'left'
                }}>
                  {waModal.message}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setWaModal(null)} style={styles.resetBtn}>Batal</button>
              <a 
                href={waModal.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setWaModal(null)}
                style={{
                  ...styles.submitBtn,
                  background: '#25D366',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                Kirim via WhatsApp Web
              </a>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 24,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    marginBottom: 24,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'start',
    marginBottom: 20,
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    background: '#FAF6F9',
  },
  checkboxWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#444',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtn: {
    fontSize: 13,
    padding: '10px 20px',
    borderRadius: 8,
    fontWeight: 600,
  },
  resetBtn: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  errorBox: {
    padding: 12,
    background: '#fee',
    borderRadius: 8,
    border: '1px solid #fcc',
    marginBottom: 16,
    color: '#c33',
    fontSize: 13,
  },
  successBox: {
    padding: 12,
    background: '#effaf1',
    borderRadius: 8,
    border: '1px solid #cdeed4',
    marginBottom: 16,
    color: '#1f7a36',
    fontSize: 13,
  },
  loading: {
    padding: 24,
    textAlign: 'center',
    color: '#666',
  },
  buttonIcon: {
    width: 14,
    height: 14,
    objectFit: 'cover',
    borderRadius: 999,
    verticalAlign: 'middle',
    marginRight: 6,
  },
  editBtn: {
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    marginRight: 8,
  },
  deleteBtn: {
    background: '#FFF4F4',
    color: '#DA251C',
    border: '1px solid #F4C7C7',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
  statusSelect: {
    padding: '6px 10px',
    borderRadius: 20,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    color: '#666',
  },
  header: {
    background: '#DA251C',
    padding: '40px 20px 80px',
    textAlign: 'center',
    color: 'white',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 800,
    color: 'white',
    marginBottom: 12,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.6,
  },
};