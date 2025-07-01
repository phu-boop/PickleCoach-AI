import React, { useEffect, useRef, useState } from 'react';

export default function VideoCallRoom() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    // Truy cập webcam + mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error('Không thể truy cập camera/mic:', err);
      });

    // Cleanup khi rời trang
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !cameraOn;
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold mb-4">🎥 Đang gọi video với học viên</h1>

      {/* Video Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        {/* Local Video */}
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-[300px] object-cover" />
          <p className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Coach (Bạn)</p>
        </div>

        {/* Remote Video Placeholder */}
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[300px] object-cover" />
          <p className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Học viên</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4">
        <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl shadow text-white">
          Rời cuộc gọi
        </button>
        <button onClick={toggleCamera} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl shadow text-white">
          {cameraOn ? 'Tắt Camera' : 'Bật Camera'}
        </button>
        <button onClick={toggleMic} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl shadow text-white">
          {micOn ? 'Tắt Mic' : 'Bật Mic'}
        </button>
      </div>
    </div>
  );
}
