package com.pickle.backend.controller;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.FullAnalysisService;
import com.pickle.backend.service.VideoAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class VideoAnalysisController {

    @Autowired
    private VideoAnalysisService videoAnalysisService;

    @Autowired
    private FullAnalysisService fullAnalysisService;

    @Value("${video.analysis.api.url:http://localhost:5000/video-analysis-enhanced}")
    private String videoAnalysisApiUrl;

    @PostMapping(value = "/full-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> fullAnalysis(
            @RequestParam String userId,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "selfAssessedLevel", required = false) String selfAssessedLevel) {
        System.out.println("Received request - video: " + (video != null ? video.getOriginalFilename() : "null")
                + ", userId: " + userId + ", video size: " + (video != null ? video.getSize() : 0)
                + ", content type: " + (video != null ? video.getContentType() : "null")
                + ", selfAssessedLevel: " + selfAssessedLevel);

        if (video == null && selfAssessedLevel == null) {
            return ResponseEntity.badRequest()
                    .body(new VideoAnalysisResponse("Error: Provide either video or self-assessed level"));
        }
        if (video != null && video.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new VideoAnalysisResponse("Error: Video file is empty or invalid"));
        }
        if (video != null && !isValidVideoFormat(video.getContentType())) {
            return ResponseEntity.badRequest()
                    .body(new VideoAnalysisResponse("Error: Invalid video format. Only MP4 is supported"));
        }

        try {
            Map<String, Object> result = fullAnalysisService.analyze(userId, video);
            System.out.println("Result from service: " + result);
            if (result == null || (result.containsKey("message")
                    && result.get("message").toString().contains("không thành công"))) {
                String errorMessage = (String) result.getOrDefault("message", "Phân tích video không thành công");
                System.out.println("Error result: " + errorMessage);
                return ResponseEntity.badRequest().body(new VideoAnalysisResponse(errorMessage));
            }
            return ResponseEntity.ok(new VideoAnalysisResponse("Phân tích thành công", result));
        } catch (IOException e) {
            System.err.println("IO Error in fullAnalysis: " + e.getMessage());
            return ResponseEntity.status(400).body(
                    new VideoAnalysisResponse("Phân tích không thành công: Lỗi xử lý file - " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error in fullAnalysis: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(new VideoAnalysisResponse("Phân tích không thành công: " + e.getMessage()));
        }
    }

    private boolean isValidVideoFormat(String contentType) {
        return contentType != null && contentType.equals("video/mp4");
    }

    @GetMapping("/analyses")
    public ResponseEntity<List<VideoAnalysis>> getAllVideoAnalyses() {
        return ResponseEntity.ok(videoAnalysisService.getAllVideoAnalyses());
    }

    @GetMapping("/analyses/{id}")
    public ResponseEntity<VideoAnalysis> getVideoAnalysisById(@PathVariable String id) {
        VideoAnalysis analysis = videoAnalysisService.getVideoAnalysisById(id);
        return analysis != null ? ResponseEntity.ok(analysis) : ResponseEntity.notFound().build();
    }

    @PostMapping("/analyses")
    public ResponseEntity<VideoAnalysis> createVideoAnalysis(@RequestBody VideoAnalysis analysis) {
        return ResponseEntity.ok(videoAnalysisService.createVideoAnalysis(analysis));
    }

    @PutMapping("/analyses/{id}")
    public ResponseEntity<VideoAnalysis> updateVideoAnalysis(@PathVariable String id,
            @RequestBody VideoAnalysis analysis) {
        VideoAnalysis updated = videoAnalysisService.updateVideoAnalysis(id, analysis);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/analyses/{id}")
    public ResponseEntity<Void> deleteVideoAnalysis(@PathVariable String id) {
        videoAnalysisService.deleteVideoAnalysis(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analyses/user/{userId}")
    public ResponseEntity<List<VideoAnalysis>> findByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(videoAnalysisService.findByUserId(userId));
    }

    @GetMapping("/analyses/shot/{shotType}")
    public ResponseEntity<List<VideoAnalysis>> findByShotType(@PathVariable String shotType) {
        return ResponseEntity.ok(videoAnalysisService.findByShotType(shotType));
    }

    @Data
    public static class VideoAnalysisResponse {
        private String message;
        private Object result;

        public VideoAnalysisResponse() {
        }

        public VideoAnalysisResponse(String message) {
            this.message = message;
            this.result = null;
        }

        public VideoAnalysisResponse(String message, Object result) {
            this.message = message;
            this.result = result;
        }
    }
}