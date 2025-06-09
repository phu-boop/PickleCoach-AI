import { useState } from "react";
import Button from "../../components/Button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
export default function InputAssessment() {
  const navigate = useNavigate();
  const handleQuiz = () => {
    navigate("/quiz");
  }
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Input Skill Assessment
      </h1>
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => navigate("/quiz")}
          className="px-6 py-2 rounded-lg transition-colors"
        >
          Do Quiz
        </Button>
        <Button
          onClick={() => handleQuiz()}
          className="px-6 py-2 rounded-lg transition-colors"
        >
          Upload Video
        </Button>
      </div>
      <QuizForm onSubmit={(data) => {
        console.log("Quiz Data Submitted:", data);
        // Handle quiz submission logic here
        navigate("/quiz");
      }} />
    </div>
  );
}

function QuizForm({ onSubmit }) {
  const [experience, setExperience] = useState("");
  const [backhand, setBackhand] = useState(5);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!experience || !goal) {
      setError("Please complete all fields before submitting.");
      return;
    }
    setError("");
    onSubmit({ experience, backhand, goal });
  };

  return (
    <Card className="mb-6 bg-white shadow-lg rounded-xl">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quick Skill Quiz
        </h2>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            1. How long have you played Pickleball?
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Select an option</option>
            <option>Less than 6 months</option>
            <option>6–12 months</option>
            <option>1–2 years</option>
            <option>More than 2 years</option>
          </select>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            2. Choose your mode (you can take a quiz or upload a video to assess your level)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={backhand}
            onChange={(e) => setBackhand(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500 hover:bg-blue-100 transition-colors"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span
              className={`px-3 py-1 rounded-md ${
                backhand <= 3 ? "bg-red-100 text-red-800" : ""
              }`}
            >
              Newbie (1-3)
            </span>
            <span
              className={`px-3 py-1 rounded-md ${
                backhand >= 4 && backhand <= 7 ? "bg-yellow-100 text-yellow-800" : ""
              }`}
            >
              Intermediate (4-7)
            </span>
            <span
              className={`px-3 py-1 rounded-md ${
                backhand >= 8 ? "bg-green-100 text-green-800" : ""
              }`}
            >
              Advanced (8-10)
            </span>
          </div>
          <div className="text-center text-base font-semibold text-blue-600 mt-2">
            Current: {backhand <= 3 ? "Newbie" : backhand <= 7 ? "Intermediate" : "Advanced"} ({backhand})
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            3. What is your main goal?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            rows="4"
            placeholder="E.g., improve consistency, master spin shots, win local tournaments..."
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          onClick={handleSubmit}
          className="w-full px-6 py-3 text-white rounded-lg transition-colors"
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
