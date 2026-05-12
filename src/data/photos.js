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

const MENU_PHOTOS = {
  ramen: withParams('https://images.unsplash.com/photo-1569718212165-3a8278d5f624'),
  sushi: withParams('https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
  gyoza: withParams('https://images.unsplash.com/photo-1512058564366-18510be2db19'),
  snack: withParams('https://images.unsplash.com/photo-1509722747041-616f39b57569'),
  dessert: withParams('https://images.unsplash.com/photo-1488477181946-6428a0291777'),
  drink: withParams('https://images.unsplash.com/photo-1509042239860-f550ce710b93'),
  bento: withParams('https://images.unsplash.com/photo-1516684732162-798a0062be99'),
  default: withParams('https://images.unsplash.com/photo-1490645935967-10de6ba17061'),
};

export function getMenuImage(item = {}) {
  const haystack = `${item.nama || ''} ${item.kategori || ''} ${item.deskripsi || ''}`.toLowerCase();

  if (haystack.includes('ramen')) return MENU_PHOTOS.ramen;
  if (haystack.includes('sushi') || haystack.includes('gunkan') || haystack.includes('nigiri') || haystack.includes('bomb')) return MENU_PHOTOS.sushi;
  if (haystack.includes('gyoza')) return MENU_PHOTOS.gyoza;
  if (haystack.includes('risol') || haystack.includes('snack') || haystack.includes('takoyaki') || haystack.includes('pizza')) return MENU_PHOTOS.snack;
  if (haystack.includes('dessert') || haystack.includes('pingku') || haystack.includes('greentea') || haystack.includes('puding')) return MENU_PHOTOS.dessert;
  if (haystack.includes('freeze') || haystack.includes('smooth') || haystack.includes('blended') || haystack.includes('mojito') || haystack.includes('drink') || haystack.includes('minum')) return MENU_PHOTOS.drink;
  if (haystack.includes('bento') || haystack.includes('donburi') || haystack.includes('rice')) return MENU_PHOTOS.bento;

  return MENU_PHOTOS.default;
}