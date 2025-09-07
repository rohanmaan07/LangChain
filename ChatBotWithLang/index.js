import inquirer from "inquirer";
import { askBot } from "./chatbotwithHumanAi.js";//chhote chatbot application ke lie
// import { askBot } from "./chatbot.js";//bade chatbot application ke lie

async function runChat() {
  console.log(" Chatbot started! (type 'exit' to quit)\n");

  while (true) {
    const { userInput } = await inquirer.prompt([
      {
        type: "input",
        name: "userInput",
        message: "You:",
      },
    ]);

    if (userInput.toLowerCase() === "exit") {
      console.log("Chatbot: Bye ");
      break;
    }

    const response = await askBot(userInput);
    console.log("Chatbot:", response, "\n");
  }
}

runChat();
