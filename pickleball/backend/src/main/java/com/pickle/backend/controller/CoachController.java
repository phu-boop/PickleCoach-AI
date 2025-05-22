package com.pickle.backend.controller;

import com.pickle.backend.entity.Coach;
import com.pickle.backend.repository.CoachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachRepository coachRepository;

    // Lấy tất cả coach
    @GetMapping
    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    // Lấy coach theo id
    @GetMapping("/{id}")
    public Optional<Coach> getCoachById(@PathVariable String id) {
        return coachRepository.findById(id);
    }

    // Tạo mới coach
    @PostMapping
    public Coach createCoach(@RequestBody Coach coach) {
        return coachRepository.save(coach);
    }

    // Cập nhật coach
    @PutMapping("/{id}")
    public Coach updateCoach(@PathVariable String id, @RequestBody Coach coachDetails) {
        return coachRepository.findById(id).map(coach -> {
            coach.setCertifications(coachDetails.getCertifications());
            coach.setAvailability(coachDetails.getAvailability());
            coach.setSpecialties(coachDetails.getSpecialties());
            return coachRepository.save(coach);
        }).orElseThrow(() -> new RuntimeException("Coach not found with id " + id));
    }

    // Xóa coach
    @DeleteMapping("/{id}")
    public void deleteCoach(@PathVariable String id) {
        coachRepository.deleteById(id);
    }

    // Tìm coach theo chuyên môn
    @GetMapping("/specialty/{specialty}")
    public List<Coach> findBySpecialty(@PathVariable String specialty) {
        return coachRepository.findBySpecialtiesContaining(specialty);
    }

    // Tìm coach theo chứng chỉ
    @GetMapping("/certification/{certification}")
    public List<Coach> findByCertification(@PathVariable String certification) {
        return coachRepository.findByCertificationsContaining(certification);
    }
}
