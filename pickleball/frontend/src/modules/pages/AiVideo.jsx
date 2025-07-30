import React, { useState } from 'react';

const AiVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [details, setDetails] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setResultUrl('');
        setErrorMsg('');
        setDetails(null);
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
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h2>🎾 Phân tích kỹ thuật Pickleball bằng AI</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
                    {loading ? '⏳ Đang xử lý...' : '📤 Gửi lên'}
                </button>
            </form>

            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            {resultUrl && (
                <div style={{ marginTop: 20 }}>
                    <h3>✅ Video kết quả:</h3>
                    <video src={resultUrl} controls style={{ width: '100%', borderRadius: 10 }} />
                    <p><a href={resultUrl} target="_blank" rel="noreferrer">📥 Tải video</a></p>

                    {details && (
                        <div style={{ marginTop: 30 }}>
                            <h3>📝 Đánh giá tổng quát</h3>

                            {details.good_points?.length > 0 && (
                                <>
                                    <strong>✔️ Điểm tốt:</strong>
                                    <ul style={{ paddingLeft: 20 }}>
                                        {details.good_points.map((msg, i) => (
                                            <li key={`good-${i}`}>{msg}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {details.errors?.length > 0 && (
                                <>
                                    <strong>❌ Lỗi sai:</strong>
                                    <ul style={{ color: 'red', paddingLeft: 20 }}>
                                        {details.errors.map((msg, i) => (
                                            <li key={`err-${i}`}>{msg}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {details.shots?.length > 0 && (
                                <div style={{ marginTop: 30 }}>
                                    <h3>🎯 Các cú đánh đã phát hiện</h3>
                                    {details.shots.map((shot, index) => (
                                        <div
                                            key={`shot-${index}`}
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: 8,
                                                padding: 15,
                                                marginBottom: 15,
                                                backgroundColor: '#f9f9f9',
                                            }}
                                        >
                                            <p><strong>Loại cú đánh:</strong> {shot.type}</p>
                                            <p><strong>⏱ Thời điểm:</strong> {shot.time}s</p>

                                            {shot.good?.length > 0 && (
                                                <>
                                                    <p><strong>✔️ Kỹ thuật tốt:</strong></p>
                                                    <ul>
                                                        {shot.good.map((msg, i) => (
                                                            <li key={`shot-${index}-good-${i}`}>{msg}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            {shot.bad?.length > 0 && (
                                                <>
                                                    <p><strong>❌ Cần cải thiện:</strong></p>
                                                    <ul style={{ color: 'red' }}>
                                                        {shot.bad.map((msg, i) => (
                                                            <li key={`shot-${index}-bad-${i}`}>{msg}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    ))}
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
