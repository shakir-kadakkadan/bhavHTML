import type { DeltaExchangePnlSummary } from '../types';
import { formatCurrency, getPnLClass } from '../utils/format';
import { CollapsibleSection } from './CollapsibleSection';

interface DeltaSummaryProps {
  delta: DeltaExchangePnlSummary;
  useFullFormat: boolean;
}

export const DeltaSummary = ({ delta, useFullFormat }: DeltaSummaryProps) => {
  return (
    <CollapsibleSection
      title={`Delta Exchange PNL Summary (${delta.yearsCount} years)`}
      totalLabel="Total NTPL"
      totalValue={delta.totalNetPnL}
      useFullFormat={useFullFormat}
    >
      {delta.yearlyData && delta.yearlyData.length > 0 && (
        <table className="w-full border-collapse text-xs md:text-sm">
          <thead className="bg-[#667eea] text-white">
            <tr>
              <th className="p-3 text-left font-semibold">Fiscal Year</th>
              <th className="p-3 text-right font-semibold">TPL</th>
              <th className="p-3 text-right font-semibold">NTPL</th>
            </tr>
          </thead>
          <tbody>
            {delta.yearlyData.map((year, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                <td className="p-3 font-semibold text-[#667eea]">{year.fiscalYear}</td>
                <td className={`p-3 text-right ${getPnLClass(year.tradePnL)}`}>
                  {formatCurrency(year.tradePnL, useFullFormat)}
                </td>
                <td className={`p-3 text-right ${getPnLClass(year.netPnL)}`}>
                  {formatCurrency(year.netPnL, useFullFormat)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CollapsibleSection>
  );
};
