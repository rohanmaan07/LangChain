import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from "dotenv";
import cosineSimilarity from 'compute-cosine-similarity';
dotenv.config();

const SimilarDocument = async () => {
    try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            model: "embedding-001",
        });
        const documents = [
            "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
            "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
            "Sachin Tendulkar, also known as the 'God of Cricket', holds many batting records.",
            "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
            "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers."
        ];

        const query = 'tell me about bumrah';

        const docEmbeddings = await embeddings.embedDocuments(documents);
        const queryEmbedding = await embeddings.embedQuery(query);

        console.log("Calculating similarity scores...");

        // 4. Calculate cosine similarity for each document
        const scores = docEmbeddings.map(doc => 
            cosineSimilarity(queryEmbedding, doc)
        );

        // 5. Find the document with the highest score using Math.max()
        const highestScore = Math.max(...scores);
        const bestMatchIndex = scores.indexOf(highestScore);

        // 6. Print the results
        console.log("Query:", query);
        console.log("Most Similar Document:", documents[bestMatchIndex]);
        console.log("Similarity Score:", highestScore);
        
    } catch (error) {
        console.error("\n An error occurred:", error.message);
    }
}
SimilarDocument();
