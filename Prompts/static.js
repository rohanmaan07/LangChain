import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

async function summarize(text) {
  const res = await model.invoke(text);
  return res.content;
}

const text = "LangChain is an open-source framework for developing applications powered by language models.";

summarize(text).then(console.log);
