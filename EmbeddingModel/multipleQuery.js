import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from "dotenv";
dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "embedding-001",
});

const documents = [
    "Delhi is the capital of India.",
    "The sky is blue.",
    "LangChain is a framework for developing applications powered by language models.",
    "The quick brown fox jumps over the lazy dog."
];

const createEmbeddingsForMultipleDocs = async () => {
    try {
        console.log("Creating embeddings for multiple documents...");
        const results = await embeddings.embedDocuments(documents);

        console.log(`Created ${results.length} vectors.`);
        console.log("Dimensions of the first vector:", results[0].length);
    

    } catch (error)
     {
        console.error("\n Error creating embeddings:", error.message);
    }
};

createEmbeddingsForMultipleDocs();