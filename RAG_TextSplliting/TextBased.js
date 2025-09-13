import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `
Space exploration has led to incredible scientific discoveries. From landing on the Moon to exploring Mars, humanity continues to push the boundaries of what’s possible beyond our planet.

These missions have not only expanded our knowledge of the universe but have also contributed to advancements in technology here on Earth. Satellite communications, GPS, and even certain medical imaging techniques trace their roots back to innovations driven by space programs.
`;

async function run() {
  // Initialize splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 0,
  });

  // Perform the split
  const chunks = await splitter.splitText(text);

  console.log("Total chunks:", chunks.length);
  console.log(chunks);
}

run();
