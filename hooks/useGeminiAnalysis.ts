
import { GoogleGenAI, Type } from "@google/genai";
import { useMutation } from "@tanstack/react-query";

export const useGeminiAnalysis = () => {
  return useMutation({
    mutationFn: async (narrative: string) => {
      // Fix: Always initialize GoogleGenAI inside the call context to ensure up-to-date config and API key
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this medical blood request narrative and return a JSON analysis: 
        1. 'severity' (number 1-10), 
        2. 'urgency' (Immediate, High, Standard), 
        3. 'summary' (short string).
        
        Narrative: "${narrative}"`,
        config: {
          responseMimeType: "application/json",
          // Fix: Using responseSchema as the recommended way to configure JSON output
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity: {
                type: Type.NUMBER,
                description: 'The severity level from 1 to 10.',
              },
              urgency: {
                type: Type.STRING,
                description: 'The urgency level: Immediate, High, or Standard.',
              },
              summary: {
                type: Type.STRING,
                description: 'A short summary of the request.',
              },
            },
            required: ['severity', 'urgency', 'summary'],
          },
        },
      });

      try {
        // Fix: Use the .text property directly (not a method) to extract the result string
        const text = response.text;
        return JSON.parse(text || '{}');
      } catch (e) {
        return { severity: 5, urgency: 'Standard', summary: 'Analysis Unavailable' };
      }
    }
  });
};
