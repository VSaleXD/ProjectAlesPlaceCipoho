import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const withParams = (url) => `${url}?auto=format&fit=crop&w=1200&q=80`;

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

function getMenuImage(item = {}) {
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

async function migrateImages() {
  console.log('Fetching menu items from Supabase...');
  const { data: menuItems, error: fetchError } = await supabase.from('menu').select('*');
  
  if (fetchError) {
    console.error('Error fetching data:', fetchError);
    return;
  }

  console.log(`Found ${menuItems.length} items. Updating images...`);

  let successCount = 0;
  for (const item of menuItems) {
    if (!item.image_url) {
      const url = getMenuImage(item);
      const { error: updateError } = await supabase
        .from('menu')
        .update({ image_url: url })
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`Error updating item ${item.id}:`, updateError);
      } else {
        successCount++;
        console.log(`Updated item: ${item.nama} -> ${url}`);
      }
    } else {
        console.log(`Skipped item: ${item.nama} (already has image_url)`);
    }
  }

  console.log(`Migration complete! Successfully updated ${successCount} items.`);
}

migrateImages();
