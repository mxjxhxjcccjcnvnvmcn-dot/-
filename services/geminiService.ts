
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

const createAIClient = () => {
  // Use VITE_ or the process.env directly if injected by build tool
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey as string });
};

export const analyzeChartImage = async (base64Image: string, timeframe: string = '1h'): Promise<AnalysisResult> => {
  try {
    const ai = createAIClient();
    
    const systemInstruction = `
      أنت نظام خبير (Trading Bot) متخصص في التحليل الفني للشارتات.
      وظيفتك تحليل الصورة المرفقة واستخراج الاتجاهات والمؤشرات.
      يجب أن تكون إجابتك بصيغة JSON فقط.
    `;

    const prompt = `
      قم بتحليل صورة الشارت المرفقة (فريم ${timeframe}).
      استخرج البيانات التالية بدقة:
      - trend: وصف الاتجاه (صاعد/هابط/عرضي).
      - decision: القرار (BUY, SELL, WAIT).
      - confidence: نسبة الثقة بين 0 و 1.
      - reasoning: قائمة من 3 أسباب فنية.
      - summary: ملخص قصير جداً.
      - support: أهم مستوى دعم.
      - resistance: أهم مستوى مقاومة.
      - rsi: قراءة RSI تقريبية.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Fastest and modern for vision tasks
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: prompt }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: { type: Type.STRING },
            decision: { type: Type.STRING, enum: ["BUY", "SELL", "WAIT"] },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            support: { type: Type.STRING },
            resistance: { type: Type.STRING },
            rsi: { type: Type.STRING }
          },
          required: ["trend", "decision", "confidence", "reasoning", "summary", "support", "resistance"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    let recommendation = SignalType.HOLD;
    if (data.decision === 'BUY') recommendation = SignalType.BUY;
    if (data.decision === 'SELL') recommendation = SignalType.SELL;

    return {
      isValidChart: true,
      symbol: "نظام التحليل الذكي",
      recommendation,
      confidence: data.confidence || 0.7,
      reasoning: data.reasoning || [],
      summary: data.summary || "تمت معالجة الصورة بنجاح.",
      supportLevels: [data.support],
      resistanceLevels: [data.resistance],
      indicators: {
        rsi: data.rsi || "غير متاح",
        movingAverages: data.trend
      },
      suggestedDuration: timeframe,
      timeframe: timeframe
    };
  } catch (error: any) {
    console.error("Analysis Engine Failure:", error);
    throw new Error("فشل في تحليل الصورة. يرجى التأكد من اتصال الإنترنت أو وضوح الصورة.");
  }
};
