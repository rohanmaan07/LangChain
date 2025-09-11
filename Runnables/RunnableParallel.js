import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableParallel } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// 1. Model (Groq)
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});

// 2. Prompts
const prompt1 = PromptTemplate.fromTemplate(
  "Generate a tweet about {topic}"
);

const prompt2 = PromptTemplate.fromTemplate(
  "Generate a Linkedin post about {topic}"
);

// 3. Parser
const parser = new StringOutputParser();

// 4️. RunnableParallel chain
const parallelChain = RunnableParallel.from({
  tweet: RunnableSequence.from([prompt1, model, parser]),
  linkedin: RunnableSequence.from([prompt2, model, parser])
});

// 5️. Run the chain
const result = await parallelChain.invoke({ topic: "MS Dhoni" });

console.log("Tweet:--------------\n", result.tweet);
console.log("Linkedin Post:--------------\n", result.linkedin);
