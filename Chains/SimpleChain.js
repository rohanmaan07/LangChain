import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";

const model= new ChatGoogleGenerativeAI({
    apiKey:process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
})

const prompt=new PromptTemplate({
    template:"Write a 3 facts about {topic}",
    inputVariables:["topic"]
})

const parse=new StringOutputParser();
const chain= prompt.pipe(model).pipe(parse);

const run=async()=>{
    const res=await chain.invoke({topic:"MS Dhoni"});
    console.log(res);
}
run();