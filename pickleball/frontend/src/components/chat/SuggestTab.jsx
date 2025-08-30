import React, { useState, useEffect } from "react";
import CourseCard from "../../modules/pages/learner/CourseCard";
import { getAllCourses, getRecommendedLessons } from "../../api/learner/learningService";

export default function SuggestTab({ messages = [], model = 'openai/gpt-3.5-turbo', apiKey = '' }) {
  const [videoAnalyses, setVideoAnalyses] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [userPreference, setUserPreference] = useState('');

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

  // When component mounts, preload some data if user present
  useEffect(() => {
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
  }, []);

  // Helper: assemble suggested courses from sources and userPreference
  const assembleSuggested = (dbCourses = [], dbRecLessons = [], videos = null, preference = '') => {
    try {
      let assembled = [];
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
      const [videos, quizzes] = await Promise.all([fetchVideoAnalyses(userId), fetchQuizStats(userId)]);
      setVideoAnalyses(videos);
      setQuizStats(quizzes);
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
        dbCourses = (allCourses && allCourses.length) ? allCourses : [];
        dbRecLessons = (recommendedLessons && recommendedLessons.length) ? recommendedLessons : [];
      }

      try {
        const fallbackCourses = (dbCourses && dbCourses.length) ? dbCourses : allCourses;
        const fallbackRecLessons = (dbRecLessons && dbRecLessons.length) ? dbRecLessons : recommendedLessons;
        const immediate = assembleSuggested(fallbackCourses, fallbackRecLessons, videos, userPreference);
        if (immediate && immediate.length > 0) setSuggestedCourses(immediate);
      } catch (e) { console.warn('Immediate assemble failed', e); }

      const chatSummary = messages.map(m => `${m.from === 'user' ? 'User' : 'Bot'}: ${m.text}`).join('\n');
      const videoSummary = videos ? (Array.isArray(videos) ? videos.slice(0,5).map(v=> JSON.stringify(v)).join('\n') : JSON.stringify(videos)) : 'Không có dữ liệu phân tích video.';
      const quizSummary = quizzes ? JSON.stringify(quizzes) : 'Không có dữ liệu quiz.';

      const userPrompt = `Bạn là trợ lý huấn luyện Pickleball. Hãy tổng hợp dữ liệu dưới đây và tạo một kế hoạch luyện tập cá nhân hoá (3-5 buổi, mục tiêu, bài tập chi tiết, cách đo lường tiến bộ) phù hợp cho người dùng.
\n--- Mô tả người dùng ---\n${userPreference || 'Không có mô tả'}
\n--- Chat history ---\n${chatSummary}\n\n--- Video analyses (mới nhất) ---\n${videoSummary}\n\n--- Quiz / learner stats ---\n${quizSummary}`;

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
        try {
          let assembled = [];
          if (dbRecLessons && dbRecLessons.length > 0) {
            const courseMap = new Map();
            dbRecLessons.forEach(lesson => {
              const course = lesson.course || (lesson.courseId && (dbCourses || []).find(c => c.id === lesson.courseId));
              if (course) courseMap.set(course.id, course);
            });
            assembled = Array.from(courseMap.values());
          }

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

          if ((!assembled || assembled.length === 0) && userPreference && userPreference.trim() && dbCourses && dbCourses.length > 0) {
            const keywords = userPreference.toLowerCase().split(/[,.;\n\s]+/).filter(Boolean);
            const score = c => keywords.reduce((s, k) => s + (((c.title||'').toLowerCase().includes(k) || (c.description||'').toLowerCase().includes(k)) ? 1 : 0), 0);
            const scored = (dbCourses || []).map(c => ({ c, s: score(c) })).filter(x => x.s > 0);
            scored.sort((a,b) => b.s - a.s);
            assembled = scored.map(x => x.c).slice(0,6);
          }

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

  return (
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
          const hasUserMessages = messages && messages.some(m => m.from === 'user');
          const hasVideoData = !!(videoAnalyses && (Array.isArray(videoAnalyses) ? videoAnalyses.length > 0 : Object.keys(videoAnalyses).length > 0));
          const hasQuizData = !!(quizStats && Object.keys(quizStats).length > 0);
          const hasRecLessons = !!(recommendedLessons && recommendedLessons.length > 0);

          const hasAnyData = hasUserMessages || hasVideoData || hasQuizData || hasRecLessons || (suggestedCourses && suggestedCourses.length > 0);

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
                    {topBeginner.map(c => <CourseCard key={c.id} course={c} onClick={() => { /* no-op */ }} />)}
                  </div>
                </div>
              );
            }
          }

          if (suggestedCourses && suggestedCourses.length > 0) {
            return (
              <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                <h4 style={{marginBottom:8}}>Khóa học liên quan</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                  {suggestedCourses.map((c, idx) => <CourseCard key={c.id || c.url || idx} course={c} onClick={() => { /* no-op */ }} />)}
                </div>
              </div>
            );
          }

          if (recommendedLessons && recommendedLessons.length > 0) {
            const courseMap = new Map();
            recommendedLessons.forEach(lesson => {
              const course = lesson.course || (lesson.courseId && allCourses.find(c => c.id === lesson.courseId));
              if (course) courseMap.set(course.id, course);
            });
            const recCourses = Array.from(courseMap.values());
            if (recCourses.length > 0) {
              return (
                <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                  <h4 style={{marginBottom:8}}>Khóa học đề xuất cho bạn</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                    {recCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => { /* no-op */ }} />)}
                  </div>
                </div>
              );
            }
          }

          if (videoAnalyses) {
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
                    {toRender.map((c, idx) => (<CourseCard key={c.id || c.url || idx} course={c} onClick={() => { /* no-op */ }} />))}
                  </div>
                </div>
              );
            }
          }

          if (allCourses && allCourses.length > 0) {
            const top = allCourses.slice(0,4);
            return (
              <div style={{background:'#fff',borderRadius:8,padding:12,border:'1px solid #e6e6e6'}}>
                <h4 style={{marginBottom:8}}>Khóa học gợi ý từ hệ thống</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                  {top.map(c => <CourseCard key={c.id} course={c} onClick={() => { /* no-op */ }} />)}
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
  );
}