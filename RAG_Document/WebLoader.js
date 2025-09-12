import "dotenv/config";
import fetch from "node-fetch"; 
import { load } from "cheerio"; 
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

async function main() {
  const url = "https://www.amazon.in/OnePlus-Wireless-Earbuds-Drivers-Playback/dp/B0C8JB3G5W/ref=sr_1_1?sr=8-1";

  const res = await fetch(url);
  const html = await res.text();

  const $ = load(html);
  const text = $("body").text(); // pure page ka text

 const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.1-8b-instant",      
});


  const prompt = new PromptTemplate({
    template: "Answer the following question \n{question} from the following text - \n{text}",
    inputVariables: ["question", "text"],
  });

  const input = {
    question: "What is the product that we are talking about?",
    text,
  };

  const formattedPrompt = await prompt.format(input);
  const response = await model.invoke(formattedPrompt);

  console.log("Groq Response:", response.content);
}

main();
