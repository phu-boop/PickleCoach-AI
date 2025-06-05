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
          isCorrect: opt.correct,
        })),
      });  
      alert("Question updated!");
      navigate("/admin/tests"); // quay về trang danh sách câu hỏi
    } catch (e) {
        console.error("Error updating question:", e);
      alert("Failed to update question.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Question</h2>
      <label className="block mb-2 font-semibold">Question Content</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={question.content}
        onChange={e => setQuestion({ ...question, content: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Options</label>
      {question.options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-3 gap-2">
          <input
            type="text"
            className="flex-grow p-2 border rounded"
            value={opt.text}
            onChange={e => handleOptionChange(idx, "text", e.target.value)}
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={opt.correct}
              onChange={e => handleOptionChange(idx, "correct", e.target.checked)}
            />
            Correct
          </label>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
}
