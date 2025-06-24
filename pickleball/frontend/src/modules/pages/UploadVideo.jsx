import { Upload } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

function UploadVideo() {
  const { id_user } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    console.log("handleUpload called. File:", file, "User ID:", id_user);
    if (!file) {
      setError("Please select a video to upload.");
      return;
    }
    if (!id_user) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = async () => {
      if (video.duration > 120) {
        setError("Video must be 2 minutes or shorter.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("video", file);
      formData.append("userId", id_user);

      for (let [key, value] of formData.entries()) {
        console.log("formData entry:", key, value);
      }

      try {
        console.log("Sending POST request...");
        const response = await axios.post("http://localhost:8080/api/ai/full-analysis", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });
        console.log("Full response:", response.data);
        // Access the nested result
        const apiResult = response.data.result?.result || {
          summary: "No summary available.",
          performanceMetrics: { averageScore: 0, totalFrames: 0 },
          skill_level: "N/A",
          shotAnalysis: { shots_detected: [], weakest_shots: [] },
          detailed_feedbacks: [],
          recommendations: [],
        };
        setResult({
          summary: apiResult.summary || "No summary available.",
          performanceMetrics: { averageScore: apiResult.averageScore || 0, totalFrames: 0 }, // Use averageScore directly
          skill_level: apiResult.skillLevel || "N/A", // Match skillLevel from data
          shotAnalysis: apiResult.shotAnalysis || { shots_detected: [], weakest_shots: [] },
          detailed_feedbacks: apiResult.detailedFeedbacks || [],
          recommendations: apiResult.recommendations || [],
        });
      } catch (err) {
        console.log("Error details:", err.response);
        setError("Error uploading video: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    video.src = URL.createObjectURL(file);
  };

  if (result) {
    console.log("Result structure:", JSON.stringify(result, null, 2));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Phần Upload Video */}
      <Card className="mb-6 bg-white shadow-lg rounded-xl">
        <CardContent className="space-y-6 p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Skill Demo Video
          </h2>
          <p className="text-gray-600">
            Upload a short video (maximum 2 minutes) demonstrating your pickleball skills.
          </p>
          <input
            type="file"
            accept="video/mp4,video/mov,video/avi"
            onChange={handleFileChange}
            className="w-full text-gray-700 border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
          />
          {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full px-6 py-3 rounded-lg transition-colors ${
              loading || !file
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Upload Video"}
          </Button>
        </CardContent>
      </Card>

      {/* Phần Kết Quả Phân Tích */}
      {result && (
        <div className="space-y-6">
          {/* Tóm tắt */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm Tắt Phân Tích</h2>
              <p className="text-gray-600 mb-2">{result.summary}</p>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-blue-600">
                  Điểm trung bình: {result.performanceMetrics.averageScore.toFixed(1)}/100
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Trình độ: {result.skill_level}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Phân tích cú đánh */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân Tích Cú Đánh</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Cú đánh được phát hiện:</p>
                  <ul className="list-disc pl-5 text-gray-600">
                    {result.shotAnalysis.shots_detected.map((shot, index) => (
                      <li key={index}>{shot}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Cú đánh yếu nhất:</p>
                  <ul className="list-disc pl-5 text-gray-600">
                    {result.shotAnalysis.weakest_shots.map((shot, index) => (
                      <li key={index}>{shot}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phản hồi chi tiết */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Phản Hồi Chi Tiết</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian (ms)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cú đánh</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tư thế</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cầm vợt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cân bằng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vung vợt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.detailed_feedbacks.map((feedback, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.overall_score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.shot?.type} ({feedback.shot?.description})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.position?.location}: {feedback.position?.advice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.stance?.type}: {feedback.stance?.feedback}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.grip?.type}: {feedback.grip?.feedback}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.balance?.status || "N/A"}: {feedback.balance?.feedback || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.swing
                            ? `${feedback.swing.direction} (${feedback.swing.feedback}, tốc độ: ${feedback.swing.velocity?.toFixed(3)})`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Khuyến nghị */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Khuyến Nghị Cải Thiện</h3>
              <ul className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="border-b pb-4">
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {rec.title}
                    </a>
                    <p className="text-gray-600">{rec.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default UploadVideo;
