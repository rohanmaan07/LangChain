import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `
# Project Name: Smart Student Tracker

A simple Python-based project to manage and track student data, including their grades, age, and academic status.

## Features

- Add new students with relevant info
- View student details
- Check if a student is passing
- Easily extendable class-based design

## 🛠 Tech Stack

-js 3.10+
- No external dependencies

## Getting Started

1. Clone the repo  
   \`\`\`bash
   git clone https://github.com/your-username/student-tracker.git
`;

async function run() {
  // Initialize the splitter (Markdown mode)
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 175,
    chunkOverlap: 0,
  });

  // Perform the split
  const chunks = await splitter.splitText(text);

  console.log("Total chunks:", chunks.length);
  console.log("First chunk:", chunks);
}

run();
