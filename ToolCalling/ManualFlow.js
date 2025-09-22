import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

// --- Tools ---
const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Fetch conversion rate between two currencies",
  schema: z.object({
    base_currency: z.string().length(3),
    target_currency: z.string().length(3),
  }),
  func: async ({ base_currency, target_currency }) => {
    const apiKey = "c754eab14ffab33112e380ca"; // Free API key
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base_currency}/${target_currency}`;
    const res = await fetch(url);
    const data = await res.json();
    return JSON.stringify(data);
  },
});

const convertCurrency = new DynamicStructuredTool({
  name: "convert",
  description: "Convert base currency to target currency",
  schema: z.object({
    base_currency_value: z.number(),
    conversion_rate: z.number(),
  }),
  func: async ({ base_currency_value, conversion_rate }) =>
    (base_currency_value * conversion_rate).toFixed(2),
});

// --- Manual Flow ---
async function manualFlow() {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash-latest",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const tools = [getConversionFactor, convertCurrency];
  const llmWithTools = llm.bindTools(tools);

  const messages = [
    new HumanMessage("What is the conversion factor between INR and USD, and convert 10 INR to USD?"),
  ];

  // Step 1 → LLM asks for tool
  let aiResponse = await llmWithTools.invoke(messages);
  messages.push(aiResponse);

  // Step 2 → Execute first tool (conversion rate)
  let conversionRate = null;
  for (const call of aiResponse.tool_calls) {
    const result = await getConversionFactor.invoke(call.args);
    const parsed = JSON.parse(result);
    conversionRate = parsed.conversion_rate;
    messages.push(new ToolMessage({ content: result, tool_call_id: call.id }));
  }

  // Step 3 → LLM decides next tool
  aiResponse = await llmWithTools.invoke(messages);
  messages.push(aiResponse);

  // Step 4 → Execute convert tool
  for (const call of aiResponse.tool_calls) {
    const result = await convertCurrency.invoke({
      ...call.args,
      conversion_rate: conversionRate,
    });
    messages.push(new ToolMessage({ content: result, tool_call_id: call.id }));
  }

  // Step 5 → Final natural language response
  const finalResponse = await llmWithTools.invoke(messages);
  console.log("✅ Final Answer:", finalResponse.content);
}

manualFlow().catch(console.error);
