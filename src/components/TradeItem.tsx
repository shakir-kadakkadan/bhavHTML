import type { Trade } from '../types';
import { formatCurrency, getPnLClass, formatDate } from '../utils/format';

interface TradeItemProps {
  trade: Trade;
  useFullFormat: boolean;
  showDate?: boolean;
}

export const TradeItem = ({ trade, useFullFormat, showDate }: TradeItemProps) => {
  const getTypeClass = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SELL':
        return 'bg-orange-100 text-orange-700';
      case 'BUY':
        return 'bg-green-100 text-green-700';
      case 'INTRADAY':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_80px_80px_80px] gap-2 items-center p-2 bg-white rounded-md mb-2 border border-gray-200">
      <div className="font-bold text-gray-800 text-sm">{trade.symbol}</div>
      <div className="flex justify-end items-center gap-2">
        {showDate && trade.dateMilli && (
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap hidden md:inline">
            {formatDate(trade.dateMilli)}
          </span>
        )}
        <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeClass(trade.type)}`}>
          {trade.type}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-gray-500 uppercase">Value</span>
        <span className="font-semibold text-sm">{formatCurrency(trade.value, useFullFormat)}</span>
      </div>
      <div className="flex flex-col items-end">
        {!(trade.type.toUpperCase() === 'BUY' && trade.tradePNL === 0) && (
          <>
            <span className="text-[10px] text-gray-500 uppercase">P&L</span>
            <span className={`font-semibold text-sm ${getPnLClass(trade.tradePNL)}`}>
              {formatCurrency(trade.tradePNL, useFullFormat)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
