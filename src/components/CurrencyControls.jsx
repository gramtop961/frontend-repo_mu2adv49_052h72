import { useMemo } from 'react'
import { ArrowsLeftRight, SwitchHorizontal } from 'lucide-react'

function CurrencyControls({
  symbols,
  baseCurrency,
  setBaseCurrency,
  quoteCurrency,
  setQuoteCurrency,
  amount,
  setAmount,
  direction,
  setDirection,
}) {
  const currencyOptions = useMemo(() => {
    return Object.entries(symbols)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([code, { description }]) => ({ code, description }))
  }, [symbols])

  const swap = () => {
    setBaseCurrency(quoteCurrency)
    setQuoteCurrency(baseCurrency)
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From currency</label>
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} — {opt.description}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-center gap-2">
          <button
            onClick={swap}
            className="inline-flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
            title="Swap currencies"
          >
            <ArrowsLeftRight size={16} />
            Swap
          </button>
          <button
            onClick={() => setDirection(direction === 'AtoB' ? 'BtoA' : 'AtoB')}
            className="inline-flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
            title="Change direction"
          >
            <SwitchHorizontal size={16} />
            {direction === 'AtoB' ? 'A → B' : 'B → A'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To currency</label>
          <select
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} — {opt.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Amount ({direction === 'AtoB' ? baseCurrency : quoteCurrency})
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>
    </section>
  )
}

export default CurrencyControls
