import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

const docs = [
    new Document({
    pageContent:
      "MS Dhoni, famously known as Captain Cool, has led Chennai Super Kings to multiple IPL titles. His finishing skills, wicketkeeping, and leadership are legendary.",
    metadata: { team: "Chennai Super Kings" },
  }),
  new Document({
    pageContent:
      "Virat Kohli is one of the most successful and consistent batsmen in IPL history. Known for his aggressive batting style and fitness, he has led the Royal Challengers Bangalore in multiple seasons.",
    metadata: { team: "Royal Challengers Bangalore" },
  }),
  new Document({
    pageContent:
      "Rohit Sharma is the most successful captain in IPL history, leading Mumbai Indians to five titles. He's known for his calm demeanor and ability to play big innings under pressure.",
    metadata: { team: "Mumbai Indians" },
  }),
  new Document({
    pageContent:
      "Jasprit Bumrah is considered one of the best fast bowlers in T20 cricket. Playing for Mumbai Indians, he is known for his yorkers and death-over expertise.",
    metadata: { team: "Mumbai Indians" },
  }),
  new Document({
    pageContent:
      "Ravindra Jadeja is a dynamic all-rounder who contributes with both bat and ball. Representing Chennai Super Kings, his quick fielding and match-winning performances make him a key player.",
    metadata: { team: "Chennai Super Kings" },
  }),
];


const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Add new documents
await vectorStore.addDocuments([
  new Document({
    pageContent:
      "AB de Villiers, played for Royal Challengers Bangalore. He is famous for his innovative batting and match-winning knocks.",
    metadata: { team: "Royal Challengers Bangalore" },
  }),
]);

// Search documents (Semantic Similarity Search)
const searchResults = await vectorStore.similaritySearch(
  "Who among these are a bowler?",
  2
);
console.log("Search Results:", searchResults);

// Metadata-based filtering (not natively supported in MemoryVectorStore, so we filter manually)
const allDocs = await vectorStore.similaritySearch("all-rounder", 5);
const filteredResults = allDocs.filter(
  (doc) => doc.metadata.team === "Chennai Super Kings"
);
console.log("Filtered Results:", filteredResults);

// Update document (replace old with new) 
await vectorStore.addDocuments([
  new Document({
    pageContent:
      "Virat Kohli, the former captain of Royal Challengers Bangalore (RCB), is renowned for his aggressive leadership and consistent batting performances. He holds the record for the most runs in IPL history, including multiple centuries in a single season. Despite RCB not winning an IPL title under his captaincy, Kohli's passion and fitness set a benchmark for the league. His ability to chase targets and anchor innings has made him one of the most dependable players in T20 cricket.",
    metadata: { team: "Royal Challengers Bangalore" },
  }),
]);

// Delete document → MemoryVectorStore does not support delete, so we rebuild store without that doc if needed

// View all documents
console.log("All Documents:", vectorStore.memoryVectors);
