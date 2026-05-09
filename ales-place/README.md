# 🍜 Ale's Place Cipoho — Frontend React

Website frontend restoran Jepang lokal **Ale's Place Cipoho**, dibangun dengan React + Vite.
Mengikuti arsitektur **Modular Monolith** sesuai dokumen LKP.

---

## 📁 Struktur Folder

```
ales-place/
├── index.html              # Entry HTML (Vite)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # ReactDOM entry point
    ├── App.jsx             # Root component + routing state
    ├── data/
    │   └── menu.js         # Data menu (array of objects) + helper functions
    ├── components/
    │   ├── Navbar.jsx      # Navigasi sticky (reusable)
    │   └── MenuCard.jsx    # Kartu item menu (reusable)
    ├── pages/
    │   ├── HomePage.jsx    # Beranda: hero, carousel, about, bestseller, kontak
    │   ├── MenuPage.jsx    # Katalog: search, filter kategori, grid menu
    │   └── ReservasiPage.jsx # Form reservasi → redirect WhatsApp
    └── styles/
        └── index.css       # Global styles + CSS variables (design tokens)
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk production
npm run build
```

---

## ✨ Fitur Utama

### 🏠 Halaman Beranda
- Hero banner dengan CTA "Lihat Menu" & "Reservasi"
- **Atmosphere Carousel** — auto-play 3 detik, navigasi manual
- Highlights "Tentang Ale's Place" (3 kartu)
- Section "Kenapa Ale's Place?" dengan ikon bulat kuning
- Preview 3 Best Seller menu
- Peta lokasi placeholder
- Kontak & Jam Operasional

### 🍜 Halaman Menu
- **Search bar real-time** — filter berdasarkan nama, kategori, deskripsi
- **Carousel Best Seller** horizontal (klik untuk filter kategori)
- **Filter kategori** pill buttons dengan scroll horizontal
- Grid 2 kolom menu dengan badge ⭐ untuk Best Seller
- Format harga Rupiah transparan (Rp47.000)
- Empty state + tombol reset filter

### 📅 Halaman Reservasi
- Form: Nama, No HP, Tanggal, Jam, Jumlah Tamu, Catatan
- **Validasi client-side** per field
- **Preview pesan WhatsApp** sebelum redirect
- `handleSubmit` → redirect ke `wa.me` dengan pesan:
  > *"Halo Ale's Place Cipoho, saya [Nama] ingin reservasi untuk [Jumlah] pada [Tanggal] pukul [Jam]."*
- Info lokasi & jam operasional

---

## 🎨 Design System

| Token | Nilai |
|-------|-------|
| `--red` | `#C0392B` |
| `--cream` | `#F5EDD8` |
| `--yellow` | `#F5D97A` |
| `--dark` | `#2C1810` |
| Font Display | Playfair Display (700/800) |
| Font Body | DM Sans (300–600) |

---

## 📋 Data Menu (`src/data/menu.js`)

Setiap item menu memiliki properti:
```js
{
  id:          1,
  nama:        'Tori Paitan Chashu Ramen',
  harga:       47000,        // Integer Rupiah
  kategori:    'Ramen',
  deskripsi:   '...',
  emoji:       '🍜',
  bestseller:  true,
  image:       'https://...',  // URL Unsplash placeholder
}
```

Helper exports:
- `formatRupiah(angka)` — format ke "Rp47.000"
- `getBestSellers()` — filter item bestseller
- `getMenuByKategori(kat)` — filter by kategori
- `CATEGORIES` — array nama kategori

---
### Tambah Menu Baru
Edit `src/data/menu.js`, tambah object baru ke array `menuData`.

### Ganti Warna Utama
Edit CSS variables di `src/styles/index.css`:
```css
:root {
  --red: #C0392B;  /* Ganti warna utama */
}
```

---

*2026. Ale's Place Cipoho. All rights reserved*
