import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatRupiah } from '../data/menu';
import { ICON_PHOTOS } from '../data/photos';
import { supabase } from '../supabaseClient';
import { sendWhatsAppNotification, getManualWhatsAppLink } from '../utils/whatsapp';
import { saveOutletConfig, useOutletConfig } from '../utils/outletConfig';

const initialMenuForm = {
  nama: '',
  harga: '',
  kategori: '',
  deskripsi: '',
  bestseller: false,
  image_url: '',
};

// TABLE_INVENTORY no longer hardcoded

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationError, setReservationError] = useState('');
  const [cancellingReservasi, setCancellingReservasi] = useState(null);

  // Menu list sorting and pagination states
  const [menuSortKey, setMenuSortKey] = useState('nama'); // 'nama', 'kategori', or 'harga'
  const [menuSortOrder, setMenuSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [menuCurrentPage, setMenuCurrentPage] = useState(1);
  const menuPerPage = 10;

  const sortedMenuItems = useMemo(() => {
    const items = [...menuItems];
    items.sort((a, b) => {
      let valA = a[menuSortKey];
      let valB = b[menuSortKey];
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        if (valA < valB) return menuSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return menuSortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        return menuSortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });
    return items;
  }, [menuItems, menuSortKey, menuSortOrder]);

  const paginatedMenuItems = useMemo(() => {
    const startIndex = (menuCurrentPage - 1) * menuPerPage;
    return sortedMenuItems.slice(startIndex, startIndex + menuPerPage);
  }, [sortedMenuItems, menuCurrentPage]);

  const menuTotalPages = useMemo(() => {
    return Math.ceil(sortedMenuItems.length / menuPerPage) || 1;
  }, [sortedMenuItems]);

  useEffect(() => {
    if (menuCurrentPage > menuTotalPages) {
      setMenuCurrentPage(Math.max(1, menuTotalPages));
    }
  }, [menuTotalPages, menuCurrentPage]);

  // Tab State (Persisted in localStorage)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ales_admin_active_tab') || 'menu-outlet';
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ales_admin_active_tab', tab);
  };

  // WhatsApp Notification State
  const [waModal, setWaModal] = useState(null); // { phone, message, link, nama, status, errorInfo }
  const [waToast, setWaToast] = useState({ show: false, message: '', type: 'success' });

  // Add Menu State
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [menuForm, setMenuForm] = useState(initialMenuForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const previewObjectUrlRef = useRef(null);

  // Edit Menu State
  const [editingMenu, setEditingMenu] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Outlet Config States
  const outletConfig = useOutletConfig();
  const [operationalWeekdays, setOperationalWeekdays] = useState('');
  const [operationalWeekends, setOperationalWeekends] = useState('');
  const [outletPhone, setOutletPhone] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Kelola Meja State
  const [mejaForm, setMejaForm] = useState({ kategori: '', kapasitas_maksimal: '', jumlah_unit: '' });
  const [editingMeja, setEditingMeja] = useState(null);
  const [mejaActionSuccess, setMejaActionSuccess] = useState('');
  const [mejaActionError, setMejaActionError] = useState('');

  // Delete Menu State
  const [deletingMenu, setDeletingMenu] = useState(null);

  // Modals state for Reservations and Tables
  const [deletingReservasi, setDeletingReservasi] = useState(null);
  const [deletingMeja, setDeletingMeja] = useState(null);

  // Sync settings state when config loads
  useEffect(() => {
    if (outletConfig) {
      setOperationalWeekdays(outletConfig.operationalHours?.weekdays || '');
      setOperationalWeekends(outletConfig.operationalHours?.weekends || '');
      setOutletPhone(outletConfig.phone || '');
      setInstagramLink(outletConfig.socialLinks?.instagram || '');
      setTiktokLink(outletConfig.socialLinks?.tiktok || '');
      setWhatsappLink(outletConfig.socialLinks?.whatsapp || '');
      setFacebookLink(outletConfig.socialLinks?.facebook || '');
    }
  }, [outletConfig]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message || 'Gagal logout.');
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchMenuItems();
    fetchTables();
  }, []);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
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

  const fetchTables = async () => {
    const { data, error } = await supabase.from('meja').select('*').order('id', { ascending: true });
    if (!error && data) {
      setTableList(data);
    }
  };

  // Meja Handlers
  const handleMejaFormChange = (e) => {
    const { name, value } = e.target;
    setMejaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMejaEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMeja(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMeja = async (e) => {
    e.preventDefault();
    setMejaActionSuccess('');
    setMejaActionError('');
    try {
      const payload = {
        kategori: mejaForm.kategori,
        kapasitas_maksimal: parseInt(mejaForm.kapasitas_maksimal, 10),
        jumlah_unit: parseInt(mejaForm.jumlah_unit, 10)
      };

      const { error } = await supabase.from('meja').insert([payload]);
      if (error) throw error;
      
      setMejaActionSuccess('Meja berhasil ditambahkan!');
      setMejaForm({ kategori: '', kapasitas_maksimal: '', jumlah_unit: '' });
      fetchTables();
    } catch (err) {
      setMejaActionError(err.message || 'Gagal menyimpan meja');
    }
  };

  const handleUpdateMeja = async (e) => {
    e.preventDefault();
    setMejaActionSuccess('');
    setMejaActionError('');
    try {
      const payload = {
        kategori: editingMeja.kategori,
        kapasitas_maksimal: parseInt(editingMeja.kapasitas_maksimal, 10),
        jumlah_unit: parseInt(editingMeja.jumlah_unit, 10)
      };

      const { error } = await supabase.from('meja').update(payload).eq('id', editingMeja.id);
      if (error) throw error;

      setMejaActionSuccess('Meja berhasil diperbarui!');
      setEditingMeja(null);
      fetchTables();
    } catch (err) {
      setMejaActionError(err.message || 'Gagal memperbarui meja');
    }
  };

  const handleDeleteMeja = async () => {
    if (!deletingMeja) return;
    try {
      const { error } = await supabase.from('meja').delete().eq('id', deletingMeja.id);
      if (error) throw error;
      setMejaActionSuccess('Meja berhasil dihapus!');
      setDeletingMeja(null);
      fetchTables();
    } catch (err) {
      setMejaActionError(err.message || 'Gagal menghapus meja');
    }
  };

  const handleEditMeja = (meja) => {
    setEditingMeja(meja);
    setMejaActionSuccess('');
    setMejaActionError('');
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
      setUploadPreview(null);
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

  const handleDeleteMenu = async () => {
    if (!deletingMenu) return;

    try {
      const { error } = await supabase.from('menu').delete().eq('id', deletingMenu.id);
      if (error) throw error;
      setMenuItems((prev) => prev.filter((item) => item.id !== deletingMenu.id));
      setDeletingMenu(null);
    } catch (error) {
      alert(error.message || 'Gagal menghapus menu');
    }
  };

  // Save Config Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const { syncedToSupabase } = await saveOutletConfig({
      operationalHours: {
        weekdays: operationalWeekdays,
        weekends: operationalWeekends,
      },
      phone: outletPhone,
      socialLinks: {
        instagram: instagramLink,
        tiktok: tiktokLink,
        whatsapp: whatsappLink,
        facebook: facebookLink,
      }
    });
    setSettingsSuccess(
      syncedToSupabase
        ? 'Pengaturan restoran berhasil disimpan ke Supabase!'
        : 'Pengaturan restoran disimpan di cache lokal, sinkronisasi Supabase belum tersedia.'
    );
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  // Toggle Best Seller on homepage
  const handleToggleBestseller = async (item) => {
    const newStatus = !item.bestseller;
    
    // Check limit if turning ON
    if (newStatus) {
      const currentBestsellersCount = menuItems.filter(m => m.bestseller).length;
      if (currentBestsellersCount >= 4) {
        alert('Maksimal hanya 4 menu yang bisa ditampilkan sebagai Menu Unggulan!');
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('menu')
        .update({ bestseller: newStatus })
        .eq('id', item.id)
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setMenuItems((prev) => prev.map((m) => (m.id === item.id ? data[0] : m)));
        showWaToast(`Status best seller ${item.nama} diperbarui!`, 'success');
      }
    } catch (err) {
      alert('Gagal mengubah status bestseller: ' + err.message);
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

      // Map English status to Indonesian for WhatsApp notifications helper
      let waType = '';
      if (newStatus === 'confirmed' || newStatus === 'dikonfirmasi') {
        waType = 'dikonfirmasi';
      } else if (newStatus === 'cancelled' || newStatus === 'dibatalkan') {
        waType = 'dibatalkan';
      }

      // Find the updated reservation
      const reservation = reservations.find((r) => r.id === id);
      if (reservation && (waType === 'dikonfirmasi' || waType === 'dibatalkan')) {
        const res = await sendWhatsAppNotification(reservation, waType);
        if (res.success) {
          showWaToast(`Notifikasi WhatsApp otomatis terkirim ke ${reservation.nama}!`, 'success');
        } else {
          if (res.reason === 'NO_TOKEN') {
            setWaModal({
              phone: res.phone,
              message: res.message,
              link: getManualWhatsAppLink(res.phone, res.message),
              nama: reservation.nama,
              status: waType
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
                status: waType,
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
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations((prev) => prev.filter((r) => r.id !== id));
      showWaToast('Reservasi berhasil dihapus.', 'success');
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert('Gagal menghapus reservasi');
    }
  };

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'confirmed':
      case 'dikonfirmasi': 
        return '#1f7a36'; // Hijau
      case 'cancelled':
      case 'dibatalkan': 
        return '#DA251C'; // Merah
      default: 
        return '#DA7F1C'; // Kuning/Oranye (menunggu)
    }
  };

  // Group reservations for Kanban board supporting both English and Indonesian status values
  const pendingReservations = useMemo(() => {
    return reservations.filter((r) => {
      const s = r.status ? r.status.toLowerCase() : 'pending';
      return s === 'pending' || s === 'menunggu';
    });
  }, [reservations]);

  const confirmedReservations = useMemo(() => {
    return reservations.filter((r) => {
      const s = r.status ? r.status.toLowerCase() : '';
      return s === 'confirmed' || s === 'dikonfirmasi';
    });
  }, [reservations]);

  const cancelledReservations = useMemo(() => {
    return reservations.filter((r) => {
      const s = r.status ? r.status.toLowerCase() : '';
      return s === 'cancelled' || s === 'dibatalkan';
    });
  }, [reservations]);

  // Card styles mapping
  const renderReservationCard = (r) => {
    const status = r.status ? r.status.toLowerCase() : 'pending';
    const tableInfo = r.meja_id ? tableList.find(t => t.id === r.meja_id) : null;
    const tableString = tableInfo ? ` · 🪑 ${tableInfo.kategori} (Max ${tableInfo.kapasitas_maksimal})` : '';
    


    return (
      <div key={r.id} style={{ ...styles.resCard, borderLeft: `5px solid ${getStatusColor(r.status)}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#100A09', display: 'block' }}>{r.nama}</span>
            <span style={{ fontSize: 12, color: '#666', display: 'block', marginTop: 4 }}>📞 {r.telepon}</span>
            <span style={{ fontSize: 12, color: '#666', display: 'block' }}>✉️ {r.email || '-'}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setDeletingReservasi(r);
            }} 
            style={{
              background: 'none',
              border: 'none',
              color: '#DA251C',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
            }}
            title="Hapus Permanen"
          >
            🗑️
          </button>
        </div>

        <div style={styles.resDetailsBox}>
          <div style={{ fontWeight: 700, color: '#100A09' }}>📅 {r.tanggal}</div>
          <div style={{ color: '#444', marginTop: 3 }}>⏰ {r.jam} · 👥 {r.jumlah} org{tableString}</div>
          {r.catatan && (
            <div style={styles.resNotes}>
              "{r.catatan}"
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {status !== 'pending' && status !== 'menunggu' && (
            <button
              onClick={() => updateReservationStatus(r.id, 'pending')}
              style={styles.statusActionBtnPending}
            >
              🔄 Menunggu
            </button>
          )}
          {status !== 'confirmed' && status !== 'dikonfirmasi' && (
            <button
              onClick={() => updateReservationStatus(r.id, 'confirmed')}
              style={styles.statusActionBtnConfirm}
            >
              ✓ Konfirmasi
            </button>
          )}
          {status !== 'cancelled' && status !== 'dibatalkan' && (
            <button
              onClick={() => updateReservationStatus(r.id, 'cancelled')}
              style={styles.statusActionBtnCancel}
            >
              ✗ Batalkan
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <style>{`
        .admin-layout-grid {
          display: grid !important;
          grid-template-columns: 3fr 1fr !important;
          gap: 24px !important;
        }
        .kanban-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 990px) {
          .admin-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .kanban-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={styles.header}>
        <button type="button" onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        <h2 style={styles.headerTitle}>Admin Dashboard</h2>
        <p style={styles.headerSub}>Kelola menu, outlet, dan reservasi dengan mudah</p>
      </div>

      <div className="section" style={{ maxWidth: 1200, paddingTop: 0, paddingBottom: 40, marginTop: -40, position: 'relative', zIndex: 5 }}>

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
          }}>
            {waToast.type === 'success' ? '✅' : '⚠️'} {waToast.message}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => handleTabChange('menu-outlet')} 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'menu-outlet' ? styles.tabBtnActive : {})
            }}
          >
            🍽️ Kelola Menu &amp; Restoran
          </button>
          <button 
            onClick={() => handleTabChange('reservasi')} 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'reservasi' ? styles.tabBtnActive : {})
            }}
          >
            📅 Daftar Reservasi ({reservations.length})
          </button>
          <button 
            onClick={() => handleTabChange('meja')} 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'meja' ? styles.tabBtnActive : {})
            }}
          >
            🪑 Kelola Meja
          </button>
        </div>

        {/* Tab Content 1: Menu & Outlet Settings */}
        {activeTab === 'menu-outlet' && (
          <div className="admin-layout-grid">
            
            {/* Left Column: Add Menu & Menu Lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Tambah Menu Baru */}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        style={styles.input}
                        name="image_file"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          setUploadError('');
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          
                          if (previewObjectUrlRef.current) {
                            URL.revokeObjectURL(previewObjectUrlRef.current);
                          }
                          const previewUrl = URL.createObjectURL(file);
                          previewObjectUrlRef.current = previewUrl;
                          setUploadPreview(previewUrl);
                          try {
                            setUploading(true);
                            const filePath = `gambar-menu/${Date.now()}_${file.name}`;
                            const { data: uploadData, error: uploadErr } = await supabase.storage
                              .from('projek-rpl')
                              .upload(filePath, file, { upsert: true });
                            if (uploadErr) throw uploadErr;
                            const { data: publicData } = supabase.storage
                              .from('projek-rpl')
                              .getPublicUrl(filePath);
                            const publicUrl = publicData?.publicUrl || publicData?.publicURL || null;
                            if (!publicUrl) throw new Error('Gagal mendapatkan public URL');
                            setMenuForm((prev) => ({ ...prev, image_url: publicUrl }));
                          } catch (err) {
                            console.error('Upload error', err);
                            setUploadError(err.message || 'Gagal mengunggah gambar');
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                      {uploadPreview && (
                        <img src={uploadPreview} alt="Preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                      )}
                      {uploading && <div style={{ color: '#666', fontSize: 13 }}>Mengunggah gambar...</div>}
                      {uploadError && <div style={styles.errorBox}>{uploadError}</div>}
                    </div>
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
                    <button type="button" onClick={() => { setMenuForm(initialMenuForm); setUploadPreview(null); }} style={styles.resetBtn}>Reset</button>
                    <button type="submit" className="btn-primary red" style={styles.submitBtn}>Simpan Menu</button>
                  </div>
                </form>
              </section>

              {/* Daftar Menu Card (Consistent Style with Sort & Pagination) */}
              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>Daftar Menu ({menuItems.length})</h3>
                    <p style={styles.cardSub}>Semua item menu terdaftar di database.</p>
                  </div>
                </div>

                {/* Sorting and Info Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#fafafa',
                  borderBottom: '1px solid #eee',
                  borderTop: '1px solid #eee',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Urutkan:</span>
                    <select
                      value={menuSortKey}
                      onChange={(e) => {
                        setMenuSortKey(e.target.value);
                        setMenuCurrentPage(1);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        fontSize: 13,
                        background: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: 600,
                        color: '#444'
                      }}
                    >
                      <option value="nama">Nama Menu</option>
                      <option value="kategori">Kategori</option>
                      <option value="harga">Harga</option>
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setMenuSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                        setMenuCurrentPage(1);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600,
                        color: '#333'
                      }}
                      title={menuSortOrder === 'asc' ? 'Urutkan Menurun' : 'Urutkan Menaik'}
                    >
                      {menuSortOrder === 'asc' ? '▲ Naik' : '▼ Turun'}
                    </button>
                  </div>
                  
                  <div style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                    Menampilkan {menuItems.length === 0 ? 0 : (menuCurrentPage - 1) * menuPerPage + 1} - {Math.min(menuItems.length, menuCurrentPage * menuPerPage)} dari {menuItems.length} menu
                  </div>
                </div>
                
                <div style={{ borderBottomLeftRadius: menuTotalPages > 1 ? 0 : 16, borderBottomRightRadius: menuTotalPages > 1 ? 0 : 16, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', background: '#fafafa' }}>
                        <th style={{ padding: '12px 16px', background: '#fafafa', fontSize: 13, fontWeight: 700 }}>Nama</th>
                        <th style={{ padding: '12px 16px', background: '#fafafa', fontSize: 13, fontWeight: 700 }}>Kategori</th>
                        <th style={{ padding: '12px 16px', background: '#fafafa', fontSize: 13, fontWeight: 700 }}>Harga</th>
                        <th style={{ padding: '12px 16px', background: '#fafafa', fontSize: 13, fontWeight: 700 }}>Best Seller</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', background: '#fafafa', fontSize: 13, fontWeight: 700 }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMenuItems.map((m) => (
                        <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{m.nama}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{m.kategori}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#DA251C', fontSize: 13 }}>{formatRupiah(m.harga)}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{m.bestseller ? '⭐ Ya' : '-'}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button onClick={() => setEditingMenu(m)} style={styles.editBtn}>Edit</button>
                            <button onClick={() => setDeletingMenu(m)} style={styles.deleteBtn}>Hapus</button>
                          </td>
                        </tr>
                      ))}
                      {paginatedMenuItems.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontSize: 13 }}>
                            Belum ada menu terdaftar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {menuTotalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                    padding: '16px',
                    borderTop: '1px solid #eee',
                    background: '#fafafa',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16
                  }}>
                    <button
                      type="button"
                      onClick={() => setMenuCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={menuCurrentPage === 1}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        background: menuCurrentPage === 1 ? '#f5f5f5' : '#fff',
                        color: menuCurrentPage === 1 ? '#aaa' : '#333',
                        cursor: menuCurrentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'background 0.2s'
                      }}
                    >
                      Sebelumnya
                    </button>
                    
                    {(() => {
                      let pages = [];
                      if (menuTotalPages <= 5) {
                        for (let i = 1; i <= menuTotalPages; i++) pages.push(i);
                      } else {
                        if (menuCurrentPage <= 3) {
                          pages = [1, 2, 3, 4, '...', menuTotalPages];
                        } else if (menuCurrentPage >= menuTotalPages - 2) {
                          pages = [1, '...', menuTotalPages - 3, menuTotalPages - 2, menuTotalPages - 1, menuTotalPages];
                        } else {
                          pages = [1, '...', menuCurrentPage - 1, menuCurrentPage, menuCurrentPage + 1, '...', menuTotalPages];
                        }
                      }
                      return pages.map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`dots-${index}`} style={{ padding: '0 4px', color: '#888', fontWeight: 600 }}>...</span>
                        ) : (
                          <button
                            type="button"
                            key={pageNum}
                            onClick={() => setMenuCurrentPage(pageNum)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              border: pageNum === menuCurrentPage ? 'none' : '1px solid #ddd',
                              background: pageNum === menuCurrentPage ? '#DA251C' : '#fff',
                              color: pageNum === menuCurrentPage ? '#fff' : '#333',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 700,
                              transition: 'all 0.2s'
                            }}
                          >
                            {pageNum}
                          </button>
                        )
                      ));
                    })()}
                    
                    <button
                      type="button"
                      onClick={() => setMenuCurrentPage(prev => Math.min(menuTotalPages, prev + 1))}
                      disabled={menuCurrentPage === menuTotalPages}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        background: menuCurrentPage === menuTotalPages ? '#f5f5f5' : '#fff',
                        color: menuCurrentPage === menuTotalPages ? '#aaa' : '#333',
                        cursor: menuCurrentPage === menuTotalPages ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'background 0.2s'
                      }}
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </section>

            </div>

            {/* Right Column: Settings & Homepage Best Seller Highlight */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Pengaturan Restoran Card */}
              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>⚙️ Pengaturan Restoran</h3>
                    <p style={styles.cardSub}>Kelola jam operasional, kontak, dan link sosial media.</p>
                  </div>
                </div>

                {settingsSuccess && <div style={styles.successBox}>{settingsSuccess}</div>}

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={styles.formLabel}>JAM OPERASIONAL (SENIN – JUMAT)</label>
                    <input
                      style={styles.input}
                      value={operationalWeekdays}
                      onChange={(e) => setOperationalWeekdays(e.target.value)}
                      placeholder="Contoh: 11:00 – 21:00 WIB"
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>JAM OPERASIONAL (SABTU, MINGGU & LIBUR)</label>
                    <input
                      style={styles.input}
                      value={operationalWeekends}
                      onChange={(e) => setOperationalWeekends(e.target.value)}
                      placeholder="Contoh: 10:00 – 21:00 WIB"
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>NOMOR TELEPON (WHATSAPP)</label>
                    <input
                      style={styles.input}
                      value={outletPhone}
                      onChange={(e) => setOutletPhone(e.target.value)}
                      placeholder="Contoh: 0815-7215-5275"
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>LINK INSTAGRAM</label>
                    <input
                      style={styles.input}
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>LINK TIKTOK</label>
                    <input
                      style={styles.input}
                      value={tiktokLink}
                      onChange={(e) => setTiktokLink(e.target.value)}
                      placeholder="https://www.tiktok.com/@..."
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>LINK FACEBOOK</label>
                    <input
                      style={styles.input}
                      value={facebookLink}
                      onChange={(e) => setFacebookLink(e.target.value)}
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>LINK WHATSAPP CHAT</label>
                    <input
                      style={styles.input}
                      value={whatsappLink}
                      onChange={(e) => setWhatsappLink(e.target.value)}
                      placeholder="https://wa.me/..."
                    />
                  </div>

                  <button type="submit" className="btn-primary red" style={{ ...styles.submitBtn, width: '100%', marginTop: 8 }}>
                    Simpan Pengaturan
                  </button>
                </form>
              </section>
            </div>

          </div>
        )}

        {/* Tab Content 2: Reservations View (Kanban Board) */}
        {activeTab === 'reservasi' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Reservasi Masuk ({reservations.length})</h3>
              <button
                onClick={fetchReservations}
                className="btn-primary red"
                style={{ fontSize: 12, padding: '6px 14px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                🔄 Refresh
              </button>
            </div>

            {reservationError && <div style={styles.errorBox}>{reservationError}</div>}

            {loadingReservations ? (
              <div style={styles.loading}>Memuat data reservasi...</div>
            ) : (
              <div className="kanban-grid">
                
                {/* Column 1: Menunggu */}
                <div style={styles.kanbanColumn}>
                  <div style={{ ...styles.kanbanHeader, borderBottomColor: '#DA7F1C' }}>
                    <h4 style={{ margin: 0, color: '#DA7F1C' }}>⏳ Menunggu ({pendingReservations.length})</h4>
                  </div>
                  <div style={styles.kanbanBody}>
                    {pendingReservations.map((r) => renderReservationCard(r))}
                    {pendingReservations.length === 0 && (
                      <div style={styles.emptyColumn}>Tidak ada reservasi menunggu.</div>
                    )}
                  </div>
                </div>

                {/* Column 2: Terkonfirmasi */}
                <div style={styles.kanbanColumn}>
                  <div style={{ ...styles.kanbanHeader, borderBottomColor: '#1f7a36' }}>
                    <h4 style={{ margin: 0, color: '#1f7a36' }}>✅ Terkonfirmasi ({confirmedReservations.length})</h4>
                  </div>
                  <div style={styles.kanbanBody}>
                    {confirmedReservations.map((r) => renderReservationCard(r))}
                    {confirmedReservations.length === 0 && (
                      <div style={styles.emptyColumn}>Tidak ada reservasi terkonfirmasi.</div>
                    )}
                  </div>
                </div>

                {/* Column 3: Dibatalkan */}
                <div style={styles.kanbanColumn}>
                  <div style={{ ...styles.kanbanHeader, borderBottomColor: '#DA251C' }}>
                    <h4 style={{ margin: 0, color: '#DA251C' }}>❌ Dibatalkan ({cancelledReservations.length})</h4>
                  </div>
                  <div style={styles.kanbanBody}>
                    {cancelledReservations.map((r) => renderReservationCard(r))}
                    {cancelledReservations.length === 0 && (
                      <div style={styles.emptyColumn}>Tidak ada reservasi dibatalkan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Kelola Meja */}
        {activeTab === 'meja' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Tambah Meja Baru</h3>
                  <p style={styles.cardSub}>Kelola kapasitas dan unit meja di restoran.</p>
                </div>
              </div>
              {!editingMeja && mejaActionError && <div style={styles.errorBox}>{mejaActionError}</div>}
              {!editingMeja && mejaActionSuccess && <div style={styles.successBox}>{mejaActionSuccess}</div>}
              <form onSubmit={handleAddMeja} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input style={styles.input} name="kategori" placeholder="Kategori (mis: Lesehan, VIP)" value={mejaForm.kategori} onChange={handleMejaFormChange} required />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input style={styles.input} name="kapasitas_maksimal" type="number" placeholder="Kapasitas (orang)" value={mejaForm.kapasitas_maksimal} onChange={handleMejaFormChange} required />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input style={styles.input} name="jumlah_unit" type="number" placeholder="Jumlah Unit" value={mejaForm.jumlah_unit} onChange={handleMejaFormChange} required />
                </div>
                <div style={{ display: 'flex', gap: 8, minWidth: '200px' }}>
                  <button type="submit" className="btn-primary red" style={styles.submitBtn}>Tambah Meja</button>
                </div>
              </form>
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Daftar Kategori Meja ({tableList.length})</h3>
                  <p style={styles.cardSub}>Semua kategori meja yang terdaftar di sistem.</p>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>ID</th>
                      <th style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>Kategori</th>
                      <th style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>Kapasitas Max</th>
                      <th style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>Jumlah Unit</th>
                      <th style={{ padding: '12px 16px', color: '#555', fontSize: 13, textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableList.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px 16px', fontSize: 14 }}>{m.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{m.kategori}</td>
                        <td style={{ padding: '12px 16px', fontSize: 14 }}>{m.kapasitas_maksimal} orang</td>
                        <td style={{ padding: '12px 16px', fontSize: 14 }}>{m.jumlah_unit} unit</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button onClick={() => handleEditMeja(m)} style={styles.editBtn}>✏️ Edit</button>
                          <button onClick={() => setDeletingMeja(m)} style={styles.deleteBtn}>🗑️ Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {tableList.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: 14 }}>Belum ada data meja.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

      </div>

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

      {/* Edit Meja Modal Pop-up */}
      {editingMeja && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Edit Kategori Meja</h3>
              <button onClick={() => { setEditingMeja(null); setMejaActionError(''); setMejaActionSuccess(''); }} style={styles.closeBtn}>×</button>
            </div>

            {mejaActionError && <div style={styles.errorBox}>{mejaActionError}</div>}
            {mejaActionSuccess && <div style={styles.successBox}>{mejaActionSuccess}</div>}

            <form onSubmit={handleUpdateMeja} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                style={styles.input}
                name="kategori"
                placeholder="Kategori (mis: Lesehan, VIP)"
                value={editingMeja.kategori}
                onChange={handleMejaEditChange}
                required
              />
              <input
                style={styles.input}
                name="kapasitas_maksimal"
                type="number"
                placeholder="Kapasitas (orang)"
                value={editingMeja.kapasitas_maksimal}
                onChange={handleMejaEditChange}
                required
              />
              <input
                style={styles.input}
                name="jumlah_unit"
                type="number"
                placeholder="Jumlah Unit"
                value={editingMeja.jumlah_unit}
                onChange={handleMejaEditChange}
                required
              />
              <button type="submit" className="btn-primary red" style={{ ...styles.submitBtn, width: '100%' }}>
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Menu Modal Pop-up */}
      {deletingMenu && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Hapus Menu</h3>
              <button onClick={() => setDeletingMenu(null)} style={styles.closeBtn}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
              Apakah Anda yakin ingin menghapus menu <strong>{deletingMenu.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingMenu(null)} style={styles.resetBtn}>Batal</button>
              <button onClick={handleDeleteMenu} style={{ ...styles.submitBtn, width: 'auto', margin: 0 }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reservasi Modal Pop-up */}
      {deletingReservasi && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Hapus Reservasi</h3>
              <button onClick={() => setDeletingReservasi(null)} style={styles.closeBtn}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
              Apakah Anda yakin ingin menghapus reservasi atas nama <strong>{deletingReservasi.nama}</strong> secara permanen?
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingReservasi(null)} style={styles.resetBtn}>Batal</button>
              <button onClick={() => { deleteReservation(deletingReservasi.id); setDeletingReservasi(null); }} style={{ ...styles.submitBtn, width: 'auto', margin: 0 }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Meja Modal Pop-up */}
      {deletingMeja && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Hapus Kategori Meja</h3>
              <button onClick={() => setDeletingMeja(null)} style={styles.closeBtn}>×</button>
            </div>
            
            <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
              Apakah Anda yakin ingin menghapus meja kategori <strong>{deletingMeja.kategori}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingMeja(null)} style={styles.resetBtn}>Batal</button>
              <button onClick={handleDeleteMeja} style={{ ...styles.submitBtn, width: 'auto', margin: 0 }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

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
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'start',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
  },
  cardSub: {
    margin: '6px 0 0',
    color: '#666',
    fontSize: 13,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#8F1D1B',
    display: 'block',
    marginBottom: 4,
    letterSpacing: '0.5px',
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
    flexWrap: 'wrap',
    marginTop: 10,
  },
  submitBtn: {
    fontSize: 13,
    padding: '10px 20px',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
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
    padding: 32,
    textAlign: 'center',
    color: '#666',
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
    padding: 12,
    overflowY: 'auto',
  },
  modalContent: {
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: 'calc(100vh - 24px)',
    overflowY: 'auto',
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
    background: '#F5EBDD',
    padding: '32px 16px 72px',
    textAlign: 'center',
    color: '#100A09',
    position: 'relative',
  },
  logoutBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    border: '1px solid rgba(16, 10, 9, 0.12)',
    background: '#fff',
    color: '#100A09',
    padding: '10px 16px',
    borderRadius: 999,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 800,
    color: '#100A09',
    marginBottom: 12,
  },
  headerSub: {
    color: '#666666',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  // Tab Styling
  tabContainer: {
    display: 'flex',
    gap: 12,
    borderBottom: '2px solid #EFEAE4',
    marginBottom: 28,
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    padding: '14px 20px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s',
  },
  tabBtnActive: {
    color: '#8F1D1B',
    borderBottomColor: '#8F1D1B',
  },
  // Kanban Grid styles
  kanbanColumn: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #eee',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  kanbanHeader: {
    padding: '16px 20px',
    borderBottom: '3px solid',
    background: '#FAF8F5',
  },
  kanbanBody: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxHeight: '650px',
    overflowY: 'auto',
    background: '#fcfcfc',
  },
  emptyColumn: {
    padding: 24,
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    background: '#FAF8F5',
    borderRadius: 12,
    border: '1px dashed #ddd',
  },
  // Reservation Card
  resCard: {
    padding: 16,
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #eee',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
    transition: 'transform 0.15s ease',
  },
  resDetailsBox: {
    background: '#FAF6F9',
    padding: '10px 12px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
  resNotes: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#777',
    borderTop: '1px dashed #ddd',
    paddingTop: 6,
  },
  trashBtn: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: 16,
    padding: '0 4px',
  },
  statusActionBtnPending: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #DA7F1C',
    background: '#FFFBF0',
    color: '#DA7F1C',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  statusActionBtnConfirm: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #1f7a36',
    background: '#effaf1',
    color: '#1f7a36',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  statusActionBtnCancel: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #DA251C',
    background: '#FFF4F4',
    color: '#DA251C',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: '#FAF6F9',
    borderRadius: 10,
    border: '1px solid #eee',
  },
  toggleBestsellerBtn: {
    border: '1px solid',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  }
};