import React from 'react';
import { formatRupiah } from '../data/menu';

export default function MenuCard({ item, onClick }) {
  const { nama, harga, deskripsi, bestseller, image_url } = item;

  return (
    <div style={{ ...styles.card, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={styles.imageWrap}>
        {bestseller && (
          <div style={styles.badge}>Best</div>
        )}
        <img src={image_url} alt={nama} style={styles.image} loading="lazy" />
      </div>

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
    background: '#FAF6F9',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(218,127,28,0.25)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  imageWrap: {
    background: '#F0E8E2',
    height: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    background: '#DA251C',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    padding: 12,
  },
  nama: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#DA251C',
    marginBottom: 3,
  },
  harga: {
    fontSize: 13,
    color: '#DA251C',
    fontWeight: 700,
  },
  deskripsi: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
