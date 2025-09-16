import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

async function run() {
  const tool = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
  });
  const result = await tool.invoke("the geopolitical history of India and Pakistan from the perspective of a Chinese");
  console.log("Wikipedia Result:\n", result);
}

run().catch(console.error);
