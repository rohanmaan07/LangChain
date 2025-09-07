import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";


const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const messages = [
  new SystemMessage("You are a helpful assistant."),
];

export async function askBot(userInput) {
  messages.push(new HumanMessage(userInput));
  const result = await model.invoke(messages);

  messages.push(new AIMessage(result.content));
// console.log(messages.content)
  return result.content;
}
