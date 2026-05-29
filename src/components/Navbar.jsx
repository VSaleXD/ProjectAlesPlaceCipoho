import React, { useState } from 'react';

const NAV_ITEMS = [
  ['home', 'Beranda'],
  ['menu', 'Menu'],
  ['reservasi', 'Reservasi'],
];

export default function Navbar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (nextPage) => {
    setMenuOpen(false);
    setPage(nextPage);
  };

  return (
    <header className="site-nav" role="navigation" aria-label="Main navigation">
      <div
        className="nav-brand"
        onClick={() => handleNavigate('home')}
        role="button"
        tabIndex={0}
        aria-label="Ke halaman beranda"
        onKeyDown={(e) => e.key === 'Enter' && handleNavigate('home')}
      >
        <img src="logo.jpg" alt="Logo Ale's Place Cipoho" />
        <div className="brand-name">Ale's Place Cipoho</div>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Buka menu navigasi"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
        {NAV_ITEMS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleNavigate(key)}
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
