import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const MultiplyInput = z.object({
  a: z.number().describe("The first number to multiply"),
  b: z.number().describe("The second number to multiply"),
});

class MultiplyTool extends StructuredTool {
  name = "multiply";
  description = "Multiply two numbers";
  schema = MultiplyInput;

  async _call({ a, b }) {
    return (a * b).toString();
  }
}

const multiplyTool = new MultiplyTool();

const result = await multiplyTool.invoke({ a: 3, b: 3 });

console.log("Result:", result);
console.log("Name:", multiplyTool.name);
console.log("Description:", multiplyTool.description);
console.log("Schema shape:", multiplyTool.schema.shape);
