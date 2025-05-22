package com.pickle.backend.controller;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.service.VideoAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/video-analyses")
public class VideoAnalysisController {

    @Autowired
    private VideoAnalysisService videoAnalysisService;

    @GetMapping
    public List<VideoAnalysis> getAllVideoAnalyses() {
        return videoAnalysisService.getAllVideoAnalyses();
    }

    @GetMapping("/{id}")
    public Optional<VideoAnalysis> getVideoAnalysisById(@PathVariable String id) {
        return videoAnalysisService.getVideoAnalysisById(id);
    }

    @PostMapping
    public VideoAnalysis createVideoAnalysis(@RequestBody VideoAnalysis videoAnalysis) {
        return videoAnalysisService.createVideoAnalysis(videoAnalysis);
    }

    @PutMapping("/{id}")
    public VideoAnalysis updateVideoAnalysis(@PathVariable String id, @RequestBody VideoAnalysis details) {
        return videoAnalysisService.updateVideoAnalysis(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteVideoAnalysis(@PathVariable String id) {
        videoAnalysisService.deleteVideoAnalysis(id);
    }

    @GetMapping("/learner/{learnerId}")
    public List<VideoAnalysis> findByLearnerId(@PathVariable String learnerId) {
        return videoAnalysisService.findByLearnerId(learnerId);
    }

    @GetMapping("/movement/{movement}")
    public List<VideoAnalysis> findByMovement(@PathVariable String movement) {
        return videoAnalysisService.findByMovement(movement);
    }
}
