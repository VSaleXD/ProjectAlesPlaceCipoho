/**
 * MenuPage.jsx — Halaman Katalog Menu
 *
 * Fitur:
 *  - Carousel horizontal Best Seller di bagian atas
 *  - Search bar real-time untuk mencari menu berdasarkan nama/kategori
 *  - Filter kategori (pill buttons) dengan scroll horizontal
 *  - Grid 2 kolom daftar menu dengan MenuCard
 *  - Empty state jika pencarian tidak ditemukan
 *
 * State:
 *  - activeCategory: kategori yang sedang aktif difilter
 *  - searchQuery: teks pencarian dari input user
 */

import React, { useState, useMemo } from 'react';
import { menuData, CATEGORIES, getBestSellers, formatRupiah } from '../data/menu';
import MenuCard from '../components/MenuCard';

export default function MenuPage() {
  // State filter kategori — default 'Semua'
  const [activeCategory, setActiveCategory] = useState('Semua');

  // State pencarian teks real-time
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * filteredMenu — Computed list menu berdasarkan kategori + search query.
   * Menggunakan useMemo agar tidak re-render jika state lain berubah.
   */
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

  // Daftar bestseller untuk carousel atas
  const bestSellers = getBestSellers();

  // Reset semua filter ke default
  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('Semua');
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Menu Kami</h2>
        <p style={styles.headerSub}>
          Temukan hidangan favorit Anda — semua harga tertera transparan
        </p>
      </div>

      <div style={{ paddingBottom: 40 }}>

        {/* ── SEARCH BAR ── */}
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

        {/* ── BESTSELLER CAROUSEL ── */}
        <div style={styles.sectionLabel}>Best Seller</div>
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
        </div>

        {/* ── FILTER KATEGORI ── */}
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

        {/* ── MENU GRID atau EMPTY STATE ── */}
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

/**
 * EmptyState — Tampilan saat tidak ada menu yang cocok dengan pencarian
 */
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

/* ── Styles ── */
const styles = {
  header: {
    background: 'linear-gradient(135deg, #C0392B, #8B2018)',
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
    margin: '-20px 20px 16px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 44px 14px 16px',
    borderRadius: 12,
    border: 'none',
    background: '#FDF8EF',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#2C1810',
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
    color: '#C0392B',
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
    background: '#FDF8EF',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 110,
    flexShrink: 0,
    border: '1px solid rgba(212,168,67,0.3)',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  bsImg: {
    background: '#E8D5B7',
    height: 76,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  bsInfo:  { padding: 8 },
  bsName:  { fontSize: 11, fontWeight: 700, color: '#2C1810', fontFamily: "'DM Sans', sans-serif" },
  bsPrice: { fontSize: 11, color: '#C0392B', fontWeight: 700, marginTop: 2 },

  catScroll: {
    display: 'flex',
    gap: 8,
    padding: '0 20px 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  catBtn: {
    background: '#FDF8EF',
    border: '2px solid #E8D5B7',
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
    background: '#F5D97A',
    borderColor: '#D4A843',
    color: '#2C1810',
  },

  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
    background: '#F5D97A',
    border: '2px solid #D4A843',
    padding: '8px 20px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#2C1810',
  },
};
