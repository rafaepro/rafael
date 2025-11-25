import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, could be dynamic
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // No specific tools needed for pure image editing via prompt in this model context
      // based on the "Nano banana powered app" description provided.
    });

    // We need to parse the response to find the generated image
    // Typically Gemini 2.5 Flash Image returns text description OR an image if requested effectively.
    // However, strictly speaking, editing *returns* an image.
    // We check candidates.
    
    // For this specific 'edit' request, we look for inlineData in the response parts.
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated. The model might have returned text: " + response.text);

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};