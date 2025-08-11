export async function analyzeVideo(learnerId, videoFile) {
  if (!learnerId || !videoFile) {
    throw new Error("Thiếu learnerId hoặc video file.");
  }

  const formData = new FormData();
  formData.append("learnerId", learnerId);
  formData.append("video", videoFile);

  try {
    const response = await fetch("http://localhost:8080/api/ai/full-analysis", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Không thể phân tích video.");
    }

    return data.result.result;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gọi API phân tích video.");
  }
}