
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
  apiKey: process.env.GOOGLE_KEY
});

export default embeddingModel;
