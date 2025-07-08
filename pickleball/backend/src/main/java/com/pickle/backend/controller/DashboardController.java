package com.pickle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.pickle.backend.repository.SessionRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/bookings/stats")
    public List<Map<String, Object>> getBookingStats(@RequestParam String groupBy) {
        List<Object[]> results;
        switch (groupBy.toLowerCase()) {
            case "day":
                results = sessionRepository.getBookingStatsByDay();
                break;
            case "month":
                results = sessionRepository.getBookingStatsByMonth();
                break;
            case "year":
                results = sessionRepository.getBookingStatsByYear();
                break;
            default:
                throw new IllegalArgumentException("Invalid groupBy parameter: " + groupBy);
        }

        // Chuyển đổi kết quả thành định dạng JSON
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]); // booking_date, booking_month, hoặc booking_year
            map.put("count", row[1]);
            stats.add(map);
        }
        return stats;
    }
}