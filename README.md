# 🍜 Ale's Place Cipoho — Frontend (React + Vite)

Frontend untuk restoran lokal **Ale's Place Cipoho**, dibangun dengan React + Vite.
README ini diperbarui agar sesuai struktur dan file yang ada di repositori saat ini.

---

## 🚀 Cepat Mulai

Pastikan Node.js (v16+) terpasang.

```bash
# Install dependensi
npm install

# Jalankan server development (Vite)
npm run dev

# Build untuk production
npm run build

# Lihat build hasil (preview)
npm run preview
```

---

## 🔧 Variabel Lingkungan

Project ini menggunakan Supabase. 

Contoh file `.env` (opsional):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📁 Struktur Penting (ringkasan)

- `index.html` — entry Vite
- `package.json` — skrip: `dev`, `build`, `preview`
- `src/main.jsx` — entry React
- `src/App.jsx` — routing dan layout utama
- `src/supabaseClient.js` — koneksi Supabase (URL & anon key)
- `src/utils/whatsapp.js` — helper untuk membuat URL WhatsApp (digunakan halaman reservasi)
- `src/components/` — komponen reusable (`Navbar.jsx`, `MenuCard.jsx`, ...)
- `src/pages/` — halaman aplikasi (`HomePage.jsx`, `MenuPage.jsx`, `ReservasiPage.jsx`, `AdminLoginPage.jsx`, `AdminPage.jsx`)
- `src/data/` — data lokal seperti `menu.js` dan `photos.js`
- `src/styles/index.css` — style global dan CSS variables
- `assets/lampiran/` — gambar & file statis

---

## ✨ Fitur Utama (singkat)

- Beranda: hero, carousel foto, preview best-seller, kontak
- Halaman Menu: search, filter kategori, grid menu, format harga
- Reservasi: form client-side, preview pesan WhatsApp, redirect ke `wa.me`
- Halaman Admin: login sederhana dan halaman admin (tergantung Supabase)

---

## Menambah / Mengubah Konten

- Foto & lampiran simpan di supabase.
- Ubah warna dan token di `src/styles/index.css`.

2026 • Ale's Place Cipoho
