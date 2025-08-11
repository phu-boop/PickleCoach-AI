import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../modules/pages/learner/CourseCard";
import Swal from "sweetalert2";
export default function VideoAnalysisTab() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [details, setDetails] = useState(null);
  const [detectedShots, setDetectedShots] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ loading: false, message: "" });
  const [userId, setUserId] = useState(null);
  const inputRef = useRef();

  // Lấy userId từ session store khi component mount
  useEffect(() => {
    const userData = sessionStorage.getItem("id_user");
    if (!userData) {
      Swal.fire({
        icon: "warning",
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để sử dụng tính năng này.",
      });
      navigate("/login");
      return;
    }
    setUserId(userData);
  }, [navigate]);
  const resetResults = () => {
    setResultUrl("");
    setErrorMsg("");
    setDetails(null);
    setDetectedShots([]);
    setRecommendedCourses([]);
    setSelectedMistake(null);
    setSaveStatus({ loading: false, message: "" });
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

  const handleSaveMistake = (mistake) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setSelectedMistake(mistake);
    setShowSaveModal(true);
  };

  const confirmSaveMistake = async () => {
    if (!selectedMistake || !userId) return;

    try {
      setSaveStatus({ loading: true, message: "" });
      const response = await fetch("http://localhost:8080/api/mistakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedMistake.title,
          description: selectedMistake.description,
          status: "OPEN",
          userId: userId,
        }),
      });

      if (response.ok) {
        setSaveStatus({ loading: false, message: "Lưu lỗi thành công!" });
        setTimeout(() => {
          setShowSaveModal(false);
          setSaveStatus({ loading: false, message: "" });
        }, 1500);
      } else {
        throw new Error("Lưu lỗi thất bại");
      }
    } catch (error) {
      console.error("Error saving mistake:", error);
      setSaveStatus({ 
        loading: false, 
        message: "Lưu lỗi thất bại. Vui lòng thử lại." 
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Phân tích Video Pickleball</h2>
      <p className="mb-8 text-gray-600">Tải video lên để AI phân tích và cải thiện kỹ thuật chơi của bạn</p>

      <form onSubmit={handleSubmit} className="mb-10">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center mb-6 cursor-pointer transition-all duration-200
            ${!file ? "border-indigo-300 bg-indigo-50 hover:bg-indigo-100" : "border-gray-300 bg-gray-50"}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          {!file ? (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="font-medium text-lg text-gray-700">Chọn hoặc kéo thả video vào đây</p>
                <p className="text-sm text-gray-500">
                  Hỗ trợ mp4, mov, avi... Tối đa 100MB.
                </p>
              </div>
              <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
                accept="video/mp4,video/x-m4v,video/*"
              />
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700 font-medium">{file.name}</p>
                <button
                  type="button"
                  className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  Chọn lại video
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all
            ${!file || loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"}`}
          disabled={!file || loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang phân tích...
            </span>
          ) : "Bắt đầu phân tích"}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="mt-10 space-y-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video kết quả
              </h3>
              <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-black">
                <video 
                  controls 
                  className="absolute top-0 left-0 w-full h-full"
                  src={resultUrl}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={resultUrl}
                  download
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải video về
                </a>
              </div>
            </div>
          </div>

          {details && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-indigo-700 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Đánh giá kỹ thuật
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Tổng số khung hình</h4>
                    <p className="text-3xl font-bold text-blue-600">{details.frame_count}</p>
                  </div>
                  
                  {details.detected_shot && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Cú đánh tiêu biểu</h4>
                      <p className="text-xl font-bold text-green-600 capitalize">{details.detected_shot.type}</p>
                      <p className="text-gray-600">tại {details.detected_shot.time}s</p>
                    </div>
                  )}
                </div>

                {details.good_points?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Điểm tốt
                    </h4>
                    <div className="grid gap-4">
                      {details.good_points.map((g, i) => (
                        <div key={i} className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                          <h5 className="font-medium text-green-800">{g.title}</h5>
                          <p className="text-gray-600 mt-1">{g.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {details.errors?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-red-700 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Lỗi cần cải thiện
                    </h4>
                    <div className="grid gap-4">
                      {details.errors.map((e, i) => (
                        <div key={i} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-red-800">{e.title}</h5>
                              <p className="text-gray-600 mt-1">{e.description}</p>
                            </div>
                            <button
                              onClick={() => handleSaveMistake(e)}
                              className="ml-4 px-3 py-1 bg-white text-indigo-600 rounded-md text-sm font-medium border border-indigo-100 hover:bg-indigo-50 transition-colors whitespace-nowrap"
                            >
                              Lưu lỗi
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {detectedShots.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Các cú đánh phát hiện
                </h3>
                <div className="flex flex-wrap gap-2">
                  {detectedShots.map((shot, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize"
                    >
                      {shot.type} ({shot.time}s)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recommendedCourses.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-indigo-700 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Khóa học đề xuất
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map((course, i) => (
                    <CourseCard key={i} course={course} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal xác nhận lưu lỗi */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Lưu lỗi sai</h3>
              <p className="text-gray-600 mb-6">
                Bạn có muốn lưu lỗi <span className="font-medium">"{selectedMistake?.title}"</span> để làm tài liệu học tập sau này không?
              </p>
              
              {saveStatus.message && (
                <div className={`mb-4 p-3 rounded-lg ${saveStatus.message.includes("thành công") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {saveStatus.message}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSaveStatus({ loading: false, message: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saveStatus.loading}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmSaveMistake}
                  className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center
                    ${saveStatus.loading 
                      ? "bg-indigo-400" 
                      : "bg-indigo-600 hover:bg-indigo-700"}`}
                  disabled={saveStatus.loading}
                >
                  {saveStatus.loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Xác nhận lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}