import React from 'react';

const NAV_ITEMS = [
  ['home', 'Beranda'],
  ['menu', 'Menu'],
  ['reservasi', 'Reservasi'],
];

export default function Navbar({ page, setPage }) {
  return (
    <header className="site-nav" role="navigation" aria-label="Main navigation">
      <div
        className="nav-brand"
        onClick={() => setPage('home')}
        role="button"
        tabIndex={0}
        aria-label="Ke halaman beranda"
        onKeyDown={(e) => e.key === 'Enter' && setPage('home')}
      >
        <img src="logo.jpg" alt="Logo Ale's Place Cipoho" />
        <div className="brand-name">Ale's Place Cipoho</div>
      </div>

      <nav className="nav-links" aria-label="Primary">
        {NAV_ITEMS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`nav-link ${page === key ? 'active' : ''}`}
            aria-current={page === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

    </header>
  );
}
