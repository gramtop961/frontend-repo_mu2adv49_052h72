import { useEffect, useMemo, useState } from "react";
import { Search, TrendingUp, RefreshCw } from "lucide-react";

const API_BASE = "https://api.exchangerate.host";

export default function RateTable() {
  const [symbols, setSymbols] = useState({});
  const [base, setBase] = useState("USD");
  const [rates, setRates] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const currencyOptions = useMemo(
    () => Object.keys(symbols).sort((a, b) => a.localeCompare(b)),
    [symbols]
  );

  useEffect(() => {
    const fetchSymbols = async () => {
      const r = await fetch(`${API_BASE}/symbols`);
      const data = await r.json();
      setSymbols(data.symbols || {});
    };
    fetchSymbols();
  }, []);

  const loadRates = async (nextBase = base) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/latest?base=${encodeURIComponent(nextBase)}`);
      const data = await r.json();
      setRates(data.rates || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates(base);
  }, [base]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(rates)
      .filter(([code]) => {
        const name = symbols[code]?.description?.toLowerCase?.() || "";
        return code.toLowerCase().includes(q) || name.includes(q);
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [rates, query, symbols]);

  return (
    <section className="w-full bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">All Exchange Rates</h2>
            <p className="text-xs text-gray-500">Base currency refers to 1 unit in the selected base</p>
          </div>
        </div>
        <button
          onClick={() => loadRates(base)}
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">Base currency</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c} — {symbols[c]?.description}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by code or name..."
              className="w-full rounded-lg border pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">Currency</th>
              <th className="text-right px-4 py-2">Rate (1 {base})</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(([code, rate]) => (
              <tr key={code} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{code}</div>
                  <div className="text-xs text-gray-500">{symbols[code]?.description}</div>
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{rate.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
