package com.pickle.backend.ai.controller;
import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.FullAnalysisService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

// Import PoseAnalysis if it exists in your project 

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    @Autowired
    private FullAnalysisService fullAnalysisService;

    @PostMapping("/full-analysis")
    public ResponseEntity<?> fullAnalysis(
            @RequestParam String learnerId,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "selfAssessedLevel", required = false) String selfAssessedLevel) throws IOException {
        if (video == null && selfAssessedLevel == null) {
            return ResponseEntity.badRequest().body(new VideoAnalysisResponse("Error: Provide video or self-assessed level"));
        }
        try {
            VideoAnalysis result = fullAnalysisService.analyze(learnerId, video, selfAssessedLevel);
            return ResponseEntity.ok(new VideoAnalysisResponse(result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new VideoAnalysisResponse("Error processing analysis: " + e.getMessage()));
        }
    }

    @Data
    public static class VideoAnalysisResponse {
        private String message; // Thông báo lỗi hoặc thành công
        private VideoAnalysis data; // Dữ liệu phân tích (nếu thành công)

        public VideoAnalysisResponse(String message) {
            this.message = message;
        }

        public VideoAnalysisResponse(VideoAnalysis data) {
            this.data = data;
        }
    }
}