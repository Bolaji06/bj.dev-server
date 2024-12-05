
import path from "path"
import fs from "fs/promises"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import embeddingModel from "../lib/embeddingModel.js";
export async function chatAI(){
    const filePath = path.join(
        process.cwd(),
        "profile.pdf"
    );
    const buffer = await fs.readFile(filePath);
    const bufferBlob = new Blob([buffer], { type: "application/pdf"})
    const loader = new WebPDFLoader(bufferBlob, {
        parsedItemSeparator: "",
    });

    const docs = await loader.load();
    //console.log(docs[0].pageContent.length);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs)
    const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        embeddingModel
    );
    const retriever = vectorStore.asRetriever({
        k: 2,
        searchType: "similarity"
    });
    const retrievedDocument = await retriever.invoke("Who's Bolaji Bolajoko");
    console.log(retrievedDocument)
}
chatAI().then(data => data);