package com.pickle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pickle.backend.entity.test.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
}
