package com.pickle.backend.service;

import com.pickle.backend.entity.Mistakes;
import com.pickle.backend.entity.User;
import com.pickle.backend.repository.MistakesRepository;
import com.pickle.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MistakesService {

    private final MistakesRepository mistakesRepository;
    private final UserRepository userRepository;

    public MistakesService(MistakesRepository mistakesRepository, UserRepository userRepository) {
        this.mistakesRepository = mistakesRepository;
        this.userRepository = userRepository;
    }

    public Mistakes createMistake(String title, String description, Mistakes.Status status, String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Mistakes mistake = new Mistakes(title, description, status, user.get());
        return mistakesRepository.save(mistake);
    }

    public List<Mistakes> getAllMistakes() {
        return mistakesRepository.findAll();
    }

    public Optional<Mistakes> getMistakeById(int id) {
        return mistakesRepository.findById(id);
    }

    public Mistakes updateMistake(int id, String title, String description, Mistakes.Status status, String userId) {
        Optional<Mistakes> existingMistake = mistakesRepository.findById(id);
        if (existingMistake.isEmpty()) {
            throw new RuntimeException("Mistake not found");
        }
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Mistakes mistake = existingMistake.get();
        mistake.setTitle(title);
        mistake.setDescription(description);
        mistake.setStatus(status);
        mistake.setUser(user.get());
        return mistakesRepository.save(mistake);
    }

    public void deleteMistake(int id) {
        if (!mistakesRepository.existsById(id)) {
            throw new RuntimeException("Mistake not found");
        }
        mistakesRepository.deleteById(id);
    }
}