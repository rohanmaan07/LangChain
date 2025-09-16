import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

const docs = [
  new Document({ pageContent: "LangChain makes it easy to work with LLMs." }),
  new Document({ pageContent: "LangChain is used to build LLM based applications." }),
  new Document({ pageContent: "Chroma is used to store and search document embeddings." }),
  new Document({ pageContent: "Embeddings are vector representations of text." }),
  new Document({ pageContent: "MMR helps you get diverse results when doing similarity search." }),
  new Document({ pageContent: "LangChain supports Chroma, FAISS, Pinecone, and more." }),
];

const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Retriever with MMR
const retriever = vectorstore.asRetriever({
  searchType: "mmr", 
  searchKwargs: { k: 3, lambda: 0.5 }, // k = top results, lambda = relevance-diversity balance
});

const query = "What is LangChain?";
const results = await retriever.invoke(query);

results.forEach((doc, i) => {
  console.log(`\n--- Result ${i + 1} ---`);
  console.log(doc.pageContent);
});
