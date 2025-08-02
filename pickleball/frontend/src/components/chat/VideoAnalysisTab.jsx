import React, { useRef, useState } from "react";
import "./VideoAnalysisTab.css";

export default function VideoAnalysisTab() {
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    inputRef.current.click();
  };

  return (
    <div className="video-analysis-tab">
      <h2>Phân tích Video</h2>
      <div className="video-upload-label">Tải video lên để AI phân tích kỹ thuật Pickleball của bạn</div>
      <div
        className={`video-upload-area${file ? ' uploaded' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <div className="video-upload-icon">
          <svg width="72" height="72" fill="none" viewBox="0 0 48 48">
            <rect x="4" y="16" width="40" height="24" rx="6" fill="#e0f7fa" stroke="#43a047" strokeWidth="2.5"/>
            <path d="M24 34V14M24 14L17 21M24 14l7 7" stroke="#43a047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="video-upload-text">
          {!file ? (
            <>
              <button className="video-upload-btn" type="button" onClick={handleClick}>Chọn video để tải lên</button>
              <div className="video-upload-or">hoặc kéo thả video vào đây</div>
              <div className="video-upload-desc">Hỗ trợ mp4, mov, avi... Tối đa 100MB.</div>
            </>
          ) : (
            <>
              <span>Đã chọn: <b>{file.name}</b></span>
              <br />
              <button className="video-upload-btn" type="button" onClick={handleClick} style={{marginTop:10}}>Chọn lại video</button>
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
      <div className="video-upload-guide">
        <div className="video-guide-desc">
          <span>Chỉ với 3 bước đơn giản, bạn sẽ nhận được phân tích kỹ thuật Pickleball từ AI:</span>
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