import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";


const model= new ChatGoogleGenerativeAI({
    apiKey:process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
})

const template1=new PromptTemplate({
    template:"write a report on topic..{topic}",
    inputVariables:["topic"]
})

const template2=new PromptTemplate({
    template:"write a 3 line summary. {text}",
    inputVariables:["text"]
})

const parse=new StringOutputParser();
const chain=template1.pipe(model).pipe(parse).pipe((o)=>template2.format({text:o})).pipe(model).pipe(parse);

async function run() {
    const res= await chain.invoke({topic:"Coding"});
    console.log(res);
}
run();