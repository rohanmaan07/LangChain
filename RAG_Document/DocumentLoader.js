import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function run() {
  const loader = new DirectoryLoader(
    "./RAG/books",
    {
      ".pdf": (path) => new PDFLoader(path), // har .pdf file ke liye PDFLoader
    },
    true // recursive search enable karna ho to true, warna false
  );

  const docs = await loader.load();
  console.log(docs.length);

  docs.forEach((doc, idx) => {
    console.log(`📄 Document ${idx + 1} Metadata:`, doc.metadata);
  });
}

run();
