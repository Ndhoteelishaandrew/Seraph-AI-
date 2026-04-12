import { useState } from 'react';
import { Package, Download, Play, Code as CodeIcon, Loader2 } from 'lucide-react';
import { generateAppCode } from '../../services/ai';

export default function AppBuilder() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'preview' | 'code'>('preview');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const generatedCode = await generateAppCode(prompt);
      setCode(generatedCode);
      setView('preview');
    } catch (err: any) {
      setError(err.message || 'Failed to generate app');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seraph-app-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAPK = () => {
    alert("To build a native APK, download the HTML file and upload it to PWABuilder.com. SeraphAI has prepared the code to be PWA-ready!");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="w-8 h-8 mr-3 text-orange-500" /> App Builder
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Generate complete single-file web apps.</p>
      </header>
      
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the app you want to build (e.g., 'A beautiful calculator app with dark mode using Tailwind CSS')..."
            className="w-full h-24 bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none mb-4"
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 flex items-center"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Building App...</> : 'Build App'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">
            {error}
          </div>
        )}

        {code && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setView('preview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    view === 'preview' 
                      ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <Play className="w-4 h-4 mr-2" /> Preview
                </button>
                <button
                  onClick={() => setView('code')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    view === 'code' 
                      ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <CodeIcon className="w-4 h-4 mr-2" /> Code
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadHTML}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" /> HTML
                </button>
                <button
                  onClick={handleDownloadAPK}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                >
                  <Package className="w-4 h-4 mr-2" /> APK
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              {view === 'preview' ? (
                <iframe 
                  srcDoc={code} 
                  title="App Preview" 
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-modals allow-forms allow-popups"
                />
              ) : (
                <pre className="w-full h-full p-4 overflow-auto bg-gray-900 text-gray-100 text-sm font-mono">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
