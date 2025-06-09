package com.pickle.backend.ai.controller;

import com.pickle.backend.ai.service.PoseEstimationService;
import com.pickle.backend.ai.service.RecommendationService;
import com.pickle.backend.ai.service.MovementClassificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.pickle.backend.ai.model.*;
import java.util.List;

// Import PoseAnalysis if it exists in your project 


@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {
    private final PoseEstimationService poseEstimationService;
    private final RecommendationService recommendationService;
    private final MovementClassificationService movementClassificationService;

    @PostMapping("/pose-estimation")
    public ResponseEntity<com.pickle.backend.ai.model.PoseAnalysis> analyzePose(@RequestParam String userId, @RequestParam("video") MultipartFile video) {
        return ResponseEntity.ok(poseEstimationService.analyzePose(userId, video));
    }

    // Tạm thời vô hiệu hóa vì endpoint /movement-classification chưa có
    /*
    @PostMapping("/movement-classification")
    public ResponseEntity<MovementClassification> classifyMovement(@RequestParam String userId, @RequestParam String videoUrl) {
        return ResponseEntity.ok(movementClassificationService.classifyMovement(userId, videoUrl));
    }
    */

    @PostMapping("/movement-classification")
    public ResponseEntity<MovementClassification> classifyMovement(@RequestParam String userId, @RequestParam("video") MultipartFile video) {
        return ResponseEntity.ok(movementClassificationService.classifyMovement(userId, video));
    }

//    @GetMapping("/recommendations")
//    public ResponseEntity<List<Content>> getRecommendations(@RequestParam String userId) {
//        return ResponseEntity.ok(recommendationService.getRecommendations(userId));
//    }

    @PostMapping("/recommendations")
    public ResponseEntity<List<Content>> getRecommendations(@RequestParam String userId, @RequestParam("video") MultipartFile video) {
        return ResponseEntity.ok(recommendationService.getRecommendations(userId, video));
    }
}