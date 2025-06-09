import React, { useState, useEffect } from 'react';
import { getQuiz, submitQuiz } from '../../api/user/test';
import Question from '../../components/Question';
import Result from '../../components/Result';

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await getQuiz();
        console.log('Dữ liệu thô từ API (getQuiz):', response);
        const quizQuestions = Array.isArray(response.data) ? response.data : [];
        console.log('Dữ liệu câu hỏi đã sẵn sàng:', quizQuestions);
        setQuestions(quizQuestions);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy câu hỏi quiz:', err.response?.data || err.message || err);
        setError('Không thể tải câu hỏi. Vui lòng kiểm tra kết nối mạng hoặc API.');
        setLoading(false);
      }
    };
    fetchQuizQuestions();
  }, []);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: optionId };
      console.log('Answers được cập nhật (questionId: optionId):', newAnswers);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    console.log('Bắt đầu xử lý nộp bài...');
    const answerList = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId: parseInt(questionId, 10),
      optionId: parseInt(optionId, 10),
    }));

    if (answerList.length === 0) {
      setError('Vui lòng chọn ít nhất một câu trả lời trước khi nộp bài!');
      console.warn('Người dùng cố gắng nộp bài khi chưa chọn câu trả lời nào.');
      return;
    }

    if (answerList.length < questions.length) {
      setError('Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài!');
      console.warn('Người dùng chưa trả lời hết các câu hỏi.');
      return;
    }

    if (answerList.some(ans => isNaN(ans.optionId) || isNaN(ans.questionId))) {
      setError('Một số câu trả lời không hợp lệ (NaN). Vui lòng kiểm tra lại!');
      console.error('Lỗi: optionId hoặc questionId trong answerList là NaN. answerList:', answerList);
      return;
    }

    console.log('Danh sách câu trả lời chuẩn bị gửi đến backend:', answerList);
    try {
      const response = await submitQuiz(answerList);
      console.log('Phản hồi từ API sau khi nộp bài:', response);
      setScore(response);
      setError(null);
      console.log('Nộp bài thành công. Phản hồi từ API:', response);
    } catch (err) {
      console.error('Lỗi khi nộp bài:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setLoading(true);
    setError(null);
    getQuiz()
      .then(response => {
        const quizQuestions = Array.isArray(response.data) ? response.data : [];
        setQuestions(quizQuestions);
        setLoading(false);
        console.log('Tải lại câu hỏi thành công.');
      })
      .catch(err => {
        console.error('Lỗi khi tải lại câu hỏi:', err.response?.data || err.message || err);
        setError('Không thể tải lại câu hỏi. Vui lòng thử lại.');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-medium text-gray-600 animate-pulse">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-red-50 border border-red-300 text-red-600 p-6 rounded-lg shadow-md text-center max-w-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {score === null ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8 my-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">Quiz</h1>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <Question
                  key={question.id}
                  question={question}
                  index={index}
                  onOptionChange={handleOptionChange}
                  selectedOption={answers[question.id]}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-lg font-medium">Không có câu hỏi để hiển thị. Vui lòng kiểm tra dữ liệu API.</p>
              </div>
            )}
            <button
              onClick={handleSubmit}
              className={`w-full py-3 px-4 mt-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                Object.keys(answers).length < questions.length
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#5659d6] text-white hover:bg-[#4649b0] focus:ring-2 focus:ring-[#5659d6] focus:ring-offset-2'
              }`}
              disabled={Object.keys(answers).length < questions.length}
            >
              Nộp bài
            </button>
          </div>
        </div>
      ) : (
        <Result score={score} total={questions.length} onReset={handleReset} />
      )}
    </div>
  );
}