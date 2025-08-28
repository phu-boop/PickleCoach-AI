import React, { useState, useRef, useEffect } from "react";
import "./chatbox2.css";
import VideoAnalysisTab from "./VideoAnalysisTab";
import CourseCard from "../../modules/pages/learner/CourseCard";
import { getAllCourses, getRecommendedLessons } from "../../api/learner/learningService";
import BotAvatar from '../../assets/images/Chat/8688154.jpg';
import IconAvatar from '../../assets/images/Chat/8567230.jpg';
import QuizTab from "./QuizTab";
import { FaPlus, FaGoogleDrive, FaMicrosoft, FaRegImage } from "react-icons/fa";
const TABS = [
  { key: "chat", label: "Chat" },
  { key: "video", label: "Phân tích Video" },
  { key: "quiz", label: "Quiz" },
  { key: "suggest", label: "Gợi ý" },
];

const OPENROUTER_MODELS = [
  { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3" },
  { value: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B" },
  { value: "mistralai/mixtral-8x7b-instruct", label: "Mixtral 8x7B " },
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" }
];

export default function ChatBox2() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  console.log("key",apiKey);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi là trợ lý AI Pickleball." },
    // { from: "user", text: "Chào bot!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(OPENROUTER_MODELS[0].value);
  const [videoAnalyses, setVideoAnalyses] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [userPreference, setUserPreference] = useState('');
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

  // Fetch user's video analyses from backend
  const fetchVideoAnalyses = async (userId) => {
    try {
      const res = await fetch(`/api/ai/analyses/user/${userId}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching video analyses', err);
      return null;
    }
  };

  // Fetch quiz stats / recent quiz results via backend learner-stats endpoint
  const fetchQuizStats = async (userId) => {
    try {
      const res = await fetch(`/api/questions/learner-stats/${userId}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching quiz stats', err);
      return null;
    }
  };

  // When user opens the Suggest tab, preload data (video analyses, quiz stats, all courses)
  useEffect(() => {
    if (tab !== 'suggest') return;
    const userId = sessionStorage.getItem('id_user');
    if (!userId) return;

    let mounted = true;
    (async () => {
      try {
        const [videos, quizzes, coursesFromDb, recLessons] = await Promise.all([
          fetchVideoAnalyses(userId),
          fetchQuizStats(userId),
          (async () => { try { return await getAllCourses(); } catch(e){ console.warn('Failed to load courses', e); return []; } })(),
          (async () => { try { return await getRecommendedLessons(userId); } catch(e){ console.warn('Failed to load recommended lessons', e); return []; } })()
        ]);
        if (!mounted) return;
        if (videos) setVideoAnalyses(videos);
        if (quizzes) setQuizStats(quizzes);
        setAllCourses(coursesFromDb || []);
        setRecommendedLessons(recLessons || []);
      } catch (err) {
        console.warn('Failed to preload suggestion data', err);
      }
    })();

    return () => { mounted = false; };
  }, [tab]);

  // Build prompt and call OpenRouter to generate personalized training plan
  // Helper: assemble suggested courses from sources and userPreference
  const assembleSuggested = (dbCourses = [], dbRecLessons = [], videos = null, preference = '') => {
    try {
      let assembled = [];
  // detect desired level from preference (Vietnamese + English hints)
  const pref = (preference || '').toLowerCase();
  let desiredLevel = null; // 'beginner'|'intermediate'|'advanced'
  if (pref.includes('chuyên') || pref.includes('cao') || pref.includes('nâng cao') || pref.includes('pro') || pref.includes('chuyên nghiệp') || pref.includes('thi đấu') || pref.includes('chuyên nghiệp')) desiredLevel = 'advanced';
  else if (pref.includes('trung') || pref.includes('trung cấp') || pref.includes('intermediate') || pref.includes('medium')) desiredLevel = 'intermediate';
  else if (pref.includes('mới') || pref.includes('cơ bản') || pref.includes('beginner') || pref.includes('starter')) desiredLevel = 'beginner';

      // 1) DB-driven recommended lessons
      if (dbRecLessons && dbRecLessons.length > 0) {
        const courseMap = new Map();
        dbRecLessons.forEach(lesson => {
          const course = lesson.course || (lesson.courseId && (dbCourses || []).find(c => c.id === lesson.courseId));
          if (course) courseMap.set(course.id, course);
        });
        assembled = Array.from(courseMap.values());
      }

      // 2) Video analysis
      if ((!assembled || assembled.length === 0) && videos) {
        const pickLatest = (arr) => (arr && arr.length ? arr[arr.length - 1] : null);
        const latest = Array.isArray(videos) ? pickLatest(videos) : videos;
        let rawCourses = [];
        if (latest) {
          if (latest.recommended_courses) rawCourses = latest.recommended_courses;
          else if (latest.recommendedCourses) rawCourses = latest.recommendedCourses;
          else if (latest.recommendations) {
            try { rawCourses = typeof latest.recommendations === 'string' ? JSON.parse(latest.recommendations) : latest.recommendations; } catch(e){ rawCourses = []; }
          } else if (latest.result && latest.result.recommendations) {
            rawCourses = latest.result.recommendations;
          }
        }

        const normalize = (item) => {
          if (!item) return null;
          if (item.id || item.courseId || item.videoLessonId) {
            return { id: item.id || item.courseId || item.videoLessonId, title: item.title || item.name || 'Khóa học', description: item.description || item.summary || '', thumbnailUrl: item.thumbnailUrl || item.image || item.url || '', levelRequired: item.levelRequired || item.level || '' };
          }
          return { id: null, title: item.title || item.name || 'Khóa học đề xuất', description: item.description || '', thumbnailUrl: item.thumbnailUrl || item.image || '', levelRequired: item.level || '', courseUrl: item.url || item.courseUrl || item.link || null, url: item.url || item.courseUrl || item.link || null };
        };

        const normalized = (rawCourses || []).map((it) => normalize(it)).filter(Boolean);
        const matched = [];
        const titlesSet = new Set();
        if (dbCourses && dbCourses.length > 0) {
          normalized.forEach(rec => {
            const recTitle = (rec.title || '').toLowerCase().trim();
            const recUrl = (rec.thumbnailUrl || rec.url || '').toLowerCase();
            const found = (dbCourses || []).find(c => {
              const ct = (c.title || '').toLowerCase().trim();
              const curl = (c.courseUrl || c.thumbnailUrl || '').toLowerCase();
              return ct === recTitle || (recTitle && ct.includes(recTitle)) || (recUrl && curl.includes(recUrl));
            });
            if (found && !titlesSet.has(found.id)) { matched.push(found); titlesSet.add(found.id); }
          });
        }

        assembled = matched.length > 0 ? matched : normalized;
      }

      // 3) preference-only match; prefer courses of desiredLevel if detected
      if ((!assembled || assembled.length === 0) && preference && preference.trim() && dbCourses && dbCourses.length > 0) {
        const keywords = preference.toLowerCase().split(/[,.;\n\s]+/).filter(Boolean);
        const score = c => keywords.reduce((s, k) => s + (((c.title||'').toLowerCase().includes(k) || (c.description||'').toLowerCase().includes(k)) ? 1 : 0), 0);

        // if desiredLevel detected, first try to find courses that match level
        let levelCandidates = [];
        if (desiredLevel) {
          levelCandidates = (dbCourses || []).filter(c => {
            const lvl = (c.levelRequired || c.level || '').toString().toLowerCase();
            const title = (c.title || '').toLowerCase();
            return lvl.includes(desiredLevel) || title.includes(desiredLevel) || (desiredLevel === 'advanced' && (lvl.includes('pro') || lvl.includes('cao') || title.includes('nâng cao')));
          });
        }

        if (levelCandidates && levelCandidates.length > 0) {
          // rank within level candidates
          const scored = levelCandidates.map(c => ({ c, s: score(c) })).filter(x => x.s >= 0);
          scored.sort((a,b) => b.s - a.s);
          assembled = scored.map(x => x.c).slice(0,6);
        } else {
          const scored = (dbCourses || []).map(c => ({ c, s: score(c) })).filter(x => x.s > 0);
          scored.sort((a,b) => b.s - a.s);
          assembled = scored.map(x => x.c).slice(0,6);
        }
      }

      // 4) boost by preference
      if (assembled && assembled.length > 0 && preference && preference.trim()) {
        const keywords = preference.toLowerCase().split(/[,.;\n\s]+/).filter(Boolean);
        const score = c => keywords.reduce((s, k) => s + (((c.title||'').toLowerCase().includes(k) || (c.description||'').toLowerCase().includes(k)) ? 1 : 0), 0);
        assembled = assembled.slice().sort((a,b) => score(b) - score(a));
      }

      return assembled;
    } catch (e) {
      console.warn('assembleSuggested error', e);
      return [];
    }
  };

  const generateSuggestion = async () => {
    const userId = sessionStorage.getItem('id_user');
    if (!userId) {
      setSuggestionError('Vui lòng đăng nhập để tạo gợi ý.');
      return;
    }
    setLoadingSuggestion(true);
    setSuggestionError(null);
    setSuggestion(null);

    try {
  // ensure we have latest data
  const [videos, quizzes] = await Promise.all([fetchVideoAnalyses(userId), fetchQuizStats(userId)]);
  setVideoAnalyses(videos);
  setQuizStats(quizzes);
      // also fetch all courses and recommended lessons (DB-driven)
      let dbCourses = [];
      let dbRecLessons = [];
      try {
        const [coursesFromDb, recLessons] = await Promise.all([getAllCourses(), getRecommendedLessons(userId)]);
        dbCourses = coursesFromDb || [];
        dbRecLessons = recLessons || [];
        setAllCourses(dbCourses);
        setRecommendedLessons(dbRecLessons);
      } catch (err) {
        console.warn('Failed to load courses or recommended lessons from backend', err);
        // don't wipe existing state on network failure; fall back to what's already in component state
        dbCourses = (allCourses && allCourses.length) ? allCourses : [];
        dbRecLessons = (recommendedLessons && recommendedLessons.length) ? recommendedLessons : [];
        // keep existing allCourses/recommendedLessons in state
      }

      // compute suggestions immediately so user sees results without waiting for AI
      try {
        const fallbackCourses = (dbCourses && dbCourses.length) ? dbCourses : allCourses;
        const fallbackRecLessons = (dbRecLessons && dbRecLessons.length) ? dbRecLessons : recommendedLessons;
        const immediate = assembleSuggested(fallbackCourses, fallbackRecLessons, videos, userPreference);
        console.log('[Suggest Debug] immediate assemble', { dbCoursesLength: (dbCourses||[]).length, allCoursesLength: (allCourses||[]).length, dbRecLessonsLength: (dbRecLessons||[]).length, recommendedLessonsLength: (recommendedLessons||[]).length, videos, userPreference, immediateLength: (immediate||[]).length });
        if (immediate && immediate.length > 0) setSuggestedCourses(immediate);
      } catch (e) { console.warn('Immediate assemble failed', e); }

      // Compose prompt with three arrays: chat history, video analyses summary, quiz stats
      const chatSummary = messages.map(m => `${m.from === 'user' ? 'User' : 'Bot'}: ${m.text}`).join('\n');

      const videoSummary = videos ? (Array.isArray(videos) ? videos.slice(0,5).map(v=> JSON.stringify(v)).join('\n') : JSON.stringify(videos)) : 'Không có dữ liệu phân tích video.';
      const quizSummary = quizzes ? JSON.stringify(quizzes) : 'Không có dữ liệu quiz.';

  const userPrompt = `Bạn là trợ lý huấn luyện Pickleball. Hãy tổng hợp dữ liệu dưới đây và tạo một kế hoạch luyện tập cá nhân hoá (3-5 buổi, mục tiêu, bài tập chi tiết, cách đo lường tiến bộ) phù hợp cho người dùng.
\n--- Mô tả người dùng ---\n${userPreference || 'Không có mô tả'}
\n--- Chat history ---\n${chatSummary}\n\n--- Video analyses (mới nhất) ---\n${videoSummary}\n\n--- Quiz / learner stats ---\n${quizSummary}`;

      // Call OpenRouter chat completion
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PickleCoach-AI'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'Bạn là trợ lý AI chuyên tạo giáo án tập luyện Pickleball dựa trên phân tích video và kết quả quiz.' },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        console.error('Suggestion API error', data);
        setSuggestionError(data.error?.message || 'Lỗi khi gọi API gợi ý.');
      } else {
  const plan = data.choices?.[0]?.message?.content || 'AI không trả về gợi ý.';
  setSuggestion(plan);
        // After receiving AI plan, assemble course recommendations to show immediately (use freshly fetched dbCourses/dbRecLessons)
        try {
          let assembled = [];

          // 1) DB-driven recommended lessons
          if (dbRecLessons && dbRecLessons.length > 0) {
            const courseMap = new Map();
            dbRecLessons.forEach(lesson => {
              const course = lesson.course || (lesson.courseId && (dbCourses || []).find(c => c.id === lesson.courseId));
              if (course) courseMap.set(course.id, course);
            });
            assembled = Array.from(courseMap.values());
          }

          // 2) If still empty, try video analysis recommendations (use `videos` fetched earlier)
          if ((!assembled || assembled.length === 0) && videos) {
            const pickLatest = (arr) => (arr && arr.length ? arr[arr.length - 1] : null);
            const latest = Array.isArray(videos) ? pickLatest(videos) : videos;
            let rawCourses = [];
            if (latest) {
              if (latest.recommended_courses) rawCourses = latest.recommended_courses;
              else if (latest.recommendedCourses) rawCourses = latest.recommendedCourses;
              else if (latest.recommendations) {
                try { rawCourses = typeof latest.recommendations === 'string' ? JSON.parse(latest.recommendations) : latest.recommendations; } catch(e){ rawCourses = []; }
              } else if (latest.result && latest.result.recommendations) {
                rawCourses = latest.result.recommendations;
              }
            }

            const normalize = (item, idx) => {
              if (!item) return null;
              if (item.id || item.courseId || item.videoLessonId) {
                return { id: item.id || item.courseId || item.videoLessonId, title: item.title || item.name || 'Khóa học', description: item.description || item.summary || '', thumbnailUrl: item.thumbnailUrl || item.image || item.url || '', levelRequired: item.levelRequired || item.level || '' };
              }
              return { id: null, title: item.title || item.name || 'Khóa học đề xuất', description: item.description || '', thumbnailUrl: item.thumbnailUrl || item.image || '', levelRequired: item.level || '', courseUrl: item.url || item.courseUrl || item.link || null, url: item.url || item.courseUrl || item.link || null };
            };

            const normalized = (rawCourses || []).map((it, i) => normalize(it, i)).filter(Boolean);
            const matched = [];
            const titlesSet = new Set();
            if (dbCourses && dbCourses.length > 0) {
              normalized.forEach(rec => {
                const recTitle = (rec.title || '').toLowerCase().trim();
                const recUrl = (rec.thumbnailUrl || rec.url || '').toLowerCase();
                const found = (dbCourses || []).find(c => {
                  const ct = (c.title || '').toLowerCase().trim();
                  const curl = (c.courseUrl || c.thumbnailUrl || '').toLowerCase();
                  return ct === recTitle || (recTitle && ct.includes(recTitle)) || (recUrl && curl.includes(recUrl));
                });
                if (found && !titlesSet.has(found.id)) { matched.push(found); titlesSet.add(found.id); }
              });
            }

            assembled = matched.length > 0 ? matched : normalized;
          }

          // 3) If still empty, try matching userPreference against dbCourses
          if ((!assembled || assembled.length === 0) && userPreference && userPreference.trim() && dbCourses && dbCourses.length > 0) {
            const keywords = userPreference.toLowerCase().split(/[,.;\n\s]+/).filter(Boolean);
            const score = c => keywords.reduce((s, k) => s + (((c.title||'').toLowerCase().includes(k) || (c.description||'').toLowerCase().includes(k)) ? 1 : 0), 0);
            const scored = (dbCourses || []).map(c => ({ c, s: score(c) })).filter(x => x.s > 0);
            scored.sort((a,b) => b.s - a.s);
            assembled = scored.map(x => x.c).slice(0,6);
          }

          // 4) Apply preference boost if assembled and preference present
          if (assembled && assembled.length > 0 && userPreference && userPreference.trim()) {
            const keywords = userPreference.toLowerCase().split(/[,.;\n\s]+/).filter(Boolean);
            const score = c => keywords.reduce((s, k) => s + (((c.title||'').toLowerCase().includes(k) || (c.description||'').toLowerCase().includes(k)) ? 1 : 0), 0);
            assembled = assembled.slice().sort((a,b) => score(b) - score(a));
          }

          if (assembled && assembled.length > 0) setSuggestedCourses(assembled);
        } catch (err) {
          console.warn('Failed to assemble suggested courses after AI plan', err);
        }
      }

    } catch (err) {
      console.error('Exception generating suggestion', err);
      setSuggestionError('Có lỗi khi tạo gợi ý.');
    } finally {
      setLoadingSuggestion(false);
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
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                                  <p>Nhập vào dữ liệu hiện có (chat, phân tích video, kết quả quiz) để AI sinh kế hoạch luyện tập cá nhân hóa.</p>
                                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                    <label style={{fontWeight:600,color:'#2c91aa'}}>Mô tả mong muốn / trình độ của bạn</label>
                                    <textarea
                                      placeholder="Ví dụ: Tôi muốn cải thiện backhand, đã chơi 6 tháng, trình độ trung cấp"
                                      value={userPreference}
                                      onChange={e => setUserPreference(e.target.value)}
                                      rows={3}
                                      style={{padding:8,borderRadius:8,border:'1px solid #ddd',resize:'vertical'}}
                                    />
                                  <div style={{display:'flex',gap:8}}>
                      <button onClick={generateSuggestion} disabled={loadingSuggestion} className="btn-primary">
                        {loadingSuggestion ? 'Đang tạo...' : 'Tạo gợi ý AI'}
                      </button>
                      <button onClick={() => { setSuggestion(null); setSuggestionError(null); }} className="btn-secondary">Làm mới</button>
                    </div>
                  </div>

                    {suggestionError && (
                      <div style={{color:'red'}}>{suggestionError}</div>
                    )}

                    {suggestion && (
                      <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                        <h4>Kế hoạch luyện tập (AI)</h4>
                        <pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{suggestion}</pre>
                      </div>
                    )}

                    {(() => {
                      // detect if we have any user data to base personalization on
                      const hasUserMessages = messages && messages.some(m => m.from === 'user');
                      const hasVideoData = !!(videoAnalyses && (Array.isArray(videoAnalyses) ? videoAnalyses.length > 0 : Object.keys(videoAnalyses).length > 0));
                      const hasQuizData = !!(quizStats && Object.keys(quizStats).length > 0);
                      const hasRecLessons = !!(recommendedLessons && recommendedLessons.length > 0);

                      const hasAnyData = hasUserMessages || hasVideoData || hasQuizData || hasRecLessons || (suggestedCourses && suggestedCourses.length > 0);

                      // If user has no data at all, show friendly beginner courses
                      if (!hasAnyData) {
                        const beginnerCandidates = (allCourses || []).filter(c => {
                          const lvl = (c.levelRequired || c.level || '').toString().toLowerCase();
                          const title = (c.title || '').toString().toLowerCase();
                          return lvl.includes('begin') || title.includes('cơ bản') || title.includes('cơ bản –') || title.includes('cơ bản -');
                        });
                        const topBeginner = beginnerCandidates.length ? beginnerCandidates.slice(0,4) : (allCourses||[]).slice(0,4);
                        if (topBeginner.length > 0) {
                          return (
                            <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                              <h4 style={{marginBottom:8}}>Khóa học dành cho người mới</h4>
                              <p style={{color:'#555',marginBottom:10}}>Bắt đầu từ những kỹ năng cơ bản phù hợp cho người mới học.</p>
                              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                                {topBeginner.map(c => <CourseCard key={c.id} course={c} onClick={() => setOpen(false)} />)}
                              </div>
                            </div>
                          );
                        }
                      }

                      // 1) If we have suggestedCourses assembled after AI plan, show them first
                      if (suggestedCourses && suggestedCourses.length > 0) {
                        return (
                          <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                            <h4 style={{marginBottom:8}}>Khóa học liên quan</h4>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                              {suggestedCourses.map((c, idx) => <CourseCard key={c.id || c.url || idx} course={c} onClick={() => setOpen(false)} />)}
                            </div>
                          </div>
                        );
                      }

                      // 2) If backend returned recommended lessons (DB-driven), show their courses
                      if (recommendedLessons && recommendedLessons.length > 0) {
                        const courseMap = new Map();
                        recommendedLessons.forEach(lesson => {
                          // lesson may include nested course object or courseId
                          const course = lesson.course || (lesson.courseId && allCourses.find(c => c.id === lesson.courseId));
                          if (course) courseMap.set(course.id, course);
                        });
                        const recCourses = Array.from(courseMap.values());
                        if (recCourses.length > 0) {
                          return (
                            <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                              <h4 style={{marginBottom:8}}>Khóa học đề xuất cho bạn</h4>
                              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                                {recCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => setOpen(false)} />)}
                              </div>
                            </div>
                          );
                        }
                      }

                      // 2) Fallback to existing video analysis recommendations (keep existing normalization/matching)
                      if (videoAnalyses) {
                        // determine courses array from videoAnalyses (latest if array)
                        let rawCourses = [];
                        const pickLatest = (arr) => (arr && arr.length ? arr[arr.length - 1] : null);
                        const latest = Array.isArray(videoAnalyses) ? pickLatest(videoAnalyses) : videoAnalyses;

                        if (latest) {
                          if (latest.recommended_courses) rawCourses = latest.recommended_courses;
                          else if (latest.recommendedCourses) rawCourses = latest.recommendedCourses;
                          else if (latest.recommendations) {
                            try { rawCourses = typeof latest.recommendations === 'string' ? JSON.parse(latest.recommendations) : latest.recommendations; } catch(e){ rawCourses = []; }
                          } else if (latest.result && latest.result.recommendations) {
                            rawCourses = latest.result.recommendations;
                          }
                        }

                        const normalize = (item, idx) => {
                          if (!item) return null;
                          if (item.id || item.courseId || item.videoLessonId) {
                            return { id: item.id || item.courseId || item.videoLessonId, title: item.title || item.name || 'Khóa học', description: item.description || item.summary || '', thumbnailUrl: item.thumbnailUrl || item.image || item.url || '', levelRequired: item.levelRequired || item.level || '' };
                          }
                          return { id: null, title: item.title || item.name || 'Khóa học đề xuất', description: item.description || '', thumbnailUrl: item.thumbnailUrl || item.image || '', levelRequired: item.level || '', courseUrl: item.url || item.courseUrl || item.link || null, url: item.url || item.courseUrl || item.link || null };
                        };

                        const normalized = (rawCourses || []).map((it, i) => normalize(it, i)).filter(Boolean);
                        const matched = [];
                        const titlesSet = new Set();
                        if (allCourses && allCourses.length > 0) {
                          normalized.forEach(rec => {
                            const recTitle = (rec.title || '').toLowerCase().trim();
                            const recUrl = (rec.thumbnailUrl || rec.url || '').toLowerCase();
                            const found = allCourses.find(c => {
                              const ct = (c.title || '').toLowerCase().trim();
                              const curl = (c.courseUrl || c.thumbnailUrl || '').toLowerCase();
                              return ct === recTitle || (recTitle && ct.includes(recTitle)) || (recUrl && curl.includes(recUrl));
                            });
                            if (found && !titlesSet.has(found.id)) { matched.push(found); titlesSet.add(found.id); }
                          });
                        }

                        const toRender = matched.length > 0 ? matched : normalized;
                        if (toRender.length > 0) {
                          return (
                            <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                              <h4 style={{marginBottom:8}}>Khóa học đề xuất</h4>
                              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                                {toRender.map((c, idx) => (<CourseCard key={c.id || c.url || idx} course={c} onClick={() => setOpen(false)} />))}
                              </div>
                            </div>
                          );
                        }
                      }

                      // 3) Final fallback: top DB courses
                      if (allCourses && allCourses.length > 0) {
                        const top = allCourses.slice(0,4);
                        return (
                          <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                            <h4 style={{marginBottom:8}}>Khóa học gợi ý từ hệ thống</h4>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                              {top.map(c => <CourseCard key={c.id} course={c} onClick={() => setOpen(false)} />)}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}

                    {!suggestion && !loadingSuggestion && (
                      <div style={{color:'#666'}}>Chưa có gợi ý nào. Nhấn "Tạo gợi ý AI" để bắt đầu.</div>
                    )}
                  </div>
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