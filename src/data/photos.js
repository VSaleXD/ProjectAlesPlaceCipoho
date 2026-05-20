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
    withParams('https://images.unsplash.com/photo-1554118811-1e0d58224f24'),
    withParams('https://images.unsplash.com/photo-1521017432531-fbd92d768814'),
    withParams('https://images.unsplash.com/photo-1497366754035-f200968a6e72'),
  ],
  why: [
    withParams('https://images.unsplash.com/photo-1553621042-f6e147245754'),
    withParams('https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
    withParams('https://images.unsplash.com/photo-1506354666786-959d6d497f1a'),
  ],
};

export const ICON_PHOTOS = {
  instagram: withParams('https://images.unsplash.com/photo-1516321497487-e288fb19713f'),
  tiktok: withParams('https://images.unsplash.com/photo-1516321318423-f06f85e504b3'),
  facebook: withParams('https://images.unsplash.com/photo-1516321497487-e288fb19713f'),
  whatsapp: withParams('https://images.unsplash.com/photo-1556740749-887f6717d7e4'),
  refresh: withParams('https://images.unsplash.com/photo-1516321318423-f06f85e504b3'),
  email: withParams('https://images.unsplash.com/photo-1516321497487-e288fb19713f'),
  phone: withParams('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'),
  calendar: withParams('https://images.unsplash.com/photo-1506784365847-bbad939e9335'),
  chat: withParams('https://images.unsplash.com/photo-1516321497487-e288fb19713f'),
  location: withParams('https://images.unsplash.com/photo-1502920917128-1aa500764cbd'),
  whatsapp: withParams('https://images.unsplash.com/photo-1556740749-887f6717d7e4'),
  chef: withParams('https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
  lock: withParams('https://images.unsplash.com/photo-1563013544-824ae1b704d3'),
  delete: withParams('https://images.unsplash.com/photo-1547592180-85f173990554'),
};

