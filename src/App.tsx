import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PnLDashboard } from './pages/PnLDashboard';
import { IPTracking } from './pages/IPTracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PnLDashboard />} />
        <Route path="/pl" element={<PnLDashboard />} />
        <Route path="/ip" element={<IPTracking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
