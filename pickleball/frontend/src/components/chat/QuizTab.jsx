import React, { useState, useEffect } from "react";
import { generateQuiz, saveQuizResult } from "../../api/chat-box/quiz";
import "./QuizTab.css";

export default function QuizTab({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [learnerAnalysis, setLearnerAnalysis] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("🔄 Loading adaptive quiz for user:", userId);

                const res = await generateQuiz({
                    learnerId: userId,
                    topic: "kỹ thuật forehand",
                    level: "medium"
                });

                const data = res.data || res;
                const questionsRaw = data.questions || [];

                console.log("📥 Received quiz data:", data);

                // Lưu thông tin phân tích từ AI
                if (data.learner_analysis) {
                    setLearnerAnalysis(data.learner_analysis);
                    console.log("🎯 AI Analysis:", data.learner_analysis);
                }

                const processedQuestions = questionsRaw.map(q => {
                    const options = q.options || [];
                    const correctIndex = options.findIndex(opt => opt.is_correct || opt.isCorrect || opt.correct);

                    return {
                        ...q,
                        question: q.question_text || q.questionText || q.question,
                        correctAnswer: correctIndex,
                        options: options.map(opt => ({
                            text: opt.text || "",
                            isCorrect: opt.is_correct || opt.isCorrect || opt.correct || false
                        })),
                        explanation: q.explanation || ""
                    };
                });

                setQuestions(processedQuestions);
                console.log("✅ Quiz loaded successfully:", processedQuestions.length, "questions");

            } catch (err) {
                console.error("❌ Error loading adaptive quiz:", err);
                setError("Không thể tải câu hỏi thích ứng. Kiểm tra console/back-end logs.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadQuiz();
        }
    }, [userId]);

    const handleAnswer = async () => {
        if (selectedOption === null) return;

        const currentQ = questions[currentQuestion];
        const isCorrect = currentQ.options[selectedOption]?.isCorrect;

        if (isCorrect) setScore(prev => prev + 1);

        const selectedText = currentQ.options[selectedOption]?.text;
        const correctText = currentQ.options[currentQ.correctAnswer]?.text;

        try {
            console.log("💾 Saving quiz result for question:", currentQ.question.substring(0, 50) + "...");

            await saveQuizResult({
                learnerId: userId,
                questionId: null,
                selectedOptionId: null,
                isCorrect: isCorrect,
                questionText: currentQ.question,
                selectedOptionText: selectedText,
                correctOptionText: correctText,
                explanation: currentQ.explanation,
                topic: "kỹ thuật forehand",
                level: "medium"
            });

            console.log("✅ Quiz result saved successfully");
        } catch (err) {
            console.error("❌ Error saving quiz result:", err);
        }

        // Hiển thị giải thích
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        // Kiểm tra nếu đây là câu hỏi cuối cùng
        if (currentQuestion >= questions.length - 1) {
            setQuizFinished(true);
            console.log("🏁 Quiz finished! Final score:", score + "/" + questions.length);
        } else {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        }
    };

    const resetQuiz = () => {
        console.log("🔄 Restarting quiz...");
        setCurrentQuestion(0);
        setScore(0);
        setSelectedOption(null);
        setQuizFinished(false);
        setShowExplanation(false);
        setLearnerAnalysis(null);

        // Reload quiz với dữ liệu mới từ lịch sử
        const loadNewQuiz = async () => {
            setLoading(true);
            try {
                const res = await generateQuiz({
                    learnerId: userId,
                    topic: "kỹ thuật forehand",
                    level: "medium"
                });

                const data = res.data || res;
                const questionsRaw = data.questions || [];

                // Lưu thông tin phân tích mới
                if (data.learner_analysis) {
                    setLearnerAnalysis(data.learner_analysis);
                    console.log("🎯 New AI Analysis:", data.learner_analysis);
                }

                const processedQuestions = questionsRaw.map(q => {
                    const options = q.options || [];
                    const correctIndex = options.findIndex(opt => opt.is_correct || opt.isCorrect || opt.correct);

                    return {
                        ...q,
                        question: q.question_text || q.questionText || q.question,
                        correctAnswer: correctIndex,
                        options: options.map(opt => ({
                            text: opt.text || "",
                            isCorrect: opt.is_correct || opt.isCorrect || opt.correct || false
                        })),
                        explanation: q.explanation || ""
                    };
                });

                setQuestions(processedQuestions);
                console.log("🆕 New adaptive quiz loaded:", processedQuestions.length, "questions");

            } catch (err) {
                console.error("❌ Error loading new quiz:", err);
                setError("Không thể tải quiz mới.");
            } finally {
                setLoading(false);
            }
        };
        loadNewQuiz();
    };

    // Render thông tin phân tích cá nhân hóa
    const renderLearnerInsights = () => {
        if (!learnerAnalysis) return null;

        const { weak_topics, focus_areas, correct_rate, difficulty_adjusted, total_attempts, needs_improvement } = learnerAnalysis;

        return (
            <div className="learner-insights">
                <h4>🎯 Phân tích thông minh AI</h4>

                {total_attempts > 0 && (
                    <div className="insight-item">
                        <span className="insight-label">Lịch sử:</span>
                        <span className="insight-value">{total_attempts} câu đã làm, tỷ lệ đúng: <strong>{Math.round(correct_rate * 100)}%</strong></span>
                    </div>
                )}

                {weak_topics?.length > 0 && (
                    <div className="insight-item">
                        <span className="insight-label">Cần cải thiện:</span>
                        <span className="insight-value weakness"><strong>{weak_topics.join(", ")}</strong></span>
                    </div>
                )}

                {focus_areas?.length > 0 && (
                    <div className="insight-item">
                        <span className="insight-label">Quiz này tập trung:</span>
                        <span className="insight-value focus"><strong>{focus_areas.join(", ")}</strong></span>
                    </div>
                )}

                {difficulty_adjusted && (
                    <div className="insight-item">
                        <span className="insight-label">Độ khó điều chỉnh:</span>
                        <span className={`insight-value difficulty ${difficulty_adjusted}`}>
                            <strong>{difficulty_adjusted === 'easy' ? '🟢 Dễ' : difficulty_adjusted === 'hard' ? '🔴 Khó' : '🟡 Trung bình'}</strong>
                        </span>
                    </div>
                )}

                {needs_improvement && (
                    <div className="insight-motivation">
                        💪 Quiz này được tạo riêng để giúp bạn cải thiện các điểm yếu!
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="quiz-tab-content"><p>🤖 AI đang tạo quiz thích ứng cho bạn...</p></div>;
    if (error) return <div className="quiz-tab-content"><p>❌ {error}</p></div>;
    if (!questions || questions.length === 0) return <div className="quiz-tab-content"><p>❌ Không có câu hỏi.</p></div>;

    // Hiển thị kết quả cuối cùng
    if (quizFinished) {
        return (
            <div className="quiz-tab-content">
                <div className="quiz-finished">
                    <h2>🎉 Hoàn thành Quiz Thông minh!</h2>
                    <div className="final-score">
                        <p>Điểm của bạn: <strong>{score}/{questions.length}</strong></p>
                        <p>Tỷ lệ đúng: <strong>{Math.round((score / questions.length) * 100)}%</strong></p>
                    </div>

                    {score === questions.length && <p className="perfect-score">🏆 Xuất sắc! Hoàn hảo!</p>}
                    {score >= questions.length * 0.8 && score < questions.length && <p className="good-score">🌟 Tốt lắm!</p>}
                    {score >= questions.length * 0.6 && score < questions.length * 0.8 && <p className="ok-score">👍 Khá tốt!</p>}
                    {score < questions.length * 0.6 && <p className="need-improve">💪 Cần cải thiện thêm!</p>}

                    {learnerAnalysis && (
                        <div className="final-insights">
                            <h4>📈 Phân tích kết quả:</h4>
                            <p>• Kết quả này sẽ giúp AI tạo quiz phù hợp hơn lần sau</p>
                            <p>• Quiz tiếp theo sẽ tập trung vào những gì bạn cần cải thiện</p>
                            {learnerAnalysis.needs_improvement && (
                                <p>• AI đã nhận diện các điểm yếu và sẽ điều chỉnh câu hỏi</p>
                            )}
                        </div>
                    )}

                    <div className="quiz-actions">
                        <button className="restart-btn" onClick={resetQuiz}>
                            🤖 Tạo Quiz Thông minh mới
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="quiz-tab-content">
            <div className="quiz-progress">
                <p>Câu hỏi {currentQuestion + 1}/{questions.length}</p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{width: `${((currentQuestion) / questions.length) * 100}%`}}
                    ></div>
                </div>
            </div>

            {renderLearnerInsights()}

            <div className="question-container">
                <h3>{currentQ.question}</h3>

                <div className="options">
                    {currentQ.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => !showExplanation && setSelectedOption(i)}
                            disabled={showExplanation}
                            className={`option-btn ${
                                selectedOption === i ? 'selected' : ''
                            } ${
                                showExplanation && opt.isCorrect ? 'correct' : ''
                            } ${
                                showExplanation && selectedOption === i && !opt.isCorrect ? 'wrong' : ''
                            }`}
                        >
                            {String.fromCharCode(65 + i)}. {opt.text}
                        </button>
                    ))}
                </div>

                {!showExplanation ? (
                    <button
                        className="confirm-btn"
                        onClick={handleAnswer}
                        disabled={selectedOption === null}
                    >
                        Xác nhận
                    </button>
                ) : (
                    <div className="explanation-section">
                        {currentQ.explanation && (
                            <div className="explanation">
                                <h4>💡 Giải thích:</h4>
                                <p>{currentQ.explanation}</p>
                            </div>
                        )}

                        <button className="next-btn" onClick={handleNextQuestion}>
                            {currentQuestion >= questions.length - 1 ? '📊 Xem kết quả' : '➡️ Câu tiếp theo'}
                        </button>
                    </div>
                )}

                <div className="current-score">
                    Điểm hiện tại: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
                </div>
            </div>
        </div>
    );
}