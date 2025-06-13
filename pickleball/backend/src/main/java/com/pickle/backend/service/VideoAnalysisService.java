package com.pickle.backend.service;

import com.pickle.backend.entity.VideoAnalysis;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.pickle.backend.repository.VideoAnalysisRepository;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
@Service
@Transactional
public class VideoAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(VideoAnalysisService.class);

    private final RestTemplate restTemplate;
    private final EntityManager entityManager;

    @Autowired
    private VideoAnalysisRepository videoAnalysisRepository;

    public VideoAnalysisService(RestTemplate restTemplate, EntityManager entityManager) {
        this.restTemplate = restTemplate;
        this.entityManager = entityManager;
    }

    // Lấy tất cả phân tích
    public List<VideoAnalysis> getAllVideoAnalyses() {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v", VideoAnalysis.class).getResultList();
    }

    // Lấy phân tích theo ID
    public VideoAnalysis getVideoAnalysisById(String id) {
        return entityManager.find(VideoAnalysis.class, id);
    }

    public VideoAnalysis createVideoAnalysis(VideoAnalysis videoAnalysis) {
        logger.info("Creating video analysis for learner: {}", videoAnalysis.getLearner().getUserId());
        validateJson(videoAnalysis.getPoseData());
        videoAnalysis.setVideoId(UUID.randomUUID().toString());
        return videoAnalysisRepository.save(videoAnalysis);
    }

    // Cập nhật phân tích
    public VideoAnalysis updateVideoAnalysis(String id, VideoAnalysis analysis) {
        VideoAnalysis existing = entityManager.find(VideoAnalysis.class, id);
        if (existing != null) {
            existing.setLearnerId(analysis.getLearnerId());
            existing.setPoseData(analysis.getPoseData());
            existing.setClassifiedMovements(analysis.getClassifiedMovements());
            existing.setAnalysisResult(analysis.getAnalysisResult());
            existing.setRecommendations(analysis.getRecommendations());
            return existing;
        }
        return null;
    }

    // Xóa phân tích
    public void deleteVideoAnalysis(String id) {
        VideoAnalysis analysis = entityManager.find(VideoAnalysis.class, id);
        if (analysis != null) {
            entityManager.remove(analysis);
        }
    }

    // Tìm theo learnerId
    public List<VideoAnalysis> findByLearnerId(String learnerId) {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v WHERE v.learnerId = :learnerId", VideoAnalysis.class)
                .setParameter("learnerId", learnerId)
                .getResultList();
    }

    // Tìm theo movement (dựa trên classifiedMovements)
    public List<VideoAnalysis> findByMovement(String movement) {
        return entityManager.createQuery("SELECT v FROM VideoAnalysis v WHERE v.classifiedMovements LIKE :movement", VideoAnalysis.class)
                .setParameter("movement", "%" + movement + "%")
                .getResultList();
    }

    private void validateJson(String json) {
        try {
            new ObjectMapper().readTree(json);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON data", e);
        }
    }
}