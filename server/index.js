const express = require("express");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const cors = require("cors");
const { execSync } = require("child_process");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// Handle POST request
app.post("/chat", async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).send("Missing prompt query parameter");
  }

  try {
    const chatCompletion = await getGroqChatCompletion(prompt);
    res.send(chatCompletion.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error querying Groq AI:", error);
    res.status(500).send("Error querying Groq AI");
  }
});

// Version route
app.get("/version.json", (req, res) => {
  try {
    const version = execSync("git rev-parse --short HEAD").toString().trim();
    res.json({ version });
  } catch (error) {
    console.error("Error getting version:", error);
    res.status(500).send("Error getting version");
  }
});

// Healthcheck route
app.get("/healthcheck", (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is not defined" });
  }

  // Additional diagnostic checks can be added here
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
