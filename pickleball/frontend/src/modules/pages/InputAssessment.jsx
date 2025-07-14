import { useState } from "react";
import Button from "../../components/Button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { createUpdate } from "../../api/user/update";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function InputAssessment() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-grandstander">
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
          onClick={() => navigate("/upload-video")}
          className="px-6 py-2 rounded-lg transition-colors"
        >
          Upload Video
        </Button>
      </div>
      <QuizForm onSubmit={(data) => {
        console.log("Quiz Data Submitted:", data);
        navigate("/quiz");
      }} />
    </div>
  );
}

function QuizForm() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [experience, setExperience] = useState("");
  const [backhand, setBackhand] = useState(5);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("id_user");
  const token = sessionStorage.getItem("token");
  const data = {
    "id": userId,
    "skillLevel": convertSkillLevel(backhand),
    "goals": goal,
    "progress": "Just started",
  };
  console.log("Data to send:", data, "Token:", token); // Debug token

  const handleSubmit = async () => {
    if (!experience || !goal) {
      setError("Please complete all fields before submitting.");
      return;
    }
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const respond = await createUpdate(data);
      if (respond.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Your skill assessment has been submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      };
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Submission error:", error.response ? error.response.data : error.message);
      setError(`Failed to submit. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  function convertSkillLevel(backhand) {
    if (backhand < 4) {
      return "Beginner";
    } else if (backhand > 7) {
      return "Advanced";
    } else {
      return "Intermediate";
    }
  }

  return (
    <Card className="mb-6 bg-white shadow-lg rounded-xl">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Quick Skill Quiz</h2>

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
              className={`px-3 py-1 rounded-md ${backhand <= 3 ? "bg-red-100 text-red-800" : ""}`}
            >
              Newbie (1-3)
            </span>
            <span
              className={`px-3 py-1 rounded-md ${backhand >= 4 && backhand <= 7 ? "bg-yellow-100 text-yellow-800" : ""}`}
            >
              Intermediate (4-7)
            </span>
            <span
              className={`px-3 py-1 rounded-md ${backhand >= 8 ? "bg-green-100 text-green-800" : ""}`}
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