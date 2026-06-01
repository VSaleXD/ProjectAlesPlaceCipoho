import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import JapaneseCloudBg from './components/JapaneseCloudBg';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservasiPage from './pages/ReservasiPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import './styles/index.css';

function AuthGate({ session, authReady, children }) {
  if (!authReady) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 24, color: '#666' }}>
        Memuat sesi admin...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const setPage = (page) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', position: 'relative' }}>
      <JapaneseCloudBg />
      <Navbar page={currentPage} setPage={setPage} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} />} />
          <Route path="/home" element={<HomePage setPage={setPage} />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservasi" element={<ReservasiPage />} />
          <Route path="/admin/login" element={<AdminLoginPage session={session} authReady={authReady} />} />
          <Route
            path="/admin"
            element={(
              <AuthGate session={session} authReady={authReady}>
                <AdminPage session={session} setSession={setSession} />
              </AuthGate>
            )}
          />
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
