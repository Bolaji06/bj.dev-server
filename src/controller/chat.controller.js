
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import model from "../lib/model.js";
import { StringOutputParser } from "@langchain/core/output_parsers"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getChat(req, res){
    const { system, message } = req.body;

    const messages = [
        new SystemMessage(system),
        new HumanMessage(message)
    ]

    try{
        // const parser = new StringOutputParser();
        // const response = await model.invoke(messages)
        // const result = await parser.invoke(response)

        const parser = new StringOutputParser();
        const chain = model.pipe(parser);
        const result = await chain.invoke(messages)

      


        return res.status(200).json({ success: true, result, });

    }catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: 'internal server error' })
    }
}


import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import "@tensorflow/tfjs-backend-cpu";
import { TensorFlowEmbeddings } from "@langchain/community/embeddings/tensorflow"


/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function RAGChat(req, res){

    const documentLink = "https://bjdev.vercel.app/blog/getting-started-with-ai-development-my-journey-with-embeddings-and-vector-databases-588g";

    const loader = new CheerioWebBaseLoader(documentLink); // (1) Load the document from using cheerio
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    try{
        const docs = await loader.load()
        const splits = await textSplitter.splitText(docs);
        const vectorStore = await MemoryVectorStore.fromDocuments(
            splits,
            new TensorFlowEmbeddings() 
        ) 
        

    }catch(error){

    }
}