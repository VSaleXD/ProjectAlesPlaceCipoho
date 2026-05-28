import React, { useEffect, useState } from 'react';
import { formatRupiah } from '../data/menu';
import { supabase } from '../supabaseClient';
import { ICON_PHOTOS, SITE_PHOTOS } from '../data/photos';

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


const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    review: 'Ramennya luar biasa! Kuahnya sangat kental dan gurih. Tempatnya juga sangat nyaman untuk nugas karena WiFi-nya kencang.',
    rating: '⭐⭐⭐⭐⭐'
  },
  {
    name: 'Siti Aminah',
    review: 'Suka banget sama suasana di sini. Harga ramah di kantong mahasiswa tapi rasa makanannya sekelas restoran mewah di mall.',
    rating: '⭐⭐⭐⭐⭐'
  },
  {
    name: 'Reza Rahadian',
    review: 'Sushi dan Gyoza-nya sangat enak. Pelayanannya cepat dan ramah. Bakal sering balik ke sini buat makan bareng keluarga.',
    rating: '⭐⭐⭐⭐⭐'
  }
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/alesplacecipoho',
    icon: ICON_PHOTOS.instagram,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@alesplacecipoho',
    icon: ICON_PHOTOS.tiktok,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/6281572155275',
    icon: ICON_PHOTOS.whatsapp,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/alesplacecipoho',
    icon: ICON_PHOTOS.facebook,
  },
];

export default function HomePage({ setPage }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const totalSlides = ATMOSPHERE_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('bestseller', true)
        .limit(4); 
      if (data) {
        setMenuItems(data);
      }
    };
    fetchBestSellers();
  }, []);

  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);

  const bestSellers = menuItems;

  return (
    <div>
      {/* Full-width Hero Section */}
      <section style={{ ...styles.heroFull, backgroundImage: `url(${SITE_PHOTOS.hero})` }}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Restoran Jepang Halal Sukabumi</div>
          <h1 style={styles.heroTitle}>
            Selamat Datang di<br />Ale&apos;s Place Cipoho
          </h1>
          <p style={styles.heroDesc}>
            Tempat nongkrong, belajar, dan makan enak dengan harga yang bersahabat. Nikmati pengalaman kuliner Jepang terbaik di kota.
          </p>
        </div>
      </section>

      <div style={styles.container}>

        {/* Suasana Section */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Suasana Ale&apos;s Place Cipoho</h2>
          <p style={styles.sectionSub}>Rasakan kenyamanan tempat nongkrong favoritmu</p>
        </div>

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
            </div>
          ))}

          <button style={{ ...styles.carouselBtn, left: 16 }} onClick={prevSlide} aria-label="Slide sebelumnya">‹</button>
          <button style={{ ...styles.carouselBtn, right: 16 }} onClick={nextSlide} aria-label="Slide berikutnya">›</button>

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

        {/* Tentang Section */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Tentang Ale&apos;s Place Cipoho</h2>
          <p style={styles.sectionSub}>Restoran Jepang lokal dengan nuansa hangat dan harga terjangkau</p>
        </div>

        <div style={styles.aboutGrid}>
          {[
            { image: SITE_PHOTOS.about[0], title: 'Suasana Hangat', desc: 'Desain interior yang cozy untuk bersantai' },
            { image: SITE_PHOTOS.about[1], title: 'Student-Friendly', desc: 'Harga sangat terjangkau untuk mahasiswa mulai dari Rp18.000' },
            { image: SITE_PHOTOS.about[2], title: 'WiFi Gratis', desc: 'Internet cepat untuk belajar & kerja dari mana saja' },
          ].map((item) => (
            <div key={item.title} style={styles.aboutCard}>
              <img src={item.image} alt={item.title} style={styles.aboutImage} />
              <div style={styles.aboutInfo}>
                <h4 style={styles.aboutTitle}>{item.title}</h4>
                <p style={styles.aboutDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Best Seller Section */}
        <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
          <h2 style={styles.sectionTitle}>Our Best Seller Menu</h2>
          <p style={styles.sectionSub}>Menu favorit pelanggan setia kami</p>
        </div>

        <div style={styles.bsGrid}>
          {bestSellers.map((item) => (
            <div key={item.id} style={styles.bsCard}>
              <div style={styles.bsImageWrap}>
                <img src={item.image_url} alt={item.nama} style={styles.bsImage} />
                <div style={styles.bsBadge}>BEST</div>
              </div>
              <div style={styles.bsInfo}>
                <h4 style={styles.bsName}>{item.nama}</h4>
                <p style={styles.bsPrice}>{formatRupiah(item.harga)}</p>
                <p style={styles.bsDesc}>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.centerAction}>
          <button style={styles.btnPrimary} onClick={() => setPage('menu')}>
            Lihat Semua Menu
          </button>
        </div>

        {/* Testimonials Section */}
        <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
          <h2 style={styles.sectionTitle}>Apa Kata Mereka?</h2>
          <p style={styles.sectionSub}>Ulasan dari pelanggan yang sudah mencicipi hidangan kami</p>
        </div>

        <div style={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={styles.testiRating}>{t.rating}</div>
              <p style={styles.testiReview}>"{t.review}"</p>
              <div style={styles.testiName}>- {t.name}</div>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
          <h2 style={styles.sectionTitle}>Galeri Ale&apos;s Place Cipoho</h2>
        </div>

        <div style={styles.galleryGrid}>
          {[SITE_PHOTOS.atmosphere[0], SITE_PHOTOS.why[2], SITE_PHOTOS.atmosphere[1], SITE_PHOTOS.about[0], SITE_PHOTOS.hero].map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt="Gallery" 
              style={{ ...styles.galleryImg, cursor: 'pointer' }}
              onClick={() => setSelectedGalleryImage(img)}
            />
          ))}
        </div>

        {selectedGalleryImage && (
          <div style={styles.galleryModal} onClick={() => setSelectedGalleryImage(null)}>
            <button style={styles.galleryCloseBtn} onClick={() => setSelectedGalleryImage(null)}>×</button>
            <img src={selectedGalleryImage} alt="Enlarged" style={styles.galleryModalImage} onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* Location & Contact */}
        <div style={{ ...styles.sectionHeader, marginTop: 60 }}>
          <h2 style={styles.sectionTitle}>Kontak &amp; Lokasi</h2>
          <p style={styles.sectionSub}>Temukan kami dengan mudah</p>
        </div>

        <div style={styles.locationContainer}>
          <div style={styles.mapPlaceholder}>
            <iframe
              src="https://www.google.com/maps?q=Jl.+Gamelan+No.2,+Cikondang,+Kec.+Citamiang,+Kota+Sukabumi&output=embed"
              style={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Ale's Place"
            ></iframe>
            <p style={styles.mapTitle}>Lokasi Ale&apos;s Place Cipoho</p>
            <p style={styles.mapSub}>Perumahan Cipoho Indah, Jl. Gamelan No.2, Cikondang, Kec. Citamiang, Kota Sukabumi, Jawa Barat 43142</p>
          </div>

          <div style={styles.contactContainer}>
            <div style={styles.hoursGrid}>
              <div style={styles.contactItem}>
                <h4 style={styles.contactTitle}>Senin – Jumat</h4>
                <p style={styles.contactValue}>11:00 – 21:00 WIB</p>
              </div>
              <div style={styles.contactItem}>
                <h4 style={styles.contactTitle}>Sabtu, Minggu & Tanggal Merah</h4>
                <p style={styles.contactValue}>10:00 – 21:00 WIB</p>
              </div>
            </div>

            <div style={styles.contactItem}>
              <h4 style={styles.contactTitle}>Kontak (WhatsApp)</h4>
              <p style={styles.contactValue}>0815-7215-5275</p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div style={{ ...styles.sectionHeader, marginTop: 60 }}>
          <h2 style={styles.sectionTitle}>Ikuti Kami</h2>
          <p style={styles.sectionSub}>Terhubung dengan kami di media sosial</p>
        </div>

        <div style={styles.socialGrid}>
          {SOCIAL_LINKS.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="social-card">
              <div style={styles.socialIcon}>
                <img src={social.icon} alt={social.name} style={styles.socialIconImage} />
              </div>
              <p style={styles.socialName}>{social.name}</p>
            </a>
          ))}
        </div>

      </div>

      <footer style={styles.footer}>2026. Ale&apos;s Place Cipoho. All rights reserved</footer>
    </div>
  );
}

const styles = {
  heroFull: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 20px',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(16,10,9,0.5) 0%, rgba(16,10,9,0.8) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'modalSlideIn 0.8s ease-out',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(218,37,28,0.9)',
    color: 'white',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    padding: '8px 20px',
    borderRadius: 999,
    marginBottom: 24,
    backdropFilter: 'blur(4px)',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: 800,
    color: 'white',
    lineHeight: 1.15,
    marginBottom: 20,
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(15px, 2vw, 18px)',
    maxWidth: 580,
    margin: '0 auto 36px',
    lineHeight: 1.6,
  },
  heroBtns: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnYellow: {
    background: '#FFE400',
    color: '#100A09',
    border: 'none',
    padding: '16px 36px',
    borderRadius: 999,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 8px 24px rgba(255,228,0,0.3)',
  },
  btnOutline: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.8)',
    padding: '16px 36px',
    borderRadius: 999,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
  },
  btnPrimary: {
    background: '#DA251C',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 999,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(218,37,28,0.3)',
  },

  container: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '60px 24px',
  },

  sectionHeader: {
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 15,
    color: '#666',
  },

  carousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 60,
    minHeight: 420,
    background: '#F0E8E2',
    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
    margin: '0 -20px 60px -20px',
    borderRadius: 0,
  },
  carouselSlide: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.6s ease',
    padding: '0',
    textAlign: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 0,
    marginBottom: 0,
    display: 'block',
    boxShadow: 'none',
  },
  slideTitle: { fontWeight: 700, fontSize: 20, color: '#100A09', marginBottom: 8, position: 'absolute', bottom: 60, background: 'rgba(255,255,255,0.95)', padding: '16px 24px', borderRadius: 12, zIndex: 3 },
  slideDesc: { fontSize: 14, color: '#555', lineHeight: 1.6, maxWidth: 400, position: 'absolute', bottom: 20, background: 'rgba(255,255,255,0.95)', padding: '12px 20px', borderRadius: 8, zIndex: 3 },
  carouselBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.85)',
    color: '#DA251C',
    border: 'none',
    width: 48,
    height: 48,
    borderRadius: '50%',
    fontSize: 28,
    cursor: 'pointer',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
  },
  dots: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.2)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  dotActive: {
    background: '#DA251C',
    width: 24,
    borderRadius: 5,
  },

  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    marginBottom: 24,
  },
  aboutCard: {
    background: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid #eee',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    transition: 'transform 0.3s',
  },
  aboutImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  aboutInfo: {
    padding: 24,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 8,
  },
  aboutDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
  },

  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 32,
    marginBottom: 20,
  },
  whyItem: {
    textAlign: 'center',
    background: '#FAF6F9',
    padding: 32,
    borderRadius: 24,
    border: '1px solid rgba(218,127,28,0.1)',
  },
  whyImageWrap: {
    width: 120,
    height: 120,
    margin: '0 auto 20px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '4px solid #fff',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
  },
  whyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 8,
  },
  whyDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
  },

  bsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
  },
  bsCard: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #eee',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
  },
  bsImageWrap: {
    position: 'relative',
    height: 160,
  },
  bsImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bsBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: '#DA251C',
    color: 'white',
    fontSize: 10,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bsInfo: {
    padding: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  bsName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#100A09',
    marginBottom: 4,
  },
  bsPrice: {
    fontSize: 14,
    color: '#DA251C',
    fontWeight: 700,
    marginBottom: 6,
  },
  bsDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 1.4,
    flex: 1,
  },
  centerAction: {
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 20,
  },

  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
  },
  testimonialCard: {
    background: '#F0E8E2',
    padding: 32,
    borderRadius: 20,
    border: '1px solid rgba(218,127,28,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  testiRating: {
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 16,
  },
  testiReview: {
    fontSize: 15,
    color: '#444',
    lineHeight: 1.6,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  testiName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#DA251C',
  },

  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  galleryImg: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 16,
  },

  galleryModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  galleryModalImage: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: 8,
  },
  galleryCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 30,
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: 40,
    cursor: 'pointer',
    padding: '0 10px',
    lineHeight: 1,
    borderRadius: 4,
    transition: 'all 0.2s',
  },

  locationContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 32,
    alignItems: 'start',
  },
  mapPlaceholder: {
    background: '#FAF6F9',
    borderRadius: 24,
    padding: 16,
    textAlign: 'center',
    border: '1px solid #eee',
  },
  mapIframe: {
    width: '100%',
    height: 260,
    border: 0,
    borderRadius: 16,
    marginBottom: 16,
  },
  mapTitle: { fontWeight: 700, fontSize: 16, color: '#100A09', marginBottom: 4 },
  mapSub: { fontSize: 14, color: '#666' },

  contactContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  hoursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  contactItem: {
    background: '#fff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
    border: '1px solid #eee',
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#DA251C',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  contactValue: {
    margin: 0,
    fontSize: 15,
    color: '#333',
    lineHeight: 1.5,
  },

  socialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 16,
    maxWidth: 600,
    margin: '0 auto',
    padding: '0 20px 40px',
  },
  socialIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    overflow: 'hidden',
    background: '#F7EFE8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  socialIconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  socialName: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: '#DA251C',
  },

  footer: {
    textAlign: 'center',
    padding: '32px 20px',
    background: '#100A09',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  }
};
