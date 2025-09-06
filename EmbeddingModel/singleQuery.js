import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize the Gemini Embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "embedding-001",
});

const text = "Delhi is the capital of India";

//  Create the embedding for the text
const createEmbedding = async () => {
    try {
        const result = await embeddings.embedQuery(text);

        console.log("Vector", result);
        console.log("Total dimensions:", result.length);

    } catch (error) {
        console.error(" Error creating embedding:", error.message);
    }
};

createEmbedding();