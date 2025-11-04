function SummaryBar({
  baseCurrency,
  amount,
  direction,
  selected,
  rates,
  updatedAt,
}) {
  const selectedList = Array.from(selected)
  const sumRates = selectedList.reduce((acc, code) => acc + (rates[code] || 0), 0)
  const sumConverted = selectedList.reduce((acc, code) => {
    const rate = rates[code] || 0
    if (direction === 'AtoB') return acc + amount * rate
    if (rate === 0) return acc
    return acc + amount / rate
  }, 0)

  return (
    <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Selection summary</h4>
        <p className="text-sm text-gray-600">
          Picked {selectedList.length} currencies. Sum of rates: <span className="font-mono font-semibold">{sumRates.toFixed(6)}</span>
        </p>
      </div>
      <div className="text-sm text-gray-600">
        Total converted for amount {amount} ({direction === 'AtoB' ? baseCurrency : 'various'}) → {direction === 'AtoB' ? 'selected' : baseCurrency}: 
        <span className="ml-2 font-mono font-semibold">{sumConverted.toFixed(4)}</span>
      </div>
      <div className="text-xs text-gray-500">
        Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
      </div>
    </section>
  )
}

export default SummaryBar
