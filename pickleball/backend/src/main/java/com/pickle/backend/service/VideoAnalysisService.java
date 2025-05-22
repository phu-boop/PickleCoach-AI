package com.pickle.backend.service;

import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.repository.VideoAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoAnalysisService {

    @Autowired
    private VideoAnalysisRepository videoAnalysisRepository;

    public List<VideoAnalysis> getAllVideoAnalyses() {
        return videoAnalysisRepository.findAll();
    }

    public Optional<VideoAnalysis> getVideoAnalysisById(String videoId) {
        return videoAnalysisRepository.findById(videoId);
    }

    public VideoAnalysis createVideoAnalysis(VideoAnalysis videoAnalysis) {
        return videoAnalysisRepository.save(videoAnalysis);
    }

    public VideoAnalysis updateVideoAnalysis(String videoId, VideoAnalysis details) {
        return videoAnalysisRepository.findById(videoId).map(va -> {
            va.setLearner(details.getLearner());
            va.setPoseData(details.getPoseData());
            va.setClassifiedMovements(details.getClassifiedMovements());
            va.setAnalysisResult(details.getAnalysisResult());
            return videoAnalysisRepository.save(va);
        }).orElseThrow(() -> new RuntimeException("VideoAnalysis not found with id " + videoId));
    }

    public void deleteVideoAnalysis(String videoId) {
        videoAnalysisRepository.deleteById(videoId);
    }

    public List<VideoAnalysis> findByLearnerId(String learnerId) {
        return videoAnalysisRepository.findByLearnerUserId(learnerId);
    }

    public List<VideoAnalysis> findByMovement(String movement) {
        return videoAnalysisRepository.findByClassifiedMovementsContaining(movement);
    }
}
