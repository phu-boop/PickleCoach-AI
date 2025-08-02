import React, { useState, useRef, useEffect } from "react";
import "./chatbox.css";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Giả lập phản hồi bot (bạn có thể thay bằng API thực tế)
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: "Cảm ơn bạn đã nhắn! Chúng tôi sẽ phản hồi sớm." }
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={`chatbox-container${open ? " open" : ""}`}>
      {open ? (
        <div className="chatbox-window">
          <div className="chatbox-header">
            <div className="chatbox-header-info">
              <img
                src="https://ui-avatars.com/api/?name=AI&background=1976d2&color=fff"
                alt="Bot"
                className="chatbox-avatar"
              />
              <span className="chatbox-title">Hỗ trợ AI</span>
            </div>
            <button className="chatbox-close" onClick={() => setOpen(false)} title="Thu nhỏ">×</button>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbox-message ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbox-send"
              onClick={handleSend}
              disabled={input.trim() === ""}
              title="Gửi"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbox-toggle" onClick={() => setOpen(true)} title="Chat với AI">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#1976d2"/>
            <path d="M7 17V15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V17" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="10" r="1" fill="#fff"/>
            <circle cx="15" cy="10" r="1" fill="#fff"/>
          </svg>
        </button>
      )}
    </div>
  );
}