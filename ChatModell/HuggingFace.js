import { HuggingFaceInference } from "@langchain/community/llms/hf";
import * as dotenv from "dotenv";
dotenv.config();

const model = new HuggingFaceInference({
  model: "google/flan-t5-small",
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,      
 
});

async function run() {
  const res = await model.invoke("what is the capital of india??");
  console.log("👉 Output:\n", res);
}

run();
