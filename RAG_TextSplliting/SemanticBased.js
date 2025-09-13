import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SemanticChunker } from "langchain/text_splitter";

async function run() {
  const sample = `
  Farmers were working hard in the fields, preparing the soil and planting seeds for the next season.
  The sun was bright, and the air smelled of earth and fresh grass.
  The Indian Premier League (IPL) is the biggest cricket league in the world. People all over the world watch the matches and cheer for their favourite teams.

  Terrorism is a big danger to peace and safety. It causes harm to people and creates fear in cities and villages.
  When such attacks happen, they leave behind pain and sadness.
  To fight terrorism, we need strong laws, alert security forces, and support from people who care about peace and safety.
  `;

  // Step 1: Gemini embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,  // apna Gemini API key
    model: "embedding-001",              // Gemini embedding model
  });

  // Step 2: Semantic chunker
  const splitter = new SemanticChunker(embeddings, {
    breakpointThresholdType: "standard_deviation", // ya "percentile"
    breakpointThreshold: 3,
  });

  // Step 3: Split text
  const docs = await splitter.splitText(sample);

  console.log("Total chunks:", docs.length);
  console.log("Docs:", docs);
}

run();
