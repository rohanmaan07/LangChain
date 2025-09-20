import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting pipeline...");

// Step 1 - Load transcript
const videoId = "Gfr50f6ZBvo";
const url = `https://www.youtube.com/watch?v=${videoId}`;

const loader = YoutubeLoader.createFromUrl(url, { language: "en", addVideoInfo: false });
const docs = await loader.load();
const transcript = docs[0].pageContent;
console.log("Transcript loaded");

// Step 2 - Split transcript
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
const chunks = await splitter.createDocuments([transcript]);
console.log("Transcript split into chunks:", chunks.length);

// Step 3 - Initialize embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});
console.log("Embeddings initialized");

// Step 4 - Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
console.log("Connected to MongoDB");

const db = client.db(process.env.MONGO_DB || "genAi");
const collection = db.collection(process.env.MONGO_COLLECTION || "vectors");

// Step 5 - Vector store
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection,
  indexName: "genn",
  textKey: "text",
  embeddingKey: "embedding",
});
await vectorStore.addDocuments(chunks);
console.log("Vector store created with MongoDB Atlas");

// Step 6 - Create retriever
const retriever = vectorStore.asRetriever({ searchType: "similarity", searchKwargs: { k: 1 } });

// Step 7 - Initialize LLM
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.2,
});
console.log("LLM initialized (Groq)");

// Step 8 - Prompt
const prompt = new PromptTemplate({
  template: `
    You are a helpful assistant.
    Answer ONLY from the provided transcript context.
    If the context is insufficient, just say you don't know.
    Context:
    {context}
    Question: {question}
  `,
  inputVariables: ["context", "question"],
});

// Step 9 - Ask question
const question = "Is the topic of nuclear fusion discussed in this video? If yes then what was discussed?";
console.log("Question:", question);

// Step 10 - Retrieve context and call LLM
const retrievedDocs = await retriever.invoke(question);
const contextText = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");
const finalPrompt = await prompt.format({ context: contextText, question });

const result = await llm.invoke(finalPrompt);
console.log("Final Answer (Direct):", result.content);

// Close Mongo
await client.close();
