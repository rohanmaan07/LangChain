import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableBranch, RunnablePassthrough } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// Prompts
const reportPrompt = PromptTemplate.fromTemplate("Write a detailed report on {topic}");
const summarizePrompt = PromptTemplate.fromTemplate("Summarize the following text \n{text}");

// Model + Parser
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});
const parser = new StringOutputParser();

// Report chain → return object
const reportChain = RunnableSequence.from([
  reportPrompt,
  model,
  parser,
  (text) => ({ reportText: text }) // wrap as object
]);

// Summarize chain → expects { text }
const summarizeChain = RunnableSequence.from([
  (input) => ({ text: input.reportText }),
  summarizePrompt,
  model,
  parser
]);

// Branch chain
const branchChain = new RunnableBranch({
  branch: (input) => {
    return input.reportText.split(" ").length > 100 ? "summarize" : "passthrough";
  },
  branches: {
    summarize: summarizeChain,
    passthrough: new RunnablePassthrough()
  },
  default: new RunnablePassthrough() // <-- DEFAULT branch fix
});

// Final sequence
const finalChain = RunnableSequence.from([reportChain, branchChain]);

// Run
const run = async () => {
  const result = await finalChain.invoke({ topic: "Russia vs Ukraine" });
  console.log(result.reportText);
};

run();
