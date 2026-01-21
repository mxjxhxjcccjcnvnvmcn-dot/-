
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const data = [
  { price: 4200 }, { price: 4215 }, { price: 4180 }, { price: 4240 },
  { price: 4290 }, { price: 4270 }, { price: 4310 }, { price: 4350 },
  { price: 4325 }, { price: 4380 }, { price: 4400 }, { price: 4390 },
  { price: 4420 }, { price: 4450 }
];

const MarketStats: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-40 relative shadow-md">
      {/* Compact Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-slate-900/80 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Market Cap</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-black text-white font-mono">$2.4T</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 px-1 rounded">
              +1.2%
            </span>
          </div>
        </div>
        
        {/* Mini Ticker */}
        <div className="hidden sm:flex gap-4">
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-bold">BTC</div>
             <div className="text-xs text-emerald-400 font-mono">43,210 ▲</div>
           </div>
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-bold">ETH</div>
             <div className="text-xs text-emerald-400 font-mono">2,890 ▲</div>
           </div>
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-bold">GOLD</div>
             <div className="text-xs text-amber-400 font-mono">2,030 ▲</div>
           </div>
        </div>
      </div>

      {/* Super Compact Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-30">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPriceMini" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2}
              fill="url(#colorPriceMini)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Grid Overlay for Pro Look */}
      <div className="absolute inset-0 pointer-events-none border-t border-slate-800/50" 
           style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px)', backgroundSize: '40px 100%', opacity: 0.1 }}>
      </div>
    </div>
  );
};

export default MarketStats;
