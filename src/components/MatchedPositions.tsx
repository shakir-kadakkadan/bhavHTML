import { useState } from 'react';
import type { AllMatchedPositions } from '../types';
import { formatCurrency, getPnLClass } from '../utils/format';
import { SummaryItem } from './SummaryItem';

interface MatchedPositionsProps {
  matched: AllMatchedPositions;
  useFullFormat: boolean;
}

export const MatchedPositions = ({ matched, useFullFormat }: MatchedPositionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border-2 border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[#667eea] hover:shadow-lg">
      <div
        className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 md:p-5 cursor-pointer hover:from-[#5568d3] hover:to-[#653a8b] transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="text-lg md:text-xl font-bold mr-auto">All Matched Positions ({matched.count})</span>
          <div className="flex flex-wrap gap-3 md:gap-4 text-sm justify-end">
            <SummaryItem label="Total P&L" value={matched.totalTradePnL} useFullFormat={useFullFormat} />
          </div>
          <div className={`expand-icon w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/35 hover:scale-110 flex-shrink-0 ${isExpanded ? 'active' : ''}`} />
        </div>
      </div>

      <div className={`accordion-content bg-gray-50 ${isExpanded ? 'active' : ''}`}>
        {matched.positions && matched.positions.length > 0 && (
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#667eea] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Symbol</th>
                <th className="p-3 text-right font-semibold">Qty</th>
                <th className="p-3 text-right font-semibold">Buy Date</th>
                <th className="p-3 text-right font-semibold">Buy Value</th>
                <th className="p-3 text-right font-semibold">Sell Date</th>
                <th className="p-3 text-right font-semibold">Sell Value</th>
                <th className="p-3 text-right font-semibold">P&L</th>
              </tr>
            </thead>
            <tbody>
              {matched.positions.map((pos, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                  <td className="p-3 font-semibold text-[#667eea]">{pos.symbol}</td>
                  <td className="p-3 text-right">{pos.qty}</td>
                  <td className="p-3 text-right">{pos.buyDate}</td>
                  <td className="p-3 text-right">{formatCurrency(pos.buyValue, useFullFormat)}</td>
                  <td className="p-3 text-right">{pos.sellDate}</td>
                  <td className="p-3 text-right">{formatCurrency(pos.sellValue, useFullFormat)}</td>
                  <td className={`p-3 text-right ${getPnLClass(pos.tradePnL)}`}>
                    {formatCurrency(pos.tradePnL, useFullFormat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
