import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import model from "../lib/model.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getChat(req, res) {
  const { system, message } = req.body;

  const messages = [new SystemMessage(system), new HumanMessage(message)];

  try {
    // const parser = new StringOutputParser();
    // const response = await model.invoke(messages)
    // const result = await parser.invoke(response)

    const parser = new StringOutputParser();
    const chain = model.pipe(parser);
    const result = await chain.invoke(messages);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import embeddingModel from "../lib/embeddingModel.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function RAGChat(req, res) {
  const documentLink =
    "https://bjdev.vercel.app/blog/getting-started-with-ai-development-my-journey-with-embeddings-and-vector-databases-588g/";

  const loader = new CheerioWebBaseLoader(documentLink); // Load the document from using cheerio
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  try {
    const docs = await loader.load(); // Extracts the text contents from the document

    const splits = await textSplitter.splitDocuments(docs);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddingModel
    );

    const retriever = vectorStore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(
      `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. 
      If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.

      Question: {question}
      Context: {context}`
    );
    const llm = model;

    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const retrievedDocs = await retriever.invoke("What are embedding?");
    const message = await ragChain.invoke({
      question: "What are embeddings?",
      context: retrievedDocs,
    });

    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
