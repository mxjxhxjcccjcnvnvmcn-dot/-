
export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD'
}

export interface AnalysisResult {
  isValidChart: boolean;
  symbol: string;
  recommendation: SignalType;
  confidence: number;
  reasoning: string[];
  supportLevels: string[];
  resistanceLevels: string[];
  indicators: {
    rsi?: string;
    macd?: string;
    movingAverages?: string;
  };
  summary: string;
  suggestedDuration: string; // New field for 5s, 15s, 1m
}

export interface HistoryEntry extends AnalysisResult {
  id: string;
  timestamp: number;
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

export interface UserProfileData {
  favorites: string[];
  watchlists: Watchlist[];
  history: HistoryEntry[];
}

export interface MarketData {
  time: string;
  price: number;
  volume: number;
}
