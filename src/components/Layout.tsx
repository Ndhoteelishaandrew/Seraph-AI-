import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export default function Layout() {
  const { loadSettings, isSidebarOpen, toggleSidebar } = useStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-16 md:pb-0">
        <Outlet />
      </main>
      
      <Navigation />
    </div>
  );
}
