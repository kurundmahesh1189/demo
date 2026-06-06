import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type GenerationResult = {
  domain: string;
  category: string;
  properties: { title: string; description: string }[];
};

export function parseGenerationResult(text: string): GenerationResult {
  const cleaned = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  const parsed = JSON.parse(cleaned);
  if (
    !parsed.domain ||
    !parsed.category ||
    !Array.isArray(parsed.properties) ||
    parsed.properties.length !== 3
  ) {
    throw new Error("Invalid response structure from AI");
  }
  return parsed as GenerationResult;
}
