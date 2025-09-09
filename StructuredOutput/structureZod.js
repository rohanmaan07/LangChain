import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const ReviewSchema = z.object({
  key_themes: z.array(z.string()),
  summary: z.string(),
  sentiment: z.enum(["pos", "neg", "neutral"]),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  name: z.string().optional(),
});

 const structured=model.withStructuredOutput(ReviewSchema);

async function main() {
  const reveiw = `
    I recently upgraded to the Samsung Galaxy S24 Ultra, and I must say, it’s an absolute powerhouse! 
The Snapdragon 8 Gen 3 processor makes everything lightning fast—whether I’m gaming, multitasking, or editing photos. 
The 5000mAh battery easily lasts a full day even with heavy use, and the 45W fast charging is a lifesaver.

The S-Pen integration is a great touch for note-taking and quick sketches, though I don't use it often. 
What really blew me away is the 200MP camera—the night mode is stunning, capturing crisp, vibrant images even in low light. 
Zooming up to 100x actually works well for distant objects, but anything beyond 30x loses quality.

However, the weight and size make it a bit uncomfortable for one-handed use. 
Also, Samsung’s One UI still comes with bloatware—why do I need five different Samsung apps for things Google already provides? 
The $1,300 price tag is also a hard pill to swallow.

Pros:
Insanely powerful processor (great for gaming and productivity)
Stunning 200MP camera with incredible zoom capabilities
Long battery life with fast charging
S-Pen support is unique and useful

Review by Rohan Mandal
    `;

    const res= await structured.invoke(reveiw);
    console.log(res);
    console.log(res.name);
   

}
main();