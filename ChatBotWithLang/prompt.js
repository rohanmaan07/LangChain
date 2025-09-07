import { PromptTemplate } from "@langchain/core/prompts";

export const chatbotTemplate = new PromptTemplate({
  inputVariables: ["question", "history"],
  template: `
  You are a friendly AI chatbot.
  Answer the following question in simple, easy-to-understand language:
  This is the conversation so far:
{history}
  Question: {question}
  `,
});
