package com.pickle.backend.ai.repository;

import com.pickle.backend.ai.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByTagsContaining(String tag);
}