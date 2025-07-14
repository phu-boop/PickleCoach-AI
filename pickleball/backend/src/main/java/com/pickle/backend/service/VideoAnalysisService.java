package com.pickle.backend.service;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.repository.VideoAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class VideoAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(VideoAnalysisService.class);

    private final RestTemplate restTemplate;
    private final EntityManager entityManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private VideoAnalysisRepository videoAnalysisRepository;

    public VideoAnalysisService(RestTemplate restTemplate, EntityManager entityManager) {
        this.restTemplate = restTemplate;
        this.entityManager = entityManager;
    }

    public List<VideoAnalysis> getAllVideoAnalyses() {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v", VideoAnalysis.class).getResultList();
    }

    public VideoAnalysis getVideoAnalysisById(String id) {
        return entityManager.find(VideoAnalysis.class, id);
    }

    public VideoAnalysis createVideoAnalysis(VideoAnalysis videoAnalysis) {
        logger.info("Creating video analysis for user: {}", videoAnalysis.getUserId());
        validateJson(videoAnalysis.getDetailedFeedbacks());
        validateJson(videoAnalysis.getShotAnalysis());
        validateJson(videoAnalysis.getAnalysisResult());
        validateJson(videoAnalysis.getRecommendations());
        videoAnalysis.setVideoId(UUID.randomUUID().toString());
        return videoAnalysisRepository.save(videoAnalysis);
    }

    public VideoAnalysis updateVideoAnalysis(String id, VideoAnalysis analysis) {
        VideoAnalysis existing = entityManager.find(VideoAnalysis.class, id);
        if (existing != null) {
            existing.setUserId(analysis.getUserId());
            existing.setDetailedFeedbacks(analysis.getDetailedFeedbacks());
            existing.setShotAnalysis(analysis.getShotAnalysis());
            existing.setAnalysisResult(analysis.getAnalysisResult());
            existing.setRecommendations(analysis.getRecommendations());
            existing.setVideoPath(analysis.getVideoPath());
            existing.setCreatedAt(analysis.getCreatedAt());
            return videoAnalysisRepository.save(existing);
        }
        return null;
    }

    public void deleteVideoAnalysis(String id) {
        VideoAnalysis analysis = entityManager.find(VideoAnalysis.class, id);
        if (analysis != null) {
            entityManager.remove(analysis);
        }
    }

    public List<VideoAnalysis> findByUserId(String userId) {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v WHERE v.userId = :userId", VideoAnalysis.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public List<VideoAnalysis> findByShotType(String shotType) {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v WHERE v.shotAnalysis LIKE :shotType", VideoAnalysis.class)
                .setParameter("shotType", "%" + shotType + "%")
                .getResultList();
    }

    private void validateJson(String json) {
        if (json == null) return;
        try {
            objectMapper.readTree(json);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON data: " + e.getMessage(), e);
        }
    }
}