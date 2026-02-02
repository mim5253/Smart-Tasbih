
import React, { useState, useEffect } from 'react';
import { AppMode, RakatState } from './types';
import { 
  RotateCcw, 
  CheckCircle2,
  Layers,
  Moon,
  Sun,
  CircleDot
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TASBIH);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    const saved = localStorage.getItem('tasbihCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [rakatState, setRakatState] = useState<RakatState>(() => {
    const saved = localStorage.getItem('rakatState');
    return saved ? JSON.parse(saved) : { count: 0 };
  });

  // Toggle Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tasbihCount', tasbihCount.toString());
  }, [tasbihCount]);

  useEffect(() => {
    localStorage.setItem('rakatState', JSON.stringify(rakatState));
  }, [rakatState]);

  const handleTasbihPress = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(40);
    setTasbihCount(prev => prev + 1);
  };

  const handleRakatPress = () => {
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    setRakatState(prev => ({ ...prev, count: prev.count + 2 }));
  };

  const resetCounters = () => {
    if (mode === AppMode.TASBIH) setTasbihCount(0);
    else setRakatState({ count: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 md:p-10 max-w-md mx-auto relative z-10 font-sans">
      
      {/* Top Bar: Logo & Theme Toggle */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="glass bg-white/30 dark:bg-black/20 border border-white/40 dark:border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
          <CircleDot className="w-4 h-4 text-apple-blue" />
          <span className="text-sm font-bold opacity-90 tracking-tight">المسبحة الذكية</span>
        </div>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="glass bg-white/40 dark:bg-white/10 p-3 rounded-2xl border border-white/50 dark:border-white/10 active:scale-90 transition-all shadow-sm group"
          aria-label="Toggle Theme"
        >
          {isDark ? 
            <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" /> : 
            <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform" />
          }
        </button>
      </div>

      {/* Glass Switcher */}
      <div className="w-full glass bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 p-1.5 rounded-[24px] flex gap-1 mb-12 shadow-inner">
        <button 
          onClick={() => setMode(AppMode.TASBIH)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-sm font-bold transition-all duration-500 ${
            mode === AppMode.TASBIH 
            ? 'glass bg-white/80 dark:bg-white/20 text-slate-900 dark:text-white shadow-md' 
            : 'text-slate-500 dark:text-slate-400 opacity-70 hover:opacity-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          التسبيح
        </button>
        <button 
          onClick={() => setMode(AppMode.RAKAT)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-sm font-bold transition-all duration-500 ${
            mode === AppMode.RAKAT 
            ? 'glass bg-white/80 dark:bg-white/20 text-slate-900 dark:text-white shadow-md' 
            : 'text-slate-500 dark:text-slate-400 opacity-70 hover:opacity-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          الصلاة
        </button>
      </div>

      {/* Main Counter Area */}
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        
        {/* Modern Counter Display */}
        <div className="text-center mb-16 select-none animate-in fade-in duration-700">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
            {mode === AppMode.TASBIH ? 'إجمالي التسبيحات' : 'إجمالي الركعات'}
          </p>
          <div className="text-[110px] leading-none font-bold tracking-tighter text-slate-800 dark:text-white transition-all tabular-nums">
            {(mode === AppMode.TASBIH ? tasbihCount : rakatState.count).toLocaleString('en-US')}
          </div>
        </div>

        {/* Interaction Button - Polished Glass Fab */}
        <div className="relative group">
          {/* Internal reflection ring */}
          <div className="absolute inset-0 rounded-[60px] border border-white/20 dark:border-white/5 pointer-events-none z-20"></div>
          
          <button
            onClick={mode === AppMode.TASBIH ? handleTasbihPress : handleRakatPress}
            className="relative w-64 h-64 md:w-72 md:h-72 rounded-[60px] glass bg-white/10 dark:bg-white/5 border border-white/50 dark:border-white/10 text-slate-800 dark:text-white active:bg-white/95 dark:active:bg-white/95 active:text-slate-900 dark:active:text-slate-900 active:scale-[0.94] transition-all duration-100 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* Glass Shine Effect (Glossy Polish) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 dark:via-white/5 dark:to-white/20 pointer-events-none opacity-100 group-hover:opacity-80 transition-opacity"></div>
            
            {/* Dynamic Sweep Shine Animation */}
            <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] animate-[shine_4s_infinite] group-active:animate-none pointer-events-none"></div>

            {/* Inset shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] pointer-events-none rounded-[60px]"></div>
            
            <span className="text-4xl font-bold tracking-tight select-none z-10 transition-transform group-active:scale-90">
              اضغط
            </span>
          </button>
        </div>

        {/* Reset Button - Apple Minimalist */}
        <button 
          onClick={resetCounters}
          className="mt-16 glass bg-white/40 dark:bg-white/5 px-10 py-4 rounded-full border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 active:scale-90 transition-all font-bold text-sm shadow-sm flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>تصفير العداد</span>
        </button>
      </main>

      <footer className="mt-8 text-[10px] text-slate-400 dark:text-slate-600 font-bold tracking-[0.3em] uppercase opacity-40">
        M i M
      </footer>

      {/* Tailwind Custom Keyframes Injection via Style Tag if not in index.html */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-30deg); }
          20% { transform: translateX(250%) skewX(-30deg); }
          100% { transform: translateX(250%) skewX(-30deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
