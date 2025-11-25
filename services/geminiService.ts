
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Itinerary } from '../types';

const getSystemInstruction = (language: string) => {
  const langInstruction = language === 'ar' 
    ? "You are Safar, an advanced AI travel assistant. Speak in Arabic. Be helpful, concise, and inspiring."
    : "You are Safar, an advanced AI travel assistant. Speak in English. Be helpful, concise, and inspiring.";
    
  return `${langInstruction} 
When asked about flights or hotels, provide realistic estimates or suggest checking the specific search tools in the app. 
If asked to plan a trip, provide a structured day-by-day itinerary.`;
};

/**
 * Sends a chat message to the Gemini model.
 */
export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, language: string = 'en') => {
  try {
    // Initialize client lazily to prevent load-time crashes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(language),
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Unable to connect to Safar AI.");
  }
};

/**
 * Generates a structured itinerary using Gemini with JSON schema enforcement.
 */
export const generateItinerary = async (destination: string, days: number, language: string = 'en'): Promise<Itinerary> => {
  const prompt = language === 'ar'
    ? `Create a ${days}-day itinerary for a trip to ${destination}. Respond in Arabic.`
    : `Create a ${days}-day itinerary for a trip to ${destination}.`;
  
  const itinerarySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      destination: { type: Type.STRING },
      duration: { type: Type.STRING },
      summary: { type: Type.STRING },
      days: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            theme: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ["time", "description"]
              }
            }
          },
          required: ["day", "theme", "activities"]
        }
      }
    },
    required: ["destination", "duration", "summary", "days"]
  };

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: itinerarySchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Gemini Itinerary Error:", error);
    throw error;
  }
};

export const searchTravelInfo = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};
