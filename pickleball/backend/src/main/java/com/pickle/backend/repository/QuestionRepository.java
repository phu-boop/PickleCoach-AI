package com.pickle.backend.repository;

import com.pickle.backend.entity.test.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Lấy danh sách câu hỏi ngẫu nhiên (dùng LIMIT và ORDER BY RAND() trong SQL)
    @Query(value = "SELECT * FROM question ORDER BY RAND()", nativeQuery = true)
    List<Question> findRandomQuestions(Pageable pageable);

    // Không cần override findById!
}
