import React from 'react';
const NAV_ITEMS = [
  ['home',      'Beranda'],
  ['menu',      'Menu'],
  ['reservasi', 'Reservasi'],
];

export default function Navbar({ page, setPage }) {
  return (
    <nav style={styles.nav}>
      <div
        style={styles.logoWrap}
        onClick={() => setPage('home')}
        role="button"
        tabIndex={0}
        aria-label="Ke halaman beranda"
        onKeyDown={(e) => e.key === 'Enter' && setPage('home')}
      >
        <div style={styles.logoCircle}>A</div>
        <span style={styles.brandName}>Ale's Place Cipoho</span>
      </div>

      <div style={styles.navLinks}>
        {NAV_ITEMS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              ...styles.navLink,
              ...(page === key ? styles.navLinkActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#FFE400',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '2px solid #DA7F1C',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  logoCircle: {
    width: 40,
    height: 40,
    background: '#DA251C',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 800,
    fontSize: 15,
    flexShrink: 0,
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    color: '#100A09',
  },
  navLinks: {
    display: 'flex',
    gap: 6,
  },
  navLink: {
    background: 'none',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    color: '#100A09',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    background: '#DA251C',
    color: 'white',
  },
};
