import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableLambda, RunnablePassthrough, RunnableParallel } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// 1️ Word count function
const wordCount = new RunnableLambda({ func: (text) => text.split(" ").length });

// 2️ Joke prompt
const prompt = PromptTemplate.fromTemplate("Write a joke about {topic}");

// 3️ Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});

// 4️ Parser
const parser = new StringOutputParser();

// 5️ Joke Generation Sequence
const jokeGenChain = RunnableSequence.from([prompt, model, parser]);

// 6️ Parallel chain: original joke + word count
const parallelChain = RunnableParallel.from({
  joke: new RunnablePassthrough(),
  word_count: wordCount
});

// 7️ Final sequence: joke generate → parallel tasks
const finalChain = RunnableSequence.from([jokeGenChain, parallelChain]);

// 8️ Run the chain
const result = await finalChain.invoke({ topic: "AI" });

const finalResult = `${result.joke} \nWord count - ${result.word_count}`;
console.log(finalResult);
