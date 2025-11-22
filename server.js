// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

const app = express();
app.use(express.json());
app.use(cors());

// Get the directory name (needed for deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// OPENAI SETUP — READ API KEY FROM RENDER ENV VARIABLE
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // <--- REQUIRED FOR RENDER DEPLOYMENT
});

// API Endpoint
app.post('/api/ask', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Yuktha K Iyer answering interview questions clearly and confidently. Keep your replies short and meaningful." },
        { role: "user", content: message }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// Use Render’s PORT or default to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
