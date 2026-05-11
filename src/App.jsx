import React, { useState } from 'react';
import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import MenuPage      from './pages/MenuPage';
import ReservasiPage from './pages/ReservasiPage';
import './styles/index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const setPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Navbar page={currentPage} setPage={setPage} />

      <main>
        {renderPage()}
      </main>
    </div>
  );
}
