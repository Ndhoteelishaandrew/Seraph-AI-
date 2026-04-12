import { useState } from 'react';
import { Video, Download, Share2, Loader2 } from 'lucide-react';
import { generateVideo } from '../../services/ai';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<'short' | 'long'>('short');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateVideo(prompt, duration);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Video className="w-8 h-8 mr-3 text-pink-500" /> Video Generator
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Create stunning videos with SeraphAI.</p>
      </header>
      
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full h-32 bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 resize-none mb-4"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setDuration('short')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === 'short' 
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Short (Lite)
              </button>
              <button
                onClick={() => setDuration('long')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === 'long' 
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Long (Pro 4K)
              </button>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:hover:bg-pink-600 flex items-center"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating (takes a few mins)...</> : 'Generate'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">
            {error}
          </div>
        )}

        {videoUrl && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center aspect-video">
              <video src={videoUrl} controls className="w-full h-full object-contain" autoPlay loop />
              <div className="absolute top-4 right-4 flex space-x-2">
                <a href={videoUrl} download="seraph-video.mp4" className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
