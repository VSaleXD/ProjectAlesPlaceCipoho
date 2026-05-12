import { createClient } from '@supabase/supabase-js';
import { menuData } from './src/data/menu.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be defined in the .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateData() {
  console.log(`Menyiapkan migrasi ${menuData.length} item menu ke Supabase...`);
  
  // Format data
  const dataToInsert = menuData.map(item => ({
    id: item.id,
    nama: item.nama,
    harga: item.harga,
    kategori: item.kategori,
    deskripsi: item.deskripsi || null,
    bestseller: item.bestseller || false,
    image_url: item.image_url || null,
  }));

  const { data, error } = await supabase
    .from('menu')
    .upsert(dataToInsert) // Use upsert to avoid duplicate errors if run multiple times
    .select();

  if (error) {
    console.error('Error saat migrasi data:', error);
  } else {
    console.log(`Berhasil memigrasi ${data.length} item!`);
  }
}

migrateData();
