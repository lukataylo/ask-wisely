
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refinePrompt = async (originalPrompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Refine the following AI prompt to be more precise, effective, and sophisticated. Maintain the core intent but improve the structure and instructions. Return ONLY the refined prompt text.\n\nOriginal Prompt: "${originalPrompt}"`,
    config: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  return response.text || originalPrompt;
};
