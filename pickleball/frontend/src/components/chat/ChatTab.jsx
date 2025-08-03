import React from "react";

export default function ChatTab() {
  return (
    <div className="chatbox2-tab-content chat">
      <h2>Chat với AI</h2>
      <div className="chatbox2-messages">
        <div className="chatbox2-message bot">Xin chào! Tôi là trợ lý AI Pickleball.</div>
        <div className="chatbox2-message user">Chào bot!</div>
      </div>
      <div className="chatbox2-input">
        <input type="text" placeholder="Nhập tin nhắn..." />
        <button>Gửi</button>
      </div>
    </div>
  );
} 