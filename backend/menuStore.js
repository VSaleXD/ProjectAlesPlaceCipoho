import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { menuData as seedMenuData } from '../src/data/menu.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MENU_FILE = path.join(__dirname, 'menus.json');

export async function loadMenus() {
  try {
    const raw = await fs.readFile(MENU_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [...seedMenuData];
  } catch {
    return [...seedMenuData];
  }
}

export async function saveMenus(menus) {
  await fs.writeFile(MENU_FILE, JSON.stringify(menus, null, 2));
}
