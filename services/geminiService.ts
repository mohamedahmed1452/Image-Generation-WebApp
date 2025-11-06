
import { GoogleGenAI } from "@google/genai";
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: ImageFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.mimeType,
    },
  };
};

export const generateText = async (prompt: string, imageFile?: ImageFile): Promise<string> => {
  const model = 'gemini-2.5-flash';

  try {
    if (imageFile) {
      const imagePart = fileToGenerativePart(imageFile);
      const textPart = { text: prompt };
      const response = await ai.models.generateContent({
        model,
        contents: { parts: [textPart, imagePart] },
      });
      return response.text;
    } else {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text;
    }
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I couldn't process that request. Please try again.";
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';
    try {
        const response = await ai.models.generateImages({
            model,
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            return "Sorry, I couldn't generate an image. Please try a different prompt.";
        }

    } catch (error) {
        console.error("Error generating image:", error);
        return "Sorry, there was an error generating the image. The model may have safety restrictions.";
    }
};
