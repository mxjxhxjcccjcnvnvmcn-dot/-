
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

// وظيفة إنشاء العميل لضمان استخدام أحدث مفتاح API من البيئة
const createAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const analyzeChartImage = async (base64Image: string, timeframe: string = '1h'): Promise<AnalysisResult> => {
  try {
    const ai = createAIClient();
    
    const systemInstruction = `
      أنت خبير تحليل فني محترف (Senior Technical Analyst) متخصص في أسواق المال والعملات الرقمية.
      مهمتك هي تحليل صورة الشارت المرفقة بدقة متناهية بناءً على:
      1. نماذج الشموع اليابانية (Price Action).
      2. خطوط الاتجاه (Trendlines) والقنوات السعرية.
      3. مستويات الدعم والمقاومة الأفقية (S/R Levels).
      4. مؤشرات الزخم (RSI, MACD, Stochastic).
      5. المتوسطات المتحركة (Moving Averages).

      يجب أن يكون تحليلك منطقياً، حذراً، ومهنياً.
    `;

    const prompt = `
      قم بتحليل لقطة الشارت هذه لفريم ${timeframe}. 
      أعطني تقريراً مفصلاً يتضمن:
      - الاتجاه الحالي (صاعد، هابط، عرضي).
      - قرار تداول واضح (BUY, SELL, WAIT).
      - نسبة الثقة في التحليل (من 0 إلى 1).
      - الأسباب الفنية لهذا القرار (Reasoning).
      - ملخص تنفيذي للموقف.
      - أهم مستوى دعم وأهم مستوى مقاومة.
      - قراءة مؤشر RSI وحالة المتوسطات المتحركة.

      يجب أن تكون النتيجة بتنسيق JSON حصرياً كما هو محدد في الـ Schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
            rsi_value: { type: Type.STRING },
            macd_status: { type: Type.STRING }
          },
          required: ["trend", "decision", "confidence", "reasoning", "summary", "support", "resistance"]
        }
      }
    });

    const text = response.text || '{}';
    const data = JSON.parse(text);
    
    let recommendation = SignalType.HOLD;
    if (data.decision === 'BUY') recommendation = SignalType.BUY;
    if (data.decision === 'SELL') recommendation = SignalType.SELL;

    return {
      isValidChart: true,
      symbol: "تحليل الأصل",
      recommendation,
      confidence: data.confidence || 0.5,
      reasoning: data.reasoning || [],
      summary: data.summary,
      supportLevels: [data.support],
      resistanceLevels: [data.resistance],
      indicators: {
        rsi: data.rsi_value || "غير محدد",
        macd: data.macd_status || "غير محدد",
        movingAverages: data.trend
      },
      suggestedDuration: timeframe,
      timeframe: timeframe
    };
  } catch (error: any) {
    console.error("AI Engine Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      window.location.reload();
    }
    throw error;
  }
};
