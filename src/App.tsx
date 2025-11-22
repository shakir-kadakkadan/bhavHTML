import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PnLDashboard } from './pages/PnLDashboard';
import { IPTracking } from './pages/IPTracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PnLDashboard />} />
        <Route path="/pl" element={<PnLDashboard />} />
        <Route path="/ip" element={<IPTracking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
