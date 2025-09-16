import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

// Documents
const docs = [
  new Document({ pageContent: "LangChain helps developers build LLM applications easily." }),
  new Document({ pageContent: "Chroma is a vector database optimized for LLM-based search." }),
  new Document({ pageContent: "Embeddings convert text into high-dimensional vectors." }),
  new Document({ pageContent: "Google Gemini provides powerful embedding models." }),
];

// In-memory vectorstore
const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Retriever
const retriever = vectorstore.asRetriever({ k: 2 });

// Query
const query = "What is Chroma used for?";
const results = await retriever.invoke(query);

console.log(
  "Retriever Results:\n",
  results.map((doc) => doc.pageContent).join("\n\n")
);

