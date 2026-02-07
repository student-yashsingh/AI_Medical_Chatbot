// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import Groq from "groq-sdk";
// import { execSync } from "child_process";

// dotenv.config();

// const app = express();

// /*  CORS */
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//   })
// );

// app.use(express.json());

// /*  Groq Client */
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// /*  Test Route */
// app.get("/", (req, res) => {
//   res.send(" Medical RAG Chatbot Backend is Running!");
// });

// /*  Chat Route */
// app.post("/chat", async (req, res) => {
//   const userMessage = req.body.message;

//   try {
//     console.log("\n User:", userMessage);

//     /* STEP 1: Get Context from Python */
//     const context = execSync(
//       `python3 ../rag_engine/context.py "${userMessage}"`,
//       { encoding: "utf-8" }
//     );

//     console.log(" Context Loaded");

//     /* STEP 2: Groq Response */
//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile", //  UPDATED MODEL
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a safe AI medical assistant.

// RULES:
// - Answer ONLY using the provided medical context.
// - Do NOT diagnose diseases.
// - Do NOT prescribe medicines.
// - Always recommend consulting a doctor.

// Medical Context:
// ${context}
//           `,
//         },
//         {
//           role: "user",
//           content: userMessage,
//         },
//       ],
//     });

//     res.json({
//       reply: response.choices[0].message.content,
//     });
//   } catch (err) {
//     console.error("Error:", err.message);

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });

// /*  Start Server */
// app.listen(8000, () => {
//   console.log(" Backend running at http://localhost:8000");
// });
// ``


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
  res.send(" Medical RAG Chatbot Backend is Running!");
});


app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({
      error: "Message is required!",
    });
  }

  try {
    console.log("\n==============================");
    console.log("User Question:", userMessage);




    const contextPath = path.join(__dirname, "../rag_engine/context.py");

    const context = execSync(`python3 ${contextPath} "${userMessage}"`, {
      encoding: "utf-8",
    });

    console.log(" Context Retrieved Successfully!");

  
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a safe AI medical assistant chatbot.

RULES:
- Answer ONLY using the provided context.
- Do NOT diagnose diseases.
- Do NOT prescribe medicines.
- Always recommend consulting a certified doctor.

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

    console.log(" Groq Response Generated!");


    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("\n ERROR OCCURRED!");
    console.error("🔥", err.message);

    res.status(500).json({
      error: "Server Error: " + err.message,
    });
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(` Backend running at http://localhost:${PORT}`);
});
