package com.pickle.backend.service;

import com.pickle.backend.entity.Coach;
import com.pickle.backend.repository.CoachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    public Optional<Coach> getCoachById(String id) {
        return coachRepository.findById(id);
    }

    public Coach createCoach(Coach coach) {
        return coachRepository.save(coach);
    }

    public Coach updateCoach(String id, Coach coachDetails) {
        return coachRepository.findById(id).map(coach -> {
            coach.setCertifications(coachDetails.getCertifications());
            coach.setAvailability(coachDetails.getAvailability());
            coach.setSpecialties(coachDetails.getSpecialties());
            return coachRepository.save(coach);
        }).orElseThrow(() -> new RuntimeException("Coach not found with id " + id));
    }

    public void deleteCoach(String id) {
        coachRepository.deleteById(id);
    }

    public List<Coach> findBySpecialty(String specialty) {
        return coachRepository.findBySpecialtiesContaining(specialty);
    }

    public List<Coach> findByCertification(String certification) {
        return coachRepository.findByCertificationsContaining(certification);
    }
}
