import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMedicalAssistantResponse = async (
  currentNotes: string,
  chatHistory: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful AI medical assistant for a doctor in a clinic. 
    Your goal is to assist the doctor by suggesting potential diagnoses based on symptoms, 
    summarizing medical notes, or drafting prescription advice. 
    Be concise, professional, and use medical terminology where appropriate. 
    Do not provide definitive medical advice to patients directly; you are speaking to a professional.`;

    const prompt = `
    Context: The doctor is currently seeing a patient.
    Current Notes/Symptoms: ${currentNotes}
    
    Doctor's Query: ${chatHistory}
    
    Please provide a helpful response.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI assistant. Please check your API key.";
  }
};