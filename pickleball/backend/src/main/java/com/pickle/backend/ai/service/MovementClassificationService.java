package com.pickle.backend.ai.service;

import com.pickle.backend.ai.model.MovementClassification;
import com.pickle.backend.ai.repository.MovementClassificationRepository;
import com.pickle.backend.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MovementClassificationService {
    private final MovementClassificationRepository movementClassificationRepository;
    private final S3Util s3Util;
    private final RestTemplate restTemplate;

    public MovementClassification classifyMovement(String userId, MultipartFile video) {
        System.out.println("Processing video upload for userId: " + userId);
        String videoUrl = s3Util.uploadFile(video);
        System.out.println("Uploaded video URL: " + videoUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = new HashMap<>();
        body.put("video_path", videoUrl);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        System.out.println("Sending request to microservice: " + "http://localhost:5000/movement-classification");

        ResponseEntity<Map> response = restTemplate.postForEntity("http://localhost:5000/movement-classification", request, Map.class);
        System.out.println("Microservice response: " + response.getBody());

        String label = (String) response.getBody().get("label");
        MovementClassification classification = new MovementClassification();
        classification.setUserId(userId);
        classification.setVideoUrl(videoUrl);
        classification.setLabel(label);
        return movementClassificationRepository.save(classification);
    }
    Map<String, Integer> myMap = new HashMap<>();
}