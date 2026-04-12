import { useState } from 'react';
import { Image as ImageIcon, Download, Share2, Loader2 } from 'lucide-react';
import { generateImage } from '../../services/ai';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateImage(prompt, aspectRatio);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `seraph-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <ImageIcon className="w-8 h-8 mr-3 text-blue-500" /> Image Generator
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Create high-quality images with SeraphAI.</p>
      </header>
      
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            className="w-full h-32 bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none mb-4"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              {(["1:1", "16:9", "9:16"] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    aspectRatio === ratio 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center"
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

        {imageUrl && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
              <img src={imageUrl} alt="Generated" className="max-w-full max-h-[600px] object-contain" />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={handleDownload} className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
