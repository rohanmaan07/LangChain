import { SerpAPI } from "@langchain/community/tools/serpapi";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const searchTool = new SerpAPI(process.env.SERP_API_KEY);
  const results = await searchTool.invoke("current weather in gurgaon");
  console.log("--- Search Results ---", results);
}

run();
