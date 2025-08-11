package com.pickle.backend.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class S3Util {
    private static final String UPLOAD_DIR = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/uploads/";

    public String uploadFile(MultipartFile file) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File dest = new File(UPLOAD_DIR + fileName);
            file.transferTo(dest);
            return dest.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file locally", e);
        }
    }
}