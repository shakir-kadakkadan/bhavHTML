export interface Trade {
  symbol: string;
  type: 'Intraday' | 'Sell' | 'Expired';
  qty: number;
  buyValue: number;
  sellValue: number;
  tradePnL: number;
}

export interface DateEntry {
  date: string;
  netBill: number;
  expense: number;
  grossBill: number;
  tradePnL: number;
  netPnL: number;
  trades: Trade[];
}

export interface FiscalYearTotals {
  netBill: number;
  totalExpenses: number;
  grossBill: number;
  tradePnL: number;
  netPnL: number;
}

export interface FiscalYear {
  fiscalYear: string;
  totals: FiscalYearTotals;
  dates: DateEntry[];
}

export interface MatchedPosition {
  symbol: string;
  qty: number;
  buyDate: string;
  buyValue: number;
  sellDate: string;
  sellValue: number;
  tradePnL: number;
}

export interface AllMatchedPositions {
  count: number;
  totalTradePnL: number;
  positions: MatchedPosition[];
}

export interface YearlyData {
  fiscalYear: string;
  tradePnL: number;
  netPnL: number;
}

export interface GrowwPnlSummary {
  yearsCount: number;
  totalNetPnL: number;
  yearlyData: YearlyData[];
}

export interface DeltaExchangePnlSummary {
  yearsCount: number;
  totalNetPnL: number;
  yearlyData: YearlyData[];
}

export interface Summary {
  netBill: number;
  totalExpenses: number;
  grossBill: number;
  tradePnL: number;
  netPnL: number;
}

export interface PnLData {
  summary: Summary;
  fiscalYears: FiscalYear[];
  allMatchedPositions: AllMatchedPositions;
  growwPnlSummary: GrowwPnlSummary;
  deltaExchangePnlSummary: DeltaExchangePnlSummary;
}
