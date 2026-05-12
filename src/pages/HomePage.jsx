import React, { useEffect, useState } from 'react';
import { menuData, formatRupiah } from '../data/menu';
import { SITE_PHOTOS, getMenuImage } from '../data/photos';

const ATMOSPHERE_SLIDES = [
  {
    title: 'Spot Belajar Favorit',
    desc: 'WiFi kencang, colokan tersedia di setiap meja untuk produktivitasmu',
    bg: '#E8D5B7',
    image: SITE_PHOTOS.atmosphere[0],
  },
  {
    title: 'Suasana Cozy & Hangat',
    desc: 'Interior dengan pencahayaan warm yang bikin betah berlama-lama',
    bg: '#DDD0B8',
    image: SITE_PHOTOS.atmosphere[1],
  },
  {
    title: 'Musik Santai Sepanjang Hari',
    desc: 'Playlist lofi & jazz pilihan untuk menemani waktu santaimu',
    bg: '#E5D6C0',
    image: SITE_PHOTOS.atmosphere[2],
  },
  {
    title: 'Promo Mahasiswa',
    desc: 'Student Specials — promo mingguan khusus mahasiswa aktif',
    bg: '#EAD9C2',
    image: SITE_PHOTOS.atmosphere[3],
  },
];

const CONTACT_INFO = [
  {
    image: SITE_PHOTOS.map,
    text: 'Perumahan Cipoho Indah, Jl. Gamelan No.2, Cikondang, Kec. Citamiang, Kota Sukabumi, Jawa Barat 43142',
  },
  {
    image: SITE_PHOTOS.about[0],
    text: 'Senin – Jumat: 11:00 – 21:00 WIB',
  },
  {
    image: SITE_PHOTOS.about[1],
    text: 'Sabtu – Minggu dan tanggal merah: 10:00 – 21:00 WIB',
  },
  {
    image: SITE_PHOTOS.about[2],
    text: '0815-7215-5275 (WhatsApp)',
  },
];

const WHY_US = [
  {
    title: 'Harga Terjangkau',
    desc: 'Mulai dari Rp18.000 untuk hidangan berkualitas premium',
    image: SITE_PHOTOS.why[0],
  },
  {
    title: 'Nyaman',
    desc: 'Tempat duduk luas dengan suasana santai dan cozy',
    image: SITE_PHOTOS.why[1],
  },
  {
    title: 'Enak',
    desc: 'Menu Jepang otentik dengan cita rasa yang disukai lokal',
    image: SITE_PHOTOS.why[2],
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
    setMenuItems(menuData);
  }, []);

  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);

  const bestSellers = menuItems.filter((item) => item.bestseller).slice(0, 3);

  return (
    <div>
      <section style={styles.hero}>
        <div className="hero-overlay" />
        <div style={styles.heroPhotoWrap}>
          <img src={SITE_PHOTOS.hero} alt="Ale's Place Cipoho" style={styles.heroPhoto} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={styles.heroBadge}>Restoran Jepang halal Sukabumi</div>
          <h1 style={styles.heroTitle}>
            Selamat Datang di<br />Ale&apos;s Place Cipoho
          </h1>
          <p style={styles.heroDesc}>
            Tempat nongkrong, belajar, dan makan enak dengan harga yang bersahabat
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnYellow} onClick={() => setPage('menu')}>Lihat Menu</button>
            <button style={styles.btnOutline} onClick={() => setPage('reservasi')}>Reservasi</button>
          </div>
        </div>
      </section>

      <div className="section">
        <h2 className="section-title" style={{ marginBottom: 6 }}>Suasana Ale&apos;s Place</h2>
        <p className="section-sub">Rasakan kenyamanan tempat nongkrong favoritmu</p>

        <div style={styles.carousel}>
          {ATMOSPHERE_SLIDES.map((slide, index) => (
            <div
              key={slide.title}
              style={{
                ...styles.carouselSlide,
                background: slide.bg,
                opacity: index === activeSlide ? 1 : 0,
                pointerEvents: index === activeSlide ? 'auto' : 'none',
              }}
            >
              <img src={slide.image} alt={slide.title} style={styles.slideImage} />
              <p style={styles.slideTitle}>{slide.title}</p>
              <p style={styles.slideDesc}>{slide.desc}</p>
            </div>
          ))}

          <button style={{ ...styles.carouselBtn, left: 10 }} onClick={prevSlide} aria-label="Slide sebelumnya">‹</button>
          <button style={{ ...styles.carouselBtn, right: 10 }} onClick={nextSlide} aria-label="Slide berikutnya">›</button>

          <div style={styles.dots}>
            {ATMOSPHERE_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                style={{
                  ...styles.dot,
                  ...(index === activeSlide ? styles.dotActive : {}),
                }}
                aria-label={`Lihat slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <h2 className="section-title">Tentang Ale&apos;s Place Cipoho</h2>
        <p className="section-sub">Restoran Jepang lokal dengan nuansa hangat dan harga terjangkau</p>

        <div style={styles.aboutGrid}>
          {[
            { image: SITE_PHOTOS.about[0], title: 'Suasana Hangat', desc: 'Desain interior yang cozy untuk bersantai' },
            { image: SITE_PHOTOS.about[1], title: 'Student-Friendly', desc: 'Harga spesial & promo khusus mahasiswa aktif' },
            { image: SITE_PHOTOS.about[2], title: 'WiFi Gratis', desc: 'Internet cepat untuk belajar & kerja dari mana saja' },
          ].map((item) => (
            <div key={item.title} style={styles.aboutCard}>
              <img src={item.image} alt={item.title} style={styles.aboutImage} />
              <h4 style={styles.aboutTitle}>{item.title}</h4>
              <p style={styles.aboutDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: 24 }}>Kenapa Ale&apos;s Place?</h2>
        <p className="section-sub">Tiga alasan utama pelanggan setia kami</p>

        <div style={styles.whyGrid}>
          {WHY_US.map((item) => (
            <div key={item.title} style={styles.whyItem}>
              <img src={item.image} alt={item.title} style={styles.whyImage} />
              <h4 style={styles.whyTitle}>{item.title}</h4>
              <p style={styles.whyDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: 32 }}>Our Best Seller Menu</h2>
        <p className="section-sub">Menu favorit pelanggan setia kami</p>

        <div style={styles.bsGrid}>
          {bestSellers.map((item) => (
            <div key={item.id} style={styles.bsCard}>
              <img src={item.image || getMenuImage(item)} alt={item.nama} style={styles.bsImage} />
              <div style={styles.bsInfo}>
                <h4 style={styles.bsName}>{item.nama}</h4>
                <p style={styles.bsPrice}>{formatRupiah(item.harga)}</p>
                <p style={styles.bsDesc}>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.centerAction}>
          <button style={{ ...styles.btnYellow, background: '#DA251C', color: 'white' }} onClick={() => setPage('menu')}>
            Lihat Semua Menu
          </button>
        </div>

        <div style={styles.mapPlaceholder}>
          <img src={SITE_PHOTOS.map} alt="Lokasi Ale's Place Cipoho" style={styles.mapImage} />
          <p style={styles.mapTitle}>Lokasi Ale&apos;s Place Cipoho</p>
          <p style={styles.mapSub}>Jl. Cipoho No.1, Ciamis, Jawa Barat</p>
        </div>

        <h2 className="section-title">Kontak &amp; Jam Operasional</h2>

        <div style={styles.contactGrid}>
          {CONTACT_INFO.map((item) => (
            <div key={item.text} style={styles.contactItem}>
              <img src={item.image} alt="Info" style={styles.contactImage} />
              <p style={styles.contactValue}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <footer>2026. Ale&apos;s Place Cipoho. All rights reserved</footer>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #DA251C, #8F1D1B)',
    padding: '56px 24px 40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 540,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  heroPhotoWrap: {
    width: '100%',
    maxWidth: 920,
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.24)',
  },
  heroPhoto: {
    width: '100%',
    height: 280,
    objectFit: 'cover',
    display: 'block',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.18)',
    color: 'white',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    padding: '6px 16px',
    borderRadius: 999,
    marginBottom: 14,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(30px, 5vw, 48px)',
    fontWeight: 800,
    color: 'white',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    maxWidth: 440,
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
    borderRadius: 999,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  btnOutline: {
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.6)',
    padding: '12px 24px',
    borderRadius: 999,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  carousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 18,
    marginBottom: 36,
    minHeight: 240,
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
  slideImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 18,
    marginBottom: 10,
    display: 'block',
  },
  slideTitle: { fontWeight: 700, fontSize: 16, color: '#100A09', marginBottom: 4 },
  slideDesc: { fontSize: 13, color: '#666', lineHeight: 1.5 },
  carouselBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(218,37,28,0.85)',
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
    border: 'none',
    cursor: 'pointer',
  },
  dotActive: {
    background: 'white',
    width: 20,
    borderRadius: 4,
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
    marginBottom: 32,
  },
  aboutCard: {
    background: '#FAF6F9',
    borderRadius: 14,
    padding: 14,
    textAlign: 'center',
    border: '1px solid rgba(218,127,28,0.3)',
  },
  aboutImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif",
  },
  aboutDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 1.4,
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 16,
  },
  whyItem: { textAlign: 'center' },
  whyImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    borderRadius: 16,
    marginBottom: 10,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif",
  },
  whyDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 1.4,
  },
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
  bsImage: {
    width: '100%',
    height: 90,
    objectFit: 'cover',
    display: 'block',
  },
  bsInfo: { padding: 10 },
  bsName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 3,
    fontFamily: "'DM Sans', sans-serif",
  },
  bsPrice: { fontSize: 11, color: '#DA251C', fontWeight: 700 },
  bsDesc: { fontSize: 10, color: '#888', marginTop: 2, lineHeight: 1.4 },
  centerAction: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  mapPlaceholder: {
    background: '#F0E8E2',
    borderRadius: 12,
    padding: 12,
    textAlign: 'center',
    border: '1px solid #DA7F1C',
    marginBottom: 28,
  },
  mapImage: {
    width: '100%',
    height: 170,
    objectFit: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  mapTitle: { fontWeight: 700, fontSize: 14, color: '#100A09' },
  mapSub: { fontSize: 12, color: '#666' },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
    marginBottom: 24,
  },
  contactItem: {
    background: '#fff',
    borderRadius: 14,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 10px 26px rgba(0,0,0,0.04)',
  },
  contactImage: {
    width: 42,
    height: 42,
    borderRadius: 14,
    objectFit: 'cover',
    flexShrink: 0,
  },
  contactValue: {
    margin: 0,
    fontSize: 13,
    color: '#666',
    lineHeight: 1.5,
  },
};
