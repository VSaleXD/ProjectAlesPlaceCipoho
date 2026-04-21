# Ale's Place Cipoho - Website Reservasi Restaurant

Website reservasi restaurant untuk **Ale's Place Cipoho**, sebuah restaurant ramen di Bandung. Website ini dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework untuk performa optimal.

## 🎯 Fitur Utama

- **Halaman Beranda (index.html)**
  - Hero banner dengan gambar ramen
  - Feature shortcuts untuk navigasi cepat
  - Statistik restaurant
  - Responsive design

- **Halaman Menu (menu.html)**
  - Filter berdasarkan kategori (Ramen, Appetizer, Dessert, Minuman)
  - Tab filter (Semua, Populer, Terbaru, Promo)
  - Search box untuk mencari menu
  - Grid layout dengan 3 kolom di laptop
  - Menampilkan gambar, nama, harga, dan deskripsi menu

- **Halaman Reservasi (reservasi.html)**
  - Form reservasi lengkap
  - Validasi input
  - Konfirmasi reservasi
  - Informasi penting tentang reservasi

- **Halaman Kontak (kontak.html)**
  - Informasi kontak lengkap
  - Alamat, telepon, email
  - Jam buka restaurant
  - Social media links

## 🎨 Design System

### Color Palette
- **Background**: `#FAF3E8` (warm paper)
- **Surface**: `#FFF9F1` (light card)
- **Primary**: `#8B3A2B` (ramen brown-red)
- **Accent**: `#D9A05B` (gold accent)
- **Text**: `#3B2B22` (dark brown)
- **Muted**: `#8C7A6E` (light brown)

### Typography
- **Headings**: Georgia, Noto Serif (serif)
- **Body**: Segoe UI, Noto Sans (sans-serif)

### Layout
- **Container Max Width**: 1200px
- **Breakpoints**: 
  - Desktop: ≥1366px
  - Laptop: 1024px - 1366px
  - Tablet: 768px - 1024px

## 📁 Struktur File

```
ProyekWebsite/
│
├── index.html              # Halaman beranda
├── menu.html               # Halaman menu
├── reservasi.html          # Halaman reservasi
├── kontak.html             # Halaman kontak
│
├── styles/
│   └── app.css            # Main stylesheet
│
├── scripts/
│   └── app.js             # Main JavaScript
│
├── assets/
│   ├── images/            # Folder gambar
│   │   └── README.md      # Daftar gambar yang diperlukan
│   └── icons/             # Folder icon SVG
│       └── README.md      # Dokumentasi icon
│
└── konteksAI.md           # Dokumentasi konteks untuk AI
```

## 🚀 Cara Menggunakan

1. **Clone atau Download** repository ini
2. **Buka** file `index.html` di browser Anda
3. **Navigasi** menggunakan menu navbar di bagian atas
4. **Ganti gambar placeholder** di folder `assets/images/` dengan gambar asli

## 📝 Catatan Penting

### Gambar
Saat ini, website menggunakan path gambar placeholder. Untuk menggunakan website secara penuh:
1. Siapkan gambar sesuai daftar di `assets/images/README.md`
2. Upload gambar ke folder `assets/images/`
3. Pastikan nama file sesuai dengan yang tercantum di HTML

### Form Reservasi
- Form reservasi saat ini hanya melakukan simulasi (console.log)
- Tidak ada integrasi dengan backend/database
- Untuk implementasi penuh, diperlukan:
  - Backend API (PHP, Node.js, Python, dll)
  - Database untuk menyimpan reservasi
  - Email notification system

## 🎯 Accessibility

Website ini dibangun dengan memperhatikan aksesibilitas:
- Semantic HTML5
- ARIA labels untuk form elements
- Keyboard navigation support
- Focus states yang jelas
- Contrast ratio sesuai WCAG AA

## 📱 Responsive Design

Website ini responsive dan dapat diakses dari berbagai perangkat:
- Desktop (≥1366px): Layout 3 kolom untuk menu
- Laptop (1024px-1366px): Layout 2 kolom untuk menu
- Tablet (≤1024px): Layout 1 kolom, sidebar filter menjadi horizontal
- Mobile: Stack layout, navigasi dapat disesuaikan

## 🔧 Customization

### Mengubah Warna
Edit CSS variables di `styles/app.css`:
```css
:root {
  --color-primary: #8B3A2B;
  --color-accent: #D9A05B;
  /* ... */
}
```

### Menambah Menu Item
Edit `menu.html` dan tambahkan card baru:
```html
<article class="menu-card" data-category="ramen" data-tag="popular">
  <img src="assets/images/ramen-new.jpg" alt="Ramen Baru">
  <div class="menu-card__content">
    <h3 class="menu-card__title">Ramen Baru</h3>
    <p class="menu-card__price">Rp 50.000</p>
    <p class="menu-card__description">Deskripsi...</p>
    <button class="btn btn--primary menu-card__button">Pesan Sekarang</button>
  </div>
</article>
```

### Mengubah Kontak Info
Edit footer di setiap file HTML atau buat component terpisah.

## 📄 License

© 2026 Ale's Place Cipoho. All rights reserved.

## 👨‍💻 Development

Developed with ❤️ for Ale's Place Cipoho
- Pure HTML5, CSS3, JavaScript
- No frameworks, no dependencies
- Optimized for laptop screens (≥1366px)
- Local assets only

## 🐛 Known Issues

- Hero image placeholder perlu diganti dengan gambar asli
- Menu item images perlu diganti dengan foto makanan asli
- Form submission hanya simulasi (perlu backend integration)

## 🚀 Future Enhancements

- [ ] Backend integration untuk form reservasi
- [ ] Email notification system
- [ ] Admin dashboard untuk manage reservasi
- [ ] Online payment integration
- [ ] Google Maps integration
- [ ] Customer reviews section
- [ ] Newsletter subscription
- [ ] Multi-language support (English, Indonesian)

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi:
- Email: info@alesplace.com
- Phone: (022) 1234-5678
- WhatsApp: 0812-3456-7890
