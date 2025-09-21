import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const MultiplyInput = z.object({
  a: z.number().describe("The first number to multiply"),
  b: z.number().describe("The second number to multiply"),
});

async function multiplyFunc({ a, b }) {
  const result = a * b;
  return result.toString();
}

const multiplyTool = new DynamicStructuredTool({
  name: "multiply",
  description:
    "Multiply two numbers. For example, to multiply 5 and 8, the input should be {'a': 5, 'b': 8}",
  schema: MultiplyInput,
  func: multiplyFunc,
});

const result = await multiplyTool.invoke({ a: 3, b: 4 });
console.log("Result:", result); 
console.log("Name:", multiplyTool.name);
console.log("Description:", multiplyTool.description);
console.log("Schema shape:", multiplyTool.schema.shape);
