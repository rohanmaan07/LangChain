import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import "dotenv/config";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

const docs = [
  new Document({
    pageContent: `
The Grand Canyon is one of the most visited natural wonders in the world.
Photosynthesis is the process by which green plants convert sunlight into energy.
Millions of tourists travel to see it every year. The rocks date back millions of years.
    `,
    metadata: { source: "Doc1" }
  }),
  new Document({
    pageContent: `
In medieval Europe, castles were built primarily for defense.
The chlorophyll in plant cells captures sunlight during photosynthesis.
Knights wore armor made of metal. Siege weapons were often used to breach castle walls.
    `,
    metadata: { source: "Doc2" }
  }),
  new Document({
    pageContent: `
Basketball was invented by Dr. James Naismith in the late 19th century.
It was originally played with a soccer ball and peach baskets. NBA is now a global league.
    `,
    metadata: { source: "Doc3" }
  }),
  new Document({
    pageContent: `
The history of cinema began in the late 1800s. Silent films were the earliest form.
Thomas Edison was among the pioneers. Photosynthesis does not occur in animal cells.
Modern filmmaking involves complex CGI and sound design.
    `,
    metadata: { source: "Doc4" }
  }),
];

const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddingModel);

const baseRetriever = vectorstore.asRetriever({ searchKwargs: { k: 5 } });

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const compressor = LLMChainExtractor.fromLLM(llm);
const compressionRetriever = new ContextualCompressionRetriever({
  baseRetriever,
  baseCompressor: compressor,
});

const query = "What is photosynthesis?";
const compressedResults = await compressionRetriever.invoke(query);

compressedResults.forEach((doc, index) => {
  console.log(`\n--- Result ${index + 1} ---`);
  console.log(doc.pageContent);
});
