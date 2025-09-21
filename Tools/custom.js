import { tool } from "@langchain/core/tools";
import { z } from "zod";

const multiply = tool(
  async ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
  }
);
const result = await multiply.invoke({ a: 3, b: 5 });
console.log("------------------Result------------",result);               
console.log("------------------Multiply Name------",multiply.name);        
console.log("------------------Multiply Desc------",multiply.description); 
console.log("------------------Multiply Schema------",multiply.schema);      
