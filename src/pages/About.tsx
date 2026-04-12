import { Heart, Mail, MessageCircle, Github, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 transform rotate-3">
          <span className="text-3xl font-bold text-white">S</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SeraphAI</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Version 1.0.0</p>
      </header>
      
      <div className="p-6 max-w-2xl mx-auto w-full space-y-8">
        
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Made with <Heart className="w-5 h-5 inline text-red-500 mx-1" /> in Uganda</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            SeraphAI was built by <strong>Ndhote Elisha Andrew</strong>, a passionate local developer in Uganda who loves building software that empowers people.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/256756700777" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto justify-center">
              <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
            </a>
            <a href="mailto:developer@example.com" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center">
              <Mail className="w-4 h-4 mr-2" /> Email Me
            </a>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support the Project</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If you find SeraphAI useful, please consider supporting my career by sharing this app with your friends or providing feedback.
          </p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Share2 className="w-4 h-4 mr-2" /> Share App
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Github className="w-4 h-4 mr-2" /> GitHub
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

// Need to import Share2
import { Share2 } from 'lucide-react';
