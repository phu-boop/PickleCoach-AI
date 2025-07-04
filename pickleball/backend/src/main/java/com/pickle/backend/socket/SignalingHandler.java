package com.pickle.backend.socket;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SignalingHandler extends TextWebSocketHandler {

    // Map<roomId, List of WebSocketSession>
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = getRoomIdFromUri(session.getUri());
        if (roomId == null) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        sessionToRoom.put(session.getId(), roomId);

        System.out.println("🟢 Kết nối mới: " + session.getId() + " vào phòng " + roomId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession senderSession, TextMessage message) throws Exception {
        String senderId = senderSession.getId();
        String roomId = sessionToRoom.get(senderId);

        if (roomId == null) {
            System.out.println("⚠️ Không tìm thấy room cho session: " + senderId);
            return;
        }

        System.out.println("📩 [" + roomId + "] " + senderId + " gửi: " + message.getPayload());

        for (WebSocketSession session : rooms.getOrDefault(roomId, Set.of())) {
            if (!session.getId().equals(senderId) && session.isOpen()) {
                session.sendMessage(message);
                System.out.println("📤 → Gửi đến " + session.getId());
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String sessionId = session.getId();
        String roomId = sessionToRoom.remove(sessionId);

        if (roomId != null) {
            Set<WebSocketSession> roomSessions = rooms.get(roomId);
            if (roomSessions != null) {
                roomSessions.remove(session);
                if (roomSessions.isEmpty()) {
                    rooms.remove(roomId);
                    System.out.println("🗑️ Phòng " + roomId + " đã trống, xóa khỏi bộ nhớ.");
                }
            }
        }

        System.out.println("❌ Ngắt kết nối: " + sessionId);
    }

    private String getRoomIdFromUri(URI uri) {
        if (uri == null) return null;

        String query = uri.getQuery(); // ví dụ: roomId=abc123
        if (query == null || !query.contains("roomId=")) return null;

        for (String param : query.split("&")) {
            if (param.startsWith("roomId=")) {
                return param.substring("roomId=".length());
            }
        }

        return null;
    }
}
