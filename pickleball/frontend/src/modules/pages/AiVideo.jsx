import React, { useState } from 'react';
import CourseCard from './learner/CourseCard';

const AiVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [details, setDetails] = useState(null);
    const [detectedShots, setDetectedShots] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setResultUrl('');
        setErrorMsg('');
        setDetails(null);
        setDetectedShots([]);
        setRecommendedCourses([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setErrorMsg('Vui lòng chọn một video.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log(data);
            if (data.status === 'success') {
                setResultUrl(`http://localhost:8000${data.video_url}`);
                setDetails(data.details);
                setDetectedShots(data.detected_shots || []);
                setRecommendedCourses(data.recommended_courses || []);
                setErrorMsg('');
            } else {
                setErrorMsg('Phân tích thất bại.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Lỗi khi gửi video.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                    Phân tích Video Pickleball AI
                </h2>

                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="file"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            required
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-lg text-white font-semibold ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } transition duration-200`}
                        >
                            {loading ? 'Đang xử lý...' : 'Phân tích Video'}
                        </button>
                    </div>
                </form>

                {errorMsg && (
                    <p className="text-red-500 text-center font-medium mb-6 bg-red-50 p-3 rounded-lg">
                        {errorMsg}
                    </p>
                )}

                {resultUrl && (
                    <div className="space-y-8">
                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Kết quả Phân tích</h3>
                            <video
                                src={resultUrl}
                                controls
                                className="w-full h-auto rounded-lg border border-gray-200"
                            />
                            <p className="mt-4 text-blue-600 hover:underline">
                                <a href={resultUrl} target="_blank" rel="noreferrer">
                                    Tải video kết quả
                                </a>
                            </p>
                        </div>

                        {details && (
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá Kỹ thuật</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {details.good_points?.length > 0 && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="font-medium text-green-700 mb-2">✔️ Điểm tốt</p>
                                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                                {details.good_points.map((msg, i) => (
                                                    <li key={`good-${i}`}>{msg}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {details.errors?.length > 0 && (
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="font-medium text-red-700 mb-2">❌ Lỗi sai</p>
                                            <ul className="list-disc pl-5 text-red-700 space-y-1">
                                                {details.errors.map((msg, i) => (
                                                    <li key={`err-${i}`}>{msg[2]}</li> // Giả định msg là tuple (x, y, msg)
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {detectedShots.length > 0 && (
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Các Cú Đánh Phát Hiện</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {detectedShots.map((shot, i) => (
                                        <div
                                            key={`shot-${i}`}
                                            className="bg-blue-100 text-blue-800 font-medium py-2 px-4 rounded-lg flex justify-between items-center"
                                        >
                                            <span>{shot.type}</span>
                                            <span className="text-sm text-gray-600">({shot.time}s)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recommendedCourses.length > 0 && (
                            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Khóa học Đề xuất</h3>
                                <div className="grid gap-6">
                                    {recommendedCourses.map((course, index) => (
                                        <CourseCard key={`recommended-course-${index}`} course={course} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiVideo;