require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  const prompt = `
You are Raju Sir, a friendly English teacher for Indian students.
User ne yeh bola: "${userMessage}"

Reply exact 3 lines:
1. Simple English
2. Hindi translation
3. Roman pronunciation
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    res.json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.json({ reply: "Sorry bhai, server thoda busy hai. Thodi der baad try karo!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BoloEnglish backend running on port ${PORT}`));
