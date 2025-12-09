import { useState, useEffect } from 'react';
import type { PnLData } from '../types';
import { DATA_URL, trackIPData } from '../utils/firebase';
import { FiscalYear } from '../components/FiscalYear';

export const PnLDashboard = () => {
  const [pnlData, setPnlData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFullFormat, setUseFullFormat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPnlData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
    trackIPData('page_load');
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-gray-900 dark:to-gray-800 p-5 md:p-5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] dark:from-gray-800 dark:to-gray-700 text-white p-6 md:p-8 text-center relative transition-colors duration-300">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 hidden md:flex items-center gap-4">
            {/* Currency Toggle */}
            <div className="flex items-center gap-3 text-sm">
              <label htmlFor="currencyFormat" className="cursor-pointer select-none hidden md:block">
                Short Format
              </label>
              <div className="relative inline-block w-[50px] h-6">
                <input
                  type="checkbox"
                  id="currencyFormat"
                  checked={useFullFormat}
                  onChange={(e) => setUseFullFormat(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span className="toggle-slider" />
              </div>
              <label htmlFor="currencyFormat" className="cursor-pointer select-none hidden md:block">
                Full Amount
              </label>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold mb-2">Profit & Loss Statement</h1>
          <p className="text-base md:text-lg opacity-90">
            <a
              href="https://linktr.ee/sudoku_trader"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:text-gray-200 transition-colors"
            >
              https://linktr.ee/sudoku_trader (Verified P&L)
            </a>
          </p>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {loading && (
            <div className="text-center py-12 text-lg text-[#667eea] dark:text-blue-400">
              Loading P&L data...
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-lg text-red-500 dark:text-red-400">
              Error loading data: {error}
            </div>
          )}

          {pnlData && (
            <>
              {pnlData.map((fy, index) => (
                <FiscalYear key={index} fiscalYear={fy} useFullFormat={useFullFormat} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
