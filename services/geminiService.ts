
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

// Safely access API_KEY to prevent 'process is not defined' errors in browser environments
const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : "";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeChartImage = async (base64Image: string, userContext?: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Updated prompt to check for chart validity first
  const prompt = `
    أولاً: تحقق بدقة هل الصورة المرفقة هي "شارت تداول مالي" (Financial Chart) تحتوي على شموع يابانية أو خطوط بيانية أو مؤشرات تداول؟

    الحالة 1: إذا لم تكن الصورة شارت تداول (مثلاً: صورة شخصية، سيارة، منظر طبيعي، أو صورة فارغة):
    - اجعل "isValidChart" = false.
    - اجعل "summary" = "الصورة لا تحتوي على مؤشرات تداول".
    - اجعل "recommendation" = "HOLD".
    - اترك باقي الحقول فارغة أو قيم افتراضية.

    الحالة 2: إذا كانت الصورة شارت تداول:
    - اجعل "isValidChart" = true.
    - قم بتحليل الشارت بسرعة فائقة.
    ${userContext ? `ملاحظة: "${userContext}"` : ''}
    
    المطلوب تعبئة JSON التالي بدقة واختصار.
  `;

  let lastError: any;
  const maxRetries = 3;

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
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValidChart: { type: Type.BOOLEAN, description: "True if image is a financial chart, False otherwise" },
              symbol: { type: Type.STRING },
              recommendation: { type: Type.STRING, description: "BUY, SELL, or HOLD" },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
              supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              indicators: {
                type: Type.OBJECT,
                properties: {
                  rsi: { type: Type.STRING },
                  macd: { type: Type.STRING },
                  movingAverages: { type: Type.STRING }
                }
              }
            },
            required: ["isValidChart", "recommendation", "confidence", "summary"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response text received");

      const result = JSON.parse(text);
      return {
        ...result,
        recommendation: result.recommendation as SignalType
      };

    } catch (error: any) {
      console.warn(`Gemini Analysis Attempt ${attempt + 1} failed:`, error);
      lastError = error;

      const isQuotaError = error.status === 429 || 
                           error.code === 429 ||
                           (error.message && error.message.includes('429')) ||
                           (error.message && error.message.includes('RESOURCE_EXHAUSTED'));
      
      const isServerOverloaded = error.status === 503;

      if ((isQuotaError || isServerOverloaded) && attempt < maxRetries - 1) {
        const waitTime = 2000 * Math.pow(2, attempt);
        console.log(`Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      
      break;
    }
  }

  const msg = lastError?.message || "";
  if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    throw new Error("عذراً، الخادم مشغول حالياً بسبب كثرة الطلبات (429). يرجى الانتظار قليلاً ثم المحاولة.");
  }

  throw new Error("فشل التحليل السريع. يرجى التحقق من اتصالك والمحاولة مجدداً.");
};

export const generateVoiceGuidance = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (error) {
    console.error("TTS generation error:", error);
    return "";
  }
};
