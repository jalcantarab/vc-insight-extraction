
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        signals: {
            type: Type.ARRAY,
            description: "Direct quotes or observations from the user. What did they say or do?",
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING, description: "The speaker who said this. e.g., 'User A' or 'PM'" },
                    text: { type: Type.STRING, description: "The verbatim quote or observation from the transcript." },
                },
                 required: ["speaker", "text"],
            }
        },
        insights: {
            type: Type.ARRAY,
            description: "The 'why' behind the signals. What are the underlying user needs, pain points, or motivations?",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "A summary of a key user pain point, motivation, or behavior derived from the signals." },
                },
                required: ["text"],
            }
        },
        opportunities: {
            type: Type.ARRAY,
            description: "Potential areas for product improvement based on the insights. How might we solve the user's problem?",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "A potential area for improvement or a new feature that could address the insights." },
                },
                 required: ["text"],
            }
        },
        ideas: {
            type: Type.ARRAY,
            description: "Concrete, actionable suggestions for features or changes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "A concrete, actionable solution or feature concept to explore." },
                },
                 required: ["text"],
            }
        }
    },
     required: ["signals", "insights", "opportunities", "ideas"],
};


export const generateInsightsFromTranscript = async (transcript: string): Promise<ExtractedData> => {
    const systemInstruction = `You are an expert product manager AI assistant for a product called "Zentrik". Your task is to analyze a user interview transcript and extract key information into four categories: Signals, Insights, Opportunities, and Ideas.

- **Signals**: Direct quotes or observations from the user. What did they say or do?
- **Insights**: The "why" behind the signals. What are the underlying user needs, pain points, or motivations?
- **Opportunities**: Potential areas for product improvement based on the insights. How might we solve the user's problem?
- **Ideas**: Concrete, actionable suggestions for features or changes.

Please provide the output in JSON format, adhering to the provided schema. Ensure that the text for each item is concise and directly related to the transcript.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Here is the transcript: ${transcript}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        const createId = () => Math.random().toString(36).substring(2, 9);
        
        // Ensure data structure is valid and add necessary client-side fields
        return {
            signals: (data.signals || []).map((item: any) => ({ ...item, id: createId(), type: 'signals', okrIds: [] })),
            insights: (data.insights || []).map((item: any) => ({ ...item, id: createId(), type: 'insights', speaker: 'PM', okrIds: [] })),
            opportunities: (data.opportunities || []).map((item: any) => ({ ...item, id: createId(), type: 'opportunities', speaker: 'PM', okrIds: [] })),
            ideas: (data.ideas || []).map((item: any) => ({ ...item, id: createId(), type: 'ideas', speaker: 'PM', okrIds: [] })),
        };

    } catch (error) {
        console.error("Error generating insights from Gemini:", error);
        throw new Error("Failed to process the transcript. The model may have returned an invalid format or the request failed.");
    }
};
