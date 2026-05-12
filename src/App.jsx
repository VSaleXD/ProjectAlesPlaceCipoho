import React, { useState, useEffect } from 'react';
import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import MenuPage      from './pages/MenuPage';
import ReservasiPage from './pages/ReservasiPage';
import AdminPage     from './pages/AdminPage';
import './styles/index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      const page = hash.startsWith('/') ? hash.slice(1) : hash;
      setCurrentPage(page || 'home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setPage = (page) => {
    window.location.hash = page === 'home' ? '' : `/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuPage />;
      case 'reservasi':
        return <ReservasiPage />;
      case 'admin':
        return <AdminPage />;
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
