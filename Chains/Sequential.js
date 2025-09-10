import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";


const model= new ChatGoogleGenerativeAI({
    apiKey:process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
})

const prompt1=new PromptTemplate({
    template:"Write a detailed summary on {topic}",
    inputVariables:["topic"]
})

const prompt2=new PromptTemplate({
    template:"Write a 3 main point  about this. {text}",
    inputVariables:["text"]
})

const parse=new StringOutputParser();
const chain=prompt1.pipe(model).pipe(parse).pipe((o)=>prompt2.format({text:o})).pipe(model).pipe(parse);

const run=async()=>{
    const res=await chain.invoke({topic:"msd"});
    console.log(res);
}
run();