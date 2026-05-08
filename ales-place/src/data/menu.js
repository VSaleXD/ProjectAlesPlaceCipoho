/**
 * DATA MENU - Ale's Place Cipoho
 * Berisi daftar lengkap menu restoran dengan properti:
 * id, nama, harga, kategori, deskripsi, emoji, bestseller
 *
 * Harga dalam format Integer (Rupiah) — gunakan formatRupiah() untuk tampilan
 */

// Daftar kategori yang tersedia
export const CATEGORIES = [
  'Semua',
  'Ramen',
  'Donburi',
  'Udon',
  'Hotplate',
  'Omurice',
  'Sushi',
  'Bento',
  'Snack',
  'Drinks',
];

// Array of objects menu utama
export const menuData = [
  {
    id: 1,
    nama: 'Tori Paitan Chashu Ramen',
    harga: 47000,
    kategori: 'Ramen',
    deskripsi: 'Ramen kaldu ayam creamy dengan chashu lembut dan telur rebus',
    emoji: '🍜',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
  },
  {
    id: 2,
    nama: 'Shoyu Ramen',
    harga: 42000,
    kategori: 'Ramen',
    deskripsi: 'Ramen kaldu kecap asin klasik Jepang dengan topping nori',
    emoji: '🍜',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
  },
  {
    id: 3,
    nama: 'Spicy Miso Ramen',
    harga: 45000,
    kategori: 'Ramen',
    deskripsi: 'Ramen pedas dengan bumbu miso kaya rasa dan corn butter',
    emoji: '🍜',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
  },
  {
    id: 4,
    nama: 'Beef Donburi',
    harga: 43000,
    kategori: 'Donburi',
    deskripsi: 'Nasi putih hangat dengan topping daging sapi berbumbu manis gurih',
    emoji: '🍱',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
  },
  {
    id: 5,
    nama: 'Oyakodon',
    harga: 38000,
    kategori: 'Donburi',
    deskripsi: 'Nasi dengan ayam dan telur setengah matang dalam saus dashi manis',
    emoji: '🍱',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
  },
  {
    id: 6,
    nama: 'Kitsune Udon',
    harga: 35000,
    kategori: 'Udon',
    deskripsi: 'Udon kuah bening hangat dengan topping tahu goreng manis',
    emoji: '🍝',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1634864572865-1cf28c7e1ae0?w=400',
  },
  {
    id: 7,
    nama: 'Yaki Udon',
    harga: 37000,
    kategori: 'Udon',
    deskripsi: 'Udon goreng dengan sayuran segar dan saus spesial smoky',
    emoji: '🍝',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400',
  },
  {
    id: 8,
    nama: 'Hotplate Chicken',
    harga: 48000,
    kategori: 'Hotplate',
    deskripsi: 'Ayam teriyaki sizzling di atas hotplate besi dengan nasi',
    emoji: '🥩',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
  },
  {
    id: 9,
    nama: 'Chicken Omurice',
    harga: 39000,
    kategori: 'Omurice',
    deskripsi: 'Nasi goreng ayam dibungkus telur dadar lembut dengan saus tomat',
    emoji: '🍳',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
  },
  {
    id: 10,
    nama: 'Salmon Sushi Set',
    harga: 55000,
    kategori: 'Sushi',
    deskripsi: 'Set sushi isi 8 pcs pilihan dengan wasabi & soy sauce',
    emoji: '🍣',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400',
  },
  {
    id: 11,
    nama: 'Chicken Bento',
    harga: 45000,
    kategori: 'Bento',
    deskripsi: 'Bento komplit: nasi, ayam karaage, tamagoyaki, dan salad',
    emoji: '🍱',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
  },
  {
    id: 12,
    nama: 'Takoyaki 6pcs',
    harga: 25000,
    kategori: 'Snack',
    deskripsi: 'Bola-bola gurita goreng renyah dengan mayo & katsuobushi',
    emoji: '🐙',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
  },
  {
    id: 13,
    nama: 'Edamame',
    harga: 18000,
    kategori: 'Snack',
    deskripsi: 'Kacang edamame rebus hangat dengan taburan garam laut',
    emoji: '🫛',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400',
  },
  {
    id: 14,
    nama: 'Matcha Latte',
    harga: 22000,
    kategori: 'Drinks',
    deskripsi: 'Minuman matcha premium creamy, tersedia panas atau dingin',
    emoji: '🍵',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400',
  },
  {
    id: 15,
    nama: 'Yuzu Lemonade',
    harga: 20000,
    kategori: 'Drinks',
    deskripsi: 'Minuman segar perpaduan citrus yuzu dan lemon menyegarkan',
    emoji: '🍋',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
  },
  {
    id: 16,
    nama: 'Taro Milk Tea',
    harga: 21000,
    kategori: 'Drinks',
    deskripsi: 'Milk tea ungu taro dengan creamer premium dan boba pilihan',
    emoji: '🧋',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
  },
];

/**
 * formatRupiah — Konversi integer ke format mata uang Rupiah Indonesia
 * @param {number} angka - Nilai harga dalam integer
 * @returns {string} Format: "Rp47.000"
 */
export const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);

// Ambil hanya menu bestseller
export const getBestSellers = () => menuData.filter((m) => m.bestseller);

// Filter menu berdasarkan kategori
export const getMenuByKategori = (kategori) =>
  kategori === 'Semua'
    ? menuData
    : menuData.filter((m) => m.kategori === kategori);
