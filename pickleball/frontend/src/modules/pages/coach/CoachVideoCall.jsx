import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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

  return (
    <div>
      <h2>Coach View</h2>
      <video ref={localVideoRef} autoPlay muted playsInline style={{ width: 300 }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 300 }} />
      <p>{connected ? "WebSocket Connected" : "Disconnected"}</p>
    </div>
  );
}
