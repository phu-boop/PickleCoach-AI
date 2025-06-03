package com.pickle.backend.ai.service;

import com.pickle.backend.ai.model.PoseAnalysis;
import com.pickle.backend.ai.repository.PoseAnalysisRepository;
import com.pickle.backend.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PoseEstimationService {
    private final PoseAnalysisRepository repository;
    private final S3Util s3Util;
    private final RestTemplate restTemplate;

    public PoseAnalysis analyzePose(String userId, MultipartFile video) {
        String videoPath = s3Util.uploadFile(video);
        String pythonApiUrl = "http://localhost:5000/pose-estimation";
        String feedback = restTemplate.postForObject(pythonApiUrl, videoPath, String.class);

        PoseAnalysis analysis = new PoseAnalysis();
        analysis.setUserId(userId);
        analysis.setVideoUrl(videoPath);
        analysis.setFeedback(feedback != null ? feedback : "Hạ thấp trọng tâm");
        return repository.save(analysis);
    }
}