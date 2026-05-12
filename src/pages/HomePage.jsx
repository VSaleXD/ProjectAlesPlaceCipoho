import React, { useEffect, useState } from 'react';
import { menuData, formatRupiah } from '../data/menu';
import { fetchMenu } from '../lib/menuApi';

const ATMOSPHERE_SLIDES = [
  {
    emoji: '☕',
    title: 'Spot Belajar Favorit',
    desc: 'WiFi kencang, colokan tersedia di setiap meja untuk produktivitasmu',
    bg: '#E8D5B7',
  },
  {
    emoji: '🌿',
    title: 'Suasana Cozy & Hangat',
    desc: 'Interior dengan pencahayaan warm yang bikin betah berlama-lama',
    bg: '#DDD0B8',
  },
  {
    emoji: '🎵',
    title: 'Musik Santai Sepanjang Hari',
    desc: 'Playlist lofi & jazz pilihan untuk menemani waktu santaimu',
    bg: '#E5D6C0',
  },
  {
    emoji: '🤝',
    title: 'Promo Mahasiswa',
    desc: 'Student Specials — promo mingguan khusus mahasiswa aktif',
    bg: '#EAD9C2',
  },
];

const CONTACT_INFO = [
  { icon: '📞', label: 'Telepon',          value: '0812-3456-7890' },
  { icon: '📧', label: 'Email',            value: 'alescafe@gmail.com' },
  { icon: '🕐', label: 'Jam Operasional',  value: '10:00 – 22:00 WIB (Setiap Hari)' },
  { icon: '📍', label: 'Lokasi',           value: 'Jl. Cipoho No.1, Ciamis, Jawa Barat' },
];

const WHY_US = [
  {
    emoji: '🏷️',
    title: 'Harga Terjangkau',
    desc: 'Mulai dari Rp18.000 untuk hidangan berkualitas premium',
  },
  {
    emoji: '🛋️',
    title: 'Nyaman',
    desc: 'Tempat duduk luas dengan suasana santai dan cozy',
  },
  {
    emoji: '😋',
    title: 'Enak',
    desc: 'Menu Jepang otentik dengan cita rasa yang disukai lokal',
  },
];

export default function HomePage({ setPage }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuItems, setMenuItems] = useState(menuData);
  const totalSlides = ATMOSPHERE_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      const data = await fetchMenu();
      if (isMounted) {
        setMenuItems(data);
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);

  const bestSellers = menuItems.filter((item) => item.bestseller).slice(0, 3);

  return (
    <div>
      <section style={styles.hero}>
        <div className="hero-overlay" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={styles.heroBadge}>Restoran Jepang halal sukabumi </div>
          <h1 style={styles.heroTitle}>
            Selamat Datang di<br />Ale's Place Cipoho
          </h1>
          <p style={styles.heroDesc}>
            Tempat nongkrong, belajar, dan makan enak dengan harga yang bersahabat
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnYellow} onClick={() => setPage('menu')}>
              🍜 Lihat Menu
            </button>
            <button style={styles.btnOutline} onClick={() => setPage('reservasi')}>
              📅 Reservasi
            </button>
          </div>
        </div>
      </section>

      <div className="section">

        <h2 className="section-title" style={{ marginBottom: 6 }}>Suasana Ale's Place</h2>
        <p className="section-sub">Rasakan kenyamanan tempat nongkrong favoritmu</p>

        <div style={styles.carousel}>
          {ATMOSPHERE_SLIDES.map((slide, i) => (
            <div
              key={i}
              style={{
                ...styles.carouselSlide,
                background: slide.bg,
                opacity: i === activeSlide ? 1 : 0,
                pointerEvents: i === activeSlide ? 'auto' : 'none',
              }}
            >
              <span style={styles.slideEmoji}>{slide.emoji}</span>
              <p style={styles.slideTitle}>{slide.title}</p>
              <p style={styles.slideDesc}>{slide.desc}</p>
            </div>
          ))}


          <button style={{ ...styles.carouselBtn, left: 10 }} onClick={prevSlide} aria-label="Slide sebelumnya">‹</button>
          <button style={{ ...styles.carouselBtn, right: 10 }} onClick={nextSlide} aria-label="Slide berikutnya">›</button>

          <div style={styles.dots}>
            {ATMOSPHERE_SLIDES.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  ...styles.dot,
                  ...(i === activeSlide ? styles.dotActive : {}),
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="section-title">Tentang Ale's Place Cipoho</h2>
        <p className="section-sub">Restoran Jepang lokal dengan nuansa hangat dan harga terjangkau</p>

        <div style={styles.aboutGrid}>
          {[
            { emoji: '🏠', title: 'Suasana Hangat',   desc: 'Desain interior yang cozy untuk bersantai' },
            { emoji: '🎓', title: 'Student-Friendly', desc: 'Harga spesial & promo khusus mahasiswa aktif' },
            { emoji: '📶', title: 'WiFi Gratis',       desc: 'Internet cepat untuk belajar & kerja dari mana saja' },
          ].map((item, i) => (
            <div key={i} style={styles.aboutCard}>
              <div style={styles.aboutEmoji}>{item.emoji}</div>
              <h4 style={styles.aboutTitle}>{item.title}</h4>
              <p style={styles.aboutDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: 24 }}>Kenapa Ale's Place?</h2>
        <p className="section-sub">Tiga alasan utama pelanggan setia kami</p>

        <div style={styles.whyGrid}>
          {WHY_US.map((w, i) => (
            <div key={i} style={styles.whyItem}>
              <div style={styles.whyCircle}>
                <span style={{ fontSize: 26 }}>{w.emoji}</span>
              </div>
              <h4 style={styles.whyTitle}>{w.title}</h4>
              <p style={styles.whyDesc}>{w.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: 32 }}>Our Best Seller Menu</h2>
        <p className="section-sub">Menu favorit pelanggan setia kami</p>

        <div style={styles.bsGrid}>
          {bestSellers.map((m) => (
            <div key={m.id} style={styles.bsCard}>
              <div style={styles.bsImg}>{m.emoji}</div>
              <div style={styles.bsInfo}>
                <h4 style={styles.bsName}>{m.nama}</h4>
                <p style={styles.bsPrice}>{formatRupiah(m.harga)}</p>
                <p style={styles.bsDesc}>{m.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 32 }}>
          <button
            style={{ ...styles.btnYellow, background: '#DA251C', color: 'white' }}
            onClick={() => setPage('menu')}
          >
            Lihat Semua Menu →
          </button>
        </div>

        <div style={styles.mapPlaceholder}>
          <span style={{ fontSize: 32 }}>📍</span>
          <p style={{ fontWeight: 700, fontSize: 14, color: '#100A09' }}>Lokasi Ale's Place Cipoho</p>
          <p style={{ fontSize: 13, color: '#666' }}>Jl. Cipoho No.1, Ciamis, Jawa Barat</p>
        </div>

        <h2 className="section-title">Kontak &amp; Jam Operasional</h2>

        <div style={styles.contactGrid}>
          {CONTACT_INFO.map((c, i) => (
            <div key={i} style={styles.contactItem}>
              <div style={styles.contactIcon}>{c.icon}</div>
              <div>
                <h4 style={styles.contactLabel}>{c.label}</h4>
                <p style={styles.contactValue}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <footer>2026. Ale's Place Cipoho. All rights reserved</footer>
    </div>
  );
}

const styles = {
  hero: {
    backgroundImage: "url('https://via.placeholder.com/1600x900/DA251C/ffffff?text=Ale%27s+Place')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '80px 24px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 520,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: 'uppercase',
    padding: '6px 16px',
    borderRadius: 20,
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(26px, 5vw, 44px)',
    fontWeight: 800,
    color: 'white',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    maxWidth: 400,
    margin: '0 auto 24px',
    lineHeight: 1.6,
  },
  heroBtns: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnYellow: {
    background: '#FFE400',
    color: '#100A09',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 25,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  btnOutline: {
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.6)',
    padding: '12px 24px',
    borderRadius: 25,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },

  carousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 36,
    height: 200,
    background: '#F0E8E2',
  },
  carouselSlide: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.6s ease',
    padding: '16px 56px',
    textAlign: 'center',
  },
  slideEmoji: { fontSize: 48, marginBottom: 8, display: 'block' },
  slideTitle: { fontWeight: 700, fontSize: 15, color: '#100A09', marginBottom: 4 },
  slideDesc:  { fontSize: 13, color: '#666', lineHeight: 1.5 },
  carouselBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(218,37,28,0.8)',
    color: 'white',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: '50%',
    fontSize: 20,
    cursor: 'pointer',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.25s',
  },
  dotActive: {
    background: 'white',
    width: 20,
    borderRadius: 4,
  },

  /* About Grid */
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
    marginBottom: 32,
  },
  aboutCard: {
    background: '#FAF6F9',
    borderRadius: 12,
    padding: '18px 14px',
    textAlign: 'center',
    border: '1px solid rgba(218,127,28,0.3)',
  },
  aboutEmoji: { fontSize: 30, marginBottom: 8 },
  aboutTitle: { fontSize: 13, fontWeight: 700, color: '#100A09', marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  aboutDesc:  { fontSize: 12, color: '#666', lineHeight: 1.4 },

  /* Why Grid */
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 16,
  },
  whyItem: { textAlign: 'center' },
  whyCircle: {
    width: 88,
    height: 88,
    background: '#FFE400',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px',
  },
  whyTitle: { fontSize: 12, fontWeight: 700, color: '#100A09', marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  whyDesc:  { fontSize: 11, color: '#666', lineHeight: 1.4 },

  /* Best Seller Grid */
  bsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  bsCard: {
    background: '#FAF6F9',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(218,127,28,0.3)',
  },
  bsImg:   { background: '#F0E8E2', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 },
  bsInfo:  { padding: 10 },
  bsName:  { fontSize: 11, fontWeight: 700, color: '#100A09', marginBottom: 3, fontFamily: "'DM Sans', sans-serif" },
  bsPrice: { fontSize: 11, color: '#DA251C', fontWeight: 700 },
  bsDesc:  { fontSize: 10, color: '#888', marginTop: 2, lineHeight: 1.4 },

  /* Map */
  mapPlaceholder: {
    background: '#F0E8E2',
    borderRadius: 12,
    height: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: '1px solid #DA7F1C',
    marginBottom: 28,
  },

  /* Contact */
  contactGrid: { display: 'grid', gap: 12, marginTop: 16 },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: '#FAF6F9',
    padding: '14px 16px',
    borderRadius: 10,
    border: '1px solid rgba(218,127,28,0.2)',
  },
  contactIcon: {
    width: 38,
    height: 38,
    background: '#DA251C',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#100A09',
    fontWeight: 500,
  },
};
