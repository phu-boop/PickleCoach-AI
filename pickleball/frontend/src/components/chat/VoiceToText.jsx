import React, { useState, useRef } from "react";

export default function VoiceToText({ onResult, lang = "vi-VN" }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
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

  return (
    <button
      onClick={listening ? stopListening : startListening}
      style={{ background: listening ? '#43a047' : '#e0e0e0', color: listening ? '#fff' : '#2c91aa', border: 'none', borderRadius: 20, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}
      title={listening ? "Dừng ghi âm" : "Nhấn để nói"}
    >
      {listening ? "Đang nghe... (bấm dừng)" : "🎤 Nói"}
    </button>
  );
}