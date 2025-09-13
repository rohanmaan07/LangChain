import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function run() {
  const loader = new PDFLoader("RAG (Text Splliting)/example.pdf", {
    splitPages: true, // har page ek document banega
  });

  const docs = await loader.load();
  const splitter = new CharacterTextSplitter({
    chunkSize: 100,     
    chunkOverlap: 0,    // no overlap
    separator: " "       // split without any special separator
  });

  // 3. Split docs
  const result = await splitter.splitDocuments(docs);
  console.log(result[0].pageContent);
}
async function runn() {
  const loader = new PDFLoader("RAG (Text Splliting)/example.pdf", {
    splitPages: true, // har page ek document banega
  });

  const docs = await loader.load();
  const splitter = new CharacterTextSplitter({
    chunkSize: 100,     
    chunkOverlap: 0,    // no overlap
    separator: " "       // split without any special separator
  });

  // 3. Split docs
  const result = await splitter.splitDocuments(docs);
  console.log(result[0].pageContent);
}

run();
