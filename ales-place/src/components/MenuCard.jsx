/**
 * MenuCard.jsx — Komponen kartu menu individual
 * Digunakan di halaman Menu untuk menampilkan setiap item.
 * Props:
 *   - item: object menu (id, nama, harga, kategori, deskripsi, emoji, bestseller)
 */

import React from 'react';
import { formatRupiah } from '../data/menu';

export default function MenuCard({ item }) {
  const { nama, harga, deskripsi, emoji, bestseller } = item;

  return (
    <div style={styles.card}>
      {/* Gambar / Emoji placeholder */}
      <div style={styles.imageWrap}>
        {bestseller && (
          <div style={styles.badge}>⭐ Best</div>
        )}
        <span style={styles.emoji}>{emoji}</span>
      </div>

      {/* Info menu */}
      <div style={styles.info}>
        <h3 style={styles.nama}>{nama}</h3>
        <p style={styles.harga}>{formatRupiah(harga)}</p>
        <p style={styles.deskripsi}>{deskripsi}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#FDF8EF',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(212,168,67,0.25)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  imageWrap: {
    background: '#E8D5B7',
    height: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    background: '#C0392B',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  emoji: {
    fontSize: 44,
  },
  info: {
    padding: 12,
  },
  nama: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#C0392B',
    marginBottom: 3,
  },
  harga: {
    fontSize: 13,
    color: '#C0392B',
    fontWeight: 700,
  },
  deskripsi: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    lineHeight: 1.4,
  },
};
