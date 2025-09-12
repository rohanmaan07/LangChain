import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 1. Load Model (Groq)
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.1-8b-instant",      
});

// 2. Define Prompt
const prompt = PromptTemplate.fromTemplate(
 "Write a summary for the following poem:\n {poem}",
);

// 3. Parser
const parser = new StringOutputParser();

// 4. Load Document (Text File)
const loader = new TextLoader("./RAG/cricket.txt", { encoding: "utf-8" });

const run = async () => {
  // Load documents
  const docs = await loader.load();

  console.log("Type of docs:", typeof docs);
  console.log("Number of docs:", docs.length);
  console.log("Page content:", docs[0].pageContent);
  console.log("Metadata:", docs[0].metadata);

  // 5. Create chain
  const chain = prompt.pipe(model).pipe(parser);

  // 6. Run chain
  const response = await chain.invoke({ poem: docs[0].pageContent });

  console.log("\n=== Summary Output ===\n");
  console.log(response);
};

run();
