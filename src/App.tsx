import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import About from './pages/About';
import Onboarding from './pages/Onboarding';
import { ErrorBoundary } from './components/ErrorBoundary';

import ImageGenerator from './pages/tools/ImageGenerator';
import VideoGenerator from './pages/tools/VideoGenerator';
import MusicGenerator from './pages/tools/MusicGenerator';
import AppBuilder from './pages/tools/AppBuilder';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { settings } = useStore();
  
  if (!settings) return null; // Loading state
  
  if (!settings.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { loadSettings } = useStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Chat />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/image" element={<ImageGenerator />} />
            <Route path="tools/video" element={<VideoGenerator />} />
            <Route path="tools/music" element={<MusicGenerator />} />
            <Route path="tools/app" element={<AppBuilder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

