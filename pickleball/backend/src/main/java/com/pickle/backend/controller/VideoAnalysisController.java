package com.pickle.backend.controller;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.VideoAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// import java.util.Optional;

@RestController
@RequestMapping("/api/video-analyses")
public class VideoAnalysisController {

    @Autowired
    private VideoAnalysisService videoAnalysisService;

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<List<VideoAnalysis>> getAllVideoAnalyses() {
        return ResponseEntity.ok(videoAnalysisService.getAllVideoAnalyses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoAnalysis> getVideoAnalysisById(@PathVariable String id) {
        return videoAnalysisService.getVideoAnalysisById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VideoAnalysis> createVideoAnalysis(@Valid @RequestBody VideoAnalysis videoAnalysis) {
        VideoAnalysis savedVideoAnalysis = videoAnalysisService.createVideoAnalysis(videoAnalysis);
        return new ResponseEntity<>(savedVideoAnalysis, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoAnalysis> updateVideoAnalysis(@PathVariable String id, @Valid @RequestBody VideoAnalysis details) {
        VideoAnalysis updatedVideoAnalysis = videoAnalysisService.updateVideoAnalysis(id, details);
        return ResponseEntity.ok(updatedVideoAnalysis);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideoAnalysis(@PathVariable String id) {
        videoAnalysisService.deleteVideoAnalysis(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('admin') or authentication.principal.userId == #learnerId")
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<VideoAnalysis>> findByLearnerId(@PathVariable String learnerId) {
        return ResponseEntity.ok(videoAnalysisService.findByLearnerId(learnerId));
    }

    @GetMapping("/movement/{movement}")
    public ResponseEntity<List<VideoAnalysis>> findByMovement(@PathVariable String movement) {
        return ResponseEntity.ok(videoAnalysisService.findByMovement(movement));
    }
}