import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const SIGNALING_SERVER_URL = "ws://localhost:8080/signal";

export default function LearnerVideoCall() {
  const { roomId } = useParams();
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const pendingCandidates = useRef([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${SIGNALING_SERVER_URL}?roomId=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "ready", role: "learner" }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "offer") {
        if (!pcRef.current) {
          await createPeerConnection();
        }

        await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        ws.send(JSON.stringify(answer));

        while (pendingCandidates.current.length) {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(pendingCandidates.current.shift())
          );
        }
      }

      if (msg.type === "candidate" && msg.candidate) {
        if (pcRef.current && pcRef.current.remoteDescription) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } else {
          pendingCandidates.current.push(msg.candidate);
        }
      }
    };

    return () => {
      ws.close();
      pcRef.current?.close();
    };
  }, []);

  async function createPeerConnection() {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-semibold mb-4">Learner View</h2>
      <div className="rounded-xl overflow-hidden bg-black shadow-lg w-full max-w-xl">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 object-cover" />
        <p className="text-sm text-center py-2 bg-black bg-opacity-50">Coach</p>
      </div>

      <p className="mt-6 text-sm">
        WebSocket Status:
        <span className={connected ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
          {connected ? "Connected ✅" : "Disconnected ❌"}
        </span>
      </p>
      
    </div>
  );
}
