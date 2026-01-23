
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

const API_KEY = process.env.API_KEY || "";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// New constant for specific error
export const API_QUOTA_ERROR = "QUOTA_EXCEEDED";

// --- Chart Analysis ---
export const analyzeChartImage = async (base64Image: string, userContext?: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Enhanced prompt for highly detailed technical analysis
  const prompt = `
    Analyze this financial chart with the precision of a professional technical analyst.
    
    REQUIRED ANALYSIS COMPONENTS:
    1. Support & Resistance: Identify at least 2-3 significant horizontal or dynamic levels.
    2. RSI (Relative Strength Index): Analyze current value, overbought/oversold conditions, or divergences.
    3. MACD: Look for crossovers, histogram momentum, and signal line position.
    4. Moving Averages: Identify the trend based on major MAs (e.g., 20, 50, 200) and any crossovers (Golden/Death cross).
    5. Price Action: Identify key candlestick patterns (Hammer, Engulfing, etc.) and market structure (Higher Highs/Lower Lows).

    Based on the chart:
    - isValidChart: Is this a recognizable trading chart? (boolean)
    - recommendation: BUY, SELL, or HOLD.
    - suggestedDuration: Optimal trade horizon ("5s", "15s", "1m").
    - confidence: A score from 0.0 to 1.0 representing your certainty.
    - reasoning: List specific technical reasons for your recommendation.
    - supportLevels: Specific price levels or zones of support.
    - resistanceLevels: Specific price levels or zones of resistance.
    - indicators: Detailed summary of RSI, MACD, and Moving Averages signals.
    - summary: A concise technical summary in ARABIC (max 60 words).
    
    ${userContext ? `Special Focus/Context from User: ${userContext}` : ''}
  `;

  let lastError: any;
  const maxRetries = 2; 

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        },
        config: {
          temperature: 0.4, // Lower temperature for more consistent technical analysis
          maxOutputTokens: 1200,
          thinkingConfig: { thinkingBudget: 200 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValidChart: { type: Type.BOOLEAN },
              symbol: { type: Type.STRING },
              recommendation: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
              suggestedDuration: { type: Type.STRING, enum: ["5s", "15s", "1m"] },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
              supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              indicators: {
                type: Type.OBJECT,
                properties: {
                  rsi: { type: Type.STRING, description: "Detailed RSI analysis" },
                  macd: { type: Type.STRING, description: "Detailed MACD analysis" },
                  movingAverages: { type: Type.STRING, description: "Detailed Moving Averages analysis" }
                }
              }
            },
            required: ["isValidChart", "recommendation", "confidence", "summary", "suggestedDuration", "supportLevels", "resistanceLevels", "indicators"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response");

      const result = JSON.parse(text);
      return {
        ...result,
        recommendation: result.recommendation as SignalType
      };

    } catch (error: any) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      if (attempt < maxRetries - 1) await delay(1000); 
    }
  }

  throw new Error("فشل التحليل. حاول مرة أخرى.");
};

// --- Chat & Voice Functions (Kept as is for other features) ---
export type DialectType = 'sudanese' | 'saudi' | 'syrian' | 'algerian' | 'tunisian';

const DIALECT_PROMPTS: Record<DialectType, string> = {
  sudanese: "تحدث باللهجة السودانية (يا زول، كيفك).",
  saudi: "تحدث باللهجة السعودية (هلا والله).",
  syrian: "تحدث باللهجة الشامية (يا هلا).",
  algerian: "تحدث باللهجة الجزائرية.",
  tunisian: "تحدث باللهجة التونسية.",
};

export const getAIResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  userText: string,
  dialect: DialectType
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const systemInstruction = `أنت "مازن"، مساعد مالي ذكي. ${DIALECT_PROMPTS[dialect]} ردودك يجب أن تكون قصيرة جداً وسريعة.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: userText }] }] as any,
      config: { systemInstruction, temperature: 0.7, maxOutputTokens: 60 }
    });
    return response.text || "عذراً، لم أسمعك جيداً.";
  } catch (error: any) {
    if (error.code === 429) return API_QUOTA_ERROR;
    return "حدث خطأ في الاتصال.";
  }
};

export const generateVoiceGuidance = async (text: string, voiceName: string = 'Fenrir'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName as any } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error: any) {
    if (error.code === 429) return API_QUOTA_ERROR;
    return null;
  }
};

export const playBase64Audio = async (base64String: string): Promise<void> => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const audioContext = new AudioContext();
  try {
    const binaryString = atob(base64String);
    const validLen = binaryString.length - (binaryString.length % 2);
    const bytes = new Uint8Array(validLen);
    for (let i = 0; i < validLen; i++) bytes[i] = binaryString.charCodeAt(i);
    const pcmData = new Int16Array(bytes.buffer);
    const sampleRate = 24000;
    const buffer = audioContext.createBuffer(1, pcmData.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) channelData[i] = pcmData[i] / 32768.0;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    return new Promise((resolve) => {
      source.onended = () => { resolve(); audioContext.close(); };
    });
  } catch (error) {
    audioContext.close();
  }
};
