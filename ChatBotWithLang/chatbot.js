// chatbot.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { chatbotTemplate } from "./prompt.js";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Memory setup
const memory = new BufferMemory();

// ✅ Chain setup (model + memory + prompt)
const chain = new ConversationChain({
  llm: model,
  memory: memory,
  prompt: chatbotTemplate,
});

export async function askBot(question) {
  const response = await chain.call({
    question,
  });
  return response.response;
}
