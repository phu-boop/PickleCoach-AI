import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const AiVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setResultUrl('');
        setErrorMsg('');
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
            if (data.video_url) {
                setResultUrl(`http://localhost:8000${data.video_url}`);
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
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <h2>Chọn video Pickleball để phân tích</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
                    {loading ? 'Đang xử lý...' : 'Gửi lên'}
                </button>
            </form>

            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            {resultUrl && (
                <div style={{ marginTop: 20 }}>
                    <p><strong>Kết quả:</strong></p>
                    <video
                        src={resultUrl}
                        controls
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <p><a href={resultUrl} target="_blank" rel="noreferrer">Tải video kết quả</a></p>
                </div>
            )}
        </div>
    );
};

export default AiVideo;