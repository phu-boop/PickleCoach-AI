package com.pickle.backend.service;

import com.pickle.backend.entity.VideoAnalysis;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.sql.Timestamp;
import java.util.List;



@Service
@Transactional
public class VideoAnalysisService {

    private final RestTemplate restTemplate;
    private final EntityManager entityManager;

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

    // Tạo phân tích mới
    public VideoAnalysis createVideoAnalysis(VideoAnalysis analysis) {
        if (analysis.getCreatedAt() == null) {
            analysis.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        }
        entityManager.persist(analysis);
        return analysis;
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
}