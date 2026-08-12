import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiApiKey = (): string => {
  const envKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    ((import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';
  if (envKey) return envKey;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('GEMINI_API_KEY') || '';
  }
  return '';
};

export const getGenAI = (): GoogleGenAI | null => {
  const key = getGeminiApiKey();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const getGenerativeAI = (): GoogleGenerativeAI | null => {
  const key = getGeminiApiKey();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};
