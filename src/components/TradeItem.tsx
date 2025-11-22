import type { Trade } from '../types';
import { formatCurrency, getPnLClass } from '../utils/format';

interface TradeItemProps {
  trade: Trade;
  useFullFormat: boolean;
}

export const TradeItem = ({ trade, useFullFormat }: TradeItemProps) => {
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Expired':
        return 'bg-pink-100 text-pink-700';
      case 'Sell':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 bg-white rounded-md mb-2 border border-gray-200 gap-2">
      <div className="font-bold text-gray-800 text-sm">{trade.symbol}</div>
      <div className="flex gap-3 items-center flex-wrap w-full md:w-auto justify-between md:justify-end">
        <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeClass(trade.type)}`}>
          {trade.type}
        </span>
        <div className="flex flex-col items-end md:items-end">
          <span className="text-[10px] text-gray-500 uppercase">Qty</span>
          <span className="font-semibold text-sm">{trade.qty}</span>
        </div>
        <div className="flex flex-col items-end md:items-end">
          <span className="text-[10px] text-gray-500 uppercase">Buy</span>
          <span className="font-semibold text-sm">{formatCurrency(trade.buyValue, useFullFormat)}</span>
        </div>
        <div className="flex flex-col items-end md:items-end">
          <span className="text-[10px] text-gray-500 uppercase">Sell</span>
          <span className="font-semibold text-sm">{formatCurrency(trade.sellValue, useFullFormat)}</span>
        </div>
        <div className="flex flex-col items-end md:items-end">
          <span className="text-[10px] text-gray-500 uppercase">P&L</span>
          <span className={`font-semibold text-sm ${getPnLClass(trade.tradePnL)}`}>
            {formatCurrency(trade.tradePnL, useFullFormat)}
          </span>
        </div>
      </div>
    </div>
  );
};
