const withParams = (url) => `${url}?auto=format&fit=crop&w=1200&q=80`;

export const SITE_PHOTOS = {
  hero: withParams('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'),
  atmosphere: [
    withParams('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'),
    withParams('https://images.unsplash.com/photo-1554118811-1e0d58224f24'),
    withParams('https://images.unsplash.com/photo-1498654896293-37aacf113fd9'),
    withParams('https://images.unsplash.com/photo-1528605248644-14dd04022da1'),
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
  map: withParams('https://images.unsplash.com/photo-1513622470522-26c3c8d76c3b'),
};

export const ICON_PHOTOS = {
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
