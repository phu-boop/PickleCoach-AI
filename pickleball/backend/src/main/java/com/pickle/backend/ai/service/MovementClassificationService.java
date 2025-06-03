package com.pickle.backend.ai.service;

import com.pickle.backend.ai.model.MovementClassification;
import com.pickle.backend.ai.repository.MovementClassificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MovementClassificationService {
    private final MovementClassificationRepository repository;

    public MovementClassification classifyMovement(String userId, String videoUrl) {
        // Tạm thời trả về giá trị giả lập vì endpoint /movement-classification chưa có
        MovementClassification classification = new MovementClassification();
        classification.setUserId(userId);
        classification.setVideoUrl(videoUrl);
        classification.setLabel("forehand");
        return repository.save(classification);
    }
}