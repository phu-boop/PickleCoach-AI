package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
}
