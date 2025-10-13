package com.coreops.hub.controller;

import com.coreops.hub.model.TestRun;
import com.coreops.hub.service.TestRunService;
import com.coreops.hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-runs")
public class TestRunController {

    @Autowired
    private TestRunService testRunService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<TestRun>> getAllTestRuns() {
        return ResponseEntity.ok(testRunService.getAllTestRuns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestRun> getTestRunById(@PathVariable Long id) {
        return testRunService.getTestRunById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TestRun> createTestRun(@RequestBody TestRun testRun, Authentication auth) {
        String username = auth.getName();
        Long userId = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getId();
        return ResponseEntity.ok(testRunService.createTestRun(testRun, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestRun> updateTestRun(@PathVariable Long id, @RequestBody TestRun testRun) {
        return ResponseEntity.ok(testRunService.updateTestRun(id, testRun));
    }
}
