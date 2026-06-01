const SUPABASE_STORAGE = 'https://iwtqlnktjfsehgubgnuc.supabase.co/storage/v1/object/public/projek-rpl';

const HeroBanner = `${SUPABASE_STORAGE}/gambar-homepage/Hero-Banner.jpg`;
const instagram = `${SUPABASE_STORAGE}/gambar-homepage/Instagram.png`;
const tiktok = `${SUPABASE_STORAGE}/gambar-homepage/TikTok.png`;
const facebook = `${SUPABASE_STORAGE}/gambar-homepage/Facebook.png`;
const whatsapp = `${SUPABASE_STORAGE}/gambar-homepage/WhatsApp.png`;
const Foto1 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto1.jpeg`;
const Foto2 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto2.jpeg`;
const Foto3 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto3.jpeg`;
const Foto4 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto4.jpeg`;
const Foto5 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto5.jpeg`;
const Foto6 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto6.jpg`;
const Foto7 = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/Foto7.jpg`;
const SuasanaHangat = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/suasanaHangat.jpeg`;
const AnakSekolah = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/anakSekolah.png`;
const WifiGratis = `${SUPABASE_STORAGE}/gambar-homepage/Gallery/wifiGratis.jpeg`;
const logo = `${SUPABASE_STORAGE}/logo.jpg`;

export const SITE_PHOTOS = {
  hero: HeroBanner,
  logo: logo,

  atmosphere: [
    Foto1,
    Foto2,
    Foto3,
    Foto4,
    Foto5,
    Foto6,
    Foto7,
  ],
  about: [
    SuasanaHangat,
    AnakSekolah,
    WifiGratis,
  ],
};

export const ICON_PHOTOS = {
  instagram: instagram,
  tiktok: tiktok,
  facebook: facebook,
  whatsapp: whatsapp,
};

