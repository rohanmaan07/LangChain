import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const run = async () => {
  // 1. Load PDF
  const loader = new PDFLoader("./RAG/curriculum.pdf", {
    splitPages: true, // default true -> har page alag document banega
  });

  const docs = await loader.load();

  console.log("Total Pages:", docs.length);
  console.log("\nFirst Page Content:\n", docs[0].pageContent);
  console.log("\nSecond Page Metadata:\n", docs[1].metadata);
};

run();
