package com.pickle.backend.controller;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.VideoAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class VideoAnalysisController {

    @Autowired
    private VideoAnalysisService videoAnalysisService;

    // @PostMapping("/full-analysis")
    // public ResponseEntity<?> fullAnalysis(
    //         @RequestParam String learnerId,
    //         @RequestParam(value = "video", required = false) MultipartFile video,
    //         @RequestParam(value = "selfAssessedLevel", required = false) String selfAssessedLevel) throws IOException {
    //     if (video == null && selfAssessedLevel == null) {
    //         return ResponseEntity.badRequest().body(new VideoAnalysisResponse("Error: Provide video or self-assessed level"));
    //     }
    //     try {
    //         VideoAnalysis result = videoAnalysisService.analyze(learnerId, video, selfAssessedLevel);
    //         return ResponseEntity.ok(new VideoAnalysisResponse(result));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(new VideoAnalysisResponse("Error processing analysis: " + e.getMessage()));
    //     }
    // }

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
        private VideoAnalysis data;

        public VideoAnalysisResponse(String message) {
            this.message = message;
        }

        public VideoAnalysisResponse(VideoAnalysis data) {
            this.data = data;
        }
    }
}