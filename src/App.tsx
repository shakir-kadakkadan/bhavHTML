import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { PnLDashboard } from './pages/PnLDashboard';
import { IPTracking } from './pages/IPTracking';
import { PnLGraph } from './pages/PnLGraph';
import { SocialPreview } from './pages/SocialPreview';
import { AddSocial } from './pages/AddSocial';
import { ITRFilings } from './pages/ITRFilings';
import { LinksPage } from './pages/LinksPage';
import { AdminLinks } from './pages/AdminLinks';

function App() {
  useEffect(() => {
    const targetHost = 'trial-and-error.web.app';
    const currentHost = window.location.hostname;

    // Skip redirect for localhost development
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1' && currentHost !== targetHost) {
      const targetUrl = `https://${targetHost}${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(targetUrl);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>

          {/* <Route path="*" element={<BlankPage />} /> */}
          <Route path="/" element={<Navigate to="/links/1" replace />} />
          <Route path="/pl" element={<PnLDashboard />} />
          <Route path="/plgraph" element={<PnLGraph />} />
          <Route path="/ip" element={<IPTracking />} />
          <Route path="/add_social" element={<AddSocial />} />
          <Route path="/admin/links" element={<AdminLinks />} />
          <Route path="/itr" element={<ITRFilings />} />
          <Route path="/l/*" element={<SocialPreview />} />
          <Route path="/links/:username" element={<LinksPage />} />
          <Route path="*" element={<Navigate to="/links/1" replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
