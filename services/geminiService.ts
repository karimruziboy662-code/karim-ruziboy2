import { GoogleGenAI } from "@google/genai";
import { GeminiModel, GeneratedImage } from "../types";

// Helper to ensure we have a key for Pro models
const ensureApiKey = async (model: GeminiModel) => {
  if (model === GeminiModel.PRO && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Assume success after dialog interaction as per guidelines, but checking again is safe practice in real apps.
      // Here we proceed.
    }
  }
};

export const generateLogo = async (
  prompt: string,
  model: GeminiModel = GeminiModel.FLASH
): Promise<GeneratedImage> => {
  
  await ensureApiKey(model);

  // Re-initialize client to pick up potential new key from window.aistudio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Add specific logo design context to the prompt
  const enhancedPrompt = `Design a professional, high-quality logo. ${prompt}. Ensure the design is clean, memorable, and suitable for branding.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          // imageSize: "1K" // Defaulting to 1K for compatibility
        }
      }
    });

    let imageUrl = '';

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Determine mimeType. The API returns it, but standard is usually image/png or jpeg.
          // The SDK type usually has mimeType in inlineData.
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in the response.");
    }

    return {
      id: crypto.randomUUID(),
      imageUrl,
      prompt,
      timestamp: Date.now(),
      model
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};