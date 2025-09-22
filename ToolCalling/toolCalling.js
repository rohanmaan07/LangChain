import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  //  Tool Create (ye tool hai jo kaam karega)
  const multiply = new DynamicStructuredTool({
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    func: async ({ a, b }) => (a * b).toString(),
  });

  //  LLM init + Tool Binding (LLM ko tool ke sath jod diya)
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }).bindTools([multiply]); // Tool Binding

  const messages = [new HumanMessage("Can you multiply 3 with 1000?")];
  
  // Yaha LLM user ke message ko padhega aur decide karega ki kaunsa tool call karna hai
  let result = await llm.invoke(messages);
  // console.log(result)
  
  //  Tool Calling (LLM bolta hai ki "multiply" tool ko chalana hai with args)
  const toolCall = result.tool_calls[0];
  
  //  Tool Execution (yaha actual function run hota hai → multiply(3,1000))
  const toolResult = await multiply.invoke(toolCall.args);

  //  Conversation me Tool ka result wapas bhejna
  messages.push(
    result, 
    new ToolMessage({
      content: toolResult,
      tool_call_id: toolCall.id,
    })
  );

  //  Final Answer (ab LLM user ko natural language me result dega)
  result = await llm.invoke(messages);
  console.log("Final Answer:", result.content);
}

main().catch(console.error);
