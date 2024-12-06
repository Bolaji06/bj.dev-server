import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import fs from "fs/promises";
import path from "path";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import embeddingModel from "../lib/embeddingModel.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import model from "../lib/model.js";
//import { Document } from "@langchain/core/documents";
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function myProfile(req, res) {
  const { query } = req.body;

  const profilePdfPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "profile.pdf"
  );

  const buffer = await fs.readFile(profilePdfPath);

  // Create a Blob from the buffer
  const profileBlob = new Blob([buffer], { type: "application/pdf" });

  // Document loader for loading data from PDF
  const loader = new WebPDFLoader(profileBlob, {
    parsedItemSeparator: "", // handle extra white-space in the document
  });
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  try {
    // load the document
    const docs = await loader.load();
    // split / chunk document
    const splits = await textSplitter.splitDocuments(docs);

    // embed and store the chunked documents into vector database using an embedding model
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddingModel
    );

    const retriever = vectorStore.asRetriever();
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are an assistant for question-answering tasks related to Bolaji Bolajoko profile information. Use the following pieces of retrieved context to answer the question. 
        If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
  
        Question: {question}
        Context: {context}`
    );

    const llm = model;
    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });
    // retrieve the query (question) from the vector store
    const retrievedDocs = await retriever.invoke(query);

    // generate message from the prompts
    const message = await ragChain.invoke({
      question: query, // "What's are his past experience?",
      context: retrievedDocs,
    });

    return res.status(200).json({ success: true, message: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
