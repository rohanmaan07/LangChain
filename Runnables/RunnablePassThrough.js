import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// 1️. Prompts
const jokePrompt = PromptTemplate.fromTemplate("Write a joke about {topic}");
const explainPrompt = PromptTemplate.fromTemplate("Explain the following joke - {text}");

// 2️. Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});

// 3️. Parser
const parser = new StringOutputParser();

// 4️. Joke Generation Sequence
const jokeGenChain = RunnableSequence.from([jokePrompt, model, parser]);

// 5️. Parallel Chain: joke passthrough + explanation
const parallelChain = RunnableParallel.from({
  joke: new RunnablePassthrough(), // ✅ correct usage
  explanation: RunnableSequence.from([
    (output) => ({ text: output }), // string → { text } for prompt
    explainPrompt,
    model,
    parser
  ])
});

// 6️. Final Sequence: jokeGen → parallel tasks
const finalChain = RunnableSequence.from([jokeGenChain, parallelChain]);

// 7️. Run the chain
const result = await finalChain.invoke({ topic: "cricket" });

console.log("Joke:\n", result.joke);
console.log("Explanation:\n", result.explanation);
