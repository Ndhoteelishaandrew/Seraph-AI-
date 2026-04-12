import { useStore } from '../store/useStore';
import { Moon, Sun, Monitor, User, Bell, Shield, Trash2 } from 'lucide-react';
import { db } from '../lib/db';

export default function Settings() {
  const { settings, updateSettings } = useStore();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'seraph-fire', name: 'Seraph Fire', icon: Monitor },
    { id: 'celestial-blue', name: 'Celestial Blue', icon: Monitor },
    { id: 'earth-tone', name: 'Earth Tone', icon: Monitor },
  ];

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      await db.messages.clear();
      alert('Chat history cleared.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </header>
      
      <div className="p-6 max-w-3xl mx-auto w-full space-y-8">
        
        {/* Profile Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" /> Profile
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{settings?.username || 'Guest'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{settings?.isGuest ? 'Guest Account' : 'Registered User'}</p>
              </div>
              <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                {settings?.isGuest ? 'Sign In' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-orange-500" /> Appearance
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your preferred theme.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id as any })}
                  className={`flex items-center p-3 rounded-xl border ${
                    settings?.theme === theme.id 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <theme.icon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" /> Data & Privacy
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Clear Chat History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delete all messages from your device.</p>
              </div>
              <button 
                onClick={handleClearChat}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
