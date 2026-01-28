import { ContentTemplate, SimplifiedContent } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export class GeminiService {
  async simplifyContent(text: string, template: ContentTemplate, customInstructions?: string): Promise<SimplifiedContent> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          template,
          customInstructions
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Backend error');
      }

      const result = await response.json();
      return result as SimplifiedContent;
    } catch (error: any) {
      console.error("API Error:", error);
      const message = error.message || "Failed to connect to backend. Ensure Ollama is running.";
      throw new Error(message);
    }
  }
}

export const geminiService = new GeminiService();
