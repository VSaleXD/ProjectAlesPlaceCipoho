import React, { useEffect, useMemo, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { fetchMenu } from '../lib/menuApi';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      try {
        setLoading(true);
        const data = await fetchMenu();
        if (!isMounted) return;
        setMenuItems(data);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError('Gagal memuat menu. Pastikan backend berjalan di http://localhost:3001');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
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
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>

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
    background: 'linear-gradient(135deg, #DA251C, #8F1D1B)',
    padding: '32px 24px',
    textAlign: 'center',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    color: 'white',
    marginBottom: 6,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
  },

  searchWrap: {
    position: 'relative',
    margin: '-20px auto 16px',
    maxWidth: 350,
    display: 'flex',
    justifyContent: 'center',
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
};
