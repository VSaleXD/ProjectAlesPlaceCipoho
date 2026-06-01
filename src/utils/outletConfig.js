import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

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

const OUTLET_CONFIG_STORAGE_KEY = 'outlet_config';
const OUTLET_CONFIG_TABLE = 'outlet_config';

const normalizeOutletConfig = (config = {}) => {
  return {
    operationalHours: {
      ...DEFAULT_CONFIG.operationalHours,
      ...(config.operationalHours || config.operational_hours || {}),
    },
    phone: config.phone || DEFAULT_CONFIG.phone,
    socialLinks: {
      ...DEFAULT_CONFIG.socialLinks,
      ...(config.socialLinks || config.social_links || {}),
    },
  };
};

const readCachedOutletConfig = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG;
  }

  const saved = window.localStorage.getItem(OUTLET_CONFIG_STORAGE_KEY);
  if (!saved) {
    return DEFAULT_CONFIG;
  }

  try {
    return normalizeOutletConfig(JSON.parse(saved));
  } catch (error) {
    return DEFAULT_CONFIG;
  }
};

const writeCachedOutletConfig = (config) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(OUTLET_CONFIG_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('outlet_config_changed'));
};

const fetchOutletConfigFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from(OUTLET_CONFIG_TABLE)
      .select('operational_hours, phone, social_links')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return normalizeOutletConfig({
      operationalHours: data.operational_hours,
      phone: data.phone,
      socialLinks: data.social_links,
    });
  } catch (error) {
    return null;
  }
};

export const getOutletConfig = () => {
  return readCachedOutletConfig();
};

export const loadOutletConfig = async () => {
  const remoteConfig = await fetchOutletConfigFromSupabase();
  if (remoteConfig) {
    writeCachedOutletConfig(remoteConfig);
    return remoteConfig;
  }

  return readCachedOutletConfig();
};

export const saveOutletConfig = async (newConfig) => {
  const normalizedConfig = normalizeOutletConfig(newConfig);

  writeCachedOutletConfig(normalizedConfig);

  let syncedToSupabase = false;
  try {
    const { error } = await supabase.from(OUTLET_CONFIG_TABLE).upsert(
      {
        id: 1,
        operational_hours: normalizedConfig.operationalHours,
        phone: normalizedConfig.phone,
        social_links: normalizedConfig.socialLinks,
      },
      { onConflict: 'id' }
    );

    syncedToSupabase = !error;
  } catch (error) {
    syncedToSupabase = false;
  }

  return { config: normalizedConfig, syncedToSupabase };
};

export const useOutletConfig = () => {
  const [config, setConfig] = useState(getOutletConfig());

  useEffect(() => {
    let isMounted = true;

    const syncRemoteConfig = async () => {
      const remoteConfig = await loadOutletConfig();
      if (isMounted) {
        setConfig(remoteConfig);
      }
    };

    const handleChanged = () => {
      setConfig(readCachedOutletConfig());
    };

    syncRemoteConfig();
    window.addEventListener('outlet_config_changed', handleChanged);
    return () => {
      isMounted = false;
      window.removeEventListener('outlet_config_changed', handleChanged);
    };
  }, []);

  return config;
};
