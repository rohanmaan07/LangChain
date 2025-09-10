import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import dotenv from "dotenv";
dotenv.config();

// 1. Model setup
const model = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ 2. Output parsers
const textParser = new StringOutputParser();
const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]).describe("Sentiment of the feedback"),
});
const sentimentParser = StructuredOutputParser.fromZodSchema(sentimentSchema);

// ✅ 3. Prompts
const classifierPrompt = new PromptTemplate({
  template: `
Classify the sentiment of this feedback as "positive" or "negative".
Feedback: {feedback}
Return ONLY a valid JSON object, no explanations, no markdown fences.
Format:
{format_instructions}
`,
  inputVariables: ["feedback"],
  partialVariables: {
    format_instructions: sentimentParser.getFormatInstructions(),
  },
});

const positivePrompt = new PromptTemplate({
  template: "Reply nicely to this positive feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

const negativePrompt = new PromptTemplate({
  template: "Reply politely to this negative feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

// ✅ 4. Main chain (branching logic)
async function conditionalChain(feedback) {
  // Step 1: Classify
  const { sentiment } = await classifierPrompt.pipe(model).pipe(sentimentParser).invoke({ feedback });

  // Step 2: Route based on sentiment
  if (sentiment === "positive") {
    return await positivePrompt.pipe(model).pipe(textParser).invoke({ feedback });
  } else {
    return await negativePrompt.pipe(model).pipe(textParser).invoke({ feedback });
  }
}
const result = await conditionalChain("This phone is ugly and useless");
console.log(result);
