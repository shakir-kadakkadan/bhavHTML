import { formatCurrency, getPnLClass } from '../utils/format';

interface SummaryItemProps {
  label: string;
  value: number;
  useFullFormat: boolean;
  isExpense?: boolean;
}

export const SummaryItem = ({ label, value, useFullFormat, isExpense }: SummaryItemProps) => {
  const valueClass = isExpense ? 'text-red-500 font-bold' : getPnLClass(value);

  return (
    <div className="flex flex-col items-end min-w-[80px]">
      <span className="opacity-80 text-xs md:text-sm">{label}</span>
      <span className={`font-bold text-lg md:text-xl ${valueClass}`}>
        {formatCurrency(value, useFullFormat)}
      </span>
    </div>
  );
};
