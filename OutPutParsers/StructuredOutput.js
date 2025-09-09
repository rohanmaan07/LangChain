import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// ✅ Model (Gemini)
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    fact_1: z.string().describe("Fact 1 about the topic"),
    fact_2: z.string().describe("Fact 2 about the topic"),
    fact_3: z.string().describe("Fact 3 about the topic"),
  })
);

// ✅ Prompt with format instructions
const template = new PromptTemplate({
  template: `Give 3 facts about {topic}.
Return ONLY valid JSON in the format below:
{format_instructions}`,
  inputVariables: ["topic"],
  partialVariables: {
    format_instructions: parser.getFormatInstructions(),
  },
});

// ✅ Chain
const chain = template.pipe(model).pipe(parser);

async function run() {
  const result = await chain.invoke({ topic: "Coding" });
  console.log(" Structured Result:\n", result);
}

run();
