import React, { useState } from 'react';
import CourseCard from './learner/CourseCard';

const AiVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [details, setDetails] = useState(null);
    const [suggestedCourses, setSuggestedCourses] = useState([]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setResultUrl('');
        setErrorMsg('');
        setDetails(null);
        setSuggestedCourses([]);
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
            if (data.video_url) {
                setResultUrl(`http://localhost:8000${data.video_url}`);
                setDetails(data.details);
                setSuggestedCourses(data.suggested_courses || []);
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
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🎾 Phân tích kỹ thuật Pickleball bằng AI</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md">
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleFileChange}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Đang xử lý...' : '📤 Gửi lên'}
                    </button>
                </div>
            </form>

            {errorMsg && <p className="text-red-500 text-center mb-6 font-medium">{errorMsg}</p>}

            {resultUrl && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-6">✅ Video kết quả:</h3>
                    <video src={resultUrl} controls className="w-full rounded-xl mb-4 shadow-lg" />
                    <p className="text-blue-600 underline text-center">
                        <a href={resultUrl} target="_blank" rel="noreferrer">📥 Tải video</a>
                    </p>

                    {details && (
                        <div className="mt-10">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-6">📝 Đánh giá tổng quát</h3>

                            {details.good_points?.length > 0 && (
                                <>
                                    <strong className="text-green-600 text-lg">✔️ Điểm tốt:</strong>
                                    <ul className="list-disc pl-8 mt-3 text-gray-800">
                                        {details.good_points.map((msg, i) => (
                                            <li key={`good-${i}`} className="mt-2">{msg}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {details.errors?.length > 0 && (
                                <>
                                <p className="text-red-600 text-lg font-semibold">❌ Lỗi sai:</p>
                                <p className="text-red-500 mt-1">
                                    {details.errors.slice(0, 5).join(', ')}{details.errors.length > 5 ? '...' : ''}
                                </p>
                                </>
                            )}

                            {details.shots?.length > 0 && (
                                <div className="mt-10">
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-6">🎯 Các cú đánh đã phát hiện</h3>
                                    {details.shots.map((shot, index) => (
                                        <div
                                            key={`shot-${index}`}
                                            className="border border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-md hover:shadow-xl transition duration-300"
                                        >
                                            <p className="font-medium text-gray-800">Loại cú đánh: {shot.type}</p>
                                            <p className="font-medium text-gray-800">⏱ Thời điểm: {shot.time}s</p>

                                            {shot.good?.length > 0 && (
                                                <>
                                                    <p className="font-medium text-green-600 mt-4">✔️ Kỹ thuật tốt:</p>
                                                    <ul className="list-disc pl-8 mt-2 text-gray-700">
                                                        {shot.good.map((msg, i) => (
                                                            <li key={`shot-${index}-good-${i}`} className="mt-2">{msg}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            {shot.bad?.length > 0 && (
                                                <>
                                                    <p className="font-medium text-red-600 mt-4">❌ Cần cải thiện:</p>
                                                    <ul className="list-disc pl-8 mt-2 text-red-500">
                                                        {shot.bad.map((msg, i) => (
                                                            <li key={`shot-${index}-bad-${i}`} className="mt-2">{msg}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {suggestedCourses.length > 0 && (
                                <div className="mt-12">
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-6">🎓 Khóa học phù hợp được gợi ý</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {suggestedCourses.length > 0 ? (
                                            suggestedCourses.map((course) => (
                                                <CourseCard key={course.id} course={course} />
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-lg col-span-full text-center py-8">
                                                Chưa có khóa học nào để hiển thị.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiVideo;