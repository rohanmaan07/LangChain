import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as dotenv from "dotenv";
dotenv.config();

const model=new ChatGoogleGenerativeAI({
    model:"gemini-1.5-flash",
    apiKey:process.env.GEMINI_API_KEY,
})
const main=async()=>{
    const result=await model.invoke("hello,What is the capital of india..");
    console.log(result.content);
}
main();