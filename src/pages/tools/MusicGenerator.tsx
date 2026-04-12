import { useState } from 'react';
import { Music, Download, Loader2 } from 'lucide-react';
import { generateMusic } from '../../services/ai';

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<'clip' | 'pro'>('clip');
  const [audioData, setAudioData] = useState<{audioUrl: string, lyrics: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setProgressText('');
    try {
      const data = await generateMusic(prompt, duration, (text) => setProgressText(text));
      setAudioData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate music');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Music className="w-8 h-8 mr-3 text-purple-500" /> Music Generator
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Generate songs and audio tracks with SeraphAI.</p>
      </header>
      
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to create (e.g., 'A 30-second cinematic orchestral track')..."
            className="w-full h-32 bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none mb-4"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setDuration('clip')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === 'clip' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Short Clip (30s)
              </button>
              <button
                onClick={() => setDuration('pro')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === 'pro' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Full Track (Pro)
              </button>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 flex items-center"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : 'Generate'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">
            {error}
          </div>
        )}

        {isLoading && progressText && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100 dark:border-purple-800/30 whitespace-pre-wrap">
            {progressText}
          </div>
        )}

        {audioData && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <audio src={audioData.audioUrl} controls className="w-full max-w-md" />
              <a 
                href={audioData.audioUrl} 
                download="seraph-music.wav" 
                className="ml-4 p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
            {audioData.lyrics && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Lyrics / Metadata</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {audioData.lyrics}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
