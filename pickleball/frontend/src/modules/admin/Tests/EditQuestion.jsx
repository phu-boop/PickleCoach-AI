import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestionById, updateQuestion } from "../../../api/admin/test";

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    content: "",
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const res = await fetchQuestionById(id);
        const data = res.data;
        setQuestion({
          content: data.content,
          options: data.options.map(opt => ({
            text: opt.text,
            correct: opt.correct,
          })),
        });
      } catch (e) {
        console.error("Error fetching question:", e);
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestion({ ...question, options: newOptions });
  };

  const handleSave = async () => {
    try {
      await updateQuestion(id, {
        content: question.content,
        options: question.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.correct, // Note: API expects 'isCorrect', consistent with your original code
        })),
      });
      alert("Question updated!");
      navigate("/admin/tests");
    } catch (e) {
      console.error("Error updating question:", e);
      alert("Failed to update question.");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 text-lg font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Question</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Question Content</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={question.content}
            onChange={e => setQuestion({ ...question, content: e.target.value })}
          />
        </div>

        <label className="block text-gray-700 font-semibold mb-3">Options</label>
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg shadow-sm">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={opt.text}
              onChange={e => handleOptionChange(idx, "text", e.target.value)}
            />
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={opt.correct}
                onChange={e => handleOptionChange(idx, "correct", e.target.checked)}
              />
              <span className="text-sm font-medium">Correct</span>
            </label>
          </div>
        ))}

        <button
          className="w-full bg-[#696cff] text-white py-3 px-4 rounded-lg hover:bg-[#5254b7] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-semibold"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}