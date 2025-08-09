import React, { useRef, useState } from "react";
import CourseCard from "../../modules/pages/learner/CourseCard";

export default function VideoAnalysisTab() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [details, setDetails] = useState(null);
  const [detectedShots, setDetectedShots] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const inputRef = useRef();

  const resetResults = () => {
    setResultUrl("");
    setErrorMsg("");
    setDetails(null);
    setDetectedShots([]);
    setRecommendedCourses([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      resetResults();
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      resetResults();
    }
  };

  const handleClick = () => inputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Vui lòng chọn một video.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setResultUrl(`http://localhost:8000${data.video_url}`);
        setDetails(data.details);
        setDetectedShots(data.details.detected_shots || []);
        setRecommendedCourses(data.recommended_courses || []);
        setErrorMsg("");
      } else {
        setErrorMsg("Phân tích thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Lỗi khi gửi video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Phân tích Video</h2>
      <p className="text-gray-600 mb-6">
        Tải video lên để AI phân tích kỹ thuật Pickleball của bạn
      </p>

      <form onSubmit={handleSubmit}>
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition ${
            file ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"
          }`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {!file ? (
            <>
              <svg width="72" height="72" fill="none" viewBox="0 0 48 48">
                <rect
                  x="4"
                  y="16"
                  width="40"
                  height="24"
                  rx="6"
                  fill="#e0f7fa"
                  stroke="#43a047"
                  strokeWidth="2.5"
                />
                <path
                  d="M24 34V14M24 14L17 21M24 14l7 7"
                  stroke="#43a047"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 font-medium text-green-600">
                Chọn hoặc kéo thả video vào đây
              </p>
              <p className="text-sm text-gray-500">
                Hỗ trợ mp4, mov, avi... Tối đa 100MB.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">Đã chọn: {file.name}</p>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleClick}
              >
                Chọn lại video
              </button>
            </>
          )}
          <input
            type="file"
            accept="video/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white font-medium ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Đang xử lý..." : "Phân tích Video"}
          </button>
        </div>
      </form>

      {errorMsg && <p className="text-red-500 font-medium mt-4">{errorMsg}</p>}

      {resultUrl && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">🎬 Video kết quả</h3>
            <video src={resultUrl} controls className="w-full rounded-lg shadow" />
            <a
              href={resultUrl}
              target="_blank"
              rel="noreferrer"
              className="block mt-2 text-green-600 hover:underline"
            >
              Tải video kết quả
            </a>
          </div>

          {details && (
            <div>
              <h3 className="text-lg font-semibold mb-3">📌 Đánh giá Kỹ thuật</h3>
              <p className="text-sm text-gray-500 mb-2">
                🎞️ Tổng số khung hình đã phân tích:{" "}
                <strong>{details.frame_count}</strong>
              </p>
              {details.detected_shot && (
                <p className="text-sm text-blue-600 mb-4">
                  🏸 Cú đánh tiêu biểu:{" "}
                  <strong>{details.detected_shot.type}</strong> tại{" "}
                  <strong>{details.detected_shot.time}s</strong>
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.good_points?.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-semibold text-green-700 mb-2">✔️ Điểm tốt</p>
                    <ul className="space-y-2">
                      {details.good_points.map((g, i) => (
                        <li key={i}>
                          <p className="font-medium">{g.title}</p>
                          <p className="text-sm text-gray-600">{g.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.errors?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-700 mb-2">❌ Lỗi sai</p>
                    <ul className="space-y-2">
                      {details.errors.map((e, i) => (
                        <li key={i}>
                          <p className="font-medium">{e.title}</p>
                          <p className="text-sm text-gray-600">{e.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {detectedShots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">🏓 Các Cú Đánh Phát Hiện</h3>
              <div className="flex flex-wrap gap-2">
                {detectedShots.map((shot, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {shot.type} ({shot.time}s)
                  </span>
                ))}
              </div>
            </div>
          )}

          {recommendedCourses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">🎓 Khóa học đề xuất</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedCourses.map((course, i) => (
                  <CourseCard key={i} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
