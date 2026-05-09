import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface Settings {
  theme: 'Dark' | 'Light';
  language: 'English' | 'Marathi' | 'Hindi';
  notifications: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  English: {
    home: 'Home',
    ai: 'AI Analysis',
    history: 'History',
    stats: 'Stats',
    games: 'Games',
    about: 'About',
    profile: 'Profile',
    logout: 'Sign Out',
    dashboard: 'Go to Dashboard',
    getStarted: 'Get Started for Free',
    demo: 'Live Demo',
    heroTitle1: 'Understand',
    heroTitle2: 'emotions.',
    heroTitle3: 'Instantly.',
    heroDesc: "Analyzing emotions in Marathi is now easy. Accurately identify the feelings behind your words with MoodMate's advanced AI technology.",
    engineTag: 'Marathi Sentiment Engine',
  },
  Marathi: {
    home: 'होम',
    ai: 'AI विश्लेषण',
    history: 'इतिहास',
    stats: 'आकडेवारी',
    games: 'खेळ',
    about: 'आमच्याबद्दल',
    profile: 'प्रोफाइल',
    logout: 'बाहेर पडा',
    dashboard: 'डॅशबोर्डवर जा',
    getStarted: 'विनामूल्य सुरू करा',
    demo: 'थेट डेमो',
    heroTitle1: 'भावना',
    heroTitle2: 'ओळखा.',
    heroTitle3: 'झटपट.',
    heroDesc: 'मराठीतील शब्दांमागील भावना ओळखणे आता सोपे झाले आहे. मूडमेटच्या प्रगत तंत्रज्ञानासह तुमच्या भावनांचे अचूक विश्लेषण करा.',
    engineTag: 'मराठी सेंटीमेंट इंजिन',
  },
  Hindi: {
    home: 'होम',
    ai: 'AI विश्लेषण',
    history: 'इतिहास',
    stats: 'आंकड़े',
    games: 'खेल',
    about: 'हमारे बारे में',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड पर जाएं',
    getStarted: 'मुफ्त में शुरू करें',
    demo: 'लाइव डेमो',
    heroTitle1: 'भावनाएं',
    heroTitle2: 'समझें।',
    heroTitle3: 'तुरंत।',
    heroDesc: 'मराठी और हिंदी में भावनाओं का विश्लेषण अब आसान है। मूडमेट की उन्नत एआई तकनीक के साथ अपने शब्दों के पीछे की भावनाओं को सटीक रूप से पहचानें।',
    engineTag: 'मराठी सेंटीमेंट इंजन',
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    theme: 'Dark',
    language: 'English',
    notifications: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/api/v1/profile/me');
        if (data?.data?.preferences) {
          setSettings(prev => ({ ...prev, ...data.data.preferences }));
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  useEffect(() => {
    // Apply theme to document
    if (settings.theme === 'Light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [settings.theme]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      await api.post('/api/v1/profile/me', { preferences: merged });
    } catch (err) {
      console.error('Failed to sync settings');
      throw err;
    }
  };

  const t = (key: string) => {
    return translations[settings.language]?.[key] || translations['English'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
