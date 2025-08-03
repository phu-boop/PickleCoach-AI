import React, { useRef, useState } from "react";
import "./VideoAnalysisTab.css";
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

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      resetResults();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      resetResults();
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    inputRef.current.click();
  };

  const resetResults = () => {
    setResultUrl("");
    setErrorMsg("");
    setDetails(null);
    setDetectedShots([]);
    setRecommendedCourses([]);
  };

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
      console.log(data);
      if (data.status === "success") {
        setResultUrl(`http://localhost:8000${data.video_url}`);
        setDetails(data.details);
        setDetectedShots(data.detected_shots || []);
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
    <div className="video-analysis-tab">
      <h2>Phân tích Video</h2>
      <div className="video-upload-label">
        Tải video lên để AI phân tích kỹ thuật Pickleball của bạn
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className={`video-upload-area${file ? " uploaded" : ""}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="video-upload-icon">
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
          </div>
          <div className="video-upload-text">
            {!file ? (
              <>
                <button
                  className="video-upload-btn"
                  type="button"
                  onClick={handleClick}
                >
                  Chọn video để tải lên
                </button>
                <div className="video-upload-or">hoặc kéo thả video vào đây</div>
                <div className="video-upload-desc">
                  Hỗ trợ mp4, mov, avi... Tối đa 100MB.
                </div>
              </>
            ) : (
              <>
                <span>
                  Đã chọn: <b>{file.name}</b>
                </span>
                <br />
                <button
                  className="video-upload-btn"
                  type="button"
                  onClick={handleClick}
                  style={{ marginTop: 10 }}
                >
                  Chọn lại video
                </button>
              </>
            )}
          </div>
          <input
            type="file"
            accept="video/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="submit"
            disabled={loading}
            className={`video-upload-btn ${
              loading ? "disabled" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Phân tích Video"}
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="text-red-500 font-medium text-center mt-4">{errorMsg}</p>
      )}

      {resultUrl && (
        <div className="video-analysis-result">
          <div className="result-section">
            <h3>🎬 Video kết quả</h3>
            <video
              src={resultUrl}
              controls
              className="result-video"
            />
            <a href={resultUrl} target="_blank" rel="noreferrer">
              Tải video kết quả
            </a>
          </div>

          {details && (
            <div className="result-section">
              <h3>📌 Đánh giá Kỹ thuật</h3>

              {/* Thêm số frame */}
              <p className="text-sm text-gray-500 mb-2">
                🎞️ Tổng số khung hình đã phân tích: <strong>{details.frame_count}</strong>
              </p>

              {/* Nếu có cú đánh chính */}
              {details.detected_shot && (
                <p className="text-sm text-blue-600 mb-4">
                  🏸 Cú đánh tiêu biểu: <strong>{details.detected_shot.type}</strong> tại <strong>{details.detected_shot.time}s</strong>
                </p>
              )}

              <div className="feedback-columns">
                {details.good_points?.length > 0 && (
                  <div className="feedback-good">
                    <p>✔️ Điểm tốt</p>
                    <ul>
                      {details.good_points.map((msg, i) => (
                        <li key={`good-${i}`}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.errors?.length > 0 && (
                  <div className="feedback-bad">
                    <p>❌ Lỗi sai</p>
                    <ul>
                      {details.errors.map((msg, i) => (
                        <li key={`err-${i}`}>{msg[2]}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {detectedShots.length > 0 && (
            <div className="result-section">
              <h3>🏓 Các Cú Đánh Phát Hiện</h3>
              <div className="shot-list">
                {detectedShots.map((shot, i) => (
                  <div key={`shot-${i}`} className="shot-item">
                    <span>{shot.type}</span>
                    <span className="shot-time">({shot.time}s)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendedCourses.length > 0 && (
            <div className="result-section">
              <h3>🎓 Khóa học đề xuất</h3>
              <div className="course-list">
                {recommendedCourses.map((course, i) => (
                  <CourseCard key={`rc-${i}`} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="video-upload-guide">
        <div className="video-guide-desc">
          <span>
            Chỉ với 3 bước đơn giản, bạn sẽ nhận được phân tích kỹ thuật Pickleball từ AI:
          </span>
        </div>
        <ul>
          <li>Chọn hoặc kéo thả video Pickleball bạn muốn phân tích.</li>
          <li>Đợi AI xử lý và trả về kết quả phân tích kỹ thuật, tư thế.</li>
          <li>Xem gợi ý cải thiện từ AI (tính năng sẽ sớm ra mắt).</li>
        </ul>
      </div>
    </div>
  );
}
