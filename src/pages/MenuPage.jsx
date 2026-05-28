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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Reset page to 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

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

  const paginatedMenu = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMenu.slice(startIndex, endIndex);
  }, [filteredMenu, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMenu.length / itemsPerPage);
  }, [filteredMenu, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById('menu-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

      <div id="menu-section" style={{ paddingBottom: 40 }}>
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
          <>
            <div style={styles.menuGrid}>
              {paginatedMenu.map((item) => (
                <MenuCard key={item.id} item={item} onClick={() => setSelectedMenu(item)} />
              ))}
            </div>

            {/* Premium Pagination Controls */}
            {filteredMenu.length > 0 && (
              <div style={styles.paginationSection}>
                <div style={styles.paginationInfo}>
                  Menampilkan <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredMenu.length)}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredMenu.length)}</strong> dari <strong>{filteredMenu.length}</strong> menu
                </div>

                <div style={styles.paginationControlsWrap}>
                  {totalPages > 1 && (
                    <div style={styles.paginationPages}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                        style={{
                          ...styles.pageBtn,
                          ...(currentPage === 1 ? styles.pageBtnDisabled : {}),
                        }}
                        aria-label="Halaman sebelumnya"
                      >
                        &larr; Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className="pagination-btn"
                          style={{
                            ...styles.pageBtn,
                            ...(currentPage === page ? styles.pageBtnActive : {}),
                          }}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                        style={{
                          ...styles.pageBtn,
                          ...(currentPage === totalPages ? styles.pageBtnDisabled : {}),
                        }}
                        aria-label="Halaman selanjutnya"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
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

// Styles consistent with HomePage and ReservasiPage
const styles = {
  header: {
    background: '#F5EBDD',
    padding: '40px 20px 80px',
    textAlign: 'center',
    color: '#100A09',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 12,
  },
  headerSub: {
    color: '#666',
    fontSize: 15,
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
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    color: '#555',
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
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
  },

  loadingState: {
    textAlign: 'center',
    padding: '36px 20px',
    color: '#666',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'DM Sans', sans-serif",
  },
  resetBtn: {
    background: '#FFE400',
    border: '2px solid #DA7F1C',
    padding: '8px 20px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
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
  paginationSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    margin: '32px 20px 0',
    padding: '24px 20px',
    background: '#FAF6F9',
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    border: '2px solid #F0E8E2',
  },
  paginationInfo: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  paginationControlsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  paginationPages: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pageBtn: {
    background: '#ffffff',
    border: '1px solid #E0D5CD',
    borderRadius: 8,
    minWidth: 40,
    height: 40,
    padding: '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#443F3D',
    cursor: 'pointer',
    outline: 'none',
  },
  pageBtnActive: {
    background: '#DA251C',
    borderColor: '#DA251C',
    color: '#ffffff',
  },
  pageBtnDisabled: {
    background: '#EAE5E2',
    borderColor: '#EAE5E2',
    color: '#A09792',
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: 0.6,
  },
  itemsPerPageWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  itemsPerPageLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: '#666',
  },
  itemsPerPageSelect: {
    background: '#ffffff',
    border: '1px solid #E0D5CD',
    borderRadius: 8,
    padding: '8px 12px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: '#443F3D',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
};
