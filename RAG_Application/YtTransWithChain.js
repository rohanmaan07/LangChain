import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { RunnableLambda, RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
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

// Step 2 - Split transcript
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
const chunks = await splitter.createDocuments([transcript]);

// Step 3 - Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

// Step 4 - MongoDB
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
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

// Step 6 - Retriever
const retriever = vectorStore.asRetriever({ searchType: "similarity", searchKwargs: { k: 1 } });

// Step 7 - LLM
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.2,
});

// Step 8 - Prompt Template
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

// Step 9 - Build chain
const formatDocs = new RunnableLambda({
  func: async (docs) => docs.map((doc) => doc.pageContent).join("\n\n"),
});

const parallelChain = new RunnableParallel({
  steps: {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
});

const formatPrompt = new RunnableLambda({
  func: async (inputs) => prompt.format(inputs),
});

const parser = new StringOutputParser();

const chain = parallelChain
  .pipe(formatPrompt)
  .pipe(llm)
  .pipe(parser);

// Step 10 - Ask question using chain
const question = "Is the topic of nuclear fusion discussed in this video? If yes then what was discussed?";
const res = await chain.invoke(question);
console.log("Final Answer (Chain):", res);

// Close Mongo
await client.close();
