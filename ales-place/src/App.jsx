/**
 * App.jsx — Root component Ale's Place Cipoho
 *
 * Mengatur routing sederhana berbasis useState (tanpa React Router).
 * Render Navbar dan halaman aktif berdasarkan state `currentPage`.
 *
 * Pages:
 *  - 'home'      → HomePage
 *  - 'menu'      → MenuPage
 *  - 'reservasi' → ReservasiPage
 */

import React, { useState } from 'react';
import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import MenuPage      from './pages/MenuPage';
import ReservasiPage from './pages/ReservasiPage';
import './styles/index.css';

export default function App() {
  // State navigasi — default halaman beranda
  const [currentPage, setCurrentPage] = useState('home');

  /**
   * setPage — Handler navigasi antar halaman.
   * Di-pass ke Navbar dan CTA buttons di setiap halaman.
   * Juga scroll ke atas saat pindah halaman.
   */
  const setPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render halaman aktif berdasarkan currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuPage />;
      case 'reservasi':
        return <ReservasiPage />;
      case 'home':
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8' }}>
      {/* Navigasi sticky di atas */}
      <Navbar page={currentPage} setPage={setPage} />

      {/* Konten halaman aktif */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}
