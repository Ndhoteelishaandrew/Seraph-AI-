import { create } from 'zustand';
import { db, UserSettings } from '../lib/db';

interface AppState {
  settings: UserSettings | null;
  isSidebarOpen: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  settings: null,
  isSidebarOpen: false,
  loadSettings: async () => {
    const settings = await db.settings.toCollection().first();
    if (settings) {
      set({ settings });
      // Apply theme
      document.documentElement.className = settings.theme;
    } else {
      const defaultSettings: UserSettings = {
        username: 'Guest',
        theme: 'dark',
        isGuest: true,
        onboardingComplete: false
      };
      await db.settings.add(defaultSettings);
      set({ settings: defaultSettings });
      document.documentElement.className = 'dark';
    }
  },
  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    if (currentSettings && currentSettings.id) {
      await db.settings.update(currentSettings.id, newSettings);
      const updated = await db.settings.get(currentSettings.id);
      if (updated) {
        set({ settings: updated });
        if (newSettings.theme) {
          document.documentElement.className = newSettings.theme;
        }
      }
    }
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
}));
