export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  model: string;
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview',
}

export interface GenerationConfig {
  prompt: string;
  model: GeminiModel;
  aspectRatio: "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
}
