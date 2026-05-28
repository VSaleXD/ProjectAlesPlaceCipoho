const publicImage = (fileName) => `/gambarHomepage/${fileName}`;
const publicImageGallery = (fileName) => `/gambarHomepage/Gallery/${fileName}`;
const withParams = (url) => `${url}?auto=format&fit=crop&w=800&q=80`;

export const SITE_PHOTOS = {
  hero: publicImage('Hero-Banner.jpg'),
  atmosphere: [
    publicImageGallery('Foto2.jpeg'),
    publicImageGallery('Foto3.jpeg'),
    publicImageGallery('Foto4.jpeg'),
    publicImageGallery('Foto5.jpeg'),
  ],
  about: [
    publicImageGallery('FotoSuasana.jpg'),
    publicImageGallery('FotoHarga.jpg'),
    publicImageGallery('FotoGift.jpg'),
  ],
  why: [
    publicImageGallery('Foto5.jpeg'),
    publicImageGallery('Foto6.jpeg'),
    publicImageGallery('Foto1.jpeg'),
  ],
};

export const ICON_PHOTOS = {
  instagram: publicImage('Logo.jpeg'),
  tiktok: publicImage('Logo.jpeg'),
  facebook: publicImage('Logo.jpeg'),
  whatsapp: publicImage('Logo.jpeg'),
};

