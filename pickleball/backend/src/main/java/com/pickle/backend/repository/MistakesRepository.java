package com.pickle.backend.repository;

import com.pickle.backend.entity.Mistakes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MistakesRepository extends JpaRepository<Mistakes, Integer> {
}
