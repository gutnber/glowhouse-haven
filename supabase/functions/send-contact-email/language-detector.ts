
import { spanishIndicators } from "./constants.ts";

// Detect language in the message
export function detectLanguage(message: string): boolean {
  if (!message) return false;
  
  const lowerCaseMessage = message.toLowerCase();
  return spanishIndicators.some(indicator => lowerCaseMessage.includes(indicator));
}
