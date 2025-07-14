package com.pickle.backend.repository;

import com.pickle.backend.entity.test.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    public Optional<Option> findById(Long id);
}