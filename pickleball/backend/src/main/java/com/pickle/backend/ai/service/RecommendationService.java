package com.pickle.backend.ai.service;

import com.pickle.backend.ai.model.Content;
import com.pickle.backend.ai.repository.ContentRepository;
import com.pickle.backend.entity.User;
import com.pickle.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;

    public List<Content> getRecommendations(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Content> recommendations = new ArrayList<>();

        if (user.getSkillLevel() != null) {
            recommendations.addAll(contentRepository.findByTagsContaining(user.getSkillLevel()));
        }
        if (user.getPreferences() != null) {
            for (String pref : user.getPreferences().split(",")) {
                recommendations.addAll(contentRepository.findByTagsContaining(pref.trim()));
            }
        }
        return recommendations;
    }
}