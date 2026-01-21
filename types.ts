
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
}

export interface MarketData {
  time: string;
  price: number;
  volume: number;
}
