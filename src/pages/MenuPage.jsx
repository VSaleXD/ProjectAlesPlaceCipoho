import React, { useState, useMemo } from 'react';
import { menuData, CATEGORIES, getBestSellers, formatRupiah } from '../data/menu';
import MenuCard from '../components/MenuCard';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return menuData.filter((item) => {
      const matchCategory =
        activeCategory === 'Semua' || item.kategori === activeCategory;
      const matchSearch =
        !query ||
        item.nama.toLowerCase().includes(query) ||
        item.kategori.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const bestSellers = getBestSellers();

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

        {/* <div style={styles.sectionLabel}>Best Seller</div>
        <div style={styles.bsScroll}>
          {bestSellers.map((item) => (
            <div
              key={item.id}
              style={styles.bsCard}
              onClick={() => {
                setActiveCategory(item.kategori);
                setSearchQuery('');
              }}
              title={`Filter: ${item.kategori}`}
            >
              <div style={styles.bsImg}>{item.emoji}</div>
              <div style={styles.bsInfo}>
                <h4 style={styles.bsName}>
                  {item.nama.split(' ').slice(0, 3).join(' ')}
                </h4>
                <p style={styles.bsPrice}>{formatRupiah(item.harga)}</p>
              </div>
            </div>
          ))}
        </div> */}

        <div style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
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

        {filteredMenu.length === 0 ? (
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

  sectionLabel: {
    padding: '12px 20px 4px',
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  bsScroll: {
    display: 'flex',
    gap: 12,
    padding: '0 20px 4px',
    overflowX: 'auto',
    marginBottom: 16,
    scrollbarWidth: 'none',
  },
  bsCard: {
    background: '#FAF6F9',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 110,
    flexShrink: 0,
    border: '1px solid rgba(218,127,28,0.3)',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  bsImg: {
    background: '#F0E8E2',
    height: 76,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  bsInfo:  { padding: 8 },
  bsName:  { fontSize: 11, fontWeight: 700, color: '#100A09', fontFamily: "'DM Sans', sans-serif" },
  bsPrice: { fontSize: 11, color: '#DA251C', fontWeight: 700, marginTop: 2 },

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
