import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import fs from "fs/promises";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import embeddingModel from "../lib/embeddingModel.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import model from "../lib/model.js";

/**
 * Handles profile queries with RAG and streams responses via SSE.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function myProfile(req, res) {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(
      `data: ${JSON.stringify({
        success: false,
        message: "Invalid or missing query",
      })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();

    return;
  }

  const profilePdfPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "resume.pdf"
  );

  try {
    const buffer = await fs.readFile(profilePdfPath);
    const profileBlob = new Blob([buffer], { type: "application/pdf" });
    const loader = new WebPDFLoader(profileBlob, { parsedItemSeparator: "" });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await loader.load();

    const splits = await textSplitter.splitDocuments(docs);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddingModel
    );

    const retriever = vectorStore.asRetriever();
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are an assistant for question-answering tasks related to Bolaji Bolajoko's profile information.

      The response should be in markdown format

       Use the following pieces of retrieved context to answer the question.

        If the user asks about Bolaji's projects, provide a concise summary and include a direct link to the [Project page](https://bjdev.vercel.app/project).

        If the user inquires about Bolaji's background or profile, summarize briefly and include the link to the [About page](https://bjdev.vercel.app/about).

        For queries about Bolaji's articles or writings, provide a short description and link to the [Articles Page](https://bjdev.vercel.app/blog).

        If the answer isn't available, say, "I don’t know," and provide no link.

        Use three sentences maximum and keep the answers concise and professional.

        Question: {question}
        Context: {context}`
    );

    const llm = model;
    const ragChain = await createStuffDocumentsChain({ llm, prompt });

    const retrievedDocs = await retriever.invoke(query);

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Start keep-alive
    const keepAlive = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 15000);

    // Stream the response
    const stream = await ragChain.stream({
      question: query,
      context: retrievedDocs,
    });

    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;

      res.write(
        `data: ${JSON.stringify({ success: true, message: chunk })}\n\n`
      );
    }

    clearInterval(keepAlive); // Stop keep-alive
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(
      `data: ${JSON.stringify({
        success: false,
        message: `Internal server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      })}\n\n`
    );
    clearInterval(keepAlive); // Stop keep-alive
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

/**
 * Handles GET requests for profile queries, reusing myProfile logic.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getMyProfile(req, res) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(
      `data: ${JSON.stringify({
        success: false,
        message: "Invalid or missing query",
      })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();

    return;
  }

  try {
    await myProfile({ body: { query } }, res);
  } catch (error) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(
      `data: ${JSON.stringify({
        success: false,
        message: `Internal server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
