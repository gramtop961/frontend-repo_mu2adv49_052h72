import Header from "./components/Header";
import Converter from "./components/Converter";
import RateTable from "./components/RateTable";
import SumCalculator from "./components/SumCalculator";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Converter />
          <SumCalculator />
        </div>
        <RateTable />
      </main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        Built for quick currency insights • Rates by exchangerate.host
      </footer>
    </div>
  );
}
