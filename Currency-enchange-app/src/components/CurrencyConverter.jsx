import { useEffect, useRef, useMemo, useContext } from 'react';
import { ArrowLeftRight, Loader2, ChevronDown } from 'lucide-react';
import { getFlagUrl, hasFlag } from '../utils/currencyFlags';
import { ThemeContext } from '../context/ThemeContext';

export function CurrencyConverter({
  amount,
  setAmount,
  baseCurrency,
  setBaseCurrency,
  targetCurrency,
  setTargetCurrency,
  currencies,
  exchangeRate,
  date,
  loading,
  error,
  swapCurrencies,
  convertedAmount,
}) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const amountRef = useRef(null);
  const swapRef = useRef(null);

  useEffect(() => {
    amountRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSwap = () => {
    swapRef.current?.classList.add('rotate-180');
    setTimeout(() => {
      swapRef.current?.classList.remove('rotate-180');
    }, 300);
    swapCurrencies();
  };

  const formatRate = (rateValue) => {
    if (!rateValue) return '—';
    return rateValue.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  };

  const formatAmount = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const baseFlagUrl = hasFlag(baseCurrency) ? getFlagUrl(baseCurrency) : null;
  const targetFlagUrl = hasFlag(targetCurrency) ? getFlagUrl(targetCurrency) : null;

  const CurrencyOption = ({ code, name, isSelected }) => {
    const flagUrl = hasFlag(code) ? getFlagUrl(code) : null;
    return (
      <option key={code} value={code} selected={isSelected} className="flex items-center gap-2 px-2 py-1">
        {flagUrl && <img src={flagUrl} alt={code} className="w-6 h-4 rounded" loading="lazy" />}
        <span>{code} — {name}</span>
      </option>
    );
  };

  const CurrencySelect = ({ currency, onChange, label, id, flagUrl }) => (
    <div className="relative group">
      <label htmlFor={id} className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={currency}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none px-4 py-3.5 pr-14 text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'} 
            ${isDark ? 'bg-slate-900/70 backdrop-blur-md border border-slate-700/50' : 'bg-white/80 backdrop-blur-md border border-slate-200/80'} 
            rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
            transition-all cursor-pointer ${isDark ? 'hover:border-slate-600' : 'hover:border-slate-300'}`}
        >
          {Object.entries(currencies).map(([code, name]) => (
            <CurrencyOption key={code} code={code} name={name} isSelected={code === currency} />
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`${currency} flag`}
              className={`w-6 h-4 rounded-full shadow-md ${isDark ? 'ring-1 ring-slate-700/50' : 'ring-1 ring-slate-200/80'}`}
              loading="lazy"
            />
          )}
          <ChevronDown className={`w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-500'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main Result Card - Floating Glassmorphic */}
      <section aria-labelledby="result-title" className="relative">
        <h2 id="result-title" className="sr-only">Resultado da Conversão</h2>
        
        <div className={`relative ${isDark ? 'bg-slate-900/70 backdrop-blur-md border border-emerald-500/30 shadow-2xl shadow-emerald-500/10' : 'bg-white/90 backdrop-blur-md border border-emerald-500/30 shadow-2xl shadow-emerald-500/10'} rounded-2xl p-6 overflow-hidden`}>
          {/* Background glow */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10' : 'bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/15'}`} />
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            {convertedAmount && exchangeRate ? (
              <div className="text-center space-y-2">
                <p className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Valor Convertido
                </p>
                <div className="space-y-1">
                  <p className="text-5xl sm:text-7xl font-bold tabular-nums bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                    {formatAmount(convertedAmount)}
                  </p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {targetCurrency}
                  </p>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {formatAmount(amount)} {baseCurrency} × {formatRate(exchangeRate)}
                </p>
              </div>
            ) : !exchangeRate && !loading && !error ? (
              <div className="text-center py-4">
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Selecione as moedas para ver a conversão</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Atualizando...</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Input & Currency Selectors */}
      <section aria-labelledby="converter-title" className={`rounded-2xl p-6 shadow-xl ${isDark ? 'bg-slate-900/50 backdrop-blur-md border border-slate-700/50' : 'bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-slate-200/50'}`}>
        <h2 id="converter-title" className="sr-only">Conversor de Moedas</h2>
        
        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Valor a Converter
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {baseCurrency}
              </span>
              <input
                ref={amountRef}
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 text-3xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} 
                  ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border border-slate-700/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/80'} 
                  rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
                  transition-all ${isDark ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
                placeholder="0,00"
                aria-label="Valor a converter"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Currency Selectors with Swap */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <CurrencySelect
              currency={baseCurrency}
              onChange={setBaseCurrency}
              label="De"
              id="baseCurrency"
              flagUrl={baseFlagUrl}
            />

            <button
              ref={swapRef}
              type="button"
              onClick={handleSwap}
              disabled={loading}
              className={`flex-shrink-0 mx-auto relative p-3 rounded-full 
                ${isDark ? 'bg-slate-900/70 backdrop-blur-md border border-emerald-500/30 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'bg-white/80 backdrop-blur-md border border-emerald-500/30 text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 shadow-lg shadow-emerald-500/10'}
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              aria-label="Inverter moedas"
            >
              <ArrowLeftRight className="w-5 h-5 transition-transform duration-300" />
              {/* Metallic ring effect */}
              <span className={`absolute inset-0 border rounded-full opacity-50 ${isDark ? 'border-emerald-500/20' : 'border-emerald-500/30'}`} />
            </button>

            <CurrencySelect
              currency={targetCurrency}
              onChange={setTargetCurrency}
              label="Para"
              id="targetCurrency"
              flagUrl={targetFlagUrl}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {error}
          </div>
        )}

        {/* Rate Display */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Taxa Atual</span>
              <div className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-700/50' : 'bg-slate-100/80 backdrop-blur-sm border border-slate-200/80'}`}>
                <span className={`font-mono text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  1 {baseCurrency} = {formatRate(exchangeRate)} {targetCurrency}
                </span>
              </div>
            </div>
            {date && (
              <time dateTime={date} className={`text-xs font-mono whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}