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
    return <div className="text-xl text-gray-700 text-center mt-8">Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8 p-4 bg-red-100 border border-red-400 rounded">{error}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Ứng dụng Quiz</h1>

      {score === null ? (
        <>
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
            <div className="text-gray-500 text-center mt-8">Không có câu hỏi để hiển thị. Vui lòng kiểm tra dữ liệu API.</div>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-md transition mt-6 ${
              Object.keys(answers).length < questions.length
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={Object.keys(answers).length < questions.length}
          >
            Nộp bài
          </button>
        </>
      ) : (
        <Result score={score} total={questions.length} onReset={handleReset} />
      )}
    </div>
  );
}