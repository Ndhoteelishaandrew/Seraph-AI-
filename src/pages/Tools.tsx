import { Image, Music, Video, Code, Package, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tools() {
  const navigate = useNavigate();
  
  const tools = [
    { id: 'image', name: 'Image Generator', icon: Image, description: 'Create high-quality images with SeraphAI.', color: 'bg-blue-500', path: '/tools/image' },
    { id: 'music', name: 'Music Generator', icon: Music, description: 'Generate songs and audio tracks.', color: 'bg-purple-500', path: '/tools/music' },
    { id: 'video', name: 'Video Editor', icon: Video, description: 'Edit and generate video content.', color: 'bg-pink-500', path: '/tools/video' },
    { id: 'app', name: 'App Builder', icon: Package, description: 'Convert your ideas into web apps and APKs.', color: 'bg-orange-500', path: '/tools/app' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <header className="px-6 py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tools & Features</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Explore the powerful capabilities of SeraphAI.</p>
      </header>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => navigate(tool.path)}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tool.description}</p>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                Open Tool <Sparkles className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Unlock Premium Features</h2>
          <p className="text-orange-100 mb-4 text-sm max-w-md mx-auto">Get access to advanced models, unlimited generations, and remove watermarks for just UGX 500.</p>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold text-sm hover:bg-orange-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
