import { useEffect, useState } from 'react';

const DEFAULT_CONFIG = {
  operationalHours: {
    weekdays: '11:00 – 21:00 WIB',
    weekends: '10:00 – 21:00 WIB',
  },
  phone: '0815-7215-5275',
  socialLinks: {
    instagram: 'https://www.instagram.com/alesplacecipoho',
    tiktok: 'https://www.tiktok.com/@alesplacecipoho',
    whatsapp: 'https://wa.me/6281572155275',
    facebook: 'https://www.facebook.com/alesplacecipoho',
  }
};

export const getOutletConfig = () => {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  const saved = localStorage.getItem('outlet_config');
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

export const saveOutletConfig = (newConfig) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('outlet_config', JSON.stringify(newConfig));
  window.dispatchEvent(new Event('outlet_config_changed'));
};

export const useOutletConfig = () => {
  const [config, setConfig] = useState(getOutletConfig());

  useEffect(() => {
    const handleChanged = () => {
      setConfig(getOutletConfig());
    };
    window.addEventListener('outlet_config_changed', handleChanged);
    return () => window.removeEventListener('outlet_config_changed', handleChanged);
  }, []);

  return config;
};
