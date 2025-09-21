import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const toolSchema = z.object({
  a: z.number().describe("The first number"),
  b: z.number().describe("The second number"),
});


const add = new DynamicStructuredTool({
  name: "add",
  description: "Add two numbers",
  schema: toolSchema,
  func: async ({ a, b }) => {
    return (a + b).toString();
  },
});

const multiply = new DynamicStructuredTool({
  name: "multiply",
  description: "Multiply two numbers",
  schema: toolSchema,
  func: async ({ a, b }) => {
    return (a * b).toString();
  },
});
class MathToolkit {
  get_tools() {
    return [add, multiply];
  }
}
const toolkit = new MathToolkit();
const tools = toolkit.get_tools();

for (const tool of tools) {
  console.log(`${tool.name} => ${tool.description}`);
}

