import { useState } from "react";
import Button from "../../components/Button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function InputAssessment() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("quiz"); // 'quiz' hoặc 'video'
  const handleQuizSubmit = () => {
    navigate("/thank-you"); // Chuyển hướng sau khi gửi quiz
  }


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Input Skill Assessment</h1>

      <div className="flex gap-4 mb-6">
        <Button variant={mode === "quiz" ? "default" : "outline"} onClick={() => setMode("quiz")}>
          Do Quiz
        </Button>
        <Button variant={mode === "video" ? "default" : "outline"} onClick={() => setMode("video")}>
          Upload Video
        </Button>
      </div>

      {mode === "quiz" ? <QuizForm /> : <VideoUploadForm />}
    </div>
  );
}

function QuizForm() {
  return (
    <Card className="mb-4">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Skill Quiz</h2>

        <div>
          <label className="font-medium">1. How long have you played Pickleball?</label>
          <select className="mt-1 w-full border rounded p-2">
            <option>Less than 6 months</option>
            <option>6–12 months</option>
            <option>1–2 years</option>
            <option>More than 2 years</option>
          </select>
        </div>

        <div>
          <label className="font-medium">2. Rate your backhand technique:</label>
          <input type="range" min="1" max="10" className="w-full" />
        </div>

        <div>
          <label className="font-medium">3. What is your main goal?</label>
          <textarea className="mt-1 w-full border rounded p-2" rows="3" />
        </div>

        <Button className="w-full mt-4">Submit Quiz</Button>
      </CardContent>
    </Card>
  );
}

function VideoUploadForm() {
  const [file, setFile] = useState(null);

  return (
    <Card className="mb-4">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Skill Demo Video</h2>

        <p>Upload a short video (max 2 minutes) demonstrating your pickleball skills.</p>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="w-full"
        />

        {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}

        <Button className="w-full mt-4" disabled={!file}>
          Upload Video
        </Button>
      </CardContent>
    </Card>
  );
}
