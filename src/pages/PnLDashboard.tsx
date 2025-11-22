import { useState, useEffect } from 'react';
import type { PnLData } from '../types';
import { DATA_URL, trackIPData } from '../utils/firebase';
import { Summary } from '../components/Summary';
import { FiscalYear } from '../components/FiscalYear';
import { MatchedPositions } from '../components/MatchedPositions';
import { GrowwSummary } from '../components/GrowwSummary';
import { DeltaSummary } from '../components/DeltaSummary';

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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 md:p-5">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-6 md:p-8 text-center relative">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Profit & Loss Statement DUMMY DATA</h1>
          <p className="text-base md:text-lg opacity-90">
            <a
              href="https://linktr.ee/sndsanmdnsa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline"
            >
              https://linktr.ee/sndsanmdnsa (Verified P&L)
            </a>
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-3 mt-4 md:absolute md:top-5 md:right-8 md:mt-0 text-sm">
            <label htmlFor="currencyFormat" className="cursor-pointer select-none">
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
            <label htmlFor="currencyFormat" className="cursor-pointer select-none">
              Full Amount
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5">
          {loading && (
            <div className="text-center py-12 text-lg text-[#667eea]">
              Loading P&L data...
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-lg text-red-500">
              Error loading data: {error}
            </div>
          )}

          {pnlData && (
            <>
              {pnlData.summary && (
                <Summary summary={pnlData.summary} useFullFormat={useFullFormat} />
              )}

              {pnlData.fiscalYears?.map((fy, index) => (
                <FiscalYear key={index} fiscalYear={fy} useFullFormat={useFullFormat} />
              ))}

              {pnlData.allMatchedPositions && (
                <MatchedPositions matched={pnlData.allMatchedPositions} useFullFormat={useFullFormat} />
              )}

              {pnlData.growwPnlSummary && (
                <GrowwSummary groww={pnlData.growwPnlSummary} useFullFormat={useFullFormat} />
              )}

              {pnlData.deltaExchangePnlSummary && (
                <DeltaSummary delta={pnlData.deltaExchangePnlSummary} useFullFormat={useFullFormat} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
