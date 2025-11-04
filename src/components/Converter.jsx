import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

const API_BASE = "https://api.exchangerate.host";

export default function Converter() {
  const [symbols, setSymbols] = useState({});
  const [base, setBase] = useState("USD");
  const [rates, setRates] = useState({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currencyOptions = useMemo(
    () => Object.keys(symbols).sort((a, b) => a.localeCompare(b)),
    [symbols]
  );

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const r = await fetch(`${API_BASE}/symbols`);
        const data = await r.json();
        setSymbols(data.symbols || {});
      } catch (e) {
        console.error(e);
      }
    };
    fetchSymbols();
  }, []);

  const loadRates = async (nextBase = base) => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/latest?base=${encodeURIComponent(nextBase)}`);
      const data = await r.json();
      if (!data || !data.rates) throw new Error("Failed to load rates");
      setRates(data.rates);
    } catch (e) {
      setError("Could not fetch exchange rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates(base);
  }, [base]);

  const converted = useMemo(() => {
    if (!rates || !rates[to]) return 0;
    return (Number(amount || 0) * rates[to]).toFixed(4);
  }, [amount, rates, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setBase(to);
  };

  return (
    <section className="w-full bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quick Converter</h2>
        <button
          onClick={() => loadRates(base)}
          className="inline-flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh rates
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">Base currency</label>
          <select
            value={base}
            onChange={(e) => {
              setBase(e.target.value);
              setFrom(e.target.value);
            }}
            className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c} — {symbols[c]?.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c} — {symbols[c]?.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">To</label>
          <div className="flex gap-2">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencyOptions.map((c) => (
                <option key={c} value={c}>
                  {c} — {symbols[c]?.description}
                </option>
              ))}
            </select>
            <button
              onClick={swap}
              className="shrink-0 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
              title="Swap"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-5 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
        <p className="text-sm text-indigo-900">
          {Number(amount || 0).toLocaleString()} {from} equals
        </p>
        <p className="text-2xl sm:text-3xl font-semibold text-indigo-700">
          {converted} {to}
        </p>
        <p className="text-xs text-indigo-700/70 mt-1">
          Conversion uses live {base} base rates. For other pairs, we compute via base.
        </p>
      </div>
    </section>
  );
}
