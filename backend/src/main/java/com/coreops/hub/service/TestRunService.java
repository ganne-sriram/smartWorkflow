package com.coreops.hub.service;

import com.coreops.hub.model.TestRun;
import com.coreops.hub.repository.TestRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TestRunService {
    
    @Autowired
    private TestRunRepository testRunRepository;
    
    public TestRun createTestRun(TestRun testRun, String userId) {
        testRun.setUserId(userId);
        testRun.setStartedAt(Instant.now());
        return testRunRepository.save(testRun);
    }
    
    public Optional<TestRun> getTestRunById(String id) {
        return testRunRepository.findById(id);
    }
    
    public List<TestRun> getAllTestRuns() {
        return testRunRepository.findAll();
    }
    
    public TestRun updateTestRun(String id, TestRun testRun) {
        TestRun existing = testRunRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TestRun not found"));
        
        existing.setCurrentStageIndex(testRun.getCurrentStageIndex());
        existing.setStages(testRun.getStages());
        
        if (testRun.getSubmittedAt() != null) {
            existing.setSubmittedAt(testRun.getSubmittedAt());
        }
        
        return testRunRepository.save(existing);
    }
}
