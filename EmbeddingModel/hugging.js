import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import * as dotenv from "dotenv";
dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
});

const text = "Delhi is the capital of India";

const createApiEmbedding = async () => {
    try {
        console.log("Creating embedding using Hugging Face API...");

        const result = await embeddings.embedQuery(text);

        console.log("\n✅ API Embedding Created Successfully!");
        console.log("Vector (first 10 dimensions):", result.slice(0, 10));
        console.log("Total dimensions:", result.length);

    } catch (error) {
        console.error("\n❌ Error creating embedding:", error.message);
    }
};

createApiEmbedding();