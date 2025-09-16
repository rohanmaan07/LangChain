import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import "dotenv/config";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", 
  apiKey: process.env.GEMINI_API_KEY,
});

const allDocs = [
  new Document({ pageContent: "Regular walking boosts heart health and can reduce symptoms of depression.", metadata: { source: "H1" } }),
  new Document({ pageContent: "Consuming leafy greens and fruits helps detox the body and improve longevity.", metadata: { source: "H2" } }),
  new Document({ pageContent: "Deep sleep is crucial for cellular repair and emotional regulation.", metadata: { source: "H3" } }),
  new Document({ pageContent: "Mindfulness and controlled breathing lower cortisol and improve mental clarity.", metadata: { source: "H4" } }),
  new Document({ pageContent: "Drinking sufficient water throughout the day helps maintain metabolism and energy.", metadata: { source: "H5" } }),
  new Document({ pageContent: "The solar energy system in modern homes helps balance electricity demand.", metadata: { source: "I1" } }),
  new Document({ pageContent: "Python balances readability with power, making it a popular system design language.", metadata: { source: "I2" } }),
  new Document({ pageContent: "Photosynthesis enables plants to produce energy by converting sunlight.", metadata: { source: "I3" } }),
  new Document({ pageContent: "The 2022 FIFA World Cup was held in Qatar and drew global energy and excitement.", metadata: { source: "I4" } }),
  new Document({ pageContent: "Black holes bend spacetime and store immense gravitational energy.", metadata: { source: "I5" } }),
];

const vectorstore = await MemoryVectorStore.fromDocuments(allDocs, embeddingModel);

const similarityRetriever = vectorstore.asRetriever({
  searchType: "similarity",
  searchKwargs: { k: 5 },
});

// MultiQueryRetriever with Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", //chat model haiii
  apiKey: process.env.GEMINI_API_KEY,
});

const multiqueryRetriever = MultiQueryRetriever.fromLLM({
  retriever: vectorstore.asRetriever({ searchKwargs: { k: 5 } }),
  llm,
});

const query = "How to improve energy levels and maintain balance?";

const similarityResults = await similarityRetriever.invoke(query);
const multiqueryResults = await multiqueryRetriever.invoke(query);

// Step 7: Print results
// console.log("\n=== Similarity Results ===");
// similarityResults.forEach((doc, i) => {
//   console.log(`\n--- Result ${i + 1} ---`);
//   console.log(doc.pageContent);
// });
console.log("---------------------Similarity-----------",similarityResults);
// console.log("\n" + "*".repeat(100));

// console.log("\n=== MultiQuery Results ===");
// multiqueryResults.forEach((doc, i) => {
//   console.log(`\n--- Result ${i + 1} ---`);
//   console.log(doc.pageContent);
// });
console.log("-----------Multiquery--------------------------",multiqueryResults)