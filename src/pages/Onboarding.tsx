import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Sparkles, ArrowRight, User } from 'lucide-react';

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const { updateSettings } = useStore();
  const navigate = useNavigate();

  const handleContinue = async () => {
    const name = username.trim() || 'Guest';
    await updateSettings({ 
      username: name, 
      onboardingComplete: true,
      isGuest: name === 'Guest'
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-8 transform rotate-12">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Welcome to SeraphAI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your super-intelligent, truthful companion. Let's get to know each other.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What should I call you?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-transparent rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02]"
            >
              Start Chatting <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                setUsername('Guest');
                handleContinue();
              }}
              className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip and continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
