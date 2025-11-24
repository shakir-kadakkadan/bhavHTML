import { useState } from 'react';
import type { FiscalYear as FiscalYearType } from '../types';
import { formatCurrency, getPnLClass, getPnLColor, formatDate } from '../utils/format';
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

  const totalExpense = fiscalYear.expense ?? (fiscalYear.pnl?.reduce((sum, entry) => sum + (entry.expense || 0), 0) || 0);

  return (
    <div className="mb-4 border-2 border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[#667eea] hover:shadow-lg">
      <div
        className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 md:p-5 cursor-pointer hover:from-[#5568d3] hover:to-[#653a8b] transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="text-lg md:text-xl font-bold mr-auto">{fiscalYear.title}</span>
          <div className="flex flex-wrap gap-3 md:gap-4 text-sm justify-end">
            <SummaryItem label="Net Bill" value={fiscalYear.netBill} useFullFormat={useFullFormat} />
            {totalExpense !== 0 && (
              <SummaryItem label="Expense" value={totalExpense} useFullFormat={useFullFormat} isExpense={true} />
            )}
            <SummaryItem label="Gross Bill" value={fiscalYear.grossBill} useFullFormat={useFullFormat} />
            <SummaryItem label="Trade P&L" value={fiscalYear.tpl} useFullFormat={useFullFormat} />
            <SummaryItem label="Net P&L" value={fiscalYear.netTPL} useFullFormat={useFullFormat} />
          </div>
          <div className={`w-8 h-8 flex-shrink-0 ${(fiscalYear.pnl && fiscalYear.pnl.length > 0) || (fiscalYear.swings && fiscalYear.swings.length > 0) || (fiscalYear.top10Trades && fiscalYear.top10Trades.length > 0) ? `expand-icon rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/35 hover:scale-110 ${isExpanded ? 'active' : ''}` : ''}`} />
        </div>
      </div>

      <div className={`accordion-content bg-gray-50 ${isExpanded ? 'active' : ''}`}>
        {fiscalYear.pnl && fiscalYear.pnl.length > 0 && (
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#667eea] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-right font-semibold">Bill</th>
                <th className="p-3 text-right font-semibold">Expense</th>
                <th className="p-3 text-right font-semibold">Gross Bill</th>
                <th className="p-3 text-right font-semibold">Trade P&L</th>
                <th className="p-3 text-right font-semibold">Net P&L</th>
              </tr>
            </thead>
            <tbody>
              {fiscalYear.pnl.map((entry, index) => (
                <>
                  <tr
                    key={`date-${index}`}
                    className="border-b border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors"
                    onClick={() => toggleDate(index)}
                  >
                    <td className={`p-3 font-semibold text-[#667eea]`}>
                      {entry.name || formatDate(entry.dateMilli)}
                    </td>
                    <td className={`p-3 text-right ${getPnLClass(entry.bill)}`}>{formatCurrency(entry.bill, useFullFormat)}</td>
                    <td className="p-3 text-right text-red-400 font-bold">
                      {entry.expense != null
                        ? formatCurrency(entry.expense, useFullFormat)
                        : entry.calculatedExpense != null
                          ? `~${formatCurrency(entry.calculatedExpense, useFullFormat)}`
                          : formatCurrency(0, useFullFormat)}
                    </td>
                    <td className={`p-3 text-right ${getPnLColor(entry.grossBill)}`}>{formatCurrency(entry.grossBill, useFullFormat)}</td>
                    <td className={`p-3 text-right ${getPnLColor(entry.tpl)}`}>
                      {formatCurrency(entry.tpl, useFullFormat)}
                    </td>
                    <td className={`p-3 text-right ${getPnLClass(entry.ntpl)}`}>
                      {formatCurrency(entry.ntpl, useFullFormat)}
                    </td>
                  </tr>
                  {entry.trades && entry.trades.length > 0 && expandedDates.has(index) && (
                    <tr key={`trades-${index}`} className="bg-indigo-50">
                      <td colSpan={6} className="p-0">
                        <div className="p-4 border-t border-gray-300">
                          <div className="font-bold text-[#667eea] mb-3 text-sm">
                            Trades for {entry.name || formatDate(entry.dateMilli)}
                          </div>
                          {entry.trades.map((trade, tradeIndex) => (
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
        {(!fiscalYear.pnl || fiscalYear.pnl.length === 0) && fiscalYear.swings && fiscalYear.swings.length > 0 && (
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#667eea] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Symbol</th>
                <th className="p-3 text-right font-semibold">Qty</th>
                <th className="p-3 text-right font-semibold">Buy Date</th>
                <th className="p-3 text-right font-semibold">Sell Date</th>
                <th className="p-3 text-right font-semibold">Buy Value</th>
                <th className="p-3 text-right font-semibold">Sell Value</th>
                <th className="p-3 text-right font-semibold">P&L</th>
              </tr>
            </thead>
            <tbody>
              {fiscalYear.swings.map((swing, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                  <td className="p-3 font-semibold text-[#667eea]">{swing.symbol}</td>
                  <td className="p-3 text-right">{swing.qty}</td>
                  <td className="p-3 text-right">{formatDate(swing.buyAtMilli)}</td>
                  <td className="p-3 text-right">{formatDate(swing.sellAtMilli)}</td>
                  <td className="p-3 text-right">{formatCurrency(swing.buyVal, useFullFormat)}</td>
                  <td className="p-3 text-right">{formatCurrency(swing.sellVal, useFullFormat)}</td>
                  <td className={`p-3 text-right ${getPnLClass(swing.pnl)}`}>
                    {formatCurrency(swing.pnl, useFullFormat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {fiscalYear.top10Trades && fiscalYear.top10Trades.length > 0 && (
          <div className="p-4">
            {fiscalYear.top10Trades.map((trade, index) => (
              <TradeItem key={index} trade={trade} useFullFormat={useFullFormat} showDate={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
