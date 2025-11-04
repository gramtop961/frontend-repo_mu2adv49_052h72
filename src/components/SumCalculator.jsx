import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";

const API_BASE = "https://api.exchangerate.host";

export default function SumCalculator() {
  const [symbols, setSymbols] = useState({});
  const [base, setBase] = useState("USD");
  const [rates, setRates] = useState({});
  const [rows, setRows] = useState([
    { id: 1, amount: 0, currency: "USD" },
  ]);

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

  useEffect(() => {
    const load = async () => {
      const r = await fetch(`${API_BASE}/latest?base=${encodeURIComponent(base)}`);
      const data = await r.json();
      setRates(data.rates || {});
    };
    load();
  }, [base]);

  const addRow = () => {
    setRows((old) => [
      ...old,
      { id: Math.random(), amount: 0, currency: base },
    ]);
  };

  const removeRow = (id) => setRows((old) => old.filter((r) => r.id !== id));

  const total = useMemo(() => {
    return rows.reduce((sum, r) => {
      const amt = Number(r.amount || 0);
      if (!Number.isFinite(amt)) return sum;
      if (r.currency === base) return sum + amt;
      // Convert from row currency to base using cross via EUR (or directly using inverse of base rates)
      // Since we have base rates (1 base -> X target), we need inverse rate to get 1 target -> base
      const rate = rates[r.currency];
      if (!rate || rate === 0) return sum;
      const inBase = amt / rate; // because rate = target per 1 base, so 1 target = 1/rate base
      return sum + inBase;
    }, 0);
  }, [rows, rates, base]);

  return (
    <section className="w-full bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-amber-500 text-white">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Sum Across Currencies</h2>
          <p className="text-xs text-gray-500">Add amounts in different currencies and see the total in a base</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">Total in</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c} — {symbols[c]?.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6 sm:col-span-5">
              <input
                type="number"
                value={row.amount}
                onChange={(e) =>
                  setRows((old) => old.map((r) => (r.id === row.id ? { ...r, amount: e.target.value } : r)))
                }
                placeholder="Amount"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="col-span-5 sm:col-span-5">
              <select
                value={row.currency}
                onChange={(e) =>
                  setRows((old) => old.map((r) => (r.id === row.id ? { ...r, currency: e.target.value } : r)))
                }
                className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c} — {symbols[c]?.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => removeRow(row.id)}
                className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"
                aria-label="Remove row"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-5 w-5" /> Add another amount
        </button>
      </div>

      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-100 p-4">
        <p className="text-sm text-amber-900">Total</p>
        <p className="text-2xl sm:text-3xl font-semibold text-amber-700 tabular-nums">
          {total.toFixed(4)} {base}
        </p>
      </div>
    </section>
  );
}
