package com.pickle.backend.controller;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.FullAnalysisService;
import com.pickle.backend.service.VideoAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/full-analysis")
    public ResponseEntity<?> fullAnalysis(
            @RequestParam String learnerId,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "selfAssessedLevel", required = false) String selfAssessedLevel) throws IOException {
        if (video == null && selfAssessedLevel == null) {
            return ResponseEntity.badRequest().body(new VideoAnalysisResponse("Error: Provide video or self-assessed level"));
        }
        try {
            Map<String, Object> result = fullAnalysisService.analyze(learnerId, video, selfAssessedLevel);
            return ResponseEntity.ok(new VideoAnalysisResponse("Phân tích video thành công", result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new VideoAnalysisResponse("Phân tích video không thành công " + e.getMessage()));
        }
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
    public ResponseEntity<VideoAnalysis> updateVideoAnalysis(@PathVariable String id, @RequestBody VideoAnalysis analysis) {
        VideoAnalysis updated = videoAnalysisService.updateVideoAnalysis(id, analysis);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/analyses/{id}")
    public ResponseEntity<Void> deleteVideoAnalysis(@PathVariable String id) {
        videoAnalysisService.deleteVideoAnalysis(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analyses/learner/{learnerId}")
    public ResponseEntity<List<VideoAnalysis>> findByLearnerId(@PathVariable String learnerId) {
        return ResponseEntity.ok(videoAnalysisService.findByLearnerId(learnerId));
    }

    @GetMapping("/analyses/movement/{movement}")
    public ResponseEntity<List<VideoAnalysis>> findByMovement(@PathVariable String movement) {
        return ResponseEntity.ok(videoAnalysisService.findByMovement(movement));
    }

    @Data
    public static class VideoAnalysisResponse {
        private String message;
        private Object result; // Đổi thành Object để nhận Map hoặc VideoAnalysis

        public VideoAnalysisResponse() {}

        public VideoAnalysisResponse(String message) {
            this.message = message;
            this.result = null;
        }

        public VideoAnalysisResponse(String message, Object result) {
            this.message = message;
            this.result = result;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Object getResult() { return result; }
        public void setResult(Object result) { this.result = result; }
    }
}