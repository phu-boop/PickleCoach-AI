import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

const SIGNALING_SERVER_URL = "ws://localhost:8080/signal";

export default function CoachVideoCall() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const pendingCandidates = useRef([]);
  const [stream, setStream] = useState(null);
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [learnerJoined, setLearnerJoined] = useState(false);
  const [joinTime, setJoinTime] = useState(null);
  const leaveCall = () => {
  if (wsRef.current) {
    wsRef.current.close();
  }
  if (pcRef.current) {
    pcRef.current.close();
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  window.location.href = "/"; 
};
  useEffect(() => {
    let ws;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (mediaStream) => {
      setStream(mediaStream);
      localVideoRef.current.srcObject = mediaStream;

      ws = new WebSocket(`${SIGNALING_SERVER_URL}?roomId=${roomId}`);
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "ready" && msg.role === "learner") {
          setLearnerJoined(true);
          setJoinTime(new Date().toLocaleTimeString());
          await createPeerConnection(mediaStream);
        }

        if (msg.type === "answer") {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg));
          while (pendingCandidates.current.length) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(pendingCandidates.current.shift()));
          }
        }

        if (msg.type === "candidate" && msg.candidate) {
          if (pcRef.current.remoteDescription) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } else {
            pendingCandidates.current.push(msg.candidate);
          }
        }
      };
    });

    return () => {
      ws?.close();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function createPeerConnection(mediaStream) {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;

    mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    wsRef.current.send(JSON.stringify(offer));
  }

  const toggleMic = () => {
    stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicEnabled(prev => !prev);
  };

  const toggleCam = () => {
    stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCamEnabled(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-semibold mb-4"><img src="https://www.pickleheads.com/assets/logo-lockup-reverse.svg" alt="" className="h-15 mb-8" /></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden bg-black shadow-lg">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-64 object-cover" />
          <p className="text-sm text-center py-2 bg-black bg-opacity-50">👤 Coach (You)</p>
        </div>
        <div className="rounded-xl overflow-hidden bg-black shadow-lg">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          <p className="text-sm text-center py-2 bg-black bg-opacity-50">🎓 Learner</p>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={toggleMic}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow"
        >
          {micEnabled ? <Mic className="w-5 h-5 text-green-400" /> : <MicOff className="w-5 h-5 text-red-400" />}
        </button>
        <button
          onClick={toggleCam}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow"
        >
          {camEnabled ? <Video className="w-5 h-5 text-green-400" /> : <VideoOff className="w-5 h-5 text-red-400" />}
        </button>
      </div>

      <p className="mt-4 text-sm">
        Status:
        <span className={connected ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
          {connected ? "Connected ✅" : "Disconnected ❌"}
        </span>
      </p>

      <div className="mt-2 text-sm">
        {learnerJoined ? (
          <p className="text-green-400"> Learner joined at {joinTime}</p>
        ) : (
          <p className="text-yellow-400"> Waiting for learner to join...</p>
        )}
      </div>
      <button
        onClick={leaveCall}
        className="p-3 bg-red-600 hover:bg-red-700 rounded-full shadow text-white font-semibold mt-10"
      >
        Leave Call
      </button>

    </div>
  );
}
