import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

interface ImageData {
  base64: string;
  mimeType: string;
}

async function generateSingleImageEdit(
  ai: GoogleGenAI,
  images: ImageData[],
  prompt: string
): Promise<string> {
  const imageParts = images.map(image => ({
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  }));

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        ...imageParts,
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  // Find the image part in the response
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error('No image data found in the Gemini API response.');
}

export const generateImageEdits = async (
  images: ImageData[],
  prompt: string,
  count: number = 10
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const generationPromises: Promise<string>[] = [];

  for (let i = 0; i < count; i++) {
    generationPromises.push(generateSingleImageEdit(ai, images, prompt));
  }

  try {
    const generatedImages = await Promise.all(generationPromises);
    return generatedImages;
  } catch (error) {
    console.error('Error generating images with Gemini:', error);
    throw new Error('Failed to generate one or more images. Please check the console for details.');
  }
};
