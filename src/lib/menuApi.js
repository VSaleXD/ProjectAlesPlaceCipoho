import { menuData as fallbackMenuData } from '../data/menu';

const API_BASE = 'http://localhost:3001/api/menu';

export async function fetchMenu({ allowFallback = true } = {}) {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Gagal mengambil menu');
    const data = await response.json();
    return Array.isArray(data) ? data : fallbackMenuData;
  } catch (error) {
    if (!allowFallback) {
      throw error;
    }
    return fallbackMenuData;
  }
}

export async function addMenu(menu) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal menyimpan menu');
  }

  return data;
}

export async function deleteMenu(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Gagal menghapus menu');
  }

  return data;
}
