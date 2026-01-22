
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
  { price: 4200 }, { price: 4215 }, { price: 4180 }, { price: 4240 },
  { price: 4290 }, { price: 4270 }, { price: 4310 }, { price: 4350 },
  { price: 4325 }, { price: 4380 }, { price: 4400 }, { price: 4390 },
  { price: 4420 }, { price: 4450 }
];

const MarketStats: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-48 relative group shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 pointer-events-none"></div>

      <div className="px-6 py-5 flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <h3 className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em]">Market Cap</h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-lg">$2.4T</span>
            <div className="glass-panel px-2 py-0.5 rounded-md flex items-center gap-1 bg-emerald-500/20 border-emerald-500/20">
               <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               <span className="text-xs font-bold text-emerald-300">1.2%</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Grid Icon */}
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </div>
      </div>

      {/* Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-60 mix-blend-screen">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPriceMini" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#818cf8" 
              strokeWidth={3}
              fill="url(#colorPriceMini)" 
              filter="drop-shadow(0px 0px 8px rgba(129, 140, 248, 0.5))"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketStats;
