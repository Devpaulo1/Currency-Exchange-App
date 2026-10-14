import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoricalChart } from './components/HistoricalChart';
import { HistoricalTable } from './components/HistoricalTable';
import { Sun, Moon, Wifi, WifiOff, Shield, ShieldAlert, Loader2, Sparkles, Zap } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const {
    historicalData,
    historicalLoading,
    period,
    setPeriod,
    baseCurrency,
    targetCurrency,
    apiStatus,
    loading,
    error,
    ...currency
  } = useCurrency();

  const getApiStatusConfig = () => {
    switch (apiStatus) {
      case 'success':
        return { icon: Wifi, color: isDark ? 'text-emerald-400' : 'text-emerald-700', label: 'Conectado', bg: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
      case 'error':
        return { icon: WifiOff, color: isDark ? 'text-red-400' : 'text-red-600', label: 'Erro API', bg: isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 text-red-700 border border-red-200' };
      case 'loading':
        return { icon: Loader2, color: isDark ? 'text-emerald-400 animate-spin' : 'text-emerald-700 animate-spin', label: 'Conectando...', bg: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
      default:
        return { icon: Shield, color: isDark ? 'text-slate-500' : 'text-slate-500', label: 'Aguardando', bg: isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 text-slate-600 border border-slate-200' };
    }
  };

  const ApiStatus = () => {
    const config = getApiStatusConfig();
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.color} transition-all`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#060913]' : 'bg-slate-50'}`}>
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={isDark ? 'absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]' : 'hidden'} />
        <div className={isDark ? 'absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2' : 'hidden'} />
        <div className={isDark ? 'absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl translate-y-1/2' : 'hidden'} />
      </div>

      {/* Header */}
      <header className={`relative sticky top-0 z-40 backdrop-blur-md ${isDark ? 'border-b border-slate-800/50 bg-slate-900/50' : 'border-b border-slate-200/80 bg-white/80'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Zap className="w-6 h-6 text-slate-950" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-20 blur" />
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Currency Exchange</h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Taxas em tempo real via Frankfurter API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApiStatus />
              <button
                onClick={toggleTheme}
                className={`relative p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-100 hover:border-emerald-500/50 hover:bg-emerald-500/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                aria-label={theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5" />
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-10 rounded-xl" />
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 rounded-xl" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-6 pb-12">
        <CurrencyConverter {...currency} />
        <HistoricalChart
          historicalData={historicalData}
          historicalLoading={historicalLoading}
          period={period}
          setPeriod={setPeriod}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
        />
        <HistoricalTable
          historicalData={historicalData}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
        />
        
        <footer className={`relative z-10 text-center text-xs py-4 border-t ${isDark ? 'text-slate-500 border-slate-800/50' : 'text-slate-500 border-slate-200/80'}`}>
          <p>Dados fornecidos por <a href="https://api.frankfurter.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">Frankfurter API</a></p>
          <p className="mt-1">Desenvolvido com React + Tailwind v4 + Recharts</p>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;