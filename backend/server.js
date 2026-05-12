import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMenus, saveMenus } from './menuStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path untuk simpan reservasi
const RESERVATIONS_FILE = path.join(__dirname, 'reservations.json');

// Nomor WhatsApp admin (format internasional)
const ADMIN_WA = '6281514693030'; // Indonesia: 62 + nomor tanpa 0 di depan

const normalizeMenuItem = (item) => ({
  id: Number(item.id),
  nama: String(item.nama || '').trim(),
  harga: Number(item.harga),
  kategori: String(item.kategori || '').trim(),
  deskripsi: String(item.deskripsi || '').trim(),
  emoji: String(item.emoji || '🍜').trim(),
  bestseller: Boolean(item.bestseller),
});

const isValidMenuItem = (item) =>
  item.nama &&
  Number.isFinite(item.harga) &&
  item.kategori &&
  item.deskripsi &&
  item.emoji;

/**
 * GET /api/menu
 * Ambil semua menu dari database file JSON
 */
app.get('/api/menu', async (req, res) => {
  try {
    const data = await loadMenus();
    return res.json(data);
  } catch (error) {
    console.error('Error get menu:', error);
    return res.status(500).json({ error: 'Gagal mengambil menu' });
  }
});

/**
 * POST /api/menu
 * Tambah menu baru ke database file JSON
 */
app.post('/api/menu', async (req, res) => {
  try {
    const menuItem = normalizeMenuItem(req.body);

    if (!isValidMenuItem(menuItem)) {
      return res.status(400).json({ error: 'Data menu tidak lengkap' });
    }

    const menus = await loadMenus();
    const nextId = menus.length > 0 ? Math.max(...menus.map((item) => Number(item.id) || 0)) + 1 : 1;
    const newMenu = {
      ...menuItem,
      id: nextId,
    };

    menus.push(newMenu);
    await saveMenus(menus);

    return res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan', menu: newMenu });
  } catch (error) {
    console.error('Error add menu:', error);
    return res.status(500).json({ error: 'Gagal menambahkan menu' });
  }
});

/**
 * DELETE /api/menu/:id
 * Hapus menu dari database file JSON
 */
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuId = Number(id);
    const menus = await loadMenus();
    const nextMenus = menus.filter((item) => Number(item.id) !== menuId);

    if (nextMenus.length === menus.length) {
      return res.status(404).json({ error: 'Menu tidak ditemukan' });
    }

    await saveMenus(nextMenus);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error delete menu:', error);
    return res.status(500).json({ error: 'Gagal menghapus menu' });
  }
});

/**
 * POST /api/reservasi
 * Terima data reservasi, simpan ke file, dan kirim notifikasi ke WhatsApp
 */
app.post('/api/reservasi', async (req, res) => {
  try {
    const { nama, email, telepon, tanggal, jam, jumlah, catatan } = req.body;

    // Validasi
    if (!nama || !email || !telepon || !tanggal || !jam || !jumlah) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const reservasi = {
      id: Date.now(),
      nama,
      email,
      telepon,
      tanggal,
      jam,
      jumlah,
      catatan: catatan || '',
      timestamp: new Date().toISOString(),
    };

    // Baca reservasi lama
    let data = [];
    try {
      const raw = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
      data = JSON.parse(raw);
    } catch (e) {
      // File belum ada, mulai kosong
    }

    // Tambah reservasi baru
    data.push(reservasi);
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(data, null, 2));

    // Buat pesan untuk WhatsApp
    const waMessage = `
🎉 *RESERVASI BARU*

👤 Nama: ${nama}
📧 Email: ${email}
📱 Telepon: ${telepon}
📅 Tanggal: ${tanggal}
🕐 Jam: ${jam}
👥 Jumlah Orang: ${jumlah}
📝 Catatan: ${catatan || '-'}

Waktu: ${new Date(reservasi.timestamp).toLocaleString('id-ID')}
    `.trim();

    // URL WhatsApp dengan pesan pre-fill
    const waURL = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;

    return res.status(200).json({
      success: true,
      message: 'Reservasi berhasil disimpan',
      reservasi,
      waURL, // Frontend bisa buka link ini untuk kirim ke WhatsApp
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Gagal memproses reservasi' });
  }
});

/**
 * GET /api/reservasi
 * Ambil semua reservasi (untuk admin)
 */
app.get('/api/reservasi', async (req, res) => {
  try {
    const raw = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return res.json(data);
  } catch (e) {
    return res.json([]);
  }
});

/**
 * DELETE /api/reservasi/:id
 * Hapus satu reservasi (untuk admin)
 */
app.delete('/api/reservasi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const raw = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    let data = JSON.parse(raw);
    data = data.filter((r) => r.id !== parseInt(id));
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(data, null, 2));
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal menghapus' });
  }
});

/**
 * GET /health
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend Ale's Place berjalan di http://localhost:${PORT}`);
  console.log(`📞 Notifikasi WhatsApp akan dikirim ke: +${ADMIN_WA}`);
});
