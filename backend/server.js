import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { execSync } from "child_process";

dotenv.config();

const app = express();
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    })
  );
  
  app.use(express.json());
  app.options("*", cors());
  

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
app.get("/", (req, res) => {
    res.send("✅ Medical RAG Chatbot Backend is Running!");
  });
  
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // 🔍 STEP 1: Retrieve context from FAISS (Python)
    const context = execSync(
      `python3 rag_engine/context.py "${userMessage}"`,
      { encoding: "utf-8" }
    );

    // 🧠 STEP 2: Send context + query to Groq
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `
You are a safe medical assistant chatbot.
You MUST answer only using the provided medical context.
Do NOT diagnose diseases.
Do NOT prescribe medicines.
Always advise consulting a doctor.

Medical Context:
${context}
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
