package com.pickle.backend.controller;

import com.pickle.backend.dto.DebtDTO;
import com.pickle.backend.dto.DebtDetailDTO;
import com.pickle.backend.entity.Debt;
import com.pickle.backend.service.DebtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @PostMapping
    public ResponseEntity<Debt> createDebt(@RequestBody DebtDTO debtDTO) {
        Debt createdDebt = debtService.createDebt(debtDTO);
        return ResponseEntity.ok(createdDebt);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Debt> getDebtById(@PathVariable Long id) {
        Debt debt = debtService.getDebtById(id);
        return ResponseEntity.ok(debt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Debt> updateDebt(@PathVariable Long id, @RequestBody DebtDTO debtDTO) {
        Debt updatedDebt = debtService.updateDebt(id, debtDTO);
        return ResponseEntity.ok(updatedDebt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.deleteDebt(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Debt>> getAllDebts() {
        List<Debt> debts = debtService.getAllDebts();
        return ResponseEntity.ok(debts);
    }
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<DebtDetailDTO>> getDebtsByLearner(@PathVariable String learnerId) {
        List<DebtDetailDTO> debts = debtService.getDebtsByLearnerId(learnerId);
        return ResponseEntity.ok(debts);
    }

}
