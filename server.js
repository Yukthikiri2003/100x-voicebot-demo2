const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a friendly voice assistant." },
        { role: "user", content: prompt }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "OpenAI Error" });
  }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
