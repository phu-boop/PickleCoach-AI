package com.pickle.backend.controller;

import com.pickle.backend.dto.MistakesRequest;
import com.pickle.backend.entity.Mistakes;
import com.pickle.backend.service.MistakesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mistakes")
public class MistakesController {

    private final MistakesService mistakesService;

    public MistakesController(MistakesService mistakesService) {
        this.mistakesService = mistakesService;
    }

    // Tạo một bản ghi lỗi mới bằng dữ liệu yêu cầu được cung cấp và trả về bản ghi lỗi đã tạo
    @PostMapping
    public ResponseEntity<Mistakes> createMistake(@RequestBody MistakesRequest request) {
        System.out.println("ok bạn");
        Mistakes mistake = mistakesService.createMistake(
            request.getTitle(),
            request.getDescription(),
            request.getStatus(),
            request.getUserId()
        );
        return ResponseEntity.ok(mistake);
    }

    // Lấy danh sách tất cả các bản ghi lỗi
    @GetMapping
    public ResponseEntity<List<Mistakes>> getAllMistakes() {
        return ResponseEntity.ok(mistakesService.getAllMistakes());
    }

    // Lấy một bản ghi lỗi cụ thể theo ID, trả về mã 404 nếu không tìm thấy
    @GetMapping("/{id}")
    public ResponseEntity<Mistakes> getMistakeById(@PathVariable int id) {
        Optional<Mistakes> mistake = mistakesService.getMistakeById(id);
        return mistake.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cập nhật một bản ghi lỗi hiện có bằng ID(id mistakes) và dữ liệu yêu cầu được cung cấp, trả về bản ghi lỗi đã cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<Mistakes> updateMistake(@PathVariable int id, @RequestBody MistakesRequest request) {
        Mistakes updatedMistake = mistakesService.updateMistake(
            id,
            request.getTitle(),
            request.getDescription(),
            request.getStatus(),
            request.getUserId()
        );
        return ResponseEntity.ok(updatedMistake);
    }

    // Xóa một bản ghi lỗi theo ID và trả về phản hồi không có nội dung
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable int id) {
        mistakesService.deleteMistake(id);
        return ResponseEntity.noContent().build();
    }
}