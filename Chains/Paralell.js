import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

dotenv.config();

const model1 = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
});

const model2 = new ChatGroq({
  model:"meta-llama/llama-guard-4-12b",  
  apiKey: process.env.GROQ_API_KEYY,
});

// Step 2: Prompts
const prompt1 = new PromptTemplate({
  template: "Generate short and simple notes from the following text \n {text}",
  inputVariables: ["text"],
});

const prompt2 = new PromptTemplate({
  template: "Generate 5 short question answers from the following text \n {text}",
  inputVariables: ["text"],
});

const prompt3 = new PromptTemplate({
  template:
    "Merge the provided notes and quiz into a single document \n notes -> {notes} and quiz -> {quiz}",
  inputVariables: ["notes", "quiz"],
});

// Step 3: Parser
const parser = new StringOutputParser();

// Step 4: Parallel Chain (notes + quiz)
const parallelChain = RunnableParallel.from({
  notes: prompt1.pipe(model1).pipe(parser),
  quiz: prompt2.pipe(model2).pipe(parser),
});

// Step 5: Merge Chain
const mergeChain = prompt3.pipe(model1).pipe(parser);

// Step 6: Final Chain (Parallel -> Merge)
const chain = parallelChain.pipe(mergeChain);

// Step 7: Input text
const text = `
Support vector machines (SVMs) are a set of supervised learning methods used for classification, regression and outliers detection.

The advantages of support vector machines are:

Effective in high dimensional spaces.

Still effective in cases where number of dimensions is greater than the number of samples.

Uses a subset of training points in the decision function (called support vectors), so it is also memory efficient.

Versatile: different Kernel functions can be specified for the decision function. Common kernels are provided, but it is also possible to specify custom kernels.

The disadvantages of support vector machines include:

If the number of features is much greater than the number of samples, avoid over-fitting in choosing Kernel functions and regularization term is crucial.

SVMs do not directly provide probability estimates, these are calculated using an expensive five-fold cross-validation (see Scores and probabilities, below).

The support vector machines in scikit-learn support both dense (numpy.ndarray and convertible to that by numpy.asarray) and sparse (any scipy.sparse) sample vectors as input. However, to use an SVM to make predictions for sparse data, it must have been fit on such data. For optimal performance, use C-ordered numpy.ndarray (dense) or scipy.sparse.csr_matrix (sparse) with dtype=float64.
`;

// Step 8: Run chain
const result = await chain.invoke({ text });

console.log("Final Output:\n", result);

