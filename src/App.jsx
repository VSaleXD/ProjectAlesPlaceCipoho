import React from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import MenuPage      from './pages/MenuPage';
import ReservasiPage from './pages/ReservasiPage';
import AdminPage     from './pages/AdminPage';
import './styles/index.css';

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const setPage = (page) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8' }}>
      <Navbar page={currentPage} setPage={setPage} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} />} />
          <Route path="/home" element={<HomePage setPage={setPage} />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservasi" element={<ReservasiPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
