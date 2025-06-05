import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FilePlus,
} from "lucide-react";

const mockQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctAnswer: "JavaScript",
  },
];

export default function Tests() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [search, setSearch] = useState("");

  const handleCreate = () => {
    // TODO: Show create modal or navigate
    alert("Create new question");
  };

  const handleEdit = (id) => {
    // TODO: Open edit modal
    alert("Edit question ID: " + id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure to delete?")) {
      setQuestions(questions.filter((q) => q.id !== id));
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
          <FilePlus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search question..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
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
              .filter((q) =>
                q.question.toLowerCase().includes(search.toLowerCase())
              )
              .map((q, idx) => (
                <tr key={q.id} className="border-t">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{q.question}</td>
                  <td className="p-3">
                    {q.options.map((opt, i) => (
                      <div key={i}>{`${String.fromCharCode(65 + i)}. ${opt}`}</div>
                    ))}
                  </td>
                  <td className="p-3 font-semibold text-green-600">{q.correctAnswer}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEdit(q.id)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 size={16} />
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
      </div>
    </div>
  );
}