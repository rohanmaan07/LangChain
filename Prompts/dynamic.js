import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const template = new PromptTemplate({
  inputVariables: ["topic", "audience", "length"],
  template: "Explain {topic} to a {audience} in {length} detail.",
});

async function run() {
  const inputs = [
    { topic: "Black Holes", audience: "10-year-old kid", length: "short" },
    { topic: "Neural Networks", audience: "software engineer", length: "medium" },
    { topic: "Quantum Computing", audience: "PhD student", length: "long" },
  ];

  const index = 1; // yha hum apne choices daal skte jo hume use krna hai baaki asli dynamic tb hoga jb hum ui lgayengee..
  const inp = inputs[index];

  const prompt = await template.format(inp);
  const result = await model.invoke(prompt);

  console.log("\n Input:", inp);
  console.log(" Output:", result.content);
}

run();
