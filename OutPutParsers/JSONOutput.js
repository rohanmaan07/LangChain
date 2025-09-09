import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

// Model (Gemini example)
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// JSON Parser
const parser = new JsonOutputParser();

// Prompt with strict format instructions
const template = new PromptTemplate({
  template: `Give me the name, age and city of an anonymous person.
Return ONLY valid JSON.
{format_instructions}`,
  inputVariables: [],
  partialVariables: {
    format_instructions: parser.getFormatInstructions(),
  },
});

// Chain
const chain = template.pipe(model).pipe(parser);

async function run() {
  const result = await chain.invoke({});
  console.log(" JSON Parsed Result:\n", result);
}

run();
