import axios from "axios";
import ChatSession from "../models/ChatSession.js";

// Define fallback models in order
const models = [
  "openai/gpt-3.5-turbo",
  "mistralai/mistral-7b-instruct",
  "google/gemma-7b-it",
  "gryphe/mythomax-l2-13b"
];

// AI call with fallback mechanism
const callAIWithFallback = async (messages) => {
  for (let model of models) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000 // 10 seconds timeout
        }
      );
      const reply = response.data.choices[0].message.content.trim();
      return { reply, model };
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.response?.data?.error?.message || err.message);
    }
  }
  throw new Error("All AI models failed.");
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required." });
    }

    // 🔍 1. Find or create session
    let session = await ChatSession.findOne({ user: userId });
    if (!session) {
      session = await ChatSession.create({ user: userId, messages: [] });
    }

    // 🧠 2. Prepare full history with current message
    const aiMessages = [
      ...session.messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ];

    // ⚙️ 3. Call AI with fallback
    const { reply, model } = await callAIWithFallback(aiMessages);

    // 💾 4. Save message and reply
    const timestamp = new Date();
    session.messages.push(
      { role: "user", content: message, timestamp },
      { role: "assistant", content: reply, timestamp }
    );
    session.updatedAt = timestamp;
    await session.save();

    res.status(200).json({ reply, modelUsed: model, messages: session.messages });

  } catch (err) {
    console.error("Chatbot Error:", err.message);
    res.status(500).json({ message: "AI is not responding. Please try again shortly." });
  }
};
