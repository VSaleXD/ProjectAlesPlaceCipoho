import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminLoginPage({ session, authReady }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authReady && session) {
      navigate('/admin', { replace: true });
    }
  }, [authReady, navigate, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;

      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal login admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        <h1 style={{ ...styles.title, color: '#DA251C' }}>Admin Access</h1>
        <p style={styles.text}>Masuk pakai email dan password admin</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alesplacecipoho.com"
              style={styles.input}
              autoComplete="email"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              style={styles.input}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: 'calc(100vh - 88px)',
    display: 'grid',
    placeItems: 'center',
    padding: '32px 20px',
    background: 'linear-gradient(180deg, #FFF9EF 0%, #F5EDD8 100%)',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: '#fff',
    borderRadius: 24,
    padding: 28,
    border: '1px solid rgba(218, 127, 28, 0.18)',
    boxShadow: '0 18px 40px rgba(16, 10, 9, 0.10)',
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#DA7F1C',
  },
  title: {
    margin: '8px 0 8px',
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 38px)',
    color: '#100A09',
  },
  text: {
    margin: '0 0 18px',
    color: '#666',
    lineHeight: 1.6,
    fontSize: 14,
  },
  errorBox: {
    background: '#FFF4F4',
    border: '1px solid #F4C7C7',
    color: '#DA251C',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 13,
  },
  form: {
    display: 'grid',
    gap: 14,
  },
  label: {
    display: 'grid',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #DDD',
    background: '#FAF6F9',
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  },
  button: {
    marginTop: 4,
    border: 'none',
    borderRadius: 14,
    padding: '12px 16px',
    background: '#DA251C',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(218, 37, 28, 0.22)',
  },
};