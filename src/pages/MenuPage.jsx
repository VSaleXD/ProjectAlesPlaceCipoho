import React, { useEffect, useMemo, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { supabase } from '../supabaseClient';
import { formatRupiah } from '../data/menu';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setMenuItems(data);
      } catch (err) {
        setError('Gagal memuat menu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredMenu = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchCategory =
        activeCategory === 'Semua' || item.kategori === activeCategory;
      const matchSearch =
        !query ||
        item.nama.toLowerCase().includes(query) ||
        item.kategori.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, menuItems, searchQuery]);

  const categories = useMemo(() => {
    const categorySet = new Set(['Semua']);
    menuItems.forEach((item) => {
      if (item.kategori) {
        categorySet.add(item.kategori);
      }
    });
    return Array.from(categorySet);
  }, [menuItems]);

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('Semua');
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Menu Kami</h2>
        <p style={styles.headerSub}>
          Temukan hidangan favorit Anda
        </p>
      </div>

      <div style={{ paddingBottom: 40 }}>
        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <div style={styles.searchWrap}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Cari menu, kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari menu"
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        <div style={styles.catScroll}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.catBtn,
                ...(activeCategory === cat ? styles.catBtnActive : {}),
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loadingState}>Memuat menu...</div>
        ) : filteredMenu.length === 0 ? (
          <EmptyState onReset={handleReset} query={searchQuery} />
        ) : (
          <div style={styles.menuGrid}>
            {filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} onClick={() => setSelectedMenu(item)} />
            ))}
          </div>
        )}

      </div>

      {selectedMenu && (
        <div style={styles.modalOverlay} onClick={() => setSelectedMenu(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setSelectedMenu(null)}>×</button>
            <div style={styles.modalImageWrap}>
              <img src={selectedMenu.image_url} alt={selectedMenu.nama} style={styles.modalImage} />
              {selectedMenu.bestseller && <div style={styles.modalBadge}>Best Seller</div>}
            </div>
            <div style={styles.modalInfo}>
              <div style={styles.modalCategory}>{selectedMenu.kategori}</div>
              <h3 style={styles.modalTitle}>{selectedMenu.nama}</h3>
              <p style={styles.modalPrice}>{formatRupiah(selectedMenu.harga)}</p>
              <p style={styles.modalDesc}>{selectedMenu.deskripsi}</p>
            </div>
          </div>
        </div>
      )}

      <footer>2026. Ale's Place Cipoho. All rights reserved</footer>
    </div>
  );
}

function EmptyState({ onReset, query }) {
  return (
    <div style={styles.emptyState}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>
        Menu &quot;{query}&quot; tidak ditemukan
      </p>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        Coba kata kunci lain atau reset filter
      </p>
      <button onClick={onReset} style={styles.resetBtn}>
        Reset Filter
      </button>
    </div>
  );
}

const styles = {
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
  },

  searchWrap: {
    position: 'relative',
    margin: '-40px auto 16px',
    maxWidth: 350,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10,
  },
  searchInput: {
    width: '100%',
    maxWidth: 350,
    padding: '14px 44px 14px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#FAF6F9',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#100A09',
    outline: 'none',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 18,
    cursor: 'pointer',
    color: '#DA251C',
  },

  catScroll: {
    display: 'flex',
    gap: 8,
    padding: '0 20px 16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    scrollbarWidth: 'none',
  },
  catBtn: {
    background: '#FAF6F9',
    border: '2px solid #F0E8E2',
    padding: '8px 16px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    color: '#666',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  catBtnActive: {
    background: '#FFE400',
    borderColor: '#DA7F1C',
    color: '#100A09',
  },

  errorBox: {
    margin: '0 20px 16px',
    padding: '12px 14px',
    borderRadius: 10,
    background: '#FFF4F4',
    border: '1px solid #F4C7C7',
    color: '#B42318',
    fontSize: 13,
  },

  loadingState: {
    textAlign: 'center',
    padding: '36px 20px',
    color: '#666',
    fontSize: 14,
  },

  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
    padding: '0 20px',
    marginBottom: 32,
  },

  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#666',
  },
  resetBtn: {
    background: '#FFE400',
    border: '2px solid #DA7F1C',
    padding: '8px 20px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#100A09',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20,
  },
  modalContent: {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '50%',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  modalImageWrap: {
    width: '100%',
    height: 240,
    background: '#F0E8E2',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    background: '#DA251C',
    color: 'white',
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modalInfo: {
    padding: 24,
  },
  modalCategory: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '1px',
    marginBottom: 8,
  },
  modalTitle: {
    margin: '0 0 8px 0',
    fontSize: 22,
    color: '#100A09',
  },
  modalPrice: {
    margin: '0 0 16px 0',
    fontSize: 18,
    color: '#DA251C',
    fontWeight: 700,
  },
  modalDesc: {
    margin: 0,
    color: '#666',
    fontSize: 14,
    lineHeight: 1.6,
  },
};
