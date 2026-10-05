import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilitySettings {
  lowMotion: boolean;
  audioGuide: boolean;
  textGuide: boolean;
  seniorFriendly: boolean;
  mobilityFriendly: boolean;
  enhancedVisuals: boolean;
  highContrast: boolean;
  largeText: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  resetSettings: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  lowMotion: false,
  audioGuide: false,
  textGuide: true,
  seniorFriendly: false,
  mobilityFriendly: false,
  enhancedVisuals: true,
  highContrast: false,
  largeText: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('traveltwin_accessibility');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('traveltwin_accessibility', JSON.stringify(settings));

    // Update body classes
    if (settings.lowMotion) {
      document.body.classList.add('accessibility-low-motion');
    } else {
      document.body.classList.remove('accessibility-low-motion');
    }

    if (settings.highContrast) {
      document.body.classList.add('accessibility-high-contrast');
    } else {
      document.body.classList.remove('accessibility-high-contrast');
    }

    if (settings.largeText) {
      document.body.classList.add('accessibility-large-text');
    } else {
      document.body.classList.remove('accessibility-large-text');
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
