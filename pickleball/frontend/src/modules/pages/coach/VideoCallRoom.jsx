import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const SIGNALING_SERVER_URL = "ws://localhost:8080/signal";

export default function VideoCallRoom() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const peerCreatedRef = useRef(false);
  const pendingCandidates = useRef([]);

  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const { roomId } = useParams();
  const role = sessionStorage.getItem("role");
  const isCoach = role !== "ROLE_learner";

  useEffect(() => {
    let ws;

    async function init() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: isCoach,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        ws = new WebSocket(`${SIGNALING_SERVER_URL}?roomId=${roomId}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          if (!isCoach) {
            ws.send(JSON.stringify({ type: "ready", role: "learner" }));
          }
        };

        ws.onmessage = async (event) => {
          const msg = JSON.parse(event.data);

          if (msg.type === "ready" && isCoach && stream && !pcRef.current) {
            await createPeerConnection(stream);
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            ws.send(JSON.stringify(offer));
          }

          if (msg.type === "offer" && !isCoach) {
            if (!pcRef.current) await createPeerConnection(stream);
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            ws.send(JSON.stringify(answer));

            while (pendingCandidates.current.length) {
              const candidate = pendingCandidates.current.shift();
              await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          }

          if (msg.type === "answer" && isCoach) {
            if (pcRef.current) {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg));
              while (pendingCandidates.current.length) {
                const candidate = pendingCandidates.current.shift();
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              }
            }
          }

          if (msg.type === "candidate" && msg.candidate) {
            if (pcRef.current && pcRef.current.remoteDescription) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
              } catch (e) {
                console.error("ICE error", e);
              }
            } else {
              pendingCandidates.current.push(msg.candidate);
            }
          }
        };

        ws.onclose = () => setConnected(false);
        ws.onerror = (e) => console.error("WebSocket error", e);
      } catch (err) {
        console.error("Media error", err);
      }
    }

    init();

    return () => {
      ws?.close();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function createPeerConnection(mediaStream) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    mediaStream.getTracks().forEach((track) => {
      pc.addTrack(track, mediaStream);
    });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current?.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };
  }

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraOn;
        setCameraOn(!cameraOn);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold mb-4">🎥 Gọi video</h1>
      <p className="text-sm mb-2">
        WebSocket: <span className={connected ? "text-green-400" : "text-red-400"}>{connected ? "Đã kết nối ✅" : "Mất kết nối ❌"}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-[300px] object-cover" />
          <p className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">{isCoach ? "Coach (Bạn)" : "Học viên (Bạn)"}</p>
        </div>
        <div className="bg-black rounded-xl overflow-hidden relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[300px] object-cover" />
          <p className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">{isCoach ? "Học viên" : "Coach"}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl shadow text-white">Rời cuộc gọi</button>
        <button onClick={toggleCamera} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl shadow text-white">{cameraOn ? "Tắt Camera" : "Bật Camera"}</button>
        <button onClick={toggleMic} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl shadow text-white">{micOn ? "Tắt Mic" : "Bật Mic"}</button>
      </div>
    </div>
  );
}