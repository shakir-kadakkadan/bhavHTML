import { useState } from 'react';
import type { FiscalYear as FiscalYearType } from '../types';
import { formatCurrency, getPnLClass } from '../utils/format';
import { SummaryItem } from './SummaryItem';
import { TradeItem } from './TradeItem';

interface FiscalYearProps {
  fiscalYear: FiscalYearType;
  useFullFormat: boolean;
}

export const FiscalYear = ({ fiscalYear, useFullFormat }: FiscalYearProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<number>>(new Set());

  const toggleDate = (index: number) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="mb-4 border-2 border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[#667eea] hover:shadow-lg">
      <div
        className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 md:p-5 cursor-pointer hover:from-[#5568d3] hover:to-[#653a8b] transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="text-lg md:text-xl font-bold mr-auto">{fiscalYear.fiscalYear}</span>
          <div className="flex flex-wrap gap-3 md:gap-4 text-sm justify-end">
            <SummaryItem label="Net Bill" value={fiscalYear.totals.netBill} useFullFormat={useFullFormat} />
            <SummaryItem label="Expenses" value={fiscalYear.totals.totalExpenses} useFullFormat={useFullFormat} isExpense />
            <SummaryItem label="Gross Bill" value={fiscalYear.totals.grossBill} useFullFormat={useFullFormat} />
            <SummaryItem label="Trade P&L" value={fiscalYear.totals.tradePnL} useFullFormat={useFullFormat} />
            <SummaryItem label="Net P&L" value={fiscalYear.totals.netPnL} useFullFormat={useFullFormat} />
          </div>
          <div className={`expand-icon w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/35 hover:scale-110 flex-shrink-0 ${isExpanded ? 'active' : ''}`} />
        </div>
      </div>

      <div className={`accordion-content bg-gray-50 ${isExpanded ? 'active' : ''}`}>
        {fiscalYear.dates && fiscalYear.dates.length > 0 && (
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#667eea] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-right font-semibold">Net Bill</th>
                <th className="p-3 text-right font-semibold">Expense</th>
                <th className="p-3 text-right font-semibold">Gross Bill</th>
                <th className="p-3 text-right font-semibold">Trade P&L</th>
                <th className="p-3 text-right font-semibold">Net P&L</th>
              </tr>
            </thead>
            <tbody>
              {fiscalYear.dates.map((date, index) => (
                <>
                  <tr
                    key={`date-${index}`}
                    className="border-b border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors"
                    onClick={() => toggleDate(index)}
                  >
                    <td className="p-3 font-semibold text-[#667eea]">{date.date}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(date.netBill, useFullFormat)}</td>
                    <td className="p-3 text-right text-red-500">{formatCurrency(date.expense, useFullFormat)}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(date.grossBill, useFullFormat)}</td>
                    <td className={`p-3 text-right ${getPnLClass(date.tradePnL)}`}>
                      {formatCurrency(date.tradePnL, useFullFormat)}
                    </td>
                    <td className={`p-3 text-right ${getPnLClass(date.netPnL)}`}>
                      {formatCurrency(date.netPnL, useFullFormat)}
                    </td>
                  </tr>
                  {date.trades && date.trades.length > 0 && expandedDates.has(index) && (
                    <tr key={`trades-${index}`} className="bg-indigo-50">
                      <td colSpan={6} className="p-0">
                        <div className="p-4 border-t border-gray-300">
                          <div className="font-bold text-[#667eea] mb-3 text-sm">
                            Trades for {date.date}
                          </div>
                          {date.trades.map((trade, tradeIndex) => (
                            <TradeItem key={tradeIndex} trade={trade} useFullFormat={useFullFormat} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
