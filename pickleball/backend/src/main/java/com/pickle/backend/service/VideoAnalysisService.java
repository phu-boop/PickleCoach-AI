package com.pickle.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.VideoAnalysisRepository;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Service 
public class VideoAnalysisService {
    private static final Logger logger = LoggerFactory.getLogger(VideoAnalysisService.class);

    @Autowired
    private VideoAnalysisRepository videoAnalysisRepository;

    @Autowired
    private LearnerService learnerService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<VideoAnalysis> getAllVideoAnalyses() {
        logger.info("Fetching all video analyses");
        return videoAnalysisRepository.findAll();
    }

    public Optional<VideoAnalysis> getVideoAnalysisById(String videoId) {
        logger.info("Fetching video analysis with id: {}", videoId);
        return videoAnalysisRepository.findById(videoId);
    }

    public VideoAnalysis createVideoAnalysis(VideoAnalysis videoAnalysis) {
        logger.info("Creating video analysis for learner: {}", videoAnalysis.getLearner().getUserId());
        validateJson(videoAnalysis.getPoseData());
        videoAnalysis.setVideoId(UUID.randomUUID().toString());
        return videoAnalysisRepository.save(videoAnalysis);
    }

    public VideoAnalysis updateVideoAnalysis(String videoId, VideoAnalysis details) {
        logger.info("Updating video analysis with id: {}", videoId);
        validateJson(details.getPoseData());
        return videoAnalysisRepository.findById(videoId).map(va -> {
            va.setLearner(details.getLearner());
            va.setPoseData(details.getPoseData());
            va.setClassifiedMovements(details.getClassifiedMovements());
            va.setAnalysisResult(details.getAnalysisResult());
            return videoAnalysisRepository.save(va);
        }).orElseThrow(() -> new ResourceNotFoundException("VideoAnalysis not found with id " + videoId));
    }

    public void deleteVideoAnalysis(String videoId) {
        logger.info("Deleting video analysis with id: {}", videoId);
        if (!videoAnalysisRepository.existsById(videoId)) {
            logger.warn("VideoAnalysis with id {} not found", videoId);
            throw new ResourceNotFoundException("VideoAnalysis not found with id " + videoId);
        }
        videoAnalysisRepository.deleteById(videoId);
    }

    public List<VideoAnalysis> findByLearnerId(String learnerId) {
        logger.info("Fetching video analyses for learner with id: {}", learnerId);
        return videoAnalysisRepository.findByLearnerUserId(learnerId);
    }

    public List<VideoAnalysis> findByMovement(String movement) {
        logger.info("Fetching video analyses with movement: {}", movement);
        return videoAnalysisRepository.findByClassifiedMovementsContaining(movement);
    }

    private void validateJson(String json) {
        try {
            objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            logger.warn("Invalid JSON format for poseData: {}", json);
            throw new IllegalArgumentException("Invalid JSON format for poseData");
        }
    }
}