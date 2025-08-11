import React, { useState, useRef } from "react";
import "./chatbox2.css";
import VideoAnalysisTab from "./VideoAnalysisTab";
import BotAvatar from '../../assets/images/Chat/8688154.jpg';
import IconAvatar from '../../assets/images/Chat/8567230.jpg';
import QuizTab from "./QuizTab";
import { FaPlus, FaGoogleDrive, FaMicrosoft, FaRegImage } from "react-icons/fa";
const TABS = [
  { key: "chat", label: "Chat" },
  { key: "video", label: "Phân tích Video" },
  { key: "quiz", label: "Quiz" },
  { key: "suggest", label: "Gợi ý" },
  { key: "history", label: "Lịch sử" },
];

// Danh sách model phổ biến của OpenRouter
const OPENROUTER_MODELS = [
  { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "openai/gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "google/gemini-pro", label: "Gemini Pro" },
  { value: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B" },
  { value: "mistralai/mixtral-8x7b", label: "Mixtral 8x7B" },
];

export default function ChatBox2() {
  const apiKey = import.meta.env.VITE_OPENAI_KEY;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi là trợ lý AI Pickleball." },
    // { from: "user", text: "Chào bot!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(OPENROUTER_MODELS[0].value);
  const [listening, setListening] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  // Voice logic
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = (event) => {
      alert("Lỗi nhận diện giọng nói: " + event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Hàm gọi API OpenRouter
  const callChatbotAPI = async (userMessage) => {
    setLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "PickleCoach-AI"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "Bạn là trợ lý AI Pickleball." },
            ...messages.map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMessage }
          ]
        })
      });
      const data = await response.json();
      console.log("[OpenRouter API] Status:", response.status, "Response:", data);
      if (!response.ok) {
        setMessages(msgs => ([...msgs, { from: "bot", text: data.error?.message || "Lỗi kết nối chatbot." }]));
        setLoading(false);
        return;
      }
      const botReply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa thể trả lời lúc này.";
      setMessages(msgs => ([...msgs, { from: "bot", text: botReply }]));
    } catch (err) {
      console.error("[OpenRouter API] Exception:", err);
      setMessages(msgs => ([...msgs, { from: "bot", text: "Lỗi kết nối chatbot." }]));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    callChatbotAPI(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMessages([...messages, { from: "user", text: "[Đã gửi ảnh]", image: URL.createObjectURL(e.target.files[0]) }]);
    }
  };

  return (
    <div className="chatbox2-container">
      {open ? (
        <div className="chatbox2-overlay center">
          <div className="chatbox2-panel center-panel">
            <div className="chatbox2-header">
              <div className="chatbox2-header-info">
                <img
                  src={BotAvatar}
                  alt="Bot"
                  className="chatbox2-avatar"
                />
                <span className="chatbox2-title">Trợ lý AI Pickleball</span>
              </div>
              <button className="chatbox2-close" onClick={() => setOpen(false)} title="Đóng">×</button>
            </div>
            {/* Chọn model AI */}
            <div style={{ padding: '12px 40px 0 40px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom:'20px' , }}>
              <label htmlFor="ai-model-select" style={{ fontWeight: 600, color: '#2c91aa', marginRight: 8 }}>Mô hình:</label>
              <select
                id="ai-model-select"
                value={model}
                onChange={e => setModel(e.target.value)}
                style={{ padding: 6, borderRadius: 8, border: '1.5px solid #43a047', fontWeight: 600 }}
              >
                {OPENROUTER_MODELS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="chatbox2-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={tab === t.key ? "active" : ""}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="chatbox2-content">
              {tab === "chat" && (
                <div className="chatbox2-tab-content chat">
                  <h2>Chat với AI</h2>
                  <div className="chatbox2-messages">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chatbox2-message ${msg.from}`}
                        style={{ display: 'flex', alignItems: 'flex-end', gap: msg.from === 'bot' ? 10 : 0 }}
                      >
                        {msg.from === 'bot' && (
                          <img
                            src={BotAvatar}
                            alt="Bot"
                            style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 6, border: '2px solid #43a047' }}
                          />
                        )}
                        <span>
                          {msg.text}
                          {msg.image && (
                            <img src={msg.image} alt="upload" style={{ maxWidth: 120, maxHeight: 120, display: 'block', marginTop: 4, borderRadius: 8 }} />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === "video" && <VideoAnalysisTab />}
              {tab === "quiz" && (
                <div className="chatbox2-tab-content quiz">
                  <QuizTab userId={sessionStorage.getItem("id_user")}></QuizTab>
                </div>
              )}
              {tab === "suggest" && (
                <div className="chatbox2-tab-content suggest">
                  <h2>Gợi ý luyện tập</h2>
                  <ul>
                    <li>Bài tập kỹ thuật cơ bản</li>
                    <li>Video hướng dẫn Pickleball</li>
                    <li>Gợi ý giáo án cá nhân hóa</li>
                  </ul>
                </div>
              )}
              {tab === "history" && (
                <div className="chatbox2-tab-content history">
                  <h2>Lịch sử tương tác</h2>
                  <p>Hiển thị lịch sử chat, phân tích, quiz, v.v.</p>
                </div>
              )}
            </div>
            {/* Overlay voice */}
            {listening && (
              <div style={{position:'fixed',left:0,top:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:99999,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{background:'#fff',padding:32,borderRadius:18,boxShadow:'0 4px 32px rgba(44,145,170,0.18)',display:'flex',flexDirection:'column',alignItems:'center',gap:16,minWidth:260}}>
                  <div style={{fontSize:28,color:'#43a047',marginBottom:8}}>🎤</div>
                  <div style={{fontWeight:700,fontSize:20,color:'#2c91aa'}}>Đang lắng nghe...</div>
                  <button onClick={stopListening} style={{marginTop:12,padding:'8px 24px',background:'#ea6645',color:'#fff',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer'}}>Dừng</button>
                </div>
              </div>
            )}
            {/* Ô nhập liệu luôn nằm sát dưới cùng panel */}
            {tab === "chat" && (
              <div className="chatbox2-input" style={{position:'relative'}}>
                {/* Icon + và menu popup */}
                <div style={{position:'relative', marginRight: 4}}>
                  <button
                    className="chatbox2-plus-btn"
                    style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#2c91aa',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center'}}
                    onClick={() => setPlusMenuOpen(v => !v)}
                    title="Thêm tuỳ chọn"
                  >
                    <FaPlus />
                  </button>
                  {plusMenuOpen && (
                    <div style={{position:'absolute',left:0,top:44,zIndex:1000,background:'#fff',boxShadow:'0 4px 16px rgba(44,145,170,0.13)',borderRadius:12,padding:'10px 0',minWidth:210}}>
                      <button
                        style={{display:'flex',alignItems:'center',gap:8,padding:'8px 18px',width:'100%',background:'none',border:'none',fontSize:15,cursor:'pointer',color:'#217a9a'}}
                        onClick={() => { fileInputRef.current.click(); setPlusMenuOpen(false); }}
                      >
                        <FaRegImage /> Thêm ảnh và tệp
                      </button>
                      <div style={{borderTop:'1px solid #e0e0e0',margin:'8px 0'}}></div>
                      <div style={{padding:'0 18px 4px 18px',fontWeight:600,fontSize:14,color:'#888'}}>Thêm từ ứng dụng</div>
                      <button
                        style={{display:'flex',alignItems:'center',gap:8,padding:'7px 18px',width:'100%',background:'none',border:'none',fontSize:15,cursor:'pointer',color:'#217a9a'}}
                        onClick={() => { alert('Tính năng Google Drive sẽ sớm ra mắt!'); setPlusMenuOpen(false); }}
                      >
                        <FaGoogleDrive /> Kết nối Google Drive
                      </button>
                      <button
                        style={{display:'flex',alignItems:'center',gap:8,padding:'7px 18px',width:'100%',background:'none',border:'none',fontSize:15,cursor:'pointer',color:'#217a9a'}}
                        onClick={() => { alert('Tính năng OneDrive sẽ sớm ra mắt!'); setPlusMenuOpen(false); }}
                      >
                        <FaMicrosoft /> Kết nối Microsoft OneDrive
                      </button>
                    </div>
                  )}
                </div>
                {/* ... các nút còn lại ... */}
                <button className="chatbox2-emoji-btn" title="Chèn emoji">😊</button>
                <button className="chatbox2-voice-btn" title="Gửi voice" onClick={listening ? stopListening : startListening} style={{background: listening ? '#43a047' : 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: listening ? '#fff' : '#2c91aa', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm5-4a1 1 0 112 0c0 3.31-2.69 6-6 6s-6-2.69-6-6a1 1 0 112 0c0 2.21 1.79 4 4 4s4-1.79 4-4z" fill={listening ? '#fff' : '#2c91aa'}/></svg>
                </button>
                <button className="chatbox2-upload-btn" title="Gửi ảnh" onClick={() => fileInputRef.current.click()} style={{background: 'none', border: 'none', fontSize: 20, cursor: 'pointer'}}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zM5 5v14h14V5H5zm7 2a2 2 0 110 4 2 2 0 010-4zm-6 10l3.5-4.5 2.5 3 3.5-4.5L19 17H5z" fill="#2c91aa"/></svg>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                </button>
                <input type="text" placeholder="Aa" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} style={{marginLeft:8}} />
                <button className="chatbox2-send-btn" title="Gửi" onClick={handleSend} disabled={input.trim() === "" || loading}>
                  {loading ? (
                    <span className="loader" style={{width: 20, height: 20, display: 'inline-block'}}></span>
                  ) : (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path d="M3 20L21 12L3 4V10L17 12L3 14V20Z" fill="#fff"/>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button className="chatbox2-toggle center-toggle" onClick={() => setOpen(true)} title="Mở trợ lý AI">
          {/* <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#43a047" />
            <path d="M7 17V15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="10" r="1" fill="#fff" />
            <circle cx="15" cy="10" r="1" fill="#fff" />
          </svg> */}
             <img
    src={IconAvatar}
    alt="AI Avatar"
    className="w-9 h-9 rounded-full object-cover"
  />
        </button>
      )}
    </div>
  );
} 