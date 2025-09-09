import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";


const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


const jsonSchema = {
  title: "Review",
  type: "object",
  properties: {
    key_themes: {
      type: "array",
      items: { type: "string" },
      description: "Write down all the key themes discussed in the review",
    },
    summary: {
      type: "string",
      description: "A brief summary of the review",
    },
    sentiment: {
      type: "string",
      enum: ["pos", "neg", "neutral"],
      description: "Sentiment of the review",
    },
    pros: {
      type: "array",
      items: { type: "string" },
      description: "List of pros",
      nullable: true, 
    },
    cons: {
      type: "array",
      items: { type: "string" },
      description: "List of cons",
      nullable: true,
    },
    name: {
      type: "string",
      description: "Name of reviewer",
      nullable: true,
    },
  },
  required: ["key_themes", "summary", "sentiment"],
};

const structuredModel = model.withStructuredOutput(jsonSchema);

async function run() {
  const reviewText = `
I recently upgraded to the Samsung Galaxy S24 Ultra... 
Pros:
Insanely powerful processor
Stunning 200MP camera
Long battery life
S-Pen support

Review by Rohan mandal
`;

  const result = await structuredModel.invoke(reviewText);

  console.log("Full Result:", result);
  console.log("Reviewer Name:", result.name);
}

run();
