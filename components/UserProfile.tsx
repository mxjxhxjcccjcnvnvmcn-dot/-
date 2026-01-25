
import React, { useState } from 'react';
import { UserProfileData, SignalType, HistoryEntry, Watchlist } from '../types';

interface UserProfileProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, setProfile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'watchlist' | 'favorites'>('history');
  const [newSymbol, setNewSymbol] = useState('');
  const [newListName, setNewListName] = useState('');

  const addToFavorites = (symbol: string) => {
    if (!symbol) return;
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!profile.favorites.includes(cleanSymbol)) {
      setProfile(prev => ({ ...prev, favorites: [...prev.favorites, cleanSymbol] }));
    }
    setNewSymbol('');
  };

  const removeFromFavorites = (symbol: string) => {
    setProfile(prev => ({ ...prev, favorites: prev.favorites.filter(s => s !== symbol) }));
  };

  const createWatchlist = () => {
    if (!newListName) return;
    const newList: Watchlist = {
      id: Math.random().toString(36).substr(2, 9),
      name: newListName.trim(),
      symbols: []
    };
    setProfile(prev => ({ ...prev, watchlists: [...prev.watchlists, newList] }));
    setNewListName('');
  };

  const addSymbolToWatchlist = (listId: string, symbol: string) => {
    if (!symbol) return;
    const cleanSymbol = symbol.trim().toUpperCase();
    setProfile(prev => ({
      ...prev,
      watchlists: prev.watchlists.map(list => 
        list.id === listId 
          ? { ...list, symbols: Array.from(new Set([...list.symbols, cleanSymbol])) } 
          : list
      )
    }));
  };

  const removeSymbolFromWatchlist = (listId: string, symbol: string) => {
    setProfile(prev => ({
      ...prev,
      watchlists: prev.watchlists.map(list => 
        list.id === listId 
          ? { ...list, symbols: list.symbols.filter(s => s !== symbol) } 
          : list
      )
    }));
  };

  const deleteWatchlist = (id: string) => {
    setProfile(prev => ({ ...prev, watchlists: prev.watchlists.filter(l => l.id !== id) }));
  };

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('ar-SA', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(new Date(ts));
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-500 font-tajawal">
      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-10">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter">لوحة <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">التحكم</span></h2>
            <p className="text-slate-400 mt-2 font-medium">سجل تداولاتك، قوائم المراقبة، والمفضلة.</p>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-[2rem] border border-white/5 w-fit">
          <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>سجل التحليل</button>
          <button onClick={() => setActiveTab('watchlist')} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${activeTab === 'watchlist' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>قوائم المراقبة</button>
          <button onClick={() => setActiveTab('favorites')} className={`px-8 py-3 rounded-full text-sm font-black transition-all ${activeTab === 'favorites' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>المفضلة</button>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {profile.history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                   <div className="text-8xl mb-4">📉</div>
                   <p className="text-2xl font-black">لا يوجد سجل حتى الآن</p>
                </div>
              ) : (
                profile.history.map((entry) => (
                  <div key={entry.id} className="glass-panel p-6 rounded-[2.5rem] border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-6 text-right w-full md:w-auto">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${
                        entry.recommendation === SignalType.BUY ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                        entry.recommendation === SignalType.SELL ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {entry.recommendation === SignalType.BUY ? 'B' : entry.recommendation === SignalType.SELL ? 'S' : 'H'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-black text-white">{entry.symbol}</h4>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{formatTime(entry.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-1 mt-1 max-w-md">{entry.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-black block">قوة الإشارة</span>
                        <span className="text-white font-black">{Math.round(entry.confidence * 100)}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-black block">RSI</span>
                        <span className="text-white font-black">{entry.indicators.rsi || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  placeholder="اسم القائمة الجديدة..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none"
                />
                <button 
                  onClick={createWatchlist}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 rounded-2xl shadow-xl transition-all"
                >إنشاء</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profile.watchlists.map(list => (
                  <div key={list.id} className="glass-panel p-8 rounded-[3rem] border-white/10 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-2xl font-black text-white">{list.name}</h4>
                       <button onClick={() => deleteWatchlist(list.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>

                    <div className="space-y-3 mb-6">
                       {list.symbols.map(s => (
                         <div key={s} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            <span className="text-white font-black">{s}</span>
                            <button onClick={() => removeSymbolFromWatchlist(list.id, s)} className="text-slate-500 hover:text-white">×</button>
                         </div>
                       ))}
                       {list.symbols.length === 0 && <p className="text-slate-600 text-sm italic">القائمة فارغة</p>}
                    </div>

                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="إضافة رمز (AAPL, BTC...)" 
                         className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none"
                         onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                               addSymbolToWatchlist(list.id, (e.target as HTMLInputElement).value);
                               (e.target as HTMLInputElement).value = '';
                            }
                         }}
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  placeholder="رمز السهم المفضل..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none"
                />
                <button 
                  onClick={() => addToFavorites(newSymbol)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 rounded-2xl shadow-xl transition-all"
                >إضافة</button>
              </div>

              <div className="flex flex-wrap gap-4">
                 {profile.favorites.map(symbol => (
                   <div key={symbol} className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-3xl px-8 py-4 flex items-center gap-4 group hover:scale-105 transition-all">
                      <span className="text-2xl font-black text-white">{symbol}</span>
                      <button onClick={() => removeFromFavorites(symbol)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-rose-500/20 transition-all">×</button>
                   </div>
                 ))}
                 {profile.favorites.length === 0 && (
                    <div className="w-full py-20 text-center opacity-20 italic">لا توجد أسهم مفضلة بعد</div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
