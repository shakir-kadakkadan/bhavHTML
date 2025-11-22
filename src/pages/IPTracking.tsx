import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../utils/firebase';
import { ref, get } from 'firebase/database';

interface IPData {
  id: string;
  timestamp: number;
  query: string;
  city: string;
  regionName: string;
  country: string;
  isp: string;
  currentPath: string;
  currentURL: string;
  referrer: string;
  source: string | null;
  campaign: string | null;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

export const IPTracking = () => {
  const [data, setData] = useState<IPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const ipRef = ref(database, '/ip_details');
      const snapshot = await get(ipRef);
      const rawData = snapshot.val();

      if (!rawData) {
        setData([]);
        setLoading(false);
        return;
      }

      const dataArray: IPData[] = Object.entries(rawData)
        .map(([key, value]) => ({
          id: key,
          ...(value as Omit<IPData, 'id'>)
        }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setData(dataArray);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatReferrer = (referrer: string) => {
    if (!referrer || referrer === 'direct') {
      return <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">DIRECT</span>;
    }
    try {
      const url = new URL(referrer);
      return `${url.hostname}${url.pathname}`;
    } catch {
      return referrer;
    }
  };

  const getBrowser = (userAgent: string) => {
    if (!userAgent) return '?';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const getUniqueCount = (field: keyof IPData) => {
    const values = data.map(item => item[field]).filter(v => v);
    return new Set(values).size;
  };

  const totalVisits = data.length;
  const uniqueIPs = getUniqueCount('query');
  const uniqueCountries = getUniqueCount('country');
  const directVisits = data.filter(item => !item.referrer || item.referrer === 'direct').length;
  const trackedSourceVisits = data.filter(item => item.source).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-3 md:p-5">
      <div className="mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-6 md:p-8 text-center relative">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">IP Tracking Data</h1>
          <p className="text-base md:text-lg opacity-90">Visitor analytics from all pages</p>
          <button
            onClick={loadData}
            className="absolute top-6 right-6 px-4 py-2 bg-white/20 text-white border-2 border-white rounded font-semibold hover:bg-white hover:text-[#667eea] transition-all"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-10">
          {/* Stats */}
          {!loading && data.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold">{totalVisits}</h3>
                <p className="text-sm opacity-90">Total Visits</p>
              </div>
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold">{uniqueIPs}</h3>
                <p className="text-sm opacity-90">Unique IPs</p>
              </div>
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold">{uniqueCountries}</h3>
                <p className="text-sm opacity-90">Countries</p>
              </div>
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold">{trackedSourceVisits}</h3>
                <p className="text-sm opacity-90">Tracked Sources</p>
              </div>
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold">{directVisits}</h3>
                <p className="text-sm opacity-90">Direct/Unknown</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-lg text-[#667eea]">
              Loading data...
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
              Error loading data: {error}
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <h3 className="text-xl font-semibold mb-2">No tracking data yet</h3>
              <p>Data will appear here when visitors load tracked pages</p>
            </div>
          )}

          {/* Table */}
          {!loading && data.length > 0 && (
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white sticky top-0">
                  <tr>
                    <th className="p-3 text-left font-semibold">#</th>
                    <th className="p-3 text-left font-semibold whitespace-nowrap">Timestamp</th>
                    <th className="p-3 text-left font-semibold whitespace-nowrap">IP Address</th>
                    <th className="p-3 text-left font-semibold">Location</th>
                    <th className="p-3 text-left font-semibold">ISP</th>
                    <th className="p-3 text-left font-semibold">Page</th>
                    <th className="p-3 text-left font-semibold">Source</th>
                    <th className="p-3 text-left font-semibold">Referrer</th>
                    <th className="p-3 text-left font-semibold">Device</th>
                    <th className="p-3 text-left font-semibold">Browser</th>
                    <th className="p-3 text-left font-semibold">Screen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 even:bg-gray-50/50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 whitespace-nowrap text-xs text-gray-600">
                        {formatTimestamp(item.timestamp)}
                      </td>
                      <td className="p-3 font-mono font-semibold text-blue-600">
                        {item.query || 'N/A'}
                      </td>
                      <td className="p-3 text-green-700">
                        {`${item.city || '?'}, ${item.regionName || '?'}, ${item.country || '?'}`}
                      </td>
                      <td className="p-3">{item.isp || 'N/A'}</td>
                      <td className="p-3 max-w-[200px] truncate" title={item.currentURL}>
                        {item.currentPath || 'N/A'}
                      </td>
                      <td className="p-3 text-orange-600 text-xs">
                        {item.source ? (
                          <>
                            <strong>{item.source}</strong>
                            {item.campaign && <><br /><small>{item.campaign}</small></>}
                          </>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-orange-600 text-xs" title={item.referrer || 'direct'}>
                        {formatReferrer(item.referrer)}
                      </td>
                      <td className="p-3">{`${item.screenWidth}x${item.screenHeight}`}</td>
                      <td className="p-3">{getBrowser(item.userAgent)}</td>
                      <td className="p-3">{`${item.viewportWidth}x${item.viewportHeight}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
