package com.pickle.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import com.pickle.backend.config.TestMailConfig; // import config mock mail

@SpringBootTest
@ActiveProfiles("test")
@Import(TestMailConfig.class) // thêm dòng này
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}