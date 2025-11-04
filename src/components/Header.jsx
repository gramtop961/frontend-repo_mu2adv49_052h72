import { Globe, Calculator } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Global FX Studio</h1>
            <p className="text-xs text-gray-500">Check rates, convert, and sum across currencies</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-indigo-700">
          <Calculator className="h-5 w-5" />
          <span className="text-sm font-medium">Live from exchangerate.host</span>
        </div>
      </div>
    </header>
  );
}
