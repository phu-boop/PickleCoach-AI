import { useState, useEffect } from "react";
import { fetchQuestion, createQuestion, deleteQuestion } from "../../../api/admin/test"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faSearch, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
export default function Tests() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    content: "",
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  });

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuestion();
        const transformedQuestions = (Array.isArray(response.data) ? response.data : []).map(item => ({
          id: item.id,
          question: item.content,
          options: item.options.map(opt => opt.text),
          correctAnswer: item.options.find(opt => opt.correct)?.text || "N/A",
        }));
        setQuestions(transformedQuestions);
        setError(null);
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewQuestion({
      content: "",
      options: [
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
      ],
    });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = async () => {
    try {
      const questionData = {
        content: newQuestion.content,
        options: newQuestion.options.map(opt => ({
          text: opt.text,
          correct: opt.correct,  // Lưu ý backend bạn dùng 'correct' hay 'isCorrect'?
        })),
      };

      await createQuestion(questionData);
      setIsModalOpen(false);

      // Reload question list after create
      const response = await fetchQuestion();
      const transformedQuestions = (Array.isArray(response.data) ? response.data : []).map(item => ({
        id: item.id,
        question: item.content,
        options: item.options.map(opt => opt.text),
        correctAnswer: item.options.find(opt => opt.correct)?.text || "N/A",
      }));
      setQuestions(transformedQuestions);

      // Reset form
      setNewQuestion({
        content: "",
        options: [
          { text: "", correct: false },
          { text: "", correct: false },
          { text: "", correct: false },
          { text: "", correct: false },
        ],
      });
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Failed to create question. Please try again.");
    }
  };
  
      console.log("Question" + sessionStorage.getItem("token"));   
  const handleEdit = (id) => {
    navigate(`/admin/tests/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete?")) {
      try {
        await deleteQuestion(id);
        setQuestions(questions.filter((q) => q.id !== id));
        alert("Deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete question.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Test Questions</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faFileCirclePlus} className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Modal thêm câu hỏi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Question Content</label>
              <input
                type="text"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter question content..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                    className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.correct}
                      onChange={(e) => handleOptionChange(index, "correct", e.target.checked)}
                      className="mr-2"
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search question..."
          className="pl-10 pr-4 py-2 w-full md:w-1/2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center p-4 text-gray-500">Loading questions...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Question</th>
                <th className="p-3">Options</th>
                <th className="p-3">Correct Answer</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions
                .filter(q => q?.question?.toLowerCase().includes(search.toLowerCase()))
                .map((q, idx) => (
                  <tr key={q.id} className="border-t">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{q.question || "N/A"}</td>
                    <td className="p-3">
                      {q.options?.map((opt, i) => (
                        <div key={i}>{`${String.fromCharCode(65 + i)}. ${opt}`}</div>
                      )) || "N/A"}
                    </td>
                    <td className="p-3 font-semibold text-green-600">{q.correctAnswer}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(q.id)}
                        className="text-blue-600 hover:underline mr-3"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPencil} size="sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-red-600 hover:underline"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
