import { useMemo, useState } from 'react'

function RatesTable({
  baseCurrency,
  amount,
  direction,
  rates,
  symbols,
  selected,
  setSelected,
}) {
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const entries = Object.entries(rates || {})
    const filtered = entries.filter(([code]) =>
      code.toLowerCase().includes(query.toLowerCase()) ||
      (symbols[code]?.description || '').toLowerCase().includes(query.toLowerCase())
    )
    return filtered.sort((a, b) => a[0].localeCompare(b[0]))
  }, [rates, query, symbols])

  const toggle = (code) => {
    const next = new Set(selected)
    if (next.has(code)) next.delete(code)
    else next.add(code)
    setSelected(next)
  }

  const selectAllVisible = () => {
    const next = new Set(selected)
    list.forEach(([code]) => next.add(code))
    setSelected(next)
  }

  const clearSelection = () => setSelected(new Set())

  const converted = (rate) => {
    if (direction === 'AtoB') return amount * rate
    if (rate === 0) return 0
    return amount / rate
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Rates relative to {baseCurrency}
          </h3>
          <p className="text-xs text-gray-500">Search and select currencies to add them up</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code or name"
            className="border rounded-lg px-3 py-2 w-56"
          />
          <button onClick={selectAllVisible} className="border rounded-lg px-3 py-2 hover:bg-gray-50">
            Select visible
          </button>
          <button onClick={clearSelection} className="border rounded-lg px-3 py-2 hover:bg-gray-50">
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-3 w-10">Pick</th>
                <th className="text-left p-3">Currency</th>
                <th className="text-right p-3">Rate</th>
                <th className="text-right p-3">Converted</th>
              </tr>
            </thead>
            <tbody>
              {list.map(([code, rate]) => (
                <tr key={code} className="border-t hover:bg-gray-50/70">
                  <td className="p-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.has(code)}
                      onChange={() => toggle(code)}
                    />
                  </td>
                  <td className="p-3 align-middle">
                    <div className="font-medium text-gray-900">{code}</div>
                    <div className="text-xs text-gray-500">{symbols[code]?.description || '\u00A0'}</div>
                  </td>
                  <td className="p-3 text-right font-mono">{rate.toFixed(6)}</td>
                  <td className="p-3 text-right font-mono">{converted(rate).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default RatesTable
