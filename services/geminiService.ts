
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

// Create client right before use to ensure it has the latest key from context/dialog
const createAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const analyzeChartImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const ai = createAI();
    
    const prompt = `
      You are a HIGH-SPEED PROFESSIONAL STOCK TECHNICAL ANALYSIS ENGINE.
      
      CRITICAL RULES:
      - Analyze the chart IMMEDIATELY and provide the most accurate technical reading.
      - Use professional terminology (Support, Resistance, RSI, MA, Candle Patterns).
      - Output MUST be valid JSON.

      YOUR TASK:
      1. Trend: Detect Uptrend, Downtrend, or Sideways.
      2. Key Levels: Identify specific Support and Resistance zones.
      3. Indicators: Check RSI, Moving Averages, and MACD.
      4. Price Action: Identify key candle patterns.

      OUTPUT FORMAT (JSON):
      {
        "trend": "Detailed trend description",
        "support_resistance": "Levels found",
        "indicators_summary": "RSI & MA status",
        "price_action": "Patterns analysis",
        "decision": "BUY" | "SELL" | "WAIT",
        "confidence_score": number (0-1),
        "risk_level": "Low" | "Medium" | "High",
        "reasoning": ["point 1", "point 2"],
        "symbol": "Asset symbol"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: { type: Type.STRING },
            support_resistance: { type: Type.STRING },
            indicators_summary: { type: Type.STRING },
            price_action: { type: Type.STRING },
            decision: { type: Type.STRING, enum: ["BUY", "SELL", "WAIT"] },
            confidence_score: { type: Type.NUMBER },
            risk_level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            symbol: { type: Type.STRING }
          },
          required: ["trend", "decision", "confidence_score", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    let rec = SignalType.HOLD;
    if (result.decision === 'BUY') rec = SignalType.BUY;
    if (result.decision === 'SELL') rec = SignalType.SELL;

    return {
      isValidChart: true,
      symbol: result.symbol || "تحليل تقني",
      recommendation: rec,
      confidence: result.confidence_score || 0.5,
      reasoning: result.reasoning || ["تم تطبيق القواعد الفنية السريعة"],
      summary: `${result.trend}. ${result.price_action}. المخاطرة: ${result.risk_level}.`,
      supportLevels: [result.support_resistance],
      resistanceLevels: [],
      indicators: {
        rsi: result.indicators_summary,
        movingAverages: result.trend
      },
      suggestedDuration: result.risk_level
    };
  } catch (error: any) {
    console.error("Technical Analysis Engine Error:", error);
    // Handle the case where the entity was not found (invalid/revoked key)
    if (error.message?.includes("Requested entity was not found")) {
      window.location.reload(); // Refresh to trigger key picker gate again
    }
    throw error;
  }
};

export const verifySubscriptionScreenshot = async (base64Image: string): Promise<boolean> => {
  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identify if this image is a YouTube subscription or a Bankak receipt. Respond ONLY YES/NO." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text?.toUpperCase().includes('YES') || false;
  } catch { return true; }
};

export type DialectType = 'sudanese' | 'saudi' | 'syrian';

export const getAIResponse = async (history: any[], text: string, dialect: DialectType): Promise<string> => {
  const instructions = {
    sudanese: "أنت مازن، خبير تداول سوداني. رد بلهجة سودانية واثقة ومهنية سريعة.",
    saudi: "أنت مازن، محلل فني سعودي. رد بلهجة سعودية بيضاء سريعة.",
    syrian: "أنت مازن، خبير أسهم سوري. رد بلهجة شامية مهذبة سريعة."
  };
  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: { 
        systemInstruction: instructions[dialect],
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "أهلاً بك.";
  } catch { return "عذراً، المحرك مشغول."; }
};
