import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from 'recharts';
import { trackIPData } from '../utils/firebase';

interface PnLGraphData {
  dateMilli: number;
  ntpl: number;
  ntplTillDate: number;
  tpl: number;
}

const GRAPH_API_URL = 'https://bhavpc-default-rtdb.asia-southeast1.firebasedatabase.app/pnlGraph.json';

export const PnLGraph = () => {
  const [graphData, setGraphData] = useState<PnLGraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GRAPH_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PnLGraphData[] = await response.json();
        setGraphData(data);

        // Calculate min and max of ntplTillDate with offset
        if (data.length > 0) {
          const values = data.map((d) => d.ntplTillDate);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min;
          const offset = range * 0.1; // 10% offset

          setYAxisDomain([min - offset, max + offset]);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
    trackIPData('pnl_graph_page_load');
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-gray-900 dark:to-gray-800 p-5 md:p-5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] dark:from-gray-800 dark:to-gray-700 text-white p-6 md:p-8 text-center relative transition-colors duration-300">
          <a
            href="/pl"
            className="absolute top-4 left-4 md:top-8 md:left-8 text-white hover:text-gray-200 transition-colors"
            aria-label="Back to P&L Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 md:h-10 md:w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">P&L Growth Chart</h1>
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
        <div className="p-3 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {loading && (
            <div className="text-center py-12 text-lg text-[#667eea] dark:text-blue-400">
              Loading chart data...
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-lg text-red-500 dark:text-red-400">
              Error loading data: {error}
            </div>
          )}

          {!loading && !error && graphData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
              <ResponsiveContainer width="100%" height={500}>
                <LineChart
                  data={graphData}
                  margin={{
                    top: 5,
                    right: 80,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis
                    dataKey="dateMilli"
                    tickFormatter={formatDate}
                    stroke="#888"
                    className="dark:stroke-gray-400"
                  />
                  <YAxis
                    domain={yAxisDomain}
                    tickFormatter={(value) => formatCurrency(value)}
                    stroke="#888"
                    className="dark:stroke-gray-400"
                    width={100}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as PnLGraphData;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {formatDate(data.dateMilli)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">P&L Till Date:</span>{' '}
                              <span className={data.ntplTillDate >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(data.ntplTillDate)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Daily P&L:</span>{' '}
                              <span className={data.ntpl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(data.ntpl)}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <ReferenceLine
                    y={0}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: 'Break Even', position: 'right', fill: '#ef4444', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ntplTillDate"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                    name="Cumulative P&L"
                  />
                  <Brush
                    dataKey="dateMilli"
                    height={30}
                    stroke="#667eea"
                    tickFormatter={formatDate}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Drag the brush at the bottom to zoom into specific time periods</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
