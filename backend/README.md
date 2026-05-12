# Backend Ale's Place Cipoho

Backend sederhana untuk menerima dan memproses reservasi.

## Fitur

- ✅ REST API untuk menerima reservasi (`POST /api/reservasi`)
- ✅ Simpan reservasi ke file JSON (`reservations.json`)
- ✅ Generate link WhatsApp dengan pre-fill pesan
- ✅ API untuk admin view semua reservasi (`GET /api/reservasi`)
- ✅ Hapus reservasi (`DELETE /api/reservasi/:id`)

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Jalankan server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### POST /api/reservasi
Menerima data reservasi dan mengembalikan link WhatsApp.

**Request body:**
```json
{
  "nama": "Andi Wijaya",
  "email": "andi@email.com",
  "telepon": "081234567890",
  "tanggal": "2026-05-15",
  "jam": "19:30",
  "jumlah": "1–2 orang",
  "catatan": "Lokasi dekat jendela"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservasi berhasil disimpan",
  "reservasi": { /* data yang disimpan */ },
  "waURL": "https://wa.me/6281514693030?text=..."
}
```

### GET /api/reservasi
Ambil semua reservasi (untuk admin dashboard).

**Response:**
```json
[
  {
    "id": 1715785000000,
    "nama": "Andi Wijaya",
    "email": "andi@email.com",
    "telepon": "081234567890",
    "tanggal": "2026-05-15",
    "jam": "19:30",
    "jumlah": "1–2 orang",
    "catatan": "Lokasi dekat jendela",
    "timestamp": "2026-05-12T10:30:00.000Z"
  }
]
```

### DELETE /api/reservasi/:id
Hapus satu reservasi berdasarkan ID.

**Response:**
```json
{
  "success": true
}
```

## Struktur Folder

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── reservations.json   # Data reservasi (auto-generate)
└── README.md           # File ini
```

## Data Reservasi

Semua reservasi disimpan di `reservations.json` dalam format array JSON. File ini auto-create saat pertama kali ada POST.

## CORS

Backend menggunakan CORS untuk allow frontend di `http://localhost:5173`.

## Next Steps

- [ ] Integrate dengan database SQL (SQLite/PostgreSQL)
- [ ] Authentication untuk admin panel
- [ ] Email notification ke admin
- [ ] Twilio SMS integration (opsional)
