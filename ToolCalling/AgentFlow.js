import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { pull } from "langchain/hub";
dotenv.config();

// ---  Tool Creation ---
const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Fetches the currency conversion factor between a base currency and a target currency.",
  schema: z.object({
    base_currency: z.string().length(3).describe("3-letter base currency code (e.g., USD)"),
    target_currency: z.string().length(3).describe("3-letter target currency code (e.g., INR)"),
  }),
  func: async ({ base_currency, target_currency }) => {
    const apiKey = "c754eab14ffab33112e380ca"; 
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base_currency}/${target_currency}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
      const data = await response.json();
      if (data.result === "error") throw new Error(`API Error: ${data["error-type"]}`);
      return JSON.stringify(data);
    } catch (error) {
      return `Error fetching conversion factor: ${error.message}`;
    }
  },
});

const convertCurrency = new DynamicStructuredTool({
  name: "convert",
  description: "Calculates target currency value using base amount and conversion rate.",
  schema: z.object({
    base_currency_value: z.number().describe("The amount of base currency."),
    conversion_rate: z.number().describe("Rate obtained from get_conversion_factor."),
  }),
  func: async ({ base_currency_value, conversion_rate }) =>
    (base_currency_value * conversion_rate).toString(),
});

async function agentFlow() {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash-latest",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const tools = [getConversionFactor, convertCurrency];

  console.log("\n--- AGENT EXECUTOR ---\n");

  const agentPrompt = await pull("hwchase17/structured-chat-agent");

  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt: agentPrompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const agentResponse = await agentExecutor.invoke({
    input: "What is the conversion factor between INR and USD, and based on that can you convert 10 USD to INR?",
    chat_history: [],
  });

  console.log("Agent's Final Answer:", agentResponse.output);
}

agentFlow().catch(console.error);
