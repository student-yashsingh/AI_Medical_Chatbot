import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { execSync } from "child_process";

dotenv.config();

const app = express();

/* ✅ CORS */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("✅ Medical RAG Chatbot Backend is Running!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const context = execSync(
      `python3 ../rag_engine/context.py "${userMessage}"`,
      { encoding: "utf-8" }
    );

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `
You are a safe AI medical assistant.

Answer ONLY from the context below.
Do NOT diagnose or prescribe.

Context:
${context}
          `,
        },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
