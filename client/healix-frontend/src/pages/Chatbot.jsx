import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/Api";
import useUserStore from "../store/useUserStore";
import robot from "../assets/robot.gif"
import Ailogo from "../assets/ai.gif";
import PopSound from "../assets/pop.wav";



export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
 const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/chatbot");
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching chat history", err);
      }
    };
    fetchHistory();
  }, []);


// Scroll to bottom when messages change
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth", // smooth scroll instead of instant
    });
  }
}, [messages]);




  const playPopSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    playPopSound();
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/chatbot",
        { message: userMsg.content },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiMsg = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      playPopSound();
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <audio ref={audioRef} src={PopSound} preload="auto"></audio>

      <div className="chatbot-container">
        {/* Small logo on left edge */}
        <img src={robot} alt="Logo" className="chatbot-logo" />

        {/* Header */}
        <div className="chatbot-header">🩺 AI Health Assistant</div>

        {/* Messages */}
        <div ref={chatContainerRef} className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-row ${msg.role === "user" ? "user" : "assistant"}`}
            >
              {msg.role === "assistant" && (
                <img src={Ailogo} alt="AI" className="avatar" />
              )}
              <div className="message-bubble">{msg.content}</div>
              {msg.role === "user" && (
                <img src={user&& user.avatar} alt="User" className="avatar" />
              )}
            </div>
          ))}

          {loading && (
            <div className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          .chatbot-page {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 50px;
            margin-top: 100px;
           
          }

          .chatbot-container {
            position: relative;
          margin bootom: 50px;
           
            width: 600px;
            height: 500px;
            background: white;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
             overflow: visible;
            box-shadow: 0px 8px 25px rgba(0,0,0,0.3);
            animation: fadeInUp 0.5s ease-out;
          }

          .chatbot-logo {
            position: absolute;
            top: -40px;
            left: -40px;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            background: white;
          }

          .chatbot-header {
            background: white;
            padding: 15px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            letter-spacing: 1px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: white;
          }

          .message-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 10px;
            animation: slideIn 0.3s ease-in-out;
          }

          .message-row.user {
            justify-content: flex-end;
          }

          .message-row.assistant {
            justify-content: flex-start;
          }

          .avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            margin: 0 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }

          .message-bubble {
            padding: 10px 14px;
            border-radius: 10px;
            max-width: 70%;
            word-wrap: break-word;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          }

          .user .message-bubble {
            background: linear-gradient(90deg, #14b8a6, #0d9488);
           
            color: white;
          }

          .assistant .message-bubble {
       background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;
          }

          .typing-dots {
            display: flex;
            gap: 4px;
            padding: 5px;
          }

          .dot {
            height: 8px;
            width: 8px;
            background-color: teal;
            border-radius: 50%;
            display: inline-block;
            animation: blink 1.4s infinite both;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes blink {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }

          @keyframes slideIn {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .chatbot-input {
            display: flex;
            padding: 10px;
            border-top: 1px solid #ccc;
            background: white;
          }

          .chatbot-input input {
            flex: 1;
            padding: 10px;
            border: none;
            outline: none;
            font-size: 14px;
            background: #f5f5f5;
            border-radius: 8px;
          }

          .chatbot-input button {
            background: linear-gradient(90deg, #14b8a6, #0d9488);
            color: white;
            border: none;
            padding: 10px 14px;
            border-radius: 8px;
            margin-left: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
          }

          .chatbot-input button:active {
            transform: scale(0.95);
          }

          @media (max-width: 487px) {
            .chatbot-logo {
             left: -20px; 
             width: 65px;
                height: 65px;
            }
        `}

        
      </style>
    </div>
  );
}
