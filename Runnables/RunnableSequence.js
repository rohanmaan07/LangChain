import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant"
});
// 1st Prompt → Joke Generator
const prompt1=PromptTemplate.fromTemplate(
  `write a joke on {topic}`
)

const prompt2=PromptTemplate.fromTemplate(
  `Expalin a joke  in 2 bullet point {joke}`
)

const parser=new StringOutputParser();

const chain=RunnableSequence.from([
  prompt1,
  model,
  parser,
  (joke)=>({joke}),
  prompt2,
  model,
  parser,
])

const res=await chain.invoke({topic:"MSD"});
console.log(res)