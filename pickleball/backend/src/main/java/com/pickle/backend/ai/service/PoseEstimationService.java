package com.pickle.backend.ai.service;

import com.pickle.backend.ai.model.PoseAnalysis;
import com.pickle.backend.ai.service.PoseEstimationService;
import com.pickle.backend.ai.repository.PoseAnalysisRepository;
import com.pickle.backend.util.S3Util;
import lombok.RequiredArgsConstructor;
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
public class PoseEstimationService {
    private final PoseAnalysisRepository poseAnalysisRepository; // Thêm repository
    private final S3Util s3Util;
    private final RestTemplate restTemplate;

    public PoseAnalysis analyzePose(String userId, MultipartFile video) {
        String videoUrl = s3Util.uploadFile(video);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = new HashMap<>();
        body.put("video_path", videoUrl);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        PoseAnalysis response = restTemplate.postForObject("http://localhost:5000/pose-estimation", request, PoseAnalysis.class);
        response.setUserId(userId);
        response.setVideoUrl(videoUrl);
        return poseAnalysisRepository.save(response); // Lưu vào database
    }
}